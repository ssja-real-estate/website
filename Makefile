.SILENT:

# import config
# you can change the default config with `make cnf="config_special.env" build`
cnf=./app-config.sh

username?=webssja
password?=

# Dockerfile stage to build(default is set to prod)
stage?=prod1

# image name 
REMOTE_IMAGE_NAME=$(shell $(cnf) name $(username))
LOCAL_IMAGE_NAME=$(shell $(cnf) name)
CONTAINER_NAME="$(LOCAL_IMAGE_NAME)-$(stage)"

# port to run the docker container
PORT=$(shell $(cnf) port)
CONTAINER_PORT=80

# working directory
WORKDIR=$(shell pwd)

# parent directory
PARENT_DIR=$(shell echo "${PWD}##*/}")

# Complete image tag
REMOTE_IMAGE_TAG="$(REMOTE_IMAGE_NAME)-$(stage)"
LOCAL_IMAGE_TAG="$(LOCAL_IMAGE_NAME)-$(stage)"

.DEFAULT_GOAL := help
.PHONY: help

# Default target
help: ## help(default)  
	echo "--------------------------------"
	echo "Usage: make [OPTIONS] TARGET"
	echo "--------------------------------"
	echo "Options:"
	echo "stage: set Dockerfile stage (prod[default], dev(currently not available))"
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
build-remote: ## build-remote-image/params:stage,username
	docker build -f Dockerfile.prod -t $(REMOTE_IMAGE_TAG) .

# Build docker image on local machine
build-local: ## build-local-image/params:stage
	docker build -f Dockerfile.prod -t $(CONTAINER_NAME) .

# Run docker container in development mode
run-remote-dev: stop ## run-remote-dev-container/params:stage,username 
	docker run --rm -itd --name $(CONTAINER_NAME) \
		-p $(PORT):$(CONTAINER_PORT) -v $(WORKDIR)/src:/app \
		$(REMOTE_IMAGE_TAG) 

# Run docker container in production mode
run-remote-prod: stop ## run-remote-prod-container/params:stage,username
	docker run --rm -itd --name $(CONTAINER_NAME) \
		-p $(PORT):$(CONTAINER_PORT) $(REMOTE_IMAGE_TAG) 

# Run docker container locally in development mode
run-local-dev: stop-local ## run-local-dev-container/params:stage
	docker run --rm -it --name $(CONTAINER_NAME) \
		-p $(PORT):$(CONTAINER_PORT) -v $(WORKDIR)/src:/app/src \
		$(LOCAL_IMAGE_TAG):latest

# Run docker container locally in production mode
run-local-prod: stop-local ## run-prod-container-locally
	docker run --rm -itd --name $(CONTAINER_NAME) \
		-p $(PORT):$(CONTAINER_PORT) $(LOCAL_IMAGE_TAG):latest
	
# Execute docker container shell
exec: ## execute-container/params:stage
	docker exec -it $(CONTAINER_NAME) bash

# Stop the docker container
stop: ## stop-container/params:stage
	docker rm $(CONTAINER_NAME) -f

# Remove docker image
rm-remote-image: ## remove-remote-image/params:stage,username
	docker rmi $(REMOTE_IMAGE_TAG)

# Remove local docker image
rm-local-image: ## remove-local-image/params:stage
	docker rmi $(LOCAL_IMAGE_TAG)

login: set-password ## login-to-docker-hub/params:username,password
	cat pass | docker login -u $(username) --password-stdin
	rm -f pass

set-password: ## set-password
	touch pass
	echo $(password) > pass

logout: ## logout-from-docker-hub
	docker logout

push-remote: ## push-remote-image-to-registry/params:stage,username
	docker push $(REMOTE_IMAGE_TAG)

pull-remote: ## pull-remote-image-from-registry/params:stage,username
	docker pull $(REMOTE_IMAGE_TAG)
