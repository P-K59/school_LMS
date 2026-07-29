# 🏫 School LMS Nirmaan

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![Next.js](https://img.shields.io/badge/Next.js-v16-black)
![Prisma](https://img.shields.io/badge/Prisma-v6-blueviolet)
![License](https://img.shields.io/badge/license-ISC-orange)

School LMS Nirmaan is a multi-tenant learning management system designed for schools that need a modern digital platform for administration, course delivery, student management, and progress tracking.

---

## ✨ What This Project Includes

The current implementation covers a production-style backend for the LMS with:

- Multi-tenant school onboarding and school-admin registration
- JWT-based authentication with refresh token support
- Role-based access control for Super Admin, School Admin, and Student
- Course, module, and lesson management
- Student enrollment and progress tracking
- File uploads for images, videos, and PDFs
- Admin and student dashboard data APIs

---

## 🧱 Tech Stack

| Layer | Stack |
| :--- | :--- |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL, Prisma ORM |
| Auth | JWT, bcryptjs, cookie-parser |
| File Uploads | Multer |
| Frontend | Next.js, React, Tailwind CSS |

---

## 📁 Project Structure

```text
school_lms_nirmaan/
├── README.md
├── server/
│   ├── API.md
│   ├── package.json
│   ├── server.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── app.ts
│       ├── config/
│       ├── controllers/
│       ├── dto/
│       ├── middlewares/
│       ├── routes/
│       ├── services/
│       └── utils/
└── frontend/
    ├── package.json
    └── app/
```

---

## 🔐 Backend API Highlights

The backend exposes REST APIs under the base path:

- /api/v1/auth
- /api/v1/courses
- /api/v1/modules
- /api/v1/lessons
- /api/v1/users
- /api/v1/enrollments
- /api/v1/upload
- /api/v1/dashboard

These routes support the full lifecycle of:

- school registration
- login and session recovery
- course publishing and archiving
- lesson delivery and media upload
- student creation and management
- enrollment and progress updates

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 18+
- PostgreSQL
- npm

### 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Update the environment variables in the server .env file:

```env
PORT=5000
NODE_ENV=development
ORIGIN=http://localhost:3000
DATABASE_URL="postgresql://user:password@localhost:5432/school_lms?schema=public"
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

Run Prisma migrations and start the backend:

```bash
npx prisma migrate dev --name init
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 to view the app.

---

## 📘 API Documentation

Frontend developers can use the complete API reference here:

- [server/API.md](server/API.md)

The documentation includes endpoint-by-endpoint details, request and response examples, authentication notes, and frontend usage guidance.

---

## 🛣️ Roadmap

- [x] School registration and admin onboarding
- [x] Authentication and authorization flow
- [x] Course, module, lesson, and upload APIs
- [x] Student enrollment and progress tracking
- [ ] Advanced attendance and gradebook modules
- [ ] Parent and teacher-specific portals
- [ ] Payments and fee management

---

## 📄 License

This project is licensed under the ISC License.
