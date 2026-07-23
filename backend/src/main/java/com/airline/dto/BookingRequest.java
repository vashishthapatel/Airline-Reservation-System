package com.airline.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    private Long flightId;
    private List<PassengerRequest> passengerRequests;
    private List<Long> selectedSeatIds;
    private String paymentMethod;
}
