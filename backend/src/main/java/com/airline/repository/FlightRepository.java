package com.airline.repository;

import com.airline.entity.Airport;
import com.airline.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {
    Optional<Flight> findByFlightNumber(String flightNumber);

    List<Flight> findByOriginAirportAndDestinationAirportAndDepartureTimeBetween(
            Airport origin,
            Airport destination,
            LocalDateTime startOfDay,
            LocalDateTime endOfDay
    );

    List<Flight> findByOriginAirportAndDestinationAirport(Airport origin, Airport destination);

    @Query("SELECT COUNT(f) FROM Flight f WHERE f.status = 'SCHEDULED' OR f.status = 'DELAYED'")
    Long countActiveFlights();

    @Query("SELECT COUNT(f) FROM Flight f WHERE f.status = 'CANCELLED'")
    Long countCancelledFlights();
}
