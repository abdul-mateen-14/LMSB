#include "routes/books_routes.h"
#include <nlohmann/json.hpp>

using json = nlohmann::json;

void registerBooksRoutes(crow::SimpleApp& app, Database& db) {
    Book bookModel(&db);
    
    // GET all books
    CROW_ROUTE(app, "/api/books")
        .methods("GET"_method)
    ([&bookModel](const crow::request&) {
        auto result = bookModel.getAll();
        auto response = crow::response(result.dump());
        response.set_header("Content-Type", "application/json");
        response.set_header("Access-Control-Allow-Origin", "*");
        return response;
    });
    
    // GET book by ID
    CROW_ROUTE(app, "/api/books/<int>")
        .methods("GET"_method)
    ([&bookModel](const crow::request&, int book_id) {
        auto result = bookModel.getById(book_id);
        auto response = crow::response(result.dump());
        response.set_header("Content-Type", "application/json");
        response.set_header("Access-Control-Allow-Origin", "*");
        return response;
    });
    
    // Search books
    CROW_ROUTE(app, "/api/books/search")
        .methods("GET"_method)
    ([&bookModel](const crow::request& req) {
        std::string query = req.url_params.get("q");
        std::string category = req.url_params.get("category");
        
        auto result = bookModel.search(query ? query : "", category ? category : "");
        auto response = crow::response(result.dump());
        response.set_header("Content-Type", "application/json");
        response.set_header("Access-Control-Allow-Origin", "*");
        return response;
    });
    
    // CREATE book
    CROW_ROUTE(app, "/api/books")
        .methods("POST"_method)
    ([&bookModel](const crow::request& req) {
        auto body = crow::json::load(req.body);
        if (!body) {
            return crow::response(400, json{{"error", "Invalid JSON"}}.dump());
        }
        
        json data = json::parse(req.body);
        if (bookModel.create(data)) {
            return crow::response(201, json{{"message", "Book created successfully"}}.dump());
        }
        return crow::response(500, json{{"error", "Failed to create book"}}.dump());
    });
    
    // UPDATE book
    CROW_ROUTE(app, "/api/books/<int>")
        .methods("PUT"_method)
    ([&bookModel](const crow::request& req, int book_id) {
        json data = json::parse(req.body);
        if (bookModel.update(book_id, data)) {
            return crow::response(200, json{{"message", "Book updated successfully"}}.dump());
        }
        return crow::response(500, json{{"error", "Failed to update book"}}.dump());
    });
    
    // DELETE book
    CROW_ROUTE(app, "/api/books/<int>")
        .methods("DELETE"_method)
    ([&bookModel](const crow::request&, int book_id) {
        if (bookModel.deleteBook(book_id)) {
            return crow::response(200, json{{"message", "Book deleted successfully"}}.dump());
        }
        return crow::response(500, json{{"error", "Failed to delete book"}}.dump());
    });
    
    // OPTIONS for CORS preflight
    CROW_ROUTE(app, "/api/books")
        .methods("OPTIONS"_method)
    ([]() {
        auto response = crow::response(204);
        response.set_header("Access-Control-Allow-Origin", "*");
        response.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.set_header("Access-Control-Allow-Headers", "Content-Type");
        return response;
    });
}
