import datetime
from haystack import indexes
from .models import Item, Show


class ItemIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True)
    url = indexes.CharField(model_attr='url')
    provider_name = indexes.CharField(model_attr='provider_name')
    title = indexes.CharField(model_attr='title')
    author_name = indexes.CharField(model_attr='author_name')
    thumbnail = indexes.CharField(model_attr='thumbnail')
    autocomplete = indexes.EdgeNgramField()

    def get_model(self):
        return Item

    @staticmethod
    def prepare_autocomplete(obj):
        return " ".join((
            obj.title, obj.author_name
        ))

    def index_queryset(self, using=None):
        return self.get_model().objects.filter(
            added__lte=datetime.datetime.now()
        )


class ShowIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True)
    title = indexes.CharField(model_attr='title')
    autocomplete = indexes.EdgeNgramField()

    def get_model(self):
        return Show

    @staticmethod
    def prepare_autocomplete(obj):
        return obj.title

    def index_queryset(self, using=None):
        return self.get_model().objects.filter(
            added__lte=datetime.datetime.now()
        )
