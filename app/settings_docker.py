from .settings import *

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'loopr_dev',
        'USER': 'loopr',
        'PASSWORD': 'password',
        'HOST': 'postgres',
        'PORT': 5432,
    }
}

HAYSTACK_CONNECTIONS = {
    'default': {
        'ENGINE': 'haystack.backends.elasticsearch_backend.ElasticsearchSearchEngine',
        'URL': "http://elasticsearch:9200/",
        'INDEX_NAME': 'haystack',
    },
}
