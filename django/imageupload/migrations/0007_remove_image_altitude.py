# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('imageupload', '0006_image_altitude'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='image',
            name='altitude',
        ),
    ]
