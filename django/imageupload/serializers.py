from django.contrib.auth.models import User, Group
from models import Image, State, City
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')


class ImageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Image
        fields = ('url', 'image', 'title', 'latitude', 'longitude')


class StateSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = State
        fields = ('pk', 'name', 'min_latitude', 'min_longitude', 'max_latitude', 'max_longitude')


class CitySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = City
        fields = ('pk', 'name', 'min_latitude', 'min_longitude', 'max_latitude', 'max_longitude')


