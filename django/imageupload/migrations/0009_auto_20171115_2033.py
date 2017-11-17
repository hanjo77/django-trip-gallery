# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('imageupload', '0008_city_state'),
    ]

    operations = [
        migrations.AddField(
            model_name='city',
            name='description',
            field=models.TextField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='state',
            name='description',
            field=models.TextField(null=True, blank=True),
        ),
    ]
