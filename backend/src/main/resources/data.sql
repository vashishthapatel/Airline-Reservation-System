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
-- Seats for Flight SW105 (DEL -> DXB, Boeing 777)
-- ============================================================
INSERT IGNORE INTO seats (flight_id, seat_number, seat_class, status, price)
SELECT f.id, s.seat_num, s.s_class, 'AVAILABLE', CASE s.s_class WHEN 'FIRST' THEN f.base_price*3 WHEN 'BUSINESS' THEN f.base_price*2 ELSE f.base_price END
FROM flights f, (
  SELECT 'F1A' AS seat_num, 'FIRST' AS s_class UNION SELECT 'F1B','FIRST' UNION SELECT 'F1C','FIRST' UNION SELECT 'F1D','FIRST' UNION SELECT 'F2A','FIRST' UNION
  SELECT 'B1A','BUSINESS' UNION SELECT 'B1B','BUSINESS' UNION SELECT 'B1C','BUSINESS' UNION SELECT 'B1D','BUSINESS' UNION
  SELECT 'B2A','BUSINESS' UNION SELECT 'B2B','BUSINESS' UNION SELECT 'B2C','BUSINESS' UNION SELECT 'B2D','BUSINESS' UNION
  SELECT 'B3A','BUSINESS' UNION SELECT 'B3B','BUSINESS' UNION SELECT 'B3C','BUSINESS' UNION SELECT 'B3D','BUSINESS' UNION
  SELECT 'E1A','ECONOMY' UNION SELECT 'E1B','ECONOMY' UNION SELECT 'E1C','ECONOMY' UNION SELECT 'E1D','ECONOMY' UNION SELECT 'E1E','ECONOMY' UNION SELECT 'E1F','ECONOMY' UNION
  SELECT 'E2A','ECONOMY' UNION SELECT 'E2B','ECONOMY' UNION SELECT 'E2C','ECONOMY' UNION SELECT 'E2D','ECONOMY' UNION SELECT 'E2E','ECONOMY' UNION SELECT 'E2F','ECONOMY' UNION
  SELECT 'E3A','ECONOMY' UNION SELECT 'E3B','ECONOMY' UNION SELECT 'E3C','ECONOMY' UNION SELECT 'E3D','ECONOMY' UNION SELECT 'E3E','ECONOMY' UNION SELECT 'E3F','ECONOMY' UNION
  SELECT 'E4A','ECONOMY' UNION SELECT 'E4B','ECONOMY' UNION SELECT 'E4C','ECONOMY' UNION SELECT 'E4D','ECONOMY' UNION SELECT 'E4E','ECONOMY' UNION SELECT 'E4F','ECONOMY' UNION
  SELECT 'E5A','ECONOMY' UNION SELECT 'E5B','ECONOMY' UNION SELECT 'E5C','ECONOMY' UNION SELECT 'E5D','ECONOMY' UNION SELECT 'E5E','ECONOMY' UNION SELECT 'E5F','ECONOMY'
) AS s
WHERE f.flight_number = 'SW105';
