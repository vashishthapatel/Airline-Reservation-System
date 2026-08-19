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
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FlightService {

    private static final Map<String, double[]> AIRPORT_COORDINATES = Map.ofEntries(
            Map.entry("DEL", new double[]{28.5562, 77.1000}),
            Map.entry("BOM", new double[]{19.0896, 72.8656}),
            Map.entry("BLR", new double[]{13.1986, 77.7066}),
            Map.entry("MAA", new double[]{12.9941, 80.1709}),
            Map.entry("HYD", new double[]{17.2403, 78.4294}),
            Map.entry("CCU", new double[]{22.6547, 88.4467}),
            Map.entry("GOI", new double[]{15.3800, 73.8314}),
            Map.entry("JFK", new double[]{40.6413, -73.7781}),
            Map.entry("LHR", new double[]{51.4700, -0.4543}),
            Map.entry("DXB", new double[]{25.2532, 55.3657}),
            Map.entry("SIN", new double[]{1.3644, 103.9915}),
            Map.entry("BKK", new double[]{13.6900, 100.7501}),
            Map.entry("SYD", new double[]{-33.9399, 151.1753}),
            Map.entry("CDG", new double[]{49.0097, 2.5479}),
            Map.entry("FRA", new double[]{50.0379, 8.5622})
    );

    private final FlightRepository flightRepository;
    private final AirportRepository airportRepository;
    private final AircraftRepository aircraftRepository;
    private final SeatRepository seatRepository;
    private final SeatLockService seatLockService;

    @Transactional
    public List<FlightResponse> searchFlights(String originCode, String destinationCode, String departureDateStr, int passengers) {
        Airport origin = airportRepository.findByIataCode(originCode.toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Origin airport not found: " + originCode));
        Airport destination = airportRepository.findByIataCode(destinationCode.toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Destination airport not found: " + destinationCode));

        if (origin.getId().equals(destination.getId())) {
            throw new BadRequestException("Origin and destination must be different");
        }
        if (passengers < 1) {
            throw new BadRequestException("At least one passenger is required");
        }

        LocalDate departureDate = LocalDate.parse(departureDateStr);
        if (departureDate.isBefore(LocalDate.now())) {
            throw new BadRequestException("Please choose today or a future travel date");
        }

        LocalDateTime startOfDay = departureDate.atStartOfDay();
        LocalDateTime endOfDay = departureDate.plusDays(1).atStartOfDay().minusNanos(1);
        List<Flight> forwardFlights = flightRepository.findByOriginAirportAndDestinationAirportAndDepartureTimeBetween(
                origin, destination, startOfDay, endOfDay
        );

        if (forwardFlights.isEmpty()) {
            Flight dailyFlight = createDailyFlight(origin, destination, departureDate);
            if (dailyFlight != null) {
                forwardFlights = List.of(dailyFlight);
            }
        }

        List<FlightResponse> allResponses = new ArrayList<>();

        for (Flight f : forwardFlights) {
            if (f.getAvailableSeats() >= passengers) {
                FlightResponse r = toFlightResponse(f);
                r.setDirection("FORWARD");
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

    private Flight createDailyFlight(Airport origin, Airport destination, LocalDate departureDate) {
        Flight template = flightRepository.findByOriginAirportAndDestinationAirport(origin, destination).stream()
                .filter(flight -> flight.getStatus() == FlightStatus.SCHEDULED || flight.getStatus() == FlightStatus.DELAYED)
                .findFirst()
                .orElse(null);

        Aircraft aircraft = template != null ? template.getAircraft() : aircraftRepository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("No aircraft is available to schedule this route"));
        LocalDateTime departureTime = LocalDateTime.of(
                departureDate,
                template != null ? template.getDepartureTime().toLocalTime() : java.time.LocalTime.of(9, 0)
        );
        long durationMinutes = calculateDurationMinutes(origin, destination);
        BigDecimal basePrice = calculateBasePrice(origin, destination);
        String flightNumber = origin.getIataCode() + destination.getIataCode()
                + departureTime.format(DateTimeFormatter.ofPattern("yyMMddHHmm"));

        return flightRepository.findByFlightNumber(flightNumber).orElseGet(() -> {
            Flight flight = new Flight();
            flight.setFlightNumber(flightNumber);
            flight.setAircraft(aircraft);
            flight.setOriginAirport(origin);
            flight.setDestinationAirport(destination);
            flight.setDepartureTime(departureTime);
            flight.setArrivalTime(departureTime.plusMinutes(durationMinutes));
            flight.setBasePrice(basePrice);
            flight.setStatus(FlightStatus.SCHEDULED);
            flight.setAvailableSeats(aircraft.getTotalSeats());

            Flight savedFlight = flightRepository.save(flight);
            generateSeats(savedFlight, savedFlight.getAircraft(), savedFlight.getBasePrice());
            return savedFlight;
        });
    }

    private long calculateDurationMinutes(Airport origin, Airport destination) {
        double distanceKm = calculateDistanceKm(origin, destination);
        double totalMinutes = 40 + (distanceKm / 800.0 * 60);
        return Math.max(60, (long) Math.ceil(totalMinutes / 5) * 5);
    }

    private BigDecimal calculateBasePrice(Airport origin, Airport destination) {
        double distanceKm = calculateDistanceKm(origin, destination);
        boolean international = !origin.getCountry().equalsIgnoreCase(destination.getCountry());
        double ratePerKm = international ? 4.7 : 2.7;
        double fixedCharge = 1500;
        long roundedFare = Math.round((fixedCharge + distanceKm * ratePerKm) / 100.0) * 100;
        return BigDecimal.valueOf(Math.max(3000, roundedFare));
    }

    private double calculateDistanceKm(Airport origin, Airport destination) {
        double[] originCoordinates = AIRPORT_COORDINATES.get(origin.getIataCode());
        double[] destinationCoordinates = AIRPORT_COORDINATES.get(destination.getIataCode());
        if (originCoordinates == null || destinationCoordinates == null) {
            return origin.getCountry().equalsIgnoreCase(destination.getCountry()) ? 1000 : 7000;
        }

        double latitudeDelta = Math.toRadians(destinationCoordinates[0] - originCoordinates[0]);
        double longitudeDelta = Math.toRadians(destinationCoordinates[1] - originCoordinates[1]);
        double a = Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2)
                + Math.cos(Math.toRadians(originCoordinates[0])) * Math.cos(Math.toRadians(destinationCoordinates[0]))
                * Math.sin(longitudeDelta / 2) * Math.sin(longitudeDelta / 2);
        return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
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
        response.setManufacturer(flight.getAircraft().getManufacturer());
        response.setDurationMinutes(durationMinutes);
        return response;
    }

    private SeatResponse toSeatResponse(Seat seat) {
        String status = seat.getStatus().name();
        Long lockExpiresInSeconds = null;
        if (seat.getStatus() == SeatStatus.AVAILABLE && seatLockService.isLocked(seat.getId())) {
            status = SeatStatus.LOCKED.name();
            lockExpiresInSeconds = seatLockService.getLockTtlSeconds(seat.getId());
        }
        return new SeatResponse(
                seat.getId(),
                seat.getSeatNumber(),
                seat.getSeatClass().name(),
                status,
                seat.getPrice(),
                lockExpiresInSeconds
        );
    }
}
