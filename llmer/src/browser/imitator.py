from abc import abstractmethod, ABC
from http.client import responses
from time import sleep
from xml.dom import VALIDATION_ERR

import undetected as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys


class LLMChromeSession(ABC):
    """Abstract base class for browser"""
    waiter_default_timeout = 1
    logging_file = "llm_browser_session_base.log"

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
            formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
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
    def pass_captcha(self):
        """Handle CAPTCHA if present."""
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

    def _retrieve_last_answer(self):
        return self.waiter.until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, "div[data-message-author-role='assistant']"))
        )[-1].text

    def _validate_start_page_loaded(self, n_tries: int = 2):
        for i in range(n_tries):
            self.logger.warning(f"Checking the page has loaded, try: {i+1}/2")
            html_source = self.driver.page_source
            if 'content="ChatGPT"><meta' in html_source:
                return
            else:
                self.wait()

        raise TimeoutError("Failed to start chat session. Page did not load correctly.")

    def _validate_message_sent(self, n_tries: int = 2):
        for i in range(n_tries):
            last_answer_memory = self.past_questions_answers[-1] if self.past_questions_answers else ""
            last_answer_on_page = self._retrieve_last_answer()
            if last_answer_memory == last_answer_on_page:
                self.logger.error("Could not retrieve the new response or it was the same as the last one.")
            else:
                return last_answer_on_page

        raise ValueError("Could not retrieve the new response or it was the same as the last one.")

    def init_chat_session(self):
        """Initialize the Chrome browser."""
        self.driver.get(self.llm_chat_url)
        self.wait()

        self._validate_start_page_loaded()
        self.past_questions_answers = list()

    def pass_captcha(self):
        """Handle CAPTCHA if present."""
        iframe = self.waiter.until(EC.presence_of_element_located(
            (By.XPATH, "//iframe[contains(@src, 'challenge')]")
        ))
        self.driver.switch_to.frame(iframe)
        checkbox = self.waiter.until(EC.element_to_be_clickable((
            By.XPATH, "//input[@type='checkbox'] | //div[contains(@class,'mark')]"
        )))
        checkbox.click()

        self._validate_start_page_loaded()

    def send_message(self, message: str):
        """Send a message to ChatGPT."""
        editor_div = self.waiter.until(EC.element_to_be_clickable((By.ID, "prompt-textarea")))
        editor_div.click()
        editor_div.send_keys(message)
        editor_div.send_keys(Keys.ENTER)
        self.wait(5)

        answer = self._validate_message_sent()
        self.past_questions_answers.append({"message": message, "answer": answer})


if __name__=="__main__":

    open_ai = LLMBrowserSessionOpenAI()
    try:
        open_ai.init_chat_session()
        open_ai.send_message("What is your context length?")
        print(open_ai.past_questions_answers[-1])
        open_ai.send_message("How can I send a message to you that is more than 120k tokens?")
        print(open_ai.past_questions_answers[-1])
    except Exception as e:
        print(f"An error occurred: {e}")

    sleep(360)