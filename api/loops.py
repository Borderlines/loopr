from flask import current_app as app


class Loop(object):
    resource = {
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
    }

    def on_update(updated, original):
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
            import itertools
            return list(itertools.islice(ts.search_tweets_iterable(tso), 0, 5))
        if 'strip_queries' in updated:
            for query in updated['strip_queries']:
                if len(query.get('results', []) or []) < 1:
                    results = search_twitter(query['accounts'])
                    query['results'] = results
