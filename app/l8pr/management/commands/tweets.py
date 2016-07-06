from django.core.management.base import BaseCommand
from app.l8pr.models import Loop


class Command(BaseCommand):
    help = 'Get tweets'

    def handle(self, *args, **options):
        for loop in Loop.objects.all():
            if loop.twitter_keywords:
                loop.load_tweets()
                loop.save()
                self.stdout.write(self.style.SUCCESS('%s done' % loop))
