#!/opt/homebrew/bin/bash

# Update all the related grpc stubs related to the proto files
# Run from proto directory

protoc --go_out=. --go-grpc_out=. chats.proto

python -m grpc_tools.protoc -I . --python_out=. --pyi_out=. --grpc_python_out=. chats.proto
