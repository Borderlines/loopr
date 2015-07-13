#!/usr/bin/env python
# -*- coding: utf8 -*-

from eve import Eve
from flask.ext.assets import Environment
from flask import render_template
import os
from eve.auth import BasicAuth
import api


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
api.register_api(app)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/loop')
def player():
    return render_template('player.html')


if __name__ == '__main__':
    debug = True
    app.run(debug=debug, use_reloader=debug)
