from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.deletion import CASCADE
from .manager import UserManager
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import message, send_mail
import uuid

from django.conf import settings


class User(AbstractUser):

    username = None
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=12, unique=True)
    description = models.CharField(max_length=200, null=True, blank = True)
    is_phone_verified = models.BooleanField(default=False)
    is_email_verified = models.BooleanField(default=False)
    otp = models.CharField(max_length=6, null=True, blank=True)
    email_token = models.CharField(max_length=100, null=True, blank = True)
    last_logout_time = models.DateTimeField(null=True, blank=True)
    profile_image = models.FileField(upload_to='uploads/',null = True, blank = True)

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
            email_token = uuid.uuid4()
            subject = "Your email needs to be verifed"
            message =  f"Hi, click on the link to verify email https://bibliophile-react-django.herokuapp.com/users/email_verification/{instance.email}/{email_token}/"
            email_from = settings.EMAIL_HOST_USER
            recipient_list = [instance.email]
            send_mail(subject, message, email_from,recipient_list)
            instance.email_token = email_token
            instance.save()
        except Exception as e:
            print(e)

class Friends(models.Model):
    sender = models.ForeignKey(User, related_name='friends_sender',on_delete=CASCADE)
    receiver = models.ForeignKey(User, related_name='friends_receiver', on_delete=CASCADE)
    accepted = models.BooleanField(default=False)