package com.airline.controller;

import com.airline.dto.ApiResponse;
import com.airline.dto.AuthResponse;
import com.airline.dto.LoginRequest;
import com.airline.dto.RegisterRequest;
import com.airline.entity.User;
import com.airline.repository.UserRepository;
import com.airline.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @Value("${app.google-auth.enabled:false}")
    private boolean googleAuthEnabled;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.success("Registration successful", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @GetMapping("/google/config")
    public ResponseEntity<ApiResponse<Boolean>> googleConfig() {
        return ResponseEntity.ok(ApiResponse.success("Success", googleAuthEnabled));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse>> currentUser(Authentication authentication) {
        String email = resolveEmail(authentication);
        if (email == null || email.isBlank()) {
            return ResponseEntity.status(401).body(ApiResponse.error("Not authenticated"));
        }
        return userRepository.findByEmail(email.trim().toLowerCase())
                .map(user -> {
                    AuthResponse response = new AuthResponse(null, user.getRole().name(), user.getName(), user.getEmail(), user.getId());
                    return ResponseEntity.ok(ApiResponse.success("Success", response));
                })
                .orElseGet(() -> ResponseEntity.status(404).body(ApiResponse.error("User not found")));
    }

    private String resolveEmail(Authentication authentication) {
        if (authentication == null) {
            return null;
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails userDetails) {
            return userDetails.getUsername();
        }
        if (principal instanceof OAuth2User oauth2User) {
            return oauth2User.getAttribute("email");
        }
        return authentication.getName();
    }
}
