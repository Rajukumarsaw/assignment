# LMS Backend

A basic Learning Management System (LMS) backend built with Node.js, Express, and MongoDB.

## Features
- User authentication (JWT-based)
- Admin and user roles
- Course creation, listing, and details
- Lessons and quizzes per course
- User enrollment and progress tracking
- Quiz attempts and score tracking
- Pagination, rate limiting, and input validation

## Project Setup

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB (local or Atlas)

### Installation
1. Clone the repository or copy the backend folder.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the `backend` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/lms
   JWT_SECRET=supersecretkey
   PORT=5000
   ```
4. Start the server:
   ```sh
   npm run dev   # for development (nodemon)
   npm start     # for production
   ```

## API Endpoints

### Auth
#### Signup
- `POST /api/auth/signup`
- **Input:**
  ```json
  { "username": "john", "email": "john@example.com", "password": "secret123" }
  ```
- **Output:**
  ```json
  { "token": "<jwt_token>" }
  ```

#### Login
- `POST /api/auth/login`
- **Input:**
  ```json
  { "email": "john@example.com", "password": "secret123" }
  ```
- **Output:**
  ```json
  { "token": "<jwt_token>" }
  ```

### Courses
#### Create Course (Admin only)
- `POST /api/courses`
- **Headers:** `Authorization: Bearer <jwt_token>` (admin)
- **Input:**
  ```json
  { "title": "Node.js Basics", "description": "Learn Node.js", "instructor": "Jane Doe", "price": 49.99 }
  ```
- **Output:**
  ```json
  { "_id": "...", "title": "Node.js Basics", ... }
  ```

#### List Courses (with pagination)
- `GET /api/courses?page=1&limit=10`
- **Output:**
  ```json
  { "total": 1, "page": 1, "limit": 10, "courses": [ { "_id": "...", "title": "Node.js Basics", ... } ] }
  ```

#### Get Course Details
- `GET /api/courses/:id`
- **Output:**
  ```json
  { "_id": "...", "title": "Node.js Basics", "lessons": [...], "quizzes": [...] }
  ```

### Enrollment & Progress
#### Enroll in a Course
- `POST /api/enroll/:courseId`
- **Headers:** `Authorization: Bearer <jwt_token>`
- **Output:**
  ```json
  { "message": "Enrolled successfully" }
  ```

#### Mark Lesson as Completed
- `POST /api/progress/:enrollmentId/lesson/:lessonId`
- **Headers:** `Authorization: Bearer <jwt_token>`
- **Output:**
  ```json
  { "message": "Lesson marked as completed" }
  ```

#### Attempt Quiz
- `POST /api/progress/:enrollmentId/quiz/:quizId`
- **Headers:** `Authorization: Bearer <jwt_token>`
- **Input:**
  ```json
  { "score": 80 }
  ```
- **Output:**
  ```json
  { "message": "Quiz attempt recorded" }
  ```

#### Get User Progress for a Course
- `GET /api/progress/:enrollmentId`
- **Headers:** `Authorization: Bearer <jwt_token>`
- **Output:**
  ```json
  { "enrollment": { ... }, "percentCompleted": 50 }
  ```

## Notes
- All protected endpoints require a valid JWT in the `Authorization` header.
- Admin endpoints require the user to have the `admin` role.
- Pagination is available for course listing via `page` and `limit` query params.
- Rate limiting and input validation are enabled for security.

---

Feel free to extend with lesson/quiz CRUD, user management, or more advanced features as needed.
