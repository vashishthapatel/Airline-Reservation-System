# ✈️ SkyWay - Airline Reservation System

SkyWay is a modern, full-stack Airline Reservation System designed for seamless flight searching, seat selection, ticket booking, and admin management. Built with a robust **Spring Boot** backend and a responsive, high-performance **React (Vite)** frontend.

🔗 **Live Demo:** [https://airline-reservation-system-1-zef7.onrender.com/](https://airline-reservation-system-1-zef7.onrender.com/)

---

## 🌟 Key Features

### 👤 Passenger Portal
* **Flight Search:** Real-time search by origin, destination, and departure date.
* **Interactive Seat Selection:** Visual seat map selection dynamically calculated based on aircraft configuration (Economy, Business, First Class).
* **Booking & Passenger Details:** Quick forms to register passenger info.
* **Mock Payment Integration:** Simulated payment processing for booking confirmations.
* **Booking History:** Access to past and upcoming ticket details, including ticket status.
* **User Profile:** Manage contact details.

### 🛡️ Admin Dashboard (Protected Role)
* **Real-time Analytics:** Interactive charts for weekly revenue trends and monthly booking distributions.
* **Flight Management:** Add, edit, update, or cancel flight schedules.
* **User Management:** Monitor registered passengers and manage permissions.
* **Booking Management:** Track all system bookings and payment statuses.

---

## 🛠️ Technology Stack

### **Frontend**
* **Framework:** React.js (Vite)
* **Styling:** Premium Custom Vanilla CSS (Glassmorphism & Sleek Dark Mode)
* **Routing:** React Router DOM v6
* **Animations:** Framer Motion, GSAP (GreenSock), Lenis Scroll
* **Charts:** Recharts (Admin analytics)
* **Icons:** Lucide React
* **HTTP Client:** Axios (Interceptors for automatic JWT attachments)

### **Backend**
* **Framework:** Spring Boot (Java)
* **Security:** Spring Security & JWT (JSON Web Tokens)
* **ORM / Database:** Spring Data JPA, Hibernate, H2 Database (or MySQL)
* **Build Tool:** Maven

---

## ⚙️ Project Structure
```text
Airline-Reservation-System/
├── backend/            # Spring Boot Application
│   ├── src/main/java/  # Java Source Files (Config, Security, Controller, Service, Repositories, Entities)
│   └── src/main/resources/
│       ├── application.properties  # Configurations & DB Settings
│       └── data.sql                # SQL Seeds (Airports, Flights, Aircraft, Demo Users)
├── frontend/           # Vite + React Client App
│   ├── src/            # Components, Contexts, Pages, APIs
│   ├── package.json    # Dependencies & Build Scripts
│   └── vite.config.js  # Vite Config
└── README.md           # Project Documentation
```

---

## 🚀 Installation & Local Setup

### **Prerequisites**
* JDK 17 or higher
* Node.js (v18+) & npm
* Git

### **1. Clone the Repository**
```bash
git clone https://github.com/vashishthapatel/Airline-Reservation-System.git
cd Airline-Reservation-System
```

### **2. Backend Setup**
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Configure environment variables in `src/main/resources/application.properties` (optional, defaults to H2 database).
3. Build and run the Spring Boot app:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
   *The backend will start running on* `http://localhost:8080` (or your configured port).

### **3. Frontend Setup**
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set your backend URL environment variable. Create a `.env.local` file inside the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:8080/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will start running on* `http://localhost:5173`.

---

## 🔐 Demo Credentials
Once the application loads, you can use the quick **Demo Logins** on the login page, or use these credentials:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@airline.com` | `admin123` |
| **Customer** | `john@example.com` | `customer123` |

---

## 🌐 Environment Variables

### **Frontend Variables (`.env.local`)**
* `VITE_API_URL`: Base URL of the deployed Spring Boot API backend.

### **Backend Variables (`application.properties`)**
* `PORT`: Server port (default `8080`).
* `DATABASE_URL`: Connection string for the database (supports H2 / MySQL).
* `DATABASE_USERNAME` / `DATABASE_PASSWORD`: Database credentials.
* `JWT_SECRET`: Secret signing key for JWT tokens.
* `FRONTEND_URL`: URL of the frontend (for CORS configuration).

### Google Sign-In Setup
Google sign-in is optional and stays disabled until it is configured. Create a Web application OAuth client in Google Cloud Console and add this redirect URI:

```text
http://localhost:8080/login/oauth2/code/google
```

Then start the backend with these environment variables:

```text
SPRING_PROFILES_ACTIVE=google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=http://localhost:5173
```

For deployment, replace the localhost redirect URI and `FRONTEND_URL` with the deployed backend and frontend URLs. Once enabled, the login page displays **Sign in with Google** and creates a customer account automatically on first sign-in.

---

## 📡 API Endpoints Summary

### **Authentication**
* `POST /api/auth/register` - Create a new user account.
* `POST /api/auth/login` - Authenticate and receive JWT.

### **Flights**
* `GET /api/flights/search` - Search flights by origin, destination, and date.
* `GET /api/flights/{id}` - Fetch single flight details.
* `GET /api/flights/{id}/seats` - Fetch seat arrangement/availability.

### **Bookings**
* `POST /api/bookings` - Create a new flight booking.
* `GET /api/bookings/my` - Fetch booking history for the logged-in user.
* `DELETE /api/bookings/{id}` - Cancel booking.

### **Admin Endpoints**
* `GET /api/admin/dashboard` - Retrieve analytics and statistics.
* `POST /api/admin/airports` - Create new airport entries.
* `POST /api/flights` - Create a new flight.
* `PUT /api/flights/{id}` - Update flight details.
* `DELETE /api/flights/{id}` - Delete flight.
