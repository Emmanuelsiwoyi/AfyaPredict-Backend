
# AfyaPredict Backend

## Overview
AfyaPredict is a clinic appointment management system built with Node.js, Express, and PostgreSQL.

## Features
- User Registration
- User Login with JWT Authentication
- Patient Management
- Doctor Management
- Appointment Booking
- Appointment Status Updates
- Appointment Deletion
- SMS Notifications using Africa's Talking

## Technologies
- Node.js
- Express.js
- PostgreSQL
- JWT
- bcryptjs
- Africa's Talking API
- Express Validator

## Installation

```bash
npm install
```

Create a `.env` file:

```env
JWT_SECRET=your_secret_key
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=your_database
AT_USERNAME=sandbox
AT_API_KEY=your_api_key
```

Start the server:

```bash
node server.js
```

## API Endpoints

### Users
- POST /users/register
- POST /users/login

### Patients
- GET /patients
- POST /patients

### Doctors
- GET /doctors
- POST /doctors

### Appointments
- GET /appointments
- POST /appointments
- PATCH /appointments/:id/status
- DELETE /appointments/:id

## Author

Emmanuel Siwoyi
Sofware Engineer
"# AfyaPredict-Backend" 
