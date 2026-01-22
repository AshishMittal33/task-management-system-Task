# 📝 Task Management System (Full Stack)

A full-stack Task Management System built using **Node.js, Express, Prisma, and Next.js**.  
The application supports user authentication and complete task management with a clean and responsive UI.

This project was built as a **software engineering assessment** and runs fully on a local environment.

---
## Demo


---

## 🚀 Features

### 🔐 Authentication
- User registration
- User login
- Password hashing with bcrypt
- JWT-based authentication
- Protected routes (Dashboard accessible only after login)
- Logout functionality

### ✅ Task Management
- Create tasks
- View tasks
- Mark tasks as completed / pending
- Delete tasks
- Search tasks by title
- Filter tasks (All / Completed / Pending)
- Tasks are user-specific

### 🎨 Frontend UI
- Clean and modern UI
- Fully responsive (mobile & desktop)
- Built using Tailwind CSS
- Login, Register, Dashboard pages
- Client-side route protection

---

## 🛠 Tech Stack

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- SQLite (local database)
- JWT Authentication

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- React Hooks

---


## ⚙️ Backend Setup (Local)



- cd backend

- npm install

- npx prisma migrate dev

- npm run dev

### Backend runs on:

http://localhost:4000

## ⚙️ Frontend Setup (Local)

- cd frontend

- npm install

- npm run dev

### Frontend runs on:

http://localhost:3000

## 🔁 Application Flow

1. User opens the app

2. User registers a new account

3. User logs in

4. Dashboard opens

5. User can:

  - Add tasks

  - Mark tasks as done

 - Delete tasks

- Search and filter tasks

6. User can logout anytime
   
## 🔐 Route Protection

- /login and /register are inaccessible when logged in

- dashboard is protected and redirects to login if unauthenticated

- Authentication state is managed using JWT stored in localStorage

## 📌 Notes

1. SQLite is used for simplicity and local development

2. No external services are required to run the project

3. Designed with clean code separation between frontend and backend

4. Focused on functionality, UX, and real-world project structure

## ✅ Status

✔ Backend complete

✔ Frontend complete

✔ Authentication working

✔ Task CRUD working

✔ Search & Filter working

✔ Responsive UI

## 👤 Author

Ashish Mittal

Full Stack / Software Engineering Project
