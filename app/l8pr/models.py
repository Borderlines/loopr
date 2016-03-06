from django.db import models
from django.contrib.auth.models import User

# TODO: favorites in accounts


class Loop(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    active = models.BooleanField(default=True)
    added = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    shows_list = models.ManyToManyField('Show', through='ShowsRelationship', related_name='ShowsRelationship')

    def __str__(self):
        return '%s\'s loop' % self.user


class ShowsRelationship(models.Model):
    loop = models.ForeignKey('Loop')
    show = models.ForeignKey('Show')
    order = models.PositiveIntegerField()

    def __str__(self):
        return '%s ===> %s' % (self.show, self.loop)

SHOW_TYPES = (('MusicShow', 'MusicShow'), ('VideoShow', 'VideoShow'))


class Show(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    loop = models.ForeignKey(Loop, on_delete=models.SET_NULL, null=True)
    added = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    show_type = models.CharField(max_length=10, choices=SHOW_TYPES)
    # TODO: settings

    def __str__(self):
        return self.title


class Item(models.Model):
    show = models.ForeignKey(Show, related_name='items', on_delete=models.SET_NULL, null=True)
    # meta
    title = models.CharField(max_length=255)
    author_name = models.CharField(max_length=255, null=True)
    thumbnail = models.URLField(max_length=200, null=True)
    provider_name = models.CharField(max_length=255, null=True)
    html = models.TextField(null=True)
    duration = models.PositiveIntegerField()
    url = models.URLField(max_length=200)

    class Meta:
        order_with_respect_to = 'show'

    def __str__(self):
        return self.url
