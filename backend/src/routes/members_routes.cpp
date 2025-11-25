#include "crow_all.h"
#include "database/db_connection.h"
#include "models/member.h"
#include <nlohmann/json.hpp>

using json = nlohmann::json;

void registerMembersRoutes(crow::SimpleApp& app, Database& db) {
    Member memberModel(&db);
    
    // GET all members
    CROW_ROUTE(app, "/api/members")
        .methods("GET"_method)
    ([&memberModel](const crow::request&) {
        auto result = memberModel.getAll();
        auto response = crow::response(result.dump());
        response.set_header("Content-Type", "application/json");
        response.set_header("Access-Control-Allow-Origin", "*");
        return response;
    });
    
    // GET member by ID
    CROW_ROUTE(app, "/api/members/<int>")
        .methods("GET"_method)
    ([&memberModel](const crow::request&, int member_id) {
        auto result = memberModel.getById(member_id);
        auto response = crow::response(result.dump());
        response.set_header("Content-Type", "application/json");
        response.set_header("Access-Control-Allow-Origin", "*");
        return response;
    });
    
    // Search members
    CROW_ROUTE(app, "/api/members/search")
        .methods("GET"_method)
    ([&memberModel](const crow::request& req) {
        std::string query = req.url_params.get("q");
        
        auto result = memberModel.search(query ? query : "");
        auto response = crow::response(result.dump());
        response.set_header("Content-Type", "application/json");
        response.set_header("Access-Control-Allow-Origin", "*");
        return response;
    });
    
    // Filter by status
    CROW_ROUTE(app, "/api/members/status/<string>")
        .methods("GET"_method)
    ([&memberModel](const crow::request&, std::string status) {
        auto result = memberModel.filterByStatus(status);
        auto response = crow::response(result.dump());
        response.set_header("Content-Type", "application/json");
        response.set_header("Access-Control-Allow-Origin", "*");
        return response;
    });
    
    // Get member statistics
    CROW_ROUTE(app, "/api/members/<int>/stats")
        .methods("GET"_method)
    ([&memberModel](const crow::request&, int member_id) {
        auto result = memberModel.getMemberStats(member_id);
        auto response = crow::response(result.dump());
        response.set_header("Content-Type", "application/json");
        response.set_header("Access-Control-Allow-Origin", "*");
        return response;
    });
    
    // CREATE member
    CROW_ROUTE(app, "/api/members")
        .methods("POST"_method)
    ([&memberModel](const crow::request& req) {
        json data = json::parse(req.body);
        if (memberModel.create(data)) {
            return crow::response(201, json{{"message", "Member created successfully"}}.dump());
        }
        return crow::response(500, json{{"error", "Failed to create member"}}.dump());
    });
    
    // UPDATE member
    CROW_ROUTE(app, "/api/members/<int>")
        .methods("PUT"_method)
    ([&memberModel](const crow::request& req, int member_id) {
        json data = json::parse(req.body);
        if (memberModel.update(member_id, data)) {
            return crow::response(200, json{{"message", "Member updated successfully"}}.dump());
        }
        return crow::response(500, json{{"error", "Failed to update member"}}.dump());
    });
    
    // DELETE member
    CROW_ROUTE(app, "/api/members/<int>")
        .methods("DELETE"_method)
    ([&memberModel](const crow::request&, int member_id) {
        if (memberModel.deleteMember(member_id)) {
            return crow::response(200, json{{"message", "Member deleted successfully"}}.dump());
        }
        return crow::response(500, json{{"error", "Failed to delete member"}}.dump());
    });
    
    // OPTIONS for CORS preflight
    CROW_ROUTE(app, "/api/members")
        .methods("OPTIONS"_method)
    ([]() {
        auto response = crow::response(204);
        response.set_header("Access-Control-Allow-Origin", "*");
        response.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.set_header("Access-Control-Allow-Headers", "Content-Type");
        return response;
    });
}
