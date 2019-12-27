from django.contrib import admin

from short_link.models import ShortUrl, Transition


@admin.register(ShortUrl)
class AuthorAdmin(admin.ModelAdmin):
    pass


@admin.register(Transition)
class AuthorAdmin(admin.ModelAdmin):
    pass
