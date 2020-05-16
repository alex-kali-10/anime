from django.shortcuts import render , redirect
from django.contrib import auth
from django.contrib.auth.forms import UserCreationForm
from django.views.generic.edit import FormView
from django.contrib.auth import authenticate, login
from .models import *
from django.contrib.auth.models import User
from .forms import *
from django.http import JsonResponse


from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib import auth
from datetime import datetime
from django.core import serializers
from django.contrib.auth.models import User

from django.contrib.auth.forms import UserCreationForm
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework.renderers import StaticHTMLRenderer
from rest_framework.decorators import parser_classes
from rest_framework.parsers import JSONParser
from rest_framework.parsers import MultiPartParser, FormParser, FileUploadParser
from rest_framework import views


def main(request):
    args = {}
    user = auth.get_user(request)
    if str(user) != 'AnonymousUser':
        args['avatar'] = user.profile.avatar.url
    else:
        args['avatar'] = 'false'
    form = Avatar_form
    args['page_router'] = 'first_page'
    return render(request, 'main.html', args)

def main1(request,item1):
    args = {}
    user = auth.get_user(request)
    if str(user) != 'AnonymousUser':
        args['avatar'] = user.profile.avatar.url
    else:
        args['avatar'] = 'false'
    form = Avatar_form
    args['page_router'] = item1
    return render(request, 'main.html', args)

def main2(request,item1,item2):
    args = {}
    user = auth.get_user(request)
    if str(user) != 'AnonymousUser':
        args['avatar'] = user.profile.avatar.url
    else:
        args['avatar'] = 'false'
    form = Avatar_form
    args['page_router'] = item1+'/'+item2
    return render(request, 'main.html', args)

def main3(request,item1,item2,item3):
    args = {}
    user = auth.get_user(request)
    if str(user) != 'AnonymousUser':
        args['avatar'] = user.profile.avatar.url
    else:
        args['avatar'] = 'false'
    form = Avatar_form
    args['page_router'] = item1+'/'+item2+'/'+item3
    return render(request, 'main.html', args)