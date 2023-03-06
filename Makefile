.SILENT:


# import config
# you can change the default config with `make cnf="config_special.env" build`
cnf=./app-config.sh

username?=sajaweb
password?=

# Dockerfile stage to build(default is set to dev)
stage?=dev

# image name 
IMAGE_NAME=$(shell $(cnf) name $(username))
CONTAINER_NAME="$(shell $(cnf) name)-$(stage)"

# port to run the docker container
PORT=$(shell $(cnf) port)
CONTAINER_PORT=80

# working directory
WORKDIR=$(shell pwd)

# parent directory
PARENT_DIR=$(shell echo "${PWD}##*/}")

# Complete image tag
IMAGE_TAG="$(IMAGE_NAME)-$(stage)"

.DEFAULT_GOAL := help
.PHONY: help build

# Default target
help: ## help(default)  
	echo "--------------------------------"
	echo "Usage: make [OPTIONS] TARGET"
	echo "--------------------------------"
	echo "Options:"
	echo "stage: set Dockerfile stage (dev[default], prod)"
	echo "username: set DockerHub username (sajaweb[default])"
	echo "password: set DockerHub password"
	echo "--------------------------------"
	echo "Targets:"
	grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| sed -n 's/^\(.*\): \(.*\)##\(.*\)/\1\3/p' \
		| column -t -s ' '
	echo "--------------------------------"


# Docker tasks

# Build docker image 
build: ## build-image/params:stage,username
	docker build -f Dockerfile.$(stage) -t $(IMAGE_TAG) .

# Build docker image on local machine
build-local: ## build-local-image/params:stage,username
	docker build -f Dockerfile.$(stage) -t $(CONTAINER_NAME) .

# Run docker container in development mode
run-dev: stop ## run-dev-container 
	docker run --rm -itd --env-file ./.env --name $(CONTAINER_NAME) \
		-p $(PORT):$(CONTAINER_PORT) -v $(WORKDIR)/src:/app/src:ro \
		$(IMAGE_TAG) 

# Run docker container in production mode
run-prod: stop ## run-prod-container 
	docker run --rm -itd --env-file ./.env --name $(CONTAINER_NAME) \
		-p $(PORT):$(CONTAINER_PORT) $(IMAGE_TAG) 

# Run docker container locally in development mode
run-local-dev: stop-local ## run-dev-container-locally
	docker run --rm -it --env-file ./.env --name $(CONTAINER_NAME) \
		-p $(PORT):$(CONTAINER_PORT) -v $(WORKDIR)/src:/app/src \
		$(CONTAINER_NAME):latest

# Run docker container locally in production mode
run-local-prod: stop-local ## run-prod-container-locally
	docker run --rm -itd --env-file ./.env --name $(CONTAINER_NAME) \
		-p $(PORT):$(CONTAINER_PORT) $(CONTAINER_NAME):latest
	
# Execute docker container shell
exec: ## execute-container
	docker exec -it $(CONTAINER_NAME) bash

# Execute local docker container shell
exec-local: ## execute-local-container
	docker exec -it $(CONTAINER_NAME) bash

# Stop the docker container
stop: ## stop-container
	docker rm $(CONTAINER_NAME) -f

# Stop the local docker container
stop-local: ## stop-local-container
	docker rm $(CONTAINER_NAME) -f

# Remove docker image
rm-image: ## remove-image
	docker rmi $(IMAGE_TAG)

# Remove local docker image
rm-local-image: ## remove-local-image
	docker rmi $(CONTAINER_NAME)

login: set-password ## login-to-docker-hub/params:username,password
	cat pass | docker login -u $(username) --password-stdin
	rm -f pass

set-password: ## set-password
	touch pass
	echo $(password) > pass

logout: ## logout-from-docker-hub
	docker logout

push: ## push-docker-image-to-registry/params:stage,username
	docker push $(IMAGE_TAG)

push-local: ## push-local-docker-image-to-registry
	docker push $(CONTAINER_NAME)

pull: ## pull-docker-image-from-registry
	docker pull $(IMAGE_TAG)

pull-local: ## pull-local-docker-image-from-registry
	docker pull $(CONTAINER_NAME)



