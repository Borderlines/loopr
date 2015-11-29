#!/usr/bin/env python
# -*- coding: utf8 -*-

import os

# MONGO_HOST = 'localhost'
# MONGO_PORT = 27017
# MONGO_USERNAME = 'user'
# MONGO_PASSWORD = 'user
MONGO_DBNAME = 'L8pr-dev'
if os.environ.get('MONGOLAB_URI'):
    MONGO_URI = os.environ.get('MONGOLAB_URI')
DEBUG = os.environ.get('DEBUG', 'True').lower() == 'true'
URL_PREFIX = 'api'
LESS_BIN = os.environ.get('LESS_BIN')
RESOURCE_METHODS = ['GET', 'POST', 'DELETE']
ITEM_METHODS = ['GET', 'PATCH', 'PUT', 'DELETE']
DOMAIN = {}
GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')

TWITTER_CONSUMER_KEY = os.environ.get('TWITTER_CONSUMER_KEY')
TWITTER_CONSUMER_SECRET = os.environ.get('TWITTER_CONSUMER_SECRET')
TWITTER_ACCESS_TOKEN = os.environ.get('TWITTER_ACCESS_TOKEN')
TWITTER_ACCESS_TOKEN_SECRET = os.environ.get('TWITTER_ACCESS_TOKEN_SECRET')

DATE_FORMAT = '%Y-%m-%dT%H:%M:%S+00:00'

CACHE_CONTROL = 'max-age=0, no-cache'
GA = os.environ.get('GA', None)
