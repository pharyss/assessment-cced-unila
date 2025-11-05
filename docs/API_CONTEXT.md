# CCED UNILA Assessment Backend API - AI Context Documentation

## Overview

**API Name:** CCED UNILA Assessment Backend API
**Version:** 0.8.0
**Base URL:** http://localhost:3000
**Description:** Backend API for the Center for Character and Ethics Development (CCED) University of Lampung assessment system.
**Author:** Muhammad Azka Naufal (mhmdazkanfl@gmail.com)
**OpenAPI Version:** 3.0.3

## Response Format Standards

### Success Response (200/201)
```json
{
  "status": "success",
  "data": { /* response data */ }
}
```

### Success Response with Pagination
```json
{
  "status": "success",
  "data": [ /* array of items */ ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "totalItems": 100,
    "totalPages": 10
  }
}
```

### Validation Error Response (422)
```json
{
  "status": "fail",
  "data": [
    {
      "field": "fieldName",
      "message": "Error message"
    }
  ]
}
```

### Server Error Response (500)
```json
{
  "status": "error",
  "message": "Error message"
}
```

### Not Found Error Response (404)
```json
{
  "status": "fail",
  "data": [
    {
      "field": "resource",
      "message": "Not found message"
    }
  ]
}
```

---

## API Endpoints

### 1. System Endpoints

#### GET /system
**Summary:** Get API Metadata
**Description:** Returns metadata and runtime information about this backend service.

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "name": "string",
    "version": "string",
    "description": "string",
    "environment": "string",
    "docs": {
      "ui": "string (URL)",
      "json": "string (URL)"
    },
    "runtime": {
      "bun": "string",
      "platform": "string",
      "isBun": true
    },
    "author": {
      "name": "string",
      "email": "string (email format)"
    },
    "serverTime": "string (ISO datetime)",
    "uptimeSeconds": 12345
  }
}
```

---

#### GET /system/health
**Summary:** Service Health Check
**Description:** Returns the health status of each service used by this app.

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "database": {
      "status": "healthy" | "bad",
      "uptime": "string",
      "message": "string"
    }
  }
}
```

---

#### GET /system/echo
**Summary:** Echo
**Description:** A simple echo endpoint to test if the API is reachable.

**Response 200:**
```
Hello world!
```

---

#### POST /system/seed-db
**Summary:** Seed Database with Sample Data
**Description:** Seeds the database with sample data for testing purposes.

**Query Parameters:**
- `user` (boolean, optional): Seed user data
- `student` (boolean, optional): Seed student data
- `test` (boolean, optional): Seed test data
- `result` (boolean, optional): Seed result data

---

#### POST /system/reset-db
**Summary:** Reset Database
**Description:** Resets the database by dropping and recreating all tables.

**Query Parameters:**
- `areYouSure` (boolean, optional, default: false): Confirmation flag

---

### 2. Filter Endpoints

#### GET /filters/students
**Summary:** Get Student Filter Options
**Description:** Returns available filter options for students (degrees, departments, enrollment years, faculties, majors).

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "degrees": [
      {
        "id": 1,
        "name": "string"
      }
    ],
    "departments": [
      {
        "id": 1,
        "name": "string"
      }
    ],
    "enrollmentYears": [
      {
        "id": 1,
        "name": "string"
      }
    ],
    "faculties": [
      {
        "id": 1,
        "name": "string"
      }
    ],
    "majors": [
      {
        "id": 1,
        "name": "string"
      }
    ]
  }
}
```

---

### 3. Student Endpoints

#### GET /students
**Summary:** Get Students List
**Description:** Returns a paginated list of students with optional filtering and searching.

**Query Parameters:**
- `page` (number, optional, min: 1): Page number
- `pageSize` (number, optional, min: 1, max: 100): Items per page (default: 10)
- `search` (string, optional): Search by name or NPM (e.g., "Jack Marlow" or "2215061066")
- `enrollmentYearId` (array of numbers, optional): Filter by enrollment year IDs
- `majorId` (array of numbers, optional): Filter by major IDs
- `facultyId` (array of numbers, optional): Filter by faculty IDs
- `degreeId` (array of numbers, optional): Filter by degree IDs
- `sortDirection` (string, optional): "asc" or "desc"

**Response 200:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "npm": "2215061066",
      "name": "Student Name",
      "email": "student@example.com" | null,
      "enrollmentYearId": 1,
      "majorId": 1,
      "facultyId": 1,
      "degreeId": 1,
      "createdAt": "ISO datetime",
      "updatedAt": "ISO datetime",
      "submissions": [
        {
          "id": "uuid",
          "studentId": "uuid",
          "testId": 1,
          "status": "in_progress" | "completed",
          "createdAt": "ISO datetime",
          "completedAt": "ISO datetime" | null,
          "results": [
            {
              "id": "uuid",
              "testSubmissionId": "uuid" | null,
              "testId": 1 | null,
              "result": "string",
              "createdAt": "ISO datetime",
              "test": {
                "id": 1,
                "name": "Test Name",
                "description": "string" | null,
                "active": true,
                "parentId": 1 | null,
                "createdAt": "ISO datetime"
              } | null
            }
          ]
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "totalItems": 100,
    "totalPages": 10
  }
}
```

---

#### POST /students
**Summary:** Create New Student
**Description:** Creates a new student record.

**Request Body (JSON/Form/Multipart):**
```json
{
  "npm": "2215061066",           // Required: 10 numeric digits
  "name": "Budi Santoso",         // Required: Non-empty string
  "email": "budi@example.com" | null,  // Optional: Valid email or null
  "enrollmentYearId": 1,          // Required: Positive integer
  "majorId": 1,                   // Required: Positive integer
  "facultyId": 1,                 // Required: Positive integer
  "degreeId": 1                   // Required: Positive integer
}
```

**Response 201:**
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "npm": "2215061066",
    "name": "Budi Santoso",
    "email": "budi@example.com" | null,
    "enrollmentYearId": 1,
    "majorId": 1,
    "facultyId": 1,
    "degreeId": 1,
    "createdAt": "ISO datetime",
    "updatedAt": "ISO datetime"
  }
}
```

---

#### GET /students/{npm}
**Summary:** Get Student by NPM
**Description:** Returns detailed information about a specific student.

**Path Parameters:**
- `npm` (string, required): 10-digit NPM (e.g., "2215061066")

**Response 200:** Same structure as POST /students response, with additional `submissions` array.

---

#### PATCH /students/{npm}
**Summary:** Update Student
**Description:** Updates student information. At least one field must be provided.

**Path Parameters:**
- `npm` (string, required): 10-digit NPM

**Request Body (JSON/Form/Multipart):**
```json
{
  "npm": "2215061066",           // Optional: 10 numeric digits
  "name": "Budi Santoso",         // Optional: Non-empty string
  "email": "budi@example.com" | null,  // Optional: Valid email or null
  "enrollmentYearId": 1,          // Optional: Positive integer
  "majorId": 1,                   // Optional: Positive integer
  "facultyId": 1,                 // Optional: Positive integer
  "degreeId": 1                   // Optional: Positive integer
}
```

**Response 201:** Same as POST /students response.

---

### 4. Test Endpoints

#### GET /tests
**Summary:** Get Tests List
**Description:** Returns a paginated list of tests with optional filtering.

**Query Parameters:**
- `page` (number, optional, min: 1): Page number
- `pageSize` (number, optional, min: 1, max: 100): Items per page
- `search` (string, optional): Search by test name
- `showSubTest` (boolean, optional): Include sub-tests
- `sortDirection` (string, optional): "asc" or "desc"

**Response 200:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Test Name",
      "description": "string" | null,
      "active": true,
      "parentId": 1 | null,
      "createdAt": "ISO datetime"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "totalItems": 50,
    "totalPages": 5
  }
}
```

---

#### POST /tests
**Summary:** Create New Test
**Description:** Creates a new test with instructions, notes, and questions.

**Request Body (JSON/Form/Multipart):**
```json
{
  "name": "Test Name",                    // Required: Non-empty string
  "description": "Test description" | null, // Optional: String or null
  "active": true,                          // Optional: Boolean (default: true)
  "parentId": 1 | null,                   // Optional: Positive integer or null
  "instructions": [                        // Required: Array of instructions
    {
      "text": "Instruction text",         // Required: Non-empty string
      "order": 0                           // Required: Non-negative integer
    }
  ],
  "notes": [                               // Required: Array of notes
    {
      "text": "Note text",                 // Required: Non-empty string
      "order": 0                           // Required: Non-negative integer
    }
  ],
  "questions": [                           // Required: Array of questions
    {
      "text": "Question text",            // Required: Non-empty string
      "type": "multiple_choice" | "single_choice" | "likert", // Required
      "order": 0,                          // Required: Non-negative integer
      "options": [                         // Required: Array of options
        {
          "text": "Option text",          // Required: Non-empty string
          "value": "option_value",        // Required: Non-empty string
          "order": 0                       // Required: Non-negative integer
        }
      ]
    }
  ]
}
```

**Response 201:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Test Name",
    "description": "string" | null,
    "active": true,
    "parentId": 1 | null,
    "createdAt": "ISO datetime",
    "instructions": [
      {
        "id": "uuid",
        "text": "Instruction text",
        "order": 0,
        "testId": 1
      }
    ],
    "notes": [
      {
        "id": "uuid",
        "text": "Note text",
        "order": 0,
        "testId": 1
      }
    ],
    "questions": [
      {
        "id": "uuid",
        "text": "Question text",
        "type": "multiple_choice",
        "order": 0,
        "testId": 1,
        "options": [
          {
            "id": "uuid",
            "text": "Option text",
            "value": "option_value",
            "order": 0,
            "testQuestionId": "uuid"
          }
        ]
      }
    ]
  }
}
```

---

#### GET /tests/{testId}
**Summary:** Get Test by ID
**Description:** Returns detailed information about a specific test.

**Path Parameters:**
- `testId` (number, required): Test ID (positive integer)

**Response 200:** Same structure as POST /tests response.

---

#### PUT /tests/{testId}
**Summary:** Update Test
**Description:** Updates a test with all its related data.

**Path Parameters:**
- `testId` (number, required): Test ID

**Request Body (JSON/Form/Multipart):**
```json
{
  "name": "Test Name",                    // Optional: Non-empty string
  "description": "Test description" | null, // Optional: String or null
  "active": true,                          // Optional: Boolean
  "parentId": 1 | null,                   // Optional: Positive integer or null
  "instructions": [                        // Required: Array of instructions
    {
      "id": "uuid",                        // Optional: Existing instruction ID
      "text": "Instruction text",         // Optional: Non-empty string
      "order": 0                           // Optional: Non-negative integer
    }
  ],
  "notes": [                               // Required: Array of notes
    {
      "id": "uuid",                        // Optional: Existing note ID
      "text": "Note text",                 // Optional: Non-empty string
      "order": 0                           // Optional: Non-negative integer
    }
  ],
  "questions": [                           // Required: Array of questions
    {
      "id": "uuid",                        // Optional: Existing question ID
      "text": "Question text",            // Optional: Non-empty string
      "type": "multiple_choice" | "single_choice" | "likert", // Optional
      "order": 0,                          // Optional: Non-negative integer
      "options": [                         // Required: Array of options
        {
          "id": "uuid",                    // Optional: Existing option ID
          "text": "Option text",          // Optional: Non-empty string
          "value": "option_value",        // Optional: Non-empty string
          "order": 0                       // Optional: Non-negative integer
        }
      ]
    }
  ]
}
```

**Response 200:** Same as POST /tests response.

---

#### GET /tests/{testId}/instructions
**Summary:** Get Test Instructions
**Description:** Returns all instructions for a specific test.

**Path Parameters:**
- `testId` (number, required): Test ID

**Response 200:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "text": "Instruction text",
      "order": 0,
      "testId": 1
    }
  ]
}
```

---

#### GET /tests/{testId}/notes
**Summary:** Get Test Notes
**Description:** Returns all notes for a specific test.

**Path Parameters:**
- `testId` (number, required): Test ID

**Response 200:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "text": "Note text",
      "order": 0,
      "testId": 1
    }
  ]
}
```

---

#### GET /tests/{testId}/questions
**Summary:** Get Test Questions
**Description:** Returns all questions with their options for a specific test.

**Path Parameters:**
- `testId` (number, required): Test ID

**Response 200:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "text": "Question text",
      "type": "multiple_choice",
      "order": 0,
      "testId": 1,
      "options": [
        {
          "id": "uuid",
          "text": "Option text",
          "value": "option_value",
          "order": 0,
          "testQuestionId": "uuid"
        }
      ]
    }
  ]
}
```

---

### 5. Result Endpoints

#### GET /results
**Summary:** Get Results
**Description:** Returns test results (endpoint details not fully specified in OpenAPI).

---

#### POST /results/test-submission
**Summary:** Create Test Submission
**Description:** Creates a new test submission for a student.

**Request Body (JSON/Form/Multipart):**
```json
{
  "studentId": "019a4353-2f21-7c4f-80f8-93eaa7afd6ca", // Required: UUID
  "testId": 1,                                          // Required: Positive integer
  "status": "in_progress" | "completed",                // Required
  "completedAt": "ISO datetime" | null                  // Optional: Date or null
}
```

**Response 201:**
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "studentId": "uuid",
    "testId": 1,
    "status": "in_progress",
    "createdAt": "ISO datetime",
    "completedAt": "ISO datetime" | null
  }
}
```

---

#### POST /results/test-submission/answer
**Summary:** Submit Test Answer
**Description:** Records a student's answer to a test question.

**Request Body (JSON/Form/Multipart):**
```json
{
  "testSubmissionId": "019a2689-d51c-70fc-8a84-d6423ee19c04", // Required: UUID
  "testQuestionId": "019a2689-eaf9-7dce-936c-191f988d195c",   // Required: UUID
  "selectedOptionId": "019a2689-fd2f-7bf3-8733-8883b8f9f6c7" // Required: UUID
}
```

**Response 201:**
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "testSubmissionId": "uuid",
    "testQuestionId": "uuid",
    "selectedOptionId": "uuid",
    "createdAt": "ISO datetime"
  }
}
```

---

#### POST /results/test-submission/result
**Summary:** Submit Test Result
**Description:** Records the final result of a test submission.

**Request Body (JSON/Form/Multipart):**
```json
{
  "testSubmissionId": "019a2689-d51c-70fc-8a84-d6423ee19c04", // Required: UUID
  "testId": 1,                                                 // Required: Positive integer
  "result": "result_value"                                     // Required: Non-empty string
}
```

**Response 201:**
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "testSubmissionId": "uuid" | null,
    "testId": 1 | null,
    "result": "result_value",
    "createdAt": "ISO datetime"
  }
}
```

---

#### PATCH /results/test-submission/{submissionId}
**Summary:** Update Test Submission
**Description:** Updates a test submission. At least one field must be provided.

**Path Parameters:**
- `submissionId` (string, required): Submission UUID

**Request Body (JSON/Form/Multipart):**
```json
{
  "studentId": "uuid",                      // Optional: UUID
  "testId": 1,                              // Optional: Positive integer
  "status": "in_progress" | "completed",    // Optional
  "completedAt": "ISO datetime" | null      // Optional: Date or null
}
```

**Response 200:** Same as POST /results/test-submission response.

---

#### PATCH /results/test-submission/answer/{answerId}
**Summary:** Update Test Answer
**Description:** Updates a test submission answer. At least one field must be provided.

**Path Parameters:**
- `answerId` (string, required): Answer UUID

**Request Body (JSON/Form/Multipart):**
```json
{
  "testSubmissionId": "uuid",   // Optional: UUID
  "testQuestionId": "uuid",     // Optional: UUID
  "selectedOptionId": "uuid"    // Optional: UUID
}
```

**Response 200:** Same as POST /results/test-submission/answer response.

---

### 6. User Endpoints

#### GET /users
**Summary:** Get Users List
**Description:** Returns a paginated list of users.

**Query Parameters:**
- `page` (number, optional, min: 1): Page number
- `pageSize` (number, optional, min: 1, max: 100): Items per page
- `sortDirection` (string, optional): "asc" or "desc"

**Response 200:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "username": "user_123",
      "role": "admin",
      "createdAt": "ISO datetime",
      "updatedAt": "ISO datetime"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "totalItems": 50,
    "totalPages": 5
  }
}
```

---

#### POST /users
**Summary:** Create New User
**Description:** Creates a new user account.

**Request Body (JSON/Form/Multipart):**
```json
{
  "username": "user_123",                    // Required: 1-32 chars, alphanumeric + underscore
  "password": "P@ssw0rd",                    // Required: Min 6 chars, must contain uppercase, lowercase, number, and symbol
  "role": "program_studi" | "jurusan" | "fakultas" | "universitas" | "admin" // Required
}
```

**Response 201:**
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "username": "user_123",
    "role": "admin",
    "createdAt": "ISO datetime",
    "updatedAt": "ISO datetime"
  }
}
```

---

#### GET /users/{userId}
**Summary:** Get User by ID
**Description:** Returns detailed information about a specific user.

**Path Parameters:**
- `userId` (string, required): User UUID

**Response 200:** Same structure as POST /users response.

---

#### PATCH /users/{userId}
**Summary:** Update User
**Description:** Updates user information. At least one field must be provided.

**Path Parameters:**
- `userId` (string, required): User UUID

**Request Body (JSON/Form/Multipart):**
```json
{
  "username": "user_123",                    // Optional: 1-32 chars, alphanumeric + underscore
  "password": "P@ssw0rd",                    // Optional: Min 6 chars with complexity requirements
  "role": "program_studi" | "jurusan" | "fakultas" | "universitas" | "admin" // Optional
}
```

**Response 201:** Same as POST /users response.

---

## Data Models

### Student
- **id**: UUID (auto-generated)
- **npm**: String (10 numeric digits, unique)
- **name**: String (required)
- **email**: String (email format) or null
- **enrollmentYearId**: Integer (foreign key)
- **majorId**: Integer (foreign key)
- **facultyId**: Integer (foreign key)
- **degreeId**: Integer (foreign key)
- **createdAt**: ISO datetime
- **updatedAt**: ISO datetime

### Test
- **id**: Integer (auto-generated)
- **name**: String (required)
- **description**: String or null
- **active**: Boolean
- **parentId**: Integer (foreign key) or null
- **createdAt**: ISO datetime

### Test Instruction
- **id**: UUID (auto-generated)
- **text**: String (required)
- **order**: Integer (non-negative)
- **testId**: Integer (foreign key)

### Test Note
- **id**: UUID (auto-generated)
- **text**: String (required)
- **order**: Integer (non-negative)
- **testId**: Integer (foreign key)

### Test Question
- **id**: UUID (auto-generated)
- **text**: String (required)
- **type**: Enum ("multiple_choice", "single_choice", "likert")
- **order**: Integer (non-negative)
- **testId**: Integer (foreign key)

### Test Question Option
- **id**: UUID (auto-generated)
- **text**: String (required)
- **value**: String (required)
- **order**: Integer (non-negative)
- **testQuestionId**: UUID (foreign key)

### Test Submission
- **id**: UUID (auto-generated)
- **studentId**: UUID (foreign key)
- **testId**: Integer (foreign key)
- **status**: Enum ("in_progress", "completed")
- **createdAt**: ISO datetime
- **completedAt**: ISO datetime or null

### Test Submission Answer
- **id**: UUID (auto-generated)
- **testSubmissionId**: UUID (foreign key)
- **testQuestionId**: UUID (foreign key)
- **selectedOptionId**: UUID (foreign key)
- **createdAt**: ISO datetime

### Test Result
- **id**: UUID (auto-generated)
- **testSubmissionId**: UUID (foreign key) or null
- **testId**: Integer (foreign key) or null
- **result**: String (required)
- **createdAt**: ISO datetime

### User
- **id**: UUID (auto-generated)
- **username**: String (1-32 chars, alphanumeric + underscore, unique)
- **password**: String (hashed, min 6 chars with complexity requirements)
- **role**: Enum ("program_studi", "jurusan", "fakultas", "universitas", "admin")
- **createdAt**: ISO datetime
- **updatedAt**: ISO datetime

---

## Validation Rules

### NPM (Student ID)
- Must be exactly 10 numeric digits
- Pattern: `^[0-9]{10}$`
- Example: "2215061066"

### Username
- Length: 1-32 characters
- Pattern: `^[A-Za-z0-9_]+$`
- Only alphanumeric and underscore allowed
- Examples: "user_123", "johnDoe", "alice_01"

### Password
- Minimum length: 6 characters
- Pattern: `^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*_]).+$`
- Must contain at least:
  - One uppercase letter
  - One lowercase letter
  - One number
  - One special character from: `!@#$%^&*_`
- Examples: "P@ssw0rd", "Admin#123", "User!2024"

### Email
- Must be valid email format
- Can be null for optional fields

### UUID
- Must be valid UUID v7 format
- Example: "019a4353-2f21-7c4f-80f8-93eaa7afd6ca"

### Integer IDs
- Must be positive integers (> 0)
- Range: -2147483648 to 2147483647

### Pagination
- **page**: Minimum 1
- **pageSize**: Between 1 and 100

---

## Common Query Parameters

### Pagination
- `page`: Page number (min: 1)
- `pageSize`: Items per page (min: 1, max: 100)

### Sorting
- `sortDirection`: "asc" or "desc"

### Filtering (Students)
- `search`: Free text search (name or NPM)
- `enrollmentYearId`: Array of enrollment year IDs
- `majorId`: Array of major IDs
- `facultyId`: Array of faculty IDs
- `degreeId`: Array of degree IDs

### Filtering (Tests)
- `search`: Free text search (test name)
- `showSubTest`: Boolean flag to include sub-tests

---

## Error Messages (Indonesian)

Common validation error messages used by the API:

- **NPM**: "NPM harus terdiri dari 10 angka numeric"
- **Name**: "Nama mahasiswa harus berupa text dan tidak boleh kosong"
- **Email**: "Email harus berupa text dengan format email yang valid atau kosong"
- **Username**: "Nama pengguna harus terdiri dari 1 - 32 karakter dan hanya boleh mengandung huruf, angka, dan garis bawah"
- **Password**: "Kata sandi harus terdiri dari minimal 6 karakter dan harus setidaknya mengandung satu huruf besar, satu huruf kecil, satu angka, dan satu simbol"
- **Page**: "Halaman [resource] harus berupa angka dan tidak boleh negatif atau nol"
- **PageSize**: "Ukuran halaman [resource] harus berupa angka dan bernilai antara 1 - 100"
- **ID Fields**: "ID [resource] harus berupa [type] dan tidak boleh negatif atau nol"

---

## Content Types Supported

All endpoints that accept request bodies support:
- `application/json`
- `application/x-www-form-urlencoded`
- `multipart/form-data`

---

## Usage Examples

### Create a Student
```bash
curl -X POST http://localhost:3000/students \
  -H "Content-Type: application/json" \
  -d '{
    "npm": "2215061066",
    "name": "Budi Santoso",
    "email": "budi@example.com",
    "enrollmentYearId": 1,
    "majorId": 1,
    "facultyId": 1,
    "degreeId": 1
  }'
```

### Get Students with Filters
```bash
curl -X GET "http://localhost:3000/students?page=1&pageSize=10&search=Budi&enrollmentYearId[]=1&facultyId[]=2"
```

### Create a Test
```bash
curl -X POST http://localhost:3000/tests \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Personality Test",
    "description": "Test description",
    "active": true,
    "instructions": [
      {
        "text": "Read each question carefully",
        "order": 0
      }
    ],
    "notes": [
      {
        "text": "Important note",
        "order": 0
      }
    ],
    "questions": [
      {
        "text": "Question 1",
        "type": "single_choice",
        "order": 0,
        "options": [
          {
            "text": "Option A",
            "value": "A",
            "order": 0
          }
        ]
      }
    ]
  }'
```

### Submit Test Answer
```bash
curl -X POST http://localhost:3000/results/test-submission/answer \
  -H "Content-Type: application/json" \
  -d '{
    "testSubmissionId": "019a2689-d51c-70fc-8a84-d6423ee19c04",
    "testQuestionId": "019a2689-eaf9-7dce-936c-191f988d195c",
    "selectedOptionId": "019a2689-fd2f-7bf3-8733-8883b8f9f6c7"
  }'
```

---

## Best Practices for AI Integration

1. **Always validate input data** according to the validation rules before sending requests
2. **Use pagination** for list endpoints to avoid large responses
3. **Handle error responses** appropriately (422 for validation, 404 for not found, 500 for server errors)
4. **Check response status** field to determine success/failure
5. **Use UUIDs consistently** for student IDs, submission IDs, etc.
6. **Respect data types** - send integers as numbers, not strings (except for NPM which is a string)
7. **Include all required fields** in POST requests
8. **Use at least one field** in PATCH requests (partial updates)
9. **Follow the standard response format** when parsing responses
10. **Use appropriate content types** - JSON is recommended for programmatic access

---

## Notes for Developers

- The API uses Bun runtime
- All timestamps are in ISO 8601 format
- UUIDs use version 7
- Password hashing is handled server-side
- The API supports CORS (check server configuration)
- Database seeding is available for testing via `/system/seed-db`
- Health check endpoint available at `/system/health`

---

## Changelog

### Version 0.8.0
- Full CRUD operations for Students, Tests, Users, and Results
- Comprehensive filtering and pagination support
- Multi-level test structure with parent-child relationships
- Test submission and answer tracking
- Role-based user management

---

**Documentation Generated:** 2024
**API Version:** 0.8.0
**Last Updated:** Based on OpenAPI specification from http://localhost:3000/docs/json
