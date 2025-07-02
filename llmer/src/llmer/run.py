import uuid
from concurrent import futures
import grpc
from llmer.grpc.chats_pb2 import StartSessionResponse, Answer
from llmer.grpc.chats_pb2_grpc import (
    LLMChatServiceServicer,
    add_LLMChatServiceServicer_to_server,
)
from llmer.browser.model_session import LLMBrowserSessionOpenAI, LLMChromeSession
from llmer.browser.errors import BrowserUnknownModelError


class LLMerServicer(LLMChatServiceServicer):
    def __init__(self):
        self.sessions = {}

    @staticmethod
    def start_session(model: str) -> LLMChromeSession:
        if model == "ChatGPT":
            return LLMBrowserSessionOpenAI()
        else:
            raise BrowserUnknownModelError(model)

    def StartSession(self, request, context):
        session_id = str(uuid.uuid4())
        try:
            session = self.start_session(request.model)
            session.init_chat_session()
            self.sessions[session_id] = session
            return StartSessionResponse(id=session_id)
        except BrowserUnknownModelError as e:
            context.set_details(str(e))
            context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
            return StartSessionResponse(id="")
        except Exception as e:
            context.set_details(str(e))
            context.set_code(grpc.StatusCode.INTERNAL)
            return StartSessionResponse(id="")

    def SendMessage(self, request, context):
        session = self.sessions.get(request.session_id)
        if not session:
            context.set_details("Session not found")
            context.set_code(grpc.StatusCode.NOT_FOUND)
            return Answer(session_id=request.session_id, text="")
        try:
            prompt = request.system_prompt + "\n" + request.question_prompt
            answer = session.send_message(prompt)
            return Answer(session_id=request.session_id, text=answer)
        except Exception as e:
            context.set_details(str(e))
            context.set_code(grpc.StatusCode.INTERNAL)
            return Answer(session_id=request.session_id, text="")


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=9))
    add_LLMChatServiceServicer_to_server(LLMerServicer(), server)
    server.add_insecure_port("0.0.0.0:50051")
    server.start()
    print("gRPC server started on port 50051")
    server.wait_for_termination()


if __name__ == "__main__":
    serve()
