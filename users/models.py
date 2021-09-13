"""Models for user"""
from django.db import models
from django.db.models.deletion import CASCADE
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
import uuid
import logging

from django.db import models

from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin, UserManager
from core.models import AbstractBaseModel

from django.conf import settings


class User(PermissionsMixin, AbstractBaseUser, AbstractBaseModel):
    
    username = None
    is_active = models.BooleanField('Active', default=True)
    phone = models.CharField(max_length=15, null=True, blank= True)
    first_name = models.CharField(max_length=50, null=True, blank = True)
    last_name = models.CharField(max_length=50, null=True, blank = True)
    description = models.CharField(max_length=200, null=True, blank = True)
    sub = models.UUIDField(editable=False, unique=True)
    email= models.EmailField(null=True, blank=True)
    profile_image = models.FileField(upload_to='uploads/', null=True, blank=True)
    is_phone_verified = models.BooleanField(default=False)
    is_email_verified = models.BooleanField(default=False)
    otp = models.CharField(max_length=6, null=True, blank=True)
    email_token = models.CharField(max_length=100, null=True, blank = True)
    is_staff = models.BooleanField(
        'staff status',
        default=False,
        help_text='Designates whether the user can log into this admin site.'
    )
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    objects = UserManager()

    USERNAME_FIELD = 'sub'
    REQUIRED_FIELDS = []  # used only on createsuperuser

    @property
    def is_django_user(self):
        # btw, all django-users is designed to be able to login into django-admin.
        # Filtering by 'is_staff' will also work
        return self.has_usable_password()


@receiver(post_save, sender = User)
def send_email_token(sender, instance, created, ** kwargs):
    if created:
        try:
            email_token = uuid.uuid4()
            subject = "Your email needs to be verifed"
            message = f"Hi, click on the link to verify email https://bibliophile-react-django.herokuapp.com/" \
                      f"verify_email/{instance.email}/{email_token}/"
            email_from = settings.EMAIL_HOST_USER
            recipient_list = [instance.email]
            send_mail(subject, message, email_from, recipient_list)
            instance.email_token = email_token
            instance.save()
        except Exception as e:
            logging.error(e)


class Friends(models.Model):
    """friend model"""
    sender = models.ForeignKey(User, related_name='friends_sender',on_delete=CASCADE)
    receiver = models.ForeignKey(User, related_name='friends_receiver', on_delete=CASCADE)
    accepted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)
    status = models.BooleanField(default=True)
