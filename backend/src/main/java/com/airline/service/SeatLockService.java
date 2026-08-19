package com.airline.service;

import com.airline.dto.SeatLockResponse;
import com.airline.entity.Seat;
import com.airline.entity.SeatStatus;
import com.airline.exception.BadRequestException;
import com.airline.exception.ResourceNotFoundException;
import com.airline.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class SeatLockService {

    private static final String KEY_PREFIX = "seat-lock:";

    private final SeatRepository seatRepository;
    private final ObjectProvider<StringRedisTemplate> redisTemplateProvider;
    private final Map<Long, LocalSeatLock> localLocks = new ConcurrentHashMap<>();

    @Value("${app.seat-lock.ttl-minutes:5}")
    private int ttlMinutes;

    @Transactional
    public SeatLockResponse lockSeats(Long flightId, List<Long> seatIds, Long userId) {
        if (seatIds == null || seatIds.isEmpty()) {
            throw new BadRequestException("Select at least one seat");
        }

        List<Long> acquired = new ArrayList<>();
        try {
            for (Long seatId : seatIds) {
                Seat seat = seatRepository.findByIdForUpdate(seatId)
                        .orElseThrow(() -> new ResourceNotFoundException("Seat not found: " + seatId));
                if (!seat.getFlight().getId().equals(flightId)) {
                    throw new BadRequestException("Seat " + seat.getSeatNumber() + " does not belong to this flight");
                }
                if (seat.getStatus() != SeatStatus.AVAILABLE) {
                    throw new BadRequestException("Seat " + seat.getSeatNumber() + " is not available");
                }
                if (!tryAcquireLock(seatId, userId)) {
                    throw new BadRequestException("Seat " + seat.getSeatNumber() + " is already locked by another user");
                }
                acquired.add(seatId);
            }
        } catch (RuntimeException ex) {
            releaseSeats(acquired, userId);
            throw ex;
        }

        return new SeatLockResponse(seatIds, ttlSeconds());
    }

    public void releaseSeats(List<Long> seatIds, Long userId) {
        if (seatIds == null || seatIds.isEmpty()) {
            return;
        }
        for (Long seatId : seatIds) {
            releaseSeat(seatId, userId);
        }
    }

    public boolean isLocked(Long seatId) {
        Long ownerId = getLockOwner(seatId);
        return ownerId != null;
    }

    public Long getLockTtlSeconds(Long seatId) {
        Long redisTtl = getRedisTtlSeconds(seatId);
        if (redisTtl != null && redisTtl > 0) {
            return redisTtl;
        }

        LocalSeatLock localLock = getValidLocalLock(seatId);
        if (localLock == null) {
            return null;
        }
        long seconds = Duration.between(Instant.now(), localLock.expiresAt()).toSeconds();
        return Math.max(1, seconds);
    }

    public void requireLocksOwnedBy(Long flightId, List<Long> seatIds, Long userId) {
        if (seatIds == null || seatIds.isEmpty()) {
            throw new BadRequestException("Select at least one seat");
        }
        for (Long seatId : seatIds) {
            Seat seat = seatRepository.findById(seatId)
                    .orElseThrow(() -> new ResourceNotFoundException("Seat not found: " + seatId));
            if (!seat.getFlight().getId().equals(flightId)) {
                throw new BadRequestException("Seat " + seat.getSeatNumber() + " does not belong to this flight");
            }
            if (!Objects.equals(getLockOwner(seatId), userId)) {
                throw new BadRequestException("Seat " + seat.getSeatNumber() + " lock expired or belongs to another user");
            }
        }
    }

    public void consumeLocks(List<Long> seatIds, Long userId) {
        releaseSeats(seatIds, userId);
    }

    private boolean tryAcquireLock(Long seatId, Long userId) {
        Boolean redisResult = tryAcquireRedisLock(seatId, userId);
        if (redisResult != null) {
            return redisResult;
        }
        return tryAcquireLocalLock(seatId, userId);
    }

    private Boolean tryAcquireRedisLock(Long seatId, Long userId) {
        StringRedisTemplate redisTemplate = redisTemplateProvider.getIfAvailable();
        if (redisTemplate == null) {
            return null;
        }

        try {
            String key = key(seatId);
            String value = String.valueOf(userId);
            String currentOwner = redisTemplate.opsForValue().get(key);
            if (value.equals(currentOwner)) {
                redisTemplate.expire(key, Duration.ofMinutes(ttlMinutes));
                return true;
            }
            Boolean created = redisTemplate.opsForValue().setIfAbsent(key, value, Duration.ofMinutes(ttlMinutes));
            return Boolean.TRUE.equals(created);
        } catch (RedisConnectionFailureException ex) {
            return null;
        } catch (RuntimeException ex) {
            return null;
        }
    }

    private boolean tryAcquireLocalLock(Long seatId, Long userId) {
        Instant now = Instant.now();
        Instant expiresAt = now.plus(Duration.ofMinutes(ttlMinutes));
        LocalSeatLock result = localLocks.compute(seatId, (id, existing) -> {
            if (existing == null || existing.expiresAt().isBefore(now) || existing.userId().equals(userId)) {
                return new LocalSeatLock(userId, expiresAt);
            }
            return existing;
        });
        return result != null && result.userId().equals(userId);
    }

    private Long getLockOwner(Long seatId) {
        Long redisOwner = getRedisLockOwner(seatId);
        if (redisOwner != null) {
            return redisOwner;
        }

        LocalSeatLock localLock = getValidLocalLock(seatId);
        return localLock == null ? null : localLock.userId();
    }

    private Long getRedisLockOwner(Long seatId) {
        StringRedisTemplate redisTemplate = redisTemplateProvider.getIfAvailable();
        if (redisTemplate == null) {
            return null;
        }

        try {
            String value = redisTemplate.opsForValue().get(key(seatId));
            return value == null ? null : Long.valueOf(value);
        } catch (RuntimeException ex) {
            return null;
        }
    }

    private Long getRedisTtlSeconds(Long seatId) {
        StringRedisTemplate redisTemplate = redisTemplateProvider.getIfAvailable();
        if (redisTemplate == null) {
            return null;
        }

        try {
            return redisTemplate.getExpire(key(seatId));
        } catch (RuntimeException ex) {
            return null;
        }
    }

    private LocalSeatLock getValidLocalLock(Long seatId) {
        LocalSeatLock localLock = localLocks.get(seatId);
        if (localLock == null) {
            return null;
        }
        if (localLock.expiresAt().isBefore(Instant.now())) {
            localLocks.remove(seatId, localLock);
            return null;
        }
        return localLock;
    }

    private void releaseSeat(Long seatId, Long userId) {
        releaseRedisSeat(seatId, userId);
        localLocks.computeIfPresent(seatId, (id, existing) -> existing.userId().equals(userId) ? null : existing);
    }

    private void releaseRedisSeat(Long seatId, Long userId) {
        StringRedisTemplate redisTemplate = redisTemplateProvider.getIfAvailable();
        if (redisTemplate == null) {
            return;
        }

        try {
            String key = key(seatId);
            if (String.valueOf(userId).equals(redisTemplate.opsForValue().get(key))) {
                redisTemplate.delete(key);
            }
        } catch (RuntimeException ignored) {
        }
    }

    private int ttlSeconds() {
        return Math.max(1, ttlMinutes * 60);
    }

    private String key(Long seatId) {
        return KEY_PREFIX + seatId;
    }

    private record LocalSeatLock(Long userId, Instant expiresAt) {
    }
}
