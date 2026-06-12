# PrimeTrade.ai Backend Intern Assignment - Task Workspace

This repository contains my submission for the PrimeTrade.ai Backend Intern assignment. It is a full-stack task management workspace featuring JWT authentication, role-based access control (RBAC), and a responsive React frontend styled with TailwindCSS.

Standard users can only manage their own tasks, while Administrators have full visibility over all tasks in the system.

---

## 📁 Project Structure

```text
primetrade-assignment/
├── backend/               # Express API (v1)
│   ├── src/
│   │   ├── api/v1/
│   │   │   ├── controllers/   # Route handlers & business logic
│   │   │   ├── middlewares/   # JWT auth & role validation guards
│   │   │   ├── models/        # Mongoose/MongoDB schemas
│   │   │   └── routes/        # Router endpoints
│   │   └── config/            # DB connection setup
└── frontend/              # React (Vite) client
    ├── src/
    │   ├── api/               # Axios instance & request interceptors
    │   └── components/        # UI components (Auth, TaskForm, TaskCard)
<<<

---

## 🚀 How to Run the Project Locally

Make sure you have Node.js and MongoDB installed on your system before starting.

### 1. Spinning up the Backend
1. Open a terminal and move into the backend folder:
   ```bash
   cd backend
   <<<
2. Install the node modules:
   ```bash
   npm install
   <<<
3. Create a `.env` file in the root of the `backend/` folder and add your configuration values:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://127.0.0.1:27017/primetrade_db
   JWT_SECRET=any_random_secure_string_here
   <<<
4. Run the backend server in development mode:
   ```bash
   npm run dev
   <<<
   *Note: You should see "MongoDB Connected" in your terminal log.*

### 2. Spinning up the Frontend
1. Open a separate terminal window and change into the frontend directory:
   ```bash
   cd frontend
   <<<
2. Install the frontend dependencies:
   ```bash
   npm install
   <<<
3. Boot up the Vite local server:
   ```bash
   npm run dev
   <<<
4. Click the link shown in the terminal (usually `http://localhost:5173`) to open the app in your browser.

---

## 📡 Core API Routes

All endpoints are versioned under `/api/v1` and return structured JSON.

### Auth Route Group
* `POST /api/v1/auth/register` - Registers a new user. Passwords are encrypted before saving using bcrypt.
* `POST /api/v1/auth/login` - Verifies user credentials and returns a signed JWT token valid for 30 days.

### Task Route Group (Requires Bearer Token in Auth Header)
* `POST /api/v1/tasks` - Creates a new task tied to the logged-in user.
* `GET /api/v1/tasks` - **RBAC Guarded.** Normal accounts see only their personal tasks. Accounts with the "admin" role automatically see every user's tasks in the dashboard.
* `PUT /api/v1/tasks/:id` - Updates task text or cycles through statuses (`pending` -> `in-progress` -> `completed`). Users can only edit their own tasks, while admins can modify anything.
* `DELETE /api/v1/tasks/:id` - Deletes a specific task. Enforces same ownership/admin constraints as the update route.

---

## 📈 Scalability Note for Production

If this application were to be deployed to handle large-scale, production-level traffic matching Web3 trading requirements, I would optimize the architecture using the following strategies:

### 1. Database Optimizations (MongoDB)
* **Read-Write Splitting:** Since fetching tasks is a frequent operation, I would set up a primary-secondary replication cluster. All write operations would go to the primary node, while reads would be balanced across secondary nodes to eliminate database locks.
* **Indexes:** I would add compound indexes on `{ user: 1, createdAt: -1 }` to ensure task list queries stay fast even as millions of records are added.

### 2. Microservices Extraction
* The project structure is already decoupled into isolated business domains. If needed, the `Auth` and `Task` modules could easily be split out into separate microservices. They could connect through an API Gateway and pass data asynchronously using a message broker like RabbitMQ.

### 3. In-Memory Caching (Redis)
* To speed up administrative workflows that pull universal task lists, I would drop a Redis caching layer in front of the MongoDB database layer. Fetch requests would check memory first, dropping latency to sub-10ms and reducing unnecessary database hits.

### 4. Containers & Load Balancing
* I would dockerize both modules to remove local environment discrepancies. Running multiple instances of the backend container behind an Nginx or AWS Application Load Balancer (ALB) would allow us to distribute traffic evenly and ensure high availability.