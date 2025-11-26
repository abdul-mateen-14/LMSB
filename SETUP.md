# Library Management System - Complete Setup Guide

This guide will walk you through setting up the entire Library Management System (frontend + backend) from scratch.

## Prerequisites

Before starting, ensure you have:

- **Node.js** 18.0+ ([Download](https://nodejs.org/))
- **MySQL Server** 5.7+ ([Download](https://dev.mysql.com/downloads/mysql/))
- **CMake** 3.12+ ([Download](https://cmake.org/download/))
- **Git** ([Download](https://git-scm.com/))
- **C++ Compiler**:
  - Linux/macOS: GCC or Clang
  - Windows: Visual Studio with C++ tools or MinGW

## Step 1: Install System Dependencies

### macOS (using Homebrew)

```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install dependencies
brew install cmake mysql boost nlohmann-json node
brew services start mysql
```

### Ubuntu/Debian (Linux)

```bash
sudo apt-get update
sudo apt-get install -y \
    build-essential \
    cmake \
    git \
    mysql-server \
    mysql-client \
    libmysqlclient-dev \
    libboost-all-dev \
    nlohmann-json3-dev \
    nodejs \
    npm

# Start MySQL service
sudo systemctl start mysql
sudo systemctl enable mysql
```

### Windows

1. **MySQL**: Download from https://dev.mysql.com/downloads/mysql/ and run the installer
2. **CMake**: Download from https://cmake.org/download/ and run the installer
3. **Visual Studio**: Install with C++ development tools
4. **Node.js**: Download from https://nodejs.org/
5. **Git**: Download from https://git-scm.com/

## Step 2: Clone the Project

```bash
# Clone the repository
git clone <repository-url> library-management
cd library-management
```

## Step 3: Setup MySQL Database

### Create Database and Tables

```bash
# Using MySQL command line
mysql -u root -p < backend/sql/schema.sql
```

You'll be prompted for your MySQL root password. Enter it.

### Or Manually

```bash
# Open MySQL command line
mysql -u root -p

# Then in MySQL console, run:
CREATE DATABASE IF NOT EXISTS library_db;
USE library_db;
# ... (copy and paste the contents from backend/sql/schema.sql)
```

## Step 4: Build and Run Backend

### Linux/macOS

```bash
cd backend

# Run automatic setup script
chmod +x setup.sh
./setup.sh

# This will:
# 1. Install dependencies
# 2. Download Crow framework
# 3. Create build directory
# 4. Run CMake

# If setup.sh has issues, do it manually:
mkdir -p build
cd build
cmake ..
cmake --build . --config Release
cd ..
```

### Windows (using Visual Studio)

```cmd
cd backend

# Create build directory
mkdir build
cd build

# Generate Visual Studio project files
cmake -G "Visual Studio 17 2022" ..

# Build using Visual Studio
cmake --build . --config Release

# Or open the generated .sln file in Visual Studio and build there
```

### Important: Update Database Credentials

**Before running the backend**, edit `backend/src/main.cpp` and update the database connection:

```cpp
// Line with Database db(...):
Database db("localhost", "root", "your_mysql_password", "library_db", 3306);
```

Replace `"your_mysql_password"` with your actual MySQL root password.

### Run Backend

```bash
# From backend/build directory
./library_server

# You should see:
# "Database connection successful"
# "Starting server on http://localhost:8080"
```

**Keep this terminal window open!** The backend server needs to be running while you use the application.

## Step 5: Setup and Run Frontend

### In a NEW Terminal Window

```bash
# Go to project root (not backend folder)
cd library-management

# Install Node.js dependencies
npm install
# Or if you use pnpm:
pnpm install
# Or if you use yarn:
yarn install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
# Or with pnpm:
pnpm dev
# Or with yarn:
yarn dev
```

You should see output like:
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Press h to show help
```

## Step 6: Access the Application

Open your browser and visit:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api (for testing)
- **Health Check**: http://localhost:8080/api/health

## Verification

### Test Backend is Running

```bash
# In another terminal, test the health endpoint
curl http://localhost:8080/api/health

# Expected response:
# {"status":"ok","service":"Library Management System API"}
```

### Test Frontend Connection

1. Open http://localhost:5173 in your browser
2. Navigate to "Books" page
3. You should see sample books from the database
4. If there are no books, the database setup might have issues

## Troubleshooting

### MySQL Connection Issues

**Error**: "Can't connect to MySQL server"

**Solutions**:
1. Verify MySQL is running:
   ```bash
   # macOS
   brew services list | grep mysql
   
   # Linux
   sudo systemctl status mysql
   
   # Windows - Check Services or Task Manager
   ```

2. Check credentials in `backend/src/main.cpp`

3. Verify database exists:
   ```bash
   mysql -u root -p -e "SHOW DATABASES;"
   ```

### Backend Build Issues

**Error**: "CMake not found" or "cmake: command not found"

**Solutions**:
1. Install CMake for your OS
2. Add CMake to PATH:
   - macOS/Linux: Usually automatic
   - Windows: Check "Add CMake to PATH" during installation

**Error**: "MySQL not found" during build

**Solutions**:
1. Install MySQL development libraries
2. On macOS: `brew install mysql`
3. On Linux: `sudo apt-get install libmysqlclient-dev`

### Frontend Build Issues

**Error**: "npm: command not found"

**Solutions**:
1. Install Node.js from https://nodejs.org/
2. Restart terminal after installation
3. Verify: `node --version`

**Error**: "Cannot find module" when running dev server

**Solutions**:
1. Clear node_modules: `rm -rf node_modules`
2. Clear npm cache: `npm cache clean --force`
3. Reinstall: `npm install`

### Port Already in Use

**Error**: "EADDRINUSE: address already in use :::8080"

**Solutions**:

For Backend (port 8080):
```bash
# macOS/Linux - Find and kill process
lsof -i :8080
kill -9 <PID>

# Or change port in backend/src/main.cpp:
# app.port(8081)  // Change from 8080 to 8081
```

For Frontend (port 5173):
```bash
# macOS/Linux - Find and kill process
lsof -i :5173
kill -9 <PID>

# Or the dev server will automatically use next available port
```

### Database Not Found After Setup

**Error**: "Cannot create table, database not found"

**Solutions**:
1. Verify schema was imported:
   ```bash
   mysql -u root -p library_db
   SHOW TABLES;
   ```

2. If tables missing, manually import:
   ```bash
   mysql -u root -p library_db < backend/sql/schema.sql
   ```

## Running Both Services

Keep two terminal windows open:

**Terminal 1 - Backend**:
```bash
cd backend/build
./library_server
# Stays running, shows: "Starting server on http://localhost:8080"
```

**Terminal 2 - Frontend**:
```bash
npm run dev
# Stays running, shows: "Local: http://localhost:5173/"
```

## Next Steps

1. **Explore the Application**:
   - Visit http://localhost:5173
   - Navigate through different pages
   - Try creating a book or member
   - Record a book borrowing

2. **Check the Data**:
   - Open MySQL terminal: `mysql -u root -p library_db`
   - Query tables: `SELECT * FROM books;`

3. **Read Documentation**:
   - Backend docs: `backend/README.md`
   - API documentation in `README.md`

4. **Customize Settings**:
   - Go to Settings page in the app
   - Configure library name, borrow limits, etc.

## Development Tips

### Making Changes

**Frontend Changes**:
- Edit files in `client/`
- Dev server auto-reloads (hot reload)
- No rebuild needed

**Backend Changes**:
1. Edit files in `backend/src/` or `backend/include/`
2. In `backend/build/` directory:
   ```bash
   cmake --build . --config Release
   ```
3. Kill and restart `./library_server`

### Testing API Directly

```bash
# Get all books
curl http://localhost:8080/api/books

# Create a book
curl -X POST http://localhost:8080/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Book",
    "author": "Test Author",
    "isbn": "978-0000000000",
    "category": "Fiction",
    "copies": 5,
    "year": 2024
  }'
```

### Using Postman or Thunder Client

1. Download Postman or Thunder Client (VS Code extension)
2. Import the API endpoints
3. Test without using the frontend

## Production Deployment

For deploying to production, see the main `README.md` file for deployment instructions.

## Getting Help

1. Check error messages carefully
2. Review the logs in the terminal
3. Check `backend/README.md` for backend-specific help
4. Check `AGENTS.md` for development guidelines

## Summary

You now have:
- ✅ MySQL database running with schema imported
- ✅ C++ Crow backend compiled and running on port 8080
- ✅ React frontend running on port 5173
- ✅ Frontend connected to backend API

**You're ready to use the Library Management System!** 📚

For any issues, double-check the Troubleshooting section or refer to the detailed README files in each directory.
