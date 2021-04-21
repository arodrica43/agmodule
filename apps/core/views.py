from django.shortcuts import render
from apps.api.serializers import GMechanicSerializer
from apps.core.models import Gamer, Unlockable, g_mechanic_cast
from django.template.response import TemplateResponse
import os
from django.conf import settings

import threading

lock6 = threading.Lock()

def index(request):
    """
    Landingpage
    TO DO: Migrate to the main webapp
    """

    #request.GET.get('id', '')
    return TemplateResponse(request, 'index.html', {})
    
def adaptative_statistics(request):
    """
    Landingpage
    TO DO: Migrate to the main webapp
    """
    users = Gamer.objects.all()
    #request.GET.get('id', '')
    user = ""
    existing_user = False
    exp = "experiment" in request.GET.keys()
    if "user" in request.GET.keys():
        user = Gamer.objects.filter(user__username = request.GET['user'])
        if user:
            user = user[0].user.username
            existing_user = True
    return TemplateResponse(request, 'adaptative_statistics.html', {'users': users,'user':user, 'existing_user': existing_user, "experimental" : exp})
    
def preview_gmechanic(request, gmechanic_id):
    """
    Page for rendering the html of a GComponent
    TO DO: Migrate to the main webapp
    """
    #print("hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
    lock6.acquire()
    try:
        queryset, name = g_mechanic_cast(gmechanic_id)
        import os
        from django.conf import settings
        
        file = open(os.path.join(settings.TEMPLATES[0]['DIRS'][0], "mechanics/" + name + '.html'))
        queryset.update(html = file.read().replace("called_mechanic_url","https://agmodule.herokuapp.com/api/" + name + "/" + str(gmechanic_id) + "/?" + request.GET.urlencode()))
        #print(queryset[0].html)
        #print(file.read())
        serializer = GMechanicSerializer(queryset[0], context={'request': request}) 
        #print(serializer.data)
        lock6.release()
        return TemplateResponse(request, 'preview_mechanic.html', {"data":serializer.data, "url_query": request.GET.urlencode()})
    except:
        lock6.release()
        return preview_gmechanic(request,gmechanic_id)


def preview_game(request, id,username):
    
    queryset = Unlockable.objects.filter(id = id)
    return TemplateResponse(request, 'preview_game.html', {"data":queryset[0], "uname": username})

