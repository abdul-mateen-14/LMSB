# Library Management System - C++ Backend

A RESTful API backend for a library management system built with the Crow C++ web framework and MySQL database.

## Features

- **Books Management**: Create, read, update, delete books with search and categorization
- **Members Management**: Manage library members with status tracking
- **Borrowing Tracking**: Record and manage book borrowing and returns
- **Reports & Analytics**: Generate statistics and reports on library activities
- **Settings Management**: Configure library-wide settings and policies

## Tech Stack

- **Framework**: Crow (C++ web framework)
- **Database**: MySQL
- **JSON**: nlohmann/json
- **Build**: CMake 3.12+
- **Language**: C++ 17

## Requirements

### System Dependencies

- GCC/Clang with C++17 support
- CMake 3.12 or higher
- MySQL Server (5.7+)
- MySQL development libraries (mysql-devel or libmysqlclient-dev)
- Boost libraries (system)

### Installation

#### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install cmake build-essential libmysqlclient-dev libboost-all-dev nlohmann-json3-dev
```

#### macOS
```bash
brew install cmake mysql boost nlohmann-json
```

#### Windows
Use vcpkg or pre-built binaries:
```bash
vcpkg install mysql:x64-windows boost:x64-windows nlohmann-json:x64-windows
```

## Database Setup

### 1. Create Database and Schema

```bash
mysql -u root -p < sql/schema.sql
```

This will:
- Create the `library_db` database
- Create all necessary tables (books, members, borrow_records, settings)
- Insert sample data

### 2. Update Database Connection

Edit `src/main.cpp` and update the database credentials:

```cpp
Database db("localhost", "root", "your_password", "library_db", 3306);
```

## Building

### Using CMake

```bash
# Create build directory
mkdir build
cd build

# Generate build files
cmake ..

# Build the project
cmake --build . --config Release

# Or using make directly
make -j$(nproc)
```

### Build Output

The executable will be created at `build/library_server` (Unix) or `build/Release/library_server.exe` (Windows)

## Running

### Start the Server

```bash
# From the build directory
./library_server

# Or from root directory
./build/library_server
```

The server will start on `http://localhost:8080` by default.

### Verify Server is Running

```bash
curl http://localhost:8080/api/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "Library Management System API"
}
```

## API Endpoints

### Books
- `GET /api/books` - List all books
- `GET /api/books/<id>` - Get book by ID
- `GET /api/books/search?q=<query>&category=<category>` - Search books
- `POST /api/books` - Create new book
- `PUT /api/books/<id>` - Update book
- `DELETE /api/books/<id>` - Delete book

### Members
- `GET /api/members` - List all members
- `GET /api/members/<id>` - Get member by ID
- `GET /api/members/search?q=<query>` - Search members
- `GET /api/members/status/<status>` - Filter members by status
- `POST /api/members` - Create new member
- `PUT /api/members/<id>` - Update member
- `DELETE /api/members/<id>` - Delete member

### Borrowing
- `GET /api/borrowing` - List all borrowing records
- `GET /api/borrowing/<id>` - Get borrowing record by ID
- `GET /api/borrowing/member/<member_id>` - Get borrows by member
- `GET /api/borrowing/status/<status>` - Filter by status
- `GET /api/borrowing/overdue` - Get overdue books
- `POST /api/borrowing` - Record new borrow
- `PUT /api/borrowing/<id>` - Update borrowing record
- `POST /api/borrowing/<id>/return` - Record book return
- `DELETE /api/borrowing/<id>` - Delete borrowing record

### Reports
- `GET /api/reports/statistics` - Get borrowing statistics
- `GET /api/reports/monthly` - Get monthly statistics
- `GET /api/reports/top-books` - Get top borrowed books
- `GET /api/reports/dashboard` - Get dashboard metrics

### Settings
- `GET /api/settings` - Get library settings
- `PUT /api/settings` - Update library settings

## Environment Variables

Optional environment variables for configuration:

```bash
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=library_db
DB_PORT=3306

# Server
SERVER_PORT=8080
```

## Project Structure

```
backend/
├── include/
│   ├── database/
│   │   └── db_connection.h
│   ├── models/
│   │   ├── book.h
│   │   ├── member.h
│   │   └── borrow.h
│   └── routes/
│       ├── books_routes.h
│       ├── members_routes.h
│       ├── borrowing_routes.h
│       ├── reports_routes.h
│       └── settings_routes.h
├── src/
│   ├── main.cpp
│   ├── database/
│   │   └── db_connection.cpp
│   ├── models/
│   │   ├── book.cpp
│   │   ├── member.cpp
│   │   └── borrow.cpp
│   └── routes/
│       ├── books_routes.cpp
│       ├── members_routes.cpp
│       ├── borrowing_routes.cpp
│       ├── reports_routes.cpp
│       └── settings_routes.cpp
├── sql/
│   └── schema.sql
├── third_party/
│   └── crow_all.h
├── CMakeLists.txt
└── README.md
```

## Development

### Adding New Features

1. Create model files in `include/models/` and `src/models/`
2. Create route handler in `src/routes/`
3. Create corresponding header in `include/routes/`
4. Register routes in `src/main.cpp`
5. Update CMakeLists.txt with new source files

### Testing

Use curl or Postman to test endpoints:

```bash
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

# Get all books
curl http://localhost:8080/api/books

# Search books
curl "http://localhost:8080/api/books/search?q=test&category=Fiction"
```

## Troubleshooting

### MySQL Connection Error
- Verify MySQL server is running
- Check database credentials in `src/main.cpp`
- Ensure database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### Build Errors
- Ensure all dependencies are installed
- Check compiler version: `g++ --version` (should support C++17)
- Try clearing build directory: `rm -rf build && mkdir build && cd build`

### Port Already in Use
- Change port in `src/main.cpp`: `app.port(8080)`
- Or kill process using port: `lsof -i :8080` (Unix)

## CORS Configuration

The API includes CORS headers to allow requests from any origin. This is configured in route handlers.

## Error Handling

API responses follow this format:

### Success Response
```json
{
  "data": {...}
}
```

### Error Response
```json
{
  "error": "Error message here"
}
```

## Performance Considerations

- Database indexes are created on frequently queried columns
- Connection pooling is not implemented (can be added for production)
- Consider adding caching layer for reports
- Add rate limiting in production

## Future Enhancements

- [ ] Authentication and authorization
- [ ] Advanced search filters
- [ ] Notification system
- [ ] Fine calculation and management
- [ ] Book reservations
- [ ] Member renewal system
- [ ] Export reports to PDF/Excel

## License

This project is part of the Library Management System.

## Support

For issues and questions, please refer to the main project documentation.
