# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-07-06 12:54
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('l8pr', '0020_auto_20160706_0942'),
    ]

    operations = [
        migrations.AddField(
            model_name='loop',
            name='feed_json',
            field=models.TextField(blank=True, default='[]', null=True),
        ),
        migrations.AddField(
            model_name='loop',
            name='twitter_keywords',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
