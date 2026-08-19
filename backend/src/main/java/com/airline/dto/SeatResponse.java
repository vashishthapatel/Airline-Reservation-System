package com.airline.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeatResponse {
    private Long id;
    private String seatNumber;
    private String seatClass;
    private String status;
    private BigDecimal price;
    private Long lockExpiresInSeconds;

    public SeatResponse(Long id, String seatNumber, String seatClass, String status, BigDecimal price) {
        this.id = id;
        this.seatNumber = seatNumber;
        this.seatClass = seatClass;
        this.status = status;
        this.price = price;
    }
}
