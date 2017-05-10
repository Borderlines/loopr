from django.db import models
from haystack import indexes
from .models import Item, Show, ItemsRelationship
from django.contrib.auth.models import User


class ItemIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True)
    url = indexes.CharField(model_attr='url')
    provider_name = indexes.CharField(model_attr='provider_name', null=True)
    title = indexes.CharField(model_attr='title', null=True)
    author_name = indexes.CharField(model_attr='author_name', null=True)
    thumbnail = indexes.CharField(model_attr='thumbnail', null=True)

    def get_model(self):
        return Item


class ShowIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, model_attr='title')
    title = indexes.CharField(model_attr='title')
    user = indexes.CharField(model_attr='user.username')

    def get_model(self):
        return Show


class UserIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, model_attr='username')
    username = indexes.CharField(model_attr='username')

    def get_model(self):
        return User


def reindex_mymodel(sender, **kwargs):
    ItemIndex().update_object(kwargs['instance'].item)
    ShowIndex().update_object(kwargs['instance'].show)


models.signals.post_save.connect(reindex_mymodel, sender=ItemsRelationship)
