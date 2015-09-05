from .shows import Show
from .loops import Loop
from .accounts import Account

RESOURCES = (
    ('shows', Show),
    ('loops', Loop),
    ('accounts', Account)
)

EVENTS = (
    ('on_update', 'on_replace'),
    ('on_updated', 'on_replaced'),
    ('on_create', 'on_insert'),
    ('on_created', 'on_inserted'),
    ('on_get', 'on_pre_GET')
)


def register_api(app):
    for resource_name, resource_class in RESOURCES:
        app.register_resource(resource_name, resource_class.resource)
        for function_name, event_name in EVENTS:
            if hasattr(resource_class, function_name):
                event = getattr(app, '%s_%s' % (event_name, resource_name))
                event += getattr(resource_class, function_name)
