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
import urllib.parse


class BasicAuth(BasicAuth):
    def check_auth(self, username, password, allowed_roles, resource, method):
        # use Eve's own db driver; no additional connections/resources are used
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
app.register_resource('loops', {
    'auth_field': 'user_id',
    'resource_methods': ['GET', 'POST', 'DELETE'],
    'item_methods': ['GET', 'PATCH', 'PUT', 'DELETE'],
    'public_methods': ['GET'],
    'schema': {
        'user_id': {
            'type': 'objectid',
            'data_relation': {
                'resource': 'accounts',
                'field': '_id'
            }
        },
        'shows': {
            'type': 'list',
            'schema': {
                'type': 'objectid',
                'data_relation': {
                    'resource': 'shows',
                    'field': '_id',
                    'embeddable': True
                }
            }
        },
        'strip_queries': {
            'type': 'list',
            'schema': {
                'type': 'dict'
            }
        }
    }
})


def video_id(value):
    """
    Examples:
    - http://youtu.be/SA2iWivDJiE
    - http://www.youtube.com/watch?v=_oPAwA_Udwc&feature=feedu
    - http://www.youtube.com/embed/SA2iWivDJiE
    - http://www.youtube.com/v/SA2iWivDJiE?version=3&amp;hl=en_US
    """
    query = urllib.parse.urlparse(value)
    if query.hostname == 'youtu.be':
        return query.path[1:]
    if query.hostname in ('www.youtube.com', 'youtube.com'):
        if query.path == '/watch':
            p = urllib.parse.parse_qs(query.query)
            return p['v'][0]
        if query.path[:7] == '/embed/':
            return query.path.split('/')[2]
        if query.path[:3] == '/v/':
            return query.path.split('/')[2]
    # fail?
    return None


def pre_shows_put_callback(item, original):
    for link in item.get('links', []):
        if not link.get('duration', False) and link.get('provider_name', None) == 'YouTube':
            youtube = build('youtube', 'v3', developerKey=app.config.get('GOOGLE_API_KEY'))
            search_response = youtube.videos().list(
                part='contentDetails',
                id=video_id(link.get('url')),
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


app.on_replace_shows += pre_shows_put_callback


def pre_loops_put_callback(item, original):
    if 'strip_queries' in item:
        for query in item['strip_queries']:
            if len(query.get('results', [])) < 1:
                results = search_twitter(query['accounts'])
                query['results'] = results

app.on_replace_loops += pre_loops_put_callback

app.register_resource('accounts', {
    'datasource': {
        'projection': {'username': 1}
    },
    # the standard account entry point is defined as
    # '/accounts/<ObjectId>'. We define  an additional read-only entry
    # point accessible at '/accounts/<username>'.
    'additional_lookup': {
        'url': 'regex("[\w]+")',
        'field': 'username',
    },
    'public_methods': ['POST', 'GET'],
    'public_item_methods': ['GET'],
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


def post_accounts_inserted_callback(items):
    loops = app.data.driver.db['loops']
    for item in items:
        loops.save({'shows': [], 'user_id': item['_id']})

app.on_inserted_accounts += post_accounts_inserted_callback


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/loop')
def player():
    return render_template('player.html')


def search_twitter(query):
    from TwitterSearch import TwitterSearch, TwitterSearchOrder
    tso = TwitterSearchOrder()
    tso.set_keywords(query)
    # tso.set_language('en')
    tso.set_include_entities(False)
    # it's about time to create a TwitterSearch object with our secret tokens
    ts = TwitterSearch(
        consumer_key=app.config.get('TWITTER_CONSUMER_KEY'),
        consumer_secret=app.config.get('TWITTER_CONSUMER_SECRET'),
        access_token=app.config.get('TWITTER_ACCESS_TOKEN'),
        access_token_secret=app.config.get('TWITTER_ACCESS_TOKEN_SECRET')
    )
    return [ts.search_tweets_iterable(tso).next() for x in range(5)]

if __name__ == '__main__':
    debug = True
    app.run(debug=debug, use_reloader=debug)
