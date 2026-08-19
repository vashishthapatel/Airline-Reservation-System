package com.airline.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeatLockResponse {
    private List<Long> seatIds;
    private int expiresInSeconds;
}
