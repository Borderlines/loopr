from django.db import models
from django.contrib.auth.models import User
from django.db.models import signals
import urllib
import datetime
import re
from django.conf import settings
# TODO: favorites in accounts

SHOW_TYPES = (('MusicShow', 'MusicShow'), ('VideoShow', 'VideoShow'))
PROVIDER_CHOICES = (('YouTube', 'YouTube'), ('SoundCloud', 'SoundCloud'))


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


class ShowSettings(models.Model):
    # show = models.ForeignKey(Show, related_name='settings', on_delete=models.CASCADE)
    shuffle = models.BooleanField(default=False)
    dj_layout = models.BooleanField(default=False)
    giphy = models.BooleanField(default=True)
    giphy_tags = models.TextField(blank=True, null=True)
    hide_strip = models.BooleanField(default=False)

    def __str__(self):
        return '%s settings' % (getattr(self, 'show', ''))


class Show(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    loop = models.ForeignKey(Loop, on_delete=models.SET_NULL, null=True)
    added = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    show_type = models.CharField(max_length=10, choices=SHOW_TYPES)
    settings = models.OneToOneField(ShowSettings,
                                    on_delete=models.CASCADE,
                                    related_name='show',
                                    primary_key=True)

    def __str__(self):
        return self.title


class Item(models.Model):
    show = models.ForeignKey(Show, related_name='items', on_delete=models.CASCADE)
    # meta
    title = models.CharField(max_length=255, null=True, blank=True)
    author_name = models.CharField(max_length=255, null=True, blank=True)
    thumbnail = models.URLField(max_length=200, null=True, blank=True)
    provider_name = models.CharField(max_length=255, choices=PROVIDER_CHOICES)
    html = models.TextField(null=True, blank=True)
    duration = models.PositiveIntegerField(null=True, blank=True)
    url = models.URLField(max_length=200)

    class Meta:
        order_with_respect_to = 'show'

    def __str__(self):
        return self.url


def get_youtube_duration(url):
    from apiclient.discovery import build

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

    youtube = build('youtube', 'v3', developerKey=getattr(settings, 'GOOGLE_API_KEY'))
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


def get_soundcloud_duration(url):
    import soundcloud
    from requests import HTTPError
    client = soundcloud.Client(client_id='847e61a8117730d6b30098cfb715608c')
    try:
        return round(client.get('/resolve', url=url).duration / 1000)
    except HTTPError:
        return None


def completeItem(sender, instance, created, **kwargs):
    if not instance.duration:
        if instance.provider_name == 'YouTube':
            instance.duration = get_youtube_duration(instance.url)
        if instance.provider_name == 'SoundCloud':
            instance.duration = get_soundcloud_duration(instance.url)
        # save if needed
        if instance.duration:
            instance.save()

signals.post_save.connect(completeItem, sender=Item)
