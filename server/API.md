# School LMS Backend API Documentation

This document provides production-style API documentation for frontend developers integrating with the School LMS backend.

## Base URL

- Development: http://localhost:5000/api/v1
- Production: https://your-domain.com/api/v1

## Authentication Model

- Access tokens are returned by the authentication endpoints and should be sent in the Authorization header.
- Refresh tokens are stored in an HTTP-only cookie by the backend.
- Supported roles:
  - SUPER_ADMIN
  - SCHOOL_ADMIN
  - STUDENT

## Response Format

Most endpoints return a JSON envelope like this:

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

Some list endpoints also include a count field:

```json
{
  "success": true,
  "count": 10,
  "data": []
}
```

---

# Authentication

## 1. Register School

### Description
Creates a new school and the first school admin user.

### HTTP Method
POST

### URL
/api/v1/auth/register-school

### Authentication
Public

### Headers

```http
Content-Type: application/json
```

### URL Parameters
None

### Query Parameters
None

### Request Body

```json
{
  "schoolName": "Nirmaan Academy",
  "schoolEmail": "admin@nirmaan.edu",
  "schoolPhone": "+91-9876543210",
  "schoolAddress": "Bengaluru, Karnataka",
  "firstName": "Asha",
  "lastName": "Patel",
  "email": "asha.patel@nirmaan.edu",
  "password": "Welcome@123"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "school registered successfully.",
  "data": {
    "school": {
      "id": "clx123abc",
      "name": "Nirmaan Academy",
      "slug": "nirmaan-academy",
      "email": "admin@nirmaan.edu",
      "phone": "+91-9876543210",
      "status": "ACTIVE"
    },
    "user": {
      "id": "usr_001",
      "firstName": "Asha",
      "lastName": "Patel",
      "email": "asha.patel@nirmaan.edu",
      "role": "SCHOOL_ADMIN"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Error Responses

400 Bad Request

```json
{
  "success": false,
  "message": "Invalid request payload."
}
```

409 Conflict

```json
{
  "success": false,
  "message": "School already exists."
}
```

500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal server error"
}
```

### Frontend Usage
Called when the school registration form is submitted.

---

## 2. Login

### Description
Authenticates a user and returns a JWT access token.

### HTTP Method
POST

### URL
/api/v1/auth/login

### Authentication
Public

### Headers

```http
Content-Type: application/json
```

### URL Parameters
None

### Query Parameters
None

### Request Body

```json
{
  "identifier": "asha.patel@nirmaan.edu",
  "password": "Welcome@123"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Login successfully.",
  "data": {
    "user": {
      "id": "usr_001",
      "firstName": "Asha",
      "lastName": "Patel",
      "email": "asha.patel@nirmaan.edu",
      "role": "SCHOOL_ADMIN",
      "status": "ACTIVE",
      "mustChangePassword": true
    },
    "school": {
      "id": "clx123abc",
      "name": "Nirmaan Academy"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Error Responses

401 Unauthorized

```json
{
  "success": false,
  "message": "Invalid credentials."
}
```

403 Forbidden

```json
{
  "success": false,
  "message": "Account is inactive."
}
```

500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal server error"
}
```

### Frontend Usage
Called when the user logs in from the login page.

---

## 3. Refresh Token

### Description
Issues a new access token using the refresh token stored in the cookie.

### HTTP Method
POST

### URL
/api/v1/auth/refresh

### Authentication
Public

### Headers

```http
Content-Type: application/json
```

### URL Parameters
None

### Query Parameters
None

### Request Body
None

### Successful Response

```json
{
  "success": true,
  "message": "Access token refreshed successfully.",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Error Responses

401 Unauthorized

```json
{
  "success": false,
  "message": "Refresh token not found."
}
```

500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal server error"
}
```

### Frontend Usage
Called when the access token expires and a new token is required.

---

## 4. Logout

### Description
Revokes the refresh token and clears the authentication session.

### HTTP Method
POST

### URL
/api/v1/auth/logout

### Authentication
Required

Role: Super Admin, School Admin, Student

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### URL Parameters
None

### Query Parameters
None

### Request Body
None

### Successful Response

```json
{
  "success": true,
  "message": "Logout successful."
}
```

### Error Responses

401 Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal server error"
}
```

### Frontend Usage
Called when the user clicks Logout from the app shell.

---

## 5. Current User

### Description
Returns the authenticated user profile and related school information.

### HTTP Method
GET

### URL
/api/v1/auth/me

### Authentication
Required

Role: Super Admin, School Admin, Student

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### URL Parameters
None

### Query Parameters
None

### Request Body
None

### Successful Response

```json
{
  "success": true,
  "message": "User fetched successfully.",
  "data": {
    "id": "usr_001",
    "firstName": "Asha",
    "lastName": "Patel",
    "email": "asha.patel@nirmaan.edu",
    "role": "SCHOOL_ADMIN",
    "status": "ACTIVE",
    "school": {
      "id": "clx123abc",
      "name": "Nirmaan Academy"
    }
  }
}
```

### Error Responses

401 Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

404 Not Found

```json
{
  "success": false,
  "message": "User not found."
}
```

### Frontend Usage
Called on app bootstrap to restore the current user session.

---

## 6. Change Password

### Description
Changes the logged-in user password.

### HTTP Method
PATCH

### URL
/api/v1/auth/change-password

### Authentication
Required

Role: Super Admin, School Admin, Student

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### URL Parameters
None

### Query Parameters
None

### Request Body

```json
{
  "oldPassword": "Welcome@123",
  "newPassword": "NewPass@456"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Password changed successfully."
}
```

### Error Responses

400 Bad Request

```json
{
  "success": false,
  "message": "Current password is incorrect."
}
```

401 Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal server error"
}
```

### Frontend Usage
Called after the user submits the change-password form.

---

# Upload APIs

## 7. Upload Image

### Description
Uploads an image file and returns a public file URL.

### HTTP Method
POST

### URL
/api/v1/upload/image

### Authentication
Required

Role: School Admin, Super Admin

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: multipart/form-data
```

### URL Parameters
None

### Query Parameters
None

### Request Body
Use form-data with a file field named image.

```text
image: <binary file>
```

### Successful Response

```json
{
  "success": true,
  "message": "Image uploaded successfully.",
  "data": {
    "filename": "1753809812345-cover.jpg",
    "originalName": "cover.jpg",
    "mimeType": "image/jpeg",
    "size": 302812,
    "url": "/uploads/images/1753809812345-cover.jpg"
  }
}
```

### Error Responses

400 Bad Request

```json
{
  "success": false,
  "message": "Image is required."
}
```

403 Forbidden

```json
{
  "success": false,
  "message": "Forbidden"
}
```

### Frontend Usage
Called when a course thumbnail or user avatar is being uploaded.

---

## 8. Upload Video

### Description
Uploads a video file that can be attached to a lesson.

### HTTP Method
POST

### URL
/api/v1/upload/video

### Authentication
Required

Role: School Admin, Super Admin

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: multipart/form-data
```

### URL Parameters
None

### Query Parameters
None

### Request Body
Use form-data with a file field named video.

```text
video: <binary file>
```

### Successful Response

```json
{
  "success": true,
  "message": "Video uploaded successfully.",
  "data": {
    "filename": "1753809812345-lesson.mp4",
    "originalName": "lesson.mp4",
    "mimeType": "video/mp4",
    "size": 7891234,
    "url": "/uploads/videos/1753809812345-lesson.mp4"
  }
}
```

### Error Responses

400 Bad Request

```json
{
  "success": false,
  "message": "Video is required."
}
```

403 Forbidden

```json
{
  "success": false,
  "message": "Forbidden"
}
```

### Frontend Usage
Called before creating or updating a lesson with a video attachment.

---

## 9. Upload PDF

### Description
Uploads a PDF file for lesson material.

### HTTP Method
POST

### URL
/api/v1/upload/pdf

### Authentication
Required

Role: School Admin, Super Admin

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: multipart/form-data
```

### URL Parameters
None

### Query Parameters
None

### Request Body
Use form-data with a file field named pdf.

```text
pdf: <binary file>
```

### Successful Response

```json
{
  "success": true,
  "message": "PDF uploaded successfully.",
  "data": {
    "filename": "1753809812345-notes.pdf",
    "originalName": "notes.pdf",
    "mimeType": "application/pdf",
    "size": 456789,
    "url": "/uploads/pdfs/1753809812345-notes.pdf"
  }
}
```

### Error Responses

400 Bad Request

```json
{
  "success": false,
  "message": "PDF is required."
}
```

403 Forbidden

```json
{
  "success": false,
  "message": "Forbidden"
}
```

### Frontend Usage
Called when lesson notes or supporting documents need to be attached.

---

## 10. Delete File

### Description
Deletes an uploaded file from the server storage.

### HTTP Method
DELETE

### URL
/api/v1/upload

### Authentication
Required

Role: School Admin, Super Admin

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### URL Parameters
None

### Query Parameters
None

### Request Body

```json
{
  "fileUrl": "/uploads/images/1753809812345-cover.jpg"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "File deleted successfully."
}
```

### Error Responses

400 Bad Request

```json
{
  "success": false,
  "message": "File URL is required."
}
```

404 Not Found

```json
{
  "success": false,
  "message": "File not found."
}
```

### Frontend Usage
Called when a lesson or course asset is removed and the old file should be cleaned up.

---

# Course APIs

## 11. Create Course

### Description
Creates a new course for the current school.

### HTTP Method
POST

### URL
/api/v1/courses

### Authentication
Required

Role: School Admin, Super Admin

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### URL Parameters
None

### Query Parameters
None

### Request Body

```json
{
  "title": "React for Beginners",
  "description": "A practical course for junior developers.",
  "thumbnail": "/uploads/images/course-thumb.jpg",
  "price": 1999
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Course created successfully.",
  "data": {
    "id": "course_001",
    "title": "React for Beginners",
    "description": "A practical course for junior developers.",
    "thumbnail": "/uploads/images/course-thumb.jpg",
    "price": 1999,
    "status": "DRAFT",
    "schoolId": "clx123abc",
    "createdById": "usr_001"
  }
}
```

### Error Responses

400 Bad Request

```json
{
  "success": false,
  "message": "Invalid request payload."
}
```

401 Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal server error"
}
```

### Frontend Usage
Called when an admin opens the Create Course form and submits the new course.

---

## 12. Get All Courses (Admin)

### Description
Returns all courses belonging to the authenticated school.

### HTTP Method
GET

### URL
/api/v1/courses

### Authentication
Required

Role: School Admin, Super Admin

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### URL Parameters
None

### Query Parameters
None

### Request Body
None

### Successful Response

```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "course_001",
      "title": "React for Beginners",
      "status": "PUBLISHED",
      "price": 1999,
      "createdAt": "2026-07-29T10:30:00.000Z"
    }
  ]
}
```

### Error Responses

401 Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal server error"
}
```

### Frontend Usage
Called while loading the admin course management page.

---

## 13. Get Course Catalog (Student)

### Description
Returns published courses for the current school so students can browse and enroll.

### HTTP Method
GET

### URL
/api/v1/courses/catalog

### Authentication
Required

Role: Student, School Admin, Super Admin

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### URL Parameters
None

### Query Parameters
None

### Request Body
None

### Successful Response

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "course_002",
      "title": "Node.js API Design",
      "description": "Design scalable backend APIs.",
      "thumbnail": "/uploads/images/course-thumb-2.jpg",
      "price": 0,
      "status": "PUBLISHED",
      "createdBy": {
        "firstName": "Asha",
        "lastName": "Patel"
      }
    }
  ]
}
```

### Error Responses

401 Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal server error"
}
```

### Frontend Usage
Called when the student visits the course catalog page.

---

## 14. Get Single Course

### Description
Returns the details of one course including modules and lessons.

### HTTP Method
GET

### URL
/api/v1/courses/:id

### Authentication
Required

Role: School Admin, Super Admin

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### URL Parameters

:id -> Course ID (UUID)

### Query Parameters
None

### Request Body
None

### Successful Response

```json
{
  "success": true,
  "data": {
    "id": "course_001",
    "title": "React for Beginners",
    "description": "A practical course for junior developers.",
    "status": "PUBLISHED",
    "modules": [
      {
        "id": "module_001",
        "title": "Getting Started",
        "order": 1,
        "lessons": []
      }
    ]
  }
}
```

### Error Responses

404 Not Found

```json
{
  "success": false,
  "message": "Course not found."
}
```

401 Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### Frontend Usage
Called when a user opens a course details page.

---

## 15. Update Course

### Description
Updates course metadata and status.

### HTTP Method
PATCH

### URL
/api/v1/courses/:id

### Authentication
Required

Role: School Admin, Super Admin

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### URL Parameters

:id -> Course ID (UUID)

### Query Parameters
None

### Request Body

```json
{
  "title": "React for Beginners - Updated",
  "description": "Updated course description.",
  "price": 1599,
  "status": "PUBLISHED"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Course updated successfully.",
  "data": {
    "id": "course_001",
    "title": "React for Beginners - Updated",
    "status": "PUBLISHED"
  }
}
```

### Error Responses

404 Not Found

```json
{
  "success": false,
  "message": "Course not found."
}
```

400 Bad Request

```json
{
  "success": false,
  "message": "Invalid request payload."
}
```

### Frontend Usage
Called from the course edit form after a user saves changes.

---

## 16. Delete Course

### Description
Deletes a course and its related content.

### HTTP Method
DELETE

### URL
/api/v1/courses/:id

### Authentication
Required

Role: School Admin, Super Admin

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### URL Parameters

:id -> Course ID (UUID)

### Query Parameters
None

### Request Body
None

### Successful Response

```json
{
  "success": true,
  "message": "Course deleted successfully."
}
```

### Error Responses

404 Not Found

```json
{
  "success": false,
  "message": "Course not found."
}
```

401 Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### Frontend Usage
Called when an admin confirms course removal in the admin UI.

---

## 17. Publish Course

### Description
Marks a course as published.

### HTTP Method
PATCH

### URL
/api/v1/courses/:id/publish

### Authentication
Required

Role: School Admin, Super Admin

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### URL Parameters

:id -> Course ID (UUID)

### Query Parameters
None

### Request Body
None

### Successful Response

```json
{
  "success": true,
  "message": "Course published successfully.",
  "data": {
    "id": "course_001",
    "status": "PUBLISHED"
  }
}
```

### Error Responses

404 Not Found

```json
{
  "success": false,
  "message": "Course not found."
}
```

### Frontend Usage
Called when an admin publishes a course from the admin dashboard.

---

## 18. Archive Course

### Description
Marks a course as archived.

### HTTP Method
PATCH

### URL
/api/v1/courses/:id/archive

### Authentication
Required

Role: School Admin, Super Admin

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### URL Parameters

:id -> Course ID (UUID)

### Query Parameters
None

### Request Body
None

### Successful Response

```json
{
  "success": true,
  "message": "Course archived successfully.",
  "data": {
    "id": "course_001",
    "status": "ARCHIVED"
  }
}
```

### Error Responses

404 Not Found

```json
{
  "success": false,
  "message": "Course not found."
}
```

### Frontend Usage
Called when a course should be hidden from the public catalog.

---

# Module APIs

## 19. Create Module

### Description
Creates a module inside a course.

### HTTP Method
POST

### URL
/api/v1/modules/:courseId

### Authentication
Required

Role: School Admin, Super Admin

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### URL Parameters

:courseId -> Course ID (UUID)

### Query Parameters
None

### Request Body

```json
{
  "title": "Introduction"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Module created successfully.",
  "data": {
    "id": "module_001",
    "title": "Introduction",
    "courseId": "course_001",
    "order": 1
  }
}
```

### Error Responses

404 Not Found

```json
{
  "success": false,
  "message": "Course not found."
}
```

### Frontend Usage
Called in the admin course builder when a new module is added.

---

## 20. Get Modules

### Description
Returns all modules for a specific course.

### HTTP Method
GET

### URL
/api/v1/modules/course/:courseId

### Authentication
Required

Role: School Admin, Super Admin

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### URL Parameters

:courseId -> Course ID (UUID)

### Query Parameters
None

### Request Body
None

### Successful Response

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "module_001",
      "title": "Introduction",
      "order": 1
    }
  ]
}
```

### Error Responses

401 Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### Frontend Usage
Called while rendering the curriculum editor for a course.

---

## 21. Update Module

### Description
Updates the title or order of a module.

### HTTP Method
PATCH

### URL
/api/v1/modules/:id

### Authentication
Required

Role: School Admin, Super Admin

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### URL Parameters

:id -> Module ID (UUID)

### Query Parameters
None

### Request Body

```json
{
  "title": "Introduction to React"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Module updated successfully.",
  "data": {
    "id": "module_001",
    "title": "Introduction to React"
  }
}
```

### Error Responses

404 Not Found

```json
{
  "success": false,
  "message": "Module not found."
}
```

### Frontend Usage
Called after editing a module name in the curriculum UI.

---

## 22. Delete Module

### Description
Deletes a module from a course.

### HTTP Method
DELETE

### URL
/api/v1/modules/:id

### Authentication
Required

Role: School Admin, Super Admin

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### URL Parameters

:id -> Module ID (UUID)

### Query Parameters
None

### Request Body
None

### Successful Response

```json
{
  "success": true,
  "message": "Module deleted successfully."
}
```

### Error Responses

404 Not Found

```json
{
  "success": false,
  "message": "Module not found."
}
```

### Frontend Usage
Called when removing a module from the course builder.

---

## 23. Reorder Modules

### Description
Reorders modules inside a course.

### HTTP Method
PATCH

### URL
/api/v1/modules/course/:courseId/reorder

### Authentication
Required

Role: School Admin, Super Admin

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### URL Parameters

:courseId -> Course ID (UUID)

### Query Parameters
None

### Request Body

```json
{
  "moduleIds": [
    "module_002",
    "module_001"
  ]
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Modules reordered successfully."
}
```

### Error Responses

400 Bad Request

```json
{
  "success": false,
  "message": "Invalid module order."
}
```

### Frontend Usage
Called after dragging modules in the admin curriculum UI.

---

# Lesson APIs

## 24. Create Lesson

### Description
Creates a lesson inside a module.

### HTTP Method
POST

### URL
/api/v1/lessons/:moduleId

### Authentication
Required

Role: School Admin, Super Admin

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### URL Parameters

:moduleId -> Module ID (UUID)

### Query Parameters
None

### Request Body

```json
{
  "title": "What is React?",
  "description": "Introduction to the React library.",
  "videoUrl": "/uploads/videos/lesson-1.mp4",
  "pdfUrl": "/uploads/pdfs/lesson-notes.pdf",
  "duration": 600,
  "isPreview": true
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Lesson created successfully.",
  "data": {
    "id": "lesson_001",
    "title": "What is React?",
    "moduleId": "module_001",
    "order": 1
  }
}
```

### Error Responses

404 Not Found

```json
{
  "success": false,
  "message": "Module not found."
}
```

### Frontend Usage
Called when an admin adds a lesson to a module.

---

## 25. Get Lessons

### Description
Returns all lessons in a module.

### HTTP Method
GET

### URL
/api/v1/lessons/module/:moduleId

### Authentication
Required

Role: School Admin, Super Admin

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### URL Parameters

:moduleId -> Module ID (UUID)

### Query Parameters
None

### Request Body
None

### Successful Response

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "lesson_001",
      "title": "What is React?",
      "order": 1,
      "isPreview": true
    }
  ]
}
```

### Error Responses

401 Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### Frontend Usage
Called while rendering the lesson list for a module.

---

## 26. Get Single Lesson

### Description
Returns the details of one lesson.

### HTTP Method
GET

### URL
/api/v1/lessons/:id

### Authentication
Required

Role: School Admin, Super Admin

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### URL Parameters

:id -> Lesson ID (UUID or CUID)

### Query Parameters
None

### Request Body
None

### Successful Response

```json
{
  "success": true,
  "data": {
    "id": "lesson_001",
    "title": "What is React?",
    "description": "Introduction to the React library.",
    "videoUrl": "/uploads/videos/lesson-1.mp4",
    "pdfUrl": "/uploads/pdfs/lesson-notes.pdf",
    "duration": 600,
    "isPreview": true
  }
}
```

### Error Responses

404 Not Found

```json
{
  "success": false,
  "message": "Lesson not found."
}
```

### Frontend Usage
Called when the student or admin opens a lesson detail page.

---

## 27. Update Lesson

### Description
Updates lesson title, description, media, or preview state.

### HTTP Method
PATCH

### URL
/api/v1/lessons/:id

### Authentication
Required

Role: School Admin, Super Admin

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### URL Parameters

:id -> Lesson ID (UUID or CUID)

### Query Parameters
None

### Request Body

```json
{
  "title": "What is React? - Part 2",
  "description": "Updated lesson description.",
  "isPreview": false
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Lesson updated successfully.",
  "data": {
    "id": "lesson_001",
    "title": "What is React? - Part 2"
  }
}
```

### Error Responses

404 Not Found

```json
{
  "success": false,
  "message": "Lesson not found."
}
```

### Frontend Usage
Called after saving edits in the lesson editor.

---

## 28. Delete Lesson

### Description
Deletes a lesson and removes its uploaded media when available.

### HTTP Method
DELETE

### URL
/api/v1/lessons/:id

### Authentication
Required

Role: School Admin, Super Admin

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### URL Parameters

:id -> Lesson ID (UUID or CUID)

### Query Parameters
None

### Request Body
None

### Successful Response

```json
{
  "success": true,
  "message": "Lesson deleted successfully."
}
```

### Error Responses

404 Not Found

```json
{
  "success": false,
  "message": "Lesson not found."
}
```

### Frontend Usage
Called after the admin confirms deletion of a lesson.

---

## 29. Reorder Lessons

### Description
Reorders lessons inside a module.

### HTTP Method
PATCH

### URL
/api/v1/lessons/module/:moduleId/reorder

### Authentication
Required

Role: School Admin, Super Admin

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### URL Parameters

:moduleId -> Module ID (UUID)

### Query Parameters
None

### Request Body

```json
{
  "lessonIds": [
    "lesson_002",
    "lesson_001"
  ]
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Lessons reordered successfully."
}
```

### Error Responses

400 Bad Request

```json
{
  "success": false,
  "message": "Invalid lesson IDs provided."
}
```

### Frontend Usage
Called after drag-and-drop lesson ordering in the admin editor.

---

# Student APIs

## 30. Create Student

### Description
Creates a new student account for the current school.

### HTTP Method
POST

### URL
/api/v1/users/students

### Authentication
Required

Role: School Admin, Super Admin

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### URL Parameters
None

### Query Parameters
None

### Request Body

```json
{
  "firstName": "Riya",
  "lastName": "Sharma",
  "email": "riya.sharma@example.com",
  "phone": "+91-9876543211"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Student created successfully.",
  "data": {
    "id": "usr_002",
    "studentId": "STD20260001",
    "firstName": "Riya",
    "lastName": "Sharma",
    "email": "riya.sharma@example.com",
    "phone": "+91-9876543211",
    "role": "STUDENT",
    "status": "ACTIVE",
    "createdAt": "2026-07-29T10:30:00.000Z",
    "temporaryPassword": "a1b2c3d4@1"
  }
}
```

### Error Responses

409 Conflict

```json
{
  "success": false,
  "message": "Student with this email already exists."
}
```

### Frontend Usage
Called from the admin student management form after creating a new student account.

---

## 31. Get All Students

### Description
Returns paginated student records for the current school.

### HTTP Method
GET

### URL
/api/v1/users/students

### Authentication
Required

Role: School Admin, Super Admin

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### URL Parameters
None

### Query Parameters

page -> Page number (default: 1)

limit -> Records per page (default: 10)

search -> Search by name, email, or student ID

### Request Body
None

### Successful Response

```json
{
  "success": true,
  "message": "Students fetched successfully.",
  "data": {
    "students": [
      {
        "id": "usr_002",
        "studentId": "STD20260001",
        "firstName": "Riya",
        "lastName": "Sharma",
        "email": "riya.sharma@example.com",
        "status": "ACTIVE"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "totalPages": 3
    }
  }
}
```

### Error Responses

401 Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### Frontend Usage
Called when the admin opens the student list page.

---

## 32. Get Single Student

### Description
Returns the profile of one student and their enrolled courses.

### HTTP Method
GET

### URL
/api/v1/users/students/:id

### Authentication
Required

Role: School Admin, Super Admin

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### URL Parameters

:id -> Student User ID (UUID)

### Query Parameters
None

### Request Body
None

### Successful Response

```json
{
  "success": true,
  "message": "Student fetched successfully.",
  "data": {
    "id": "usr_002",
    "studentId": "STD20260001",
    "firstName": "Riya",
    "lastName": "Sharma",
    "email": "riya.sharma@example.com",
    "status": "ACTIVE",
    "enrollments": []
  }
}
```

### Error Responses

404 Not Found

```json
{
  "success": false,
  "message": "Student not found."
}
```

### Frontend Usage
Called when the admin opens a student details view.

---

## 33. Update Student

### Description
Updates a student profile field such as name, email, phone, or status.

### HTTP Method
PATCH

### URL
/api/v1/users/students/:id

### Authentication
Required

Role: School Admin, Super Admin

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### URL Parameters

:id -> Student User ID (UUID)

### Query Parameters
None

### Request Body

```json
{
  "firstName": "Riya",
  "lastName": "Sharma",
  "phone": "+91-9876543212",
  "status": "ACTIVE"
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Student updated successfully.",
  "data": {
    "id": "usr_002",
    "studentId": "STD20260001",
    "firstName": "Riya",
    "lastName": "Sharma",
    "email": "riya.sharma@example.com",
    "status": "ACTIVE"
  }
}
```

### Error Responses

409 Conflict

```json
{
  "success": false,
  "message": "Email is already in use."
}
```

### Frontend Usage
Called after editing the student profile in the admin panel.

---

## 34. Delete Student

### Description
Soft-deletes a student by marking them inactive.

### HTTP Method
DELETE

### URL
/api/v1/users/students/:id

### Authentication
Required

Role: School Admin, Super Admin

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### URL Parameters

:id -> Student User ID (UUID)

### Query Parameters
None

### Request Body
None

### Successful Response

```json
{
  "success": true,
  "message": "Student deleted successfully."
}
```

### Error Responses

400 Bad Request

```json
{
  "success": false,
  "message": "Student is already inactive."
}
```

### Frontend Usage
Called when an admin removes a student from active enrollment.

---

# Enrollment APIs

## 35. Enroll Course

### Description
Enrolls the current student in a course.

### HTTP Method
POST

### URL
/api/v1/enrollments/enroll/:courseId

### Authentication
Required

Role: Student, School Admin, Super Admin

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### URL Parameters

:courseId -> Course ID (UUID)

### Query Parameters
None

### Request Body
None

### Successful Response

```json
{
  "success": true,
  "message": "Enrolled successfully.",
  "data": {
    "id": "enr_001",
    "userId": "usr_002",
    "courseId": "course_001",
    "progress": 0,
    "completed": false
  }
}
```

### Error Responses

409 Conflict

```json
{
  "success": false,
  "message": "Already enrolled in this course."
}
```

404 Not Found

```json
{
  "success": false,
  "message": "Course not found."
}
```

### Frontend Usage
Called after clicking Enroll Now on a course card.

---

## 36. My Courses

### Description
Returns all courses the current student is enrolled in.

### HTTP Method
GET

### URL
/api/v1/enrollments/my-courses

### Authentication
Required

Role: Student, School Admin, Super Admin

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### URL Parameters
None

### Query Parameters
None

### Request Body
None

### Successful Response

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "enr_001",
      "progress": 45,
      "completed": false,
      "course": {
        "id": "course_001",
        "title": "React for Beginners",
        "status": "PUBLISHED"
      }
    }
  ]
}
```

### Error Responses

401 Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### Frontend Usage
Called while loading the student dashboard and enrolled course list.

---

## 37. Course Students

### Description
Returns all students enrolled in a particular course.

### HTTP Method
GET

### URL
/api/v1/enrollments/course/:courseId/students

### Authentication
Required

Role: School Admin, Super Admin

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### URL Parameters

:courseId -> Course ID (UUID)

### Query Parameters
None

### Request Body
None

### Successful Response

```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "user": {
        "id": "usr_002",
        "firstName": "Riya",
        "lastName": "Sharma",
        "email": "riya@example.com"
      }
    }
  ]
}
```

### Error Responses

404 Not Found

```json
{
  "success": false,
  "message": "Course not found."
}
```

### Frontend Usage
Called in the admin course analytics and enrollment management screens.

---

## 38. Update Progress

### Description
Updates the student progress for a course.

### HTTP Method
PATCH

### URL
/api/v1/enrollments/progress/:courseId

### Authentication
Required

Role: Student

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### URL Parameters

:courseId -> Course ID (UUID)

### Query Parameters
None

### Request Body

```json
{
  "progress": 75
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Progress updated successfully.",
  "data": {
    "userId": "usr_002",
    "courseId": "course_001",
    "progress": 75,
    "completed": false
  }
}
```

### Error Responses

404 Not Found

```json
{
  "success": false,
  "message": "Enrollment not found."
}
```

### Frontend Usage
Called when a student marks progress while watching lessons.

---

## 39. Unenroll

### Description
Removes the current student from a course enrollment.

### HTTP Method
DELETE

### URL
/api/v1/enrollments/unenroll/:courseId

### Authentication
Required

Role: Student, School Admin

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### URL Parameters

:courseId -> Course ID (UUID)

### Query Parameters
None

### Request Body
None

### Successful Response

```json
{
  "success": true,
  "message": "Enrollment removed successfully."
}
```

### Error Responses

404 Not Found

```json
{
  "success": false,
  "message": "Enrollment not found."
}
```

### Frontend Usage
Called when a student leaves a course from the My Courses page.

---

# Dashboard APIs

## 40. Admin Dashboard

### Description
Returns admin statistics and recent activity for the current school.

### HTTP Method
GET

### URL
/api/v1/dashboard/admin

### Authentication
Required

Role: School Admin

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### URL Parameters
None

### Query Parameters
None

### Request Body
None

### Successful Response

```json
{
  "success": true,
  "message": "Admin dashboard fetched successfully.",
  "data": {
    "statistics": {
      "totalStudents": 120,
      "activeStudents": 98,
      "inactiveStudents": 22,
      "totalCourses": 14,
      "publishedCourses": 8,
      "draftCourses": 6,
      "totalEnrollments": 340
    },
    "recentStudents": [],
    "recentCourses": [],
    "latestEnrollments": [],
    "topCourses": []
  }
}
```

### Error Responses

401 Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### Frontend Usage
Called on the School Admin dashboard landing page.

---

## 41. Student Dashboard

### Description
Returns student profile, course statistics, and learning progress.

### HTTP Method
GET

### URL
/api/v1/dashboard/student

### Authentication
Required

Role: Student

### Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### URL Parameters
None

### Query Parameters
None

### Request Body
None

### Successful Response

```json
{
  "success": true,
  "message": "Student dashboard fetched successfully.",
  "data": {
    "profile": {
      "id": "usr_002",
      "studentId": "STD20260001",
      "fullName": "Riya Sharma",
      "email": "riya@example.com"
    },
    "statistics": {
      "enrolledCourses": 3,
      "completedCourses": 1,
      "inProgressCourses": 2,
      "overallProgress": 62.5
    },
    "continueLearning": {
      "title": "React for Beginners"
    },
    "enrolledCourses": []
  }
}
```

### Error Responses

401 Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### Frontend Usage
Called when the student opens the dashboard page.

---

# Authentication Flow

```text
Login
↓
Receive Access Token
↓
Store Token
↓
Call Protected APIs
↓
Refresh Token when expired
↓
Logout and clear session
```

---

# Student Flow

```text
Login
↓
Browse Course Catalog
↓
View Course
↓
Enroll
↓
My Courses
↓
Watch Lessons
↓
Update Progress
↓
Continue Learning
```

---

# Admin Flow

```text
Login
↓
Create Course
↓
Upload Thumbnail
↓
Create Modules
↓
Upload Lessons
↓
Publish Course
↓
View Dashboard
```

---

# API Status Table

| Endpoint | Method | Role | Status | Purpose |
| --- | --- | --- | --- | --- |
| /auth/register-school | POST | Public | Implemented | Register school and admin |
| /auth/login | POST | Public | Implemented | Login and get token |
| /auth/refresh | POST | Public | Implemented | Refresh access token |
| /auth/logout | POST | Super Admin / School Admin / Student | Implemented | Logout and revoke token |
| /auth/me | GET | Super Admin / School Admin / Student | Implemented | Fetch current user |
| /auth/change-password | PATCH | Super Admin / School Admin / Student | Implemented | Change password |
| /upload/image | POST | School Admin / Super Admin | Implemented | Upload image |
| /upload/video | POST | School Admin / Super Admin | Implemented | Upload video |
| /upload/pdf | POST | School Admin / Super Admin | Implemented | Upload pdf |
| /upload | DELETE | School Admin / Super Admin | Implemented | Delete uploaded file |
| /courses | POST | School Admin / Super Admin | Implemented | Create course |
| /courses | GET | School Admin / Super Admin | Implemented | List admin courses |
| /courses/catalog | GET | Student / School Admin / Super Admin | Implemented | Browse published courses |
| /courses/:id | GET | School Admin / Super Admin | Implemented | Get single course |
| /courses/:id | PATCH | School Admin / Super Admin | Implemented | Update course |
| /courses/:id | DELETE | School Admin / Super Admin | Implemented | Delete course |
| /courses/:id/publish | PATCH | School Admin / Super Admin | Implemented | Publish course |
| /courses/:id/archive | PATCH | School Admin / Super Admin | Implemented | Archive course |
| /modules/:courseId | POST | School Admin / Super Admin | Implemented | Create module |
| /modules/course/:courseId | GET | School Admin / Super Admin | Implemented | List modules |
| /modules/:id | PATCH | School Admin / Super Admin | Implemented | Update module |
| /modules/:id | DELETE | School Admin / Super Admin | Implemented | Delete module |
| /lessons/:moduleId | POST | School Admin / Super Admin | Implemented | Create lesson |
| /lessons/module/:moduleId | GET | School Admin / Super Admin | Implemented | List lessons |
| /lessons/:id | GET | School Admin / Super Admin | Implemented | Get lesson |
| /lessons/:id | PATCH | School Admin / Super Admin | Implemented | Update lesson |
| /lessons/:id | DELETE | School Admin / Super Admin | Implemented | Delete lesson |
| /users/students | POST | School Admin / Super Admin | Implemented | Create student |
| /users/students | GET | School Admin / Super Admin | Implemented | List students |
| /users/students/:id | GET | School Admin / Super Admin | Implemented | Get student |
| /enrollments/enroll/:courseId | POST | Student / School Admin / Super Admin | Implemented | Enroll in course |
| /enrollments/my-courses | GET | Student / School Admin / Super Admin | Implemented | Fetch enrolled courses |
| /enrollments/course/:courseId/students | GET | School Admin / Super Admin | Implemented | View course students |
| /enrollments/progress/:courseId | PATCH | Student | Implemented | Update course progress |
| /enrollments/unenroll/:courseId | DELETE | Student / School Admin | Implemented | Unenroll course |
| /dashboard/admin | GET | School Admin | Implemented | Admin dashboard data |
| /dashboard/student | GET | Student | Implemented | Student dashboard data |

---

# Folder Structure

The frontend should consume these endpoints from the following route areas:

- /app/auth/school-admin-login/page.tsx -> login and registration flows
- /app/auth/student-login/page.tsx -> student login flow
- /app/school-admin/dashboard/page.tsx -> admin dashboard data
- /app/school-admin/courses/page.tsx -> create, list, update, publish, archive courses
- /app/school-admin/students/page.tsx -> create, list, update, delete students
- /app/school-admin/attendance/page.tsx -> optional future integration with attendance and enrollment data
- /app/student/dashboard/page.tsx -> student dashboard data
- /app/student/dashboard/page.tsx -> my courses and learning progress
- /app/course/[id]/page.tsx -> single course details and lesson viewing
- /app/courses/page.tsx -> course catalog browsing

---

# Frontend Integration Notes

## JWT Storage

- Store the access token in memory for short-lived usage, or in local storage if a simple client-side flow is preferred.
- The refresh token is handled by the backend through an HTTP-only cookie.

## Authorization Header

Send access tokens as:

```http
Authorization: Bearer <ACCESS_TOKEN>
```

## Error Handling

- Handle 401 by redirecting the user to login.
- Handle 403 by showing a role-based access message.
- Handle 409 by showing a conflict message such as duplicate email or already enrolled.
- Handle 500 by showing a generic fallback error state.

## Loading States

Use loading indicators while calling:

- login
- dashboard fetches
- course list fetches
- lesson and module loading
- student list and enrollment actions

## Pagination

The student list endpoint supports:

- page
- limit
- search

Example:

```http
GET /api/v1/users/students?page=2&limit=10&search=riya
```

## Image URLs

Image URLs returned by the upload API should be prefixed with the backend base URL:

```ts
const imageUrl = `${API_BASE_URL}${response.data.url}`;
```

## Video URLs

Video URLs returned by the upload API should be used directly in the video player or converted to a full absolute URL.

## File URLs

PDF and other file URLs should be opened in a new tab or embedded in a document viewer.

---

## Summary

This backend exposes a complete set of APIs for:

- authentication and session management
- school and admin onboarding
- course creation and publishing
- module and lesson management
- student management
- course enrollment and progress tracking
- student and admin dashboards

For frontend integration, the recommended flow is:

1. Login or register a school
2. Store the returned access token
3. Call protected APIs with the Authorization header
4. Refresh tokens automatically when needed
5. Handle errors and loading states gracefully
