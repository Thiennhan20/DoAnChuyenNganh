# Generated by Django 5.1.3 on 2024-11-25 11:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('detail_game', '0016_chatmessage'),
    ]

    operations = [
        migrations.CreateModel(
            name='GameRoom',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('room_id', models.CharField(max_length=6, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('max_players', models.IntegerField(default=4)),
            ],
        ),
    ]
