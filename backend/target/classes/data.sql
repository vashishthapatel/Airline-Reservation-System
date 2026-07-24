-- ============================================================
-- Airline Reservation System - Seed Data
-- ============================================================

-- Airports
INSERT IGNORE INTO airports (iata_code, name, city, country) VALUES
('DEL', 'Indira Gandhi International Airport', 'New Delhi', 'India'),
('BOM', 'Chhatrapati Shivaji Maharaj International Airport', 'Mumbai', 'India'),
('BLR', 'Kempegowda International Airport', 'Bangalore', 'India'),
('MAA', 'Chennai International Airport', 'Chennai', 'India'),
('HYD', 'Rajiv Gandhi International Airport', 'Hyderabad', 'India'),
('CCU', 'Netaji Subhas Chandra Bose International Airport', 'Kolkata', 'India'),
('GOI', 'Goa International Airport', 'Goa', 'India'),
('JFK', 'John F. Kennedy International Airport', 'New York', 'USA'),
('LHR', 'Heathrow Airport', 'London', 'UK'),
('DXB', 'Dubai International Airport', 'Dubai', 'UAE'),
('SIN', 'Changi Airport', 'Singapore', 'Singapore'),
('BKK', 'Suvarnabhumi Airport', 'Bangkok', 'Thailand'),
('SYD', 'Sydney Kingsford Smith Airport', 'Sydney', 'Australia'),
('CDG', 'Charles de Gaulle Airport', 'Paris', 'France'),
('FRA', 'Frankfurt Airport', 'Frankfurt', 'Germany');

-- Aircraft
INSERT IGNORE INTO aircraft (model, manufacturer, total_seats, economy_seats, business_seats, first_class_seats) VALUES
('Boeing 737-800', 'Boeing', 150, 120, 20, 10),
('Boeing 777-300ER', 'Boeing', 300, 240, 40, 20),
('Airbus A320', 'Airbus', 180, 150, 20, 10),
('Airbus A380-800', 'Airbus', 500, 400, 70, 30);

-- Admin User (password: Admin@123)
INSERT IGNORE INTO users (name, email, phone, password_hash, role, created_at) VALUES
('Admin', 'admin@airline.com', '9999999999', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', NOW());

-- Test Customer (password: Test@123)
INSERT IGNORE INTO users (name, email, phone, password_hash, role, created_at) VALUES
('John Doe', 'john@example.com', '8888888888', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'CUSTOMER', NOW());

-- ============================================================
-- Flights (DEL-BOM, BOM-BLR, DEL-LHR, BOM-DXB, etc.)
-- ============================================================
INSERT IGNORE INTO flights (flight_number, aircraft_id, origin_airport_id, destination_airport_id, departure_time, arrival_time, base_price, status, available_seats) VALUES
('SW101', 1, 1, 2, '2026-08-01 06:00:00', '2026-08-01 08:00:00', 4500.00, 'SCHEDULED', 150),
('SW102', 1, 2, 1, '2026-08-01 10:00:00', '2026-08-01 12:00:00', 4800.00, 'SCHEDULED', 150),
('SW103', 3, 1, 3, '2026-08-01 07:00:00', '2026-08-01 09:30:00', 5200.00, 'SCHEDULED', 180),
('SW104', 3, 3, 1, '2026-08-01 15:00:00', '2026-08-01 17:30:00', 5500.00, 'SCHEDULED', 180),
('SW105', 2, 1, 10, '2026-08-01 14:00:00', '2026-08-01 17:30:00', 15000.00, 'SCHEDULED', 300),
('SW106', 2, 2, 10, '2026-08-01 22:00:00', '2026-08-02 02:00:00', 14500.00, 'SCHEDULED', 300),
('SW107', 4, 1, 8,  '2026-08-01 01:00:00', '2026-08-01 13:00:00', 55000.00, 'SCHEDULED', 500),
('SW108', 3, 4, 5,  '2026-08-01 08:00:00', '2026-08-01 09:30:00', 3800.00, 'SCHEDULED', 180),
('SW109', 1, 5, 6,  '2026-08-01 11:00:00', '2026-08-01 13:30:00', 4200.00, 'SCHEDULED', 150),
('SW110', 3, 1, 11, '2026-08-01 23:30:00', '2026-08-02 09:00:00', 28000.00, 'SCHEDULED', 180),
('SW111', 1, 2, 3,  '2026-08-02 06:00:00', '2026-08-02 08:00:00', 4600.00, 'SCHEDULED', 150),
('SW112', 3, 1, 4,  '2026-08-02 09:00:00', '2026-08-02 11:30:00', 5100.00, 'SCHEDULED', 180);

-- ============================================================
-- Seats for Flight SW101 (Boeing 737, aircraft_id=1)
-- ============================================================
-- First Class (10 seats: F rows)
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'F1A', 'FIRST', 'AVAILABLE', f.base_price * 3 FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'F1B', 'FIRST', 'AVAILABLE', f.base_price * 3 FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'F1C', 'FIRST', 'AVAILABLE', f.base_price * 3 FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'F2A', 'FIRST', 'AVAILABLE', f.base_price * 3 FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'F2B', 'FIRST', 'AVAILABLE', f.base_price * 3 FROM flights f WHERE f.flight_number = 'SW101';

-- Business Class (20 seats: B rows)
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'B1A', 'BUSINESS', 'AVAILABLE', f.base_price * 2 FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'B1B', 'BUSINESS', 'AVAILABLE', f.base_price * 2 FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'B1C', 'BUSINESS', 'AVAILABLE', f.base_price * 2 FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'B1D', 'BUSINESS', 'AVAILABLE', f.base_price * 2 FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'B2A', 'BUSINESS', 'AVAILABLE', f.base_price * 2 FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'B2B', 'BUSINESS', 'AVAILABLE', f.base_price * 2 FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'B2C', 'BUSINESS', 'AVAILABLE', f.base_price * 2 FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'B2D', 'BUSINESS', 'AVAILABLE', f.base_price * 2 FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'B3A', 'BUSINESS', 'AVAILABLE', f.base_price * 2 FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'B3B', 'BUSINESS', 'AVAILABLE', f.base_price * 2 FROM flights f WHERE f.flight_number = 'SW101';

-- Economy Class (30 seats for demo: E rows)
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'E1A', 'ECONOMY', 'AVAILABLE', f.base_price FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'E1B', 'ECONOMY', 'AVAILABLE', f.base_price FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'E1C', 'ECONOMY', 'AVAILABLE', f.base_price FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'E1D', 'ECONOMY', 'AVAILABLE', f.base_price FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'E1E', 'ECONOMY', 'AVAILABLE', f.base_price FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'E1F', 'ECONOMY', 'AVAILABLE', f.base_price FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'E2A', 'ECONOMY', 'AVAILABLE', f.base_price FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'E2B', 'ECONOMY', 'AVAILABLE', f.base_price FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'E2C', 'ECONOMY', 'AVAILABLE', f.base_price FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'E2D', 'ECONOMY', 'AVAILABLE', f.base_price FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'E2E', 'ECONOMY', 'AVAILABLE', f.base_price FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'E2F', 'ECONOMY', 'AVAILABLE', f.base_price FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'E3A', 'ECONOMY', 'AVAILABLE', f.base_price FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'E3B', 'ECONOMY', 'AVAILABLE', f.base_price FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'E3C', 'ECONOMY', 'AVAILABLE', f.base_price FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'E3D', 'ECONOMY', 'AVAILABLE', f.base_price FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'E3E', 'ECONOMY', 'AVAILABLE', f.base_price FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'E3F', 'ECONOMY', 'AVAILABLE', f.base_price FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'E4A', 'ECONOMY', 'AVAILABLE', f.base_price FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'E4B', 'ECONOMY', 'AVAILABLE', f.base_price FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'E4C', 'ECONOMY', 'AVAILABLE', f.base_price FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'E4D', 'ECONOMY', 'AVAILABLE', f.base_price FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'E4E', 'ECONOMY', 'AVAILABLE', f.base_price FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'E4F', 'ECONOMY', 'AVAILABLE', f.base_price FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'E5A', 'ECONOMY', 'AVAILABLE', f.base_price FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'E5B', 'ECONOMY', 'AVAILABLE', f.base_price FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'E5C', 'ECONOMY', 'AVAILABLE', f.base_price FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'E5D', 'ECONOMY', 'AVAILABLE', f.base_price FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'E5E', 'ECONOMY', 'AVAILABLE', f.base_price FROM flights f WHERE f.flight_number = 'SW101';
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, 'E5F', 'ECONOMY', 'AVAILABLE', f.base_price FROM flights f WHERE f.flight_number = 'SW101';

-- ============================================================
-- Seats for Flight SW103 (New Delhi -> Bangalore)
-- ============================================================
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, s.seat_num, s.s_class, 'AVAILABLE', CASE s.s_class WHEN 'FIRST' THEN f.base_price*3 WHEN 'BUSINESS' THEN f.base_price*2 ELSE f.base_price END
FROM flights f, (
  SELECT 'F1A' AS seat_num, 'FIRST' AS s_class UNION SELECT 'F1B','FIRST' UNION SELECT 'F2A','FIRST' UNION SELECT 'F2B','FIRST' UNION SELECT 'F2C','FIRST' UNION
  SELECT 'B1A','BUSINESS' UNION SELECT 'B1B','BUSINESS' UNION SELECT 'B1C','BUSINESS' UNION SELECT 'B1D','BUSINESS' UNION
  SELECT 'B2A','BUSINESS' UNION SELECT 'B2B','BUSINESS' UNION SELECT 'B2C','BUSINESS' UNION SELECT 'B2D','BUSINESS' UNION
  SELECT 'E1A','ECONOMY' UNION SELECT 'E1B','ECONOMY' UNION SELECT 'E1C','ECONOMY' UNION SELECT 'E1D','ECONOMY' UNION SELECT 'E1E','ECONOMY' UNION SELECT 'E1F','ECONOMY' UNION
  SELECT 'E2A','ECONOMY' UNION SELECT 'E2B','ECONOMY' UNION SELECT 'E2C','ECONOMY' UNION SELECT 'E2D','ECONOMY' UNION SELECT 'E2E','ECONOMY' UNION SELECT 'E2F','ECONOMY' UNION
  SELECT 'E3A','ECONOMY' UNION SELECT 'E3B','ECONOMY' UNION SELECT 'E3C','ECONOMY' UNION SELECT 'E3D','ECONOMY' UNION SELECT 'E3E','ECONOMY' UNION SELECT 'E3F','ECONOMY' UNION
  SELECT 'E4A','ECONOMY' UNION SELECT 'E4B','ECONOMY' UNION SELECT 'E4C','ECONOMY' UNION SELECT 'E4D','ECONOMY' UNION SELECT 'E4E','ECONOMY' UNION SELECT 'E4F','ECONOMY' UNION
  SELECT 'E5A','ECONOMY' UNION SELECT 'E5B','ECONOMY' UNION SELECT 'E5C','ECONOMY' UNION SELECT 'E5D','ECONOMY' UNION SELECT 'E5E','ECONOMY' UNION SELECT 'E5F','ECONOMY'
) AS s
WHERE f.flight_number = 'SW103';

-- ============================================================
-- Additional Flights: All major routes, both directions, multiple options per route
-- Dates: 2026-08-01 to 2026-08-05
-- ============================================================

-- DEL <-> BOM (multiple flights each day)
INSERT IGNORE INTO flights (flight_number, aircraft_id, origin_airport_id, destination_airport_id, departure_time, arrival_time, base_price, status, available_seats) VALUES
('SW201', 1, 1, 2, '2026-08-01 06:00:00', '2026-08-01 08:00:00', 4200.00, 'SCHEDULED', 150),
('SW202', 1, 2, 1, '2026-08-01 09:00:00', '2026-08-01 11:00:00', 4400.00, 'SCHEDULED', 150),
('SW203', 3, 1, 2, '2026-08-01 14:00:00', '2026-08-01 16:00:00', 4500.00, 'SCHEDULED', 180),
('SW204', 3, 2, 1, '2026-08-01 18:00:00', '2026-08-01 20:00:00', 4600.00, 'SCHEDULED', 180),
('SW205', 1, 1, 2, '2026-08-02 06:00:00', '2026-08-02 08:00:00', 4150.00, 'SCHEDULED', 150),
('SW206', 1, 2, 1, '2026-08-02 09:00:00', '2026-08-02 11:00:00', 4350.00, 'SCHEDULED', 150),
('SW207', 3, 1, 2, '2026-08-02 14:00:00', '2026-08-02 16:00:00', 4450.00, 'SCHEDULED', 180),
('SW208', 3, 2, 1, '2026-08-02 18:00:00', '2026-08-02 20:00:00', 4550.00, 'SCHEDULED', 180),
('SW209', 2, 1, 2, '2026-08-03 07:30:00', '2026-08-03 09:30:00', 5000.00, 'SCHEDULED', 300),
('SW210', 2, 2, 1, '2026-08-03 12:00:00', '2026-08-03 14:00:00', 5200.00, 'SCHEDULED', 300),
('SW211', 1, 1, 2, '2026-08-04 06:00:00', '2026-08-04 08:00:00', 4100.00, 'SCHEDULED', 150),
('SW212', 1, 2, 1, '2026-08-04 09:00:00', '2026-08-04 11:00:00', 4300.00, 'SCHEDULED', 150);

-- DEL <-> BLR
INSERT IGNORE INTO flights (flight_number, aircraft_id, origin_airport_id, destination_airport_id, departure_time, arrival_time, base_price, status, available_seats) VALUES
('SW301', 3, 1, 3, '2026-08-01 07:00:00', '2026-08-01 09:30:00', 5000.00, 'SCHEDULED', 180),
('SW302', 3, 3, 1, '2026-08-01 11:00:00', '2026-08-01 13:30:00', 5200.00, 'SCHEDULED', 180),
('SW303', 1, 1, 3, '2026-08-01 16:00:00', '2026-08-01 18:30:00', 4800.00, 'SCHEDULED', 150),
('SW304', 1, 3, 1, '2026-08-01 20:00:00', '2026-08-01 22:30:00', 4900.00, 'SCHEDULED', 150),
('SW305', 3, 1, 3, '2026-08-02 07:00:00', '2026-08-02 09:30:00', 4950.00, 'SCHEDULED', 180),
('SW306', 3, 3, 1, '2026-08-02 11:00:00', '2026-08-02 13:30:00', 5150.00, 'SCHEDULED', 180),
('SW307', 2, 1, 3, '2026-08-03 08:00:00', '2026-08-03 10:30:00', 5500.00, 'SCHEDULED', 300),
('SW308', 2, 3, 1, '2026-08-03 14:00:00', '2026-08-03 16:30:00', 5700.00, 'SCHEDULED', 300);

-- DEL <-> MAA
INSERT IGNORE INTO flights (flight_number, aircraft_id, origin_airport_id, destination_airport_id, departure_time, arrival_time, base_price, status, available_seats) VALUES
('SW401', 1, 1, 4, '2026-08-01 06:30:00', '2026-08-01 09:00:00', 5500.00, 'SCHEDULED', 150),
('SW402', 1, 4, 1, '2026-08-01 10:00:00', '2026-08-01 12:30:00', 5600.00, 'SCHEDULED', 150),
('SW403', 3, 1, 4, '2026-08-01 15:00:00', '2026-08-01 17:30:00', 5700.00, 'SCHEDULED', 180),
('SW404', 3, 4, 1, '2026-08-01 19:00:00', '2026-08-01 21:30:00', 5800.00, 'SCHEDULED', 180),
('SW405', 1, 1, 4, '2026-08-02 06:30:00', '2026-08-02 09:00:00', 5450.00, 'SCHEDULED', 150),
('SW406', 1, 4, 1, '2026-08-02 10:00:00', '2026-08-02 12:30:00', 5550.00, 'SCHEDULED', 150),
('SW407', 2, 1, 4, '2026-08-03 07:00:00', '2026-08-03 09:30:00', 6000.00, 'SCHEDULED', 300),
('SW408', 2, 4, 1, '2026-08-03 13:00:00', '2026-08-03 15:30:00', 6100.00, 'SCHEDULED', 300);

-- DEL <-> HYD
INSERT IGNORE INTO flights (flight_number, aircraft_id, origin_airport_id, destination_airport_id, departure_time, arrival_time, base_price, status, available_seats) VALUES
('SW501', 3, 1, 5, '2026-08-01 08:00:00', '2026-08-01 10:00:00', 4000.00, 'SCHEDULED', 180),
('SW502', 3, 5, 1, '2026-08-01 12:00:00', '2026-08-01 14:00:00', 4100.00, 'SCHEDULED', 180),
('SW503', 1, 1, 5, '2026-08-01 17:00:00', '2026-08-01 19:00:00', 3900.00, 'SCHEDULED', 150),
('SW504', 1, 5, 1, '2026-08-01 21:00:00', '2026-08-01 23:00:00', 4000.00, 'SCHEDULED', 150),
('SW505', 3, 1, 5, '2026-08-02 08:00:00', '2026-08-02 10:00:00', 3950.00, 'SCHEDULED', 180),
('SW506', 3, 5, 1, '2026-08-02 12:00:00', '2026-08-02 14:00:00', 4050.00, 'SCHEDULED', 180);

-- DEL <-> CCU
INSERT IGNORE INTO flights (flight_number, aircraft_id, origin_airport_id, destination_airport_id, departure_time, arrival_time, base_price, status, available_seats) VALUES
('SW601', 1, 1, 6, '2026-08-01 09:00:00', '2026-08-01 11:30:00', 4800.00, 'SCHEDULED', 150),
('SW602', 1, 6, 1, '2026-08-01 13:00:00', '2026-08-01 15:30:00', 4900.00, 'SCHEDULED', 150),
('SW603', 3, 1, 6, '2026-08-01 18:00:00', '2026-08-01 20:30:00', 4700.00, 'SCHEDULED', 180),
('SW604', 3, 6, 1, '2026-08-01 22:00:00', '2026-08-02 00:30:00', 4800.00, 'SCHEDULED', 180),
('SW605', 1, 1, 6, '2026-08-02 09:00:00', '2026-08-02 11:30:00', 4750.00, 'SCHEDULED', 150),
('SW606', 1, 6, 1, '2026-08-02 13:00:00', '2026-08-02 15:30:00', 4850.00, 'SCHEDULED', 150);

-- BOM <-> BLR
INSERT IGNORE INTO flights (flight_number, aircraft_id, origin_airport_id, destination_airport_id, departure_time, arrival_time, base_price, status, available_seats) VALUES
('SW701', 3, 2, 3, '2026-08-01 07:30:00', '2026-08-01 09:30:00', 3500.00, 'SCHEDULED', 180),
('SW702', 3, 3, 2, '2026-08-01 11:00:00', '2026-08-01 13:00:00', 3600.00, 'SCHEDULED', 180),
('SW703', 1, 2, 3, '2026-08-01 16:00:00', '2026-08-01 18:00:00', 3400.00, 'SCHEDULED', 150),
('SW704', 1, 3, 2, '2026-08-01 20:00:00', '2026-08-01 22:00:00', 3500.00, 'SCHEDULED', 150),
('SW705', 3, 2, 3, '2026-08-02 07:30:00', '2026-08-02 09:30:00', 3450.00, 'SCHEDULED', 180),
('SW706', 3, 3, 2, '2026-08-02 11:00:00', '2026-08-02 13:00:00', 3550.00, 'SCHEDULED', 180);

-- BOM <-> MAA
INSERT IGNORE INTO flights (flight_number, aircraft_id, origin_airport_id, destination_airport_id, departure_time, arrival_time, base_price, status, available_seats) VALUES
('SW801', 1, 2, 4, '2026-08-01 08:00:00', '2026-08-01 10:30:00', 4500.00, 'SCHEDULED', 150),
('SW802', 1, 4, 2, '2026-08-01 12:00:00', '2026-08-01 14:30:00', 4600.00, 'SCHEDULED', 150),
('SW803', 3, 2, 4, '2026-08-01 17:00:00', '2026-08-01 19:30:00', 4400.00, 'SCHEDULED', 180),
('SW804', 3, 4, 2, '2026-08-01 21:00:00', '2026-08-01 23:30:00', 4500.00, 'SCHEDULED', 180);

-- BOM <-> GOI
INSERT IGNORE INTO flights (flight_number, aircraft_id, origin_airport_id, destination_airport_id, departure_time, arrival_time, base_price, status, available_seats) VALUES
('SW901', 3, 2, 7, '2026-08-01 09:00:00', '2026-08-01 10:30:00', 2500.00, 'SCHEDULED', 180),
('SW902', 3, 7, 2, '2026-08-01 12:00:00', '2026-08-01 13:30:00', 2600.00, 'SCHEDULED', 180),
('SW903', 1, 2, 7, '2026-08-01 16:00:00', '2026-08-01 17:30:00', 2400.00, 'SCHEDULED', 150),
('SW904', 1, 7, 2, '2026-08-01 19:00:00', '2026-08-01 20:30:00', 2500.00, 'SCHEDULED', 150);

-- BLR <-> MAA
INSERT IGNORE INTO flights (flight_number, aircraft_id, origin_airport_id, destination_airport_id, departure_time, arrival_time, base_price, status, available_seats) VALUES
('SW1001', 1, 3, 4, '2026-08-01 08:30:00', '2026-08-01 10:00:00', 3000.00, 'SCHEDULED', 150),
('SW1002', 1, 4, 3, '2026-08-01 12:00:00', '2026-08-01 13:30:00', 3100.00, 'SCHEDULED', 150),
('SW1003', 3, 3, 4, '2026-08-01 17:00:00', '2026-08-01 18:30:00', 2900.00, 'SCHEDULED', 180),
('SW1004', 3, 4, 3, '2026-08-01 20:00:00', '2026-08-01 21:30:00', 3000.00, 'SCHEDULED', 180);

-- HYD <-> CCU
INSERT IGNORE INTO flights (flight_number, aircraft_id, origin_airport_id, destination_airport_id, departure_time, arrival_time, base_price, status, available_seats) VALUES
('SW1101', 3, 5, 6, '2026-08-01 07:00:00', '2026-08-01 09:30:00', 3800.00, 'SCHEDULED', 180),
('SW1102', 3, 6, 5, '2026-08-01 11:00:00', '2026-08-01 13:30:00', 3900.00, 'SCHEDULED', 180),
('SW1103', 1, 5, 6, '2026-08-01 16:00:00', '2026-08-01 18:30:00', 3700.00, 'SCHEDULED', 150),
('SW1104', 1, 6, 5, '2026-08-01 20:00:00', '2026-08-01 22:30:00', 3800.00, 'SCHEDULED', 150);

-- DEL <-> DXB (multiple price tiers)
INSERT IGNORE INTO flights (flight_number, aircraft_id, origin_airport_id, destination_airport_id, departure_time, arrival_time, base_price, status, available_seats) VALUES
('SW1201', 2, 1, 10, '2026-08-01 02:00:00', '2026-08-01 06:00:00', 14000.00, 'SCHEDULED', 300),
('SW1202', 2, 10, 1, '2026-08-01 08:00:00', '2026-08-01 12:00:00', 14200.00, 'SCHEDULED', 300),
('SW1203', 4, 1, 10, '2026-08-01 10:00:00', '2026-08-01 14:00:00', 13500.00, 'SCHEDULED', 500),
('SW1204', 4, 10, 1, '2026-08-01 16:00:00', '2026-08-01 20:00:00', 13800.00, 'SCHEDULED', 500),
('SW1205', 2, 1, 10, '2026-08-02 02:00:00', '2026-08-02 06:00:00', 13900.00, 'SCHEDULED', 300),
('SW1206', 2, 10, 1, '2026-08-02 08:00:00', '2026-08-02 12:00:00', 14100.00, 'SCHEDULED', 300),
('SW1207', 4, 1, 10, '2026-08-02 14:00:00', '2026-08-02 18:00:00', 13200.00, 'SCHEDULED', 500),
('SW1208', 4, 10, 1, '2026-08-02 20:00:00', '2026-08-03 00:00:00', 13400.00, 'SCHEDULED', 500);

-- BOM <-> DXB
INSERT IGNORE INTO flights (flight_number, aircraft_id, origin_airport_id, destination_airport_id, departure_time, arrival_time, base_price, status, available_seats) VALUES
('SW1301', 2, 2, 10, '2026-08-01 03:00:00', '2026-08-01 06:30:00', 12000.00, 'SCHEDULED', 300),
('SW1302', 2, 10, 2, '2026-08-01 08:30:00', '2026-08-01 12:00:00', 12200.00, 'SCHEDULED', 300),
('SW1303', 4, 2, 10, '2026-08-01 11:00:00', '2026-08-01 14:30:00', 11500.00, 'SCHEDULED', 500),
('SW1304', 4, 10, 2, '2026-08-01 17:00:00', '2026-08-01 20:30:00', 11800.00, 'SCHEDULED', 500);

-- DEL <-> LHR
INSERT IGNORE INTO flights (flight_number, aircraft_id, origin_airport_id, destination_airport_id, departure_time, arrival_time, base_price, status, available_seats) VALUES
('SW1401', 4, 1, 9, '2026-08-01 01:00:00', '2026-08-01 13:00:00', 55000.00, 'SCHEDULED', 500),
('SW1402', 4, 9, 1, '2026-08-01 15:00:00', '2026-08-02 03:00:00', 56000.00, 'SCHEDULED', 500),
('SW1403', 2, 1, 9, '2026-08-02 02:00:00', '2026-08-02 14:00:00', 52000.00, 'SCHEDULED', 300),
('SW1404', 2, 9, 1, '2026-08-02 16:00:00', '2026-08-03 04:00:00', 53000.00, 'SCHEDULED', 300);

-- BOM <-> LHR
INSERT IGNORE INTO flights (flight_number, aircraft_id, origin_airport_id, destination_airport_id, departure_time, arrival_time, base_price, status, available_seats) VALUES
('SW1501', 4, 2, 9, '2026-08-01 02:00:00', '2026-08-01 14:00:00', 48000.00, 'SCHEDULED', 500),
('SW1502', 4, 9, 2, '2026-08-01 16:00:00', '2026-08-02 04:00:00', 49000.00, 'SCHEDULED', 500);

-- DEL <-> SIN
INSERT IGNORE INTO flights (flight_number, aircraft_id, origin_airport_id, destination_airport_id, departure_time, arrival_time, base_price, status, available_seats) VALUES
('SW1601', 2, 1, 11, '2026-08-01 05:00:00', '2026-08-01 11:30:00', 22000.00, 'SCHEDULED', 300),
('SW1602', 2, 11, 1, '2026-08-01 13:00:00', '2026-08-01 19:30:00', 22500.00, 'SCHEDULED', 300),
('SW1603', 4, 1, 11, '2026-08-01 09:00:00', '2026-08-01 15:30:00', 20000.00, 'SCHEDULED', 500),
('SW1604', 4, 11, 1, '2026-08-01 17:00:00', '2026-08-01 23:30:00', 20500.00, 'SCHEDULED', 500);

-- BOM <-> SIN
INSERT IGNORE INTO flights (flight_number, aircraft_id, origin_airport_id, destination_airport_id, departure_time, arrival_time, base_price, status, available_seats) VALUES
('SW1701', 2, 2, 11, '2026-08-01 04:00:00', '2026-08-01 10:30:00', 18000.00, 'SCHEDULED', 300),
('SW1702', 2, 11, 2, '2026-08-01 12:00:00', '2026-08-01 18:30:00', 18500.00, 'SCHEDULED', 300),
('SW1703', 4, 2, 11, '2026-08-01 07:00:00', '2026-08-01 13:30:00', 16000.00, 'SCHEDULED', 500),
('SW1704', 4, 11, 2, '2026-08-01 15:00:00', '2026-08-01 21:30:00', 16500.00, 'SCHEDULED', 500);

-- DEL <-> BKK
INSERT IGNORE INTO flights (flight_number, aircraft_id, origin_airport_id, destination_airport_id, departure_time, arrival_time, base_price, status, available_seats) VALUES
('SW1801', 3, 1, 12, '2026-08-01 06:00:00', '2026-08-01 11:30:00', 15000.00, 'SCHEDULED', 180),
('SW1802', 3, 12, 1, '2026-08-01 13:00:00', '2026-08-01 18:30:00', 15500.00, 'SCHEDULED', 180),
('SW1803', 2, 1, 12, '2026-08-01 10:00:00', '2026-08-01 15:30:00', 14000.00, 'SCHEDULED', 300),
('SW1804', 2, 12, 1, '2026-08-01 17:00:00', '2026-08-01 22:30:00', 14500.00, 'SCHEDULED', 300);

-- DEL <-> CDG
INSERT IGNORE INTO flights (flight_number, aircraft_id, origin_airport_id, destination_airport_id, departure_time, arrival_time, base_price, status, available_seats) VALUES
('SW1901', 4, 1, 14, '2026-08-01 01:30:00', '2026-08-01 13:30:00', 45000.00, 'SCHEDULED', 500),
('SW1902', 4, 14, 1, '2026-08-01 15:30:00', '2026-08-02 03:30:00', 46000.00, 'SCHEDULED', 500);

-- BLR <-> GOI
INSERT IGNORE INTO flights (flight_number, aircraft_id, origin_airport_id, destination_airport_id, departure_time, arrival_time, base_price, status, available_seats) VALUES
('SW2001', 3, 3, 7, '2026-08-01 10:00:00', '2026-08-01 12:00:00', 2800.00, 'SCHEDULED', 180),
('SW2002', 3, 7, 3, '2026-08-01 14:00:00', '2026-08-01 16:00:00', 2900.00, 'SCHEDULED', 180),
('SW2003', 1, 3, 7, '2026-08-01 18:00:00', '2026-08-01 20:00:00', 2700.00, 'SCHEDULED', 150),
('SW2004', 1, 7, 3, '2026-08-01 21:00:00', '2026-08-01 23:00:00', 2800.00, 'SCHEDULED', 150);

-- MAA <-> SIN
INSERT IGNORE INTO flights (flight_number, aircraft_id, origin_airport_id, destination_airport_id, departure_time, arrival_time, base_price, status, available_seats) VALUES
('SW2101', 2, 4, 11, '2026-08-01 07:00:00', '2026-08-01 12:00:00', 12000.00, 'SCHEDULED', 300),
('SW2102', 2, 11, 4, '2026-08-01 14:00:00', '2026-08-01 19:00:00', 12500.00, 'SCHEDULED', 300);

-- CCU <-> BKK
INSERT IGNORE INTO flights (flight_number, aircraft_id, origin_airport_id, destination_airport_id, departure_time, arrival_time, base_price, status, available_seats) VALUES
('SW2201', 3, 6, 12, '2026-08-01 08:00:00', '2026-08-01 13:30:00', 10000.00, 'SCHEDULED', 180),
('SW2202', 3, 12, 6, '2026-08-01 15:00:00', '2026-08-01 20:30:00', 10500.00, 'SCHEDULED', 180);

-- Additional low-fare flights under specific amounts
INSERT IGNORE INTO flights (flight_number, aircraft_id, origin_airport_id, destination_airport_id, departure_time, arrival_time, base_price, status, available_seats) VALUES
('SW3001', 1, 7, 2, '2026-08-03 08:00:00', '2026-08-03 09:30:00', 1800.00, 'SCHEDULED', 150),
('SW3002', 1, 2, 7, '2026-08-03 12:00:00', '2026-08-03 13:30:00', 1900.00, 'SCHEDULED', 150),
('SW3003', 3, 3, 7, '2026-08-03 09:00:00', '2026-08-03 11:00:00', 2200.00, 'SCHEDULED', 180),
('SW3004', 3, 7, 3, '2026-08-03 14:00:00', '2026-08-03 16:00:00', 2300.00, 'SCHEDULED', 180),
('SW3005', 1, 5, 6, '2026-08-03 07:00:00', '2026-08-03 09:30:00', 3200.00, 'SCHEDULED', 150),
('SW3006', 1, 6, 5, '2026-08-03 11:00:00', '2026-08-03 13:30:00', 3300.00, 'SCHEDULED', 150),
('SW3007', 3, 4, 3, '2026-08-03 08:00:00', '2026-08-03 09:30:00', 2600.00, 'SCHEDULED', 180),
('SW3008', 3, 3, 4, '2026-08-03 11:00:00', '2026-08-03 12:30:00', 2700.00, 'SCHEDULED', 180),
('SW3009', 1, 2, 3, '2026-08-04 06:00:00', '2026-08-04 08:00:00', 2800.00, 'SCHEDULED', 150),
('SW3010', 1, 3, 2, '2026-08-04 10:00:00', '2026-08-04 12:00:00', 2900.00, 'SCHEDULED', 150),
('SW3011', 3, 1, 6, '2026-08-04 07:00:00', '2026-08-04 09:30:00', 3500.00, 'SCHEDULED', 180),
('SW3012', 3, 6, 1, '2026-08-04 11:00:00', '2026-08-04 13:30:00', 3600.00, 'SCHEDULED', 180);

-- ============================================================
-- Extended Flights: July 24 - August 24
-- All major domestic and international routes
-- ============================================================

-- July 24 flights
INSERT IGNORE INTO flights (flight_number, aircraft_id, origin_airport_id, destination_airport_id, departure_time, arrival_time, base_price, status, available_seats) VALUES
('SW4001', 1, 1, 2, '2026-07-24 06:00:00', '2026-07-24 08:00:00', 4300.00, 'SCHEDULED', 150),
('SW4002', 1, 2, 1, '2026-07-24 10:00:00', '2026-07-24 12:00:00', 4500.00, 'SCHEDULED', 150),
('SW4003', 3, 1, 3, '2026-07-24 07:00:00', '2026-07-24 09:30:00', 5100.00, 'SCHEDULED', 180),
('SW4004', 3, 3, 1, '2026-07-24 15:00:00', '2026-07-24 17:30:00', 5300.00, 'SCHEDULED', 180),
('SW4005', 1, 2, 3, '2026-07-24 08:00:00', '2026-07-24 10:00:00', 3600.00, 'SCHEDULED', 150),
('SW4006', 1, 3, 2, '2026-07-24 14:00:00', '2026-07-24 16:00:00', 3700.00, 'SCHEDULED', 150),
('SW4007', 2, 1, 10, '2026-07-24 02:00:00', '2026-07-24 06:00:00', 14500.00, 'SCHEDULED', 300),
('SW4008', 2, 10, 1, '2026-07-24 08:00:00', '2026-07-24 12:00:00', 14700.00, 'SCHEDULED', 300),
('SW4009', 4, 1, 10, '2026-07-24 10:00:00', '2026-07-24 14:00:00', 13800.00, 'SCHEDULED', 500),
('SW4010', 4, 10, 1, '2026-07-24 16:00:00', '2026-07-24 20:00:00', 14000.00, 'SCHEDULED', 500),
('SW4011', 2, 1, 9, '2026-07-24 01:00:00', '2026-07-24 13:00:00', 54000.00, 'SCHEDULED', 300),
('SW4012', 2, 9, 1, '2026-07-24 15:00:00', '2026-07-25 03:00:00', 55000.00, 'SCHEDULED', 300),
('SW4013', 1, 1, 11, '2026-07-24 05:00:00', '2026-07-24 11:30:00', 21500.00, 'SCHEDULED', 150),
('SW4014', 1, 11, 1, '2026-07-24 13:00:00', '2026-07-24 19:30:00', 22000.00, 'SCHEDULED', 150),
('SW4015', 3, 1, 12, '2026-07-24 06:00:00', '2026-07-24 11:30:00', 14800.00, 'SCHEDULED', 180),
('SW4016', 3, 12, 1, '2026-07-24 13:00:00', '2026-07-24 18:30:00', 15300.00, 'SCHEDULED', 180),
('SW4017', 4, 1, 14, '2026-07-24 01:30:00', '2026-07-24 13:30:00', 46000.00, 'SCHEDULED', 500),
('SW4018', 4, 14, 1, '2026-07-24 15:30:00', '2026-07-25 03:30:00', 47000.00, 'SCHEDULED', 500),
('SW4019', 1, 1, 4, '2026-07-24 06:30:00', '2026-07-24 09:00:00', 5600.00, 'SCHEDULED', 150),
('SW4020', 1, 4, 1, '2026-07-24 10:00:00', '2026-07-24 12:30:00', 5700.00, 'SCHEDULED', 150),
('SW4021', 3, 1, 5, '2026-07-24 08:00:00', '2026-07-24 10:00:00', 4100.00, 'SCHEDULED', 180),
('SW4022', 3, 5, 1, '2026-07-24 12:00:00', '2026-07-24 14:00:00', 4200.00, 'SCHEDULED', 180),
('SW4023', 1, 1, 6, '2026-07-24 09:00:00', '2026-07-24 11:30:00', 4900.00, 'SCHEDULED', 150),
('SW4024', 1, 6, 1, '2026-07-24 13:00:00', '2026-07-24 15:30:00', 5000.00, 'SCHEDULED', 150),
('SW4025', 2, 2, 10, '2026-07-24 03:00:00', '2026-07-24 06:30:00', 12500.00, 'SCHEDULED', 300),
('SW4026', 2, 10, 2, '2026-07-24 08:30:00', '2026-07-24 12:00:00', 12700.00, 'SCHEDULED', 300),
('SW4027', 4, 2, 10, '2026-07-24 11:00:00', '2026-07-24 14:30:00', 12000.00, 'SCHEDULED', 500),
('SW4028', 4, 10, 2, '2026-07-24 17:00:00', '2026-07-24 20:30:00', 12200.00, 'SCHEDULED', 500),
('SW4029', 4, 2, 9, '2026-07-24 02:00:00', '2026-07-24 14:00:00', 49000.00, 'SCHEDULED', 500),
('SW4030', 4, 9, 2, '2026-07-24 16:00:00', '2026-07-25 04:00:00', 50000.00, 'SCHEDULED', 500),
('SW4031', 2, 2, 11, '2026-07-24 04:00:00', '2026-07-24 10:30:00', 18500.00, 'SCHEDULED', 300),
('SW4032', 2, 11, 2, '2026-07-24 12:00:00', '2026-07-24 18:30:00', 19000.00, 'SCHEDULED', 300),
('SW4033', 3, 3, 7, '2026-07-24 10:00:00', '2026-07-24 12:00:00', 2900.00, 'SCHEDULED', 180),
('SW4034', 3, 7, 3, '2026-07-24 14:00:00', '2026-07-24 16:00:00', 3000.00, 'SCHEDULED', 180),
('SW4035', 1, 3, 4, '2026-07-24 08:30:00', '2026-07-24 10:00:00', 3100.00, 'SCHEDULED', 150),
('SW4036', 1, 4, 3, '2026-07-24 12:00:00', '2026-07-24 13:30:00', 3200.00, 'SCHEDULED', 150),
('SW4037', 3, 5, 6, '2026-07-24 07:00:00', '2026-07-24 09:30:00', 3900.00, 'SCHEDULED', 180),
('SW4038', 3, 6, 5, '2026-07-24 11:00:00', '2026-07-24 13:30:00', 4000.00, 'SCHEDULED', 180),
('SW4039', 3, 6, 12, '2026-07-24 08:00:00', '2026-07-24 13:30:00', 10500.00, 'SCHEDULED', 180),
('SW4040', 3, 12, 6, '2026-07-24 15:00:00', '2026-07-24 20:30:00', 11000.00, 'SCHEDULED', 180);

-- July 25-31 flights
INSERT IGNORE INTO flights (flight_number, aircraft_id, origin_airport_id, destination_airport_id, departure_time, arrival_time, base_price, status, available_seats) VALUES
('SW4041', 1, 1, 2, '2026-07-25 06:00:00', '2026-07-25 08:00:00', 4350.00, 'SCHEDULED', 150),
('SW4042', 1, 2, 1, '2026-07-25 10:00:00', '2026-07-25 12:00:00', 4550.00, 'SCHEDULED', 150),
('SW4043', 3, 1, 3, '2026-07-25 07:00:00', '2026-07-25 09:30:00', 5150.00, 'SCHEDULED', 180),
('SW4044', 3, 3, 1, '2026-07-25 15:00:00', '2026-07-25 17:30:00', 5350.00, 'SCHEDULED', 180),
('SW4045', 1, 2, 3, '2026-07-25 08:00:00', '2026-07-25 10:00:00', 3650.00, 'SCHEDULED', 150),
('SW4046', 1, 3, 2, '2026-07-25 14:00:00', '2026-07-25 16:00:00', 3750.00, 'SCHEDULED', 150),
('SW4047', 2, 1, 10, '2026-07-25 02:00:00', '2026-07-25 06:00:00', 14600.00, 'SCHEDULED', 300),
('SW4048', 2, 10, 1, '2026-07-25 08:00:00', '2026-07-25 12:00:00', 14800.00, 'SCHEDULED', 300),
('SW4049', 4, 1, 10, '2026-07-25 10:00:00', '2026-07-25 14:00:00', 13900.00, 'SCHEDULED', 500),
('SW4050', 4, 10, 1, '2026-07-25 16:00:00', '2026-07-25 20:00:00', 14100.00, 'SCHEDULED', 500),
('SW4051', 2, 1, 9, '2026-07-25 01:00:00', '2026-07-25 13:00:00', 54500.00, 'SCHEDULED', 300),
('SW4052', 2, 9, 1, '2026-07-25 15:00:00', '2026-07-26 03:00:00', 55500.00, 'SCHEDULED', 300),
('SW4053', 1, 1, 11, '2026-07-25 05:00:00', '2026-07-25 11:30:00', 21800.00, 'SCHEDULED', 150),
('SW4054', 1, 11, 1, '2026-07-25 13:00:00', '2026-07-25 19:30:00', 22300.00, 'SCHEDULED', 150),
('SW4055', 3, 1, 12, '2026-07-25 06:00:00', '2026-07-25 11:30:00', 15100.00, 'SCHEDULED', 180),
('SW4056', 3, 12, 1, '2026-07-25 13:00:00', '2026-07-25 18:30:00', 15600.00, 'SCHEDULED', 180),
('SW4057', 4, 1, 14, '2026-07-25 01:30:00', '2026-07-25 13:30:00', 46500.00, 'SCHEDULED', 500),
('SW4058', 4, 14, 1, '2026-07-25 15:30:00', '2026-07-26 03:30:00', 47500.00, 'SCHEDULED', 500),
('SW4059', 1, 1, 4, '2026-07-25 06:30:00', '2026-07-25 09:00:00', 5650.00, 'SCHEDULED', 150),
('SW4060', 1, 4, 1, '2026-07-25 10:00:00', '2026-07-25 12:30:00', 5750.00, 'SCHEDULED', 150),
('SW4061', 3, 1, 5, '2026-07-25 08:00:00', '2026-07-25 10:00:00', 4150.00, 'SCHEDULED', 180),
('SW4062', 3, 5, 1, '2026-07-25 12:00:00', '2026-07-25 14:00:00', 4250.00, 'SCHEDULED', 180),
('SW4063', 1, 1, 6, '2026-07-25 09:00:00', '2026-07-25 11:30:00', 4950.00, 'SCHEDULED', 150),
('SW4064', 1, 6, 1, '2026-07-25 13:00:00', '2026-07-25 15:30:00', 5050.00, 'SCHEDULED', 150),
('SW4065', 2, 2, 10, '2026-07-25 03:00:00', '2026-07-25 06:30:00', 12600.00, 'SCHEDULED', 300),
('SW4066', 2, 10, 2, '2026-07-25 08:30:00', '2026-07-25 12:00:00', 12800.00, 'SCHEDULED', 300),
('SW4067', 4, 2, 10, '2026-07-25 11:00:00', '2026-07-25 14:30:00', 12100.00, 'SCHEDULED', 500),
('SW4068', 4, 10, 2, '2026-07-25 17:00:00', '2026-07-25 20:30:00', 12300.00, 'SCHEDULED', 500),
('SW4069', 4, 2, 9, '2026-07-25 02:00:00', '2026-07-25 14:00:00', 49500.00, 'SCHEDULED', 500),
('SW4070', 4, 9, 2, '2026-07-25 16:00:00', '2026-07-26 04:00:00', 50500.00, 'SCHEDULED', 500),
('SW4071', 2, 2, 11, '2026-07-25 04:00:00', '2026-07-25 10:30:00', 18700.00, 'SCHEDULED', 300),
('SW4072', 2, 11, 2, '2026-07-25 12:00:00', '2026-07-25 18:30:00', 19200.00, 'SCHEDULED', 300),
('SW4073', 3, 3, 7, '2026-07-25 10:00:00', '2026-07-25 12:00:00', 2950.00, 'SCHEDULED', 180),
('SW4074', 3, 7, 3, '2026-07-25 14:00:00', '2026-07-25 16:00:00', 3050.00, 'SCHEDULED', 180),
('SW4075', 1, 3, 4, '2026-07-25 08:30:00', '2026-07-25 10:00:00', 3150.00, 'SCHEDULED', 150),
('SW4076', 1, 4, 3, '2026-07-25 12:00:00', '2026-07-25 13:30:00', 3250.00, 'SCHEDULED', 150),
('SW4077', 3, 5, 6, '2026-07-25 07:00:00', '2026-07-25 09:30:00', 3950.00, 'SCHEDULED', 180),
('SW4078', 3, 6, 5, '2026-07-25 11:00:00', '2026-07-25 13:30:00', 4050.00, 'SCHEDULED', 180),
('SW4079', 3, 6, 12, '2026-07-25 08:00:00', '2026-07-25 13:30:00', 10600.00, 'SCHEDULED', 180),
('SW4080', 3, 12, 6, '2026-07-25 15:00:00', '2026-07-25 20:30:00', 11100.00, 'SCHEDULED', 180);

-- July 26 flights
INSERT IGNORE INTO flights (flight_number, aircraft_id, origin_airport_id, destination_airport_id, departure_time, arrival_time, base_price, status, available_seats) VALUES
('SW4081', 1, 1, 2, '2026-07-26 06:00:00', '2026-07-26 08:00:00', 4400.00, 'SCHEDULED', 150),
('SW4082', 1, 2, 1, '2026-07-26 10:00:00', '2026-07-26 12:00:00', 4600.00, 'SCHEDULED', 150),
('SW4083', 3, 1, 3, '2026-07-26 07:00:00', '2026-07-26 09:30:00', 5200.00, 'SCHEDULED', 180),
('SW4084', 3, 3, 1, '2026-07-26 15:00:00', '2026-07-26 17:30:00', 5400.00, 'SCHEDULED', 180),
('SW4085', 1, 2, 3, '2026-07-26 08:00:00', '2026-07-26 10:00:00', 3650.00, 'SCHEDULED', 150),
('SW4086', 1, 3, 2, '2026-07-26 14:00:00', '2026-07-26 16:00:00', 3750.00, 'SCHEDULED', 150),
('SW4087', 2, 1, 10, '2026-07-26 02:00:00', '2026-07-26 06:00:00', 14600.00, 'SCHEDULED', 300),
('SW4088', 2, 10, 1, '2026-07-26 08:00:00', '2026-07-26 12:00:00', 14800.00, 'SCHEDULED', 300),
('SW4089', 4, 1, 10, '2026-07-26 10:00:00', '2026-07-26 14:00:00', 13900.00, 'SCHEDULED', 500),
('SW4090', 4, 10, 1, '2026-07-26 16:00:00', '2026-07-26 20:00:00', 14100.00, 'SCHEDULED', 500),
('SW4091', 2, 1, 9, '2026-07-26 01:00:00', '2026-07-26 13:00:00', 54500.00, 'SCHEDULED', 300),
('SW4092', 2, 9, 1, '2026-07-26 15:00:00', '2026-07-27 03:00:00', 55500.00, 'SCHEDULED', 300),
('SW4093', 1, 1, 11, '2026-07-26 05:00:00', '2026-07-26 11:30:00', 21800.00, 'SCHEDULED', 150),
('SW4094', 1, 11, 1, '2026-07-26 13:00:00', '2026-07-26 19:30:00', 22300.00, 'SCHEDULED', 150),
('SW4095', 3, 1, 12, '2026-07-26 06:00:00', '2026-07-26 11:30:00', 15100.00, 'SCHEDULED', 180),
('SW4096', 3, 12, 1, '2026-07-26 13:00:00', '2026-07-26 18:30:00', 15600.00, 'SCHEDULED', 180),
('SW4097', 4, 1, 14, '2026-07-26 01:30:00', '2026-07-26 13:30:00', 46500.00, 'SCHEDULED', 500),
('SW4098', 4, 14, 1, '2026-07-26 15:30:00', '2026-07-27 03:30:00', 47500.00, 'SCHEDULED', 500),
('SW4099', 1, 1, 4, '2026-07-26 06:30:00', '2026-07-26 09:00:00', 5650.00, 'SCHEDULED', 150),
('SW4100', 1, 4, 1, '2026-07-26 10:00:00', '2026-07-26 12:30:00', 5750.00, 'SCHEDULED', 150),
('SW4101', 3, 1, 5, '2026-07-26 08:00:00', '2026-07-26 10:00:00', 4150.00, 'SCHEDULED', 180),
('SW4102', 3, 5, 1, '2026-07-26 12:00:00', '2026-07-26 14:00:00', 4250.00, 'SCHEDULED', 180),
('SW4103', 1, 1, 6, '2026-07-26 09:00:00', '2026-07-26 11:30:00', 4950.00, 'SCHEDULED', 150),
('SW4104', 1, 6, 1, '2026-07-26 13:00:00', '2026-07-26 15:30:00', 5050.00, 'SCHEDULED', 150),
('SW4105', 2, 2, 10, '2026-07-26 03:00:00', '2026-07-26 06:30:00', 12700.00, 'SCHEDULED', 300),
('SW4106', 2, 10, 2, '2026-07-26 08:30:00', '2026-07-26 12:00:00', 12900.00, 'SCHEDULED', 300),
('SW4107', 4, 2, 10, '2026-07-26 11:00:00', '2026-07-26 14:30:00', 12200.00, 'SCHEDULED', 500),
('SW4108', 4, 10, 2, '2026-07-26 17:00:00', '2026-07-26 20:30:00', 12400.00, 'SCHEDULED', 500),
('SW4109', 4, 2, 9, '2026-07-26 02:00:00', '2026-07-26 14:00:00', 50000.00, 'SCHEDULED', 500),
('SW4110', 4, 9, 2, '2026-07-26 16:00:00', '2026-07-27 04:00:00', 51000.00, 'SCHEDULED', 500),
('SW4111', 2, 2, 11, '2026-07-26 04:00:00', '2026-07-26 10:30:00', 18800.00, 'SCHEDULED', 300),
('SW4112', 2, 11, 2, '2026-07-26 12:00:00', '2026-07-26 18:30:00', 19300.00, 'SCHEDULED', 300),
('SW4113', 3, 3, 7, '2026-07-26 10:00:00', '2026-07-26 12:00:00', 3000.00, 'SCHEDULED', 180),
('SW4114', 3, 7, 3, '2026-07-26 14:00:00', '2026-07-26 16:00:00', 3100.00, 'SCHEDULED', 180),
('SW4115', 1, 3, 4, '2026-07-26 08:30:00', '2026-07-26 10:00:00', 3200.00, 'SCHEDULED', 150),
('SW4116', 1, 4, 3, '2026-07-26 12:00:00', '2026-07-26 13:30:00', 3300.00, 'SCHEDULED', 150),
('SW4117', 3, 5, 6, '2026-07-26 07:00:00', '2026-07-26 09:30:00', 4000.00, 'SCHEDULED', 180),
('SW4118', 3, 6, 5, '2026-07-26 11:00:00', '2026-07-26 13:30:00', 4100.00, 'SCHEDULED', 180),
('SW4119', 3, 6, 12, '2026-07-26 08:00:00', '2026-07-26 13:30:00', 10700.00, 'SCHEDULED', 180),
('SW4120', 3, 12, 6, '2026-07-26 15:00:00', '2026-07-26 20:30:00', 11200.00, 'SCHEDULED', 180);

-- July 27 flights
INSERT IGNORE INTO flights (flight_number, aircraft_id, origin_airport_id, destination_airport_id, departure_time, arrival_time, base_price, status, available_seats) VALUES
('SW4121', 1, 1, 2, '2026-07-27 06:00:00', '2026-07-27 08:00:00', 4450.00, 'SCHEDULED', 150),
('SW4122', 1, 2, 1, '2026-07-27 10:00:00', '2026-07-27 12:00:00', 4650.00, 'SCHEDULED', 150),
('SW4123', 3, 1, 3, '2026-07-27 07:00:00', '2026-07-27 09:30:00', 5250.00, 'SCHEDULED', 180),
('SW4124', 3, 3, 1, '2026-07-27 15:00:00', '2026-07-27 17:30:00', 5450.00, 'SCHEDULED', 180),
('SW4125', 1, 2, 3, '2026-07-27 08:00:00', '2026-07-27 10:00:00', 3700.00, 'SCHEDULED', 150),
('SW4126', 1, 3, 2, '2026-07-27 14:00:00', '2026-07-27 16:00:00', 3800.00, 'SCHEDULED', 150),
('SW4127', 2, 1, 10, '2026-07-27 02:00:00', '2026-07-27 06:00:00', 14700.00, 'SCHEDULED', 300),
('SW4128', 2, 10, 1, '2026-07-27 08:00:00', '2026-07-27 12:00:00', 14900.00, 'SCHEDULED', 300),
('SW4129', 4, 1, 10, '2026-07-27 10:00:00', '2026-07-27 14:00:00', 14000.00, 'SCHEDULED', 500),
('SW4130', 4, 10, 1, '2026-07-27 16:00:00', '2026-07-27 20:00:00', 14200.00, 'SCHEDULED', 500),
('SW4131', 2, 1, 9, '2026-07-27 01:00:00', '2026-07-27 13:00:00', 55000.00, 'SCHEDULED', 300),
('SW4132', 2, 9, 1, '2026-07-27 15:00:00', '2026-07-28 03:00:00', 56000.00, 'SCHEDULED', 300),
('SW4133', 1, 1, 11, '2026-07-27 05:00:00', '2026-07-27 11:30:00', 22000.00, 'SCHEDULED', 150),
('SW4134', 1, 11, 1, '2026-07-27 13:00:00', '2026-07-27 19:30:00', 22500.00, 'SCHEDULED', 150),
('SW4135', 3, 1, 12, '2026-07-27 06:00:00', '2026-07-27 11:30:00', 15200.00, 'SCHEDULED', 180),
('SW4136', 3, 12, 1, '2026-07-27 13:00:00', '2026-07-27 18:30:00', 15700.00, 'SCHEDULED', 180),
('SW4137', 4, 1, 14, '2026-07-27 01:30:00', '2026-07-27 13:30:00', 47000.00, 'SCHEDULED', 500),
('SW4138', 4, 14, 1, '2026-07-27 15:30:00', '2026-07-28 03:30:00', 48000.00, 'SCHEDULED', 500),
('SW4139', 1, 1, 4, '2026-07-27 06:30:00', '2026-07-27 09:00:00', 5700.00, 'SCHEDULED', 150),
('SW4140', 1, 4, 1, '2026-07-27 10:00:00', '2026-07-27 12:30:00', 5800.00, 'SCHEDULED', 150),
('SW4141', 3, 1, 5, '2026-07-27 08:00:00', '2026-07-27 10:00:00', 4200.00, 'SCHEDULED', 180),
('SW4142', 3, 5, 1, '2026-07-27 12:00:00', '2026-07-27 14:00:00', 4300.00, 'SCHEDULED', 180),
('SW4143', 1, 1, 6, '2026-07-27 09:00:00', '2026-07-27 11:30:00', 5000.00, 'SCHEDULED', 150),
('SW4144', 1, 6, 1, '2026-07-27 13:00:00', '2026-07-27 15:30:00', 5100.00, 'SCHEDULED', 150),
('SW4145', 2, 2, 10, '2026-07-27 03:00:00', '2026-07-27 06:30:00', 12800.00, 'SCHEDULED', 300),
('SW4146', 2, 10, 2, '2026-07-27 08:30:00', '2026-07-27 12:00:00', 13000.00, 'SCHEDULED', 300),
('SW4147', 4, 2, 10, '2026-07-27 11:00:00', '2026-07-27 14:30:00', 12300.00, 'SCHEDULED', 500),
('SW4148', 4, 10, 2, '2026-07-27 17:00:00', '2026-07-27 20:30:00', 12500.00, 'SCHEDULED', 500),
('SW4149', 4, 2, 9, '2026-07-27 02:00:00', '2026-07-27 14:00:00', 50500.00, 'SCHEDULED', 500),
('SW4150', 4, 9, 2, '2026-07-27 16:00:00', '2026-07-28 04:00:00', 51500.00, 'SCHEDULED', 500),
('SW4151', 2, 2, 11, '2026-07-27 04:00:00', '2026-07-27 10:30:00', 19000.00, 'SCHEDULED', 300),
('SW4152', 2, 11, 2, '2026-07-27 12:00:00', '2026-07-27 18:30:00', 19500.00, 'SCHEDULED', 300),
('SW4153', 3, 3, 7, '2026-07-27 10:00:00', '2026-07-27 12:00:00', 3050.00, 'SCHEDULED', 180),
('SW4154', 3, 7, 3, '2026-07-27 14:00:00', '2026-07-27 16:00:00', 3150.00, 'SCHEDULED', 180),
('SW4155', 1, 3, 4, '2026-07-27 08:30:00', '2026-07-27 10:00:00', 3250.00, 'SCHEDULED', 150),
('SW4156', 1, 4, 3, '2026-07-27 12:00:00', '2026-07-27 13:30:00', 3350.00, 'SCHEDULED', 150),
('SW4157', 3, 5, 6, '2026-07-27 07:00:00', '2026-07-27 09:30:00', 4050.00, 'SCHEDULED', 180),
('SW4158', 3, 6, 5, '2026-07-27 11:00:00', '2026-07-27 13:30:00', 4150.00, 'SCHEDULED', 180),
('SW4159', 3, 6, 12, '2026-07-27 08:00:00', '2026-07-27 13:30:00', 10800.00, 'SCHEDULED', 180),
('SW4160', 3, 12, 6, '2026-07-27 15:00:00', '2026-07-27 20:30:00', 11300.00, 'SCHEDULED', 180);

-- July 28 flights
INSERT IGNORE INTO flights (flight_number, aircraft_id, origin_airport_id, destination_airport_id, departure_time, arrival_time, base_price, status, available_seats) VALUES
('SW4161', 1, 1, 2, '2026-07-28 06:00:00', '2026-07-28 08:00:00', 4500.00, 'SCHEDULED', 150),
('SW4162', 1, 2, 1, '2026-07-28 10:00:00', '2026-07-28 12:00:00', 4700.00, 'SCHEDULED', 150),
('SW4163', 3, 1, 3, '2026-07-28 07:00:00', '2026-07-28 09:30:00', 5300.00, 'SCHEDULED', 180),
('SW4164', 3, 3, 1, '2026-07-28 15:00:00', '2026-07-28 17:30:00', 5500.00, 'SCHEDULED', 180),
('SW4165', 1, 2, 3, '2026-07-28 08:00:00', '2026-07-28 10:00:00', 3750.00, 'SCHEDULED', 150),
('SW4166', 1, 3, 2, '2026-07-28 14:00:00', '2026-07-28 16:00:00', 3850.00, 'SCHEDULED', 150),
('SW4167', 2, 1, 10, '2026-07-28 02:00:00', '2026-07-28 06:00:00', 14800.00, 'SCHEDULED', 300),
('SW4168', 2, 10, 1, '2026-07-28 08:00:00', '2026-07-28 12:00:00', 15000.00, 'SCHEDULED', 300),
('SW4169', 4, 1, 10, '2026-07-28 10:00:00', '2026-07-28 14:00:00', 14100.00, 'SCHEDULED', 500),
('SW4170', 4, 10, 1, '2026-07-28 16:00:00', '2026-07-28 20:00:00', 14300.00, 'SCHEDULED', 500),
('SW4171', 2, 1, 9, '2026-07-28 01:00:00', '2026-07-28 13:00:00', 55500.00, 'SCHEDULED', 300),
('SW4172', 2, 9, 1, '2026-07-28 15:00:00', '2026-07-29 03:00:00', 56500.00, 'SCHEDULED', 300),
('SW4173', 1, 1, 11, '2026-07-28 05:00:00', '2026-07-28 11:30:00', 22200.00, 'SCHEDULED', 150),
('SW4174', 1, 11, 1, '2026-07-28 13:00:00', '2026-07-28 19:30:00', 22700.00, 'SCHEDULED', 150),
('SW4175', 3, 1, 12, '2026-07-28 06:00:00', '2026-07-28 11:30:00', 15300.00, 'SCHEDULED', 180),
('SW4176', 3, 12, 1, '2026-07-28 13:00:00', '2026-07-28 18:30:00', 15800.00, 'SCHEDULED', 180),
('SW4177', 4, 1, 14, '2026-07-28 01:30:00', '2026-07-28 13:30:00', 47500.00, 'SCHEDULED', 500),
('SW4178', 4, 14, 1, '2026-07-28 15:30:00', '2026-07-29 03:30:00', 48500.00, 'SCHEDULED', 500),
('SW4179', 1, 1, 4, '2026-07-28 06:30:00', '2026-07-28 09:00:00', 5750.00, 'SCHEDULED', 150),
('SW4180', 1, 4, 1, '2026-07-28 10:00:00', '2026-07-28 12:30:00', 5850.00, 'SCHEDULED', 150),
('SW4181', 3, 1, 5, '2026-07-28 08:00:00', '2026-07-28 10:00:00', 4250.00, 'SCHEDULED', 180),
('SW4182', 3, 5, 1, '2026-07-28 12:00:00', '2026-07-28 14:00:00', 4350.00, 'SCHEDULED', 180),
('SW4183', 1, 1, 6, '2026-07-28 09:00:00', '2026-07-28 11:30:00', 5050.00, 'SCHEDULED', 150),
('SW4184', 1, 6, 1, '2026-07-28 13:00:00', '2026-07-28 15:30:00', 5150.00, 'SCHEDULED', 150),
('SW4185', 2, 2, 10, '2026-07-28 03:00:00', '2026-07-28 06:30:00', 12900.00, 'SCHEDULED', 300),
('SW4186', 2, 10, 2, '2026-07-28 08:30:00', '2026-07-28 12:00:00', 13100.00, 'SCHEDULED', 300),
('SW4187', 4, 2, 10, '2026-07-28 11:00:00', '2026-07-28 14:30:00', 12400.00, 'SCHEDULED', 500),
('SW4188', 4, 10, 2, '2026-07-28 17:00:00', '2026-07-28 20:30:00', 12600.00, 'SCHEDULED', 500),
('SW4189', 4, 2, 9, '2026-07-28 02:00:00', '2026-07-28 14:00:00', 51000.00, 'SCHEDULED', 500),
('SW4190', 4, 9, 2, '2026-07-28 16:00:00', '2026-07-29 04:00:00', 52000.00, 'SCHEDULED', 500),
('SW4191', 2, 2, 11, '2026-07-28 04:00:00', '2026-07-28 10:30:00', 19200.00, 'SCHEDULED', 300),
('SW4192', 2, 11, 2, '2026-07-28 12:00:00', '2026-07-28 18:30:00', 19700.00, 'SCHEDULED', 300),
('SW4193', 3, 3, 7, '2026-07-28 10:00:00', '2026-07-28 12:00:00', 3100.00, 'SCHEDULED', 180),
('SW4194', 3, 7, 3, '2026-07-28 14:00:00', '2026-07-28 16:00:00', 3200.00, 'SCHEDULED', 180),
('SW4195', 1, 3, 4, '2026-07-28 08:30:00', '2026-07-28 10:00:00', 3300.00, 'SCHEDULED', 150),
('SW4196', 1, 4, 3, '2026-07-28 12:00:00', '2026-07-28 13:30:00', 3400.00, 'SCHEDULED', 150),
('SW4197', 3, 5, 6, '2026-07-28 07:00:00', '2026-07-28 09:30:00', 4100.00, 'SCHEDULED', 180),
('SW4198', 3, 6, 5, '2026-07-28 11:00:00', '2026-07-28 13:30:00', 4200.00, 'SCHEDULED', 180),
('SW4199', 3, 6, 12, '2026-07-28 08:00:00', '2026-07-28 13:30:00', 10900.00, 'SCHEDULED', 180),
('SW4200', 3, 12, 6, '2026-07-28 15:00:00', '2026-07-28 20:30:00', 11400.00, 'SCHEDULED', 180);

-- July 29 flights
INSERT IGNORE INTO flights (flight_number, aircraft_id, origin_airport_id, destination_airport_id, departure_time, arrival_time, base_price, status, available_seats) VALUES
('SW4201', 1, 1, 2, '2026-07-29 06:00:00', '2026-07-29 08:00:00', 4550.00, 'SCHEDULED', 150),
('SW4202', 1, 2, 1, '2026-07-29 10:00:00', '2026-07-29 12:00:00', 4750.00, 'SCHEDULED', 150),
('SW4203', 3, 1, 3, '2026-07-29 07:00:00', '2026-07-29 09:30:00', 5350.00, 'SCHEDULED', 180),
('SW4204', 3, 3, 1, '2026-07-29 15:00:00', '2026-07-29 17:30:00', 5550.00, 'SCHEDULED', 180),
('SW4205', 1, 2, 3, '2026-07-29 08:00:00', '2026-07-29 10:00:00', 3800.00, 'SCHEDULED', 150),
('SW4206', 1, 3, 2, '2026-07-29 14:00:00', '2026-07-29 16:00:00', 3900.00, 'SCHEDULED', 150),
('SW4207', 2, 1, 10, '2026-07-29 02:00:00', '2026-07-29 06:00:00', 14900.00, 'SCHEDULED', 300),
('SW4208', 2, 10, 1, '2026-07-29 08:00:00', '2026-07-29 12:00:00', 15100.00, 'SCHEDULED', 300),
('SW4209', 4, 1, 10, '2026-07-29 10:00:00', '2026-07-29 14:00:00', 14200.00, 'SCHEDULED', 500),
('SW4210', 4, 10, 1, '2026-07-29 16:00:00', '2026-07-29 20:00:00', 14400.00, 'SCHEDULED', 500),
('SW4211', 2, 1, 9, '2026-07-29 01:00:00', '2026-07-29 13:00:00', 56000.00, 'SCHEDULED', 300),
('SW4212', 2, 9, 1, '2026-07-29 15:00:00', '2026-07-30 03:00:00', 57000.00, 'SCHEDULED', 300),
('SW4213', 1, 1, 11, '2026-07-29 05:00:00', '2026-07-29 11:30:00', 22400.00, 'SCHEDULED', 150),
('SW4214', 1, 11, 1, '2026-07-29 13:00:00', '2026-07-29 19:30:00', 22900.00, 'SCHEDULED', 150),
('SW4215', 3, 1, 12, '2026-07-29 06:00:00', '2026-07-29 11:30:00', 15400.00, 'SCHEDULED', 180),
('SW4216', 3, 12, 1, '2026-07-29 13:00:00', '2026-07-29 18:30:00', 15900.00, 'SCHEDULED', 180),
('SW4217', 4, 1, 14, '2026-07-29 01:30:00', '2026-07-29 13:30:00', 48000.00, 'SCHEDULED', 500),
('SW4218', 4, 14, 1, '2026-07-29 15:30:00', '2026-07-30 03:30:00', 49000.00, 'SCHEDULED', 500),
('SW4219', 1, 1, 4, '2026-07-29 06:30:00', '2026-07-29 09:00:00', 5800.00, 'SCHEDULED', 150),
('SW4220', 1, 4, 1, '2026-07-29 10:00:00', '2026-07-29 12:30:00', 5900.00, 'SCHEDULED', 150),
('SW4221', 3, 1, 5, '2026-07-29 08:00:00', '2026-07-29 10:00:00', 4300.00, 'SCHEDULED', 180),
('SW4222', 3, 5, 1, '2026-07-29 12:00:00', '2026-07-29 14:00:00', 4400.00, 'SCHEDULED', 180),
('SW4223', 1, 1, 6, '2026-07-29 09:00:00', '2026-07-29 11:30:00', 5100.00, 'SCHEDULED', 150),
('SW4224', 1, 6, 1, '2026-07-29 13:00:00', '2026-07-29 15:30:00', 5200.00, 'SCHEDULED', 150),
('SW4225', 2, 2, 10, '2026-07-29 03:00:00', '2026-07-29 06:30:00', 13000.00, 'SCHEDULED', 300),
('SW4226', 2, 10, 2, '2026-07-29 08:30:00', '2026-07-29 12:00:00', 13200.00, 'SCHEDULED', 300),
('SW4227', 4, 2, 10, '2026-07-29 11:00:00', '2026-07-29 14:30:00', 12500.00, 'SCHEDULED', 500),
('SW4228', 4, 10, 2, '2026-07-29 17:00:00', '2026-07-29 20:30:00', 12700.00, 'SCHEDULED', 500),
('SW4229', 4, 2, 9, '2026-07-29 02:00:00', '2026-07-29 14:00:00', 51500.00, 'SCHEDULED', 500),
('SW4230', 4, 9, 2, '2026-07-29 16:00:00', '2026-07-30 04:00:00', 52500.00, 'SCHEDULED', 500),
('SW4231', 2, 2, 11, '2026-07-29 04:00:00', '2026-07-29 10:30:00', 19400.00, 'SCHEDULED', 300),
('SW4232', 2, 11, 2, '2026-07-29 12:00:00', '2026-07-29 18:30:00', 19900.00, 'SCHEDULED', 300),
('SW4233', 3, 3, 7, '2026-07-29 10:00:00', '2026-07-29 12:00:00', 3150.00, 'SCHEDULED', 180),
('SW4234', 3, 7, 3, '2026-07-29 14:00:00', '2026-07-29 16:00:00', 3250.00, 'SCHEDULED', 180),
('SW4235', 1, 3, 4, '2026-07-29 08:30:00', '2026-07-29 10:00:00', 3350.00, 'SCHEDULED', 150),
('SW4236', 1, 4, 3, '2026-07-29 12:00:00', '2026-07-29 13:30:00', 3450.00, 'SCHEDULED', 150),
('SW4237', 3, 5, 6, '2026-07-29 07:00:00', '2026-07-29 09:30:00', 4150.00, 'SCHEDULED', 180),
('SW4238', 3, 6, 5, '2026-07-29 11:00:00', '2026-07-29 13:30:00', 4250.00, 'SCHEDULED', 180),
('SW4239', 3, 6, 12, '2026-07-29 08:00:00', '2026-07-29 13:30:00', 11000.00, 'SCHEDULED', 180),
('SW4240', 3, 12, 6, '2026-07-29 15:00:00', '2026-07-29 20:30:00', 11500.00, 'SCHEDULED', 180);

-- July 30 flights
INSERT IGNORE INTO flights (flight_number, aircraft_id, origin_airport_id, destination_airport_id, departure_time, arrival_time, base_price, status, available_seats) VALUES
('SW4241', 1, 1, 2, '2026-07-30 06:00:00', '2026-07-30 08:00:00', 4600.00, 'SCHEDULED', 150),
('SW4242', 1, 2, 1, '2026-07-30 10:00:00', '2026-07-30 12:00:00', 4800.00, 'SCHEDULED', 150),
('SW4243', 3, 1, 3, '2026-07-30 07:00:00', '2026-07-30 09:30:00', 5400.00, 'SCHEDULED', 180),
('SW4244', 3, 3, 1, '2026-07-30 15:00:00', '2026-07-30 17:30:00', 5600.00, 'SCHEDULED', 180),
('SW4245', 1, 2, 3, '2026-07-30 08:00:00', '2026-07-30 10:00:00', 3850.00, 'SCHEDULED', 150),
('SW4246', 1, 3, 2, '2026-07-30 14:00:00', '2026-07-30 16:00:00', 3950.00, 'SCHEDULED', 150),
('SW4247', 2, 1, 10, '2026-07-30 02:00:00', '2026-07-30 06:00:00', 15000.00, 'SCHEDULED', 300),
('SW4248', 2, 10, 1, '2026-07-30 08:00:00', '2026-07-30 12:00:00', 15200.00, 'SCHEDULED', 300),
('SW4249', 4, 1, 10, '2026-07-30 10:00:00', '2026-07-30 14:00:00', 14300.00, 'SCHEDULED', 500),
('SW4250', 4, 10, 1, '2026-07-30 16:00:00', '2026-07-30 20:00:00', 14500.00, 'SCHEDULED', 500),
('SW4251', 2, 1, 9, '2026-07-30 01:00:00', '2026-07-30 13:00:00', 56500.00, 'SCHEDULED', 300),
('SW4252', 2, 9, 1, '2026-07-30 15:00:00', '2026-07-31 03:00:00', 57500.00, 'SCHEDULED', 300),
('SW4253', 1, 1, 11, '2026-07-30 05:00:00', '2026-07-30 11:30:00', 22600.00, 'SCHEDULED', 150),
('SW4254', 1, 11, 1, '2026-07-30 13:00:00', '2026-07-30 19:30:00', 23100.00, 'SCHEDULED', 150),
('SW4255', 3, 1, 12, '2026-07-30 06:00:00', '2026-07-30 11:30:00', 15500.00, 'SCHEDULED', 180),
('SW4256', 3, 12, 1, '2026-07-30 13:00:00', '2026-07-30 18:30:00', 16000.00, 'SCHEDULED', 180),
('SW4257', 4, 1, 14, '2026-07-30 01:30:00', '2026-07-30 13:30:00', 48500.00, 'SCHEDULED', 500),
('SW4258', 4, 14, 1, '2026-07-30 15:30:00', '2026-07-31 03:30:00', 49500.00, 'SCHEDULED', 500),
('SW4259', 1, 1, 4, '2026-07-30 06:30:00', '2026-07-30 09:00:00', 5850.00, 'SCHEDULED', 150),
('SW4260', 1, 4, 1, '2026-07-30 10:00:00', '2026-07-30 12:30:00', 5950.00, 'SCHEDULED', 150),
('SW4261', 3, 1, 5, '2026-07-30 08:00:00', '2026-07-30 10:00:00', 4350.00, 'SCHEDULED', 180),
('SW4262', 3, 5, 1, '2026-07-30 12:00:00', '2026-07-30 14:00:00', 4450.00, 'SCHEDULED', 180),
('SW4263', 1, 1, 6, '2026-07-30 09:00:00', '2026-07-30 11:30:00', 5150.00, 'SCHEDULED', 150),
('SW4264', 1, 6, 1, '2026-07-30 13:00:00', '2026-07-30 15:30:00', 5250.00, 'SCHEDULED', 150),
('SW4265', 2, 2, 10, '2026-07-30 03:00:00', '2026-07-30 06:30:00', 13100.00, 'SCHEDULED', 300),
('SW4266', 2, 10, 2, '2026-07-30 08:30:00', '2026-07-30 12:00:00', 13300.00, 'SCHEDULED', 300),
('SW4267', 4, 2, 10, '2026-07-30 11:00:00', '2026-07-30 14:30:00', 12600.00, 'SCHEDULED', 500),
('SW4268', 4, 10, 2, '2026-07-30 17:00:00', '2026-07-30 20:30:00', 12800.00, 'SCHEDULED', 500),
('SW4269', 4, 2, 9, '2026-07-30 02:00:00', '2026-07-30 14:00:00', 52000.00, 'SCHEDULED', 500),
('SW4270', 4, 9, 2, '2026-07-30 16:00:00', '2026-07-31 04:00:00', 53000.00, 'SCHEDULED', 500),
('SW4271', 2, 2, 11, '2026-07-30 04:00:00', '2026-07-30 10:30:00', 19600.00, 'SCHEDULED', 300),
('SW4272', 2, 11, 2, '2026-07-30 12:00:00', '2026-07-30 18:30:00', 20100.00, 'SCHEDULED', 300),
('SW4273', 3, 3, 7, '2026-07-30 10:00:00', '2026-07-30 12:00:00', 3200.00, 'SCHEDULED', 180),
('SW4274', 3, 7, 3, '2026-07-30 14:00:00', '2026-07-30 16:00:00', 3300.00, 'SCHEDULED', 180),
('SW4275', 1, 3, 4, '2026-07-30 08:30:00', '2026-07-30 10:00:00', 3400.00, 'SCHEDULED', 150),
('SW4276', 1, 4, 3, '2026-07-30 12:00:00', '2026-07-30 13:30:00', 3500.00, 'SCHEDULED', 150),
('SW4277', 3, 5, 6, '2026-07-30 07:00:00', '2026-07-30 09:30:00', 4200.00, 'SCHEDULED', 180),
('SW4278', 3, 6, 5, '2026-07-30 11:00:00', '2026-07-30 13:30:00', 4300.00, 'SCHEDULED', 180),
('SW4279', 3, 6, 12, '2026-07-30 08:00:00', '2026-07-30 13:30:00', 11100.00, 'SCHEDULED', 180),
('SW4280', 3, 12, 6, '2026-07-30 15:00:00', '2026-07-30 20:30:00', 11600.00, 'SCHEDULED', 180);

-- July 31 flights
INSERT IGNORE INTO flights (flight_number, aircraft_id, origin_airport_id, destination_airport_id, departure_time, arrival_time, base_price, status, available_seats) VALUES
('SW4281', 1, 1, 2, '2026-07-31 06:00:00', '2026-07-31 08:00:00', 4650.00, 'SCHEDULED', 150),
('SW4282', 1, 2, 1, '2026-07-31 10:00:00', '2026-07-31 12:00:00', 4850.00, 'SCHEDULED', 150),
('SW4283', 3, 1, 3, '2026-07-31 07:00:00', '2026-07-31 09:30:00', 5450.00, 'SCHEDULED', 180),
('SW4284', 3, 3, 1, '2026-07-31 15:00:00', '2026-07-31 17:30:00', 5650.00, 'SCHEDULED', 180),
('SW4285', 1, 2, 3, '2026-07-31 08:00:00', '2026-07-31 10:00:00', 3900.00, 'SCHEDULED', 150),
('SW4286', 1, 3, 2, '2026-07-31 14:00:00', '2026-07-31 16:00:00', 4000.00, 'SCHEDULED', 150),
('SW4287', 2, 1, 10, '2026-07-31 02:00:00', '2026-07-31 06:00:00', 15100.00, 'SCHEDULED', 300),
('SW4288', 2, 10, 1, '2026-07-31 08:00:00', '2026-07-31 12:00:00', 15300.00, 'SCHEDULED', 300),
('SW4289', 4, 1, 10, '2026-07-31 10:00:00', '2026-07-31 14:00:00', 14400.00, 'SCHEDULED', 500),
('SW4290', 4, 10, 1, '2026-07-31 16:00:00', '2026-07-31 20:00:00', 14600.00, 'SCHEDULED', 500),
('SW4291', 2, 1, 9, '2026-07-31 01:00:00', '2026-07-31 13:00:00', 57000.00, 'SCHEDULED', 300),
('SW4292', 2, 9, 1, '2026-07-31 15:00:00', '2026-08-01 03:00:00', 58000.00, 'SCHEDULED', 300),
('SW4293', 1, 1, 11, '2026-07-31 05:00:00', '2026-07-31 11:30:00', 22800.00, 'SCHEDULED', 150),
('SW4294', 1, 11, 1, '2026-07-31 13:00:00', '2026-07-31 19:30:00', 23300.00, 'SCHEDULED', 150),
('SW4295', 3, 1, 12, '2026-07-31 06:00:00', '2026-07-31 11:30:00', 15600.00, 'SCHEDULED', 180),
('SW4296', 3, 12, 1, '2026-07-31 13:00:00', '2026-07-31 18:30:00', 16100.00, 'SCHEDULED', 180),
('SW4297', 4, 1, 14, '2026-07-31 01:30:00', '2026-07-31 13:30:00', 49000.00, 'SCHEDULED', 500),
('SW4298', 4, 14, 1, '2026-07-31 15:30:00', '2026-08-01 03:30:00', 50000.00, 'SCHEDULED', 500),
('SW4299', 1, 1, 4, '2026-07-31 06:30:00', '2026-07-31 09:00:00', 5900.00, 'SCHEDULED', 150),
('SW4300', 1, 4, 1, '2026-07-31 10:00:00', '2026-07-31 12:30:00', 6000.00, 'SCHEDULED', 150),
('SW4301', 3, 1, 5, '2026-07-31 08:00:00', '2026-07-31 10:00:00', 4400.00, 'SCHEDULED', 180),
('SW4302', 3, 5, 1, '2026-07-31 12:00:00', '2026-07-31 14:00:00', 4500.00, 'SCHEDULED', 180),
('SW4303', 1, 1, 6, '2026-07-31 09:00:00', '2026-07-31 11:30:00', 5200.00, 'SCHEDULED', 150),
('SW4304', 1, 6, 1, '2026-07-31 13:00:00', '2026-07-31 15:30:00', 5300.00, 'SCHEDULED', 150),
('SW4305', 2, 2, 10, '2026-07-31 03:00:00', '2026-07-31 06:30:00', 13200.00, 'SCHEDULED', 300),
('SW4306', 2, 10, 2, '2026-07-31 08:30:00', '2026-07-31 12:00:00', 13400.00, 'SCHEDULED', 300),
('SW4307', 4, 2, 10, '2026-07-31 11:00:00', '2026-07-31 14:30:00', 12700.00, 'SCHEDULED', 500),
('SW4308', 4, 10, 2, '2026-07-31 17:00:00', '2026-07-31 20:30:00', 12900.00, 'SCHEDULED', 500),
('SW4309', 4, 2, 9, '2026-07-31 02:00:00', '2026-07-31 14:00:00', 52500.00, 'SCHEDULED', 500),
('SW4310', 4, 9, 2, '2026-07-31 16:00:00', '2026-08-01 04:00:00', 53500.00, 'SCHEDULED', 500),
('SW4311', 2, 2, 11, '2026-07-31 04:00:00', '2026-07-31 10:30:00', 19800.00, 'SCHEDULED', 300),
('SW4312', 2, 11, 2, '2026-07-31 12:00:00', '2026-07-31 18:30:00', 20300.00, 'SCHEDULED', 300),
('SW4313', 3, 3, 7, '2026-07-31 10:00:00', '2026-07-31 12:00:00', 3250.00, 'SCHEDULED', 180),
('SW4314', 3, 7, 3, '2026-07-31 14:00:00', '2026-07-31 16:00:00', 3350.00, 'SCHEDULED', 180),
('SW4315', 1, 3, 4, '2026-07-31 08:30:00', '2026-07-31 10:00:00', 3450.00, 'SCHEDULED', 150),
('SW4316', 1, 4, 3, '2026-07-31 12:00:00', '2026-07-31 13:30:00', 3550.00, 'SCHEDULED', 150),
('SW4317', 3, 5, 6, '2026-07-31 07:00:00', '2026-07-31 09:30:00', 4250.00, 'SCHEDULED', 180),
('SW4318', 3, 6, 5, '2026-07-31 11:00:00', '2026-07-31 13:30:00', 4350.00, 'SCHEDULED', 180),
('SW4319', 3, 6, 12, '2026-07-31 08:00:00', '2026-07-31 13:30:00', 11200.00, 'SCHEDULED', 180),
('SW4320', 3, 12, 6, '2026-07-31 15:00:00', '2026-07-31 20:30:00', 11700.00, 'SCHEDULED', 180);
