package com.airline.service;

import com.airline.dto.BookingRequest;
import com.airline.dto.BookingResponse;
import com.airline.dto.PassengerRequest;
import com.airline.dto.PassengerResponse;
import com.airline.entity.*;
import com.airline.exception.BadRequestException;
import com.airline.exception.ResourceNotFoundException;
import com.airline.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final FlightRepository flightRepository;
    private final UserRepository userRepository;
    private final SeatRepository seatRepository;
    private final PassengerRepository passengerRepository;
    private final PaymentRepository paymentRepository;
    private final SeatLockService seatLockService;

    @Transactional
    public BookingResponse createBooking(BookingRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Flight flight = flightRepository.findById(request.getFlightId())
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found"));
        seatLockService.requireLocksOwnedBy(request.getFlightId(), request.getSelectedSeatIds(), userId);

        // Get and validate seats
        List<Seat> selectedSeats = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (Long seatId : request.getSelectedSeatIds()) {
            Seat seat = seatRepository.findByIdForUpdate(seatId)
                    .orElseThrow(() -> new ResourceNotFoundException("Seat not found: " + seatId));
            if (seat.getStatus() != SeatStatus.AVAILABLE) {
                throw new BadRequestException("Seat " + seat.getSeatNumber() + " is not available");
            }
            seat.setStatus(SeatStatus.LOCKED);
            seatRepository.save(seat);
            selectedSeats.add(seat);
            totalAmount = totalAmount.add(seat.getPrice());
        }

        // Create booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setFlight(flight);
        booking.setTotalAmount(totalAmount);
        booking.setStatus(BookingStatus.PENDING);
        booking = bookingRepository.save(booking);

        // Update available seats
        flight.setAvailableSeats(flight.getAvailableSeats() - selectedSeats.size());
        flightRepository.save(flight);

        // Create passengers
        List<Passenger> passengers = new ArrayList<>();
        List<PassengerRequest> passengerRequests = request.getPassengerRequests();
        for (int i = 0; i < passengerRequests.size(); i++) {
            PassengerRequest pr = passengerRequests.get(i);
            Passenger passenger = new Passenger();
            passenger.setBooking(booking);
            passenger.setFullName(pr.getFullName());
            passenger.setGender(Gender.valueOf(pr.getGender().toUpperCase()));
            passenger.setAge(pr.getAge());
            passenger.setNationality(pr.getNationality());
            passenger.setPassportNumber(pr.getPassportNumber());
            if (i < selectedSeats.size()) {
                passenger.setSeat(selectedSeats.get(i));
            }
            passengers.add(passenger);
        }
        passengerRepository.saveAll(passengers);
        seatLockService.consumeLocks(request.getSelectedSeatIds(), userId);

        return toBookingResponse(booking, passengers);
    }

    public List<BookingResponse> getUserBookings(Long userId) {
        List<Booking> bookings = bookingRepository.findByUserId(userId);
        return bookings.stream()
                .map(b -> {
                    List<Passenger> passengers = passengerRepository.findByBookingId(b.getId());
                    return toBookingResponse(b, passengers);
                })
                .collect(Collectors.toList());
    }

    public BookingResponse getBookingById(Long id, Long userId) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getUser().getId().equals(userId)) {
            throw new BadRequestException("Access denied");
        }

        List<Passenger> passengers = passengerRepository.findByBookingId(id);
        return toBookingResponse(booking, passengers);
    }

    @Transactional
    public void cancelBooking(Long id, Long userId) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getUser().getId().equals(userId)) {
            throw new BadRequestException("Access denied");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }

        // Release seats
        List<Passenger> passengers = passengerRepository.findByBookingId(id);
        for (Passenger passenger : passengers) {
            if (passenger.getSeat() != null) {
                Seat seat = passenger.getSeat();
                seat.setStatus(SeatStatus.AVAILABLE);
                seatRepository.save(seat);
            }
        }

        // Restore available seat count
        Flight flight = booking.getFlight();
        flight.setAvailableSeats(flight.getAvailableSeats() + passengers.size());
        flightRepository.save(flight);

        // Update booking
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        // Update payment if exists
        paymentRepository.findByBookingId(id).ifPresent(payment -> {
            payment.setStatus(PaymentStatus.REFUNDED);
            paymentRepository.save(payment);
        });
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(b -> {
                    List<Passenger> passengers = passengerRepository.findByBookingId(b.getId());
                    return toBookingResponse(b, passengers);
                })
                .collect(Collectors.toList());
    }

    private BookingResponse toBookingResponse(Booking booking, List<Passenger> passengers) {
        List<PassengerResponse> passengerResponses = passengers.stream()
                .map(p -> new PassengerResponse(
                        p.getId(),
                        p.getFullName(),
                        p.getGender().name(),
                        p.getAge(),
                        p.getNationality(),
                        p.getSeat() != null ? p.getSeat().getSeatNumber() : "N/A",
                        p.getSeat() != null ? p.getSeat().getSeatClass().name() : "N/A"
                ))
                .collect(Collectors.toList());

        Flight flight = booking.getFlight();
        com.airline.dto.FlightResponse flightResponse = new com.airline.dto.FlightResponse();
        flightResponse.setId(flight.getId());
        flightResponse.setFlightNumber(flight.getFlightNumber());
        flightResponse.setOrigin(flight.getOriginAirport().getName());
        flightResponse.setDestination(flight.getDestinationAirport().getName());
        flightResponse.setOriginCode(flight.getOriginAirport().getIataCode());
        flightResponse.setDestinationCode(flight.getDestinationAirport().getIataCode());
        flightResponse.setOriginCity(flight.getOriginAirport().getCity());
        flightResponse.setDestinationCity(flight.getDestinationAirport().getCity());
        flightResponse.setDepartureTime(flight.getDepartureTime());
        flightResponse.setArrivalTime(flight.getArrivalTime());
        flightResponse.setBasePrice(flight.getBasePrice());
        flightResponse.setAvailableSeats(flight.getAvailableSeats());
        flightResponse.setStatus(flight.getStatus().name());
        flightResponse.setAircraftModel(flight.getAircraft().getModel());
        flightResponse.setDurationMinutes(java.time.Duration.between(flight.getDepartureTime(), flight.getArrivalTime()).toMinutes());

        return new BookingResponse(
                booking.getId(),
                booking.getBookingReference(),
                flightResponse,
                passengers.size(),
                booking.getTotalAmount(),
                booking.getStatus().name(),
                booking.getCreatedAt(),
                passengerResponses,
                booking.getUser().getName(),
                booking.getUser().getEmail()
        );
    }
}
