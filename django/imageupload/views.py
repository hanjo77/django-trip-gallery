from django.shortcuts import render
from django.http import HttpResponse
from django.core.files import File  # you need this somewhere
from os import listdir
from os.path import isdir, isfile, join

from PIL import Image as JpgImage
from StringIO import StringIO
from models import Image

import simplekml
from amtrak import settings
import urllib

def index(request):
    return render(request, 'index.html', {
        'error_message': "You didn't select a choice.",
    })

def locations(request):
    kml = simplekml.Kml()
    images = Image.objects.all().order_by('date')
    for image in images:
        kml.newpoint(
            name = image.image.url, 
            coords = [(
                image.longitude,
                image.latitude
            )]
        ) 

    response = HttpResponse(kml.kml())
    # response['Content-Disposition'] = 'attachment; filename="locations.kml"'
    # response['Content-Type'] = 'application/kml'
    return response

def import_images(request):
    path = "images"
    Image.objects.all().delete()
    mediaPath = join(settings.MEDIA_ROOT, path)
    titles = [t for t in listdir(mediaPath) if isdir(join(mediaPath, t))]
    for title in titles:
        print title
        files = [f for f in listdir(join(mediaPath, title)) if isfile(join(mediaPath, title, f)) and f.lower().find(".jpg") > -1]

        for file in files:
            print file
            newPic = Image(
                image = join(path, title, file), 
                title = title
                )
            newPic.save()

    Image.objects.filter(latitude = None).delete()

    response = HttpResponse(files)
    return response
