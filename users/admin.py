from django.contrib import admin


from .models import *


class FriendAdmin(admin.ModelAdmin):
	list_display = ('sender','receiver','created_at','updated_at',)


admin.site.register(Friends, FriendAdmin)


admin.site.register(User)
