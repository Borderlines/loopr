"""l8pr URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Import the include() function: from django.conf.urls import url, include
    3. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import url, include
from django.contrib import admin
from rest_framework import routers
from .l8pr.api import (UserViewSet, LoopViewSet, ShowViewSet, ItemViewSet, ItemSearchView,
SearchYoutubeView, MetadataView)
from .l8pr.views import HomePageView, IndexView
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings
from django.contrib.auth import views as auth_views


# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'loops', LoopViewSet)
router.register(r'shows', ShowViewSet)
router.register(r'search', ItemSearchView, base_name='item-search')
router.register(r'items', ItemViewSet)
# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    url(r'^api/', include(router.urls)),
    url(r'^api/metadata/', MetadataView.as_view()),
    url(r'^api/youtube/', SearchYoutubeView.as_view()),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^api/auth/logout/$', auth_views.logout),
    url(r'^api/register/', include('djoser.urls')),
    url(r'^auth/', include('rest_framework_social_oauth2.urls')),
    url(r'^admin/', admin.site.urls),
    url(r'^open/.+$', HomePageView.as_view(template_name='index.html')),
    # url(r'^(?P<username>\w+)$', HomePageView.as_view(template_name='index.html')),
    # url(r'^(?P<username>\w+)/.*$', HomePageView.as_view(template_name='index.html')),
    # from FB auth
    url(r'', IndexView.as_view(), name='index'),

    # url(r'^_=_/$', HomePageView.as_view(template_name='index.html')),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) + \
    static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
