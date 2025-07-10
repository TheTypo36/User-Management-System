# 👥 User Management System with Role-Based Access Control & Audit Logging

This is a full-stack PERN (PostgreSQL, Express.js, React, Node.js) application designed to manage users with different roles — `Admin`, `Sub-Admin`, and `User`. It includes secure authentication, role-based access control, audit logging of actions, and a clean, responsive UI using Tailwind CSS.

---

## ✨ Features

- 🔐 **Authentication**
  - User Registration & Login with JWT
  - Auto-login from localStorage
  - Protected Routes

- 👤 **Role-Based Access**
  - `Admin`: Full access (CRUD users, view logs)
  - `Sub-Admin`: Limited access (e.g., view only)
  - `User`: Can access personal profile only

- 📝 **Audit Logging**
  - Logs every critical action (Create, Update, Delete)
  - Includes `IP address`, `role`, `username`, `action`, `timestamp`

- 🧾 **User Management**
  - Create, update, and delete users (soft delete)
  - View all users (for Admin/Sub-Admin)

- 📄 **Responsive UI**
  - Built with Tailwind CSS
  - Mobile-friendly and intuitive

---

## 🏗️ Tech Stack

| Tech | Role |
|------|------|
| **React.js** | Frontend |
| **Tailwind CSS** | Styling |
| **Node.js + Express** | Backend |
| **PostgreSQL** | Database |
| **Prisma ORM** | Database client |
| **JWT** | Authentication |
| **Axios** | API communication |

---

## 🔧 Project Structure

```
├── client/                     # React Frontend
│   ├── pages/                 # Pages like SignIn, SignUp, Dashboard, Profile, AuditLog
│   ├── components/            # Reusable components like Input, AuditCard
│   ├── contexts/              # AuthContext for global auth state
│   └── config.ts              # API endpoints
├── server/                     # Node.js Backend
│   ├── controllers/           # Business logic
│   ├── routes/                # Express routes
│   ├── middlewares/           # Auth & audit middlewares
│   ├── prisma/                # Prisma schema and client
│   ├── utils/                 # IP extraction, logger helpers
│   └── index.ts               # Entry point
```

---

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js v18+
- PostgreSQL installed and running
- Yarn or npm

---

### 📦 Install Dependencies

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd client
npm install
```

---

### ⚙️ Environment Variables

#### In `server/.env`
```
DATABASE_URL=postgresql://user:password@localhost:5432/your-db
JWT_SECRET=your_jwt_secret
```

#### In `client/.env`
```
VITE_API_BASE_URL=http://localhost:5000/api
```

---

### 🧬 Database Setup
```bash
cd server
npx prisma migrate dev --name init
npx prisma generate
```

---

### 🏁 Run the App

#### Start Backend
```bash
cd server
npm run dev
```

#### Start Frontend
```bash
cd client
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

---

## 🔐 User Roles

| Role | Access |
|------|--------|
| `Admin` | Can create/update/delete all users, view audit logs |
| `Sub-Admin` | Can view user list and audit logs |
| `User` | Can view and update their profile only |

---

## 🗂️ API Routes (Backend)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login user |
| `GET` | `/api/user` | Get all users |
| `GET` | `/api/user/:id` | Get user by ID |
| `PUT` | `/api/user/:id` | Update user |
| `DELETE` | `/api/user/:id` | Soft delete user |
| `GET` | `/api/audit` | Get all audit logs |

---

## ✍️ Contribution

Contributions are welcome!

1. Fork the repo
2. Create your branch: `git checkout -b feature/feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature/feature-name`
5. Open a pull request

---

## 📜 License

MIT © 2025 [Your Name]