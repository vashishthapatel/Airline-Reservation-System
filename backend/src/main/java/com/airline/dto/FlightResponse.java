package com.airline.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FlightResponse {
    private Long id;
    private String flightNumber;
    private String origin;
    private String destination;
    private String originCode;
    private String destinationCode;
    private String originCity;
    private String destinationCity;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private BigDecimal basePrice;
    private Integer availableSeats;
    private String status;
    private String aircraftModel;
    private String manufacturer;
    private long durationMinutes;
    private String direction;
    private boolean cheapest;
    private boolean fastest;
}
