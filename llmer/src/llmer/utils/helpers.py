import logging


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