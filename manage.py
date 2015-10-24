#!/usr/bin/env python
# -*- coding: utf8 -*-
from flask.ext.script import Manager
from app import app
from api import Loop

manager = Manager(app)


@manager.command
def update_strips():
    loops = app.data.driver.db['loops'].find()
    for loop in loops:
        # loop = Loop.retrieve_tweets(loop)
        Loop.retrieve_content(loop)
        print('loop %s done' % (loop['_id']))
        # for query in loop.get('twitter_queries', []):
        #     print(query.get('keywords'))
        #     for result in query.get('results'):
        #         print(result.get('text'))

if __name__ == "__main__":
    manager.run()
