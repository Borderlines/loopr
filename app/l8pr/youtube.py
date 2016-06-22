from apiclient.discovery import build
from django.conf import settings
from .models import Item


DEVELOPER_KEY = settings.GOOGLE_API_KEY
YOUTUBE_API_SERVICE_NAME = 'youtube'
YOUTUBE_API_VERSION = 'v3'


def youtube_search(options):
    youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION,
                    developerKey=DEVELOPER_KEY)
    # Call the search.list method to retrieve results matching the specified
    # query term.
    search_response = youtube.search().list(
        q=options.get('q'),
        part='id,snippet',
        maxResults=15
    ).execute()
    for search_result in search_response.get('items', []):
        if search_result['id']['kind'] == 'youtube#video':
            yield Item(
                title=search_result['snippet']['title'],
                description=search_result['snippet']['description'],
                thumbnail=search_result['snippet']['thumbnails']['high']['url'],
                provider_name='YouTube',
                url='https://www.youtube.com/watch?v=%s' % (search_result['id']['videoId'])
            )
