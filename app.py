#!/usr/bin/env python
# -*- coding: utf8 -*-

from eve import Eve
from flask.ext.assets import Environment
from flask import render_template
from apiclient.discovery import build
import os
import datetime
import re

root = os.path.dirname(os.path.realpath(__file__))
app = Eve(__name__, template_folder='templates', settings=os.path.join(root, 'settings.py'))
assets = Environment(app)
app.register_resource('shows', {
    'datasource': {
        # 'filter': {'links.1': {'$exists': True}},
        'default_sort': [('_created', -1)]
    },
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
            if len(duration) == 2:
                duration = datetime.timedelta(minutes=duration[0], seconds=duration[1])
            elif len(duration) == 3:
                duration = datetime.timedelta(hours=duration[0], minutes=duration[1], seconds=duration[2])
            link['duration'] = duration.seconds


app.on_replace_shows += post_shows_put_callback


@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    debug = True
    app.run(debug=debug, use_reloader=debug)
