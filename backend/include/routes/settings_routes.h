#ifndef SETTINGS_ROUTES_H
#define SETTINGS_ROUTES_H

#include "crow_all.h"
#include "database/db_connection.h"

void registerSettingsRoutes(crow::SimpleApp& app, Database& db);

#endif // SETTINGS_ROUTES_H
