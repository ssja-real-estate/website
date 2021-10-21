# import config
# you can change the default config with `make cnf="config_special.env" build`
cnf=./app-config.sh

username?= 

# image name 
APP_NAME=$(shell $(cnf) name $(username))

# image version
VERSION=$(shell $(cnf) version)

# port to run the docker container
PORT=$(shell $(cnf) port)

# working directory
WORKDIR=$(shell pwd)

# parent directory
PARENT_DIR=$(shell echo "${PWD}##*/}")

# Dockerfile stage to build(default is set to dev)
stage?=dev

# Complete image tag
IMAGE_TAG="$(APP_NAME)-$(stage):$(VERSION)"

.DEFAULT_GOAL := help
.PHONY: help

# Default target
help: ## help(default)  
	@echo "--------------------------------"
	@echo "Usage: make [OPTIONS] TARGET"
	@echo "Options:"
	@echo "  stage: set Dockerfile stage\n\
				values:(dev, prod)\n\
				(default dev)"
	@echo "Targets:"
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| sed -n 's/^\(.*\): \(.*\)##\(.*\)/\1\3/p' \
		| column -t -s ' '
	@echo "--------------------------------"


# Docker tasks

# Build docker image 
build: ## build-image 
	sudo docker build --target $(stage) -t $(IMAGE_TAG) .

# Run docker container
run: ## run-container 
	sudo docker run --rm -it --name $(APP_NAME) \
		-p $(PORT):$(PORT) -v $(WORKDIR)/src:/app/src:ro \
		--env-file ./.env $(IMAGE_TAG) \
	
# Execute docker container shell
exec: ## execute-container
	sudo docker exec -it $(APP_NAME) bash

# Stop docker container
stop: ## stop-container
	sudo docker rm $(APP_NAME) -f
	
# Remove docker image
rm-image: ## remove-image
	sudo docker rmi $(IMAGE_TAG)


# Docker compose up 
up: down ## docker-compose-up
	sudo docker-compose -f docker-compose.yaml \
		-f docker-compose-$(stage).yaml \
	        --env-file ./.env.docker up -d --build 

# Docker compose down
down: set-env ## docker-compose-down
	sudo docker-compose -f docker-compose.yaml \
		-f docker-compose-$(stage).yaml \
		--env-file ./.env.docker down

# Set environment variables for docker-compose
set-env: ## set-docker-compose-env-variables
	echo "IMAGE_NAME=$(IMAGE_TAG)\nCONTAINER_NAME=$(APP_NAME)"\
	       	> .env.docker

login: ## login-to-docker-hub
	sudo docker login

logout: remove-credentials ## logout-from-docker-hub
	sudo docker logout hub.docker.com
	
remove-credentials: ## remove-docker-registry-credentials
	sudo rm -f /root/.docker/config.json
