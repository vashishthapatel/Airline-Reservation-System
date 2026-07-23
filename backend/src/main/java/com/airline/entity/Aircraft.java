package com.airline.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "aircraft")
public class Aircraft {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private String manufacturer;

    @Column(name = "total_seats", nullable = false)
    private Integer totalSeats;

    @Column(name = "economy_seats", nullable = false)
    private Integer economySeats;

    @Column(name = "business_seats", nullable = false)
    private Integer businessSeats;

    @Column(name = "first_class_seats", nullable = false)
    private Integer firstClassSeats;
}
