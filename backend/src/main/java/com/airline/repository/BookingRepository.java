package com.airline.repository;

import com.airline.entity.Booking;
import com.airline.entity.BookingStatus;
import com.airline.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);
    List<Booking> findByUserId(Long userId);
    Optional<Booking> findByBookingReference(String bookingReference);

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b WHERE b.status = 'CONFIRMED'")
    BigDecimal getTotalRevenue();

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = 'CONFIRMED' AND CAST(b.createdAt AS date) = CURRENT_DATE")
    Long countTodayBookings();

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b WHERE b.status = 'CONFIRMED' AND CAST(b.createdAt AS date) = CURRENT_DATE")
    BigDecimal getTodayRevenue();

    long countByStatus(BookingStatus status);
}
