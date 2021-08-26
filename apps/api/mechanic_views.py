from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponse, Http404
from rest_framework import viewsets
from rest_framework.response import Response
from apps.api.serializers import *
from apps.core.models import *
from apps.api.utils import ensamble_interaction_dynamic_properties, ensamble_file
import numpy as np
import random as rdm
import os


# Mechanics Viewsets.

class GMechanicViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = GMechanic.objects.all()
    serializer_class = GMechanicSerializer
    concrete_class = 'g_mechanics'
    concrete_model = GMechanic

    def logic(self,queryset,request):
        pass

    def abstract_retrieve(self, request, pk=None):
        if pk:
            lock.acquire()
            try:
                queryset, name = g_mechanic_cast(pk)
            except:
                lock.release()
                raise Http404
            try:
                try:
                    print(1)
                    html_file = open(os.path.join(settings.TEMPLATES[0]['DIRS'][0],  "mechanics/" + name + '.html'))

                    print(2)
                    css_file = open(os.path.join(settings.TEMPLATES[0]['DIRS'][1],  "mechanics/" + name + '.css'))

                    print(3)
                    js_file = open(os.path.join(settings.TEMPLATES[0]['DIRS'][2],  "mechanics/" + name + '.js'))

                    print(4)
                    ensamble = ensamble_file(html_file, css_file, js_file)

                    print(5)
                    print("https://agmodule.herokuapp.com/api/" + name + "/" + pk + "/?" + request.GET.urlencode())
                    print(6)
                    queryset.update(html = ensamble.replace("called_mechanic_url","https://agmodule.herokuapp.com/api/" + name + "/" + pk + "/?" + request.GET.urlencode()))
                    print(7)
                    ensamble_interaction_dynamic_properties(queryset)
                except:
                    print("Error while ensambling a gmechanic file!!!")
                    raise Http404
                queryset.update(html = queryset[0].html.replace("dynamic_mechanic_index", pk))
                queryset.update(html = queryset[0].html.replace("dynamic_mechanic_name", name))
                ensamble_interaction_dynamic_properties(queryset)
                import re
                try:             
                    queryset.update(html = queryset[0].html.replace("dynamic_user",request.GET['user']))
                except:
                    print("Query url doesn't contain username argument")
                try:
                    new_html = re.sub("(?!dynamic_index=)dynamic_index",request.GET['dynamic_index'],queryset[0].html)    #+ str(random.random())[2:]        
                    queryset.update(html = new_html)
                except:
                    print("Query url doesn't contain dynamic_index argument")
                try:
                    new_html = re.sub("(?!only_me=)only_me",request.GET['only_me'],queryset[0].html)    #+ str(random.random())[2:]        
                    queryset.update(html = new_html)
                except:
                    print("Query url doesn't contain only_me argument")
                try:
                    new_html = re.sub("(?!dynamic_link_url=)dynamic_link_url",request.GET['dynamic_link_url'],queryset[0].html)    #+ str(random.random())[2:]        
                    queryset.update(html = new_html)
                except:
                    print("Query url doesn't contain link_url argument")
                try:
                    new_html = re.sub("(?!dynaic_progress=)dynamic_progress",request.GET['dynamic_progress'],queryset[0].html)    #+ str(random.random())[2:]        
                    queryset.update(html = new_html)
                except:
                    print("Query url doesn't contain progress argument")
                tmp_title = queryset[0].title
                if 'show_title' in request.GET.keys():
                    st = request.GET['show_title']
                    if st == 'false':
                        queryset.update(title = "")
                self.logic(queryset,request)
                try:  
                    new_html = re.sub("(?!dynamic_index=)dynamic_index",request.GET['dynamic_index'],queryset[0].html)            
                    queryset.update(html = new_html)
                except:
                    print("Query url doesn't contain dynamic_index argument")
                serializer = self.serializer_class(queryset[0], context={'request': request})
                queryset.update(title = tmp_title)
                ensamble_interaction_dynamic_properties(queryset)
                lock.release()   
                return Response(serializer.data)
            except:
                lock.release() 
                print("Error :: Error loading GMechanic!")
                ensamble_interaction_dynamic_properties(queryset)
                raise Http404
        else: 
            return Http404

    def retrieve(self, request, pk=None):
        return self.abstract_retrieve(request,pk)
   
    def update(self, request,pk):
        lock.acquire()
        try:
            instance = self.queryset.get(id=pk)
            data = request.data
            if 'user' in data.keys():
                if data['user'] != "dynamic_user":
                    statistic = InteractionStatistic.objects.filter(mechanic = instance, user = data['user'])
                    if not statistic:
                        try:        
                            statistic = InteractionStatistic.objects.create(mechanic = instance, user = data['user'], interaction_index = 0.5) # CHANGED 1e-2
                            statistic = InteractionStatistic.objects.filter(mechanic = instance, user = data['user'])
                        except:
                            lock.release()
                            raise Http404
                    #Pre variables :: Before update --------------------------------------------
                    import copy
                    pre_log = copy.deepcopy(statistic[0].log)
                    print("Hey -----------------", pre_log)
                    if not pre_log:
                        pre_log["history"] = []
                        pre_log["main_time"] = 0                        
                    # --------------------------------------------------------------------------
                    for arg in ['history', 'main_time', 'focus_time', 'interaction_time','hidden_content_time', 'shown_content_time', 'valoration']:
                        uplog = statistic[0].log
                        if arg in statistic[0].log.keys() and arg != 'valoration':
                            uplog[arg] += data['log'][arg]
                        else: 
                            uplog[arg] = data['log'][arg]

                        scrolls =  [x for x in uplog['history'] if x[0]['type'] == "Scroll"]
                        if scrolls:
                            scrolls_join = [{
                                            "timestamp" : scrolls[0][0]['timestamp'],
                                            "type" : "Scrolling",
                                            "level" : round(sum([x[0]['level'] for x in scrolls])/len(scrolls)),
                                            "description" : scrolls[0][0]['description'] + " (x" + str(len(scrolls)) + ")"
                                            }]
                            uplog['history'] = [x for x in uplog['history'] if x[0]['type'] != "Scroll"] + [scrolls_join]
                        statistic.update(log = uplog)
                    #Interaction index update ----------------------------------------------------------------------------------------------------
                    # for s in InteractionStatistic.objects.all():
                    #     s.log = {}
                    #     s.interaction_index = 0
                    #     s.save()
                    # for u in Gamer.objects.all():
                    #     u.gamer_profile.disruptor = 0
                    #     u.gamer_profile.free_spirit = 0
                    #     u.gamer_profile.achiever = 0
                    #     u.gamer_profile.player = 0
                    #     u.gamer_profile.socializer = 0
                    #     u.gamer_profile.philantropist = 0
                    #     u.gamer_profile.no_player = 0
                    #     u.gamer_profile.save()   

                    import math
                    _, name = g_mechanic_cast(pk)
                    n = sum([(0.2*x[0]["level"] + 0.8) for x in statistic[0].log["history"]])/mechanic_list_total_interactions[name]
                    l = 4
                    #for t_label in ['main_time', 'focus_time', 'interaction_time']:
                     #   I += 1 - math.exp(-l*(n/(statistic[0].log[t_label] + 1e-100)))
                    #I = 1 - math.exp(-n/(statistic[0].log['main_time'])) #0.5*(I/3 + statistic[0].log['valoration'])
                    
                    #------------------------------------------------------------------------------------------------------------------------------
                    # Gamer profile update --------------------------------------------------------------------------------------------------------
                    # If user experimental case = B, don't update its profile
                    current_user = Gamer.objects.filter(user__username = data['user'])
                    if current_user:
                        print("Hey --------------------",0)
                        current_gstate = np.array(current_user[0].gamer_profile.vectorize())
                        #print(current_gstate)
                        I = 0
                        epsilon = 1e-2
                        m = current_gstate.min()
                        M = current_gstate.max()
                        n = len(statistic[0].log["history"])
                        v_scale = 1.25*(statistic[0].log['valoration'] - 0.2)*(0.9 - 0.1) + 0.1 # M = 1, m = epsilon
                        #I = 0.5*(v_scale + (1 - math.exp(-n))) 
                        # Use pre_logs to compute increments
                        tf = 60*statistic[0].log['main_time']
                        print("Hey --------------------",tf)
                        t0 = 60*pre_log['main_time']
                        print("Hey --------------------",t0)
                        xf = len(statistic[0].log["history"])
                        print("Hey --------------------",xf)
                        x0 = len(pre_log["history"])
                        print("Hey --------------------",x0)
                        incr_t = tf - t0
                        incr_x = xf - x0
                        print("Time increment :: ",incr_t)
                        print("Logs increment :: ",incr_x)
                        v = 0
                        if incr_t != 0:
                            v = incr_x / incr_t
                        I = 1 - math.exp(-v_scale*v) #0.5*(v_scale + (1 - math.exp(-epsilon*v))) #min(max(v_scale + epsilon*(math.exp(-epsilon*t) - math.exp(-epsilon*x)), 0), 1)
                        #I = I/3
                        statistic.update(interaction_index = I)
                        #TO DELETE :: Delete if clause once the experiment is finished
                        if 'case' not in current_user[0].gamer_profile.data.keys():
                            current_user[0].gamer_profile.data['case'] = "C2b"
                        if "B" not in current_user[0].gamer_profile.data['case']:
                            #Statistics Without valoration
                            #current_statistics = np.array(instance.statistics_with_valoration_vector(data['user']))
                            #Statistics With valoration
                            current_statistics = np.array(instance.statistics_vector(data['user']))
                            #print("Here",instance.matrix().T.dot(current_statistics))
                            #print(instance.matrix()[:,:len(current_statistics)].shape,len(current_statistics))
                            # CHANGED instance.matrix :: if we're working with widgets should be widget_matrix
                            # statistics_norm = current_statistics.sum()
                            # if statistics_norm > 1e-100:
                            #     current_statistics = current_statistics/statistics_norm
                            widget_matrix = instance.widget_matrix()
                            #print("A",widget_matrix)
                            widget_matrix = widget_matrix / widget_matrix.sum(axis=0)
                            widget_matrix[np.isnan(widget_matrix)] = 0
                            widget_matrix[np.isinf(widget_matrix)] = 0
                            
                            #np.nan_to_num(widget_matrix, copy=True, nan=0.0, posinf=None, neginf=None)
                            #print("B",widget_matrix)
                            # Try with transpose instead of pseudoinverse (???)
                            expected_gstate = np.linalg.pinv(widget_matrix[:len(current_statistics),:]).dot(current_statistics)
                            #print("C",expected_gstate)
                            expected_gstate_norm = expected_gstate.sum() #np.linalg.norm(expected_gstate) # We might take the sum of values
                            if expected_gstate_norm > 1e-100:
                                expected_gstate = expected_gstate / expected_gstate_norm
                            #print(expected_gstate)
                            #current_gstate = np.array([2*current_gstate[i] if expected_gstate[i] < 1e-6 else current_gstate[i] for i in range(7)])
                            #print(current_gstate)
                            new_gstate = ((1 - 1e-3)*current_gstate + 1e-3*expected_gstate)
                            #print(new_gstate)
                            # normalize gstate
                            new_gstate_norm = new_gstate.sum()
                            if new_gstate_norm > 1e-100:
                                new_gstate = new_gstate / new_gstate_norm
                            current_user[0].gamer_profile.disruptor = new_gstate[0]
                            current_user[0].gamer_profile.free_spirit = new_gstate[1]
                            current_user[0].gamer_profile.achiever = new_gstate[2]
                            current_user[0].gamer_profile.player = new_gstate[3]
                            current_user[0].gamer_profile.socializer = new_gstate[4]
                            current_user[0].gamer_profile.philantropist = new_gstate[5]
                            current_user[0].gamer_profile.no_player = new_gstate[6]
                            current_user[0].gamer_profile.save()                
                    #------------------------------------------------------------------------------------------------------------------------------
                    serializer = self.serializer_class(instance, data=data, partial=True,context={'request': request})
                    serializer.is_valid(raise_exception=True)
                    serializer.save()
                    lock.release()
                    return Response(serializer.data)
                else:
                    lock.release()
                    return HttpResponse('Invalid user!')  
            elif 'title' in data.keys():
                lock.release()
                return super().update(request,pk)
        except:
            lock.release()
            raise Http404     
           

class InteractionStatisticViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = InteractionStatistic.objects.all().order_by('-id')
    serializer_class = InteractionStatisticSerializer


class GMechanicListViewSet(GMechanicViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = GMechanicList.objects.all()
    serializer_class = GMechanicListSerializer
    concrete_class = 'gmechanic_lists'
    concrete_model = GMechanicList

    def retrieve(self, request, pk=None):
        #print("WTFFFs")
        return super().abstract_retrieve(request,pk)

    def logic(self,queryset,request):
        pass

class DevelopementToolViewSet(GMechanicViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = DevelopmentTool.objects.all()
    serializer_class = DevelopmentToolSerializer
    concrete_class = 'development_tools'
    concrete_model = DevelopmentTool

    def retrieve(self, request, pk=None):
        #print("WTFFFs")
        return super().abstract_retrieve(request,pk)

class ChallengeViewSet(GMechanicViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Challenge.objects.all()
    serializer_class = ChallengeSerializer
    concrete_class = 'challenges'
    concrete_model = Challenge

    def retrieve(self, request, pk=None):
        #print("WTFFFs")
        return super().abstract_retrieve(request,pk)

    def logic(self,queryset,request):
        #lock2.acquire() # I don't know if its necessary, sience we have lock in parent class
        #print("Im hereee")
        if 'user' in request.GET.keys():
            if request.GET['user']:
                user = Gamer.objects.filter(user__username = request.GET['user'])
                if user:
                    user = user[0]
                    by = queryset[0].by
                    th = queryset[0].threshold
                    u_keys = user.gamer_profile.data.keys()
                    if by in u_keys:
                        if user.gamer_profile.data[by] >= th:
                            if 'challenges' in u_keys:
                                if queryset[0].pk not in user.gamer_profile.data['challenges']:
                                    user.gamer_profile.data['challenges'] += [queryset[0].id]
                            else:
                                user.gamer_profile.data['challenges'] = [queryset[0].id]
                            user.gamer_profile.save()
                            queryset.update(state = True)
                            #print("Im entering hereee")
                            #print(queryset[0].state)
                        else:
                           queryset.update(state = False)
                    else:
                        queryset.update(state = False)
                else:
                    queryset.update(state = False)
            else:
                queryset.update(state = False)
        else:
            queryset.update(state = False)    

class EasterEggViewSet(GMechanicViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = EasterEgg.objects.all()
    serializer_class = EasterEggSerializer
    concrete_class = 'easter_eggs'
    concrete_model = EasterEgg

class UnlockableViewSet(GMechanicViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Unlockable.objects.all()
    serializer_class = UnlockableSerializer
    concrete_class = 'unlockables'
    concrete_model = Unlockable


    def retrieve(self, request, pk=None):
        #print("WTFFFs")
        return super().abstract_retrieve(request,pk)

    def logic(self,queryset,request):
        #lock2.acquire() # I don't know if its necessary, sience we have lock in parent class
        #print("Im hereee")
        if 'user' in request.GET.keys():
            if request.GET['user']:
                user = Gamer.objects.filter(user__username = request.GET['user'])
                if user:
                    user = user[0]
                    by = queryset[0].by
                    th = queryset[0].threshold
                    u_keys = user.gamer_profile.data.keys()
                    if by in u_keys:
                        if user.gamer_profile.data[by] >= th:
                            if 'unlockables' in u_keys:
                                if queryset[0].pk not in user.gamer_profile.data['unlockables']:
                                    user.gamer_profile.data['unlockables'] += [queryset[0].id]
                            else:
                                user.gamer_profile.data['unlockables'] = [queryset[0].id]
                            user.gamer_profile.save()
                            queryset.update(state = True)
                            #print("Im entering hereee")
                            #print(queryset[0].state)
                        else:
                           queryset.update(state = False)
                    else:
                        queryset.update(state = False)
                else:
                    queryset.update(state = False)
            else:
                queryset.update(state = False)
        else:
            queryset.update(state = False)        


class BadgeViewSet(GMechanicViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Badge.objects.all()
    serializer_class = BadgeSerializer
    concrete_class = 'badges'
    concrete_model = Badge

    def retrieve(self, request, pk=None):
        #print("WTFFFs")
        return super().abstract_retrieve(request,pk)

    def logic(self,queryset,request):
       # I don't know if its necessary, sience we have lock in parent class
        #print("Im hereee")
        if 'user' in request.GET.keys():
            if request.GET['user']:
                user = Gamer.objects.filter(user__username = request.GET['user'])
                if user:
                    user = user[0]
                    by = queryset[0].by
                    th = queryset[0].threshold
                    u_keys = user.gamer_profile.data.keys()
                    if by in u_keys:
                        if user.gamer_profile.data[by] >= th:
                            if 'badges' in u_keys:
                                if queryset[0].pk not in user.gamer_profile.data['badges']:
                                    user.gamer_profile.data['badges'] += [queryset[0].id]
                            else:
                                user.gamer_profile.data['badges'] = [queryset[0].id]
                            user.gamer_profile.save()
                            queryset.update(state = True)
                            #print("Im entering hereee")
                            #print(queryset[0].state)
                        else:
                           queryset.update(state = False)
                    else:
                        queryset.update(state = False)
                else:
                    queryset.update(state = False)
            else:
                queryset.update(state = False)
        else:
            queryset.update(state = False)        

class LevelViewSet(GMechanicViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Level.objects.all()
    serializer_class = LevelSerializer
    concrete_class = 'levels'
    concrete_model = Level

    def retrieve(self, request, pk=None):
        #print("WTFFFs")
        return super().abstract_retrieve(request,pk)

    def logic(self,queryset,request):
        # I don't know if its necessary, sience we have lock in parent class
        
        if 'user' in request.GET.keys():
            if request.GET['user']:
                user = Gamer.objects.filter(user__username = request.GET['user'])
                if user:
                    #queryset.update(user = user[0].user.username)
                    by = queryset[0].by
                    if by in user[0].gamer_profile.data.keys():
                        if 'increase' in request.GET.keys():
                            user[0].gamer_profile.data[by] = min(user[0].gamer_profile.data[by] + 1, queryset[0].max_value)
                            user[0].gamer_profile.save() 
                        queryset.update(value = user[0].gamer_profile.data[by])
                    else:
                        if 'increase' in request.GET.keys():
                            user[0].gamer_profile.data[by] = 1
                        else:
                            user[0].gamer_profile.data[by] = 0
                        user[0].gamer_profile.save() 
                        queryset.update(value = 1)
                else:
                    queryset.update(value = 0)
                    print("No such user")
            else:
                queryset.update(value = 0)
                print("No such user")
        else:
            queryset.update(value = 0)
            print("No such user")
        #lock2.release()

class PointViewSet(GMechanicViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Point.objects.all()
    serializer_class = PointSerializer
    concrete_class = 'points'
    concrete_model = Point

    def retrieve(self, request, pk=None):
        #print("WTFFFs")
        return super().abstract_retrieve(request,pk)

    def logic(self,queryset,request):
         # I don't know if its necessary, sience we have lock in parent class
        if 'user' in request.GET.keys():
            if request.GET['user']:
                user = Gamer.objects.filter(user__username = request.GET['user'])
                if user:
                    queryset.update(user = user[0].user.username)
                    by = queryset[0].given_by
                    if by in user[0].gamer_profile.data.keys():
                        if 'increase' in request.GET.keys():
                            queryset.update(score = user[0].gamer_profile.data[by] + float(request.GET['increase']))
                            user[0].gamer_profile.data[by] +=  float(request.GET['increase'])
                            user[0].gamer_profile.save() 
                        else:  
                            queryset.update(score = user[0].gamer_profile.data[by])
                    else:
                        inc = 0
                        if 'increase' in request.GET.keys():
                            inc = float(request.GET['increase'])
                        user[0].gamer_profile.data[by] = inc
                        user[0].gamer_profile.save() 
                        queryset.update(score = inc)
                else:
                    queryset.update(user = '---')
                    queryset.update(score = 0)
                    print("No such user")
            else:
                queryset.update(user = '---')
                queryset.update(score = 0)
                print("No such user")
        else:
            queryset.update(user = '---')
            queryset.update(score = 0)
            print("No such user")
        #lock2.release()
      


class LeaderboardViewSet(GMechanicViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """        
    queryset = Leaderboard.objects.all()
    serializer_class = LeaderboardSerializer
    concrete_class = 'leaderboards'
    concrete_model = Leaderboard

    def retrieve(self, request, pk=None):
        return super().abstract_retrieve(request,pk)

    # Concrete logic for leaderboards view
    def logic(self,queryset,request):
        users, json = Gamer.objects.all(), {}
        for user in users:
            if user.gamer_profile.data:
                if user.gamer_profile.data.keys():
                    if queryset[0].sort_by in user.gamer_profile.data.keys():
                        json[user.user.username] = user.gamer_profile.data[queryset[0].sort_by]   
                    elif queryset[0].sort_by == 'following':
                        json[user.user.username] = len(user.social_profile.data['friends'])   
                    elif queryset[0].sort_by == 'followers':
                        json[user.user.username] = len([x for x in Gamer.objects.all() if user.user.username in x.social_profile.data['friends']])
                    elif queryset[0].sort_by == 'views':
                         json[user.user.username] = user.social_profile.data['views'] # TO DO :: Add views count mechanism
        json = dict(sorted(json.items(), key=lambda x: x[1], reverse=True)[:queryset[0].length])
        queryset.update(leadders = json)

        
   
    
class LotteryViewSet(GMechanicViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Lottery.objects.all()
    serializer_class = LotterySerializer
    concrete_class = 'lotteries'
    concrete_model = Lottery

    def retrieve(self, request, pk=None):
        return super().abstract_retrieve(request,pk)

    # Concrete logic for leaderboards view
    def logic(self,queryset,request):

        if 'prize' in request.GET.keys():
            if 'user' in request.GET.keys():
                user = Gamer.objects.filter(user__username =  request.GET['user'])
                if user:
                    by = queryset[0].by
                    if user[0].gamer_profile.data:
                        if by in user[0].gamer_profile.data.keys():
                            prize = request.GET['prize']
                            try:
                                p = int(prize)
                                user[0].gamer_profile.data[by] += p
                                user[0].gamer_profile.save() 
                            except:
                                pass
                        else:
                            prize = request.GET['prize']
                            try:
                                p = int(prize)
                                user[0].gamer_profile[by] = p
                                user[0].gamer_profile.data.save()
                            except:
                                pass

    

class SocialNetworkViewSet(GMechanicViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = SocialNetwork.objects.all()
    serializer_class = SocialNetworkSerializer
    concrete_class = 'social_networks'
    concrete_model = SocialNetwork
    

class SocialStatusViewSet(GMechanicViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = SocialStatus.objects.all()
    serializer_class = SocialStatusSerializer
    concrete_class = 'social_statuses'
    concrete_model = SocialStatus

class KnowledgeShareViewSet(GMechanicViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = KnowledgeShare.objects.all()
    serializer_class = KnowledgeShareSerializer
    concrete_class = 'knowledge_shares'
    concrete_model = KnowledgeShare


    def retrieve(self, request, pk=None):
        return super().abstract_retrieve(request,pk)

    # Concrete logic for leaderboards view
    def logic(self,queryset,request):
        if not queryset[0].messages:
            queryset.update(messages = {})
        if 'from' in request.GET.keys():
            if request.GET['from'] != "dynamic_user":
                if 'message' in request.GET.keys():
                    old_messages = queryset[0].messages
                    if 'length' in old_messages.keys():
                        old_messages['content'] += [[request.GET['from'],request.GET['message']]]
                        old_messages['length'] += 1
                    else:
                        old_messages['length'] = 1
                        old_messages['content'] = [[request.GET['from'],request.GET['message']]]
                    queryset.update(messages = old_messages)
                



class GiftViewSet(GMechanicViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Gift.objects.all()
    serializer_class = GiftSerializer
    concrete_class = 'gifts'
    concrete_model = Gift


class GiftOpenerViewSet(GMechanicViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = GiftOpener.objects.all()
    serializer_class = GiftOpenerSerializer
    concrete_class = 'gift_openers'
    concrete_model = GiftOpener

# Adaptative mechanics

class AdaptativeViewSet(GMechanicViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Adaptative.objects.all()
    serializer_class = AdaptativeSerializer

    def retrieve(self, request, pk=None):
        return super().abstract_retrieve(request,pk)

    def update_utilities(self,queryset,user): 
        # DEFAULT :: "UserType-Mechanics Matrix" update policy 
        # v = np.array(user.gamer_profile.vectorize()) 
        # M = queryset[0].matrix()
        # return Mv
        return  queryset[0].matrix().dot(np.array(user.gamer_profile.vectorize()))

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

    # Concrete logic for leaderboards view
    def logic(self,queryset,request):
        print("DEFAULT :: Adaptative logic")
        args = request.GET
        if 'user' in args.keys():
            user = Gamer.objects.filter(user__username = args['user'])
            if user:
                user = user[0]
                gmechanic = self.select_mechanic(self.update_utilities(queryset,user))

                #g_mechanic serialization and html update
                serializer = GMechanicSerializer(gmechanic, context={'request': request}) 
                data = serializer.data      
                file = open(os.path.join(settings.TEMPLATES[0]['DIRS'][0], "mechanics/adaptatives.html"))
                new_html = file.read().replace('called_mechanic_url', "https://agmodule.herokuapp.com/api/g_mechanics/" + str(data['id']) + "/?" + args.urlencode())
                queryset.update(html = new_html)
        else:
            file = open(os.path.join(settings.TEMPLATES[0]['DIRS'][0], "mechanics/adaptatives.html"))
            new_html = file.read().replace('called_mechanic_url', "https://agmodule.herokuapp.com/api/g_mechanics/" + str(5) + "/?" + args.urlencode())
            queryset.update(html = new_html)
        ensamble_interaction_dynamic_properties(queryset)


class AdaptativeUtilitiesViewSet(AdaptativeViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    UNUSED !!!
    """

    def update_utilities(self,queryset,user): 
        # TO DO :: Add variable mechanics interaction index
        # UTILITIES :: "UserType-Mechanics Matrix" update policy 
        # input  queryset : QuerySet
        #        user : Gamer
        # return Mv : List
        print("Concrete Implementation of the Utilities Update")
        stats = InteractionStatistic.objects.filter(user = user.user.username)
        u = queryset[0].matrix().dot(np.array(user.gamer_profile.vectorize()))
        all_mechanics = GMechanic.objects.all()
        v = np.ones(len(all_mechanics))
        for idx in range(len(all_mechanics)):
            for s in stats:
                if all_mechanics[idx].id == s.mechanic.id:
                    v[idx] = s.interaction_index
        print(np.matrix(u).T.dot(np.matrix(v)).diagonal())
        return np.array( np.matrix(u).T.dot(np.matrix(v)).diagonal())[0].tolist()

    def select_mechanic(self,utilities):
        # UTILITIES :: "UserType-Mechanics Matrix" update policy 
        # input  queryset : QuerySet
        #        user : Gamer
        # return Mv : List
        print("Concrete Implementation of the Mechanic Selection")
        # DEFAULT :: "Choosing random index between argmax indexes" update policy
        #print("Uts",utilities)
        idx = rdm.choice(np.argwhere(utilities == np.amax(utilities)).flatten().tolist())
        #print(np.argwhere(utilities == np.amax(utilities)).flatten().tolist())
        return GMechanic.objects.all()[idx]


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

    # Concrete logic for leaderboards view
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

