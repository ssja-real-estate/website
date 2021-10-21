.SILENT:

# import config
# you can change the default config with `make cnf="config_special.env" build`
cnf=./app-config.sh

username?= 
pass?=

# image name 
IMAGE_NAME=$(shell $(cnf) name $(username))
CONTAINER_NAME=$(shell $(cnf) name)

# port to run the docker container
PORT=$(shell $(cnf) port)

# working directory
WORKDIR=$(shell pwd)

# parent directory
PARENT_DIR=$(shell echo "${PWD}##*/}")

# Dockerfile stage to build(default is set to dev)
stage?=dev

# Complete image tag
IMAGE_TAG="$(IMAGE_NAME)-$(stage)"

.DEFAULT_GOAL := help
.PHONY: help

# Default target
help: ## help(default)  
	echo "--------------------------------"
	echo "Usage: make [OPTIONS] TARGET"
	echo "Options:"
	echo "  stage: set Dockerfile stage\n\
				values:(dev, prod)\n\
				(default dev)"
	echo "Targets:"
	grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| sed -n 's/^\(.*\): \(.*\)##\(.*\)/\1\3/p' \
		| column -t -s ' '
	echo "--------------------------------"


# Docker tasks

# Build docker image 
build: ## build-image 
	docker build -f Dockerfile.$(stage) -t $(IMAGE_TAG) .

# Run docker container
run: ## run-container 
	docker run --rm -it --name $(CONTAINER_NAME) \
		-p $(PORT):$(PORT) -v $(WORKDIR)/src:/app/src:ro \
		--env-file ./.env $(IMAGE_TAG) \
	
# Execute docker container shell
exec: ## execute-container
	docker exec -it $(CONTAINER_NAME) bash

# Stop docker container
stop: ## stop-container
	docker rm $(CONTAINER_NAME) -f
	
# Remove docker image
rm-image: ## remove-image
	docker rmi $(IMAGE_TAG)


# Docker compose up 
up: down ## docker-compose-up
	docker-compose -f docker-compose.yaml \
		-f docker-compose-$(stage).yaml \
	        --env-file ./.env.docker up -d --build

# Docker compose down
down: set-env ## docker-compose-down
	docker-compose -f docker-compose.yaml \
		-f docker-compose-$(stage).yaml \
		--env-file ./.env.docker down

# Set environment variables for docker-compose
set-env: ## set-docker-compose-env-variables
	echo "IMAGE_NAME=$(IMAGE_TAG)\nCONTAINER_NAME=$(CONTAINER_NAME)"\
	       	> .env.docker

login: set-pass ## login-to-docker-hub
	cat pass | docker login -u $(username) --password-stdin
	rm -f pass

set-pass: ## set-password
	touch pass
	echo $(pass) > pass

logout: ## logout-from-docker-hub
	docker logout
	
push: ## push-docker-image-to-registry
	docker push $(IMAGE_TAG)

pull: ## pull-docker-image-from-registry
	docker pull $(IMAGE_TAG)
