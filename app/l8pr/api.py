from django.contrib.auth.models import User
from .models import Loop, Show, Item, ShowSettings
from rest_framework import serializers, viewsets
from rest_framework.decorators import list_route
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status


# Serializers define the API representation.
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'is_staff', 'id')


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @list_route(methods=['get'], url_path='username/(?P<username>\w+)')
    def getByUsername(self, request, username):
        user = get_object_or_404(User, username=username)
        return Response(UserSerializer(user, context={'request': request}).data, status=status.HTTP_200_OK)


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item


class ShowSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShowSettings


class ShowSerializer(serializers.ModelSerializer):
    items = ItemSerializer(many=True, read_only=True)
    settings = ShowSettingsSerializer(many=False, allow_null=True)

    class Meta:
        model = Show
        fields = ('added', 'updated', 'title', 'description', 'show_type', 'loop', 'items', 'user', 'settings')


class LoopSerializer(serializers.ModelSerializer):
    shows_list = ShowSerializer(many=True, read_only=True)

    class Meta:
        model = Loop
        fields = ('shows_list', 'user', 'active')


class LoopViewSet(viewsets.ModelViewSet):
    queryset = Loop.objects.all()
    serializer_class = LoopSerializer
    filter_fields = ('user',)


class ShowViewSet(viewsets.ModelViewSet):
    queryset = Show.objects.all()
    serializer_class = ShowSerializer


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
