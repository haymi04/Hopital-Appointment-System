# Authentication Module Documentation

## Overview

This module handles user authentication and authorization for the Hospital Appointment Booking System.

The authentication system provides:

* User registration
* Secure password hashing
* User login
* JWT token generation
* JWT token verification
* Protected routes
* Role-based authorization

The purpose is to ensure that users can securely access the system based on their identity and assigned role.

---

# Features Implemented

## 1. User Registration

### Description

Allows new users to create an account.

### Process

1. User submits registration information.
2. System checks if the email already exists.
3. Password is encrypted using bcrypt.
4. User information is stored in the PostgreSQL database.

### Endpoint

```
POST /api/auth/register
```

### Request Body Example

```json
{
    "email": "patient@gmail.com",
    "password": "123456",
    "role": "patient",
    "first_name": "Sara",
    "last_name": "Ali",
    "phone": "0911111111",
    "gender": "Female",
    "date_of_birth": "2002-05-10"
}
```

---

# 2. User Login

### Description

Allows registered users to log into the system.

### Process

1. User enters email and password.
2. System searches for the user.
3. Password is compared with the stored encrypted password.
4. A JWT token is generated after successful authentication.

### Endpoint

```
POST /api/auth/login
```

### Response Example

```json
{
    "success": true,
    "message": "Login successful",
    "token": "JWT_TOKEN",
    "user": {
        "id": 1,
        "email": "patient@gmail.com",
        "role": "patient"
    }
}
```

---

# 3. Password Security

Passwords are not stored as plain text.

The system uses:

```
bcrypt
```

to hash passwords before storing them in the database.

Example:

```
Original password:
123456

Stored password:
$2b$10$xxxxxxxxxxxx
```

---

# 4. JWT Authentication

The system uses JSON Web Tokens (JWT) to maintain authenticated sessions.

After successful login, the server creates a token containing:

```json
{
    "id": 1,
    "role": "patient"
}
```

The token is sent to the client and must be included in future protected requests.

Token format:

```
Authorization: Bearer <token>
```

---

# 5. Authentication Middleware

File:

```
middleware/authMiddleware.js
```

## Purpose

Checks whether a user is authenticated.

## Process

1. Reads the token from the request header.
2. Verifies the token using JWT_SECRET.
3. Retrieves the user from the database.
4. Stores user information in:

```javascript
req.user
```

Example:

```javascript
req.user.id
req.user.role
req.user.email
```

Protected routes can use this information.

---

# 6. Role-Based Authorization

File:

```
middleware/roleMiddleware.js
```

## Purpose

Controls access based on user roles.

Available roles:

* Admin
* Doctor
* Patient
* Receptionist

Example:

```javascript
router.post(
    "/doctors",
    protect,
    authorize("admin"),
    addDoctor
);
```

Only users with the admin role can access this route.

---

# Authentication Flow

```
Register
   |
   ↓
Password Hashing
   |
   ↓
Save User
   |
   ↓
Login
   |
   ↓
Verify Password
   |
   ↓
Generate JWT Token
   |
   ↓
Access Protected Routes
   |
   ↓
Role Verification
   |
   ↓
Allow / Deny Access
```

---

# Files Created/Modified

```
src
│
├── controllers
│     └── authController.js
│
├── routes
│     └── authRoutes.js
│
├── middleware
│     ├── authMiddleware.js
│     └── roleMiddleware.js
│
└── utils
      └── generateToken.js
```

---

# How Other Team Members Can Use Authentication

## Protect a Route

Import:

```javascript
const { protect } = require("../middleware/authMiddleware");
```

Use:

```javascript
router.get(
    "/example",
    protect,
    controllerFunction
);
```

---

## Restrict by Role

Import:

```javascript
const authorize = require("../middleware/roleMiddleware");
```

Use:

```javascript
router.post(
    "/example",
    protect,
    authorize("admin"),
    controllerFunction
);
```

---

# Security Features

Implemented security measures:

✅ Password hashing with bcrypt
✅ JWT-based authentication
✅ Protected API routes
✅ Role-based access control
✅ Database user verification

---

# Future Improvements

Possible improvements:

* Password reset functionality
* Email verification
* Refresh tokens
* Login activity tracking
* Account lockout after multiple failed attempts
