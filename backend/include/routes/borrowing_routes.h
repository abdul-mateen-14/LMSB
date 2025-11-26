#ifndef BORROWING_ROUTES_H
#define BORROWING_ROUTES_H

#include "crow_all.h"
#include "database/db_connection.h"
#include "models/borrow.h"

void registerBorrowingRoutes(crow::SimpleApp& app, Database& db);

#endif // BORROWING_ROUTES_H
