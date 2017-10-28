# StreetArt

This shall become an open street art gallery where users can register and upload their favourite pictures of street art. The pictures will be located on a map and tagged to be rediscovered or remembered even if they should be removed in the meanwhile.

## Technology

The gallery is built on

* Python 2.7
* Django 1.8.4
* jQuery 2.2.4
* Google Maps API v3

## Installation

To install this gallery on your own environment, consider to install first the Python modules `ExifRead` and `SimpleKML`, preferably using `PIP`:

```
pip install ExifRead
pip install SimpleKML
```

Then, change the file `streetart/settings.py` according to your preferences, change the Placeholder `[Google Maps API Key]` in `imageupload/templates/index.html` to your own Google Maps API Key and go to the root directory of this repository and setup the database:

```
python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic
```

Eventually, open `127.0.0.1:8000` in your browser.