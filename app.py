#!/usr/bin/env python

from eve import Eve
from flask.ext.assets import Environment
from flask import render_template

app = Eve(__name__, template_folder='templates')
assets = Environment(app)


@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run()
