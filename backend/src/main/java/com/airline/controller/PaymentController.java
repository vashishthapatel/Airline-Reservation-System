package com.airline.controller;

import com.airline.dto.ApiResponse;
import com.airline.dto.PaymentRequest;
import com.airline.dto.PaymentResponse;
import com.airline.repository.UserRepository;
import com.airline.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final UserRepository userRepository;

    @PostMapping("/process")
    public ResponseEntity<ApiResponse<PaymentResponse>> processPayment(
            @RequestBody PaymentRequest request,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        PaymentResponse payment = paymentService.processPayment(request, userId);
        return ResponseEntity.ok(ApiResponse.success("Payment processed", payment));
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentByBookingId(@PathVariable Long bookingId) {
        return ResponseEntity.ok(ApiResponse.success("Success", paymentService.getPaymentByBookingId(bookingId)));
    }

    private Long getUserId(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }
}
