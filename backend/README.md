# Prime Trade API

A scalable REST API with Authentication & Role-Based Access Control, built with Node.js, Express, and MongoDB.

## Features

### Authentication & Authorization
- **User Registration & Login** with secure password hashing (bcrypt)
- **JWT-based authentication** with access and refresh tokens
- **Role-Based Access Control (RBAC)** with User and Admin roles
- **Protected routes** with token verification

### Task Management (CRUD)
- Create, read, update, and delete tasks
- Filter and pagination support
- Status and priority management
- User-specific task isolation

### API Features
- **RESTful API design** with proper HTTP methods and status codes
- **Input validation** using express-validator
- **API versioning** (/api/v1)
- **Error handling** with structured responses
- **Rate limiting** for security
- **Helmet** for security headers
- **CORS** enabled

### Documentation
- **Swagger/OpenAPI** documentation at `/api-docs`
- Interactive API exploration

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Prisma ORM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **API Docs**: swagger-jsdoc + swagger-ui-express
- **Security**: helmet, cors, rate-limit

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.js            # Database seeding (optional)
├── src/
│   ├── config/
│   │   ├── db.js         # Prisma client
│   │   └── swagger.js    # Swagger configuration
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── auth.js       # JWT authentication
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   └── server.js         # Express app entry
├── .env.example           # Environment variables template
├── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB 6+ (local or Atlas)

### Installation

1. **Clone and install dependencies**
```bash
cd backend
npm install
```

2. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your MongoDB connection string
```

3. **Setup database**
```bash
# Generate Prisma client
npm run prisma:generate

# Push schema to MongoDB
npm run prisma:push

# Optional: seed demo data (edit prisma/seed.js first)
npm run seed
```

4. **Start the server**
```bash
npm run dev   # Development mode
npm start     # Production mode
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `DATABASE_URL` | MongoDB connection string | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | JWT expiration | 7d |
| `JWT_REFRESH_SECRET` | Refresh token secret | - |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration | 30d |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:5173 |

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/v1/auth/register` | Register new user | Public |
| POST | `/api/v1/auth/login` | Login user | Public |
| GET | `/api/v1/auth/profile` | Get current user | Private |
| POST | `/api/v1/auth/refresh` | Refresh access token | Public |
| POST | `/api/v1/auth/logout` | Logout user | Private |

### Tasks

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/v1/tasks` | List all tasks | Private |
| GET | `/api/v1/tasks/:id` | Get single task | Private |
| POST | `/api/v1/tasks` | Create task | Private |
| PUT | `/api/v1/tasks/:id` | Update task | Private |
| DELETE | `/api/v1/tasks/:id` | Delete task | Private |
| GET | `/api/v1/tasks/stats` | Task statistics | Admin |

### Query Parameters (Tasks)

| Parameter | Description |
|-----------|-------------|
| `page` | Page number (default: 1) |
| `limit` | Items per page (default: 10, max: 100) |
| `status` | Filter by status |
| `priority` | Filter by priority |
| `search` | Search in title/description |
| `sort` | Sort field |
| `order` | Sort order (asc/desc) |

## Getting Started

1. **Start the backend:**
```bash
cd backend
npm run dev
```

2. **Start the frontend:**
```bash
cd frontend
npm run dev
```

3. **Open browser:**
- Frontend: http://localhost:5173
- Register a new account
- Login and manage tasks

## MongoDB Atlas Setup

To use MongoDB Atlas cloud:

1. Create a free cluster at https://www.mongodb.com/atlas
2. Create a database user
3. Whitelist your IP (0.0.0.0/0 for all IPs)
4. Get your connection string
5. Update `.env`:
```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/prime_trade?retryWrites=true&w=majority"
```

## Scalability Considerations

### Current Architecture
- **Monolithic** Express.js application
- **Single MongoDB** database
- **Synchronous** request handling

### Scaling Strategies

1. **Horizontal Scaling**
   - Deploy multiple instances behind a load balancer
   - Use Redis for session storage and rate limiting
   - Implement sticky sessions for JWT blacklist

2. **Database Scaling (MongoDB)**
   - **MongoDB Atlas**: Managed scaling with auto-scaling shards
   - **Read Replicas**: Configure replica sets for read scaling
   - **Connection Pooling**: Use MongoDB connection pooling

3. **Caching Layer (Redis)**
   - Cache frequently accessed data
   - Store JWT blacklist for instant logout
   - Cache API responses

4. **Microservices Architecture**
   - Split auth service from task service
   - Event-driven communication with message queue
   - Independent scaling per service

5. **Performance Optimizations**
   - Database indexes on frequently queried fields
   - Pagination for large datasets
   - Async job processing for heavy tasks

6. **Monitoring & Logging**
   - Centralized logging (ELK stack)
   - Metrics collection (Prometheus)
   - Distributed tracing

7. **Security Enhancements**
   - HTTPS everywhere
   - Regular dependency audits
   - Security headers (CSP, HSTS)
   - Input sanitization

## License

MIT License
