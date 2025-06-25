"""
Functionality:
 - broswer is a warpper around a selenium package's driver
 - imitator handler higher level interaction and can ba directlry called by the main program
"""
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
    def get_default_options(self):
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
        editor_div.send_keys("What is your context length?")
        editor_div.send_keys(Keys.ENTER)

    def get_last_assistant_block(self) -> str:
        """Retrieve the last response from the assistant."""
        assistant_blocks = self.wait.until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, "div[data-message-author-role='assistant']"))
        )
        return assistant_blocks[-1].text


if __name__=="__main__":

    # Function: init_browser
    options = uc.ChromeOptions()
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-blink-features=AutomationControlled")
    driver = uc.Chrome(options=options)
    wait = WebDriverWait(driver, 1)

    # Function: start_chatgpt_session
    driver.get("https://chat.openai.com/chat")

    # Function: pass_captcha
    try:
        iframe = wait.until(EC.presence_of_element_located(
            (By.XPATH, "//iframe[contains(@src, 'challenge')]")
        ))
        driver.switch_to.frame(iframe)
        checkbox = wait.until(EC.element_to_be_clickable((
            By.XPATH, "//input[@type='checkbox'] | //div[contains(@class,'mark')]"
        )))
        checkbox.click()
    except Exception as e:
        print(f"Captcha handling failed: {e}")

    # Function: send_message
    editor_div = wait.until(EC.element_to_be_clickable((By.ID, "prompt-textarea")))
    editor_div.click()
    editor_div.send_keys("What is your context length?")
    editor_div.send_keys(Keys.ENTER)

    # Function: get_last_assistant_block
    #  retry this after 5 seconds waiting N times
    sleep(5)
    assistant_blocks = wait.until(
        EC.presence_of_all_elements_located((By.CSS_SELECTOR, "div[data-message-author-role='assistant']"))
    )
    assistant_last_block = assistant_blocks[-1]
    print(assistant_last_block.text)

    sleep(3600)