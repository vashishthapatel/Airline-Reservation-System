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
