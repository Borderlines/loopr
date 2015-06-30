#!/usr/bin/env python
# -*- coding: utf8 -*-

import os

# MONGO_HOST = 'localhost'
# MONGO_PORT = 27017
# MONGO_USERNAME = 'user'
# MONGO_PASSWORD = 'user
MONGO_DBNAME = 'loopr-dev'
if os.environ.get('MONGOLAB_URI'):
    MONGO_URI = os.environ.get('MONGOLAB_URI')
DEBUG = True
URL_PREFIX = 'api'
# LESS_BIN = '/home/edouard/work/loopr/node_modules/.bin/lessc'
RESOURCE_METHODS = ['GET', 'POST', 'DELETE']
ITEM_METHODS = ['GET', 'PATCH', 'PUT', 'DELETE']
DOMAIN = {}
