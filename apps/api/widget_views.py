from django.shortcuts import render
from django.conf import settings
from rest_framework import viewsets
from apps.api.serializers import *
from apps.core.models import *
from apps.api.utils import ensamble_interaction_dynamic_properties
import numpy as np
import random as rdm
import os

# WIDGET VIEWSETS

class DevelopementToolWidgetViewSet(GMechanicViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = DevelopmentToolWidget.objects.all()
    serializer_class = DevelopmentToolWidgetSerializer
    concrete_class = 'development_tool_widgets'
    concrete_model = DevelopmentToolWidget

    def retrieve(self, request, pk=None):
        #print("WTFFFs")
        return super().abstract_retrieve(request,pk)

class ChallengeWidgetViewSet(GMechanicViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = ChallengeWidget.objects.all()
    serializer_class = ChallengeWidgetSerializer
    concrete_class = 'challenge_widgets'
    concrete_model = ChallengeWidget

    def retrieve(self, request, pk=None):
        #print("WTFFFs")
        return super().abstract_retrieve(request,pk)

    def logic(self,queryset,request):
        #queryset.update(html = new_html)
        pass   

class EasterEggWidgetViewSet(GMechanicViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = EasterEggWidget.objects.all()
    serializer_class = EasterEggWidgetSerializer
    concrete_class = 'easter_egg_widgets'
    concrete_model = EasterEggWidget

class UnlockableWidgetViewSet(GMechanicViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = UnlockableWidget.objects.all()
    serializer_class = UnlockableWidgetSerializer
    concrete_class = 'unlockable_widgets'
    concrete_model = UnlockableWidget


    def retrieve(self, request, pk=None):
        #print("WTFFFs")
        return super().abstract_retrieve(request,pk)

    def logic(self,queryset,request):
        if 'user' in request.GET.keys():
            if request.GET['user']:
                user = Gamer.objects.filter(user__username = request.GET['user'])
        pass     


class BadgeWidgetViewSet(GMechanicViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = BadgeWidget.objects.all()
    serializer_class = BadgeWidgetSerializer
    concrete_class = 'badge_widgets'
    concrete_model = BadgeWidget

    def retrieve(self, request, pk=None):
        #print("WTFFFs")
        return super().abstract_retrieve(request,pk)

    def logic(self,queryset,request):
       pass    

class LevelWidgetViewSet(GMechanicViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = LevelWidget.objects.all()
    serializer_class = LevelWidgetSerializer
    concrete_class = 'level_widgets'
    concrete_model = LevelWidget

    def retrieve(self, request, pk=None):
        #print("WTFFFs")
        return super().abstract_retrieve(request,pk)

    def logic(self,queryset,request):
       pass

class PointWidgetViewSet(GMechanicViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = PointWidget.objects.all()
    serializer_class = PointWidgetSerializer
    concrete_class = 'point_widgets'
    concrete_model = PointWidget

    def retrieve(self, request, pk=None):
        #print("WTFFFs")
        return super().abstract_retrieve(request,pk)

    def logic(self,queryset,request):
        pass      


class LeaderboardWidgetViewSet(GMechanicViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """        
    queryset = LeaderboardWidget.objects.all()
    serializer_class = LeaderboardWidgetSerializer
    concrete_class = 'leaderboard_widgets'
    concrete_model = LeaderboardWidget

    def retrieve(self, request, pk=None):
        return super().abstract_retrieve(request,pk)

    # Concrete logic for leaderboards view
    def logic(self,queryset,request):
        pass        
   
    
class LotteryWidgetViewSet(GMechanicViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = LotteryWidget.objects.all()
    serializer_class = LotteryWidgetSerializer
    concrete_class = 'lottery_widgets'
    concrete_model = LotteryWidget

    def retrieve(self, request, pk=None):
        return super().abstract_retrieve(request,pk)

    # Concrete logic for leaderboards view
    def logic(self,queryset,request):
        pass

    

class SocialNetworkWidgetViewSet(GMechanicViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = SocialNetworkWidget.objects.all()
    serializer_class = SocialNetworkWidgetSerializer
    concrete_class = 'social_network_widgets'
    concrete_model = SocialNetworkWidget
    

class SocialStatusWidgetViewSet(GMechanicViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = SocialStatusWidget.objects.all()
    serializer_class = SocialStatusWidgetSerializer
    concrete_class = 'social_status_widgets'
    concrete_model = SocialStatusWidget

class KnowledgeShareWidgetViewSet(GMechanicViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = KnowledgeShareWidget.objects.all()
    serializer_class = KnowledgeShareWidgetSerializer
    concrete_class = 'knowledge_share_widgets'
    concrete_model = KnowledgeShareWidget


    def retrieve(self, request, pk=None):
        return super().abstract_retrieve(request,pk)

    # Concrete logic for leaderboards view
    def logic(self,queryset,request):
        pass


class GiftWidgetViewSet(GMechanicViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = GiftWidget.objects.all()
    serializer_class = GiftWidgetSerializer
    concrete_class = 'gift_widgets'
    concrete_model = GiftWidget


class GiftOpenerWidgetViewSet(GMechanicViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = GiftOpenerWidget.objects.all()
    serializer_class = GiftOpenerWidgetSerializer
    concrete_class = 'gift_opener_widgets'
    concrete_model = GiftOpenerWidget

# Adaptative mechanics

class AdaptativeWidgetViewSet(GMechanicViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = AdaptativeWidget.objects.all()
    serializer_class = AdaptativeWidgetSerializer

    def retrieve(self, request, pk=None):
        return super().abstract_retrieve(request,pk)

    def update_utilities(self,queryset,user): 
        # DEFAULT :: "UserType-Mechanics Matrix" update policy 
        # v = np.array(user.gamer_profile.vectorize()) 
        # M = queryset[0].matrix()
        # return Mv
        return  queryset[0].widget_matrix().dot(np.array(user.gamer_profile.vectorize()))

    def select_mechanic(self,utilities):
        # DEFAULT :: "Choosing random index between argmax indexes" update policy
        #idx = rdm.choice(np.argwhere(utilities == np.amax(utilities)).flatten().tolist())
        #print(utilities)
        # PONDERATED PROBABILITY SELECTION
        prob = utilities/utilities.sum()
        r = rdm.random()
        acc, idx = 0, 0
        for i in range(len(prob)):
            pi = prob[i]
            if acc < r and r < acc + pi:
                idx = i
                break
            acc += pi
        return GMechanic.objects.all()[idx]

    def logic(self,queryset,request):
        print("DEFAULT :: Adaptative Widget logic")
        args = request.GET
        if 'user' in args.keys():
            user = Gamer.objects.filter(user__username = args['user'])
            if user:
                user = user[0]
                gmechanic = self.select_mechanic(self.update_utilities(queryset,user))

                #g_mechanic serialization and html update
                serializer = GMechanicSerializer(gmechanic, context={'request': request}) 
                data = serializer.data      
                file = open(os.path.join(settings.TEMPLATES[0]['DIRS'][0], "mechanics/adaptative_widgets.html"))
                new_html = file.read().replace('called_mechanic_url', "https://agmodule.herokuapp.com/api/g_mechanics/" + str(data['id']) + "/?" + args.urlencode())
                queryset.update(html = new_html)

        else:
            file = open(os.path.join(settings.TEMPLATES[0]['DIRS'][0], "mechanics/adaptative_widgets.html"))
            new_html = file.read().replace('called_mechanic_url', "https://agmodule.herokuapp.com/api/g_mechanics/" + str(5) + "/?" + args.urlencode())
            queryset.update(html = new_html)
        ensamble_interaction_dynamic_properties(queryset)




