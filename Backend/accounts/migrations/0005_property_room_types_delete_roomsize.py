# Generated by Django 5.2.1 on 2025-05-13 21:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_remove_roomsize_size'),
    ]

    operations = [
        migrations.AddField(
            model_name='property',
            name='room_types',
            field=models.JSONField(default=list),
        ),
        migrations.DeleteModel(
            name='RoomSize',
        ),
    ]
