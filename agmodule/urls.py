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
from drf_yasg.views import get_schema_view

# Swagger documentation setup
schema_view = get_schema_view(
    openapi.Info(
        title="Snippets API",
        default_version='v1',
        description="Test description",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@snippets.local"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

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
    path('api/gift_to_all', api.add_gift_all),
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
    path('api/challenges/choose_challenge_type/<str:challenge_type>/<str:username>', api.choose_challenge_type),
    path('api/g_mechanics/retrieve_adaptative_widget_id', api.retrieve_adaptative_widget_id),
    path('api/challenges/claim_reward/<int:challenge_id>/<str:username>', api.claim_challenge_reward),
    path('api/<str:mechanic_class>/retrieve_dashboard_mechanic', api.retrieve_dashboard_mechanic),
    path('api/social_statuses/widget/<str:username>', api.social_status_widget),
    path('api/badges/<int:id>/change_icon', api.change_icon),
    path('api/statistics/get_interaction_index/<str:username>/<int:mechanic_id>', api.get_interaction_index), 
    path('api/statistics/get_current_valoration/<str:username>/<int:mechanic_id>', api.get_previous_valoration), 
    path('api/get_accessible_mechanics/<str:username>', api.get_accessible_mechanics),
    path('docs/', include_docs_urls(title='Todo Api')),
    url(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    url(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    url(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

]

urlpatterns += staticfiles_urlpatterns()
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)