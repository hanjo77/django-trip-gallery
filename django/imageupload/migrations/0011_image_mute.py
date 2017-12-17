# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('imageupload', '0010_auto_20171115_2052'),
    ]

    operations = [
        migrations.AddField(
            model_name='image',
            name='mute',
            field=models.BooleanField(default=False),
        ),
    ]
