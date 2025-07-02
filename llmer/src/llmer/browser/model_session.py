"""
ToDo:
 1. Split this file into two:
     - one with implementation of the chrome session
     - another with the model session (e.g., deepseek, llama, deepseek and etc)
"""

import os
from abc import abstractmethod, ABC
from time import sleep, time

import undetected as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys

from llmer.browser.errors import BrowserTimeOutError


class LLMChromeSession(ABC):
    """Abstract base class for browser"""

    waiter_default_timeout = 1
    logging_file = "llm_browser_session_base.log"
    past_questions_answers = list()

    @staticmethod
    def wait(seconds: int = 1):
        sleep(seconds)

    @staticmethod
    def get_default_options():
        """Return default Chrome options."""
        options = uc.ChromeOptions()
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-blink-features=AutomationControlled")
        return options

    def get_logger(self, file_logging: bool = False):
        """Return a logger instance."""
        import logging

        logger = logging.getLogger(self.__class__.__name__)
        if not logger.hasHandlers():
            handler = logging.StreamHandler()
            formatter = logging.Formatter(
                "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
            )
            handler.setFormatter(formatter)
            logger.addHandler(handler)
            logger.setLevel(logging.INFO)
            if file_logging:
                file_handler = logging.FileHandler(self.logging_file)
                file_handler.setFormatter(formatter)
                logger.addHandler(file_handler)

        return logger

    def __init__(self, options: uc.ChromeOptions = None):
        self.logger = self.get_logger()
        self.options = options if options else self.get_default_options()
        self.driver = uc.Chrome(options=self.options)
        self.waiter = WebDriverWait(self.driver, self.waiter_default_timeout)

    @abstractmethod
    def init_chat_session(self):
        """Initialize the browser."""
        pass

    @abstractmethod
    def send_message(self, message: str):
        """Send a message to ChatGPT."""
        pass


class LLMBrowserSessionOpenAI(LLMChromeSession):
    waiter_default_timeout = 1
    logging_file = "llm_browser_session_openai.log"
    llm_chat_url = "https://chat.openai.com/chat"
    past_questions_answers = None

    def _retrieve_last_answer(self, time_out: int = 25):
        start_time = time()
        last_answer = ""
        while True:
            answer = self.waiter.until(
                EC.presence_of_all_elements_located(
                    (By.CSS_SELECTOR, "div[data-message-author-role='assistant']")
                )
            )[-1]
            if len(answer.text) > len(last_answer):
                last_answer = answer.text
            elif len(answer.text) == len(last_answer):
                break
            else:
                if time() - start_time > time_out:
                    break
            sleep(1)

        return last_answer

    def _validate_start_page_loaded(self, n_tries: int = 2):
        for i in range(n_tries):
            self.logger.info(
                f"Checking {i+1} if the LLM's start browser page is loaded."
            )
            html_source = self.driver.page_source
            if 'content="ChatGPT"><meta' in html_source:
                return
            else:
                self.wait(15)

        raise BrowserTimeOutError(
            "Failed to start chat session. Page did not load correctly."
        )

    def _validate_message_sent(self, n_tries: int = 2):
        for i in range(n_tries):
            # ToDo: use a datastruct to access the answer attribute
            last_answer_memory = (
                self.past_questions_answers[-1]["answer"]
                if self.past_questions_answers
                else ""
            )
            last_answer_on_page = self._retrieve_last_answer()
            if last_answer_memory == last_answer_on_page or last_answer_on_page == "":
                raise BrowserTimeOutError("No new response from LLM")
            else:
                return last_answer_on_page

        raise ValueError(
            "Could not retrieve the new response or it was the same as the last one."
        )

    def init_chat_session(self):
        """Initialize the Chrome browser."""
        self.driver.get(self.llm_chat_url)
        self.wait()

        self._validate_start_page_loaded()
        self.past_questions_answers = list()

    def send_message(self, message: str):
        """Send a message to ChatGPT."""
        editor_div = self.waiter.until(
            EC.element_to_be_clickable((By.ID, "prompt-textarea"))
        )
        editor_div.click()
        editor_div.send_keys(message)
        editor_div.send_keys(Keys.ENTER)
        self.wait(5)

        answer = self._validate_message_sent()
        # ToDo: create a datastruct for this
        self.past_questions_answers.append({"message": message, "answer": answer})

        return answer


if __name__ == "__main__":
    open_ai = LLMBrowserSessionOpenAI()
    try:
        open_ai.init_chat_session()
        open_ai.send_message("What is your context length?")
        print(open_ai.past_questions_answers[-1])
        open_ai.send_message(
            "How can I send a message to you that is more than 120k tokens?"
        )
        print(open_ai.past_questions_answers[-1])
        open_ai.send_message(
            "Explain advanced techniques and best practices for error handling in python 3.13."
        )
        print(open_ai.past_questions_answers[-1])
    except Exception as e:
        print(f"An error occurred: {e}")

    sleep(360)
