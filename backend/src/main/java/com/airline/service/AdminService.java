package com.airline.service;

import com.airline.dto.*;
import com.airline.entity.*;
import com.airline.exception.ResourceNotFoundException;
import com.airline.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final BookingRepository bookingRepository;
    private final FlightRepository flightRepository;
    private final UserRepository userRepository;
    private final AirportRepository airportRepository;
    private final AircraftRepository aircraftRepository;

    public DashboardStats getDashboardStats() {
        long totalFlights = flightRepository.count();
        long totalBookings = bookingRepository.count();
        long totalCustomers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == UserRole.CUSTOMER).count();
        java.math.BigDecimal totalRevenue = bookingRepository.getTotalRevenue();
        Long todayBookings = bookingRepository.countTodayBookings();
        java.math.BigDecimal todayRevenue = bookingRepository.getTodayRevenue();
        Long activeFlights = flightRepository.countActiveFlights();
        Long cancelledBookings = bookingRepository.countByStatus(BookingStatus.CANCELLED);
        Long confirmedBookings = bookingRepository.countByStatus(BookingStatus.CONFIRMED);

        return new DashboardStats(
                totalFlights,
                totalBookings,
                totalCustomers,
                totalRevenue,
                todayBookings,
                todayRevenue,
                activeFlights,
                cancelledBookings,
                confirmedBookings
        );
    }

    public List<Airport> getAirports() {
        return airportRepository.findAll();
    }

    public Airport createAirport(CreateAirportRequest request) {
        Airport airport = new Airport();
        airport.setIataCode(request.getIataCode().toUpperCase());
        airport.setName(request.getName());
        airport.setCity(request.getCity());
        airport.setCountry(request.getCountry());
        return airportRepository.save(airport);
    }

    public Airport updateAirport(Long id, CreateAirportRequest request) {
        Airport airport = airportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Airport not found"));
        airport.setIataCode(request.getIataCode().toUpperCase());
        airport.setName(request.getName());
        airport.setCity(request.getCity());
        airport.setCountry(request.getCountry());
        return airportRepository.save(airport);
    }

    public void deleteAirport(Long id) {
        airportRepository.deleteById(id);
    }

    public List<Aircraft> getAircraftList() {
        return aircraftRepository.findAll();
    }

    public Aircraft createAircraft(CreateAircraftRequest request) {
        Aircraft aircraft = new Aircraft();
        aircraft.setModel(request.getModel());
        aircraft.setManufacturer(request.getManufacturer());
        aircraft.setTotalSeats(request.getTotalSeats());
        aircraft.setEconomySeats(request.getEconomySeats());
        aircraft.setBusinessSeats(request.getBusinessSeats());
        aircraft.setFirstClassSeats(request.getFirstClassSeats());
        return aircraftRepository.save(aircraft);
    }

    public Aircraft updateAircraft(Long id, CreateAircraftRequest request) {
        Aircraft aircraft = aircraftRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aircraft not found"));
        aircraft.setModel(request.getModel());
        aircraft.setManufacturer(request.getManufacturer());
        aircraft.setTotalSeats(request.getTotalSeats());
        aircraft.setEconomySeats(request.getEconomySeats());
        aircraft.setBusinessSeats(request.getBusinessSeats());
        aircraft.setFirstClassSeats(request.getFirstClassSeats());
        return aircraftRepository.save(aircraft);
    }

    public void deleteAircraft(Long id) {
        aircraftRepository.deleteById(id);
    }

    public List<User> getUsersList() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
