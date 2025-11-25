#include "crow_all.h"
#include "database/db_connection.h"
#include "models/borrow.h"
#include <nlohmann/json.hpp>

using json = nlohmann::json;

void registerReportsRoutes(crow::SimpleApp& app, Database& db) {
    Borrow borrowModel(&db);
    
    // GET statistics
    CROW_ROUTE(app, "/api/reports/statistics")
        .methods("GET"_method)
    ([&borrowModel](const crow::request&) {
        auto result = borrowModel.getStatistics();
        auto response = crow::response(result.dump());
        response.set_header("Content-Type", "application/json");
        response.set_header("Access-Control-Allow-Origin", "*");
        return response;
    });
    
    // GET monthly statistics
    CROW_ROUTE(app, "/api/reports/monthly")
        .methods("GET"_method)
    ([&borrowModel](const crow::request&) {
        auto result = borrowModel.getMonthlyStats();
        auto response = crow::response(result.dump());
        response.set_header("Content-Type", "application/json");
        response.set_header("Access-Control-Allow-Origin", "*");
        return response;
    });
    
    // GET top books
    CROW_ROUTE(app, "/api/reports/top-books")
        .methods("GET"_method)
    ([&borrowModel](const crow::request&) {
        auto result = borrowModel.getTopBooks();
        auto response = crow::response(result.dump());
        response.set_header("Content-Type", "application/json");
        response.set_header("Access-Control-Allow-Origin", "*");
        return response;
    });
    
    // GET dashboard data
    CROW_ROUTE(app, "/api/reports/dashboard")
        .methods("GET"_method)
    ([&db](const crow::request&) {
        json dashboard = json::object();
        
        // Total books
        auto books_result = db.executeQuery("SELECT COUNT(*) as count FROM books");
        if (!books_result.empty()) {
            dashboard["total_books"] = books_result[0]["count"];
        }
        
        // Active members
        auto members_result = db.executeQuery("SELECT COUNT(*) as count FROM members WHERE status = 'active'");
        if (!members_result.empty()) {
            dashboard["active_members"] = members_result[0]["count"];
        }
        
        // Currently borrowed
        auto borrowed_result = db.executeQuery("SELECT COUNT(*) as count FROM borrow_records WHERE status = 'active'");
        if (!borrowed_result.empty()) {
            dashboard["books_borrowed"] = borrowed_result[0]["count"];
        }
        
        // Overdue books
        auto overdue_result = db.executeQuery("SELECT COUNT(*) as count FROM borrow_records WHERE status = 'overdue'");
        if (!overdue_result.empty()) {
            dashboard["overdue_books"] = overdue_result[0]["count"];
        }
        
        auto response = crow::response(dashboard.dump());
        response.set_header("Content-Type", "application/json");
        response.set_header("Access-Control-Allow-Origin", "*");
        return response;
    });
    
    // OPTIONS for CORS preflight
    CROW_ROUTE(app, "/api/reports")
        .methods("OPTIONS"_method)
    ([]() {
        auto response = crow::response(204);
        response.set_header("Access-Control-Allow-Origin", "*");
        response.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.set_header("Access-Control-Allow-Headers", "Content-Type");
        return response;
    });
}
