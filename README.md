# Loan Management System - Project Summary

This document provides a consolidated overview of both the Frontend and Backend components of the Loan Management System.

## 🖥️ Frontend (`loan-manangement-system-fe`)

The frontend is a responsive, bilingual UI tailored for a bank loan application system. 

### Technology Stack
- **Framework:** React + Vite
- **Styling:** Tailwind CSS (`@tailwindcss/vite`)
- **Routing:** Tanstack router

### Key Features
- **Bilingual Interface:** Supports English and Khmer language toggle (`LanguageToggle.jsx`).
- **Role-Based Access Control:** Role switcher supporting `CUSTOMER`, `OFFICER`, `MANAGER`, and `ADMIN`.
- **Responsive Design:** Mobile-friendly navigation and page layouts.
- **Visuals:** Custom logo and dashboard visualization capabilities (e.g., `StatusBarChart.jsx`).
- **Complete Loan Workflow:** Extensive suite of screens matching midterm + final project scope (applying, tracking, reviewing, overriding, modeling overdue instances, etc.).

### Core Pages Include:
- `/login` - User Authentication
- `/dashboard` - Overview of loan metrics / status tracking
- `/apply-loan` - Interface for submitting new loan applications
- `/officer-review` & `/approval-workflow` - Internal workflows for officers and managers
- `/repayment-calculator` & `/overdue-simulation` - Financial estimation and delinquency logic
- `/reporting` - Administrative reports

### Getting Started (Frontend)
```bash
cd loan-manangement-system-fe
npm install
npm run dev # Starts development server
```

---

## ⚙️ Backend (`loan-manangement-system`)

The backend is a robust REST API designed to handle the core loan business logic, database persistence, user management, and security.

### Technology Stack
- **Language & Framework:** Java 21 + Spring Boot 4.0.3
- **Security:** Spring Security paired with JWT (`io.jsonwebtoken`) for stateless API authentication and authorization.
- **Database:** PostgreSQL accessed via Spring Data JPA.
- **Database Migrations:** Flyway Migrations for strictly-controlled database schema iterations.
- **API Documentation:** Springdoc OpenAPI (Swagger UI) for interactive API documentation endpoints.
- **Utilities:** Lombok (boilerplate reduction), MapStruct (type-safe DTO mapping).

### Infrastructure (Docker Compose)
The project utilizes Docker Compose (`compose.yaml`) for seamless environment and infrastructure setup:
- **Database Container (`postgres`):** Runs PostgreSQL 17-alpine on port `5433` (external) / `5432` (internal) with DB `mydatabase` (`myuser`:`secret`).
- **API Application Container (`app`):** Automatically builds and runs the Spring backend mapping onto port `8080`.

### Getting Started (Backend)
1. **Prepare infrastructure:** Spin up the Postgres database via Docker:
   ```bash
   cd loan-manangement-system
   docker-compose up -d postgres
   ```
2. **Run the Spring Boot application** (using Gradle wrapper):
   ```bash
   ./gradlew bootRun
   ```
Alternatively, doing a simple `docker-compose up -d` will start both the database and the built API service.
