
#  Create a custom error that would accept a text message and print
class BrowserError(Exception):
    """Base class for browser-related errors."""
    def __init__(self, message: str):
        super().__init__(message)
        self.message = message

class BrowserTimeOutError(BrowserError):
    """Raised when a browser operation times out."""
    def __init__(self, message: str):
        # ToDo: possibly add a screen shot from the driver's browser
        super().__init__("Browser operation timed out: " + message)

class BrowserUnknownModelError(BrowserError):
    """Raised when an unknown model is specified."""
    def __init__(self, message: str):
        super().__init__("This model is not implemented in the backend: " + message)