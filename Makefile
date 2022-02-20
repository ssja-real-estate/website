.SILENT:

# import config
# you can change the default config with `make cnf="config_special.env" build`
cnf=./app-config.sh

username?=sajaweb
password?=
map_key?=
name?=

# image name 
IMAGE_NAME=$(shell $(cnf) name $(username))
CONTAINER_NAME=$(shell $(cnf) name)

# port to run the docker container
PORT=$(shell $(cnf) port)
CONTAINER_PORT=80

# working directory
WORKDIR=$(shell pwd)

# parent directory
PARENT_DIR=$(shell echo "${PWD}##*/}")

# Dockerfile stage to build(default is set to dev)
stage?=dev

# Complete image tag
IMAGE_TAG="$(IMAGE_NAME)-$(stage)"

.DEFAULT_GOAL := help
.PHONY: help build

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
	docker build --build-arg MAP_API_KEY=$(map_key) APP_NAME=$(name) 
				 -f Dockerfile.$(stage) -t $(IMAGE_TAG) .

# Build docker image on local machine
build-local: ## build-local-image
	docker build -f Dockerfile.$(stage) -t $(CONTAINER_NAME) .


# Run docker container
run: stop ## run-container 
	docker run --rm -itd --name $(CONTAINER_NAME) \
		-p $(PORT):$(CONTAINER_PORT) -v $(WORKDIR)/src:/app/src:ro \
		$(IMAGE_TAG) \

# Run docker container locally
run-local: stop-local ## run-container-locally
	docker run --rm -it --name $(CONTAINER_NAME) \
		-p $(PORT):$(CONTAINER_PORT) -v $(WORKDIR)/src:/app/src \
		$(CONTAINER_NAME):latest

# Execute local docker container shell
exec-local: ## execute-local-container
	docker exec -it $(CONTAINER_NAME) bash

# Execute docker container shell
exec: ## execute-container
	docker exec -it $(CONTAINER_NAME) bash

# Stop the local docker container
stop-local: ## stop-local-container
	docker rm $(CONTAINER_NAME) -f

# Stop the docker container
stop: ## stop-container
	docker rm $(CONTAINER_NAME) -f

# Remove docker image
rm-image: ## remove-image
	docker rmi $(IMAGE_TAG)

# Remove local docker image
rm-local-image: ## remove-local-image
	docker rmi $(CONTAINER_NAME)

login: set-password ## login-to-docker-hub
	cat pass | docker login -u $(username) --password-stdin
	rm -f pass

set-password: ## set-password
	touch pass
	echo $(password) > pass

logout: ## logout-from-docker-hub
	docker logout

push: ## push-docker-image-to-registry
	docker push $(IMAGE_TAG)

pull: ## pull-docker-image-from-registry
	docker pull $(IMAGE_TAG)
