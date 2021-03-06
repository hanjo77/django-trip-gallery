"""streetart URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""

import views
import settings

from django.conf.urls import include, url
from django.contrib import admin
from rest_framework import routers


router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'images', views.ImageViewSet)
router.register(r'states', views.StateViewSet)
router.register(r'cities', views.CityViewSet)
router.register(r'state_descriptions', views.StateDescriptionViewSet)
router.register(r'city_descriptions', views.CityDescriptionViewSet)

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^', include('imageupload.urls')),
    url(r'^api/', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]

if settings.DEBUG:
    urlpatterns.append(url(r'^media/(?P<path>.*)$', 'django.views.static.serve', 
        {'document_root': settings.MEDIA_ROOT})
    )

