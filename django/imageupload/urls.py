from django.conf.urls import url

import views

urlpatterns = [
    url(r'^import_images$', views.import_images, name='import_images'),
    url(r'^import_videos$', views.import_videos, name='import_videos'),
    url(r'^update_videos$', views.update_videos, name='update_videos'),
    url(r'^import_locations$', views.import_locations, name='import_locations'),
    url(r'^locations\.kml$', views.locations, name='locations'),
    url(r'^$', views.index, name='index'),
]

