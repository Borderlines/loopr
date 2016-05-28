from django.views.generic.base import TemplateView
import os
from django.conf import settings
from django.utils.text import normalize_newlines

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
                    yield (file_name, normalize_newlines(fh.read().decode('utf-8')).replace('\n', ' ').replace('   ', ''))


class HomePageView(TemplateView):

    template_name = "home.html"

    def get_context_data(self, **kwargs):
        context = super(HomePageView, self).get_context_data(**kwargs)
        context['templates'] = angular_templates()
        return context
