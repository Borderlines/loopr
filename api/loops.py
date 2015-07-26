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
            'twitter_queries': {
                'type': 'list',
                'schema': {
                    'type': 'dict'
                }
            },
            'strip_messages': {
                'type': 'list',
                'schema': {
                    'type': 'dict'
                }
            }
        }
    }

    def search_twitter(query, count):
        from TwitterSearch import TwitterSearch, TwitterSearchOrder
        import itertools
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
        return list(itertools.islice(ts.search_tweets_iterable(tso), 0, int(count)))

    def retrieve_tweets(loop):
        twitter_queries = loop.get('twitter_queries', [])
        # search every query
        for query in twitter_queries:
            query['results'] = Loop.search_twitter(query.get('keywords'), query.get('count'))
        # update loop
        loop['twitter_queries'] = twitter_queries
        # save
        app.data.driver.db['loops'].update({'_id': loop['_id']},
                                           {'$set': {'twitter_queries': twitter_queries}})
        return loop

    def on_updated(updated, original):
        if 'twitter_queries' in updated:
            loop = original.copy()
            loop.update(updated)
            Loop.retrieve_tweets(loop)
