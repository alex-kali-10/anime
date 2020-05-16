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
from main.models import *

from django.shortcuts import render , redirect
import json
import math
from .forms import *
from .serializers import *

from django.db.models import Sum

@api_view(['POST'])
def log(request):
    args = {}
    data = request.data.dict()
    print(data)
    user = auth.authenticate(request, username=data['login'], password=data['password'])
    if user is not None:
        auth.login(request, user)
        args['errors'] = 'false'
        args['username'] = user.username
        args['avatar_url'] = user.profile.avatar.url
    else:
        args['errors'] = 'true'
    return Response(args, status=status.HTTP_200_OK)


@api_view(['POST'])
def reg(request):
    args = {}
    data = request.data.dict()
    print(data)
    form = CustomUserCreationForm(data)
    if form.is_valid():
        form.save()
        user = auth.authenticate(request, username=data['username'], password=data['password1'])
        args['errors'] = 'false'
        args['username'] = data['username']
        args['avatar_url'] = user.profile.avatar.url
        if user is not None:
            auth.login(request, user)
    else:
        args['errors'] = 'true'
        args['errors'] = form.errors.get_json_data(escape_html=False)
    return Response(args, status=status.HTTP_200_OK)


@api_view(['POST','DELETE','PUT'])
def comment(request):
    args = {}
    user = auth.get_user(request)
    if str(user) != 'AnonymousUser':
        if request.method == 'POST':
            data = request.data.dict()
            i = Comment_film.objects.create(user = user,film_id = data['id'],text = data['comment'])
            count_like = 0
            count_dislike = 0
            args[i.id] = {'id':i.id ,'text': i.text, 'username': i.user.username,'user_id': i.user.id,'count_like': count_like,'count_dislike': count_dislike,'carma': i.meCarma(user),'avatar': i.user.profile.avatar.url}
        if request.method == 'DELETE':
            data = request.data.dict()
            Comment_film.objects.filter(id = data['id'],user = user).get().delete()
            args['id'] = data['id']
        if request.method == 'PUT':
            data = request.data.dict()
            comment = Comment_film.objects.filter(id = data['id'],user = user).get()
            comment.text = data['comment']
            comment.save()
        return Response(args, status=status.HTTP_200_OK)
    else:
        return Response(args, status=status.HTTP_200_OK)




@api_view(['POST'])
def give_comments(request):
    args = {}
    user = auth.get_user(request)
    if request.method == 'POST':
        data = request.data.dict()
        print(data)
        if data['last_comment_id'] == 'false':
            list_comments = Comment_film.objects.filter(film_id = data['id']).order_by('-id')
        else:
            list_comments = Comment_film.objects.filter(film_id = data['id'],id__lt = int(data['last_comment_id'])).order_by('-id')
        print(list_comments)
        if data['order'] != 'new':
            print('я дебил и я не умею сортировать')

        list_comments = list_comments[:5]
        list_comments = list_comments_serialize(list_comments,user)

        args['last_comment_id'] = data['last_comment_id']
        args['list'] = list_comments
        return Response(args, status=status.HTTP_200_OK)


@api_view(['POST'])
def change_carma(request):
    args = {}
    user = auth.get_user(request)
    if str(user) != 'AnonymousUser':
        if request.method == 'POST':
            data = request.data.dict()
            item = Carma_comment.objects.filter(user=user,comment__id = data['id'])
            if data['carma'] == '':
                if item.exists():
                    Carma_comment.objects.get(user=user,comment__id = data['id']).delete()
            elif  data['carma'] == 'like':
                if item.exists():
                    print(item.get())
                    item.update(carma = data['carma'])
                else:
                    Carma_comment.objects.create(user=user,comment_id = data['id'],carma = data['carma'])
            elif data['carma'] == 'dislike':
                if item.exists():
                    item.update(carma = data['carma'])
                else:
                    Carma_comment.objects.create(user=user,comment_id = data['id'],carma = data['carma'])
            args['count_like'] = Carma_comment.objects.filter(comment_id = data['id'], carma = 'like').count()
            args['count_dislike'] = Carma_comment.objects.filter(comment_id = data['id'], carma = 'dislike').count()
            return Response(args, status=status.HTTP_200_OK)
    else:
        return Response(args, status=status.HTTP_200_OK)

@api_view(['POST'])
def change_carma_film(request):
    args = {}
    user = auth.get_user(request)
    if str(user) != 'AnonymousUser':
        if request.method == 'POST':
            data = request.data.dict()
            item = Carma_film.objects.filter(user=user,film_id = data['id'])
            if data['carma'] == '':
                if item.exists():
                    Carma_film.objects.get(user=user,film_id = data['id']).delete()
            elif  data['carma'] == 'like':
                if item.exists():
                    print(item.get())
                    item.update(carma = data['carma'])
                else:
                    Carma_film.objects.create(user=user,film_id = data['id'],carma = data['carma'])
            elif data['carma'] == 'dislike':
                if item.exists():
                    item.update(carma = data['carma'])
                else:
                    Carma_film.objects.create(user=user,film_id = data['id'],carma = data['carma'])
            args['count_like'] = Carma_film.objects.filter(film_id = data['id'], carma = 'like').count()
            args['count_dislike'] = Carma_film.objects.filter(film_id = data['id'], carma = 'dislike').count()
            return Response(args, status=status.HTTP_200_OK)
    else:
        return Response(args, status=status.HTTP_200_OK)

@api_view(['POST'])
def change_list_film(request):
    args = {}
    user = auth.get_user(request)
    if str(user) != 'AnonymousUser':
        if request.method == 'POST':
            data = request.data.dict()
            item = My_list_film.objects.filter(user=user,film_id = data['id'])
            if data['carma'] == '':
                if item.exists():
                    My_list_film.objects.get(user=user,film_id = data['id']).delete()
            elif  data['carma'] == 'best':
                if item.exists():
                    print(item.get())
                    item.update(name_list = data['carma'])
                else:
                    My_list_film.objects.create(user=user,film_id = data['id'],name_list = data['carma'])
            elif data['carma'] == 'most_watch':
                if item.exists():
                    item.update(name_list = data['carma'])
                else:
                    My_list_film.objects.create(user=user,film_id = data['id'],name_list = data['carma'])
            args['count_best'] = My_list_film.objects.filter(film_id = data['id'], name_list = 'best').count()
            args['count_most_watch'] = My_list_film.objects.filter(film_id = data['id'], name_list = 'most_watch').count()
            return Response(args, status=status.HTTP_200_OK)
    else:
        return Response(args, status=status.HTTP_200_OK)

@api_view(['POST'])
def give_survey(request):
    args = {}
    user = auth.get_user(request)
    if str(user) != 'AnonymousUser':
        if request.method == 'POST':
            Q_block = Question_block.objects.filter().get()
            item = question_serialize(Q_block,user)
            args = item
            if Response_block.objects.filter(question_block = Q_block,user = user).exists() == False:
                args['check'] = 'false'
            else:
                args['check'] = 'true'
        return Response(args, status=status.HTTP_200_OK)
    return Response(args, status=status.HTTP_200_OK)


@api_view(['POST'])
def add_survey(request):
    args = {}
    user = auth.get_user(request)
    if str(user) != 'AnonymousUser':
        if request.method == 'POST':
            data = request.data.dict()
            id_survey = data['id']
            data = data['data']
            data = json.loads(data)
            if Response_block.objects.filter(question_block__id = id_survey,user = user).exists() == False:
                Resp_block = Response_block.objects.create(question_block_id = id_survey,user = user)
                for i in data:
                    Resp_one = One_response.objects.create(response_block = Resp_block,question_id = i)
                    for resp in data[i]:
                        My_response.objects.create(one_response = Resp_one, response_question_id = resp, response = True)
                args['resp'] = 'true'
        return Response(args, status=status.HTTP_200_OK)
    return Response(args, status=status.HTTP_200_OK)


@api_view(['POST'])
@parser_classes([MultiPartParser])
def change_avatar(request, format=None):
    args = {}
    user = auth.get_user(request)
    if request.method == 'POST':
        print(request)
        print(request.data)
        file_serializer = FileSerializer(data=request.data)
    return Response(args, status=status.HTTP_200_OK)




# это не апи так тчо нужно будет переместить в статик pages
def catalog(request, format=None):
    args = {}
    data = json.loads(request.body.decode())
    print(data)
    list_film = Film.objects.filter(year__lte = int(data['maxYear']))
    list_film = list_film.filter(year__gte = int(data['minYear']))
    if data['type'] != 'false':
        list_film = list_film.filter(type = data['type'])
    if data['state'] != 'false':
        list_film = list_film.filter(state = data['state'])
    if data['sezon'] != 'false':
        list_film = list_film.filter(season = data['sezon'])
    if data['rateYear'] != 'false':
        list_film = list_film.filter(age_rating = data['rateYear'])
    if data['order'] != 'false':
        if data['order'] == 'rate':
            print('сортировка по рейтингу')
        if data['order'] == 'views':
            list_film = list_film.order_by('-views')
        if data['order'] == 'alf':
            list_film = list_film.order_by('name')
        if data['order'] == 'new-old':
            list_film = list_film.order_by('-year')
        if data['order'] == 'old-new':
            list_film = list_film.order_by('year')
    genres = json.loads(data['genres'])
    for i in genres:
        list_film = list_film.filter(item_genre__genre = i)



    args['lastPage'] = math.ceil(list_film.count() / 20)
    list_film = list_film.filter()[(20*data['page']-20):(20*data['page'])]
    args['films'] = list_film
    #for i in list_film:
    #    print(i.year)
    return render(request, 'films.html', args)


