#include "routes/settings_routes.h"
#include <nlohmann/json.hpp>

using json = nlohmann::json;

void registerSettingsRoutes(crow::SimpleApp& app, Database& db) {
    // GET library settings
    CROW_ROUTE(app, "/api/settings")
        .methods("GET"_method)
    ([&db](const crow::request&) {
        json result = db.executeQuery("SELECT * FROM settings LIMIT 1");
        if (!result.empty() && result.is_array()) {
            auto response = crow::response(result[0].dump());
            response.set_header("Content-Type", "application/json");
            response.set_header("Access-Control-Allow-Origin", "*");
            return response;
        }
        auto response = crow::response(json{{"error", "Settings not found"}}.dump());
        response.set_header("Content-Type", "application/json");
        response.set_header("Access-Control-Allow-Origin", "*");
        return response;
    });
    
    // UPDATE library settings
    CROW_ROUTE(app, "/api/settings")
        .methods("PUT"_method)
    ([&db](const crow::request& req) {
        try {
            json data = json::parse(req.body);
            
            std::stringstream ss;
            ss << "UPDATE settings SET ";
            
            bool first = true;
            if (data.contains("library_name")) {
                if (!first) ss << ", ";
                ss << "library_name = '" << data["library_name"].get<std::string>() << "'";
                first = false;
            }
            if (data.contains("email")) {
                if (!first) ss << ", ";
                ss << "email = '" << data["email"].get<std::string>() << "'";
                first = false;
            }
            if (data.contains("phone")) {
                if (!first) ss << ", ";
                ss << "phone = '" << data["phone"].get<std::string>() << "'";
                first = false;
            }
            if (data.contains("address")) {
                if (!first) ss << ", ";
                ss << "address = '" << data["address"].get<std::string>() << "'";
                first = false;
            }
            if (data.contains("borrow_limit")) {
                if (!first) ss << ", ";
                ss << "borrow_limit = " << data["borrow_limit"].get<int>();
                first = false;
            }
            if (data.contains("borrow_duration_days")) {
                if (!first) ss << ", ";
                ss << "borrow_duration_days = " << data["borrow_duration_days"].get<int>();
                first = false;
            }
            if (data.contains("late_fee_per_day")) {
                if (!first) ss << ", ";
                ss << "late_fee_per_day = " << data["late_fee_per_day"].get<double>();
                first = false;
            }
            if (data.contains("enable_notifications")) {
                if (!first) ss << ", ";
                ss << "enable_notifications = " << (data["enable_notifications"].get<bool>() ? 1 : 0);
                first = false;
            }
            if (data.contains("enable_fine")) {
                if (!first) ss << ", ";
                ss << "enable_fine = " << (data["enable_fine"].get<bool>() ? 1 : 0);
                first = false;
            }
            
            ss << " WHERE id = 1";
            
            if (db.executeUpdate(ss.str())) {
                auto response = crow::response(json{{"message", "Settings updated successfully"}}.dump());
                response.set_header("Content-Type", "application/json");
                response.set_header("Access-Control-Allow-Origin", "*");
                return response;
            }
            auto response = crow::response(500, json{{"error", "Failed to update settings"}}.dump());
            response.set_header("Content-Type", "application/json");
            response.set_header("Access-Control-Allow-Origin", "*");
            return response;
        } catch (const std::exception& e) {
            auto response = crow::response(400, json{{"error", e.what()}}.dump());
            response.set_header("Content-Type", "application/json");
            response.set_header("Access-Control-Allow-Origin", "*");
            return response;
        }
    });
    
    // OPTIONS for CORS preflight
    CROW_ROUTE(app, "/api/settings")
        .methods("OPTIONS"_method)
    ([]() {
        auto response = crow::response(204);
        response.set_header("Access-Control-Allow-Origin", "*");
        response.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.set_header("Access-Control-Allow-Headers", "Content-Type");
        return response;
    });
}
