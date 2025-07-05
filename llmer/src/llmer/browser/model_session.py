import os
from abc import abstractmethod, ABC
from time import sleep, time
import logging
from typing import Any, Dict

import undetected as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys

from llmer.browser.errors import BrowserTimeOutError, BrowserStayLoggedOutFailed

def get_logger(name:str, logging_file: str = None) -> logging.Logger:
    logger = logging.getLogger(name)
    if not logger.hasHandlers():
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)
        if logging_file:
            file_handler = logging.FileHandler(logging_file)
            file_handler.setFormatter(formatter)
            logger.addHandler(file_handler)

    return logger

class ChromeBrowser:
    """Abstract base class for browser"""
    waiter_default_timeout = 1
    logging_file = "llm_browser_session_base.log"
    past_questions_answers = list()
    chrome_user_data_dir = os.getenv("CHROME_USER_DATA_DIR", "~/Library/Application Support/Google/Chrome")
    default_profile_directory_name = os.getenv("CHROME_PROFILE_DIRECTORY_NAME", "Profile 1")
    # Mapping from tabs tittle to their window handles
    opened_tabs: Dict[str, Any] = {}

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

    def __init__(self, profile: str):
        self.logger = get_logger(name=self.__class__.__name__)
        self.options = self.get_default_options()
        self.profile = profile if profile else self.default_profile_directory_name
        self.driver = uc.Chrome(
            options=self.options,
            user_data_dir=os.path.join(self.chrome_user_data_dir, self.profile)
        )
        self.waiter = WebDriverWait(self.driver, self.waiter_default_timeout)

class LLMBrowserSession(ABC):
    """Abstract base class for LLM browser session."""
    def __init__(self, chrome_browser: ChromeBrowser):
        self.logger = get_logger(name=self.__class__.__name__)
        self.browser = chrome_browser

    @abstractmethod
    def init_chat_session(self):
        """Initialize the chat session."""
        pass

    @abstractmethod
    def send_message(self, message: str):
        """Send a message to the LLM."""
        pass

    @abstractmethod
    def pass_checks(self):
        """Many LLM providers have some sort of pop-ups or checks to see if you want to log in or if you are a bot:"""
        pass

class LLMBrowserSessionOpenAI(LLMBrowserSession):
    waiter_default_timeout = 1
    logging_file = "llm_browser_session_openai.log"
    llm_chat_url = "https://chat.openai.com/chat"
    past_questions_answers = None

    def __init__(self, chrome_browser: ChromeBrowser):
        super().__init__(chrome_browser)

    def _retrieve_last_answer(self, time_out: int = 25):
        start_time = time()
        last_answer = ""
        while True:
            answer = self.browser.waiter.until(
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
            html_source = self.browser.driver.page_source
            if 'content="ChatGPT"><meta' in html_source:
                return
            else:
                self.browser.wait(15)

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
        # if there is already a tab with an open ChatGPT session, it needs to be used
        if "ChatGPT" not in self.browser.opened_tabs.keys():
            self.browser.driver.execute_script(f"window.open('{self.llm_chat_url}');")
            windows = self.browser.driver.window_handles
            self.browser.opened_tabs["ChatGPT"] = windows[-1]
            self.browser.driver.switch_to.window(self.browser.opened_tabs["ChatGPT"])

        self.browser.driver.switch_to.window(self.browser.opened_tabs["ChatGPT"])
        self.browser.wait()
        self._validate_start_page_loaded()

        self.past_questions_answers = list()

    def send_message(self, message: str):
        """Send a message to ChatGPT."""
        editor_div = self.browser.waiter.until(
            EC.element_to_be_clickable((By.ID, "prompt-textarea"))
        )
        editor_div.click()
        for i, line in enumerate(message.split('\n')):
            if i > 0:
                editor_div.send_keys(Keys.SHIFT, Keys.ENTER)
            editor_div.send_keys(line)
        editor_div.send_keys(Keys.ENTER)
        self.browser.wait(5)

        answer = self._validate_message_sent()
        # ToDo: create a datastruct for this
        self.past_questions_answers.append({"message": message, "answer": answer})

        # ToDo: see if this is robust
        if "Stay logged out" in self.browser.driver.page_source:
            self.logger.warning("'Stay logged out' link found. Clicking it..")
            self.pass_checks()

        return answer

    def pass_checks(self):
        """ Click 'Stay logged out' link that needs to be clicked or something of this sort"""
        try:
            stay_logged_out_link = self.browser.waiter.until(
                EC.element_to_be_clickable((By.LINK_TEXT, "Stay logged out"))
            )
            stay_logged_out_link.click()
        except Exception as e:
            raise BrowserStayLoggedOutFailed(e.__str__())


if __name__ == "__main__":
    chrome_browser = ChromeBrowser()
    open_ai = LLMBrowserSessionOpenAI(chrome_browser)
    try:
        open_ai.init_chat_session()
        open_ai.send_message("What is your context length?")
        print(open_ai.past_questions_answers[-1])
        open_ai.init_chat_session()
        open_ai.send_message("How much do you weigh??")
        print(open_ai.past_questions_answers[-1])
    except Exception as e:
        print(f"An error occurred: {e}")

    sleep(360)
