"""agmodule URL Configuration

The `urlpatterns` list routes URLs to api. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function api
    1. Add an import:  from my_app import api
    2. Add a URL to urlpatterns:  path('', api.home, name='home')
Class-based api
    1. Add an import:  from other_app.api import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path, re_path
from django.contrib.staticfiles.urls import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from apps.core import views as core
from apps.api import views as api
from apps.api.urls import router
from django.conf.urls import url
from agmodule import settings

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
	# Core Views
	path('',  core.index),
    path('admin/', admin.site.urls),
    path('adaptative_statistics/',core.adaptative_statistics),
    path('preview/g_mechanics/<int:gmechanic_id>/', core.preview_gmechanic),
    path('preview/games/<int:id>/<str:username>/', core.preview_game),
    # API Views
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/gamers/<str:username>', api.GamerViewSet),
    path('api/gamers/<str:username>/add_gift', api.add_gift),
    path('api/gamers/<str:username>/open_gift', api.open_gift),
    path('api/gamers/<str:username>/add_friend/<str:friend_username>', api.add_friend),
    path('api/gamers/<str:username>/del_friend/<str:friend_username>', api.del_friend),
    path('api/gamers/<str:username>/retrieve_friends', api.retrieve_friends),
    path('api/gamers/<str:username>/edit_social_profile', api.edit_social_profile),
    path('api/retrieve_users_search', api.retrieve_users_search),
    path('api/badges/retrieve_for_user/<str:username>', api.view_badge_set),
    path('api/unlockables/retrieve_for_user/<str:username>', api.view_unlockable_set),
    path('api/unlockables/<int:pk>/unlock_for/<str:username>', api.unlock_unlockable),
    path('api/challenges/retrieve_for_user/<str:username>', api.view_challenge_set),
    path('api/g_mechanics/retrieve_adaptative_widget_id', api.retrieve_adaptative_widget_id),
    path('api/challenges/claim_reward/<int:challenge_id>/<str:username>', api.claim_challenge_reward),
    path('api/<str:mechanic_class>/retrieve_dashboard_mechanic', api.retrieve_dashboard_mechanic),
    path('admin/doc/', include('django.contrib.admindocs.urls'))
]

urlpatterns += staticfiles_urlpatterns()
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


