from django.shortcuts import render
from django.template.response import TemplateResponse

def index(request):
    """
    Landingpage
    TO DO: Migrate to the main webapp
    """

    #request.GET.get('id', '')
    return TemplateResponse(request, 'index.html', {})
    
