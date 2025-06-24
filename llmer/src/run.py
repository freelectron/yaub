from time import sleep
from concurrent import futures

import grpc
from llmer.src.grpc.chats_pb2 import StartSessionRequest, StartSessionResponse
from llmer.src.grpc.chats_pb2_grpc import LLMChatService, add_LLMChatServiceServicer_to_server

class LLMer(LLMChatService):
    def ProcessText(self, request: StartSessionRequest, context):
        return StartSessionResponse(ack="Session started successfully")

def serveLLMer():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    add_LLMChatServiceServicer_to_server(LLMer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    server.wait_for_termination()

def main():
    serveLLMer()

if __name__ == "__main__":
    main()
    while True:
        sleep(1)

