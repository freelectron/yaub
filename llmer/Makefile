.PHONY: requirements docker

requirements:
	poetry export -f requirements.txt --output requirements.txt --without-hashes

docker.build: requirements
	docker build -f llmer/Dockerfile -t llmer-grpc-server .