from abc import abstractmethod, ABC
from time import sleep

import undetected as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys


class LLMChromeSession(ABC):
    """Abstract base class for browser"""
    waiter_default_timeout = 1

    @staticmethod
    def get_default_options():
        """Return default Chrome options."""
        options = uc.ChromeOptions()
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-blink-features=AutomationControlled")
        return options

    def __init__(self, options: uc.ChromeOptions = None):
        self.options = options if options else self.get_default_options()
        self.driver = uc.Chrome(options=self.options)
        self.wait = WebDriverWait(self.driver, self.waiter_default_timeout)

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

    @abstractmethod
    def get_last_assistant_block(self):
        """Retrieve the last response from the assistant."""
        pass


class LLMBrowserSessionOpenAI(LLMChromeSession):
    llm_chat_url = "https://chat.openai.com/chat"

    def init_chat_session(self):
        """Initialize the Chrome browser."""
        self.driver.get(self.llm_chat_url)

    def pass_captcha(self):
        """Handle CAPTCHA if present."""
        iframe = self.wait.until(EC.presence_of_element_located(
            (By.XPATH, "//iframe[contains(@src, 'challenge')]")
        ))
        self.driver.switch_to.frame(iframe)
        checkbox = self.wait.until(EC.element_to_be_clickable((
            By.XPATH, "//input[@type='checkbox'] | //div[contains(@class,'mark')]"
        )))
        checkbox.click()

    def send_message(self, message: str):
        """Send a message to ChatGPT."""
        editor_div = self.wait.until(EC.element_to_be_clickable((By.ID, "prompt-textarea")))
        editor_div.click()
        editor_div.send_keys(message)
        editor_div.send_keys(Keys.ENTER)

    def get_last_assistant_block(self) -> str:
        """Retrieve the last response from the assistant."""
        assistant_blocks = self.wait.until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, "div[data-message-author-role='assistant']"))
        )
        return assistant_blocks[-1].text


if __name__=="__main__":

    open_ai = LLMBrowserSessionOpenAI()

    try:
        open_ai.init_chat_session()
        open_ai.send_message("What is your context length?")
        sleep(10)
        response = open_ai.get_last_assistant_block()
        print(response)
    except Exception as e:
        print(f"An error occurred: {e}")

    sleep(360)