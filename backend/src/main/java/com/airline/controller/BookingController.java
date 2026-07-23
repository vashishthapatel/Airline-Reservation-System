package com.airline.controller;

import com.airline.dto.ApiResponse;
import com.airline.dto.BookingRequest;
import com.airline.dto.BookingResponse;
import com.airline.repository.UserRepository;
import com.airline.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @RequestBody BookingRequest request,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        BookingResponse booking = bookingService.createBooking(request, userId);
        return ResponseEntity.ok(ApiResponse.success("Booking created successfully", booking));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings(Authentication authentication) {
        Long userId = getUserId(authentication);
        return ResponseEntity.ok(ApiResponse.success("Success", bookingService.getUserBookings(userId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(
            @PathVariable Long id,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        return ResponseEntity.ok(ApiResponse.success("Success", bookingService.getBookingById(id, userId)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> cancelBooking(
            @PathVariable Long id,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        bookingService.cancelBooking(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", null));
    }

    private Long getUserId(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }
}
