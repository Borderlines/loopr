from django.views.generic.base import TemplateView
import os
from django.conf import settings
from django.contrib.auth.models import User
from . import models
from django.core.exceptions import ObjectDoesNotExist
from django.views.decorators.clickjacking import xframe_options_exempt
from django.utils.decorators import method_decorator
from django.views.generic import View
from django.http import HttpResponse


class IndexView(View):
    """Render main page."""

    def get(self, request):
        """Return html for main application page."""

        abspath = open(os.path.join(settings.BASE_DIR, 'static_dist/index.html'), 'r')
        return HttpResponse(content=abspath.read())


@method_decorator(xframe_options_exempt, name='dispatch')
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
        # add GA
        context['GA'] = os.environ.get('GA')
        return context
