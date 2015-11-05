#!/usr/bin/env python
# -*- coding: utf8 -*-
from flask.ext.script import Manager
from app import app
from api import Loop
import time

manager = Manager(app)


@manager.command
def update_strips():
    loops = app.data.driver.db['loops'].find()
    for loop in loops:
        Loop.retrieve_content(loop)
        print('loop %s done' % (loop['_id']))
        # for message in loop['strip_messages']:
        #     print(message)
        #     results = message.get('results')
        #     print(results.get('title', 'no title'))
        # if len(loop['strip_messages']) > 0:
        #     time.sleep(3)  # sleep for 60 seconds


if __name__ == "__main__":
    manager.run()
