#include "crow_all.h"
#include "database/db_connection.h"
#include "routes/books_routes.h"
#include "routes/members_routes.h"
#include "routes/borrowing_routes.h"
#include "routes/reports_routes.h"
#include "routes/settings_routes.h"
#include <iostream>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

int main() {
    crow::SimpleApp app;
    
    // Database connection
    // Update these credentials to match your MySQL setup
    Database db("localhost", "root", "password", "library_db", 3306);
    
    if (!db.connect()) {
        std::cerr << "Failed to connect to database" << std::endl;
        return 1;
    }
    
    std::cout << "Database connection successful" << std::endl;
    
    // Register all routes
    registerBooksRoutes(app, db);
    registerMembersRoutes(app, db);
    registerBorrowingRoutes(app, db);
    registerReportsRoutes(app, db);
    registerSettingsRoutes(app, db);
    
    // Health check endpoint
    CROW_ROUTE(app, "/api/health")
        .methods("GET"_method)
    ([]() {
        json response = {
            {"status", "ok"},
            {"service", "Library Management System API"}
        };
        auto res = crow::response(response.dump());
        res.set_header("Content-Type", "application/json");
        res.set_header("Access-Control-Allow-Origin", "*");
        return res;
    });
    
    // CORS preflight for root API
    CROW_ROUTE(app, "/api")
        .methods("OPTIONS"_method)
    ([]() {
        auto response = crow::response(204);
        response.set_header("Access-Control-Allow-Origin", "*");
        response.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.set_header("Access-Control-Allow-Headers", "Content-Type");
        return response;
    });
    
    std::cout << "Starting server on http://localhost:8080" << std::endl;
    
    // Start server
    app.port(8080).multithreaded().run();
    
    return 0;
}
