from django.shortcuts import render
from django.contrib.auth.models import User, Group
from django.http import Http404
from rest_framework import viewsets
from rest_framework.response import Response
from apps.api.serializers import *
from apps.core.models import *

# User-related API views.

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

    def retrieve(self, request, pk=None):
        queryset = User.objects.filter(username=pk)
        try:
            pk = int(pk)
            queryset = User.objects.filter(id=pk)
            if len(queryset) > 0:
                serializer = UserSerializer(queryset[0], context={'request': request})
                return Response(serializer.data)
            else:
                raise Http404       
        except ValueError as error:
            if len(queryset) > 0:
                serializer = UserSerializer(queryset[0], context={'request': request})
                return Response(serializer.data)
            else:
                raise Http404

    def update(self, request, *args, **kwargs):
        #lock8.acquire()
        try:
            instance = self.queryset.get(pk=kwargs.get('pk'))
        except ValueError:
            instance = self.queryset.get(username=kwargs.get('pk'))
        serializer = self.serializer_class(instance, data=request.data, partial=True,context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        #lock8.release()
        return Response(serializer.data)

class GamerViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Gamer.objects.all().order_by('-user_id')
    serializer_class = GamerSerializer
    filter_fields = ('user__username' )

    def retrieve(self, request, pk=None):
        gamer_lock.acquire()
        try:
            queryset = Gamer.objects.filter(user__username=pk)
            try:     
                pk = int(pk)
                queryset = Gamer.objects.filter(user__id=pk)
                if len(queryset) > 0:
                    sp_data = queryset[0].social_profile.data
                    sp_data['followers'] = len([x for x in Gamer.objects.all() if queryset[0].user.username in x.social_profile.data['friends']])
                    sp = SocialProfile.objects.filter(id = queryset[0].social_profile.id)
                    sp.update(data = sp_data)
                    serializer = GamerSerializer(queryset[0], context={'request': request})
                    gamer_lock.release()    
                    return Response(serializer.data)
                else:
                    raise Http404       
            except ValueError as error:
                if len(queryset) > 0:
                    sp_data = queryset[0].social_profile.data
                    sp_data['followers'] = len([x for x in Gamer.objects.all() if queryset[0].user.username in x.social_profile.data['friends']])
                    sp = SocialProfile.objects.filter(id = queryset[0].social_profile.id)
                    sp.update(data = sp_data)
                    serializer = GamerSerializer(queryset[0], context={'request': request})
                    gamer_lock.release()
                    return Response(serializer.data)
                else:
                    raise Http404
        except:
            gamer_lock.release()
            raise Http404


    def update(self, request, *args, **kwargs):
        #lock7.acquire()
        try:
            instance = self.queryset.get(pk=kwargs.get('pk'))
           
        except ValueError:
            instance = self.queryset.get(user__username=kwargs.get('pk'))
        # print(type(instance.gamer_profile.data))
        # print(instance.gamer_profile.data)

        serializer = self.serializer_class(instance, data=request.data, partial=True,context={'request': request})
        
        serializer.is_valid(raise_exception=True)
        
        serializer.save()
        #lock7.release()
        return Response(serializer.data)

class GamerProfileViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = GamerProfile.objects.all()
    serializer_class = GamerProfileSerializer

class EmotionProfileViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = EmotionProfile.objects.all()
    serializer_class = EmotionProfileSerializer

class SocialProfileViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = SocialProfile.objects.all()
    serializer_class = SocialProfileSerializer

class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
