package com.airline.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateAirportRequest {
    private String iataCode;
    private String name;
    private String city;
    private String country;
}
