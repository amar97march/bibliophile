from django.db import models
from django.contrib.auth.models import AbstractUser
from .manager import UserManager
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import message, send_mail
import uuid

from django.conf import settings


class User(AbstractUser):

    username = None
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=12)
    is_phone_verified = models.BooleanField(default=False)
    is_email_verified = models.BooleanField(default=False)
    otp = models.CharField(max_length=6, null=True, blank=True)
    email_token = models.CharField(max_length=100, null=True, blank = True)
    forget_password = models.CharField(max_length = 100)
    last_login_time = models.DateTimeField(null=True, blank = True)
    last_logout_time = models.DateTimeField(null=True, blank=True)

    objects= UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def name(self):
        return self.first_name + ' ' + self.last_name

    def __str__(self):
        return self.email

@receiver(post_save, sender = User)
def send_email_token(sender, instance, created, ** kwargs):
    if created:
        try:
            subject = "Your email needs to be verifed"
            message =  f"Hi, click on the link to verify email http://127.0.0.1/email_verification/{uuid.uuid4()}/"
            email_from = settings.EMAIL_HOST_USER
            recipient_list = [instance.email]
            send_mail(subject, message, email_from,recipient_list)
        except Exception as e:
            print(e)