import datetime
from haystack import indexes
from .models import Item, Show
from django.contrib.auth.models import User


class ItemIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True)
    url = indexes.CharField(model_attr='url')
    provider_name = indexes.CharField(model_attr='provider_name', null=True)
    title = indexes.CharField(model_attr='title')
    author_name = indexes.CharField(model_attr='author_name', null=True)
    thumbnail = indexes.CharField(model_attr='thumbnail', null=True)

    def get_model(self):
        return Item


class ShowIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, model_attr='title')
    title = indexes.CharField(model_attr='title')

    def get_model(self):
        return Show


class UserIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, model_attr='username')
    username = indexes.CharField(model_attr='username')

    def get_model(self):
        return User
