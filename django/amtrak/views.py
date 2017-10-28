from django.contrib.auth.models import User, Group
from rest_framework import viewsets

from imageupload.serializers import UserSerializer, GroupSerializer, ImageSerializer
from imageupload.models import Image

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
