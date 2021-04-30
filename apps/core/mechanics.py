from django.db import models
from enum import Enum
from enumfields import EnumField
from django.core.validators import MaxValueValidator, MinValueValidator
from jsonfield import JSONField
from apps.core.profiles import Gamer

# Mechanics-related models

def username_exists(value):
    qs = Gamer.objects.filter(user__username = value)
    if len(qs) == 0:
        raise ValidationError(
            _('%(value)s is not an existing username'),
            params={'value': value},
        )

class GMechanic(models.Model):

    class MechanicType(Enum):   # A subclass of Enum
        Change = "Change"
        Autonomy = "Autonomy"
        Mastery = "Mastery"
        Reward = "Reward"
        Relatedness = "Relatedness"
        Purpose = "Purpose"
        Unknown = "Unknown"
        WChange = "WChange"
        WAutonomy = "WAutonomy"
        WMastery = "WMastery"
        WReward = "WReward"
        WRelatedness = "WRelatedness"
        WPurpose = "WPurpose"
        WUnknown = "WUnknown"


    title = models.CharField(max_length=255)
    html = models.TextField(default="")
    mechanic_type = EnumField(MechanicType,max_length=12,default = MechanicType.Unknown)
    #owners = models.CharField(max_length=200,default = '', validators=[username_exists])
    #owners = models.ManyToManyField(Group)
    #statistics = models.ManyToManyField(InteractionStatistic) #JSONField(default = list)
    associated_profile = {
        'Change':0,
        'Autonomy':1,
        'Mastery':2,
        'Reward':3,
        'Relatedness':4,
        'Purpose':5,
        'Unknown':-1,
        'WChange':6,
        'WAutonomy':7,
        'WMastery':8,
        'WReward':9,
        'WRelatedness':10,
        'WPurpose':11,
        'WUnknown':-1
    }


    def matrix(self):
        import numpy as np
        all_mechanics =  GMechanic.objects.all()
        M = np.zeros((len(all_mechanics),7))
        for i in range(len(all_mechanics)):
            idx = all_mechanics[i].associated_profile[all_mechanics[i].mechanic_type.value]
            if idx != -1 and idx < 6:
                M[i,idx] = 1
        #print(M)
        return M

    def widget_matrix(self):
        import numpy as np
        all_mechanics =  GMechanic.objects.all()
        M = np.zeros((len(all_mechanics),7))
        for i in range(len(all_mechanics)):
            idx = all_mechanics[i].associated_profile[all_mechanics[i].mechanic_type.value]
            if idx != -1 and idx >= 6:
                M[i,idx % 6] = 1
        #print(M)
        return M

    def statistics_vector(self,user):
        all_mechanics = GMechanic.objects.all()
        v = []
        for gm in all_mechanics:
            stat_i = InteractionStatistic.objects.filter(user = user, mechanic = gm)
            if stat_i:
                stat_i = stat_i[0].interaction_index
                v += [stat_i] 
            else:
                v += [0.1]
        #print(v, len(v))
        return v

    def statistics_with_valoration_vector(self,user):
        all_mechanics = GMechanic.objects.all()
        v = []
        for gm in all_mechanics:
            stat_i = InteractionStatistic.objects.filter(user = user, mechanic = gm)
            res_i = 0 
            if stat_i:
                # mean between interaction index and valoration
                if 'valoration' in stat_i[0].log.keys():
                    res_i = 0.5*(stat_i[0].interaction_index + stat_i[0].log['valoration']) 
                else:
                    res_i = 0.5*(stat_i[0].interaction_index + 0.5) # CHANGED stat_i[0].interaction_index
            v += [res_i]

        print(v, len(v))
        return v

# TO DO: Make class extensions to differentiate between GMechanics interaction statistics and GComponent statistics
#   For now, it's enough to add the field <mechanic> here.
class InteractionStatistic(models.Model):
    mechanic = models.ForeignKey(GMechanic, related_name='statistics',on_delete = models.CASCADE)
    #user = models.ForeignKey(Gamer,on_delete=models.CASCADE)
    # If we want to create statistics related to a user by the username, we should valdate that it exists
    # TO DO: Validate existence of gamer with username = <user>
    user = models.CharField(max_length=255, validators=[username_exists])
    log = JSONField(default = dict)
    # TO DO: add a logs JSON field containing <register> and <interaction index>
    interaction_index = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(1)],)
    class Meta:
        unique_together = ("mechanic", "user")


class GMechanicList(GMechanic):

    class Mechanics(Enum):
        development_tools = "development_tools"
        challenges = "challenges"
        easter_eggs = "easter_eggs"
        unlockables = "unlockables"
        badges = "badges"
        levels = "levels"
        points = "points"
        leaderboards = "leaderboards"
        lotteries = "lotteries"
        gift_openers = "gift_openers"
        social_networks = "social_networks"
        social_statuses = "social_statuses"
        gifts = "gifts"
        knowledge_shares = "knowledge_shares"

    def __init__(self, *args, **kwargs):
        """If object is being updated don't allow contact to be changed."""
        super().__init__(*args, **kwargs)
        self.mechanic_type = GMechanic.MechanicType.Unknown
            # self.fields.pop('parent') # or remove the field

    mechanic = EnumField(Mechanics,max_length=17,default = Mechanics.badges)

class DevelopmentTool(GMechanic):

    def __init__(self, *args, **kwargs):
        """If object is being updated don't allow contact to be changed."""
        super().__init__(*args, **kwargs)
        self.mechanic_type = GMechanic.MechanicType.Change
            # self.fields.pop('parent') # or remove the field

    class Mechanic(Enum):   # A subclass of Enum
        Badge = "Badge"
        Unlockable = "Unlockable"
        Challenge = "Challenge"

    mechanic_class = EnumField(Mechanic,max_length=10,default = Mechanic.Badge)
    attempts =  models.IntegerField(validators=[MinValueValidator(1)],default = 1)

class Challenge(GMechanic):

    def __init__(self, *args, **kwargs):
        """If object is being updated don't allow contact to be changed."""
        super().__init__(*args, **kwargs)
        self.mechanic_type = GMechanic.MechanicType.Change
            # self.fields.pop('parent') # or remove the field
    icon = models.ImageField(upload_to="challenge_icons", default='challenge_icons/challenge.png')
    name = models.CharField(max_length=100,default = 'Challenge')
    state = models.BooleanField(default = False)
    by = models.CharField(max_length=100,default = 'score')
    threshold = models.FloatField(default = 99999999)
    reward_by = models.CharField(max_length=100,default = 'score')
    reward_value = models.FloatField(default = 10)

    class Meta:
         unique_together = (('by', "threshold"))

class EasterEgg(GMechanic):

    def __init__(self, *args, **kwargs):
        """If object is being updated don't allow contact to be changed."""
        super().__init__(*args, **kwargs)
        self.mechanic_type = GMechanic.MechanicType.Autonomy
            # self.fields.pop('parent') # or remove the field
    feedback = models.ImageField(upload_to="easter_egg_icons", default='easter_egg_icons/well_done.jpg')
    egg_html = models.TextField(default="")


class Unlockable(GMechanic):

    def __init__(self, *args, **kwargs):
        """If object is being updated don't allow contact to be changed."""
        super().__init__(*args, **kwargs)
        self.mechanic_type = GMechanic.MechanicType.Autonomy
            # self.fields.pop('parent') # or remove the field
    icon = models.ImageField(upload_to="unlockable_icons", default='unlockable_icons/reward.png')
    name = models.CharField(max_length=100,default = 'Unlockable')
    state = models.BooleanField(default = False)
    by = models.CharField(max_length=100,default = 'score')
    threshold = models.FloatField(default = 99999999)

    locked_html = models.TextField(default="")

    class Meta:
         unique_together = (('by', "threshold"))

class Badge(GMechanic):

    def __init__(self, *args, **kwargs):
        """If object is being updated don't allow contact to be changed."""
        super().__init__(*args, **kwargs)
        self.mechanic_type = GMechanic.MechanicType.Mastery
            # self.fields.pop('parent') # or remove the field
    icon = models.ImageField(upload_to="badge_icons", default='badge_icons/reward.png')
    name = models.CharField(max_length=100,default = 'Badge')
    state = models.BooleanField(default = False)
    by = models.CharField(max_length=100,default = 'score')
    threshold = models.FloatField(default = 99999999)

    class Meta:
         unique_together = (('by', "threshold"))

class Level(GMechanic):

    def __init__(self, *args, **kwargs):
        """If object is being updated don't allow contact to be changed."""
        super().__init__(*args, **kwargs)
        self.mechanic_type = GMechanic.MechanicType.Mastery
            # self.fields.pop('parent') # or remove the field
    #user = models.CharField(max_length=200,default = '', validators=[username_exists])
    value = models.IntegerField(validators=[MinValueValidator(0)],default = 0)
    max_value = models.IntegerField(validators=[MinValueValidator(0)],default = 1)
    by = models.CharField(max_length=100,default = '')


class Point(GMechanic):

    def __init__(self, *args, **kwargs):
        """If object is being updated don't allow contact to be changed."""
        super().__init__(*args, **kwargs)
        self.mechanic_type = GMechanic.MechanicType.Reward
            # self.fields.pop('parent') # or remove the field
    user = models.CharField(max_length=200,default = '', validators=[username_exists])
    score = models.FloatField(validators=[MinValueValidator(0)],default = 0)
    given_by = models.CharField(max_length=100,default = '')

    class Meta:
         unique_together = (('user', "given_by"))

class Leaderboard(GMechanic):

    def __init__(self, *args, **kwargs):
        """If object is being updated don't allow contact to be changed."""
        super().__init__(*args, **kwargs)
        self.mechanic_type = GMechanic.MechanicType.Reward
            # self.fields.pop('parent') # or remove the field
    leadders = JSONField(default = dict) #models.ManyToManyField(Gamer)
    length = models.IntegerField(validators=[MinValueValidator(0)],default = 0)
    sort_by = models.CharField(max_length=100,default = '')

class Lottery(GMechanic):

    def __init__(self, *args, **kwargs):
        """If object is being updated don't allow contact to be changed."""
        super().__init__(*args, **kwargs)
        self.mechanic_type = GMechanic.MechanicType.Reward
            # self.fields.pop('parent') # or remove the field
    items = JSONField(default = list)
    by = models.CharField(max_length=100,default = '')

class SocialNetwork(GMechanic):

    def __init__(self, *args, **kwargs):
        """If object is being updated don't allow contact to be changed."""
        super().__init__(*args, **kwargs)
        self.mechanic_type = GMechanic.MechanicType.Relatedness
            # self.fields.pop('parent') # or remove the field
    messages = JSONField(default = dict)

class SocialStatus(GMechanic):

    def __init__(self, *args, **kwargs):
        """If object is being updated don't allow contact to be changed."""
        super().__init__(*args, **kwargs)
        self.mechanic_type = GMechanic.MechanicType.Relatedness
            # self.fields.pop('parent') # or remove the field

    class CompetitionLevel(Enum):   # A subclass of Enum
        Low = "Low"
        Medium = "Medium"
        High = "High"

    competitiveness = EnumField(CompetitionLevel,max_length=6,default = CompetitionLevel.High)

class KnowledgeShare(GMechanic):

    def __init__(self, *args, **kwargs):
        """If object is being updated don't allow contact to be changed."""
        super().__init__(*args, **kwargs)
        self.mechanic_type = GMechanic.MechanicType.Purpose
            # self.fields.pop('parent') # or remove the field
    messages = JSONField(default = dict)

class Gift(GMechanic):

    def __init__(self, *args, **kwargs):
        """If object is being updated don't allow contact to be changed."""
        super().__init__(*args, **kwargs)
        self.mechanic_type = GMechanic.MechanicType.Purpose
            # self.fields.pop('parent') # or remove the field
    

class GiftOpener(GMechanic):

    def __init__(self, *args, **kwargs):
        """If object is being updated don't allow contact to be changed."""
        super().__init__(*args, **kwargs)
        self.mechanic_type = GMechanic.MechanicType.Reward
            # self.fields.pop('parent') # or remove the field
 

class Adaptative(GMechanic):

    def __init__(self, *args, **kwargs):
        """If object is being updated don't allow contact to be changed."""
        super().__init__(*args, **kwargs)
        self.mechanic_type = GMechanic.MechanicType.Unknown
            # self.fields.pop('parent') # or remove the field

# Widgets for GMechanics -------------------------------------------------------

class DevelopmentToolWidget(GMechanic):

    def __init__(self, *args, **kwargs):
        """If object is being updated don't allow contact to be changed."""
        super().__init__(*args, **kwargs)
        self.mechanic_type = GMechanic.MechanicType.WChange
            # self.fields.pop('parent') # or remove the field

class ChallengeWidget(GMechanic):

    def __init__(self, *args, **kwargs):
        """If object is being updated don't allow contact to be changed."""
        super().__init__(*args, **kwargs)
        self.mechanic_type = GMechanic.MechanicType.WChange
            # self.fields.pop('parent') # or remove the field

class EasterEggWidget(GMechanic):

    def __init__(self, *args, **kwargs):
        """If object is being updated don't allow contact to be changed."""
        super().__init__(*args, **kwargs)
        self.mechanic_type = GMechanic.MechanicType.WAutonomy
            # self.fields.pop('parent') # or remove the field


class UnlockableWidget(GMechanic):

    def __init__(self, *args, **kwargs):
        """If object is being updated don't allow contact to be changed."""
        super().__init__(*args, **kwargs)
        self.mechanic_type = GMechanic.MechanicType.WAutonomy
            # self.fields.pop('parent') # or remove the field

class BadgeWidget(GMechanic):

    def __init__(self, *args, **kwargs):
        """If object is being updated don't allow contact to be changed."""
        super().__init__(*args, **kwargs)
        self.mechanic_type = GMechanic.MechanicType.WMastery
            # self.fields.pop('parent') # or remove the field

class LevelWidget(GMechanic):

    def __init__(self, *args, **kwargs):
        """If object is being updated don't allow contact to be changed."""
        super().__init__(*args, **kwargs)
        self.mechanic_type = GMechanic.MechanicType.WMastery
            # self.fields.pop('parent') # or remove the field

class PointWidget(GMechanic):

    def __init__(self, *args, **kwargs):
        """If object is being updated don't allow contact to be changed."""
        super().__init__(*args, **kwargs)
        self.mechanic_type = GMechanic.MechanicType.WReward
            # self.fields.pop('parent') # or remove the field

class LeaderboardWidget(GMechanic):

    def __init__(self, *args, **kwargs):
        """If object is being updated don't allow contact to be changed."""
        super().__init__(*args, **kwargs)
        self.mechanic_type = GMechanic.MechanicType.WReward
            # self.fields.pop('parent') # or remove the field

class LotteryWidget(GMechanic):

    def __init__(self, *args, **kwargs):
        """If object is being updated don't allow contact to be changed."""
        super().__init__(*args, **kwargs)
        self.mechanic_type = GMechanic.MechanicType.WReward
            # self.fields.pop('parent') # or remove the field

class SocialNetworkWidget(GMechanic):

    def __init__(self, *args, **kwargs):
        """If object is being updated don't allow contact to be changed."""
        super().__init__(*args, **kwargs)
        self.mechanic_type = GMechanic.MechanicType.WRelatedness
            # self.fields.pop('parent') # or remove the field


class SocialStatusWidget(GMechanic):

    def __init__(self, *args, **kwargs):
        """If object is being updated don't allow contact to be changed."""
        super().__init__(*args, **kwargs)
        self.mechanic_type = GMechanic.MechanicType.WRelatedness
            # self.fields.pop('parent') # or remove the field

class KnowledgeShareWidget(GMechanic):

    def __init__(self, *args, **kwargs):
        """If object is being updated don't allow contact to be changed."""
        super().__init__(*args, **kwargs)
        self.mechanic_type = GMechanic.MechanicType.WPurpose
            # self.fields.pop('parent') # or remove the field
    messages = JSONField(default = dict)

class GiftWidget(GMechanic):

    def __init__(self, *args, **kwargs):
        """If object is being updated don't allow contact to be changed."""
        super().__init__(*args, **kwargs)
        self.mechanic_type = GMechanic.MechanicType.WPurpose
            # self.fields.pop('parent') # or remove the field
    

class GiftOpenerWidget(GMechanic):

    def __init__(self, *args, **kwargs):
        """If object is being updated don't allow contact to be changed."""
        super().__init__(*args, **kwargs)
        self.mechanic_type = GMechanic.MechanicType.WReward
            # self.fields.pop('parent') # or remove the field
 
class AdaptativeWidget(GMechanic):

    def __init__(self, *args, **kwargs):
        """If object is being updated don't allow contact to be changed."""
        super().__init__(*args, **kwargs)
        self.mechanic_type = GMechanic.MechanicType.WUnknown
            # self.fields.pop('parent') # or remove the field


