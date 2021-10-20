# import config
# you can change the default config with `make cnf="config_special.env" build`
cnf=./docker-config.sh

# image tag
username?= 
IMAGE_TAG=$(shell $(cnf) tag $(username))

# container name
CONTAINER_NAME=$(shell $(cnf) name)

# port to run the docker container
PORT=$(shell $(cnf) port)

# working directory
WORKDIR=$(shell pwd)

# Dockerfile stage to build(default is set to dev)
stage?=dev

.DEFAULT_GOAL := help
.PHONY: help

# Default target
help: ## help  
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| sed -n 's/^\(.*\): \(.*\)##\(.*\)/\1\3/p' \
		| column -t -s ' '

# Docker tasks

# Build docker image 
build: ## build-image 
	sudo docker build --target $(stage) -t $(IMAGE_TAG) .

# Run docker container
run: ## run-container 
	sudo docker run --rm -it --name $(CONTAINER_NAME) \
		-p $(PORT):$(PORT) -v $(WORKDIR)/src:/app/src \
		--env-file ./.env $(IMAGE_TAG) \
	
# Execute docker container shell
exec: ## execute-container
	sudo docker exec -it $(CONTAINER_NAME) bash

# Stop docker container
stop: ## stop-container
	sudo docker stop $(CONTAINER_NAME)
