from django.db import models
from django.contrib.auth.models import User, Group
from django.db.models import signals
from django.conf import settings
from apiclient.discovery import build as Apiclient
import requests
import urllib
import soundcloud
from requests import HTTPError
import datetime
import re
import json
from twython import Twython
from django.conf import settings


twitter = Twython(settings.TWITTER_CONSUMER_KEY, settings.TWITTER_CONSUMER_SECRET)


class Profile(models.Model):
    user = models.OneToOneField(User, related_name='profile')
    avatar = models.URLField(max_length=500, null=True, blank=True)


class Loop(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='loops')
    active = models.BooleanField(default=True)
    added = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    shows_list = models.ManyToManyField('Show', through='ShowsRelationship', related_name='ShowsRelationship')
    twitter_keywords = models.CharField(blank=True, null=True, max_length=255)
    feed_json = models.TextField(blank=True, null=True, default='[]')

    __original_twitter_keywords = None

    def load_tweets(self):
        if self.twitter_keywords:
            feed = []
            for key in self.twitter_keywords.split(','):
                for r in twitter.search(q=key, count=5, result_type='mixed, recent, popular')['statuses']:
                    feed.append({
                        'body': r['text'],
                        'name': r['user']['name'],
                        'screen_name': r['user']['screen_name'],
                        'href': 'https://twitter.com/%s/status/%s' % (r['user']['screen_name'], r['id_str'])
                    })
            self.feed_json = json.dumps(feed)

    def __init__(self, *args, **kwargs):
        super(Loop, self).__init__(*args, **kwargs)
        self.__original_twitter_keywords = self.twitter_keywords

    def save(self, force_insert=False, force_update=False, *args, **kwargs):
        if self.twitter_keywords != self.__original_twitter_keywords:
            self.load_tweets()
        super(Loop, self).save(force_insert, force_update, *args, **kwargs)
        self.__original_twitter_keywords = self.twitter_keywords

    def __str__(self):
        return '%s\'s loop' % self.user


class ShowsRelationship(models.Model):
    loop = models.ForeignKey('Loop')
    show = models.ForeignKey('Show')
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ('-order', '-id')

    def __str__(self):
        return '%s > %s' % (self.show, self.loop)


class ShowSettings(models.Model):
    show = models.OneToOneField('Show', on_delete=models.CASCADE, related_name="settings")
    shuffle = models.BooleanField(default=False)
    dj_layout = models.BooleanField(default=False)
    giphy = models.BooleanField(default=True)
    force_giphy = models.BooleanField(default=False)
    giphy_tags = models.TextField(blank=True, null=True)
    hide_strip = models.BooleanField(default=False)

    def __str__(self):
        return '%s settings' % (getattr(self, 'show'))


class Show(models.Model):
    SHOW_TYPES = (('normal', 'normal'), ('inbox', 'inbox'))
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    added = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255, blank=True, null=True)
    items = models.ManyToManyField('Item', through='ItemsRelationship', related_name='ItemsRelationship')
    show_type = models.CharField(max_length=255, choices=SHOW_TYPES, default='normal')

    def __str__(self):
        return self.title


class ItemsRelationship(models.Model):
    item = models.ForeignKey('Item')
    show = models.ForeignKey('Show')
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ('-order',)

    def __str__(self):
        return '%s > %s' % (self.item, self.show)


class ItemsUsersRelationship(models.Model):
    item = models.ForeignKey('Item')
    user = models.ForeignKey(User)
    added = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('-added',)

    def __str__(self):
        return '%s > %s' % (self.item, self.user)


class Item(models.Model):
    PROVIDER_CHOICES = (
        ('YouTube', 'YouTube'),
        ('SoundCloud', 'SoundCloud'),
        ('WebTorrent', 'WebTorrent'),
        ('Vimeo', 'Vimeo'),
    )
    users = models.ManyToManyField(User, through='ItemsUsersRelationship', related_name='ItemsUsersRelationship')
    title = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    author_name = models.CharField(max_length=255, null=True, blank=True)
    thumbnail = models.URLField(max_length=200, null=True, blank=True)
    provider_name = models.CharField(max_length=255, null=True, blank=True, choices=PROVIDER_CHOICES)
    html = models.TextField(null=True, blank=True)
    duration = models.PositiveIntegerField(null=True, blank=True)
    url = models.TextField(db_index=True, max_length=400)
    added = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title or self.url


def get_youtube_duration(url):

    def video_id(value):
        """
        Examples:
        - http://youtu.be/SA2iWivDJiE
        - http://www.youtube.com/watch?v=_oPAwA_Udwc&feature=feedu
        - http://www.youtube.com/embed/SA2iWivDJiE
        - http://www.youtube.com/v/SA2iWivDJiE?version=3&amp;hl=en_US
        """
        query = urllib.parse.urlparse(value)
        if query.hostname == 'youtu.be':
            return query.path[1:]
        if query.hostname in ('www.youtube.com', 'youtube.com'):
            if query.path == '/watch':
                p = urllib.parse.parse_qs(query.query)
                return p['v'][0]
            if query.path[:7] == '/embed/':
                return query.path.split('/')[2]
            if query.path[:3] == '/v/':
                return query.path.split('/')[2]
        return None

    youtube = Apiclient('youtube', 'v3', developerKey=getattr(settings, 'GOOGLE_API_KEY'))
    search_response = youtube.videos().list(
        part='contentDetails',
        id=video_id(url),
        maxResults=1
    ).execute()
    result = search_response.get("items", [])
    duration = re.split('\D', result[0].get('contentDetails').get('duration'))
    duration = [int(d) for d in duration if d != '']
    if len(duration) == 1:
        duration = datetime.timedelta(seconds=duration[0])
    elif len(duration) == 2:
        duration = datetime.timedelta(minutes=duration[0], seconds=duration[1])
    elif len(duration) == 3:
        duration = datetime.timedelta(hours=duration[0], minutes=duration[1], seconds=duration[2])
    return duration.seconds


def save_profile(backend, user, response, *args, **kwargs):
    if backend.name == 'facebook':
        profile, created = Profile.objects.get_or_create(user=user)
        profile.avatar = response['picture']['data']['url']
        profile.save()


def get_soundcloud_duration(url):
    client = soundcloud.Client(client_id='847e61a8117730d6b30098cfb715608c')
    try:
        return round(client.get('/resolve', url=url).duration / 1000)
    except HTTPError:
        return None


def get_metadata(url, item_instance=None):
    res = requests.get('http://iframe.ly/api/iframely?url=%s&api_key=%s' % (
                       url, getattr(settings, 'IFRAMELY_API_KEY'))).json()
    try:
        data = {
            'title': res['meta']['title'],
            'author_name': res['meta'].get('author'),
            'thumbnail': res['links']['thumbnail'][0]['href'],
            'provider_name': res['meta'].get('site'),
            'html': res['html'],
            'duration': res['meta'].get('duration'),
            'url': res['meta'].get('canonical'),
            'description': res['meta'].get('description')
        }
        if data['thumbnail'].startswith('//'):
            data['thumbnail'] = 'https:%s' % (data['thumbnail'])
    except KeyError as e:
        if res['links']['file'][0]['type'] == 'application/x-bittorrent':
            data = {
                'title': res['meta']['canonical'],
                'url': res['meta']['canonical'],
                'provider_name': 'WebTorrent'
            }
        else:
            raise e
    if item_instance is None:
        item_instance = Item()
    for key, value in data.items():
        setattr(item_instance, key, value)
    return item_instance


def completeItem(sender, instance, created, **kwargs):
    if not instance.provider_name:
        get_metadata(instance.url, instance)
        instance.save()
    if not instance.duration:
        if instance.provider_name == 'YouTube':
            instance.duration = get_youtube_duration(instance.url)
        if instance.provider_name == 'SoundCloud':
            instance.duration = get_soundcloud_duration(instance.url)
        # save if needed
        if instance.duration:
            instance.save()

signals.post_save.connect(completeItem, sender=Item)


def create_show_settings(sender, instance, created, **kwargs):
    if created and not getattr(instance, 'settings', None):
        ShowSettings.objects.create(show=instance)

signals.post_save.connect(create_show_settings, sender=Show)


def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.get_or_create(user=instance)
        Loop.objects.get_or_create(user=instance)
        api_user = Group.objects.get(name="api user")
        instance.groups.add(api_user)


signals.post_save.connect(create_profile, sender=User)
