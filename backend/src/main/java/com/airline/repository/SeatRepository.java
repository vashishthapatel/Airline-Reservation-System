package com.airline.repository;

import com.airline.entity.Seat;
import com.airline.entity.SeatClass;
import com.airline.entity.SeatStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByFlightId(Long flightId);
    List<Seat> findByFlightIdAndStatus(Long flightId, SeatStatus status);
    List<Seat> findByFlightIdAndSeatClass(Long flightId, SeatClass seatClass);
    long countByFlightIdAndStatus(Long flightId, SeatStatus status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s from Seat s where s.id = :id")
    Optional<Seat> findByIdForUpdate(Long id);
}
