# Frontend - Ticket Booking System (Skeleton)

## Setup (local)
1. `cd frontend`
2. `npm install`
3. Set `REACT_APP_API_BASE` environment variable if backend is not at default.
4. `npm start`


- This is a minimal skeleton to be expanded. It contains example components and a pattern for
  fetching shows and booking seats.
Ticket Booking System – Modex Assessment

A production-oriented high-concurrency Ticket Booking System built as part of the Modex Assessment.
This project demonstrates original system design, strong architectural choices, clean code practices, and concurrency-safe seat booking—similar to RedBus, BookMyShow, and doctor-appointment systems.

🚀 Tech Stack
Backend

Node.js

Express.js

PostgreSQL

Docker + Docker Compose

Transactions, row-level locking, isolation guarantees

Frontend

React.js

TypeScript

Context API

React Router

Axios

📌 Core Features
Admin

Create Shows / Trips (name, start time, total seats)

List all shows

User

View available shows

View seat layout

Book one or more seats

Real-time booking statuses: PENDING → CONFIRMED / FAILED

Concurrency-safe booking with row-level locks

Graceful error handling

Concurrency Handling

Uses Postgres constraints + transactions

Prevents double booking under high load

Includes a concurrency stress test script (50 parallel requests)


concurrency_test

🗄️ Database Schema

Schema includes:

Shows

Seats

Bookings

Booking-Seats mapping

Custom enum type booking_status

Indexes for performance

See full schema:


schema


🐳 Local Development Setup (Docker)

Docker Compose spins up:

PostgreSQL (tickets DB)

Backend service

Reference file:


docker-compose

Start the system
docker-compose up --build

Initialize DB
psql -h localhost -U postgres -d tickets -f schema.sql


📬 API Documentation

A complete Postman Collection is included:


postman_collection

Key Endpoints
POST /api/shows
GET  /api/shows
GET  /api/shows/:id/seats
POST /api/bookings

⚡ Concurrency Stress Test

To validate overbooking prevention:

node concurrency_test.js


Script reference:


concurrency_test


🧱 Project Structure

From the provided starter package:


README

/backend
/frontend
docker-compose.yml
schema.sql
concurrency_test.js
postman_collection.json


🧠 Design Highlights
Backend Architecture

Layered API design

Service layer with transaction-wrapped booking logic

Uses SELECT … FOR UPDATE for seat locking

Atomic writes ensure consistent booking states

Frontend Architecture

Context API for global state

Clean routing structure

Optimized re-fetching and caching

Error and loading UI states


📦 Deployment Requirements

As mandated by Modex:

Backend deployed (Render/Railway/AWS/etc.)

Frontend deployed (Vercel/Netlify)

Environment variables configured on both

Final video walkthrough with:

Deployment steps

Product demo

Architecture explanation

Innovation highlights
