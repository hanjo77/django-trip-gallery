# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('imageupload', '0007_remove_image_altitude'),
    ]

    operations = [
        migrations.AddField(
            model_name='city',
            name='state',
            field=models.ForeignKey(blank=True, to='imageupload.State', null=True),
        ),
    ]
