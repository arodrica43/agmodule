from rest_framework import routers
from apps.api import views as api

router = routers.DefaultRouter()
#Basic urls
router.register(r'users', api.UserViewSet)
router.register(r'groups', api.GroupViewSet)
router.register(r'gamers', api.GamerViewSet)
router.register(r'g_mechanics', api.GMechanicViewSet)
router.register(r'statistics', api.InteractionStatisticViewSet)
router.register(r'gamer_profiles', api.GamerProfileViewSet)
router.register(r'emotion_profiles', api.EmotionProfileViewSet)
router.register(r'social_profiles', api.SocialProfileViewSet)
# Gamification mechanics urls
router.register(r'development_tools', api.DevelopementToolViewSet)
router.register(r'challenges', api.ChallengeViewSet)
router.register(r'easter_eggs', api.EasterEggViewSet)
router.register(r'unlockables', api.UnlockableViewSet)
router.register(r'badges', api.BadgeViewSet)
router.register(r'levels', api.LevelViewSet)
router.register(r'points', api.PointViewSet)
router.register(r'leaderboards', api.LeaderboardViewSet)
router.register(r'lotteries', api.LotteryViewSet)
router.register(r'social_networks', api.SocialNetworkViewSet)
router.register(r'social_statuses', api.SocialStatusViewSet)
router.register(r'knowledge_shares', api.KnowledgeShareViewSet)
router.register(r'gifts', api.GiftViewSet)
router.register(r'gift_openers', api.GiftOpenerViewSet)
#Adaptative mechanics
router.register(r'adaptatives', api.AdaptativeViewSet)
# Gamification widget mechanics urls
router.register(r'development_tool_widgets', api.DevelopementToolWidgetViewSet)
router.register(r'challenge_widgets', api.ChallengeWidgetViewSet)
router.register(r'easter_egg_widgets', api.EasterEggWidgetViewSet)
router.register(r'unlockable_widgets', api.UnlockableWidgetViewSet)
router.register(r'badge_widgets', api.BadgeWidgetViewSet)
router.register(r'level_widgets', api.LevelWidgetViewSet)
router.register(r'point_widgets', api.PointWidgetViewSet)
router.register(r'leaderboard_widgets', api.LeaderboardWidgetViewSet)
router.register(r'lottery_widgets', api.LotteryWidgetViewSet)
router.register(r'social_network_widgets', api.SocialNetworkWidgetViewSet)
router.register(r'social_status_widgets', api.SocialStatusWidgetViewSet)
router.register(r'knowledge_share_widgets', api.KnowledgeShareWidgetViewSet)
router.register(r'gift_widgets', api.GiftWidgetViewSet)
router.register(r'gift_opener_widgets', api.GiftOpenerWidgetViewSet)
#Adaptative mechanics
router.register(r'adaptative_widgets', api.AdaptativeWidgetViewSet)
router.register(r'gmechanic_lists', api.GMechanicListViewSet)

