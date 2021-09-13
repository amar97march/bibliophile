from django.contrib import admin


from .models import *
from django.contrib import admin
from django.utils.translation import ugettext_lazy as _

from users.models import User


admin.register(User)


class FriendAdmin(admin.ModelAdmin):
	list_display = ('sender','receiver','created_at','updated_at',)


admin.site.register(Friends, FriendAdmin)
