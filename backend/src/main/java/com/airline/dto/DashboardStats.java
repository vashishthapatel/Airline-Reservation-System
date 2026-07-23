package com.airline.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    private Long totalFlights;
    private Long totalBookings;
    private Long totalCustomers;
    private BigDecimal totalRevenue;
    private Long todayBookings;
    private BigDecimal todayRevenue;
    private Long activeFlights;
    private Long cancelledBookings;
    private Long confirmedBookings;
}
