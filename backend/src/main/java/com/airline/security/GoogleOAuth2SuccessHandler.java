package com.airline.security;

import com.airline.entity.User;
import com.airline.entity.UserRole;
import com.airline.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.UUID;

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
        OAuth2User googleUser = (OAuth2User) authentication.getPrincipal();
        String email = googleUser.getAttribute("email");
        String name = googleUser.getAttribute("name");

        if (email == null || email.isBlank()) {
            getRedirectStrategy().sendRedirect(request, response, frontendUrl + "/login?google=missing-email");
            return;
        }

        User user = userRepository.findByEmail(email.toLowerCase()).orElseGet(() -> {
            User newUser = new User();
            newUser.setName(name == null || name.isBlank() ? email : name);
            newUser.setEmail(email.toLowerCase());
            newUser.setPhone("Google account");
            newUser.setPasswordHash(passwordEncoder.encode(UUID.randomUUID().toString()));
            newUser.setRole(UserRole.CUSTOMER);
            return userRepository.save(newUser);
        });

        String redirectUrl = UriComponentsBuilder.fromUriString(frontendUrl)
                .path("/login")
                .queryParam("google", "success")
                .queryParam("token", jwtUtil.generateToken(user.getEmail()))
                .build()
                .toUriString();
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
