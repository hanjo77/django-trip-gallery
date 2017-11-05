from django.db import models
from datetime import datetime
from django.utils import timezone
import exifread
import pytz

# based on https://gist.github.com/erans/983821

def _get_if_exist(data, key):
    if key in data:
        return data[key]

    return None


def _convert_to_degress(value):
    """
    Helper function to convert the GPS coordinates stored in the EXIF to degress in float format
    :param value:
    :type value: exifread.utils.Ratio
    :rtype: float
    """
    d = float(value.values[0].num) / float(value.values[0].den)
    m = float(value.values[1].num) / float(value.values[1].den)
    s = float(value.values[2].num) / float(value.values[2].den)

    return d + (m / 60.0) + (s / 3600.0)
    
def get_exif_location(exif_data):
    """
    Returns the latitude and longitude, if available, from the provided exif_data (obtained through get_exif_data above)
    """
    lat = None
    lon = None
    date = None

    gps_latitude = _get_if_exist(exif_data, 'GPS GPSLatitude')
    gps_latitude_ref = _get_if_exist(exif_data, 'GPS GPSLatitudeRef')
    gps_longitude = _get_if_exist(exif_data, 'GPS GPSLongitude')
    gps_longitude_ref = _get_if_exist(exif_data, 'GPS GPSLongitudeRef')
    exif_date = _get_if_exist(exif_data, 'EXIF DateTimeOriginal')

    if exif_date:
        try:
            date = datetime.strptime(str(exif_date), '%Y:%m:%d %H:%M:%S').replace(tzinfo=pytz.UTC)
        except ValueError:
            print exif_date

    if gps_latitude and gps_latitude_ref and gps_longitude and gps_longitude_ref:
        lat = _convert_to_degress(gps_latitude)
        if gps_latitude_ref.values[0] != 'N':
            lat = 0 - lat

        lon = _convert_to_degress(gps_longitude)
        if gps_longitude_ref.values[0] != 'E':
            lon = 0 - lon

    return lat, lon, date

class Image(models.Model):
    image = models.ImageField(upload_to='../media/images')
    title = models.CharField(max_length=60, blank=True, help_text="Descriptive image title")
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    date = models.DateTimeField(null=True, blank=True)
    address = models.ForeignKey('Address', on_delete=models.CASCADE, null=True, blank=True)
    city = models.ForeignKey('City', on_delete=models.CASCADE, null=True, blank=True)
    state = models.ForeignKey('State', on_delete=models.CASCADE, null=True, blank=True)

    def save(self):
        exif = get_exif_location(exifread.process_file(self.image.file, details=False))
        
        if exif[0]:
            self.latitude = exif[0]
            self.longitude = exif[1]
            self.date = exif[2]

        return super(Image, self).save()
    
class State(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return '%s' % (self.name)

class City(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return '%s' % (self.name)

class Address(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return '%s' % (self.name)

# Create your models here.
