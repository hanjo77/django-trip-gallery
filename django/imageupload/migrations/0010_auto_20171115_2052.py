# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('imageupload', '0009_auto_20171115_2033'),
    ]

    operations = [
        migrations.CreateModel(
            name='CityDescription',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('description', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Language',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('code', models.CharField(unique=True, max_length=8)),
                ('name', models.CharField(unique=True, max_length=64)),
            ],
        ),
        migrations.CreateModel(
            name='StateDescription',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('description', models.TextField()),
                ('language', models.ForeignKey(to='imageupload.Language')),
            ],
        ),
        migrations.RemoveField(
            model_name='city',
            name='description',
        ),
        migrations.RemoveField(
            model_name='state',
            name='description',
        ),
        migrations.AddField(
            model_name='statedescription',
            name='state',
            field=models.ForeignKey(to='imageupload.State'),
        ),
        migrations.AddField(
            model_name='citydescription',
            name='city',
            field=models.ForeignKey(to='imageupload.City'),
        ),
        migrations.AddField(
            model_name='citydescription',
            name='language',
            field=models.ForeignKey(to='imageupload.Language'),
        ),
    ]
