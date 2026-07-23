package com.airline.controller;

import com.airline.dto.ApiResponse;
import com.airline.dto.BookingResponse;
import com.airline.dto.CreateAircraftRequest;
import com.airline.dto.CreateAirportRequest;
import com.airline.dto.DashboardStats;
import com.airline.entity.Aircraft;
import com.airline.entity.Airport;
import com.airline.entity.User;
import com.airline.service.AdminService;
import com.airline.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final BookingService bookingService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStats>> getDashboardStats() {
        return ResponseEntity.ok(ApiResponse.success("Success", adminService.getDashboardStats()));
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings() {
        return ResponseEntity.ok(ApiResponse.success("Success", bookingService.getAllBookings()));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getUsersList() {
        return ResponseEntity.ok(ApiResponse.success("Success", adminService.getUsersList()));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted", null));
    }

    // Airport Management
    @GetMapping("/airports")
    public ResponseEntity<ApiResponse<List<Airport>>> getAirports() {
        return ResponseEntity.ok(ApiResponse.success("Success", adminService.getAirports()));
    }

    @PostMapping("/airports")
    public ResponseEntity<ApiResponse<Airport>> createAirport(@RequestBody CreateAirportRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Airport created", adminService.createAirport(request)));
    }

    @PutMapping("/airports/{id}")
    public ResponseEntity<ApiResponse<Airport>> updateAirport(@PathVariable Long id, @RequestBody CreateAirportRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Airport updated", adminService.updateAirport(id, request)));
    }

    @DeleteMapping("/airports/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAirport(@PathVariable Long id) {
        adminService.deleteAirport(id);
        return ResponseEntity.ok(ApiResponse.success("Airport deleted", null));
    }

    // Aircraft Management
    @GetMapping("/aircraft")
    public ResponseEntity<ApiResponse<List<Aircraft>>> getAircraftList() {
        return ResponseEntity.ok(ApiResponse.success("Success", adminService.getAircraftList()));
    }

    @PostMapping("/aircraft")
    public ResponseEntity<ApiResponse<Aircraft>> createAircraft(@RequestBody CreateAircraftRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Aircraft created", adminService.createAircraft(request)));
    }

    @PutMapping("/aircraft/{id}")
    public ResponseEntity<ApiResponse<Aircraft>> updateAircraft(@PathVariable Long id, @RequestBody CreateAircraftRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Aircraft updated", adminService.updateAircraft(id, request)));
    }

    @DeleteMapping("/aircraft/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAircraft(@PathVariable Long id) {
        adminService.deleteAircraft(id);
        return ResponseEntity.ok(ApiResponse.success("Aircraft deleted", null));
    }
}
