#!/bin/bash

# Stop and remove all services
docker compose down

# Rebuild the services
docker compose build

# Start the services
docker compose up
