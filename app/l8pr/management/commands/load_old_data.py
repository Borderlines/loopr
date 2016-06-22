from django.core.management.base import BaseCommand
from app.l8pr.models import Loop, Show, Item, ShowsRelationship, ItemsRelationship, ShowSettings
from django.contrib.auth.models import User
import json
import django.contrib.auth.hashers


class Command(BaseCommand):
    help = 'Load old data from v1'

    def get_collections(self):
        with open('data/accounts.json') as accounts_file:
            accounts = []
            for line in accounts_file:
                accounts.append(json.loads(line))
        with open('data/loops.json') as loops_file:
            loops = []
            for line in loops_file:
                loops.append(json.loads(line))
        with open('data/shows.json') as shows_file:
            shows = []
            for line in shows_file:
                shows.append(json.loads(line))
        return accounts, loops, shows

    def handle(self, *args, **options):
        User.objects.all().delete()
        Loop.objects.all().delete()
        Show.objects.all().delete()
        Item.objects.all().delete()
        ShowsRelationship.objects.all().delete()
        ItemsRelationship.objects.all().delete()
        ShowSettings.objects.all().delete()
        accounts, loops, shows = self.get_collections()
        for account in accounts:
            user_obj = User.objects.create(
                username=account['username'],
                email=account.get('email', ''),
                password=django.contrib.auth.hashers.make_password(account['password']),
                is_staff=account['username'] in ['vied12', 'ben'],
                is_superuser=account['username'] in ['vied12', 'ben']
            )
            loop = [loop for loop in loops if loop['user_id']['$oid'] == account['_id']['$oid']][0]
            loop_obj = Loop.objects.create(
                user=user_obj,
                active=loop.get('active', True)
            )
            order = 0
            for show_id in loop.get('shows', []):
                show = next((show for show in shows if show['_id']['$oid'] == show_id['$oid']), None)
                if show:
                    settings = show.get('settings', {})
                    settings['dj_layout'] = settings.get('djLayout', False)
                    settings['giphy_tags'] = settings.get('giphyTags', None)
                    for key in ('djLayout', 'giphyTags'):
                        try:
                            del settings[key]
                        except KeyError:
                            pass
                    settings_obj = ShowSettings.objects.create(**settings)

                    show_obj = Show.objects.create(
                        user=user_obj,
                        title=show.get('title'),
                        settings=settings_obj
                    )
                    ShowsRelationship.objects.create(
                        loop=loop_obj,
                        show=show_obj,
                        order=order
                    )
                    order += 1
                    item_order = 0
                    for item in show.get('links'):
                        item_obj = Item.objects.create(
                            title=item.get('title'),
                            author_name=item.get('author_name'),
                            thumbnail=item.get('thumbnail'),
                            provider_name=item.get('provider_name'),
                            html=item.get('html'),
                            duration=item.get('duration', 0) or 0,
                            url=item.get('url'),
                        )
                        ItemsRelationship.objects.create(
                            item=item_obj,
                            show=show_obj,
                            order=item_order
                        )
                        item_order += 1

            self.stdout.write('%s, %s shows' % (account['username'], len(loop.get('shows', []))))
        self.stdout.write(self.style.SUCCESS('done'))
