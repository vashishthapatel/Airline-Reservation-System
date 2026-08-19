package com.airline.controller;

import com.airline.dto.ApiResponse;
import com.airline.dto.SeatLockRequest;
import com.airline.dto.SeatLockResponse;
import com.airline.entity.User;
import com.airline.exception.ResourceNotFoundException;
import com.airline.repository.UserRepository;
import com.airline.service.SeatLockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/seats/locks")
@RequiredArgsConstructor
public class SeatLockController {

    private final SeatLockService seatLockService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<SeatLockResponse>> lockSeats(
            @RequestBody SeatLockRequest request,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        SeatLockResponse response = seatLockService.lockSeats(request.getFlightId(), request.getSeatIds(), userId);
        return ResponseEntity.ok(ApiResponse.success("Seat locked for " + response.getExpiresInSeconds() + " seconds", response));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> releaseSeats(
            @RequestBody SeatLockRequest request,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        seatLockService.releaseSeats(request.getSeatIds(), userId);
        return ResponseEntity.ok(ApiResponse.success("Seat lock released", null));
    }

    private Long getUserId(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return user.getId();
    }
}
