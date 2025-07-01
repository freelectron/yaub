"""
ToDo:
 1. Split this file into two:
     - one with implementation of the chrome session
     - another with the model session (e.g., deepseek, llama, deepseek and etc)
"""
import os
from abc import abstractmethod, ABC
from time import sleep, time
import random

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains

from src.browser.errors import BrowserTimeOutError


class LLMChromeSession(ABC):
    """Abstract base class for browser"""
    waiter_default_timeout = 1
    logging_file = "llm_browser_session_base.log"
    past_questions_answers = list()

    @staticmethod
    def wait(seconds: float = 1):
        """Waits for a random amount of time around the given seconds."""
        sleep(random.uniform(seconds * 0.8, seconds * 1.3))

    @staticmethod
    def get_default_options(user_data_dir: str = None, proxy: str = None):
        """Return default Chrome options."""
        options = Options()
        # Randomize window size and position
        width = random.choice([1920, 1600, 1366, 1536])
        height = random.choice([1080, 900, 768, 864])
        options.add_argument(f"--window-size={width},{height}")
        options.add_argument(f"--window-position={random.randint(0,100)},{random.randint(0,100)}")
        # Remove automation flags
        options.add_experimental_option("excludeSwitches", ["enable-automation", "enable-logging"])
        options.add_experimental_option('useAutomationExtension', False)
        options.add_argument("--disable-blink-features=AutomationControlled")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--no-sandbox")
        # Set persistent user profile
        if user_data_dir:
            options.add_argument(f"--user-data-dir={user_data_dir}")
        else:
            # Use a default profile directory for persistence
            default_profile = os.path.expanduser("~/.llm_chrome_profile")
            os.makedirs(default_profile, exist_ok=True)
            options.add_argument(f"--user-data-dir={default_profile}")
        # Set a realistic, randomized User-Agent and Accept-Language
        user_agents = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
        ]
        accept_languages = ["en-US,en;q=0.9", "en-GB,en;q=0.8", "en;q=0.7"]
        user_agent = random.choice(user_agents)
        accept_language = random.choice(accept_languages)
        options.add_argument(f'user-agent={user_agent}')
        options.add_argument(f'--lang={accept_language}')
        # Enable cookies (default in Chrome, but can be set explicitly)
        prefs = {
            "profile.default_content_setting_values.cookies": 1,
            "profile.default_content_setting_values.javascript": 1
        }
        options.add_experimental_option("prefs", prefs)
        # Optionally, set a proxy (uncomment to use)
        # if proxy:
        #     options.add_argument(f'--proxy-server={proxy}')
        # Avoid headless mode for best stealth
        # options.add_argument('--headless=new')  # Only if you must
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

    def __init__(self, options: Options = None, user_data_dir: str = None, proxy: str = None):
        print("Starting here")
        self.logger = self.get_logger()
        self.options = options if options else self.get_default_options(user_data_dir=user_data_dir, proxy=proxy)
        self.driver = webdriver.Chrome(options=self.options)
        # Inject comprehensive anti-detection JS
        self.driver.execute_cdp_cmd('Page.addScriptToEvaluateOnNewDocument', {
            'source': '''
                // Remove navigator.webdriver
                Object.defineProperty(navigator, 'webdriver', {get: () => undefined});
                // Patch window.chrome
                window.chrome = { runtime: {} };
                // Patch plugins
                Object.defineProperty(navigator, 'plugins', {get: () => [
                    { name: 'Chrome PDF Plugin', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
                    { name: 'Chrome PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai', description: '' },
                    { name: 'Native Client', filename: 'internal-nacl-plugin', description: '' }
                ]});
                // Patch languages
                Object.defineProperty(navigator, 'languages', {get: () => ['en-US', 'en']});
                // Patch platform
                Object.defineProperty(navigator, 'platform', {get: () => 'Win32'});
                // Patch permissions
                const originalQuery = window.navigator.permissions.query;
                window.navigator.permissions.query = (parameters) => (
                    parameters.name === 'notifications' ?
                    Promise.resolve({ state: Notification.permission }) :
                    originalQuery(parameters)
                );
                // Patch WebGL vendor/renderer
                try {
                    const getParameter = WebGLRenderingContext.prototype.getParameter;
                    WebGLRenderingContext.prototype.getParameter = function(parameter) {
                        if (parameter === 37445) return 'Intel Open Source Technology Center';
                        if (parameter === 37446) return 'Mesa DRI Intel(R) Ivybridge Mobile';
                        return getParameter(parameter);
                    };
                } catch (e) {}
                // Patch hardware
                Object.defineProperty(navigator, 'hardwareConcurrency', {get: () => 8});
                Object.defineProperty(navigator, 'deviceMemory', {get: () => 8});
                // Patch screen
                Object.defineProperty(window.screen, 'availWidth', {value: 1920});
                Object.defineProperty(window.screen, 'availHeight', {value: 1040});
                Object.defineProperty(window.screen, 'width', {value: 1920});
                Object.defineProperty(window.screen, 'height', {value: 1080});
                Object.defineProperty(window.screen, 'colorDepth', {value: 24});
                Object.defineProperty(window.screen, 'pixelDepth', {value: 24});
                // Patch Notification
                window.Notification = function() { return; };
                window.Notification.permission = 'default';
                // Patch HTMLElement.prototype for toString
                window.HTMLElement.prototype.toString = function() { return '[object HTMLElement]'; };
                // Patch RTCPeerConnection to avoid WebRTC leaks
                if (window.RTCPeerConnection) {
                    const orig = window.RTCPeerConnection;
                    window.RTCPeerConnection = function(...args) {
                        const pc = new orig(...args);
                        pc.createDataChannel = function() { return { readyState: 'closed' }; };
                        return pc;
                    };
                }
                // Patch cdc_ variables (ChromeDriver signatures)
                for (let key in window) {
                    if (key.match(/^cdc_.*$/)) {
                        try { window[key] = undefined; } catch (e) {}
                    }
                }
                // Patch mediaDevices
                if (navigator.mediaDevices) {
                    navigator.mediaDevices.enumerateDevices = () => Promise.resolve([
                        { kind: 'videoinput', label: '', deviceId: 'default', groupId: 'default' },
                        { kind: 'audioinput', label: '', deviceId: 'default', groupId: 'default' }
                    ]);
                }
                // Patch connection
                if (navigator.connection) {
                    Object.defineProperty(navigator, 'connection', {get: () => ({
                        downlink: 10, effectiveType: '4g', rtt: 50, saveData: false
                    })});
                }
                // Patch outerWidth/outerHeight
                Object.defineProperty(window, 'outerWidth', {get: () => 1920});
                Object.defineProperty(window, 'outerHeight', {get: () => 1080});
                // Patch devicePixelRatio
                Object.defineProperty(window, 'devicePixelRatio', {get: () => 1});
            '''
        })
        self.waiter = WebDriverWait(self.driver, self.waiter_default_timeout)
        print("Finishing there")

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

    def human_like_mouse_move_and_click(self, element, double_click: bool = False):
        """Moves the mouse to an element in a human-like fashion and clicks."""
        action = ActionChains(self.driver)

        offset_x = random.randint(-element.size['width'] // 4, element.size['width'] // 4)
        offset_y = random.randint(-element.size['height'] // 4, element.size['height'] // 4)
        action.move_to_element_with_offset(element, offset_x, offset_y)
        action.pause(random.uniform(0.2, 0.6))

        action.move_by_offset(random.randint(-5, 5), random.randint(-5, 5))
        action.pause(random.uniform(0.1, 0.3))
        action.move_by_offset(random.randint(-5, 5), random.randint(-5, 5))
        action.pause(random.uniform(0.1, 0.3))

        if double_click:
            action.double_click()
        else:
            action.click()

        action.perform()

    def human_like_send_keys(self, element, text: str):
        """Sends keys to an element one by one with random delays."""
        for char in text:
            element.send_keys(char)
            sleep(random.uniform(0.05, 0.15))


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
                EC.presence_of_all_elements_located((By.CSS_SELECTOR, "div[data-message-author-role='assistant']"))
            )[-1]
            if len(answer.text) > len(last_answer):
                last_answer = answer.text
            elif len(answer.text) == len(last_answer):
                break
            else:
                if time() - start_time > time_out:
                    break
            self.wait()

        return last_answer

    def _validate_start_page_loaded(self, n_tries: int = 2):
        for i in range(n_tries):
            self.logger.info(f"Checking {i+1} if the LLM's start browser page is loaded.")
            html_source = self.driver.page_source

            print(html_source)

            if 'content="ChatGPT"><meta' in html_source:
                return
            else:
                self.wait(random.uniform(2, 4))

        raise BrowserTimeOutError("Failed to start chat session. Page did not load correctly.")

    def _validate_message_sent(self, n_tries: int = 3):
        for i in range(n_tries):
            # ToDo: use a datastruct to access the answer attribute
            last_answer_memory = self.past_questions_answers[-1]["answer"] if self.past_questions_answers else ""
            last_answer_on_page = self._retrieve_last_answer()
            if last_answer_memory == last_answer_on_page or last_answer_on_page == "":
                if i < n_tries - 1:
                    self.logger.info(f"Message not sent yet, retrying {i+1} of {n_tries}...")
                    self.wait(random.uniform(2, 4))
            else:
                return last_answer_on_page

        raise BrowserTimeOutError("No new response from LLM")

    def init_chat_session(self):
        """Initialize the Chrome browser."""
        print("Initializing chat session in the browser...")
        self.driver.get(self.llm_chat_url)
        print("Waiting for the page to load...")
        self.wait(random.uniform(15, 20))

        self.pass_captcha()
        self.wait(random.uniform(2, 4))

        print("Page loaded, validating...")
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
        self.human_like_mouse_move_and_click(checkbox)

        self._validate_start_page_loaded()

    def send_message(self, message: str):
        """Send a message to ChatGPT."""
        editor_div = self.waiter.until(EC.element_to_be_clickable((By.ID, "prompt-textarea")))
        self.human_like_mouse_move_and_click(editor_div)
        self.human_like_send_keys(editor_div, message)
        editor_div.send_keys(Keys.ENTER)
        self.wait(random.uniform(4.5, 5.5))

        answer = self._validate_message_sent()
        # ToDo: create a datastruct for this
        self.past_questions_answers.append({"message": message, "answer": answer})

        return answer


if __name__=="__main__":
    open_ai = LLMBrowserSessionOpenAI()
    try:
        open_ai.init_chat_session()
        open_ai.send_message("What is your context length?")
        print(open_ai.past_questions_answers[-1])
        open_ai.send_message("How can I send a message to you that is more than 120k tokens?")
        print(open_ai.past_questions_answers[-1])
        open_ai.send_message("Explain advanced techniques and best practices for error handling in python 3.13.")
        print(open_ai.past_questions_answers[-1])
    except Exception as e:
        print(f"An error occurred: {e}")

    sleep(360)