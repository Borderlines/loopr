#!/usr/bin/env python
# -*- coding: utf8 -*-

from eve import Eve
from flask.ext.assets import Environment
from flask import render_template
import os

CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))
app = Eve(__name__, template_folder='templates', settings=os.path.join(CURRENT_DIR, 'settings.py'))
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
        # Schema definition, based on Cerberus grammar. Check the Cerberus project
        # (https://github.com/nicolaiarocci/cerberus) for details.
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


@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    debug = True
    app.run(debug=debug, use_reloader=debug)
