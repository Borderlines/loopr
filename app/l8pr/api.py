from django.contrib.auth.models import User
from .models import Loop, Show, Item, ShowSettings, Profile, ItemsRelationship
from rest_framework import serializers, viewsets
from rest_framework.decorators import list_route
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status


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
        fields = ('id', 'added', 'updated', 'title', 'description', 'show_type', 'items', 'user', 'settings')

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
    loops = LoopSerializer(many=True)
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


class ShowViewSet(viewsets.ModelViewSet):
    queryset = Show.objects.all()
    serializer_class = ShowSerializer
    filter_fields = ('user',)


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
