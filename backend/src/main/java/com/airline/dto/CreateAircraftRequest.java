package com.airline.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateAircraftRequest {
    private String model;
    private String manufacturer;
    private Integer totalSeats;
    private Integer economySeats;
    private Integer businessSeats;
    private Integer firstClassSeats;
}
