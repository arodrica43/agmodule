from django.db import models
from django.contrib.auth.models import User
from enum import Enum
from enumfields import EnumField
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.core.validators import MaxValueValidator, MinValueValidator
from jsonfield import JSONField

# User-related models

class EmotionProfile(models.Model):
    valence =  models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(1)],default=0)
    arousal =  models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(1)],default=0)

class GamerProfile(models.Model):
    #user = models.OneToOneField(User,on_delete=models.CASCADE,primary_key=True)
    disruptor = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(1)],default=1)
    free_spirit = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(1)],default=1)
    achiever = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(1)],default=1)
    player = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(1)],default=1)
    socializer = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(1)],default=1)
    philantropist = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(1)],default=1)
    no_player = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(1)],default=0)
    data = JSONField(default = dict)
    associated_mechanic = {
        'disruptor':'Change',
        'free_spirit':'Autonomy',
        'achiever':'Mastery',
        'player':'Reward',
        'socializer':'Relatedness',
        'philantropist':'Purpose',
        'no_player':'',
        -1: 'Unknown',
        0:'Change',
        1:'Autonomy',
        2:'Mastery',
        3:'Reward',
        4:'Relatedness',
        5:'Purpose',
        6:''
    }
    def vectorize(self):
        return (self.disruptor,self.free_spirit,self.achiever,self.player,self.socializer,self.philantropist,self.no_player)

class SocialProfile(models.Model):

    class AvatarType(Enum): 
        art = "art"
        diamond = "diamond"
        games = "games"
        money = "money"
        music = "music"
        photo = "photo"
        science = "science"
        tech = "tech" 
        user = "user"
        Unknown = "Unknown"
        
        XA1 = "XA1"
        XA2 = "XA2"
        XA3 = "XA3"
        XB1 = "XB1"
        XB2 = "XB2"
        XB3 = "XB3"

        YA1 = "YA1"
        YA2 = "YA2"
        YA3 = "YA3"
        YB1 = "YB1"
        YB2 = "YB2"
        YB3 = "YB3"

        ZA1 = "ZA1"
        ZA2 = "ZA2"
        ZA3 = "ZA3"
        ZB1 = "ZB1"
        ZB2 = "ZB2"
        ZB3 = "ZB3"
        # art = "art"
        # diamond = "diamond"
        # games = "games"
        # money = "money"
        # music = "music"
        # photo = "photo"
        # science = "science"
        # tech = "tech" 
        # user = "user"
        # Unknown = "Unknown"

    
    image = EnumField(AvatarType,max_length=11,default = AvatarType.XA1)
    description = models.TextField(default="")
    data = JSONField(default = list)       


def username_exists(value):
    qs = Gamer.objects.filter(user__username = value)
    if len(qs) == 0:
        raise ValidationError(
            _('%(value)s is not an existing username'),
            params={'value': value},
        )

def unique_individual_group(value):
    if 'groups' in value.keys():
        groups =  value['groups']
        for g in groups:
            if len(g.name) >= 10:
                if g.name[:10] == 'individual' and g.name[10:] != '_' + value['username']:
                    raise ValidationError(
                        _('An user cannot be in an individual group other than its default'),
                        params={'value': value},
                    )
    else:
        raise ValidationError(
                        _('Every user should be in its own individual group. Automathically added.'),
                        params={'value': value},
                    )

class Gamer(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE,primary_key=True)
    emotion_profile = models.OneToOneField(EmotionProfile, on_delete=models.CASCADE)
    gamer_profile =  models.OneToOneField(GamerProfile, on_delete=models.CASCADE)
    social_profile =  models.OneToOneField(SocialProfile, on_delete=models.CASCADE)

