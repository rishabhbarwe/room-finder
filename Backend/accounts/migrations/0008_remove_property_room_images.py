# Generated by Django 5.2.1 on 2025-05-14 20:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0007_property_room_images'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='property',
            name='room_images',
        ),
    ]
