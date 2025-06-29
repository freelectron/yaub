#FROM python:3.11-bullseye
#RUN apt-get update && apt-get install -y \
#    wget curl unzip gnupg lsb-release \
#    fonts-liberation libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 \
#    libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 \
#    libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 \
#    libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 \
#    libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
#    xdg-utils --no-install-recommends && \
#    apt-get clean && rm -rf /var/lib/apt/lists/*
#RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/google.gpg && \
#    echo "deb [signed-by=/usr/share/keyrings/google.gpg] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
#    apt-get update && \
#    apt-get install -y google-chrome-stable && \
#    rm -rf /var/lib/apt/lists/*

FROM selenium/standalone-chrome:latest

WORKDIR /app

USER root

# Add Google Chrome's official repository and key
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/google-archive-keyring.gpg && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/google-archive-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list

# Install Google Chrome Stable
RUN apt-get update -y && \
    apt-get install -y google-chrome-stable --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*


RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

#USER seluser

COPY . ./llmer

RUN pip install --no-cache-dir -r llmer/requirements.txt
RUN pip install ./llmer

EXPOSE 50051

ENV NO_CHROME_GUI="true"
ENV CHROME_BIN=/usr/bin/google-chrome
ENV CHROMEDRIVER_PATH=/usr/bin/chromedriver

CMD ["python", "-m", "llmer.src.run"]