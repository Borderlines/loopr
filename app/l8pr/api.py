from django.contrib.auth.models import User
from .models import Loop, Show, Item, ShowSettings, Profile, ItemsRelationship, get_metadata
from rest_framework import serializers, viewsets, views
from rest_framework.decorators import list_route
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from drf_haystack.serializers import HaystackSerializer
from drf_haystack.viewsets import HaystackViewSet
from .search_indexes import ItemIndex, ShowIndex
from .youtube import youtube_search


class ItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = Item


class ShowSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShowSettings


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile


class ShowSerializer(serializers.ModelSerializer):
    items = ItemSerializer(many=True, read_only=False)
    settings = ShowSettingsSerializer(many=False, allow_null=True)

    class Meta:
        model = Show
        fields = ('id', 'added', 'updated', 'title', 'description', 'items', 'user', 'settings')

    def update(self, instance, validated_data):
        order = 0
        instance.items.clear()
        for item in validated_data.get('items', []):
            ItemsRelationship.objects.create(
                item=Item.objects.get(pk=item['id']),
                show=instance,
                order=order
            )
            order += 1
        return instance


class LoopSerializer(serializers.ModelSerializer):
    shows_list = ShowSerializer(many=True, read_only=False)

    class Meta:
        model = Loop
        fields = ('shows_list', 'user', 'active')


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
        return Loop.objects.filter(user__username=username)


class ShowViewSet(viewsets.ModelViewSet):
    queryset = Show.objects.all()
    serializer_class = ShowSerializer
    filter_fields = ('user',)

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
