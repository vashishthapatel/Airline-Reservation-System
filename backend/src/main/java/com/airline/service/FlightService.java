package com.airline.service;

import com.airline.dto.CreateFlightRequest;
import com.airline.dto.FlightResponse;
import com.airline.dto.SeatResponse;
import com.airline.entity.*;
import com.airline.exception.BadRequestException;
import com.airline.exception.ResourceNotFoundException;
import com.airline.repository.AircraftRepository;
import com.airline.repository.AirportRepository;
import com.airline.repository.FlightRepository;
import com.airline.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FlightService {

    private final FlightRepository flightRepository;
    private final AirportRepository airportRepository;
    private final AircraftRepository aircraftRepository;
    private final SeatRepository seatRepository;

    public List<FlightResponse> searchFlights(String originCode, String destinationCode, String departureDateStr, int passengers) {
        Airport origin = airportRepository.findByIataCode(originCode.toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Origin airport not found: " + originCode));
        Airport destination = airportRepository.findByIataCode(destinationCode.toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Destination airport not found: " + destinationCode));

        List<Flight> forwardFlights;
        List<Flight> reverseFlights;

        if (departureDateStr == null || departureDateStr.trim().isEmpty()) {
            forwardFlights = flightRepository.findByOriginAirportAndDestinationAirport(origin, destination);
            reverseFlights = flightRepository.findByOriginAirportAndDestinationAirport(destination, origin);
        } else {
            LocalDate departureDate = LocalDate.parse(departureDateStr);
            LocalDateTime startOfDay = departureDate.atStartOfDay();
            LocalDateTime endOfDay = departureDate.atTime(LocalTime.MAX);

            forwardFlights = flightRepository.findByOriginAirportAndDestinationAirportAndDepartureTimeBetween(
                    origin, destination, startOfDay, endOfDay
            );

            reverseFlights = flightRepository.findByOriginAirportAndDestinationAirportAndDepartureTimeBetween(
                    destination, origin, startOfDay, endOfDay
            );
        }

        List<FlightResponse> allResponses = new ArrayList<>();

        for (Flight f : forwardFlights) {
            if (f.getAvailableSeats() >= passengers) {
                FlightResponse r = toFlightResponse(f);
                r.setDirection("FORWARD");
                allResponses.add(r);
            }
        }

        for (Flight f : reverseFlights) {
            if (f.getAvailableSeats() >= passengers) {
                FlightResponse r = toFlightResponse(f);
                r.setDirection("REVERSE");
                allResponses.add(r);
            }
        }

        if (allResponses.isEmpty()) {
            return allResponses;
        }

        BigDecimal minPrice = allResponses.stream()
                .map(FlightResponse::getBasePrice)
                .min(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO);

        long minDuration = allResponses.stream()
                .mapToLong(FlightResponse::getDurationMinutes)
                .min()
                .orElse(0L);

        for (FlightResponse r : allResponses) {
            r.setCheapest(r.getBasePrice().compareTo(minPrice) == 0);
            r.setFastest(r.getDurationMinutes() == minDuration);
        }

        return allResponses;
    }

    public List<FlightResponse> getAllFlights() {
        return flightRepository.findAll().stream()
                .map(this::toFlightResponse)
                .collect(Collectors.toList());
    }

    public FlightResponse getFlightById(Long id) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with id: " + id));
        return toFlightResponse(flight);
    }

    public List<SeatResponse> getFlightSeats(Long flightId) {
        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with id: " + flightId));
        ensureSeatsExist(flight);

        List<Seat> seats = seatRepository.findByFlightId(flightId);
        return seats.stream().map(this::toSeatResponse).collect(Collectors.toList());
    }

    @Transactional
    public FlightResponse createFlight(CreateFlightRequest request) {
        if (flightRepository.findByFlightNumber(request.getFlightNumber()).isPresent()) {
            throw new BadRequestException("Flight number already exists: " + request.getFlightNumber());
        }

        Aircraft aircraft = aircraftRepository.findById(request.getAircraftId())
                .orElseThrow(() -> new ResourceNotFoundException("Aircraft not found"));
        Airport origin = airportRepository.findById(request.getOriginAirportId())
                .orElseThrow(() -> new ResourceNotFoundException("Origin airport not found"));
        Airport destination = airportRepository.findById(request.getDestinationAirportId())
                .orElseThrow(() -> new ResourceNotFoundException("Destination airport not found"));

        Flight flight = new Flight();
        flight.setFlightNumber(request.getFlightNumber());
        flight.setAircraft(aircraft);
        flight.setOriginAirport(origin);
        flight.setDestinationAirport(destination);
        flight.setDepartureTime(request.getDepartureTime());
        flight.setArrivalTime(request.getArrivalTime());
        flight.setBasePrice(request.getBasePrice());
        flight.setStatus(FlightStatus.SCHEDULED);
        flight.setAvailableSeats(aircraft.getTotalSeats());

        flight = flightRepository.save(flight);
        generateSeats(flight, aircraft, request.getBasePrice());

        return toFlightResponse(flight);
    }

    @Transactional
    public void ensureSeatsForAllFlights() {
        flightRepository.findAll().forEach(this::ensureSeatsExist);
    }

    @Transactional
    public FlightResponse updateFlight(Long id, CreateFlightRequest request) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found"));

        Airport origin = airportRepository.findById(request.getOriginAirportId())
                .orElseThrow(() -> new ResourceNotFoundException("Origin airport not found"));
        Airport destination = airportRepository.findById(request.getDestinationAirportId())
                .orElseThrow(() -> new ResourceNotFoundException("Destination airport not found"));

        flight.setFlightNumber(request.getFlightNumber());
        flight.setOriginAirport(origin);
        flight.setDestinationAirport(destination);
        flight.setDepartureTime(request.getDepartureTime());
        flight.setArrivalTime(request.getArrivalTime());
        flight.setBasePrice(request.getBasePrice());

        return toFlightResponse(flightRepository.save(flight));
    }

    @Transactional
    public void deleteFlight(Long id) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found"));
        flightRepository.delete(flight);
    }

    private void ensureSeatsExist(Flight flight) {
        if (seatRepository.findByFlightId(flight.getId()).isEmpty()) {
            generateSeats(flight, flight.getAircraft(), flight.getBasePrice());
        }
    }

    private void generateSeats(Flight flight, Aircraft aircraft, BigDecimal basePrice) {
        List<Seat> seats = new ArrayList<>();
        String[] cols = {"A", "B", "C", "D", "E", "F"};

        // First class seats
        int firstRows = (int) Math.ceil(aircraft.getFirstClassSeats() / 4.0);
        for (int row = 1; row <= firstRows; row++) {
            for (int col = 0; col < Math.min(4, aircraft.getFirstClassSeats() - (row - 1) * 4); col++) {
                Seat seat = new Seat();
                seat.setFlight(flight);
                seat.setSeatNumber("F" + row + cols[col]);
                seat.setSeatClass(SeatClass.FIRST);
                seat.setStatus(SeatStatus.AVAILABLE);
                seat.setPrice(basePrice.multiply(BigDecimal.valueOf(3)));
                seats.add(seat);
            }
        }

        // Business seats
        int businessRows = (int) Math.ceil(aircraft.getBusinessSeats() / 4.0);
        for (int row = 1; row <= businessRows; row++) {
            for (int col = 0; col < Math.min(4, aircraft.getBusinessSeats() - (row - 1) * 4); col++) {
                Seat seat = new Seat();
                seat.setFlight(flight);
                seat.setSeatNumber("B" + row + cols[col]);
                seat.setSeatClass(SeatClass.BUSINESS);
                seat.setStatus(SeatStatus.AVAILABLE);
                seat.setPrice(basePrice.multiply(BigDecimal.valueOf(2)));
                seats.add(seat);
            }
        }

        // Economy seats
        int economyRows = (int) Math.ceil(aircraft.getEconomySeats() / 6.0);
        for (int row = 1; row <= economyRows; row++) {
            for (int col = 0; col < Math.min(6, aircraft.getEconomySeats() - (row - 1) * 6); col++) {
                Seat seat = new Seat();
                seat.setFlight(flight);
                seat.setSeatNumber("E" + row + cols[col]);
                seat.setSeatClass(SeatClass.ECONOMY);
                seat.setStatus(SeatStatus.AVAILABLE);
                seat.setPrice(basePrice);
                seats.add(seat);
            }
        }

        seatRepository.saveAll(seats);
    }

    public FlightResponse toFlightResponse(Flight flight) {
        long durationMinutes = Duration.between(flight.getDepartureTime(), flight.getArrivalTime()).toMinutes();

        FlightResponse response = new FlightResponse();
        response.setId(flight.getId());
        response.setFlightNumber(flight.getFlightNumber());
        response.setOrigin(flight.getOriginAirport().getName());
        response.setDestination(flight.getDestinationAirport().getName());
        response.setOriginCode(flight.getOriginAirport().getIataCode());
        response.setDestinationCode(flight.getDestinationAirport().getIataCode());
        response.setOriginCity(flight.getOriginAirport().getCity());
        response.setDestinationCity(flight.getDestinationAirport().getCity());
        response.setDepartureTime(flight.getDepartureTime());
        response.setArrivalTime(flight.getArrivalTime());
        response.setBasePrice(flight.getBasePrice());
        response.setAvailableSeats(flight.getAvailableSeats());
        response.setStatus(flight.getStatus().name());
        response.setAircraftModel(flight.getAircraft().getModel());
        response.setDurationMinutes(durationMinutes);
        return response;
    }

    private SeatResponse toSeatResponse(Seat seat) {
        return new SeatResponse(
                seat.getId(),
                seat.getSeatNumber(),
                seat.getSeatClass().name(),
                seat.getStatus().name(),
                seat.getPrice()
        );
    }
}
