# Library Management System

A modern, full-stack library management system built with React frontend and C++ Crow backend with MySQL database.

## Overview

This project provides a complete solution for managing a library's operations including:

- **Books Management**: Add, update, search, and manage book inventory
- **Members Management**: Register and manage library members
- **Borrowing System**: Track book borrowing and returns
- **Reports & Analytics**: View statistics and performance metrics
- **Settings Management**: Configure library-wide policies and preferences

## Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router 6** for SPA routing
- **React Query** for data fetching and caching
- **TailwindCSS 3** for styling
- **Recharts** for analytics and charts
- **Lucide React** for icons

### Backend

- **C++ 17** with Crow web framework
- **MySQL** for data persistence
- **CMake** for build configuration
- **nlohmann/json** for JSON handling

## Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm
- MySQL Server (5.7+)
- CMake 3.12+
- GCC/Clang with C++17 support
- Boost libraries

### Installation & Setup

#### 1. Setup Backend Database

```bash
# Start MySQL server if not running
# Create database and tables
mysql -u root -p < backend/sql/schema.sql
```

#### 2. Build and Run Backend

```bash
cd backend

# Run setup script (Unix/Linux/macOS)
chmod +x setup.sh
./setup.sh

# Or manually install dependencies and build
mkdir build
cd build
cmake ..
cmake --build . --config Release

# Update database credentials in src/main.cpp before running
./library_server
# Server will start on http://localhost:8080
```

#### 3. Setup and Run Frontend

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Frontend will be available at http://localhost:5173
```

#### 4. Access the Application

Open your browser and navigate to:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api

## Project Structure

```
project-root/
├── backend/                 # C++ Crow backend
│   ├── include/            # Header files
│   │   ├── database/
│   │   ├── models/
│   │   └── routes/
│   ├── src/                # Source files
│   │   ├── database/
│   │   ├── models/
│   │   └── routes/
│   ├── sql/
│   │   └── schema.sql      # Database schema
│   ├── third_party/        # External libraries (Crow, JSON)
│   ├── CMakeLists.txt
│   ├── setup.sh
│   └── README.md
│
├── client/                 # React frontend
│   ├── components/         # React components
│   │   ├── ui/            # UI library components
│   │   └── Layout.tsx
│   ├── pages/             # Page components
│   │   ├── Index.tsx      # Dashboard
│   │   ├── Books.tsx
│   │   ├── Members.tsx
│   │   ├── Borrowing.tsx
│   │   ├── Reports.tsx
│   │   └── Settings.tsx
│   ├── hooks/
│   ├── lib/
│   ├── App.tsx
│   └── global.css
│
├── shared/                # Shared types
│   └── api.ts            # API interfaces and utilities
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── vite.config.ts
└── README.md
```

## API Documentation

### Base URL

```
http://localhost:8080/api
```

### Endpoints

#### Books

- `GET /books` - List all books
- `GET /books/<id>` - Get book details
- `GET /books/search?q=<query>&category=<category>` - Search books
- `POST /books` - Create new book
- `PUT /books/<id>` - Update book
- `DELETE /books/<id>` - Delete book

#### Members

- `GET /members` - List all members
- `GET /members/<id>` - Get member details
- `GET /members/search?q=<query>` - Search members
- `GET /members/status/<status>` - Filter by status
- `POST /members` - Create new member
- `PUT /members/<id>` - Update member
- `DELETE /members/<id>` - Delete member

#### Borrowing

- `GET /borrowing` - List all borrowing records
- `GET /borrowing/<id>` - Get borrowing details
- `GET /borrowing/member/<member_id>` - Get member's borrows
- `GET /borrowing/status/<status>` - Filter by status
- `GET /borrowing/overdue` - Get overdue books
- `POST /borrowing` - Record new borrow
- `PUT /borrowing/<id>` - Update borrowing record
- `POST /borrowing/<id>/return` - Record book return
- `DELETE /borrowing/<id>` - Delete borrowing record

#### Reports

- `GET /reports/statistics` - Get borrowing statistics
- `GET /reports/monthly` - Get monthly statistics
- `GET /reports/top-books` - Get top borrowed books
- `GET /reports/dashboard` - Get dashboard metrics

#### Settings

- `GET /settings` - Get library settings
- `PUT /settings` - Update library settings

### Example Requests

#### Create a Book

```bash
curl -X POST http://localhost:8080/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "isbn": "978-0743273565",
    "category": "Fiction",
    "copies": 5,
    "year": 1925
  }'
```

#### Create a Member

```bash
curl -X POST http://localhost:8080/api/members \
  -H "Content-Type: application/json" \
  -d '{
    "member_id": "LIB001",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-0123",
    "address": "123 Main St"
  }'
```

#### Record a Borrow

```bash
curl -X POST http://localhost:8080/api/borrowing \
  -H "Content-Type: application/json" \
  -d '{
    "member_id": 1,
    "book_id": 1,
    "borrow_date": "2024-01-15",
    "due_date": "2024-01-29"
  }'
```

## Development

### Frontend Development

```bash
# Start dev server with hot reload
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run type checking
pnpm typecheck

# Run tests
pnpm test
```

### Backend Development

```bash
# After making changes to backend code
cd backend/build
cmake --build . --config Release

# Or with make
make -j$(nproc)

# Run the server
./library_server
```

## Database Schema

### Tables

#### books

- id (Primary Key)
- title
- author
- isbn (Unique)
- category
- total_copies
- available_copies
- publication_year
- created_at
- updated_at

#### members

- id (Primary Key)
- member_id (Unique)
- name
- email
- phone
- address
- status (active/inactive/suspended)
- join_date
- created_at
- updated_at

#### borrow_records

- id (Primary Key)
- member_id (Foreign Key)
- book_id (Foreign Key)
- borrow_date
- due_date
- return_date (Nullable)
- status (active/returned/overdue)
- fine_amount
- created_at
- updated_at

#### settings

- id (Primary Key)
- library_name
- email
- phone
- address
- borrow_limit
- borrow_duration_days
- late_fee_per_day
- enable_notifications
- enable_fine
- created_at
- updated_at

## Configuration

### Backend Configuration

Edit `backend/src/main.cpp` to configure:

```cpp
// Database connection
Database db("localhost", "root", "your_password", "library_db", 3306);

// Server port
app.port(8080).multithreaded().run();
```

### Frontend Configuration

Environment variables can be set in `.env`:

```
REACT_APP_API_URL=http://localhost:8080/api
```

## Troubleshooting

### Backend Issues

#### MySQL Connection Failed

- Ensure MySQL server is running
- Check username/password in `src/main.cpp`
- Verify database exists: `mysql -u root -p -e "USE library_db;"`

#### Build Errors

- Clear build directory: `rm -rf build/`
- Reinstall dependencies
- Ensure C++ compiler supports C++17: `g++ --version`

#### Port Already in Use

- Change port in `src/main.cpp`
- Or kill the process: `lsof -i :8080`

### Frontend Issues

#### API Connection Failed

- Verify backend is running on port 8080
- Check `REACT_APP_API_URL` in `.env`
- Check browser console for CORS errors

#### Dependencies Not Installing

- Clear node_modules: `rm -rf node_modules`
- Clear cache: `pnpm store prune`
- Reinstall: `pnpm install`

## Performance Optimization

### Frontend

- Implemented React Query for efficient data fetching
- Lazy loading of components
- Optimized bundle size with tree-shaking

### Backend

- Database indexes on frequently queried columns
- Connection pooling (can be added)
- Multithreaded request handling

## Security Considerations

- Add authentication/authorization layer
- Use HTTPS in production
- Validate all user inputs
- Implement rate limiting
- Use prepared statements for all queries
- Never commit credentials

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Advanced search and filtering
- [ ] Email notification system
- [ ] Automated fine calculation
- [ ] Book reservation system
- [ ] Member renewal management
- [ ] PDF/Excel report export
- [ ] Mobile app (React Native)
- [ ] Real-time notifications (WebSockets)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is part of the Library Management System.

## Support

For issues, questions, or suggestions, please refer to the documentation in `backend/README.md` for backend-specific details.

## Deployment

### Backend Deployment

The backend can be deployed to:

- Linux servers (Ubuntu, CentOS, etc.)
- Docker containers
- Cloud platforms (AWS, GCP, Azure)

Build a release binary:

```bash
cd backend/build
cmake --build . --config Release
```

### Frontend Deployment

Use any static hosting service:

- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Cloudflare Pages

Build for production:

```bash
pnpm build
# Output will be in `dist/` directory
```

## Getting Help

- Check the README files in individual directories
- Review API documentation in backend/README.md
- Check AGENTS.md for coding guidelines

---

**Happy coding! 📚**
