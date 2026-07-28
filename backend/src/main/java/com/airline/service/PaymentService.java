package com.airline.service;

import com.airline.dto.PaymentRequest;
import com.airline.dto.PaymentResponse;
import com.airline.entity.*;
import com.airline.exception.BadRequestException;
import com.airline.exception.ResourceNotFoundException;
import com.airline.repository.BookingRepository;
import com.airline.repository.PassengerRepository;
import com.airline.repository.PaymentRepository;
import com.airline.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final PassengerRepository passengerRepository;
    private final SeatRepository seatRepository;

    @Transactional
    public PaymentResponse processPayment(PaymentRequest request, Long userId) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getUser().getId().equals(userId)) {
            throw new BadRequestException("Access denied");
        }

        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            throw new BadRequestException("Booking already paid");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Cannot pay for a cancelled booking");
        }

        PaymentMethod method = PaymentMethod.valueOf(request.getMethod().toUpperCase());

        // Simulate payment: UPI with "fail" in ID will fail
        boolean paymentSuccess = true;
        if (method == PaymentMethod.UPI && request.getUpiId() != null && request.getUpiId().contains("fail")) {
            paymentSuccess = false;
        }

        String transactionId = "TXN" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();

        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setAmount(booking.getTotalAmount());
        payment.setMethod(method);
        payment.setTransactionId(transactionId);
        payment.setPaidAt(LocalDateTime.now());

        if (paymentSuccess) {
            payment.setStatus(PaymentStatus.SUCCESS);
            booking.setStatus(BookingStatus.CONFIRMED);
            bookingRepository.save(booking);

            // Update seat status from LOCKED to BOOKED
            List<Passenger> passengers = passengerRepository.findByBookingId(booking.getId());
            for (Passenger passenger : passengers) {
                if (passenger.getSeat() != null) {
                    Seat seat = passenger.getSeat();
                    seat.setStatus(SeatStatus.BOOKED);
                    seatRepository.save(seat);
                }
            }
        } else {
            payment.setStatus(PaymentStatus.FAILED);
        }

        payment = paymentRepository.save(payment);

        return new PaymentResponse(
                payment.getId(),
                payment.getTransactionId(),
                payment.getAmount(),
                payment.getMethod().name(),
                payment.getStatus().name(),
                payment.getPaidAt(),
                booking.getBookingReference()
        );
    }

    public PaymentResponse getPaymentByBookingId(Long bookingId, Long userId) {
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for booking: " + bookingId));

        if (!payment.getBooking().getUser().getId().equals(userId)) {
            throw new BadRequestException("Access denied");
        }

        return new PaymentResponse(
                payment.getId(),
                payment.getTransactionId(),
                payment.getAmount(),
                payment.getMethod().name(),
                payment.getStatus().name(),
                payment.getPaidAt(),
                payment.getBooking().getBookingReference()
        );
    }
}
