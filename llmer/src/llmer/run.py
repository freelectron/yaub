import uuid
from concurrent import futures
import grpc
from llmer.grpc.chats_pb2 import StartSessionResponse, Answer
from llmer.grpc.chats_pb2_grpc import (
    LLMChatServiceServicer,
    add_LLMChatServiceServicer_to_server,
)
from llmer.browser.model_session import LLMBrowserSessionOpenAI, ChromeBrowser, get_logger, LLMBrowserSession
from llmer.browser.errors import BrowserUnknownModeError


class LLMerServicer(LLMChatServiceServicer):
    def __init__(self):
        self.browsers = {}
        self.sessions = {}
        self.logger = get_logger(self.__class__.__name__)

    @staticmethod
    def start_llm_session(mode: str, browser: ChromeBrowser) -> LLMBrowserSession:
        if mode == "QuestionAnsweringChatBot":
            return LLMBrowserSessionOpenAI(browser)
        else:
            raise BrowserUnknownModeError(mode)

    def start_browser_llm_session(self, user: str, model: str) -> LLMBrowserSession:
        if user in self.browsers.keys():
            browser = self.browsers[user]
        else:
            browser = ChromeBrowser()
            self.browsers[user] = browser

        return self.start_llm_session(model, browser)

    def StartSession(self, request, context):
        session_id = str(uuid.uuid4())
        self.logger.info("Starting a new %s session with ID: %s for user: %s", request.mode, session_id, request.user)
        try:
            session = self.start_browser_llm_session(request.user, request.mode)
            session.init_chat_session()
            self.sessions[session_id] = session
            return StartSessionResponse(id=session_id)
        except BrowserUnknownModeError as e:
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
