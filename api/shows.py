from apiclient.discovery import build
import datetime
import re
import urllib.parse
from flask import current_app as app
import soundcloud
from requests import HTTPError


class Show(object):
    resource = {
        'datasource': {
            'default_sort': [('_created', -1)]
        },
        'auth_field': 'user_id',
        'resource_methods': ['GET', 'POST', 'DELETE'],
        'item_methods': ['GET', 'PATCH', 'PUT', 'DELETE'],
        'allow_unknown': True,
        'schema': {
            'title': {
                'type': 'string'
            },
            'description': {
                'type': 'string'
            },
            'type': {
                'type': 'string',
                'allowed': ['MusicShow', 'VideoShow']
            },
            'settings': {
                'type': 'dict'
            }
        }
    }

    def on_update(updated, original):
        for link in updated.get('links', []):
            if not link.get('duration', False):
                if link.get('provider_name', None) == 'YouTube':
                    link['duration'] = get_youtube_duration(link.get('url'))
            if link.get('provider_name', None) == 'SoundCloud':
                link['duration'] = get_soundcloud_duration(link.get('url'))


def get_soundcloud_duration(url):
    client = soundcloud.Client(client_id='847e61a8117730d6b30098cfb715608c')
    try:
        return round(client.get('/resolve', url=url).duration / 1000)
    except HTTPError:
        return None


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

    youtube = build('youtube', 'v3', developerKey=app.config.get('GOOGLE_API_KEY'))
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


if __name__ == '__main__':
    duration = get_soundcloud_duration('http://soundcloud.com/forss/flickermood')
    assert duration > 1
    assert type(duration) is int
    # with app.app_context():
    #     duration = get_youtube_duration('https://www.youtube.com/watch?v=hBlB8RAJEEc')
    #     assert duration > 1
    #     assert type(duration) is int
