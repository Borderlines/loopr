# -*- coding: utf-8 -*-
# Generated by Django 1.9.3 on 2016-05-28 10:42
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('l8pr', '0008_auto_20160525_1213'),
    ]

    operations = [
        migrations.AddField(
            model_name='item',
            name='description',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
