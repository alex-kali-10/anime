from main.models import *
from rest_framework import serializers

def list_comments_serialize(list_comments,user):
    data = {}
    print('сериализирую')
    for i in list_comments:
        count_like = Carma_comment.objects.filter(comment = i, carma = 'like').count()
        count_dislike = Carma_comment.objects.filter(comment = i, carma = 'dislike').count()
        data[i.id] = {'id':i.id ,'text': i.text, 'username': i.user.username,'user_id': i.user.id,'count_like': count_like,'count_dislike': count_dislike,'carma': i.meCarma(user),'avatar': i.user.profile.avatar.url}
    return data


def question_serialize(question,user):
    data = {}
    data['name'] = question.name
    data['id'] = question.id
    list_question = One_question.objects.filter(block = question)
    data['list_question'] = {}
    check = Response_block.objects.filter(question_block = question,user = user).exists()
    if check:
        data['all_response'] = Response_block.objects.filter(question_block = question).count()
    for i in list_question:
        data['list_question'][i.id] = {'id': i.id,'type': i.type,'text': i.text,'response':{}}
        list_resp = Response_question.objects.filter(question = i)
        for resp in list_resp:
            data['list_question'][i.id]['response'][resp.id] = {'id': resp.id,'text': resp.text}
            if check:
                data['list_question'][i.id]['response'][resp.id]['my_response'] = My_response.objects.filter(response_question = resp, one_response__response_block__user = user).exists()
                data['list_question'][i.id]['response'][resp.id]['count_response'] = My_response.objects.filter(response_question = resp).count()
    return data



class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = "avatar"