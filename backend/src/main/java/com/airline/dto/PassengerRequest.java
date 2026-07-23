package com.airline.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PassengerRequest {
    private String fullName;
    private String gender;
    private Integer age;
    private String nationality;
    private String passportNumber;
    private Long seatId;
}
