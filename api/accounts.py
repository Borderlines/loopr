from flask import current_app as app


class Account(object):
    resource = {
        'datasource': {
            'projection': {'username': 1},
            'filter': {'active': True}
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
            },
            'active': {
                'type': 'boolean',
                'default': True
            }
        }
    }

    def on_created(docs):
        loops = app.data.driver.db['loops']
        for item in docs:
            loops.save({'shows': [], 'user_id': item['_id']})
