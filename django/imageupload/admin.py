from django.contrib import admin

from models import Image

class ImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'image', 'date', 'latitude', 'longitude')
    list_display_links = ('id', 'title')
    search_fields = ('title', 'latitude', 'longitude')
    list_per_page = 5000

admin.site.register(Image, ImageAdmin)

# Register your models here.
