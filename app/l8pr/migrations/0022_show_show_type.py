# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-07-19 16:51
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('l8pr', '0021_auto_20160706_1254'),
    ]

    operations = [
        migrations.AddField(
            model_name='show',
            name='show_type',
            field=models.CharField(choices=[('normal', 'normal'), ('inbox', 'inbox')], default='normal', max_length=255),
        ),
    ]