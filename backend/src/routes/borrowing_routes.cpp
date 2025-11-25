#include "crow_all.h"
#include "database/db_connection.h"
#include "models/borrow.h"
#include <nlohmann/json.hpp>

using json = nlohmann::json;

void registerBorrowingRoutes(crow::SimpleApp& app, Database& db) {
    Borrow borrowModel(&db);
    
    // GET all borrow records
    CROW_ROUTE(app, "/api/borrowing")
        .methods("GET"_method)
    ([&borrowModel](const crow::request&) {
        auto result = borrowModel.getAll();
        auto response = crow::response(result.dump());
        response.set_header("Content-Type", "application/json");
        response.set_header("Access-Control-Allow-Origin", "*");
        return response;
    });
    
    // GET borrow record by ID
    CROW_ROUTE(app, "/api/borrowing/<int>")
        .methods("GET"_method)
    ([&borrowModel](const crow::request&, int borrow_id) {
        auto result = borrowModel.getById(borrow_id);
        auto response = crow::response(result.dump());
        response.set_header("Content-Type", "application/json");
        response.set_header("Access-Control-Allow-Origin", "*");
        return response;
    });
    
    // GET borrows by member
    CROW_ROUTE(app, "/api/borrowing/member/<int>")
        .methods("GET"_method)
    ([&borrowModel](const crow::request&, int member_id) {
        auto result = borrowModel.getByMember(member_id);
        auto response = crow::response(result.dump());
        response.set_header("Content-Type", "application/json");
        response.set_header("Access-Control-Allow-Origin", "*");
        return response;
    });
    
    // GET borrows by status
    CROW_ROUTE(app, "/api/borrowing/status/<string>")
        .methods("GET"_method)
    ([&borrowModel](const crow::request&, std::string status) {
        auto result = borrowModel.getByStatus(status);
        auto response = crow::response(result.dump());
        response.set_header("Content-Type", "application/json");
        response.set_header("Access-Control-Allow-Origin", "*");
        return response;
    });
    
    // GET overdue borrows
    CROW_ROUTE(app, "/api/borrowing/overdue")
        .methods("GET"_method)
    ([&borrowModel](const crow::request&) {
        auto result = borrowModel.getOverdue();
        auto response = crow::response(result.dump());
        response.set_header("Content-Type", "application/json");
        response.set_header("Access-Control-Allow-Origin", "*");
        return response;
    });
    
    // CREATE borrow record
    CROW_ROUTE(app, "/api/borrowing")
        .methods("POST"_method)
    ([&borrowModel](const crow::request& req) {
        json data = json::parse(req.body);
        if (borrowModel.create(data)) {
            return crow::response(201, json{{"message", "Borrow record created successfully"}}.dump());
        }
        return crow::response(500, json{{"error", "Failed to create borrow record"}}.dump());
    });
    
    // UPDATE borrow record
    CROW_ROUTE(app, "/api/borrowing/<int>")
        .methods("PUT"_method)
    ([&borrowModel](const crow::request& req, int borrow_id) {
        json data = json::parse(req.body);
        if (borrowModel.update(borrow_id, data)) {
            return crow::response(200, json{{"message", "Borrow record updated successfully"}}.dump());
        }
        return crow::response(500, json{{"error", "Failed to update borrow record"}}.dump());
    });
    
    // Record return
    CROW_ROUTE(app, "/api/borrowing/<int>/return")
        .methods("POST"_method)
    ([&borrowModel](const crow::request&, int borrow_id) {
        if (borrowModel.recordReturn(borrow_id)) {
            return crow::response(200, json{{"message", "Return recorded successfully"}}.dump());
        }
        return crow::response(500, json{{"error", "Failed to record return"}}.dump());
    });
    
    // DELETE borrow record
    CROW_ROUTE(app, "/api/borrowing/<int>")
        .methods("DELETE"_method)
    ([&borrowModel](const crow::request&, int borrow_id) {
        if (borrowModel.deleteBorrow(borrow_id)) {
            return crow::response(200, json{{"message", "Borrow record deleted successfully"}}.dump());
        }
        return crow::response(500, json{{"error", "Failed to delete borrow record"}}.dump());
    });
    
    // OPTIONS for CORS preflight
    CROW_ROUTE(app, "/api/borrowing")
        .methods("OPTIONS"_method)
    ([]() {
        auto response = crow::response(204);
        response.set_header("Access-Control-Allow-Origin", "*");
        response.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.set_header("Access-Control-Allow-Headers", "Content-Type");
        return response;
    });
}
