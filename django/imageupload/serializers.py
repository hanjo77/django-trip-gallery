from django.contrib.auth.models import User, Group
from models import Image, State, City, Address, CityDescription, StateDescription, Language
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
        fields = ('pk', 'name', 'min_latitude', 'min_longitude', 'max_latitude', 'max_longitude')


class CitySerializer(serializers.HyperlinkedModelSerializer):
    state = StateSerializer()
    class Meta:
        model = City
        fields = ('pk', 'name', 'min_latitude', 'min_longitude', 'max_latitude', 'max_longitude', 'state')


class LanguageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Language
        fields = ('pk', 'code')


class StateDescriptionSerializer(serializers.HyperlinkedModelSerializer):
    state = StateSerializer()
    language = LanguageSerializer()
    class Meta:
        model = StateDescription
        fields = ('pk', 'language', 'state', 'description')


class CityDescriptionSerializer(serializers.HyperlinkedModelSerializer):
    city = CitySerializer()
    language = LanguageSerializer()
    class Meta:
        model = CityDescription
        fields = ('pk', 'language', 'city', 'description')


class AddressSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Address
        fields = ('pk', 'name')


class ImageSerializer(serializers.HyperlinkedModelSerializer):
    state = serializers.StringRelatedField()
    city = serializers.StringRelatedField()
    address = serializers.StringRelatedField()
    class Meta:
        model = Image
        fields = ('pk', 'url', 'image', 'title', 'latitude', 'longitude', 'state', 'city', 'address', 'mute')



