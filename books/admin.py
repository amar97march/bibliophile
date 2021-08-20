"""Admin section for books"""
from django.contrib import admin


from .models import *

admin.site.register(Book)
admin.site.register(BookReview)
admin.site.register(Wishlist)
admin.site.register(Shelflist)
admin.site.register(Readlist)
