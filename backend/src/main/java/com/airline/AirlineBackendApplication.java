package com.airline;

import com.airline.entity.Aircraft;
import com.airline.entity.Airport;
import com.airline.entity.Flight;
import com.airline.entity.FlightStatus;
import com.airline.entity.User;
import com.airline.entity.UserRole;
import com.airline.repository.AircraftRepository;
import com.airline.repository.AirportRepository;
import com.airline.repository.FlightRepository;
import com.airline.repository.UserRepository;
import com.airline.service.FlightService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@SpringBootApplication
@EnableScheduling
public class AirlineBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(AirlineBackendApplication.class, args);
    }

    @Bean
    @Transactional
    CommandLineRunner prepareDemoData(
            FlightService flightService,
            UserRepository userRepository,
            AirportRepository airportRepository,
            AircraftRepository aircraftRepository,
            FlightRepository flightRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // ── Persistent seed (works on H2 and Postgres) ──────────────────
            // data.sql uses MySQL INSERT IGNORE which fails on Postgres. This
            // Java seeder replaces it so the DB is populated on first boot
            // and survives every sleep/redeploy. Idempotent — no duplicates.
            if (airportRepository.count() == 0) {
                airportRepository.save(new Airport(null, "DEL", "Indira Gandhi International Airport", "New Delhi", "India"));
                airportRepository.save(new Airport(null, "BOM", "Chhatrapati Shivaji Maharaj International Airport", "Mumbai", "India"));
                airportRepository.save(new Airport(null, "BLR", "Kempegowda International Airport", "Bangalore", "India"));
                airportRepository.save(new Airport(null, "MAA", "Chennai International Airport", "Chennai", "India"));
                airportRepository.save(new Airport(null, "HYD", "Rajiv Gandhi International Airport", "Hyderabad", "India"));
                airportRepository.save(new Airport(null, "CCU", "Netaji Subhas Chandra Bose International Airport", "Kolkata", "India"));
                airportRepository.save(new Airport(null, "GOI", "Goa International Airport", "Goa", "India"));
                airportRepository.save(new Airport(null, "JFK", "John F. Kennedy International Airport", "New York", "USA"));
                airportRepository.save(new Airport(null, "LHR", "Heathrow Airport", "London", "UK"));
                airportRepository.save(new Airport(null, "DXB", "Dubai International Airport", "Dubai", "UAE"));
                airportRepository.save(new Airport(null, "SIN", "Changi Airport", "Singapore", "Singapore"));
                airportRepository.save(new Airport(null, "BKK", "Suvarnabhumi Airport", "Bangkok", "Thailand"));
                airportRepository.save(new Airport(null, "SYD", "Sydney Kingsford Smith Airport", "Sydney", "Australia"));
                airportRepository.save(new Airport(null, "CDG", "Charles de Gaulle Airport", "Paris", "France"));
                airportRepository.save(new Airport(null, "FRA", "Frankfurt Airport", "Frankfurt", "Germany"));
            }

            if (aircraftRepository.count() == 0) {
                aircraftRepository.save(new Aircraft(null, "Boeing 737-800", "Boeing", 150, 120, 20, 10));
                aircraftRepository.save(new Aircraft(null, "Boeing 777-300ER", "Boeing", 300, 240, 40, 20));
                aircraftRepository.save(new Aircraft(null, "Airbus A320", "Airbus", 180, 150, 20, 10));
                aircraftRepository.save(new Aircraft(null, "Airbus A380-800", "Airbus", 500, 400, 70, 30));
            }

            // Seed core flights when table is empty (Postgres: data.sql is skipped).
            // These 12 cover every demo route; FlightService.createDailyFlight
            // generates additional dates on demand so we don't need all 700 rows.
            if (flightRepository.count() == 0) {
                List<Aircraft> ac = aircraftRepository.findAll();
                Aircraft ac1 = ac.stream().filter(a -> a.getModel().equals("Boeing 737-800")).findFirst().orElse(ac.get(0));
                Aircraft ac3 = ac.stream().filter(a -> a.getModel().equals("Airbus A320")).findFirst().orElse(ac.get(0));
                Aircraft ac2 = ac.stream().filter(a -> a.getModel().equals("Boeing 777-300ER")).findFirst().orElse(ac.get(0));
                Aircraft ac4 = ac.stream().filter(a -> a.getModel().equals("Airbus A380-800")).findFirst().orElse(ac.get(0));
                java.util.function.Function<String, Airport> apt = code -> airportRepository.findByIataCode(code).orElseThrow();
                List<Flight> seed = List.of(
                        mkFlight("SW101", ac1, apt.apply("DEL"), apt.apply("BOM"), "2026-08-01T06:00:00", "2026-08-01T08:00:00", "4500.00"),
                        mkFlight("SW102", ac1, apt.apply("BOM"), apt.apply("DEL"), "2026-08-01T10:00:00", "2026-08-01T12:00:00", "4800.00"),
                        mkFlight("SW103", ac3, apt.apply("DEL"), apt.apply("BLR"), "2026-08-01T07:00:00", "2026-08-01T09:30:00", "5200.00"),
                        mkFlight("SW104", ac3, apt.apply("BLR"), apt.apply("DEL"), "2026-08-01T15:00:00", "2026-08-01T17:30:00", "5500.00"),
                        mkFlight("SW105", ac2, apt.apply("DEL"), apt.apply("DXB"), "2026-08-01T14:00:00", "2026-08-01T17:30:00", "15000.00"),
                        mkFlight("SW106", ac2, apt.apply("BOM"), apt.apply("DXB"), "2026-08-01T22:00:00", "2026-08-02T02:00:00", "14500.00"),
                        mkFlight("SW107", ac4, apt.apply("DEL"), apt.apply("JFK"), "2026-08-01T01:00:00", "2026-08-01T13:00:00", "55000.00"),
                        mkFlight("SW108", ac3, apt.apply("MAA"), apt.apply("HYD"), "2026-08-01T08:00:00", "2026-08-01T09:30:00", "3800.00"),
                        mkFlight("SW109", ac1, apt.apply("HYD"), apt.apply("CCU"), "2026-08-01T11:00:00", "2026-08-01T13:30:00", "4200.00"),
                        mkFlight("SW110", ac3, apt.apply("DEL"), apt.apply("SIN"), "2026-08-01T23:30:00", "2026-08-02T09:00:00", "28000.00"),
                        mkFlight("SW111", ac1, apt.apply("BOM"), apt.apply("BLR"), "2026-08-02T06:00:00", "2026-08-02T08:00:00", "4600.00"),
                        mkFlight("SW112", ac3, apt.apply("DEL"), apt.apply("MAA"), "2026-08-02T09:00:00", "2026-08-02T11:30:00", "5100.00")
                );
                flightRepository.saveAll(seed);
            }

            // Demo accounts — create if missing, and always reset password so
            // admin123 / customer123 work after every restart (idempotent).
            User admin = userRepository.findByEmail("admin@airline.com").orElseGet(() -> {
                User u = new User();
                u.setName("Admin");
                u.setEmail("admin@airline.com");
                u.setPhone("9999999999");
                u.setRole(UserRole.ADMIN);
                return u;
            });
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            if (admin.getRole() == null) admin.setRole(UserRole.ADMIN);
            userRepository.save(admin);

            User customer = userRepository.findByEmail("john@example.com").orElseGet(() -> {
                User u = new User();
                u.setName("John Doe");
                u.setEmail("john@example.com");
                u.setPhone("8888888888");
                u.setRole(UserRole.CUSTOMER);
                return u;
            });
            customer.setPasswordHash(passwordEncoder.encode("customer123"));
            if (customer.getRole() == null) customer.setRole(UserRole.CUSTOMER);
            userRepository.save(customer);

            flightService.ensureSeatsForAllFlights();
        };
    }

    private static Flight mkFlight(String flightNumber, Aircraft aircraft, Airport origin,
                                   Airport destination, String departureIso, String arrivalIso, String price) {
        Flight f = new Flight();
        f.setFlightNumber(flightNumber);
        f.setAircraft(aircraft);
        f.setOriginAirport(origin);
        f.setDestinationAirport(destination);
        f.setDepartureTime(LocalDateTime.parse(departureIso));
        f.setArrivalTime(LocalDateTime.parse(arrivalIso));
        f.setBasePrice(new BigDecimal(price));
        f.setStatus(FlightStatus.SCHEDULED);
        f.setAvailableSeats(aircraft.getTotalSeats());
        return f;
    }
}
