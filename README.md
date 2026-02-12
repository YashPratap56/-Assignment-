# Prime Trade - Scalable REST API with Authentication

A full-stack application featuring a scalable REST API with JWT authentication, role-based access control, and a React frontend for task management.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React + Vite)               │
│                    http://localhost:5173                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Express.js)                     │
│                    http://localhost:5000                    │
│                   /api/v1 endpoints                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   MongoDB Atlas (Cloud)                     │
│                   prime_trade database                      │
└─────────────────────────────────────────────────────────────┘
```

## ✨ Features

### Backend (Express.js + MongoDB)
- ✅ User Registration & Login with JWT
- ✅ Password Hashing (bcrypt)
- ✅ Role-Based Access Control (User/Admin)
- ✅ Task CRUD Operations
- ✅ Pagination, Filtering & Sorting
- ✅ Swagger API Documentation
- ✅ Rate Limiting & Security Headers

### Frontend (React + Vite)
- ✅ Modern React UI
- ✅ Login/Register Authentication
- ✅ Protected Dashboard
- ✅ Task Management (Create, Read, Update, Delete)
- ✅ Real-time Error/Success Messages
- ✅ Responsive Design

## 📁 Project Structure

```
prime-trade-assignment/
├── backend/                    # Express.js REST API
│   ├── prisma/
│   │   ├── schema.prisma      # MongoDB schema
│   │   └── seed.js            # Database seeding
│   ├── src/
│   │   ├── config/           # DB & Swagger config
│   │   ├── controllers/      # Auth & Task controllers
│   │   ├── middleware/       # Auth & Error handling
│   │   └── routes/          # API routes
│   ├── .env.example          # Environment template
│   ├── package.json
│   └── README.md            # Backend documentation
│
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── context/         # Auth context
│   │   ├── pages/          # Login, Register, Dashboard
│   │   └── services/       # API client
│   ├── vercel.json         # Vercel config
│   ├── vite.config.js
│   ├── package.json
│   └── README.md           # Frontend documentation
│
└── README.md                # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the Repository
```bash
git clone https://github.com/YashPratap56/-Assignment-.git
cd -Assignment-
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB Atlas connection string

npm run prisma:generate
npm run prisma:push
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Access the Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **API Docs:** http://localhost:5000/api-docs

## 🔐 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login user |
| GET | `/api/v1/auth/profile` | Get user profile |
| POST | `/api/v1/auth/logout` | Logout user |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/tasks` | List all tasks |
| GET | `/api/v1/tasks/:id` | Get single task |
| POST | `/api/v1/tasks` | Create task |
| PUT | `/api/v1/tasks/:id` | Update task |
| DELETE | `/api/v1/tasks/:id` | Delete task |
| GET | `/api/v1/tasks/stats` | Task statistics (Admin) |

## 🌐 Deployment

### Deploy Frontend to Vercel
1. Go to [Vercel](https://vercel.com)
2. Import GitHub repository
3. Set Root Directory: `frontend`
4. Add Environment Variable: `VITE_API_URL` = your backend URL
5. Deploy

### Deploy Backend
For the backend, use:
- **Railway.app** - Easiest for Node.js + MongoDB
- **Render.com** - Good free tier
- **Heroku** - Classic choice

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/prime_trade
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

### Frontend
```env
VITE_API_URL=http://localhost:5000/api/v1
```

## 📊 Scalability Considerations

### Current Implementation
- Monolithic Express.js application
- Single MongoDB database
- Synchronous request handling

### Future Improvements
1. **Horizontal Scaling**
   - Deploy multiple instances behind load balancer
   - Use Redis for session storage

2. **Database Scaling**
   - MongoDB Atlas with auto-scaling shards
   - Read replicas for heavy read operations

3. **Caching**
   - Redis for caching frequently accessed data
   - JWT blacklist caching

4. **Microservices**
   - Split auth service from task service
   - Event-driven communication

5. **Monitoring**
   - ELK stack for logging
   - Prometheus for metrics

## 📄 License

MIT License

## 👤 Author

Yash Pratap - [GitHub](https://github.com/YashPratap56)
