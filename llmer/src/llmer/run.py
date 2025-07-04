import uuid
import logging
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
    logging_file = "LLMerServicer.log"

    @classmethod
    def get_logger(cls, file_logging: bool = False):
        logger = logging.getLogger(cls.__class__.__name__)
        if not logger.hasHandlers():
            handler = logging.StreamHandler()
            formatter = logging.Formatter(
                "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
            )
            handler.setFormatter(formatter)
            logger.addHandler(handler)
            logger.setLevel(logging.INFO)
            if file_logging:
                file_handler = logging.FileHandler(cls.logging_file)
                file_handler.setFormatter(formatter)
                logger.addHandler(file_handler)

        return logger

    def __init__(self):
        self.sessions = {}
        self.logger = self.get_logger()

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
            self.logger.warning("Trying to send a message to a non-existing session: %s", request.session_id)
            context.set_details("Session not found")
            context.set_code(grpc.StatusCode.NOT_FOUND)
            return Answer(session_id=request.session_id, text="")
        try:
            prompt = f"System instructions: {request.system_prompt}.\nUser question: {request.question_prompt}"
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
