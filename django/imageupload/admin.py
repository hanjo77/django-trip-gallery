from django.contrib import admin

from models import Image, Address, City, State, Language, CityDescription, StateDescription

class ImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'image', 'date', 'latitude', 'longitude', 'address', 'city', 'state')
    list_display_links = ('id', 'title')
    search_fields = ('title', 'latitude', 'longitude')
    list_per_page = 50

class SimpleAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    list_display_links = ('id', 'name')
    list_per_page = 50

class LanguageAdmin(admin.ModelAdmin):
    list_display = ('id', 'code', 'name')
    list_display_links = ('id', 'code', 'name')
    list_per_page = 50

class CityDescriptionAdmin(admin.ModelAdmin):
    list_display = ('id', 'city', 'language', 'description')
    list_display_links = ('id', 'language')
    list_per_page = 50

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "city":
            kwargs["queryset"] = City.objects.order_by('name')
        if db_field.name == "language":
            kwargs["queryset"] = Language.objects.order_by('name')
        return super(CityDescriptionAdmin, self).formfield_for_foreignkey(db_field, request, **kwargs)

class StateDescriptionAdmin(admin.ModelAdmin):
    list_display = ('id', 'state', 'language', 'description')
    list_display_links = ('id', 'language')
    list_per_page = 50

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "state":
            kwargs["queryset"] = State.objects.order_by('name')
        if db_field.name == "language":
            kwargs["queryset"] = Language.objects.order_by('name')
        return super(StateDescriptionAdmin, self).formfield_for_foreignkey(db_field, request, **kwargs)

admin.site.register(Image, ImageAdmin)
admin.site.register(Address, SimpleAdmin)
admin.site.register(City, SimpleAdmin)
admin.site.register(State, SimpleAdmin)
admin.site.register(Language, LanguageAdmin)
admin.site.register(CityDescription, CityDescriptionAdmin)
admin.site.register(StateDescription, StateDescriptionAdmin)

# Register your models here.
