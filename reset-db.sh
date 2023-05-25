#!/bin/bash

docker compose kill db 
docker compose rm -f db
docker volume rm tenancy_example_db_data
docker volume create tenancy_example_db_data
docker compose up -d db
sleep 5
docker compose restart