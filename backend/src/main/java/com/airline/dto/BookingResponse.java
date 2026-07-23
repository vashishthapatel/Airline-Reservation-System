package com.airline.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private Long id;
    private String bookingReference;
    private FlightResponse flight;
    private Integer passengerCount;
    private BigDecimal totalAmount;
    private String status;
    private LocalDateTime createdAt;
    private List<PassengerResponse> passengers;
    private String customerName;
    private String customerEmail;
}
