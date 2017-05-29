from django.contrib.auth.models import User
from .models import Loop, Show, Item, ShowSettings, Profile, ItemsRelationship, get_metadata, ShowsRelationship
from rest_framework import serializers, viewsets, views
from rest_framework.decorators import list_route, detail_route
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from drf_haystack.serializers import HaystackSerializerMixin, HaystackSerializer
from drf_haystack.viewsets import HaystackViewSet
from .search_indexes import ItemIndex, ShowIndex, UserIndex
from .youtube import youtube_search
from django.utils import timezone
from .permissions import IsOwnerOrReadOnly


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
        serializer.is_valid(raise_exception=True)
        return serializer.validated_data


class ShowSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShowSettings
        fields = ('shuffle', 'dj_layout', 'giphy', 'force_giphy', 'giphy_tags', 'hide_strip')


class SimpleUserProfileSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='user.id', required=True)
    username = serializers.CharField(source='user.username', required=True)

    class Meta:
        model = Profile
        fields = ('id', 'username',)


class ProfileSerializer(serializers.ModelSerializer):
    follows = SimpleUserProfileSerializer(many=True, required=False, read_only=True)
    followers = SimpleUserProfileSerializer(many=True, required=False, read_only=True)

    class Meta:
        fields = '__all__'
        model = Profile


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(many=False)

    class Meta:
        model = User
        fields = ('id', 'username', 'loops', 'profile')


class ShowNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Show
        fields = ('id', 'title')


class ShowSerializer(serializers.ModelSerializer):
    items = ItemsField()
    settings = ShowSettingsSerializer(required=False)
    user = UserSerializer(required=False, read_only=True)

    class Meta:
        model = Show
        fields = ('id', 'added', 'updated', 'show_type', 'title', 'description',
                  'items', 'user', 'settings')

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
        current_user = self.context['request'].user
        if current_user != instance.user:
            raise Exception('you can not update a show that is not yours!')
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


class ItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    # doesn't work with Youtube search view yet
    # shows = ShowNameSerializer(many=True, required=False)

    class Meta:
        fields = '__all__'
        model = Item


class LoopSerializer(serializers.ModelSerializer):
    shows_list = serializers.SerializerMethodField()
    user = UserSerializer()

    def get_current_user(self):
        user = None
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            user = request.user
        return user

    def get_shows_list(self, obj):
        shows = [sr.show for sr in ShowsRelationship.objects.filter(loop=obj)
                 .order_by('-order')]
        # remove inbox if not current user's loop
        if self.get_current_user() != obj.user:
            shows = [s for s in shows if s.show_type == 'normal']
        return ShowSerializer(shows, many=True, read_only=True).data

    class Meta:
        model = Loop
        fields = ('id', 'shows_list', 'user', 'active', 'feed_json')


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
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        return Response(UserSerializer(request.user, context={'request': request}).data, status=status.HTTP_200_OK)

    @detail_route(methods=['post'], permission_classes=[IsOwnerOrReadOnly])
    def follow(self, request, pk=None):
        profile = get_object_or_404(Profile, user=pk)
        request.user.profile.follows.add(profile)
        return Response(UserSerializer(request.user, context={'request': request}).data, status=status.HTTP_200_OK)

    @detail_route(methods=['post'], permission_classes=[IsOwnerOrReadOnly])
    def unfollow(self, request, pk=None):
        profile = get_object_or_404(Profile, user=pk)
        request.user.profile.follows.remove(profile)
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
    filter_fields = ('user', 'show_type')
    ordering_fields = ('updated',)


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.distinct()
    serializer_class = ItemSerializer
    filter_fields = ('url', 'shows__user__username')


class ItemSearchSerializer(HaystackSerializerMixin, ItemSerializer):
    class Meta(ItemSerializer.Meta):
        search_fields = ('text', 'title',)
        field_aliases = {}
        exclude = []


class ShowSearchSerializer(HaystackSerializerMixin, ShowSerializer):
    class Meta(ShowSerializer.Meta):
        search_fields = ('text', 'title',)
        field_aliases = {}
        exclude = []


class UserSearchSerializer(HaystackSerializerMixin, UserSerializer):
    class Meta(UserSerializer.Meta):
        search_fields = ('text', 'username',)
        field_aliases = {}
        exclude = []


class AggregateSearchSerializer(HaystackSerializer):
    class Meta:
        serializers = {
            ItemIndex: ItemSearchSerializer,
            ShowIndex: ShowSearchSerializer,
            UserIndex: UserSearchSerializer,
        }


class ItemSearchView(HaystackViewSet):
    permission_classes = []
    serializer_class = AggregateSearchSerializer
    # to remove in order to have more than Items in results
    index_models = [Item, Show]


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
