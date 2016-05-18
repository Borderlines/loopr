# -*- coding: utf-8 -*-
# Generated by Django 1.9.3 on 2016-05-18 13:34
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('l8pr', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='provider_name',
            field=models.CharField(blank=True, choices=[('YouTube', 'YouTube'), ('SoundCloud', 'SoundCloud')], max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='item',
            name='show',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='items', to='l8pr.Show'),
        ),
    ]
