from django.contrib.auth.models import User, Group
from rest_framework import viewsets

from imageupload.serializers import UserSerializer, GroupSerializer, ImageSerializer, StateSerializer, CitySerializer, CityDescriptionSerializer, StateDescriptionSerializer
from imageupload.models import Image, State, City, StateDescription, CityDescription

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class ImageViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Image.objects.all().order_by('date')
    serializer_class = ImageSerializer

class StateViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = State.objects.all().order_by('name')
    serializer_class = StateSerializer

class CityViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = City.objects.all().order_by('name')
    serializer_class = CitySerializer

class CityDescriptionViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = CityDescription.objects.all().order_by('city').order_by('language')
    serializer_class = CityDescriptionSerializer

class StateDescriptionViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = StateDescription.objects.all().order_by('state').order_by('language')
    serializer_class = StateDescriptionSerializer
