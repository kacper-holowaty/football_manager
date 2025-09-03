#!/bin/bash

# Exit on any error
set -e

# Wait for the database to be ready
echo "Waiting for PostgreSQL to start..."
DB_HOST=$(echo "${SPRING_DATASOURCE_URL}" | awk -F'[/:]' '{print $5}')
DB_PORT=$(echo "${SPRING_DATASOURCE_URL}" | awk -F'[:/]' '{print $6}')
DB_NAME=$(echo "${SPRING_DATASOURCE_URL}" | awk -F'/' '{print $NF}')

until PGPASSWORD="${SPRING_DATASOURCE_PASSWORD}" pg_isready -h "${DB_HOST}" -p "${DB_PORT}" -U "${SPRING_DATASOURCE_USERNAME}" -d "${DB_NAME}"; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done
echo "PostgreSQL is up - executing command"

# Build the application if not already built
if [ ! -f /app/target/*.jar ]; then
    echo "Building application..."
    mvn clean package -DskipTests
fi

# Start the Spring Boot application in the background
echo "Starting Spring Boot application..."
java -jar /app/target/*.jar &
SPRING_PID=$!

# Give Hibernate some time to create the schema
echo "Waiting for Hibernate to create schema..."
sleep 20 # Adjust this delay if needed

# Check if the 'users' table exists and is empty, then run data.sql
echo "Checking database and running data.sql if needed..."
if PGPASSWORD="${SPRING_DATASOURCE_PASSWORD}" psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${SPRING_DATASOURCE_USERNAME}" -d "${DB_NAME}" -tAc "SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users';" | grep -q 1; then
  if ! PGPASSWORD="${SPRING_DATASOURCE_PASSWORD}" psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${SPRING_DATASOURCE_USERNAME}" -d "${DB_NAME}" -tAc "SELECT 1 FROM users LIMIT 1;" | grep -q 1; then
    echo "Users table exists and is empty. Running data.sql..."
    PGPASSWORD="${SPRING_DATASOURCE_PASSWORD}" psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${SPRING_DATASOURCE_USERNAME}" -d "${DB_NAME}" -f /app/database/data.sql
    echo "Data initialization completed."
  else
    echo "Users table exists and is not empty. Skipping data.sql."
  fi
else
  echo "Users table does not exist. Skipping data.sql."
fi

echo "Setup completed. Application is running."

# Wait for the background Spring Boot process to finish
wait $SPRING_PID