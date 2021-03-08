# Generated by Django 3.0.8 on 2021-03-01 18:22

import apps.core.mechanics
import apps.core.profiles
from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import enumfields.fields
import jsonfield.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0011_update_proxy_permissions'),
    ]

    operations = [
        migrations.CreateModel(
            name='EmotionProfile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('valence', models.FloatField(default=0, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(1)])),
                ('arousal', models.FloatField(default=0, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(1)])),
            ],
        ),
        migrations.CreateModel(
            name='GamerProfile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('disruptor', models.FloatField(default=1, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(1)])),
                ('free_spirit', models.FloatField(default=1, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(1)])),
                ('achiever', models.FloatField(default=1, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(1)])),
                ('player', models.FloatField(default=1, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(1)])),
                ('socializer', models.FloatField(default=1, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(1)])),
                ('philantropist', models.FloatField(default=1, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(1)])),
                ('no_player', models.FloatField(default=0, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(1)])),
                ('data', jsonfield.fields.JSONField(default=dict)),
            ],
        ),
        migrations.CreateModel(
            name='GMechanic',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('html', models.TextField(default='')),
                ('mechanic_type', enumfields.fields.EnumField(default='Unknown', enum=apps.core.mechanics.GMechanic.MechanicType, max_length=12)),
            ],
        ),
        migrations.CreateModel(
            name='SocialProfile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', enumfields.fields.EnumField(default='diamond', enum=apps.core.profiles.SocialProfile.AvatarType, max_length=11)),
                ('description', models.TextField(default='')),
                ('data', jsonfield.fields.JSONField(default=list)),
            ],
        ),
        migrations.CreateModel(
            name='Adaptative',
            fields=[
                ('gmechanic_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='core.GMechanic')),
            ],
            bases=('core.gmechanic',),
        ),
        migrations.CreateModel(
            name='AdaptativeWidget',
            fields=[
                ('gmechanic_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='core.GMechanic')),
            ],
            bases=('core.gmechanic',),
        ),
        migrations.CreateModel(
            name='BadgeWidget',
            fields=[
                ('gmechanic_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='core.GMechanic')),
            ],
            bases=('core.gmechanic',),
        ),
        migrations.CreateModel(
            name='ChallengeWidget',
            fields=[
                ('gmechanic_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='core.GMechanic')),
            ],
            bases=('core.gmechanic',),
        ),
        migrations.CreateModel(
            name='DevelopmentTool',
            fields=[
                ('gmechanic_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='core.GMechanic')),
                ('mechanic_class', enumfields.fields.EnumField(default='Badge', enum=apps.core.mechanics.DevelopmentTool.Mechanic, max_length=10)),
                ('attempts', models.IntegerField(default=1, validators=[django.core.validators.MinValueValidator(1)])),
            ],
            bases=('core.gmechanic',),
        ),
        migrations.CreateModel(
            name='DevelopmentToolWidget',
            fields=[
                ('gmechanic_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='core.GMechanic')),
            ],
            bases=('core.gmechanic',),
        ),
        migrations.CreateModel(
            name='EasterEgg',
            fields=[
                ('gmechanic_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='core.GMechanic')),
                ('feedback', models.ImageField(default='easter_egg_icons/well_done.jpg', upload_to='easter_egg_icons')),
                ('egg_html', models.TextField(default='')),
            ],
            bases=('core.gmechanic',),
        ),
        migrations.CreateModel(
            name='EasterEggWidget',
            fields=[
                ('gmechanic_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='core.GMechanic')),
            ],
            bases=('core.gmechanic',),
        ),
        migrations.CreateModel(
            name='Gift',
            fields=[
                ('gmechanic_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='core.GMechanic')),
            ],
            bases=('core.gmechanic',),
        ),
        migrations.CreateModel(
            name='GiftOpener',
            fields=[
                ('gmechanic_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='core.GMechanic')),
            ],
            bases=('core.gmechanic',),
        ),
        migrations.CreateModel(
            name='GiftOpenerWidget',
            fields=[
                ('gmechanic_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='core.GMechanic')),
            ],
            bases=('core.gmechanic',),
        ),
        migrations.CreateModel(
            name='GiftWidget',
            fields=[
                ('gmechanic_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='core.GMechanic')),
            ],
            bases=('core.gmechanic',),
        ),
        migrations.CreateModel(
            name='GMechanicList',
            fields=[
                ('gmechanic_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='core.GMechanic')),
                ('mechanic', enumfields.fields.EnumField(default='badges', enum=apps.core.mechanics.GMechanicList.Mechanics, max_length=17)),
            ],
            bases=('core.gmechanic',),
        ),
        migrations.CreateModel(
            name='KnowledgeShare',
            fields=[
                ('gmechanic_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='core.GMechanic')),
                ('messages', jsonfield.fields.JSONField(default=dict)),
            ],
            bases=('core.gmechanic',),
        ),
        migrations.CreateModel(
            name='KnowledgeShareWidget',
            fields=[
                ('gmechanic_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='core.GMechanic')),
                ('messages', jsonfield.fields.JSONField(default=dict)),
            ],
            bases=('core.gmechanic',),
        ),
        migrations.CreateModel(
            name='Leaderboard',
            fields=[
                ('gmechanic_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='core.GMechanic')),
                ('leadders', jsonfield.fields.JSONField(default=dict)),
                ('length', models.IntegerField(default=0, validators=[django.core.validators.MinValueValidator(0)])),
                ('sort_by', models.CharField(default='', max_length=100)),
            ],
            bases=('core.gmechanic',),
        ),
        migrations.CreateModel(
            name='LeaderboardWidget',
            fields=[
                ('gmechanic_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='core.GMechanic')),
            ],
            bases=('core.gmechanic',),
        ),
        migrations.CreateModel(
            name='Level',
            fields=[
                ('gmechanic_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='core.GMechanic')),
                ('value', models.IntegerField(default=0, validators=[django.core.validators.MinValueValidator(0)])),
                ('max_value', models.IntegerField(default=1, validators=[django.core.validators.MinValueValidator(0)])),
                ('by', models.CharField(default='', max_length=100)),
            ],
            bases=('core.gmechanic',),
        ),
        migrations.CreateModel(
            name='LevelWidget',
            fields=[
                ('gmechanic_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='core.GMechanic')),
            ],
            bases=('core.gmechanic',),
        ),
        migrations.CreateModel(
            name='Lottery',
            fields=[
                ('gmechanic_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='core.GMechanic')),
                ('items', jsonfield.fields.JSONField(default=list)),
                ('by', models.CharField(default='', max_length=100)),
            ],
            bases=('core.gmechanic',),
        ),
        migrations.CreateModel(
            name='LotteryWidget',
            fields=[
                ('gmechanic_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='core.GMechanic')),
            ],
            bases=('core.gmechanic',),
        ),
        migrations.CreateModel(
            name='PointWidget',
            fields=[
                ('gmechanic_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='core.GMechanic')),
            ],
            bases=('core.gmechanic',),
        ),
        migrations.CreateModel(
            name='SocialNetwork',
            fields=[
                ('gmechanic_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='core.GMechanic')),
                ('messages', jsonfield.fields.JSONField(default=dict)),
            ],
            bases=('core.gmechanic',),
        ),
        migrations.CreateModel(
            name='SocialNetworkWidget',
            fields=[
                ('gmechanic_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='core.GMechanic')),
            ],
            bases=('core.gmechanic',),
        ),
        migrations.CreateModel(
            name='SocialStatus',
            fields=[
                ('gmechanic_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='core.GMechanic')),
                ('competitiveness', enumfields.fields.EnumField(default='High', enum=apps.core.mechanics.SocialStatus.CompetitionLevel, max_length=6)),
            ],
            bases=('core.gmechanic',),
        ),
        migrations.CreateModel(
            name='SocialStatusWidget',
            fields=[
                ('gmechanic_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='core.GMechanic')),
            ],
            bases=('core.gmechanic',),
        ),
        migrations.CreateModel(
            name='UnlockableWidget',
            fields=[
                ('gmechanic_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='core.GMechanic')),
            ],
            bases=('core.gmechanic',),
        ),
        migrations.CreateModel(
            name='Gamer',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('emotion_profile', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='core.EmotionProfile')),
                ('gamer_profile', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='core.GamerProfile')),
                ('social_profile', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='core.SocialProfile')),
            ],
        ),
        migrations.CreateModel(
            name='Unlockable',
            fields=[
                ('gmechanic_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='core.GMechanic')),
                ('icon', models.ImageField(default='unlockable_icons/reward.png', upload_to='unlockable_icons')),
                ('name', models.CharField(default='Unlockable', max_length=100)),
                ('state', models.BooleanField(default=False)),
                ('by', models.CharField(default='score', max_length=100)),
                ('threshold', models.FloatField(default=99999999)),
                ('locked_html', models.TextField(default='')),
            ],
            options={
                'unique_together': {('by', 'threshold')},
            },
            bases=('core.gmechanic',),
        ),
        migrations.CreateModel(
            name='Point',
            fields=[
                ('gmechanic_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='core.GMechanic')),
                ('user', models.CharField(default='', max_length=200, validators=[apps.core.mechanics.username_exists])),
                ('score', models.FloatField(default=0, validators=[django.core.validators.MinValueValidator(0)])),
                ('given_by', models.CharField(default='', max_length=100)),
            ],
            options={
                'unique_together': {('user', 'given_by')},
            },
            bases=('core.gmechanic',),
        ),
        migrations.CreateModel(
            name='InteractionStatistic',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.CharField(max_length=255, validators=[apps.core.mechanics.username_exists])),
                ('log', jsonfield.fields.JSONField(default=dict)),
                ('interaction_index', models.FloatField(validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(1)])),
                ('mechanic', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='statistics', to='core.GMechanic')),
            ],
            options={
                'unique_together': {('mechanic', 'user')},
            },
        ),
        migrations.CreateModel(
            name='Challenge',
            fields=[
                ('gmechanic_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='core.GMechanic')),
                ('icon', models.ImageField(default='challenge_icons/challenge.png', upload_to='challenge_icons')),
                ('name', models.CharField(default='Challenge', max_length=100)),
                ('state', models.BooleanField(default=False)),
                ('by', models.CharField(default='score', max_length=100)),
                ('threshold', models.FloatField(default=99999999)),
                ('reward_by', models.CharField(default='score', max_length=100)),
                ('reward_value', models.FloatField(default=10)),
            ],
            options={
                'unique_together': {('by', 'threshold')},
            },
            bases=('core.gmechanic',),
        ),
        migrations.CreateModel(
            name='Badge',
            fields=[
                ('gmechanic_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='core.GMechanic')),
                ('icon', models.ImageField(default='badge_icons/reward.png', upload_to='badge_icons')),
                ('name', models.CharField(default='Badge', max_length=100)),
                ('state', models.BooleanField(default=False)),
                ('by', models.CharField(default='score', max_length=100)),
                ('threshold', models.FloatField(default=99999999)),
            ],
            options={
                'unique_together': {('by', 'threshold')},
            },
            bases=('core.gmechanic',),
        ),
    ]