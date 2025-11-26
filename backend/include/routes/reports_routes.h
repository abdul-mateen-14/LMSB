#ifndef REPORTS_ROUTES_H
#define REPORTS_ROUTES_H

#include "crow_all.h"
#include "database/db_connection.h"
#include "models/borrow.h"

void registerReportsRoutes(crow::SimpleApp& app, Database& db);

#endif // REPORTS_ROUTES_H
