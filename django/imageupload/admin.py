from django.contrib import admin

from models import Image, Address, City, State

class ImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'image', 'date', 'latitude', 'longitude', 'address', 'city', 'state')
    list_display_links = ('id', 'title')
    search_fields = ('title', 'latitude', 'longitude')
    list_per_page = 50

class SimpleAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    list_display_links = ('id', 'name')
    list_per_page = 50

admin.site.register(Image, ImageAdmin)
admin.site.register(Address, SimpleAdmin)
admin.site.register(City, SimpleAdmin)
admin.site.register(State, SimpleAdmin)

# Register your models here.
