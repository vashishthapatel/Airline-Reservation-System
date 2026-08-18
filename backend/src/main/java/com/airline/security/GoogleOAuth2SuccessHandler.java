package com.airline.security;

import com.airline.entity.User;
import com.airline.entity.UserRole;
import com.airline.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class GoogleOAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Value("${app.frontend-url:${FRONTEND_URL:http://localhost:5173}}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException {
        
        log.info("Google OAuth successful");
        
        OAuth2User googleUser = (OAuth2User) authentication.getPrincipal();
        String email = googleUser.getAttribute("email");
        String givenName = googleUser.getAttribute("given_name");
        String familyName = googleUser.getAttribute("family_name");
        String name = googleUser.getAttribute("name");
        Boolean emailVerified = googleUser.getAttribute("email_verified");

        log.info("Google email received: {}", email);

        if (email == null || email.isBlank()) {
            log.error("Google didn't provide an email");
            getRedirectStrategy().sendRedirect(request, response, frontendUrl + "/login?google=missing-email");
            return;
        }

        if (Boolean.FALSE.equals(emailVerified)) {
            log.error("Google email is not verified");
            getRedirectStrategy().sendRedirect(request, response, frontendUrl + "/login?google=unverified-email");
            return;
        }

        String normalizedEmail = email.trim().toLowerCase();

        try {
            boolean isNewUser = !userRepository.existsByEmail(normalizedEmail);
            log.info("Existing user found: {}", !isNewUser);

            User user = userRepository.findByEmail(email.toLowerCase()).orElseGet(() -> {
                log.info("Creating new user from Google account");
                User newUser = new User();
                
                String displayName = name;
                if ((displayName == null || displayName.isBlank()) && givenName != null) {
                    displayName = familyName != null ? givenName + " " + familyName : givenName;
                }
                
                newUser.setName(displayName == null || displayName.isBlank() ? email : displayName);
                newUser.setEmail(normalizedEmail);
                newUser.setPhone("Google account");
                newUser.setPasswordHash(passwordEncoder.encode(UUID.randomUUID().toString()));
                newUser.setRole(UserRole.CUSTOMER);
                return userRepository.save(newUser);
            });
            
            log.info("Google user created/retrieved successfully. Generating JWT.");

            String token = jwtUtil.generateToken(user.getEmail());
            log.info("JWT generated: true");

            String redirectUrl = UriComponentsBuilder.fromUriString(frontendUrl)
                    .path("/login")
                    .queryParam("google", "success")
                    .queryParam("token", token)
                    .build()
                    .toUriString();
                    
            log.info("Redirecting to React");
            getRedirectStrategy().sendRedirect(request, response, redirectUrl);
            
        } catch (Exception e) {
            log.error("Error processing Google login", e);
            getRedirectStrategy().sendRedirect(request, response, frontendUrl + "/login?google=error");
        }
    }
}
