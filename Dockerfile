FROM python:3.4.3
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code

RUN apt-get update || true
RUN curl -sL https://deb.nodesource.com/setup_4.x | bash -
RUN apt-get install -y nodejs
# RUN apt-get install -y openjdk-7-jdk nodejs chromium Xvfb

ADD requirements.txt /code/
RUN pip install -r requirements.txt

COPY ./package.json /code/
COPY ./bower.json /code/
COPY ./.bowerrc /code/

RUN npm install -g npm
RUN npm install -g protractor
RUN webdriver-manager update
RUN npm install -g bower
RUN npm install
RUN bower --allow-root install
ADD . /code/
