# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('imageupload', '0002_image_date'),
    ]

    operations = [
        migrations.CreateModel(
            name='Address',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(unique=True, max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='City',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(unique=True, max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='State',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(unique=True, max_length=255)),
            ],
        ),
        migrations.AddField(
            model_name='image',
            name='address',
            field=models.ForeignKey(blank=True, to='imageupload.Address', null=True),
        ),
        migrations.AddField(
            model_name='image',
            name='city',
            field=models.ForeignKey(blank=True, to='imageupload.City', null=True),
        ),
        migrations.AddField(
            model_name='image',
            name='state',
            field=models.ForeignKey(blank=True, to='imageupload.State', null=True),
        ),
    ]
