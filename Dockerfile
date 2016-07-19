FROM python:3.4.3
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
ADD requirements.txt /code/
RUN pip install -r requirements.txt
RUN apt-get update
RUN apt-get install -y nodejs npm

run ln --symbolic /usr/bin/nodejs /usr/bin/node

COPY ./package.json /code/
COPY ./bower.json /code/
COPY ./.bowerrc /code/

RUN npm install -g npm
RUN npm install -g bower
RUN npm install
RUN bower --allow-root install
ADD . /code/
