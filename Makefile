
DOCKER_USERNAME := webssja
IMAGE_BASENAME  := ssja
STAGE           := prod16
HOST_PORT       := 3000
CONTAINER_PORT  := 3000


FULL_IMAGE_NAME := $(DOCKER_USERNAME)/$(IMAGE_BASENAME)
IMAGE_TAG       := $(FULL_IMAGE_NAME)-$(STAGE)
CONTAINER_NAME  := $(IMAGE_BASENAME)-$(STAGE)


API_KEY ?= $(shell grep NEXT_PUBLIC_MAPIR_KEY .env.frontend | cut -d '=' -f2)


.DEFAULT_GOAL := help
.PHONY: help build-local run-prod stop exec push-remote pull-remote login

help:
	@echo "Available commands:"
	@echo "  make build-local   -> Build the Docker image on this machine"
	@echo "  make run-prod      -> Stop any existing container and run the new one"
	@echo "  make stop          -> Stop and remove the running container"
	@echo "  make exec          -> Get a shell inside the running container"
	@echo "  make pull-remote   -> Pull the image from Docker Hub"
	@echo "  make push-remote   -> Push the image to Docker Hub"
	@echo "  make login         -> Log in to Docker Hub"

build-local:
	@echo ">>> Building image with API Key..."
	docker build \
		--build-arg NEXT_PUBLIC_MAPIR_KEY=$(API_KEY) \
		-f Dockerfile.prod -t $(IMAGE_TAG) .

run-prod: stop
	@echo "Running container '$(CONTAINER_NAME)' from image '$(IMAGE_TAG)'..."
	docker run --rm -itd --name $(CONTAINER_NAME) \
		--env-file .env.frontend \
		-p $(HOST_PORT):$(CONTAINER_PORT) $(IMAGE_TAG)

stop:
	@echo "Stopping and removing container '$(CONTAINER_NAME)'..."
	@-docker rm $(CONTAINER_NAME) -f 2>/dev/null || true

exec:
	docker exec -it $(CONTAINER_NAME) /bin/sh

push-remote:
	docker push $(IMAGE_TAG)

pull-remote:
	docker pull $(IMAGE_TAG)

login:
	@echo "$(DOCKER_PASSWORD)" | docker login -u "$(DOCKER_USERNAME)" --password-stdin

