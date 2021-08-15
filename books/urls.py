from django.contrib import admin
from django.urls import path, include

from .views import *


urlpatterns = [

    path('book_info/<book_id>/',FriendRequest.as_view()),
    # path('friends_list/', Friends.as_view())
]