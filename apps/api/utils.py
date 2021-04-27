from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponse, JsonResponse, Http404
from apps.api.serializers import *
from apps.core.models import *
import numpy as np
import random as rdm
import os
import threading

lock2 = threading.Lock()
lock3 = threading.Lock()
lock4 = threading.Lock()
lock5 = threading.Lock()
lock6 = threading.Lock()
lock7 = threading.Lock()
lock8 = threading.Lock()
lock9 = threading.Lock()

interaction_files = [("include-onclick-tracking","onclick.js"), 
                     ("include-base-tracking","default.js"), 
                     ("include_interaction_testing_tools","interaction_testing.js")
                    ]

allowed_mechanics = {"easy" : [
                                "challenge_widgets",
                                "easter_egg_widgets",
                                "level_widgets",
                                "point_widgets",
                                "leaderboard_widgets",
                                "social_status_widgets",
                                "knowledge_share_widgets"
                            ],  
                    "hard" : [
                                "development_tool_widgets",
                                "unlockable_widgets",
                                "badge_widgets",
                                "gift_opener_widgets",
                                "lottery_widgets",
                                "social_network_widgets",
                                "gift_widgets"
                            ]
                    }


def ensamble_interaction_dynamic_properties(queryset, filenames = interaction_files):
    try:
        for i in range(len(filenames)):
            file = open(os.path.join(settings.TEMPLATES[0]['DIRS'][1],  "interactions/" + filenames[i][1]))
            queryset.update(html = queryset[0].html.replace(filenames[i][0],file.read())) 
    except:
        raise Http404


def retrieve_dashboard_mechanic(request,mechanic_class):

    result = GMechanicList.objects.filter(mechanic = mechanic_class) 
    if result:
        result = GMechanicListSerializer(result[0], context={'request': request}).data
    else:
        result = {'html' : "Work in progress..."}
    return JsonResponse({'data': result})

def retrieve_adaptative_widget_id(request):

    lock7.acquire()
    try:
        queryset = AdaptativeWidget.objects.all()
        args = request.GET
        if 'user' in args.keys():
            user = Gamer.objects.filter(user__username = args['user'])
            if user:
                user = user[0]
                # BEGIN CASE ANALYSIS ################################################################################################################################
                #Case analysis for the experimental. The users contain an attibute <case> in user.gamer_profile.data                                                 #
                #Once the experiment is done, you should delete this code                                                                                            #                                                                                    
                if 'experimental' in args.keys():                                                                     
                    case = user.gamer_profile.data['case']
                    if "A" in case: # Random mechanic                                                                                                                #
                        gmechanic = rdm.choice(GMechanic.objects.all())
                    elif "B" in case or "C" in case: 
                        #Case B :: Gamer profile isn't updated at every GMechanic&User PUT request -- See at Serializers.GMechanic.update (case B don't modify PT)   #
                        #Case C :: Dynamic Gamer Profile (Our main algorithm). Only change on Serializers.GMechanic.update                                           #
                        #Lavue cases are tagged by 'a' and 'b', while choice cases by '1' and '2'                                                                    #
                        
                        #Lavue Matrix Utilities                                                                                                                      #
                        #Lavue case -- Current matrix = 1s and 0s matrix => alg ~ choose PTi predominating and ponderate mechanics of the same type in utilities     #
                        utilities = queryset[0].widget_matrix().dot(np.array(user.gamer_profile.vectorize()))
                        #Lavue case -- We can consider a refined matrix, so every mechanic has its own MPT (Mechanic PT)                                             #
                        # WIP :: Compute utilities from a refined matrix (refined_widget_matrix())                                                                  #
                        # utilities = refined_widget_matrix().dot(np.array(user.gamer_profile.vectorize()))
                        #GMechanic Choosing                                                                                                                          #
                        if "1" in case: #Max Random                                                                                                                  #
                            m = max(utilities)
                            gmechanics = GMechanic.objects.all()
                            gmechanic = rdm.choice([gmechanics[i] for i in range(len(utilities)) if utilities[i] == m])
                        elif "2" in case: #Weighted Random                                                                                                           #
                            prob = utilities/utilities.sum()
                            r = rdm.random()
                            acc, idx = 0, 0
                            for i in range(len(prob)):
                                pi = prob[i]
                                if acc < r and r < acc + pi:
                                    idx = i
                                    break
                                acc += pi
                            gmechanic = GMechanic.objects.all()[idx] 

                    qset, val = g_mechanic_cast(gmechanic.pk)
                    clss_idx = -1
                    print(qset)
                    print(qset[0].mechanic_type)
                    print(qset[0].associated_profile)
                    if qset:
                        clss_idx = qset[0].associated_profile[qset[0].mechanic_type]
                    lock7.release() 
                    return JsonResponse({
                                            'gmechanic_id': gmechanic.pk,
                                            'gmechanic_class': val, 
                                            'class_idx' : clss_idx,
                                            'accessible_mechanics' : user.gamer_profile.data["accessible_mechanics"]
                                        })
                                                                                                                                                                     #                                                                                                                                    #
                # END OF CASE ANALYSIS ###############################################################################################################################
                
                # This is the default adaptative_widget procedure
                else: 
                    utilities = queryset[0].widget_matrix().dot(np.array(user.gamer_profile.vectorize()))
                    if 'difficulty' in args.keys():
                        if args['difficulty'] in ['easy', 'hard']:
                            for i in range(len(utilities)):
                                if utilities[i] > 0:
                                    _ , val = g_mechanic_cast(GMechanic.objects.all()[i].pk)
                                    if val not in allowed_mechanics[args['difficulty']]:
                                        utilities[i] = 0
                    prob = utilities/utilities.sum()
                    r = rdm.random()
                    acc, idx = 0, 0
                    for i in range(len(prob)):
                        pi = prob[i]
                        if acc < r and r < acc + pi:
                            idx = i
                            break
                        acc += pi
                    gmechanic = GMechanic.objects.all()[idx]
                    qset , val = g_mechanic_cast(gmechanic.pk)
                    clss_idx = -1
                    if qset:
                        clss_idx = qset[0].associated_profile[qset[0].mechanic_type]
                    if 'accessible_mechanics' not in user.gamer_profile.data.keys():
                         user.gamer_profile.data["accessible_mechanics"] = []
                         user.gamer_profile.save()
                    acc_mechs = user.gamer_profile.data["accessible_mechanics"]
                    if val not in acc_mechs :
                        user.gamer_profile.data["accessible_mechanics"] += [val]
                        user.gamer_profile.save()
                    lock7.release() 
                    return JsonResponse({'gmechanic_id': gmechanic.pk, 'gmechanic_class': val, 'class_idx':  clss_idx, 'accessible_mechanics' : user.gamer_profile.data["accessible_mechanics"]})
            else:
                raise Exception("No selected user")
        else:
            raise Exception("No selected user")
    except:
        lock7.release()
        raise Http404


def open_gift(request,username):

    lock4.acquire()
    try:
        message = ""
        text = "false" 
        user = Gamer.objects.filter(user__username = username)[0]
        if 'index' in request.GET.keys():
            if user.gamer_profile.data['gifts'][int(request.GET['index'])][1] == 'text':
                text = "true"
                message = "The user " + user.gamer_profile.data['gifts'][int(request.GET['index'])][0] + " send you the following message: " +  user.gamer_profile.data['gifts'][int(request.GET['index'])][2]
            else:
                user.gamer_profile.data[user.gamer_profile.data['gifts'][int(request.GET['index'])][1]] += int(user.gamer_profile.data['gifts'][int(request.GET['index'])][2])
                what = "$"
                if(user.gamer_profile.data['gifts'][int(request.GET['index'])][1] == 'score'):
                    what = "points"    
                message = "You have recieved " + user.gamer_profile.data['gifts'][int(request.GET['index'])][2] + " " + what + " from " + user.gamer_profile.data['gifts'][int(request.GET['index'])][0] + "!"
            del user.gamer_profile.data['gifts'][int(request.GET['index'])] 
            user.gamer_profile.save()
        lock4.release()
        return JsonResponse({'results': 'OK', 'message':message})
    except:
        lock4.release()
        raise Http404

def append_gift(request, user):
    if 'from' in request.GET.keys():
        if 'type' in request.GET.keys():
            if "content" in request.GET.keys():
                user.gamer_profile.data['gifts'] += [[request.GET['from'],request.GET['type'], request.GET['content']]]
                user.gamer_profile.save()

def add_gift(request,username):

    lock4.acquire()
    try:
        print("Adding gift to",username)
        user = Gamer.objects.filter(user__username = username)[0]
        append_gift(request,user)
        lock4.release()
        return JsonResponse({'results': 'OK'})
    except:
        lock4.release()
        raise Http404

def add_gift_all(request):

    lock4.acquire()
    try:
        print("Adding gift to everyone")
        users = Gamer.objects.all()
        for user in users:
            append_gift(request,user)
        lock4.release()
        return JsonResponse({'results': 'OK'})
    except:
        lock4.release()
        raise Http404

def add_friend(request,username,friend_username):

    lock2.acquire()
    user = Gamer.objects.filter(user__username = username)[0]
    if friend_username not in user.social_profile.data['friends']:
        
        user.social_profile.data['friends'] += [friend_username]
        user.social_profile.save()
    lock2.release()
    return HttpResponse('OK')

def del_friend(request,username,friend_username):
    
    lock3.acquire()
    user = Gamer.objects.filter(user__username = username)[0]
    if friend_username in user.social_profile.data['friends']:
        user.social_profile.data['friends'].remove(friend_username)
        user.social_profile.save()
    lock3.release()
    return HttpResponse('OK')

def retrieve_friends(request,username):

    user = Gamer.objects.filter(user__username = username)[0]
    friends = [[SocialProfileSerializer(x.social_profile,context={'request': request}).data, UserSerializer(x.user,context={'request': request}).data ] for x in Gamer.objects.all() if x.user.username in user.social_profile.data['friends']]
    
    return JsonResponse({'friends': friends})

def retrieve_users_search(request):
    if('uname_contains' in request.GET.keys()):
        queryset = [GamerSerializer(x,context={'request': request}).data for x in Gamer.objects.all() if  request.GET['uname_contains'] in x.user.username]
    else:
        queryset = [GamerSerializer(x,context={'request': request}).data for x in Gamer.objects.all()]

    return JsonResponse({'results':queryset})


def edit_social_profile(request,username):

    print("Uploading new social profile...")
    user = Gamer.objects.filter(user__username = username)[0]
    user.social_profile.image = request.GET['new_image']
    user.social_profile.description = request.GET['new_description']
    user.social_profile.save()
    return JsonResponse({'results':'OK'})

def view_badge_set(request, username):
  
    lock9.acquire()
    try:
        try:
            user = Gamer.objects.filter(user__username = username)[0]
        except:
            print("User found")
            raise Http404

        badge_ids = []
        if 'badges' in user.gamer_profile.data.keys():
            badge_ids = user.gamer_profile.data['badges']
      
        all_badges = Badge.objects.all()

        badge_set = []
        for badge in all_badges:

            print(2)
            if 'unlock' in request.GET.keys(): # Procedural badge unlocking
                badge_set = [[BadgeSerializer(badge, context={'request': request}).data,badge.id in badge_ids]]
                print(3)
                if request.GET['unlock'] == 'true': # TO DO - Unlock badge by name. Queryset q -> searchBadge(q.(unlock&badge_name))
                    print(4, request.GET['unlock'])
                    if 'widget_id' in request.GET.keys():
                        print(5)
                        if 'badge_widgets_executed' not in user.gamer_profile.data.keys():
                            user.gamer_profile.data['badge_widgets_executed'] = []
                            user.gamer_profile.save()
                        
                        if request.GET['widget_id'] not in user.gamer_profile.data['badge_widgets_executed']:
                         
                            if badge.id not in user.gamer_profile.data['badges']:
                                print(6)
                                user.gamer_profile.data['badges'] += [badge.id]
                                user.gamer_profile.data['badge_widgets_executed'] += [request.GET['widget_id']]
                                user.gamer_profile.save()
                                badge_set = [[BadgeSerializer(badge, context={'request': request}).data,False]]
                                print(7)
                                break
                        else:
                            print(8)
                            badge_set = [[BadgeSerializer(Badge.objects.filter(pk = badge_ids[-1])[0], context={'request': request}).data, True]]
                            print(9)
                            break
            else:
                if user.gamer_profile.data[badge.by] >= badge.threshold and (badge.id not in user.gamer_profile.data['badges']):
                    user.gamer_profile.data['badges'] += [badge.id]
                    user.gamer_profile.save()
                badge_set += [[BadgeSerializer(badge, context={'request': request}).data, badge.id in badge_ids]]
        lock9.release()        
        return JsonResponse({'results':badge_set})
    except:
        lock9.release()
        return JsonResponse({'results':[]})

def unlock_unlockable(request,username,pk):

    lock6.acquire()
    try:
        try:
            user = Gamer.objects.filter(user__username = username)[0]
        except:
            print("User not found by username", username)
            raise Http404
        try:
            unlk = Unlockable.objects.filter(id = pk)[0]
        except:
            print("Unlockable not found by id", pk)
            raise Http404
        if "index" in request.GET.keys():
            if request.GET["index"] not in user.gamer_profile.data['unlockables']:
                user.gamer_profile.data['unlockables'] += [unlk.id, request.GET["index"]]
                user.gamer_profile.save()
                lock6.release()
                return JsonResponse({'results':'OK'})
            else:
                lock6.release()
                raise Http404
        else:
            lock6.release()
            raise Http404
    except:
        lock6.release()
        raise Http404


def view_unlockable_set(request, username):
   
    lock6.acquire()
    try:
        try:
            user = Gamer.objects.filter(user__username = username)[0]
        except:
            print("User found")
            raise Http404

        unlock_ids = []
        if 'unlockables' in user.gamer_profile.data.keys():
            unlock_ids = user.gamer_profile.data['unlockables']
      
        all_unlocks = Unlockable.objects.all()

        unlocks_set = []
        for unlk in all_unlocks:
            if user.gamer_profile.data[unlk.by] >= unlk.threshold and (unlk.id not in user.gamer_profile.data['unlockables']):
                user.gamer_profile.data['unlockables'] += [unlk.id]
                user.gamer_profile.save()
            if 'index' in request.GET.keys():
                if unlk.id not in user.gamer_profile.data['unlockables'] and request.GET['index'] not in user.gamer_profile.data['unlockables']:
                    unlocks_set += [UnlockableSerializer(unlk, context={'request': request}).data]
            else:
                unlocks_set += [[UnlockableSerializer(unlk, context={'request': request}).data, unlk.id in unlock_ids]]
        
        lock6.release()
        return JsonResponse({'results':unlocks_set})
    except:
        lock6.release()
        raise Http404

def claim_challenge_reward(request, challenge_id, username):
    lock8.acquire()
    try:
        try:
            user = Gamer.objects.filter(user__username = username)[0]
        except:
            print("User not found")
            raise Http404

        chal = Challenge.objects.filter(id = challenge_id)
        print(chal)
        chal = chal[0]
        user.gamer_profile.data[chal.reward_by] += chal.reward_value
        user.gamer_profile.data['challenges'] += ["C" + str(challenge_id)]
        user.gamer_profile.save()
        lock8.release()
        return JsonResponse({'results': 'OK'})
    except:
        lock8.release()
        raise Http404


def view_challenge_set(request, username):
   
    lock8.acquire()
    try:
        try:
            user = Gamer.objects.filter(user__username = username)[0]
        except:
            print("User not found")
            raise Http404

        unlock_ids = []
        if 'challenges' in user.gamer_profile.data.keys():
            unlock_ids = user.gamer_profile.data['challenges']
      
        all_unlocks = Challenge.objects.all()

        unlocks_set = []
        for unlk in all_unlocks:
            if user.gamer_profile.data[unlk.by] >= unlk.threshold and (unlk.id not in user.gamer_profile.data['challenges']) :
                user.gamer_profile.data['challenges'] += [unlk.id]
                user.gamer_profile.save()
            unlocks_set += [[ChallengeSerializer(unlk, context={'request': request}).data, unlk.id in unlock_ids, user.gamer_profile.data[unlk.by], "C" + str(unlk.id) in unlock_ids]]
        lock8.release()
        return JsonResponse({'results':unlocks_set})
    except:
        lock8.release()
        raise Http404

def social_status_widget(request, username):
    
    try:
        user = Gamer.objects.filter(user__username = username)[0]
    except:
        print("User found")
        raise Http404

    data = user.social_profile.data
    res = [['friends', len(data['friends'])],['followers',  data['followers']],['views', data['views']]]
    return JsonResponse({'results': res})

def get_previous_valoration(request, username, mechanic_id):

    import math as ma

    user_stats = InteractionStatistic.objects.filter(user = username)
    demand = None
    for stat in user_stats:
        if stat.mechanic.id == mechanic_id:
            demand = stat
            break
    if demand:
        if 'valoration' in demand.log.keys():
            val = demand.log['valoration']
            new_val = ma.floor(4*val + 1)
            return JsonResponse({'results': new_val, 'float_result':val})
        else: 
            return JsonResponse({'results': 3})
    else:
        return JsonResponse({'results': 3})

def get_accessible_mechanics(request, username):
    try:
        user = Gamer.objects.filter(user__username = username)[0]
    except:
        print("User found")
        raise Http404
    return JsonResponse({'results': user.gamer_profile.data['accessible_mechanics']})

def change_icon(request, id):
    badge = Badge.objects.filter(id = id)
    result = 'ERROR'
    if badge:
        if 'option' in request.GET.keys():
            img = 'reward.png'
            option = request.GET['option']
            for i in ['1','2','3','4','5']:
                if option == i:
                    img = 'b' + i + ".svg"
            badge.update(icon = "badge_icons/" + img)
            result = "OK"
    return JsonResponse({'results': result})



