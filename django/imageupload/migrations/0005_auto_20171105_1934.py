# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('imageupload', '0004_auto_20171105_1921'),
    ]

    operations = [
        migrations.RenameField(
            model_name='city',
            old_name='max_longtude',
            new_name='max_longitude',
        ),
        migrations.RenameField(
            model_name='city',
            old_name='min_longtude',
            new_name='min_longitude',
        ),
        migrations.RenameField(
            model_name='state',
            old_name='max_longtude',
            new_name='max_longitude',
        ),
        migrations.RenameField(
            model_name='state',
            old_name='min_longtude',
            new_name='min_longitude',
        ),
    ]
