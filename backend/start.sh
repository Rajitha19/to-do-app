#!/bin/bash

# Wait for database to be ready
echo "Waiting for database to be ready..."
until mysqladmin ping -h"database" -u"todouser" -p"todopassword" --silent; do
    echo "Waiting for database connection..."
    sleep 2
done

echo "Database is ready! Running migrations..."

# Run Prisma migrations
npx prisma migrate deploy

echo "Migrations complete! Starting server..."

# Start the application
npm start
