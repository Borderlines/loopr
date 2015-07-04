#!/usr/bin/env python
# -*- coding: utf8 -*-

from eve import Eve
from flask.ext.assets import Environment
from flask import render_template
from apiclient.discovery import build
import os
import datetime
import re
from eve.auth import BasicAuth
# from werkzeug.security import check_password_hash
# from eve.auth import TokenAuth
# import bcrypt
from eve import Eve
from eve.auth import BasicAuth


class BasicAuth(BasicAuth):
    def check_auth(self, username, password, allowed_roles, resource, method):
        # use Eve's own db driver; no additional connections/resources are used
        print(username, password)
        accounts = app.data.driver.db['accounts']
        account = accounts.find_one({'username': username})
        if account and '_id' in account:
            self.set_request_auth_value(account['_id'])
        return account and account['password'] == password


root = os.path.dirname(os.path.realpath(__file__))
app = Eve(__name__, template_folder='templates', auth=BasicAuth, settings=os.path.join(root, 'settings.py'))
assets = Environment(app)
app.register_resource('shows', {
    'datasource': {
        # 'filter': {'links.1': {'$exists': True}},
        'default_sort': [('_created', -1)]
    },
    'auth_field': 'user_id',
    'resource_methods': ['GET', 'POST', 'DELETE'],
    'item_methods': ['GET', 'PATCH', 'PUT', 'DELETE'],
    'allow_unknown': True,
    'schema': {
        'title': {
            'type': 'string'
        },
        'description': {
            'type': 'string'
        },
        'type': {
            'type': 'string',
            'allowed': ['TweetShow', 'VideoShow']
        }
    }
})


def post_shows_put_callback(item, original):
    for link in item.get('links', []):
        if not link.get('duration', False) and 'https://www.youtube.com/watch?v=' in link.get('url'):
            youtube = build('youtube', 'v3', developerKey=app.config.get('GOOGLE_API_KEY'))
            search_response = youtube.videos().list(
                part='contentDetails',
                id=link.get('url').replace('https://www.youtube.com/watch?v=', ''),
                maxResults=1
            ).execute()
            result = search_response.get("items", [])
            duration = re.split('\D', result[0].get('contentDetails').get('duration'))
            duration = [int(d) for d in duration if d != '']
            if len(duration) == 1:
                duration = datetime.timedelta(seconds=duration[0])
            elif len(duration) == 2:
                duration = datetime.timedelta(minutes=duration[0], seconds=duration[1])
            elif len(duration) == 3:
                duration = datetime.timedelta(hours=duration[0], minutes=duration[1], seconds=duration[2])
            link['duration'] = duration.seconds


app.on_replace_shows += post_shows_put_callback

app.register_resource('accounts', {
    # the standard account entry point is defined as
    # '/accounts/<ObjectId>'. We define  an additional read-only entry
    # point accessible at '/accounts/<username>'.
    'additional_lookup': {
        'url': 'regex("[\w]+")',
        'field': 'username',
    },
    'public_methods': ['POST'],
    # We also disable endpoint caching as we don't want client apps to
    # cache account data.
    'cache_control': '',
    'cache_expires': 0,
    # Finally, let's add the schema definition for this endpoint.
    'schema': {
        'username': {
            'type': 'string',
            'required': True,
            'unique': True,
        },
        'password': {
            'type': 'string',
            'required': True,
        }
    }
})


@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    debug = True
    app.run(debug=debug, use_reloader=debug)
