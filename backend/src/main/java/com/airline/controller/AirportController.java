package com.airline.controller;

import com.airline.dto.ApiResponse;
import com.airline.entity.Airport;
import com.airline.repository.AirportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/airports")
@RequiredArgsConstructor
public class AirportController {

    private final AirportRepository airportRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Airport>>> getAllAirports() {
        return ResponseEntity.ok(ApiResponse.success("Success", airportRepository.findAll()));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Airport>>> searchAirports(@RequestParam String q) {
        List<Airport> airports = airportRepository.findByNameContainingIgnoreCaseOrCityContainingIgnoreCase(q, q);
        return ResponseEntity.ok(ApiResponse.success("Success", airports));
    }
}
