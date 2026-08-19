package com.airline.config;

import com.airline.security.JwtAuthenticationFilter;
import com.airline.security.GoogleOAuth2SuccessHandler;
import com.airline.security.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
@Slf4j
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsServiceImpl userDetailsService;
    private final GoogleOAuth2SuccessHandler googleOAuth2SuccessHandler;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.google-auth.enabled:false}")
    private boolean googleAuthEnabled;

    @Value("${app.frontend-url:${FRONTEND_URL:http://localhost:5173}}")
    private String frontendUrl;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/login", "/api/auth/register", "/api/auth/google/config", "/api/auth/google/start").permitAll()
                .requestMatchers("/oauth2/**", "/login/oauth2/**").permitAll()
                .requestMatchers("/api/health").permitAll()
                .requestMatchers("/login", "/register", "/assets/**", "/*.jpg", "/*.png", "/*.ico", "/*.svg").permitAll()
                .requestMatchers("/").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/flights/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/airports/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/aircraft/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/flights/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/flights/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/flights/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        if (googleAuthEnabled) {
            http.oauth2Login(oauth2 -> oauth2
                .successHandler(googleOAuth2SuccessHandler)
                .failureHandler((request, response, exception) -> {
                    String authMode = "login";
                    if (request.getSession(false) != null) {
                        Object storedMode = request.getSession(false).getAttribute("googleAuthMode");
                        if ("signup".equals(storedMode)) {
                            authMode = "signup";
                        }
                        request.getSession(false).removeAttribute("googleAuthMode");
                    }
                    String message = exception.getMessage() == null
                            ? ""
                            : exception.getMessage().toLowerCase();
                    String reason = message.contains("access_denied")
                            || message.contains("unsupported")
                            || (message.contains("user") && message.contains("support"))
                            ? "unsupported-user"
                            : "oauth-failed";
                    log.error("Google OAuth failed: {}", exception.getMessage(), exception);
                    String redirectUrl = UriComponentsBuilder.fromUriString(frontendUrl)
                            .path("signup".equals(authMode) ? "/register" : "/login")
                            .queryParam("google", "error")
                            .queryParam("reason", reason)
                            .build()
                            .encode()
                            .toUriString();
                    response.sendRedirect(redirectUrl);
                })
            );
        }

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        String frontendOrigin = frontendUrl;
        if (frontendOrigin == null || frontendOrigin.isBlank()) {
            frontendOrigin = "http://localhost:5173";
        }
        configuration.setAllowedOriginPatterns(List.of(
                frontendOrigin,
                "https://*.onrender.com",
                "http://localhost:*",
                "http://127.0.0.1:*"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

}
