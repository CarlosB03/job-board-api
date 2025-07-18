# Job Board API

A RESTful API for job postings and job searches, built with Node.js, Express, Prisma, PostgreSQL, and Docker.

---

## Features

- User registration and login with JWT authentication
- Role-based access control:
  - **COMPANY** users can create, read, update, and delete job listings
  - **JOBSEEKER** users can only read job listings
- Job listing filtering and field selection via query parameters
- Secure password hashing with bcrypt
- Error handling with descriptive HTTP responses

---

## Setup

1. Clone the repository and install dependencies:

```bash
npm install


Configure environment variables in .env
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3000

Run Prisma migrations:
npx prisma migrate dev --name init

Start the server:
npm run dev


API Endpoints
Authentication

POST /api/auth/register
Register a new user (company or jobseeker).
Request body example:
{
  "email": "user@example.com",
  "password": "yourpassword",
  "role": "COMPANY"
}

POST /api/auth/login
Login and receive a JWT token.
Request body example:
{
  "email": "user@example.com",
  "password": "yourpassword"
}

Jobs
GET /api/jobs
Get jobs with optional filtering and field selection.
Query parameters:
company — filter by company name
location — filter by job location
fields — comma-separated fields to include in response (e.g., title,company,pay)

POST /api/jobs (COMPANY only)
Create a new job listing.
Requires Authorization: Bearer <token> header.
Request body example:
{
  "title": "Frontend Developer",
  "company": "Nvidia",
  "jobDescription": "Develop user interfaces",
  "requirements": "React, JavaScript",
  "responsibilities": "Implement new features",
  "pay": "$120,000",
  "location": "Remote",
  "skills": "React, Tailwind"
}

PUT /api/jobs/:id (COMPANY only)
Update a job listing partially or fully.
Requires Authorization: Bearer <token> header.
Request body can include any fields to update, for example:
{
  "pay": "$130,000"
}

Notes
Use the JWT token returned on login in the Authorization header as Bearer <token> to access protected endpoints.
JOBSEEKER role users can only perform GET requests on jobs.
COMPANY role users have full CRUD access on their own job listings.
Passwords are securely hashed using bcrypt.
Proper error messages and HTTP status codes are returned for validation, authorization, and server errors.

Testing
Use Postman or any API client:
Register a user (company or jobseeker).
Login to get the JWT token.
Use the token for authorized requests to create, update, or delete jobs (COMPANY only).
Use GET requests freely to list or filter jobs.

MIT License