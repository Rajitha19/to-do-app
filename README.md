# Todo Application - Full Stack Assessment

A modern full-stack todo application built with React, Node.js, TypeScript, and MySQL, featuring Docker containerization for easy deployment.

## 🛠️ Tech Stack

### Frontend

- **React 18** with TypeScript
- **TailwindCSS** for styling
- **Axios** for API communication
- **React Testing Library** for testing

### Backend

- **Node.js** with Express and TypeScript
- **Prisma ORM** for database management
- **MySQL** database
- **Jest** for testing
- **CORS** and security middleware

### DevOps

- **Docker** & **Docker Compose**
- **Multi-stage builds** for optimization
- **Health checks** and monitoring

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **Docker** and **Docker Compose**
- **Git**

## 🚀 Quick Start (Docker - Recommended)

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd todo-application
   ```

2. **Start the application**

   ```bash
   docker-compose up --build -d
   ```

3. **Access the application**

   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

4. **Stop the application**
   ```bash
   docker-compose down
   ```

## 🔧 Local Development Setup

If you prefer to run the application locally without Docker:

### Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure your local MySQL database connection.

4. **Set up database**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev --name init

   # Seed database (optional)
   npx ts-node prisma/seed.ts
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

The application will be available at:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🐳 Docker Configuration

The application uses Docker Compose with three services:

- **frontend**: React application served by Nginx
- **backend**: Node.js API server
- **database**: MariaDB 10.9 (MySQL compatible)

### Docker Commands

```bash
# Build and start all services
docker-compose up --build -d

# View running containers
docker-compose ps

# View logs
docker-compose logs [service-name]

# Stop all services
docker-compose down

# Remove all containers and volumes
docker-compose down -v
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 📡 API Endpoints

| Method | Endpoint                  | Description           |
| ------ | ------------------------- | --------------------- |
| GET    | `/health`                 | Health check          |
| GET    | `/api/tasks`              | Get recent tasks      |
| POST   | `/api/tasks`              | Create new task       |
| PUT    | `/api/tasks/:id/complete` | Mark task as complete |
| DELETE | `/api/tasks/:id`          | Delete task           |

### Example API Usage

```bash
# Get tasks
curl http://localhost:5000/api/tasks

# Create task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"New Task","description":"Task description"}'

# Mark task as complete
curl -X PUT http://localhost:5000/api/tasks/1/complete
```

## 📁 Project Structure

```
todo-application/
├── backend/
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── services/        # Business logic
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── types/           # TypeScript types
│   │   └── index.ts         # Entry point
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.ts          # Database seeding
│   ├── tests/               # Test files
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   └── App.tsx          # Main component
│   ├── public/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🔧 Environment Variables

### Backend (.env)

```bash
DATABASE_URL="mysql://todouser:todopassword@database:3306/todoapp"
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
JWT_SECRET="your-super-secret-jwt-key"
```

### Frontend

```bash
REACT_APP_API_URL=http://localhost:5000
```

## 🚀 Deployment

This application is containerized and ready for deployment to any Docker-compatible hosting platform:

- **Local**: Docker Compose
- **Cloud**: AWS ECS, Google Cloud Run, Azure Container Instances
- **Kubernetes**: Includes Docker images ready for K8s deployment

**Built with ❤️ for the Full Stack Engineer Assessment for CoverageX**
