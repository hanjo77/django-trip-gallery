# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('imageupload', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='image',
            name='date',
            field=models.DateTimeField(null=True, blank=True),
        ),
    ]
