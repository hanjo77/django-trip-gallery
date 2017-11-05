# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('imageupload', '0003_auto_20171104_2029'),
    ]

    operations = [
        migrations.AddField(
            model_name='city',
            name='max_latitude',
            field=models.FloatField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='city',
            name='max_longtude',
            field=models.FloatField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='city',
            name='min_latitude',
            field=models.FloatField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='city',
            name='min_longtude',
            field=models.FloatField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='state',
            name='max_latitude',
            field=models.FloatField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='state',
            name='max_longtude',
            field=models.FloatField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='state',
            name='min_latitude',
            field=models.FloatField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='state',
            name='min_longtude',
            field=models.FloatField(null=True, blank=True),
        ),
    ]
