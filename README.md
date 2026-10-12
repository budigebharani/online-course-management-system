# Online Course Management System (OCMS)

> A production-ready, full-stack Online Course Management System built from scratch with **React 18**, **Vite**, **Bootstrap 5**, **Node.js**, **Express.js**, and **MongoDB Atlas**.

---

## 📖 Table of Contents

1. [Project Overview & Key Features](#-project-overview--key-features)
2. [Technology Stack](#-technology-stack)
3. [Project Folder Structure](#-project-folder-structure)
4. [Step-by-Step MongoDB Atlas Setup Guide](#-step-by-step-mongodb-atlas-setup-guide)
5. [Environment Variables Setup](#-environment-variables-setup)
6. [Step-by-Step Running Instructions (Windows & VS Code)](#-step-by-step-running-instructions-windows--vs-code)
7. [Database Seeding & First Administrator Account](#-database-seeding--first-administrator-account)
8. [End-to-End Feature Testing Walkthrough](#-end-to-end-feature-testing-walkthrough)
9. [Verifying Data in MongoDB Atlas](#-verifying-data-in-mongodb-atlas)
10. [Troubleshooting & FAQ](#-troubleshooting--faq)

---

## 🚀 Project Overview & Key Features

The **Online Course Management System (OCMS)** is an end-to-end web platform designed for students and educational administrators. It provides complete course discovery, syllabus exploration, simulated payments, progress tracking, and administrative governance.

### 🌟 Frontend Capabilities
- **Landing Page**: Modern hero section with call-to-actions, value propositions, and live featured courses.
- **Course Discovery & Filtering**: Real-time search by keyword/instructor, filter by category, interactive price range slider, and multi-option sorting (Newest, Price, Rating, Popularity).
- **Curriculum & Syllabus**: Interactive weekly course syllabus breakdowns with individual lecture durations.
- **Simulated Payment Sandbox**: Dedicated checkout flow with pre-filled test cards, transparent order breakdown, and downloadable simulated transaction receipts. *(Clearly disclaimed: test mode only, no real charges)*.
- **Student Dashboard**: Real-time learning statistics, in-progress courses, visual progress bars, and an interactive **Study Room** where students check off completed lessons to update progress live.
- **User Profile Management**: Manage personal details (bio, phone), update passwords, and review historical simulated transaction receipts.
- **Admin Control Center**: System metrics (total learners, active courses, total enrollments, gross simulated revenue), course CRUD (Add, Edit, Delete with modal validation), student directory with enrollment counts, and enrollment status manager.
- **Authentication**: JWT authentication with persistent session state and role-based route guards (`ProtectedRoute`, `AdminRoute`).

### ⚙️ Backend Capabilities
- **RESTful API**: Clean controller-service architecture powered by Express.js.
- **Mongoose Data Models**: Strict schema validation with relational references between `User`, `Course`, `Enrollment`, and `Payment`.
- **Security**: Passwords hashed with `bcryptjs` (salt rounds: 10), passwords excluded from JSON responses, JWT verification middleware.
- **Duplicate Protection**: Unique compound database index on `{ student, course }` prevents accidental double-enrollment.
- **Health Check & Diagnostics**: Live system diagnostics endpoint (`/api/health`) that reports database connectivity status.

---

## 🛠 Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router DOM v6, Axios, Bootstrap 5, Bootstrap Icons |
| **Backend** | Node.js (v18+ or v20+), Express.js 4, CORS, Dotenv |
| **Database** | MongoDB Atlas (Cloud) / Local MongoDB via Mongoose 8 |
| **Authentication** | JSON Web Tokens (jsonwebtoken) & bcrypt password hashing (bcryptjs) |
| **Tooling** | npm, VS Code |

---

## 📁 Project Folder Structure

```
online cource management system/
│
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB Atlas connection & health check logic
│   ├── controllers/
│   │   ├── adminController.js       # Admin stats, student lists, status updater
│   │   ├── authController.js        # User registration, login, session profile
│   │   ├── courseController.js      # Course CRUD & catalog filtering
│   │   ├── enrollmentController.js  # Course enrollment & progress update
│   │   ├── paymentController.js     # Simulated sandbox payment processing
│   │   └── userController.js        # Profile settings & password change
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verify & admin authorization guard
│   │   └── errorMiddleware.js       # Custom 404 and centralized error handler
│   ├── models/
│   │   ├── Course.js                # Course schema with syllabus subdocument
│   │   ├── Enrollment.js            # Enrollment schema with progress & unique index
│   │   ├── Payment.js               # Simulated payment receipt schema
│   │   └── User.js                  # User schema with bcrypt password hashing
│   ├── routes/
│   │   ├── adminRoutes.js           # Admin routes (/api/admin/*)
│   │   ├── authRoutes.js            # Auth routes (/api/auth/*)
│   │   ├── courseRoutes.js          # Course routes (/api/courses/*)
│   │   ├── enrollmentRoutes.js      # Enrollment routes (/api/enrollments/*)
│   │   ├── paymentRoutes.js         # Payment routes (/api/payments/*)
│   │   └── userRoutes.js            # User profile routes (/api/users/*)
│   ├── .env                         # Local environment configuration (DO NOT COMMIT)
│   ├── .env.example                 # Environment configuration template
│   ├── .gitignore                   # Ignores node_modules and .env
│   ├── package.json                 # Backend dependencies and scripts
│   ├── seed.js                      # Database seeder (Admin, Student, 8 Courses)
│   └── server.js                    # Express application entry point
│
├── frontend/
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosClient.js       # Axios instance with JWT interceptor
│   │   ├── components/
│   │   │   ├── AdminRoute.jsx       # Route guard for administrators
│   │   │   ├── AlertMessage.jsx     # Reusable alert notifications
│   │   │   ├── CourseCard.jsx       # Course card with thumbnail, badges, rating
│   │   │   ├── Footer.jsx           # Global footer with disclaimer & links
│   │   │   ├── LoadingSpinner.jsx   # Consistent loading state indicator
│   │   │   ├── Navbar.jsx           # Responsive navbar with user profile dropdown
│   │   │   ├── ProtectedRoute.jsx   # Route guard for logged-in users
│   │   │   └── StatsCard.jsx        # Metric KPI cards for dashboards
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global React Auth context provider
│   │   ├── pages/
│   │   │   ├── AdminCoursesPage.jsx # Add, edit, delete courses
│   │   │   ├── AdminDashboardPage.jsx# Admin analytics & recent activity
│   │   │   ├── AdminEnrollmentsPage.jsx# All enrollments with status changer
│   │   │   ├── AdminStudentsPage.jsx# Registered students directory
│   │   │   ├── CourseDetailsPage.jsx# Course overview & weekly syllabus
│   │   │   ├── CoursesPage.jsx      # Filterable & searchable course catalog
│   │   │   ├── HomePage.jsx         # Landing page with hero & featured courses
│   │   │   ├── LoginPage.jsx        # Sign in with quick demo buttons
│   │   │   ├── MyCoursesPage.jsx    # Student courses & interactive study room
│   │   │   ├── NotFoundPage.jsx     # Custom 404 page
│   │   │   ├── PaymentPage.jsx      # Simulated payment sandbox form
│   │   │   ├── PaymentSuccessPage.jsx# Simulated receipt & completion screen
│   │   │   ├── ProfilePage.jsx      # Edit profile, password, view receipts
│   │   │   ├── RegisterPage.jsx     # Registration with student/admin role
│   │   │   └── StudentDashboardPage.jsx# Student metrics & active courses
│   │   ├── App.jsx                  # Main React router configuration
│   │   ├── index.css                # Custom CSS styling enhancements
│   │   └── main.jsx                 # React root DOM bootstrap
│   ├── .env                         # Frontend environment variables
│   ├── .env.example                 # Frontend env template
│   ├── .gitignore                   # Ignores node_modules and dist
│   ├── index.html                   # HTML template
│   ├── package.json                 # Frontend dependencies and scripts
│   └── vite.config.js               # Vite config with /api proxy to port 5000
│
└── README.md                        # Complete documentation & setup instructions
```

---

## ☁️ Step-by-Step MongoDB Atlas Setup Guide

Follow these simple steps to set up your free MongoDB Atlas cloud database:

### Step 1: Create a MongoDB Cloud Account
1. Visit [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register).
2. Sign up with your email or Google account (it is 100% free).

### Step 2: Create a Free Shared Cluster
1. On the Atlas dashboard, select **Create a Deployment**.
2. Choose the **M0 FREE** shared tier.
3. Select any cloud provider (e.g., AWS) and region close to you.
4. Name your cluster (e.g., `Cluster0`) and click **Create Deployment**.

### Step 3: Create a Database User
1. In the **Security Quickstart** screen (or via the left sidebar under **Security** -> **Database Access**):
   - Click **Add New Database User**.
   - Authentication Method: **Password**.
   - Enter a **Username** (e.g., `ocmsAdmin`).
   - Enter or generate a **Password** (e.g., `MyPassword123!`). *Write this down or save it.*
   - Database User Privileges: Select **Read and write to any database** (Atlas Admin or Built-in role).
   - Click **Add User**.

> ⚠️ **Important URL Encoding Tip:** If your password contains special characters like `@`, `#`, or `%`, URL-encode them (e.g. `@` becomes `%40`, `#` becomes `%23`), or stick to alphanumeric characters like letters and numbers to avoid connection string errors.

### Step 4: Configure Network IP Whitelist
1. In the left navigation menu, click **Network Access** under Security.
2. Click **Add IP Address**.
3. Select **Allow Access From Anywhere** (`0.0.0.0/0`) for development.
4. Click **Confirm**. This ensures your local development computer can connect to the Atlas cluster.

### Step 5: Copy Your Connection String
1. In the left navigation menu, click **Database** (under Deployment).
2. Click the **Connect** button next to your cluster.
3. Choose **Drivers** (Node.js).
4. Copy the connection string format displayed. It will look like:
   ```
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
5. Add the database name `ocms_db` before the query parameter `?`:
   ```
   mongodb+srv://ocmsAdmin:MyPassword123!@cluster0.abcde.mongodb.net/ocms_db?retryWrites=true&w=majority
   ```

---

## 🔐 Environment Variables Setup

### Backend Environment Configuration
Navigate to `backend/` and inspect `.env`:
```ini
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/ocms_db?retryWrites=true&w=majority
JWT_SECRET=ocms_development_secret_key_change_in_production_2026
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```
Replace `<username>` and `<password>` with your real credentials created in MongoDB Atlas.

> 🔒 **Security Notice:** Never push your `.env` file to GitHub or share your database password. The `.gitignore` files are already configured to ignore `.env`.

### Frontend Environment Configuration
Inspect `frontend/.env`:
```ini
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 💻 Step-by-Step Running Instructions (Windows & VS Code)

Follow these exact steps to launch both servers in Visual Studio Code.

### 1. Open Project in VS Code
1. Launch **Visual Studio Code**.
2. Click **File** -> **Open Folder...**
3. Select the folder: `c:\Users\Admin\Downloads\online cource management system`.

> 💡 **Windows PowerShell Tip:** If your terminal shows:  
> `File npm.ps1 cannot be loaded because running scripts is disabled on this system`  
> Simply run commands using `npm.cmd` instead of `npm`, OR run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` once in your PowerShell terminal.

---

### 2. Start the Backend Server (Terminal 1)

1. Open a new terminal in VS Code (`Ctrl + ` `~` or **Terminal** -> **New Terminal**).
2. Run the following commands:

```powershell
# Move into the backend folder
cd backend

# Install dependencies (already installed, but run if needed)
npm.cmd install

# (Optional) Seed the database with sample admin, student, and courses:
# Ensure you updated backend/.env with your MongoDB Atlas connection string first!
npm.cmd run seed

# Start the Express backend server:
npm.cmd run dev
```

You should see:
```
========================================================
🚀 OCMS Backend Server running on http://localhost:5000
📡 Health Check: http://localhost:5000/api/health
🌐 Client Allowed: http://localhost:5173
========================================================
```

---

### 3. Start the Frontend Development Server (Terminal 2)

1. Open a **second terminal** in VS Code (click the `+` icon in the terminal panel).
2. Run the following commands:

```powershell
# Move into the frontend folder
cd frontend

# Install dependencies (already installed, but run if needed)
npm.cmd install

# Start Vite development server
npm.cmd run dev
```

You should see:
```
  VITE v6.4.4  ready in 488 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

### 4. Open Website in Your Browser
Open your browser and navigate to:  
👉 **`http://localhost:5173`**

---

## 🔑 Database Seeding & First Administrator Account

To populate initial data into MongoDB Atlas, open a terminal in `backend/` and execute:

```powershell
node seed.js
```

### Pre-Configured Demo Accounts Created by `seed.js`:

| Role | Email Address | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@ocms.com` | `Admin@12345` | Full CRUD access to courses, student directory, enrollment status manager |
| **Student** | `student@ocms.com` | `Student@12345` | Browse catalog, checkout simulation, student dashboard, study room |

### How to Create Additional Administrators Securely:
1. Navigate to the registration page: `http://localhost:5173/register`.
2. Enter your Full Name, Email, and Password (min 6 characters).
3. Under **Register As**, select **Platform Administrator**.
4. Submit the form. You are automatically signed in with admin privileges!

---

## 🧪 End-to-End Feature Testing Walkthrough

Follow these 6 test steps to verify that every component is working:

### Test 1: User Registration & Login
1. Open `http://localhost:5173/login`.
2. Notice the **Quick Demo Accounts** buttons:
   - Click **Student Demo** -> Autofills `student@ocms.com` / `Student@12345`.
   - Click **Sign In** -> You are directed to `/dashboard`.
3. Test custom registration:
   - Click **Register here** -> Enter a new email -> Register as Student -> Directed to student dashboard.

### Test 2: Browse, Search & Filter Courses
1. Click **Explore Courses** in the navigation bar (`/courses`).
2. Type `React` in the search box -> Press **Search** -> Only React courses appear.
3. Select **Category** -> `Data Science` -> Updates list instantly.
4. Move the **Max Price** range slider -> Adjusts courses matching your budget.
5. Click **Clear All** -> Resets all filter criteria.

### Test 3: Course Curriculum & Syllabus
1. Click on **Full-Stack Web Development Bootcamp** or any course.
2. In the Course Details view, examine the instructor, duration, level, and rating.
3. Scroll down to **Curriculum & Syllabus** -> Click on Week 1, Week 2, Week 3 accordions to preview topics and lecture durations.

### Test 4: Simulated Payment & Enrollment
1. On the course details page, click **Enroll & Simulate Checkout**.
2. Notice the **Sandbox Mode Active** alert banner.
3. Verify that the order summary shows the course title, instructor, and price.
4. The test credit card form is pre-filled (`4242 4242 4242 4242`, `12/28`, `789`).
5. Click **Confirm Simulated Enrollment**.
6. The system creates the Payment and Enrollment records and redirects you to the **Simulated Receipt Page** (`/payment/success/:id`) showing your transaction ID (`TXN-OCMS-...`).

### Test 5: Student Dashboard & Interactive Study Room
1. Click **Start Learning Now** or navigate to **My Courses** (`/my-courses`).
2. See your enrolled course with its initial progress bar.
3. Click **Open Study Room**:
   - Check off lessons from the syllabus checklist.
   - The progress percentage automatically recalculates and updates in MongoDB!
4. Navigate to **Profile & Settings** (`/profile`) -> Click the **Simulated Receipts** tab to review all simulated transaction receipts.

### Test 6: Administrator Console
1. Log out and log back in as Administrator (`admin@ocms.com` / `Admin@12345`).
2. Click **Admin Console** in the top navigation bar (`/admin/dashboard`):
   - View KPI counters: Total Students, Total Courses, Total Enrollments, Simulated Revenue.
3. Click **Manage Courses** (`/admin/courses`):
   - Click **Add New Course** -> Enter title, category, instructor, price ($59.99), description -> Submit.
   - Click the pencil icon to **Edit** any course details.
   - Click the trash icon to **Delete** a course.
4. Click **Students** (`/admin/students`):
   - View all registered students, emails, join dates, and total courses enrolled.
5. Click **Enrollments** (`/admin/enrollments`):
   - Filter by status (`enrolled`, `completed`, `pending`).
   - Use the **Change Status** dropdown to promote or update any student's enrollment state.

---

## 📊 Verifying Data in MongoDB Atlas

Once your server is connected to MongoDB Atlas and you perform actions in the app, you can verify your data directly in the MongoDB Atlas Web Console:

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. Under **Deployment**, click **Database**.
3. Next to your cluster, click the **Browse Collections** button.
4. Expand the **`ocms_db`** database. You will see four collections:
   - **`users`**: Contains registered user documents with securely hashed passwords (`$2a$10$...`) and roles.
   - **`courses`**: Contains course documents with weekly syllabi, instructors, and prices.
   - **`enrollments`**: Contains enrollment records linking `student` (ObjectId) and `course` (ObjectId) with completion progress.
   - **`payments`**: Contains simulated checkout transactions with unique `transactionId` records, card digits, and amounts.

---

## ❓ Troubleshooting & FAQ

### 1. `npm : File ... npm.ps1 cannot be loaded because running scripts is disabled on this system`
- **Cause:** Windows PowerShell ExecutionPolicy restriction.
- **Solution:** Use `npm.cmd` instead of `npm`:
  ```powershell
  npm.cmd run dev
  ```
  Or run this command once in PowerShell:
  ```powershell
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
  ```

### 2. `MongooseServerSelectionError: connect ECONNREFUSED` or IP Whitelist Error
- **Cause:** Your current IP address is not whitelisted in MongoDB Atlas.
- **Solution:** 
  1. Open MongoDB Atlas -> **Network Access**.
  2. Click **Add IP Address** -> Select **Allow Access From Anywhere** (`0.0.0.0/0`).
  3. Wait 1 minute for Atlas to apply changes, then restart your backend server.

### 3. Error: `EADDRINUSE: address already in use :::5000`
- **Cause:** Another process is already using port 5000.
- **Solution:**
  In PowerShell, run:
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
  ```
  Then restart with `npm.cmd run dev`.

### 4. Frontend shows "Database not connected yet" when logging in
- **Cause:** `backend/.env` still has placeholder credentials `<username>` and `<password>`.
- **Solution:** Edit `backend/.env` and replace the placeholder with your actual MongoDB Atlas connection string, then run `npm.cmd run dev`.

---

## 📜 License & Academic Disclaimer

This project was built for educational and demonstration purposes. All payment workflows are simulated sandbox operations. No real financial credentials or transactions are executed.
