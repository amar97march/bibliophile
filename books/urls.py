"""Urls for books APIs"""
from django.contrib import admin
from django.urls import path, include

from .views import *


urlpatterns = [

    path('book_info/<book_id>/', BookInfo.as_view()),
    path('book_reviews/', BookReviews.as_view()),
    path('book_wishlist/', BookWishlist.as_view()),
    path('book_readlist/', BookReadlist.as_view()),
    path('book_shelflist/', BookShelflist.as_view()),
    # path('friends_list/', Friends.as_view())
]
