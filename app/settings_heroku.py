from .settings import *
import dj_database_url

DATABASES['default'] = dj_database_url.config(conn_max_age=600)

# Simplified static file serving.
STATICFILES_STORAGE = 'whitenoise.django.GzipManifestStaticFilesStorage'

HAYSTACK_CONNECTIONS = {
    'default': {
        'ENGINE': 'haystack.backends.elasticsearch_backend.ElasticsearchSearchEngine',
        'URL': os.environ.get('BONSAI_URL'),
        'INDEX_NAME': 'haystack',
    },
}

COMPRESS_PRECOMPILERS = (
    ('module', 'PATH=$PATH:/app/.heroku/vendor/node/lib/node_modules/.bin ; /app/.heroku/vendor/node/lib/node_modules/.bin/browserify "{infile}" -d -o "{outfile}" '
     '-t [ "babelify" --plugins="babel-plugin-transform-react-jsx" --presets="babel-preset-es2015" ]'),
    ('text/less', '/app/.heroku/vendor/node/lib/node_modules/less/bin/lessc {infile} {outfile}'),
)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.sendgrid.net'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ['SENDGRID_USERNAME']
EMAIL_HOST_PASSWORD = os.environ['SENDGRID_PASSWORD']
DJOSER['DOMAIN'] = os.environ['DOMAIN']
