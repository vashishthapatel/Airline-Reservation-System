package com.airline.controller;

import com.airline.dto.ApiResponse;
import com.airline.dto.CreateFlightRequest;
import com.airline.dto.FlightResponse;
import com.airline.dto.SeatResponse;
import com.airline.service.FlightService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flights")
@RequiredArgsConstructor
public class FlightController {

    private final FlightService flightService;

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<FlightResponse>>> searchFlights(
            @RequestParam String originCode,
            @RequestParam String destinationCode,
            @RequestParam String departureDate,
            @RequestParam(defaultValue = "1") int passengers) {
        List<FlightResponse> flights = flightService.searchFlights(originCode, destinationCode, departureDate, passengers);
        return ResponseEntity.ok(ApiResponse.success("Flights found: " + flights.size(), flights));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FlightResponse>>> getAllFlights() {
        return ResponseEntity.ok(ApiResponse.success("Success", flightService.getAllFlights()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FlightResponse>> getFlightById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Success", flightService.getFlightById(id)));
    }

    @GetMapping("/{id}/seats")
    public ResponseEntity<ApiResponse<List<SeatResponse>>> getFlightSeats(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Success", flightService.getFlightSeats(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FlightResponse>> createFlight(@RequestBody CreateFlightRequest request) {
        FlightResponse flight = flightService.createFlight(request);
        return ResponseEntity.ok(ApiResponse.success("Flight created successfully", flight));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FlightResponse>> updateFlight(@PathVariable Long id, @RequestBody CreateFlightRequest request) {
        FlightResponse flight = flightService.updateFlight(id, request);
        return ResponseEntity.ok(ApiResponse.success("Flight updated successfully", flight));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteFlight(@PathVariable Long id) {
        flightService.deleteFlight(id);
        return ResponseEntity.ok(ApiResponse.success("Flight deleted successfully", null));
    }
}
