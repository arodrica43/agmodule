from django.shortcuts import render

def index(request):
    """
    Landingpage
    TO DO: Migrate to the main webapp
    """

    #request.GET.get('id', '')
    return TemplateResponse(request, 'index.html', {})
    
