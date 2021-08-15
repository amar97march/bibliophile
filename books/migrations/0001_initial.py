# Generated by Django 3.2.6 on 2021-08-15 21:00

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Book',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('unique_book_id', models.CharField(max_length=50, unique=True)),
                ('author', models.CharField(max_length=200)),
                ('published_date', models.DateField(blank=True, null=True)),
                ('Descripiton', models.CharField(max_length=1000)),
                ('page_count', models.IntegerField(blank=True, null=True)),
            ],
        ),
    ]
