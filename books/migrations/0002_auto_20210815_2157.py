# Generated by Django 3.2.6 on 2021-08-15 21:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('books', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='book',
            name='Descripiton',
        ),
        migrations.RemoveField(
            model_name='book',
            name='page_count',
        ),
        migrations.AddField(
            model_name='book',
            name='descripiton',
            field=models.CharField(blank=True, max_length=1000, null=True),
        ),
        migrations.AlterField(
            model_name='book',
            name='author',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
