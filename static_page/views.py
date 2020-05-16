from django.shortcuts import render , redirect
from django.contrib import auth
from django.contrib.auth.forms import UserCreationForm
from django.views.generic.edit import FormView
from django.contrib.auth import authenticate, login
from .models import *
from django.contrib.auth.models import User
from main.forms import *
from django.http import JsonResponse
import math

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from main.models import *

from django.template.response import SimpleTemplateResponse


def first_page(request):
    args = {}
    user = auth.get_user(request)
    args['top_slider_list'] = Film.objects.filter()[:20]
    args['apdate_list'] = Item_video.objects.filter()[:13]
    args['news_list'] = News.objects.filter()[:6]
    args['anons_list'] = Film.objects.filter()[:6]
    args['recommend_list'] = Recommend_video.objects.filter()[:9]
    args['new_film_list'] = Film.objects.filter()[:20]
    return render(request, 'first_page.html', args)


def top100(request):
    args = {}
    user = auth.get_user(request)
    print(user)

    args['films'] = Film.objects.filter(type = 'Сериал')[:20]

    return render(request, 'top100.html', args)

def top100films(request):
    args = {}
    user = auth.get_user(request)
    print(user)
    #htmlmessage = SimpleTemplateResponse('top100.html', args)
    #rendered_data = htmlmessage.rendered_content
    args['films'] = Film.objects.filter(type = 'Полнометражный фильм')[:20]
    return render(request, 'top100films.html', args)

def film(request,pk):
    args = {}
    user = auth.get_user(request)
    film = Film.objects.filter(id = pk).get()
    args['film'] = film
    if str(user) != 'AnonymousUser':
        args['my_carma_film'] = film.my_carma(user)
        args['my_list_film'] = film.my_list_film(user)
    else:
        args['my_carma_film'] = 'false'
        args['my_list_film'] = 'false'
    return render(request, 'film.html', args)


def catalog(request):
    args = {}
    user = auth.get_user(request)
    count = Film.objects.filter().count()
    args['films'] = Film.objects.filter()[:20]
    args['lastPage'] = math.ceil(count / 20)
    return render(request, 'catalog.html', args)

def studio(request,order,name):
    args = {}
    user = auth.get_user(request)
    list = Film.objects.filter(studio = name)
    if order == 'popular':
        list = list.order_by('-views')
    else:
        list = list.order_by('-year')
    count = list.count()
    args['films'] = list[:20]
    args['lastPage'] = math.ceil(count / 20)
    args['name_cat'] = 'Студия: '
    args['name'] = name
    args['order'] = order
    args['name_catalog'] = 'studio'
    return render(request, 'lite_catalog.html', args)

def studio_pk(request,order,name,pk):
    args = {}
    user = auth.get_user(request)
    list = Film.objects.filter(studio = name)
    if order == 'popular':
        list = list.order_by('-views')
    else:
        list = list.order_by('-year')
    count = list.count()
    args['films'] = list[(20*int(pk)-20):(20*int(pk))]
    args['lastPage'] = math.ceil(count / 20)
    args['name_cat'] = 'Студия: '
    args['name'] = name
    args['name_catalog'] = 'studio'
    return render(request, 'films.html', args)

def producer(request,order,name):
    args = {}
    user = auth.get_user(request)
    list = Film.objects.filter(producer = name)
    if order == 'popular':
        list = list.order_by('-views')
    else:
        list = list.order_by('-year')
    count = list.count()
    args['films'] = list[:20]
    args['lastPage'] = math.ceil(count / 20)
    args['name_cat'] = 'Продюссер: '
    args['name'] = name
    args['order'] = order
    args['name_catalog'] = 'producer'
    return render(request, 'lite_catalog.html', args)


def producer_pk(request,order,name,pk):
    args = {}
    user = auth.get_user(request)
    list = Film.objects.filter(producer = name)
    if order == 'popular':
        list = list.order_by('-views')
    else:
        list = list.order_by('-year')
    count = list.count()
    args['films'] = list[(20*int(pk)-20):(20*int(pk))]
    args['lastPage'] = math.ceil(count / 20)
    args['name_cat'] = 'Продюссер: '
    args['name'] = name
    args['name_catalog'] = 'producer'
    return render(request, 'films.html', args)

def search(request,name):
    args = {}
    user = auth.get_user(request)
    args['films'] = Film.objects.filter(name__contains=name)[:20]
    args['name'] = name
    return render(request, 'search_films.html', args)

def change_avatar(request):
    args = {}
    user = auth.get_user(request)
    if request.method == 'POST':
        profile = Profile.objects.get(user = user)
        form = Avatar_form(request.POST,request.FILES, instance=profile)
        print(request.POST.dict())
        print(request.FILES.dict())
        if form.is_valid():
            #profile.avatar = request.POST.dict()['avatar']
            #profile.save()
            form = form.save(commit = False)
            form.user = user
            form.save()
            return redirect('/')
    else:
        form = Avatar_form()
    args['form'] = form
    return render(request, 'change_avatar.html', args)

def new_csrf(request):
    args = {}
    user = auth.get_user(request)
    print(user)
    return render(request, 'csrf.html', args)