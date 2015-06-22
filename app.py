#!/usr/bin/env python

from eve import Eve
from flask.ext.assets import Environment
from flask import render_template

app = Eve(__name__, template_folder='templates')
assets = Environment(app)
app.register_resource('shows', {
    # most global settings can be overridden at resource level
    'resource_methods': ['GET', 'POST'],
    'schema': {
        # Schema definition, based on Cerberus grammar. Check the Cerberus project
        # (https://github.com/nicolaiarocci/cerberus) for details.
        'title': {
            'required': True,
            'type': 'string'
        },
        'description': {
            'type': 'string'
        },
        'type': {
            'type': 'list',
            'allowed': ['TweetShow', 'YoutubeShow']
        }
    }
})


@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    debug = True
    app.run(debug=debug, use_reloader=debug)
