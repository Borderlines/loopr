from django.contrib import admin
from .models import Loop, Show, Item, ShowsRelationship, ShowSettings
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User


class ShowsRelationshipInline(admin.TabularInline):
    model = Loop.shows_list.through


class ItemInline(admin.TabularInline):
    model = Item


class LoopAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'active')
    inlines = (ShowsRelationshipInline,)

admin.site.register(Loop, LoopAdmin)


class ShowSettingsAdmin(admin.ModelAdmin):
    pass

admin.site.register(ShowSettings, ShowSettingsAdmin)


class ShowAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'loop', 'show_type', 'added', 'updated')
    inlines = (ItemInline,)

admin.site.register(Show, ShowAdmin)


class ItemAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'author_name', 'provider_name', 'duration')
admin.site.register(Item, ItemAdmin)


class ShowsRelationshipAdmin(admin.ModelAdmin):
    pass
admin.site.register(ShowsRelationship, ShowsRelationshipAdmin)


# class ProfileInline(admin.StackedInline):
#     model = Profile


# class ProfileAdmin(UserAdmin):
#     inlines = [ProfileInline, ]
#
#
# admin.site.unregister(User)
# admin.site.register(User, ProfileAdmin)
