from users.models import send_email_token
from celery import shared_task

from time import sleep
from django.core.mail import send_mail


@shared_task
def send_email_notification(email, message):
    send_mail("Book shelf updated", message, "amar97march1@gmail.com",[email])
    return None