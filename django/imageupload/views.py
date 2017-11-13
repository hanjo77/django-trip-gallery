from django.shortcuts import render
from django.http import HttpResponse
from django.core.files import File  # you need this somewhere
from os import listdir
from os import environ
from os import remove
from os.path import isdir, isfile, join
from django.db.models import Count, Min, Sum, Avg
from django.contrib.sites.shortcuts import get_current_site

from PIL import Image as JpgImage
from StringIO import StringIO
from models import Image, Address, City, State
from geopy.geocoders import Nominatim
from geopy.distance import vincenty

import simplekml
import sys
from amtrak import settings
import urllib
import simplejson as json
import time
import codecs
import re
import socket

from django.forms.models import model_to_dict
from django.core import serializers
from django.utils.encoding import force_text

def index(request):
    return render(request, 'index.html', {
        'error_message': "You didn't select a choice.",
    })

def locations(request):
    kml = simplekml.Kml()

    full_url = ''.join(['http://', request.META['HTTP_HOST'], '/api/images'])
    imageString = urllib.urlopen(full_url)
    images = json.loads(imageString.read())
    for image in images:
        data = json.dumps(image)

        kml.newpoint(
            name = image['image'],
            description = data,
            coords = [(
                image['longitude'],
                image['latitude']
            )]
        ) 

    kml.save(join(settings.MEDIA_ROOT, 'locations.kml'), format=False)

    response = HttpResponse(kml.kml())
    return response

def import_images(request):
    path = "images"
    Image.objects.all().delete()
    mediaPath = join(settings.MEDIA_ROOT, path)
    titles = [t for t in listdir(mediaPath) if isdir(join(mediaPath, t))]
    for title in titles:
        files = [f for f in listdir(join(mediaPath, title)) if isfile(join(mediaPath, title, f)) and f.lower().find(".jpg") > -1]

        for file in files:
            newPic = Image(
                image = join(path, title, file), 
                title = title
                )
            newPic.save()

    Image.objects.filter(latitude = None).delete()

    response = HttpResponse(files)
    return response

def cleanup_images(request):
    path = "images"
    response_text = ""
    mediaPath = join(settings.MEDIA_ROOT, path)
    titles = [t for t in listdir(mediaPath) if isdir(join(mediaPath, t))]
    for title in titles:
        files = [f for f in listdir(join(mediaPath, title)) if isfile(join(mediaPath, title, f))]

        for file in files:
            image = Image.objects.filter(image__icontains = file)
            if len(image) < 1:
                try:
                    remove(join(mediaPath, title, file))
                except:
                    response_text = response_text + join(path, title, file) + "<br />"

    # Update states and cites, KML and JSON files
    update_states(request)
    update_cities(request)
    locations(request)
    save_json(request)

    return HttpResponse(response_text)

def import_videos(request):
    path = "images"
    # Image.objects.all().delete()
    mediaPath = join(settings.MEDIA_ROOT, path)
    titles = [t for t in listdir(mediaPath) if isdir(join(mediaPath, t))]
    for title in titles:
        files = [f for f in listdir(join(mediaPath, title)) if isfile(join(mediaPath, title, f)) and f.lower().find(".m4v") > -1]

        for file in files:
            newPic = Image(
                image = join(path, title, file), 
                title = title
                )
            newPic.save()

    # Image.objects.filter(latitude = None).delete()

    response = HttpResponse(files)
    return response

def update_states(request):
    states = State.objects.all()

    for state in states:
        my_states = Image.objects.filter(state = state)
        my_states_latitude = my_states.order_by('latitude')
        my_states_longitude = my_states.order_by('longitude')
        state.min_latitude = my_states_latitude.first().latitude
        state.min_longitude = my_states_longitude.first().longitude
        state.max_latitude = my_states_latitude.last().latitude
        state.max_longitude = my_states_longitude.last().longitude
        state.save()

    response = HttpResponse('done')
    return response

def update_cities(request):
    cities = City.objects.all()

    for city in cities:
        my_cities = Image.objects.filter(city = city)
        if len(my_cities) > 0:
            my_cities_latitude = my_cities.order_by('latitude')
            my_cities_longitude = my_cities.order_by('longitude')
            my_cities_states = my_cities.order_by('state')
            city.min_latitude = my_cities_latitude.first().latitude
            city.min_longitude = my_cities_longitude.first().longitude
            city.max_latitude = my_cities_latitude.last().latitude
            city.max_longitude = my_cities_longitude.last().longitude
            if (my_cities_states.first().state != my_cities_states.last().state):
                print city.name + ' is not unique: ' + my_cities_states.first().state.name + ' - ' + my_cities_states.last().state.name
            city.state = my_cities_states.first().state
            city.save()
        else:
            city.delete()

    response = HttpResponse('done')
    return response

def update_videos(request):
    videos = Image.objects.filter(date = None)

    for video in videos:
        if video.image.url.find('.m4v'):
            parts = video.image.url.split('/')
            filename = parts[len(parts) - 1]
            filename = filename[0:filename.find('.m4v')]
            c = 0
            while not filename[c].isdigit():
                c = c + 1

            index = int(filename[c:])

            if filename[0] is '.':
                video.delete()
            else:
                prevImg = None
                prevIndex = index
                while not prevImg:
                    prevIndex = prevIndex - 1
                    prevImg = Image.objects.filter(image__icontains=str(prevIndex) + '.jpg').first()

                nextImg = None
                nextIndex = index
                while not nextImg:
                    nextIndex = nextIndex + 1
                    nextImg = Image.objects.filter(image__icontains=str(nextIndex) + '.jpg').first()

                prev_pos = (prevImg.latitude, prevImg.longitude)
                next_pos = (prevImg.latitude, nextImg.longitude)
                dist = vincenty(prev_pos, next_pos).kilometers
                time_diff = nextImg.date - prevImg.date
                lat_diff = nextImg.latitude - prevImg.latitude
                lng_diff = nextImg.longitude - prevImg.longitude

                video.date = prevImg.date + (time_diff / 2)
                video.latitude = prevImg.latitude + (lat_diff / 2)
                video.longitude = prevImg.longitude + (lng_diff / 2)
                video.state = prevImg.state
                video.city = prevImg.city
                video.address = prevImg.address
                video.save()

    response = HttpResponse(videos)
    return response

def save_json(request):
    for name in ['states', 'cities']:
        full_url = ''.join(['http://', request.META['HTTP_HOST'], '/api/', name])
        stateString = urllib.urlopen(full_url)
        data = json.loads(stateString.read())

        file = open(join(settings.MEDIA_ROOT, name + '.json'), 'w')
        file.write(json.dumps(data))      
        file.close() 

    response = HttpResponse('done')
    return response

def import_locations(request):
#    Address.objects.all().delete()
#    City.objects.all().delete()
#    State.objects.all().delete()
    Image.objects.filter(latitude = None).delete()
    path = "images"
    counter = 0
    output = "<h1>Import locations:</h1>"
    latlngStr = "{}, {}"
    images = Image.objects.all()
    mediaPath = join(settings.MEDIA_ROOT, path)
    geolocator = Nominatim()

    output += "<h2>Added entries:"
    output += "<ul>"
    for image in images:
        if not image.state:
            counter = counter + 1
            location = geolocator.reverse(latlngStr.format(image.latitude, image.longitude))            
            sp = location.raw["address"]

            a = ""
            title = ""

            if "place_of_worship" in sp:
                title = sp["place_of_worship"]
            elif "memorial" in sp:
                title = sp["memorial"]
            elif "water" in sp:
                title = sp["water"]
            elif "pedestrian" in sp:
                title = sp["pedestrian"]
            elif "building" in sp:
                title = sp["building"]

            if "road" in sp:
                a += sp["road"]
            elif "footway" in sp:
                a += sp["footway"]

            if "neighbourhood" in sp:
                if a:
                    a += ", "
                a += sp["neighbourhood"]

            if "suburb" in sp:
                if a:
                    a += ", "
                a += sp["suburb"]

            if not a:
                if title:
                    a = title
            if not title:
                if a:
                    title = a

            addresses = Address.objects.filter(name = a)
            address = addresses[0] if addresses.count() > 0 else Address(name = a)
            address.save()

            c = ""
            if "city" in sp:
                c = sp["city"]
            elif "town" in sp:
                c = sp["town"]
            elif "village" in sp:
                c = sp["village"]
            elif "locality" in sp:
                c = sp["locality"]
            elif "hamlet" in sp:
                c = sp["hamlet"]
            elif "county" in sp:
                c = sp["county"]

            if not title:
                title = c

                if not title:
                    title = state

            cities = City.objects.filter(name = c)
            city = cities[0] if cities.count() > 0 else City(name = c)
            city.save()

            states = State.objects.filter(name = sp["state"])
            state = states[0] if states.count() > 0 else State(name = sp["state"])
            state.save()

            image.address = address
            image.city = city
            image.state = state
            image.title = title
            image.save()

            output += "<li><h3>" + title + "</h3>" + address.name + "<br />" + city.name + "<br />" + state.name + "</li>"
            time.sleep(0.3)
    output += "</ul>"

    response = HttpResponse(output)
    return response
