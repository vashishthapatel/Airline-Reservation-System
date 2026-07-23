package com.airline.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    private Long bookingId;
    private String method;
    private String cardNumber;
    private String cardExpiry;
    private String cardCvv;
    private String upiId;
    private String bankName;
}
