# Generated by Django 5.1.3 on 2024-11-15 18:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('detail_game', '0010_highscore_levels_completed_highscore_total_play_time'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='highscore',
            name='levels_completed',
        ),
        migrations.RemoveField(
            model_name='highscore',
            name='total_play_time',
        ),
    ]