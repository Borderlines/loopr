from django.views.generic.base import TemplateView
import os
from django.conf import settings
from django.utils.text import normalize_newlines
from django.contrib.auth.models import User
from . import models
from django.core.exceptions import ObjectDoesNotExist


def angular_templates():
    partials_dir = settings.STATICFILES_DIRS[0]
    exclude = ('bower_components',)
    for (root, dirs, files) in os.walk(partials_dir, topdown=True):
        dirs[:] = [d for d in dirs if d not in exclude]
        for file_name in files:
            if file_name.endswith('.html'):
                file_path = os.path.join(root, file_name)
                with open(file_path, 'rb') as fh:
                    file_name = file_path[len(partials_dir) + 1:]
                    yield (file_name, normalize_newlines(fh.read().decode('utf-8')).replace('\n', ' '))


class HomePageView(TemplateView):

    template_name = "home.html"

    def get_context_data(self, **kwargs):
        context = super(HomePageView, self).get_context_data(**kwargs)
        if self.request.GET.get('show'):
            context['show'] = models.Show.objects.get(pk=self.request.GET.get('show'))
        if context.get('username'):
            try:
                context['user'] = User.objects.get(username=context['username'])
            except ObjectDoesNotExist:
                pass
        if self.request.GET.get('item'):
            context['item'] = models.Item.objects.get(pk=self.request.GET.get('item'))
        # title & description & thumbnail
        if context.get('item'):
            context['title'] = context.get('item').title
            context['description'] = 'Show %s by %s' % (context.get('show').title, context.get('user').username)
            context['thumbnail'] = context.get('item').thumbnail
        elif context.get('show'):
            context['title'] = context.get('show').title
            context['description'] = '%s\'s loop' % (context.get('user').username)
            context['thumbnail'] = context.get('show').items.first().thumbnail
        elif context.get('user'):
            context['title'] = '%s\'s loop' % (context.get('user').username)
            context['thumbnail'] = self.request.build_absolute_uri('static/images/L8PRtv.png')
        else:
            context['title'] = 'l8pr'
            context['thumbnail'] = self.request.build_absolute_uri('static/images/L8PRtv.png')
        # add templates
        context['templates'] = angular_templates()
        return context
