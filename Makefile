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


run: ## run-container 
	sudo docker run --rm --env-file ./.env -idp $(PORT):$(PORT) \
		--name $(CONTAINER_NAME) $(IMAGE_TAG)	
	
exec: ## execute-container
	sudo docker exec -it $(CONTAINER_NAME) bash
