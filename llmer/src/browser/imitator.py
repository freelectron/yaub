"""
Functionality:
 - broswer is a warpper around a selenium package's driver
 - imitator handler higher level interaction and can ba directlry called by the main program
"""
from time import sleep
import random
import os


def random_user_activity(driver):
    actions = [
        lambda: driver.execute_script("window.scrollBy(0, window.innerHeight);"),
        lambda: driver.execute_script("window.scrollBy(0, -window.innerHeight);"),
        lambda: sleep(random.uniform(1, 3)),
    ]

    random.choice(actions)()


if __name__=="__main__":
    import undetected as uc
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.common.keys import Keys

    options = uc.ChromeOptions()
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-blink-features=AutomationControlled")

    driver = uc.Chrome(options=options)
    driver.get("https://chat.openai.com/chat")

    wait = WebDriverWait(driver, 10)

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
        print(f"❌ Error during captcha/checkbox interaction: {e}")

    editor_div = wait.until(EC.element_to_be_clickable((By.ID, "prompt-textarea")))
    editor_div.click()
    editor_div.send_keys("What is your context length?")
    editor_div.send_keys(Keys.ENTER)

    sleep(10)