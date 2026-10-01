# Leave Portal

A simple full-stack web application that allows **employees to apply for leave** and **employers to approve or reject leave requests**. The application demonstrates role-based authentication, REST APIs, and cloud deployment using modern web technologies.

---

# Project Overview

This application enables organizations to manage employee leave requests efficiently.

Employees can:

* Register and log in
* Submit leave applications
* Track the status of their leave requests

Employers can:

* View all leave applications submitted by employees
* Approve or reject leave requests

The system uses **JWT authentication and role-based access control** to ensure secure access to features.

---

# Tech Stack

## Frontend

* Vue.js (Vue 3)
* Tailwind CSS
* Vue Router
* Axios

## Backend

* Node.js
* Express.js

## Database

* MongoDB Atlas

## Authentication

* JWT (JSON Web Token)
* bcrypt for password hashing

## Deployment

* Frontend: Vercel / Netlify
* Backend: Render / Railway
* Database: MongoDB Atlas

---

# Features

## Employee Features

* User registration and login
* Apply for leave with:

  * Leave type
  * Start date
  * End date
  * Reason
* View leave request status:

  * Pending
  * Approved
  * Rejected

## Employer Features

* View all leave requests from employees
* Approve or reject leave applications
* Manage employee leave workflow

## Security Features

* JWT-based authentication
* Password hashing using bcrypt
* Role-based authorization
* Protected API routes

---

# Project Structure

## Backend

```
backend
│
├── config
│   └── db.js
│
├── controllers
│   ├── authController.js
│   └── leaveController.js
│
├── middleware
│   ├── authMiddleware.js
│   └── roleMiddleware.js
│
├── models
│   ├── User.js
│   └── Leave.js
│
├── routes
│   ├── authRoutes.js
│   └── leaveRoutes.js
│
├── .env
├── server.js
└── package.json
```

## Frontend

```
frontend
│
├── src
│
├── components
│   ├── Navbar.vue
│   ├── LeaveForm.vue
│   └── LeaveTable.vue
│
├── pages
│   ├── Login.vue
│   ├── Register.vue
│   ├── EmployeeDashboard.vue
│   └── EmployerDashboard.vue
│
├── router
│   └── index.js
│
├── services
│   └── api.js
│
├── App.vue
└── main.js
```

---

# Installation & Setup

## 1 Clone the Repository

```
git clone https://github.com/your-username/leave-management-system.git
cd leave-management-system
```

---

# Backend Setup

Navigate to the backend folder.

```
cd backend
```

Install dependencies.

```
npm install
```

---

## Environment Variables

Create a `.env` file in the backend directory.

Example:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Example MongoDB connection string:

```
mongodb+srv://username:password@cluster.mongodb.net/leave-management
```

---

## Run Backend Server

Development mode:

```
npm run dev
```

Or

```
node server.js
```

Server will start at:

```
http://localhost:5000
```

---

# Frontend Setup

Navigate to frontend folder.

```
cd frontend
```

Install dependencies.

```
npm install
```

Create `.env` file.

```
VITE_API_URL=http://localhost:5000/api
```

Run frontend server.

```
npm run dev
```

Application will run at:

```
http://localhost:5173
```

---

# API Endpoints

## Authentication

Register User

```
POST /api/auth/register
```

Login User

```
POST /api/auth/login
```

---

## Leave APIs

Employee apply for leave

```
POST /api/leaves/apply
```

Get employee leaves

```
GET /api/leaves/my-leaves
```

Get all leaves (Employer)

```
GET /api/leaves/all
```

Approve leave

```
PATCH /api/leaves/:id/approve
```

Reject leave

```
PATCH /api/leaves/:id/reject
```

---

# Database Schema

## User

```
User
- name
- email
- password
- role (employee | employer)
- createdAt
```

## Leave

```
Leave
- employeeId
- leaveType
- startDate
- endDate
- reason
- status (Pending | Approved | Rejected)
- createdAt
```

---

# Deployment

## Database Deployment (MongoDB Atlas)

1. Create account at MongoDB Atlas
2. Create a free cluster
3. Create database user
4. Whitelist IP address
5. Copy connection string
6. Add it to `.env`

---

## Unified Deployment (Vercel)

This project is configured as a Monorepo! The frontend and backend can be hosted **together** as a single deployment on Vercel.

1. Push the entire `leave-management-system` code to a GitHub repository.
2. Go to Vercel and create a new Project.
3. Import the repository.
4. Set the **Root Directory** to `backend`.
5. Under Environment Variables, add:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```
6. Click **Deploy**. Vercel will automatically build the Vue app and deploy the Express API in a serverless environment, serving both from the same URL!

Example Monorepo URL:
```
https://leave-management.vercel.app
```

---

# How the Application Works

1. Users register as either **Employee** or **Employer**.
2. After login, a **JWT token is generated**.
3. The token is stored in **localStorage** and sent with API requests.
4. Employees can apply for leave.
5. Employers view and manage leave requests.
6. Employers approve or reject requests.
7. Leave status updates in the employee dashboard.

---

# Error Handling

The application includes basic error handling:

* Missing fields validation
* Invalid login credentials
* Unauthorized access
* Server errors

API responses return appropriate HTTP status codes.

---

# Bonus Features Implemented

* JWT Authentication
* Role-Based Access Control
* Input Validation
* Secure Password Hashing
* Protected Routes
* REST API Architecture

---

# Future Improvements

Possible enhancements:

* Email notifications for leave approval
* Leave balance tracking
* Calendar integration
* Admin analytics dashboard
* Pagination for leave records

---

# Author

Developed as a full-stack assignment demonstrating:

* Vue.js frontend development
* Node.js backend APIs
* MongoDB cloud database
* JWT authentication
* Cloud deployment
