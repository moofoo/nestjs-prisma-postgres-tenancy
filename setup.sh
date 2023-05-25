#!/bin/bash

docker pull node:20.2.0-alpine3.17

docker pull nginx:1.23.4-alpine3.17

docker pull postgres:15.3-alpine3.17

docker pull mcr.microsoft.com/playwright:v1.34.1-jammy

docker volume create tenancy_example_db_data

docker network create tenancy_example_network

docker image build -f dockerfiles/Dockerfile.node -t custom-node:latest dockerfiles

docker compose up -d db

yarn

yarn workspace prismaclient local

yarn workspace session-opts build

yarn

docker compose build frontend backend

docker compose stop