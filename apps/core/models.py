from apps.core.mechanics import *
from apps.core.profiles import *

# Traduction association between models and its name label
mechanics_list = [Adaptative, Badge, Challenge, DevelopmentTool, EasterEgg, Gift, GiftOpener, KnowledgeShare, Level, Lottery, Point, SocialNetwork, SocialStatus, Unlockable, Leaderboard, GMechanicList]
mechanics_list += [AdaptativeWidget, BadgeWidget, ChallengeWidget, DevelopmentToolWidget, EasterEggWidget, GiftWidget, GiftOpenerWidget, KnowledgeShareWidget, LevelWidget, LotteryWidget, PointWidget, SocialNetworkWidget, SocialStatusWidget, UnlockableWidget, LeaderboardWidget]
mechanics_list_names = ['adaptatives','badges', 'challenges', 'development_tools', 'easter_eggs', 'gifts', 'gift_openers', 'knowledge_shares', 'levels', 'lotteries', 'points', 'social_networks', 'social_statuses', 'unlockables', 'leaderboards', 'gmechanic_lists']
mechanics_list_names += ['adaptative_widgets','badge_widgets', 'challenge_widgets', 'development_tool_widgets', 'easter_egg_widgets', 'gift_widgets', 'gift_opener_widgets', 'knowledge_share_widgets', 'level_widgets', 'lottery_widgets', 'point_widgets', 'social_network_widgets', 'social_status_widgets', 'unlockable_widgets', 'leaderboard_widgets']

# Global parameters for counting the possible interactions in each mechanic
mechanic_list_total_interactions = {
    'badges':9, 
    'challenges':9, 
    'development_tools':30, 
    'easter_eggs':2, 
    'gifts':30, 
    'gift_openers':10, 
    'knowledge_shares':6, 
    'levels':2, 
    'lotteries':2, 
    'points':1, 
    'social_networks':35, 
    'social_statuses':20, 
    'unlockables':10, 
    'leaderboards':5,
    'badge_widgets':1, 
    'challenge_widgets':1, 
    'development_tool_widgets':1, 
    'easter_egg_widgets':1, 
    'gift_widgets':1, 
    'gift_opener_widgets':1, 
    'knowledge_share_widgets':1, 
    'level_widgets':1, 
    'lottery_widgets':1, 
    'point_widgets':1, 
    'social_network_widgets':1, 
    'social_status_widgets':1, 
    'unlockable_widgets':1, 
    'leaderboard_widgets':1
}

def g_mechanic_cast(gmechanic_id):

    for mech_idx in range(len(mechanics_list)):
        queryset = mechanics_list[mech_idx].objects.filter(id = gmechanic_id)
        if queryset: 
            return queryset, mechanics_list_names[mech_idx]
    
    return queryset, 'g_mechanics'

def refined_widget_matrix(last_mechanic = None):
    #Refine row values, so every mechanic has its own static PT.
    import numpy as np
    all_mechanics =  GMechanic.objects.all()
    M = np.zeros((len(all_mechanics),7))
    for i in range(len(all_mechanics)):
        idx = all_mechanics[i].associated_profile[all_mechanics[i].mechanic_type.value]
        _ , val = g_mechanic_cast(all_mechanics[i].pk)

        if val == "badge_widgets" and non_repeat(val):
            M[i,2] = 1
            # case = 0 by default
        elif val == "challenge_widgets" and val != last_mechanic: # The second condition avoid repeating mechanic
            M[i,0] = 1
        elif val == 'development_tool_widgets' and val != last_mechanic:
            M[i,0] = 1
        elif val == 'easter_egg_widgets' and val != last_mechanic:
            M[i,1] = 1
        elif val == 'gift_widgets' and val != last_mechanic:
            M[i,5] = 1
        elif val == 'gift_opener_widgets' and val != last_mechanic:
            M[i,3] = 1
        elif val == 'knowledge_share_widgets' and val != last_mechanic:
            M[i,5] = 1
        elif val == 'level_widgets' and val != last_mechanic:
            M[i,2] = 1
        elif val == 'lottery_widgets' and val != last_mechanic:
            M[i,3] = 1
        elif val == 'point_widgets' and val != last_mechanic: # This mechanic is transversal
            M[i,0] = 1./6
            M[i,1] = 1./6
            M[i,2] = 1./6
            M[i,3] = 1./6
            M[i,4] = 1./6
            M[i,5] = 1./6
        elif val == 'social_network_widgets' and val != last_mechanic :
            M[i,4] = 1
        elif val == 'social_status_widgets' and val != last_mechanic:
            M[i,4] = 1
        elif val == 'unlockable_widgets' and val != last_mechanic:
            M[i,1] = 1
        elif val == 'leaderboard_widgets' and val != last_mechanic:
            M[i,3] = 1
            
    print(M)
    return M
