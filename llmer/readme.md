# LLM Interactions handler

## GRPC Server 


```bash
python -m grpc_tools.protoc -I ../proto --python_out=. --pyi_out=./src/grpc --grpc_python_out=. ../proto/chats.proto
```

## Run the server

Install poetry.

```bash 
make poetry.run
```