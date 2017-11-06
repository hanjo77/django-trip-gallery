from django.contrib.auth.models import User, Group
from models import Image, State, City, Address
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')


class StateSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = State
        fields = ('name', 'min_latitude', 'min_longitude', 'max_latitude', 'max_longitude')


class CitySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = City
        fields = ('name', 'min_latitude', 'min_longitude', 'max_latitude', 'max_longitude')


class AddressSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Address
        fields = ('pk', 'name')


class ImageSerializer(serializers.HyperlinkedModelSerializer):
    state = StateSerializer()
    city = CitySerializer()
    address = AddressSerializer()
    class Meta:
        model = Image
        fields = ('url', 'image', 'title', 'latitude', 'longitude', 'state', 'city', 'address')



