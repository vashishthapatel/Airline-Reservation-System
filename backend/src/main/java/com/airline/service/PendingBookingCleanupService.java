package com.airline.service;

import com.airline.entity.Booking;
import com.airline.entity.BookingStatus;
import com.airline.entity.Flight;
import com.airline.entity.Passenger;
import com.airline.entity.Seat;
import com.airline.entity.SeatStatus;
import com.airline.repository.BookingRepository;
import com.airline.repository.FlightRepository;
import com.airline.repository.PassengerRepository;
import com.airline.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PendingBookingCleanupService {

    private final BookingRepository bookingRepository;
    private final PassengerRepository passengerRepository;
    private final SeatRepository seatRepository;
    private final FlightRepository flightRepository;

    @Value("${app.seat-lock.ttl-minutes:5}")
    private int ttlMinutes;

    @Scheduled(fixedDelayString = "${app.seat-lock.cleanup-delay-ms:60000}")
    @Transactional
    public void releaseExpiredPendingBookings() {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(ttlMinutes);
        List<Booking> expiredBookings = bookingRepository.findByStatusAndCreatedAtBefore(BookingStatus.PENDING, cutoff);
        for (Booking booking : expiredBookings) {
            List<Passenger> passengers = passengerRepository.findByBookingId(booking.getId());
            int releasedSeats = 0;
            for (Passenger passenger : passengers) {
                if (passenger.getSeat() != null) {
                    Seat seat = passenger.getSeat();
                    if (seat.getStatus() == SeatStatus.LOCKED) {
                        seat.setStatus(SeatStatus.AVAILABLE);
                        seatRepository.save(seat);
                        releasedSeats++;
                    }
                }
            }

            if (releasedSeats > 0) {
                Flight flight = booking.getFlight();
                flight.setAvailableSeats(flight.getAvailableSeats() + releasedSeats);
                flightRepository.save(flight);
            }

            booking.setStatus(BookingStatus.CANCELLED);
            bookingRepository.save(booking);
            log.info("Released {} seat(s) for expired pending booking {}", releasedSeats, booking.getBookingReference());
        }
    }
}
