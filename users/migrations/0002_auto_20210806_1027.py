# Generated by Django 3.2.6 on 2021-08-06 10:27

from django.db import migrations, models
import users.manager


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelManagers(
            name='user',
            managers=[
                ('objects', users.manager.UserManager()),
            ],
        ),
        migrations.AddField(
            model_name='user',
            name='is_email_verified',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='user',
            name='is_phone_verified',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='user',
            name='otp',
            field=models.CharField(blank=True, max_length=6, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='mobile',
            field=models.CharField(max_length=12),
        ),
    ]
