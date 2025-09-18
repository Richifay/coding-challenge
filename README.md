# Coding Challenge Platform

A full-stack coding challenge platform with React frontend, Node.js backend, and MongoDB database.

## Features

- **Username-based sessions** with unique username validation
- **Code persistence** in localStorage (cleared on successful submission)
- **Python code execution** with timeout protection
- **Real-time timer** tracking solution time
- **Leaderboard** showing top 20 fastest solutions
- **Docker containerization** for easy deployment
- **CORS-enabled** API for cross-origin requests

## Tech Stack

- **Frontend**: React + Vite + Monaco Editor
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Code Execution**: Python 3
- **Containerization**: Docker + Docker Compose

## Quick Start

### Local Development
```bash
# Start all services
docker-compose up --build -d

# Access the application
open http://localhost
```

### Manual Setup
```bash
# Server
cd server
npm install
npm run dev

# Client (separate terminal)
cd client
npm install
npm run dev

# MongoDB (separate terminal)
brew services start mongodb-community@7.0
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/challenge` - Get challenge details
- `POST /api/start` - Start a session
- `POST /api/run` - Run code with predefined input
- `POST /api/submit` - Submit solution for testing
- `GET /api/leaderboard` - Get top 20 scores

## Challenge Details

The challenge is to create a logo generator that takes two numbers as input and outputs a formatted ASCII logo. The solution must handle error cases and output "Error" for invalid inputs.

## Docker Services

- **client**: React app served by nginx (port 80)
- **server**: Node.js API server (port 4000)
- **mongodb**: MongoDB database (port 27017)

## Environment Variables

### Server (.env)
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/coding_challenge
CLIENT_ORIGIN=http://localhost:5173
```

## Development

The platform includes:
- Session management with username validation
- Code persistence across browser refreshes
- Secure Python code execution with timeouts
- Real-time leaderboard updates
- Responsive UI with Monaco code editor

## Security Features

- Username uniqueness validation
- Code execution timeout (3 seconds)
- Input validation and sanitization
- CORS protection
- Non-root Docker containers
