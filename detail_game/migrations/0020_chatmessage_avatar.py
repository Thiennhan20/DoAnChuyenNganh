# Generated by Django 5.1.3 on 2024-11-27 12:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('detail_game', '0019_remove_chatmessage_avatar'),
    ]

    operations = [
        migrations.AddField(
            model_name='chatmessage',
            name='avatar',
            field=models.ImageField(blank=True, null=True, upload_to='avatars/'),
        ),
    ]
