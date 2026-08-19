package com.airline;

import com.airline.repository.UserRepository;
import com.airline.service.FlightService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@EnableScheduling
public class AirlineBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(AirlineBackendApplication.class, args);
    }

    @Bean
    CommandLineRunner prepareDemoData(
            FlightService flightService,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            userRepository.findByEmail("admin@airline.com").ifPresent(user -> {
                user.setPasswordHash(passwordEncoder.encode("admin123"));
                userRepository.save(user);
            });

            userRepository.findByEmail("john@example.com").ifPresent(user -> {
                user.setPasswordHash(passwordEncoder.encode("customer123"));
                userRepository.save(user);
            });

            flightService.ensureSeatsForAllFlights();
        };
    }
}
