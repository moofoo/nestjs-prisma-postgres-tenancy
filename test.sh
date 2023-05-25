#!/bin/bash

# Description
#     bind mounts project root to /app in container
#     sets working directory to /app
#     sets network to 'tenancy_example_network'
#     sets IPC to 'host'
#     '--rm' flag means container is removed after it finishes command
#     runs 'yarn workspace frontend test' in container

docker run -v .:/app -w /app --network tenancy_example_network --ipc=host --rm mcr.microsoft.com/playwright:v1.34.1-jammy /bin/bash -c "yarn workspace frontend test"