from django.contrib import admin
from django.urls import path, include

from .views import *


urlpatterns = [

    path('register/',RegisterView.as_view()),
    path('verify_otp/', VerifyOtp.as_view()),
    path('profile/', UserProfile.as_view()),
    path('email_verification/', EmailVerification.as_view()),
    path('reset_password_otp/',ResetPasswordEmailOTP.as_view()),
    path('update_profile/',UpdateProfile.as_view()),
    path('friend_requests/',FriendRequest.as_view()),
    # path('friends_list/', Friends.as_view())
]