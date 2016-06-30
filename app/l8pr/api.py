from django.contrib.auth.models import User
from .models import Loop, Show, Item, ShowSettings, Profile, ItemsRelationship, get_metadata, ShowsRelationship
from rest_framework import serializers, viewsets, views
from rest_framework.decorators import list_route
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from drf_haystack.serializers import HaystackSerializer
from drf_haystack.viewsets import HaystackViewSet
from .search_indexes import ItemIndex, ShowIndex
from .youtube import youtube_search
from django.utils import timezone


class ItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = Item


class ShowSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShowSettings
        fields = ('shuffle', 'dj_layout', 'giphy', 'force_giphy', 'giphy_tags', 'hide_strip')


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile


class ItemsField(serializers.Field):
    def get_attribute(self, obj):
        # We pass the object instance onto `to_representation`,
        # not just the field attribute.
        return obj

    def to_representation(self, obj):
        items = [rel.item for rel in ItemsRelationship.objects.filter(show=obj).order_by('-order')]
        return ItemSerializer(items, many=True, read_only=True).data

    def to_internal_value(self, data):
        serializer = ItemSerializer(data=data, many=True)
        serializer.is_valid()
        return serializer.validated_data


class ShowSerializer(serializers.ModelSerializer):
    items = ItemsField()
    settings = ShowSettingsSerializer(required=False)

    class Meta:
        model = Show
        fields = ('id', 'added', 'updated', 'title', 'description', 'items', 'user', 'settings')

    def get_items(selfself, obj):
        items = [rel.item for rel in ItemsRelationship.objects.filter(show=obj).order_by('-order')]
        return ItemSerializer(items, many=True, read_only=True).data

    def create(self, validated_data):
        validated_data.pop('settings', {})
        items = validated_data.pop('items', [])
        current_user = self.context['request'].user
        validated_data['user'] = current_user
        show = Show.objects.create(**validated_data)
        order = 0
        for item in items:
            ItemsRelationship.objects.create(
                item=Item.objects.get(pk=item['id']),
                show=show,
                order=order
            )
            order += 1
        order = 0
        loop = Loop.objects.get(user=current_user)
        ShowsRelationship.objects.create(
            loop=loop,
            show=show,
            order=order
        )
        return show

    def update(self, instance, validated_data):
        instance.updated = timezone.now()
        # settings
        settings = ShowSettings.objects.filter(pk=instance.settings.pk)
        if settings:
            settings.update(**validated_data.get('settings', {}))
            instance.settings = settings[0]
        # items
        instance.items.clear()
        items_list = validated_data.get('items', [])
        order = len(items_list)
        for item in items_list:
            ItemsRelationship.objects.create(
                item=Item.objects.get(pk=item['id']),
                show=instance,
                order=order
            )
            order -= 1
        instance.save()
        return instance


class LoopSerializer(serializers.ModelSerializer):
    shows_list = ShowSerializer(many=True, read_only=False)

    class Meta:
        model = Loop
        fields = ('id', 'shows_list', 'user', 'active')


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(many=False)

    class Meta:
        model = User
        fields = ('id', 'username', 'loops', 'profile')


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @list_route(methods=['get'], url_path='username/(?P<username>\w+)')
    def getByUsername(self, request, username):
        user = get_object_or_404(User, username=username)
        return Response(UserSerializer(user, context={'request': request}).data, status=status.HTTP_200_OK)

    @list_route(methods=['get'], url_path='me')
    def me(self, request):
        if (request.user.is_anonymous()):
            return Response('nope', status=status.HTTP_401_UNAUTHORIZED)
        return Response(UserSerializer(request.user, context={'request': request}).data, status=status.HTTP_200_OK)


class LoopViewSet(viewsets.ModelViewSet):
    queryset = Loop.objects.all()
    serializer_class = LoopSerializer
    filter_fields = ('user',)

    def get_queryset(self):
        username = self.request.query_params.get('username', None)
        if username:
            return Loop.objects.filter(user__username=username)
        else:
            return Loop.objects.all()


class ShowViewSet(viewsets.ModelViewSet):
    queryset = Show.objects.all()
    serializer_class = ShowSerializer
    filter_fields = ('user',)
    ordering_fields = ('updated',)

    def get_queryset(self):
        if 'pk' not in self.kwargs:
            return Show.objects.filter(user=self.request.user)
        else:
            return Show.objects.all()


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    filter_fields = ('url',)


class ItemSearchSerializer(HaystackSerializer):
    id = serializers.CharField()

    class Meta:
        # The `index_classes` attribute is a list of which search indexes
        # we want to include in the search.
        index_classes = [ItemIndex, ShowIndex]
        # The `fields` contains all the fields we want to include.
        # NOTE: Make sure you don't confuse these with model attributes. These
        # fields belong to the search index!
        fields = [
            'title', 'author_name', 'autocomplete', 'thumbnail', 'id', 'url', 'provider_name'
        ]


class ItemSearchView(HaystackViewSet):

    # `index_models` is an optional list of which models you would like to include
    # in the search result. You might have several models indexed, and this provides
    # a way to filter out those of no interest for this particular view.
    # (Translates to `SearchQuerySet().models(*index_models)` behind the scenes.
    index_models = [Item, Show]
    serializer_class = ItemSearchSerializer


class SearchYoutubeView(views.APIView):
    permission_classes = []

    def get(self, request, *args, **kw):
        result = youtube_search({'q': request.GET.get('q')})
        return Response(ItemSerializer(result, many=True).data, status=status.HTTP_200_OK)


class MetadataView(views.APIView):
    permission_classes = []

    def get(self, request, *args, **kw):
        url = request.GET.get('url')
        result = Item.objects.filter(url=url).first()
        if not result:
            result = get_metadata(url)
        return Response(ItemSerializer(result, many=False).data, status=status.HTTP_200_OK)
