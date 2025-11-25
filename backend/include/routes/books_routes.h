#ifndef BOOKS_ROUTES_H
#define BOOKS_ROUTES_H

#include "crow_all.h"
#include "database/db_connection.h"
#include "models/book.h"

void registerBooksRoutes(crow::SimpleApp& app, Database& db);

#endif // BOOKS_ROUTES_H
