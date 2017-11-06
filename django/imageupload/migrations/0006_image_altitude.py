# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('imageupload', '0005_auto_20171105_1934'),
    ]

    operations = [
        migrations.AddField(
            model_name='image',
            name='altitude',
            field=models.FloatField(null=True, blank=True),
        ),
    ]
