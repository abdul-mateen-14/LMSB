# Quick Start Guide - Library Management System

Get up and running in 5 minutes!

## Prerequisites Installed?

- ✅ Node.js 18+
- ✅ MySQL Server
- ✅ CMake 3.12+
- ✅ C++ Compiler (GCC/Clang/MSVC)

If not, see **SETUP.md** for detailed installation.

## Start the System (2 Terminal Windows)

### Terminal 1: Backend Server

```bash
# Navigate to backend directory
cd backend

# First time only - Build the project
mkdir build
cd build
cmake ..
cmake --build . --config Release

# Update database password in ../src/main.cpp before running!

# Run the server
./library_server
# Expected: "Starting server on http://localhost:8080"
```

### Terminal 2: Frontend App

```bash
# From project root (NOT backend folder)
npm install
npm run dev
# Expected: "Local: http://localhost:5173/"
```

## Open in Browser

```
http://localhost:5173
```

## First Steps

1. **Check if data loads**: Go to Books page
2. **Create a book**: Click "Add Book" button
3. **Create a member**: Go to Members page → "Add Member"
4. **Record a borrow**: Go to Borrowing → "New Borrow"
5. **View reports**: Check Reports page for statistics

## Useful Commands

### Backend

```bash
# Rebuild after code changes
cd backend/build
cmake --build . --config Release

# Test API with curl
curl http://localhost:8080/api/books

# Reconnect MySQL (if connection lost)
# Update credentials in backend/src/main.cpp and rebuild
```

### Frontend

```bash
# Build for production
npm run build

# Type check
npm run typecheck

# Test
npm run test

# Preview production build
npm run preview
```

### Database

```bash
# Access MySQL
mysql -u root -p library_db

# View tables
SHOW TABLES;

# Query books
SELECT * FROM books;

# Reset database
mysql -u root -p < backend/sql/schema.sql
```

## Common Issues

### "Can't connect to database"

- Check MySQL is running
- Verify credentials in `backend/src/main.cpp`
- Run: `mysql -u root -p -e "USE library_db;"`

### "Port 8080/5173 already in use"

- Kill process: `lsof -i :8080` (then `kill <PID>`)
- Or change port in backend/src/main.cpp

### "API not found" errors

- Ensure backend is running on port 8080
- Check http://localhost:8080/api/health

### "Module not found" errors

```bash
rm -rf node_modules
npm cache clean --force
npm install
```

## File Structure

```
project/
├── backend/          ← C++ backend (port 8080)
├── client/           ← React frontend (port 5173)
├── shared/           ← Types and API utilities
├── README.md         ← Full documentation
├── SETUP.md          ← Detailed setup guide
└── QUICK_START.md    ← This file
```

## API Endpoints (For Testing)

```bash
# Health check
curl http://localhost:8080/api/health

# Get all books
curl http://localhost:8080/api/books

# Create a book
curl -X POST http://localhost:8080/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Book","author":"Author","isbn":"123","category":"Fiction","copies":5,"year":2024}'

# Get all members
curl http://localhost:8080/api/members

# Get dashboard data
curl http://localhost:8080/api/reports/dashboard
```

## Development Workflow

### Frontend

1. Edit files in `client/`
2. Browser auto-reloads (hot reload)
3. Check console for errors

### Backend

1. Edit files in `backend/src/` or `backend/include/`
2. Rebuild: `cd backend/build && cmake --build . --config Release`
3. Restart: `./library_server`

## Database Credentials

Default (from schema.sql):

```
Host: localhost
User: root
Password: password (change in backend/src/main.cpp)
Database: library_db
Port: 3306
```

## Next Steps

1. **Customize**: Edit settings in the app (Settings page)
2. **Add data**: Create books, members, borrows
3. **Check reports**: View statistics and analytics
4. **Deploy**: See README.md for deployment instructions

## Need Help?

- Backend issues: See `backend/README.md`
- Setup problems: See `SETUP.md`
- API details: See `README.md`
- Code guidelines: See `AGENTS.md`

---

**Happy coding! 🚀**

Still stuck? Check SETUP.md or README.md for detailed information.
