#!/usr/bin/env python
# -*- coding: utf8 -*-

from eve import Eve
from flask.ext.assets import Environment
from flask import render_template, request
import os
from eve.auth import BasicAuth
import api
from bson.objectid import ObjectId


class BasicAuth(BasicAuth):
    def check_auth(self, username, password, allowed_roles, resource, method):
        # use Eve's own db driver; no additional connections/resources are used
        accounts = app.data.driver.db['accounts']
        account = accounts.find_one({'username': username})
        if account and '_id' in account:
            self.set_request_auth_value(account['_id'])
        return account and account['password'] == password


def get_app():
    root = os.path.dirname(os.path.realpath(__file__))
    app = Eve(__name__, template_folder='templates', auth=BasicAuth, settings=os.path.join(root, 'settings.py'))
    Environment(app)
    api.register_api(app)

    @app.route('/')
    def index(path=None):
        return render_template('editor.html')

    @app.route('/<username>')
    def player(username):
        user = app.data.driver.db['accounts'].find_one({'username': username})
        loop = app.data.driver.db['loops'].find({'user_id': user['_id']})[0]
        nb_show = str(len(loop['shows']))
        scope = {
            'user': user,
            'nb_show': nb_show
        }
        if request.args.get('show'):
            scope['show'] = app.data.driver.db['shows'].find({'_id': ObjectId(request.args.get('show'))})[0]
        if request.args.get('item'):
            scope['item'] = scope['show']['links'][int(request.args.get('item'))]
        return render_template('player.html', **scope)

    return app


app = get_app()

if __name__ == '__main__':
    app = get_app()
    debug = app.config.get('DEBUG')
    app.run(debug=debug, use_reloader=debug)
