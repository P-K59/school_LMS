# School LMS - API Documentation

Welcome to the School LMS Backend API documentation. This document is designed for frontend developers to seamlessly integrate authentication, user management, and school registration features.

---

## 🛠️ Global Configuration & Standards

### Base URL
- **Local Development**: `http://localhost:5000` (or configured server port)
- **API Version 1 Prefix**: `/api/v1`

---

### 🔐 Authentication Mechanism
- **Access Tokens**: Short-lived JWT access tokens are returned in response bodies upon successful login or registration. The frontend must store this token (e.g., in memory or secure storage) and include it in the header for protected routes:
  ```http
  Authorization: Bearer <accessToken>
  ```
- **Refresh Tokens**: Long-lived refresh tokens (7 days expiry) are automatically set by the server in an `httpOnly` secure cookie (`refreshToken`). Frontend requests to auth endpoints should include credentials (`withCredentials: true` in Axios / `credentials: 'include'` in Fetch).

---

### 📦 Standard Response Formats

All API endpoints follow a unified response structure.

#### Success Response Structure (`ApiResponse`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation description string",
  "data": { ... } // Object, Array, or null
}
```

#### Error Response Structure (`ApiError`)
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Detailed error description message",
  "errors": [] // Optional validation/error details array
}
```

---

## 📚 API Endpoints Summary

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register-school` | Public | Register a new school along with its initial School Admin account |
| `POST` | `/api/v1/auth/login` | Public | Authenticate a user and receive access token & refresh cookie |
| `GET` | `/api/v1/auth/me` | Protected | Fetch current authenticated user's profile and school data |
| `GET` | `/health` | Public | Server health check endpoint |

---

## 📋 Endpoints Specification

### 1. Register School & Admin Account

Registers a new school entity in the system and creates the primary `SCHOOL_ADMIN` user linked to that school in a single database transaction.

- **Route**: `POST /api/v1/auth/register-school`
- **Access**: Public
- **Content-Type**: `application/json`

#### 📥 Input Data (Request Body)

| Field | Type | Requirement | Description / Constraints |
| :--- | :--- | :--- | :--- |
| `schoolName` | `string` | **Required** | Full name of the school (e.g., `"Greenwood High"`). Server automatically generates a URL-friendly slug. |
| `schoolEmail` | `string` | **Required** | Official contact email for the school. Must be unique across all schools. |
| `schoolPhone` | `string` | **Required** | Phone number for the school. Also used as initial contact phone for the admin user. |
| `schoolAddress` | `string` | *Optional* | Physical address of the school. |
| `firstName` | `string` | **Required** | Admin user's first name. |
| `lastName` | `string` | **Required** | Admin user's last name. |
| `email` | `string` | **Required** | Admin user's email address (used for login). Must be unique across all users. |
| `password` | `string` | **Required** | Raw password for the admin user (will be hashed securely using bcrypt). |

#### ⚙️ Business Rules & Validation
1. **School Uniqueness**: Checked against generated `slug` and `schoolEmail`. If either exists, returns `409 Conflict`.
2. **User Uniqueness**: Checked against admin `email`. If user exists, returns `409 Conflict`.
3. **Role Assignment**: User is automatically assigned role `SCHOOL_ADMIN`.
4. **Cookie**: Sets `refreshToken` HTTP-Only cookie valid for 7 days.

#### 📤 Sample Request Body
```json
{
  "schoolName": "Springfield International School",
  "schoolEmail": "contact@springfield.edu",
  "schoolPhone": "+1234567890",
  "schoolAddress": "123 Education Lane, Springfield",
  "firstName": "John",
  "lastName": "Doe",
  "email": "admin@springfield.edu",
  "password": "SecurePassword123!"
}
```

#### 📥 Sample Success Response (`201 Created`)
```json
{
  "success": true,
  "statusCode": 201,
  "message": "school registered successfully.",
  "data": {
    "school": {
      "id": "c7b3a1d4-8e2f-4a9b-b1c2-3d4e5f6a7b8c",
      "name": "Springfield International School",
      "slug": "springfield-international-school",
      "email": "contact@springfield.edu",
      "phone": "+1234567890",
      "logo": null,
      "address": null,
      "city": null,
      "state": null,
      "country": null,
      "website": null,
      "status": "ACTIVE",
      "createdAt": "2026-06-27T12:00:00.000Z",
      "updatedAt": "2026-06-27T12:00:00.000Z"
    },
    "user": {
      "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      "schoolId": "c7b3a1d4-8e2f-4a9b-b1c2-3d4e5f6a7b8c",
      "firstName": "John",
      "lastName": "Doe",
      "email": "admin@springfield.edu",
      "avatar": null,
      "phone": "+1234567890",
      "role": "SCHOOL_ADMIN",
      "status": "ACTIVE",
      "lastLogin": null,
      "createdAt": "2026-06-27T12:00:00.000Z",
      "updatedAt": "2026-06-27T12:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### ❌ Possible Error Responses
- `409 Conflict`: School already exists (`"School already exists."`)
- `409 Conflict`: User already exists (`"User already exists."`)

---

### 2. User Login

Authenticates any registered user, verifies credentials and account status, updates `lastLogin`, and returns user & school details along with an access token.

- **Route**: `POST /api/v1/auth/login`
- **Access**: Public
- **Content-Type**: `application/json`

#### 📥 Input Data (Request Body)

| Field | Type | Requirement | Description / Constraints |
| :--- | :--- | :--- | :--- |
| `email` | `string` | **Required** | Registered user email address. |
| `password` | `string` | **Required** | User password. |

#### ⚙️ Business Rules & Validation
1. **User Verification**: Email must exist in the system.
2. **Password Verification**: Raw password is checked against stored bcrypt hash.
3. **Status Check**: User status must be `ACTIVE`. If status is `INACTIVE` or `BLOCKED`, login is denied with `403 Forbidden`.
4. **Cookie**: Sets `refreshToken` HTTP-Only cookie valid for 7 days.
5. **Side Effect**: Updates user's `lastLogin` timestamp.
6. **Data Privacy**: Password hash is excluded from the returned user object.

#### 📤 Sample Request Body
```json
{
  "email": "admin@springfield.edu",
  "password": "SecurePassword123!"
}
```

#### 📥 Sample Success Response (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successfully.",
  "data": {
    "user": {
      "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      "schoolId": "c7b3a1d4-8e2f-4a9b-b1c2-3d4e5f6a7b8c",
      "firstName": "John",
      "lastName": "Doe",
      "email": "admin@springfield.edu",
      "avatar": null,
      "phone": "+1234567890",
      "role": "SCHOOL_ADMIN",
      "status": "ACTIVE",
      "lastLogin": "2026-06-27T12:30:00.000Z",
      "createdAt": "2026-06-27T12:00:00.000Z",
      "updatedAt": "2026-06-27T12:30:00.000Z"
    },
    "school": {
      "id": "c7b3a1d4-8e2f-4a9b-b1c2-3d4e5f6a7b8c",
      "name": "Springfield International School",
      "slug": "springfield-international-school",
      "email": "contact@springfield.edu",
      "phone": "+1234567890",
      "logo": null,
      "address": null,
      "city": null,
      "state": null,
      "country": null,
      "website": null,
      "status": "ACTIVE",
      "createdAt": "2026-06-27T12:00:00.000Z",
      "updatedAt": "2026-06-27T12:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### ❌ Possible Error Responses
- `401 Unauthorized`: Invalid email or password (`"Invalid email or password."`)
- `403 Forbidden`: User account is not active (`"Account is inactive."`)

---

### 3. Get Current Authenticated User ("Me")

Fetches the profile and school metadata for the currently logged-in user using their Bearer access token.

- **Route**: `GET /api/v1/auth/me`
- **Access**: Protected (Requires valid Bearer access token)

#### 📥 Headers Required

| Header | Value | Requirement | Description |
| :--- | :--- | :--- | :--- |
| `Authorization` | `Bearer <accessToken>` | **Required** | JWT access token received during login or school registration. |

#### ⚙️ Business Rules & Validation
1. **Token Validation**: Middleware extracts token from header and validates JWT signature and expiration.
2. **User Status**: Ensures user exists and account status is `ACTIVE`.
3. **Data Security**: Password hash is stripped from the returned user profile.

#### 📥 Sample Success Response (`200 OK`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User fetched successfully.",
  "data": {
    "user": {
      "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      "schoolId": "c7b3a1d4-8e2f-4a9b-b1c2-3d4e5f6a7b8c",
      "firstName": "John",
      "lastName": "Doe",
      "email": "admin@springfield.edu",
      "avatar": null,
      "phone": "+1234567890",
      "role": "SCHOOL_ADMIN",
      "status": "ACTIVE",
      "lastLogin": "2026-06-27T12:30:00.000Z",
      "createdAt": "2026-06-27T12:00:00.000Z",
      "updatedAt": "2026-06-27T12:30:00.000Z"
    },
    "school": {
      "id": "c7b3a1d4-8e2f-4a9b-b1c2-3d4e5f6a7b8c",
      "name": "Springfield International School",
      "slug": "springfield-international-school",
      "email": "contact@springfield.edu",
      "phone": "+1234567890",
      "logo": null,
      "address": null,
      "city": null,
      "state": null,
      "country": null,
      "website": null,
      "status": "ACTIVE",
      "createdAt": "2026-06-27T12:00:00.000Z",
      "updatedAt": "2026-06-27T12:00:00.000Z"
    }
  }
}
```

#### ❌ Possible Error Responses
- `401 Unauthorized`: Missing or malformed authorization header (`"Unauthorized"`)
- `401 Unauthorized`: Token expired or invalid signature
- `401 Unauthorized`: User record not found in database (`"User not found"`)
- `403 Forbidden`: User account is inactive (`"Account is inactive"`)

---

### 4. Server Health Check

Utility endpoint to verify backend service status.

- **Route**: `GET /health`
- **Access**: Public

#### 📥 Sample Success Response (`200 OK`)
```json
{
  "success": true,
  "message": "Server is up and running",
  "data": {
    "server": "UP"
  },
  "timestamp": "2026-06-27T12:00:00.000Z"
}
```

---

## 📊 Data Models & Reference Enums (TypeScript Types for Frontend)

Frontend developers can use these TypeScript enum definitions to match database constraints when building forms or select dropdowns.

### User Role Enum (`UserRole`)
```typescript
export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  SCHOOL_ADMIN = "SCHOOL_ADMIN",
  PRINCIPAL = "PRINCIPAL",
  VICE_PRINCIPAL = "VICE_PRINCIPAL",
  TEACHER = "TEACHER",
  ACCOUNTANT = "ACCOUNTANT",
  LIBRARIAN = "LIBRARIAN",
  RECEPTIONIST = "RECEPTIONIST",
  STUDENT = "STUDENT",
  PARENT = "PARENT",
}
```

### User Status Enum (`UserStatus`)
```typescript
export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}
```

### School Status Enum (`SchoolStatus`)
```typescript
export enum SchoolStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
}
```
