from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db.models import Avg

from django.db import migrations

class Migration(migrations.Migration):
    atomic = False

season_choice = (
    ('Весна', "Весна"),
    ('Лето', "Лето"),
    ('Осень', "Осень"),
    ('Зима', "Зима"),
)

age_rating_choice = (
    ('G (для всех возрастов)', "G (для всех возрастов)"),
    ('PG (для детей)', "PG (для детей)"),
    ('PG-13 (от 13 лет)', "PG-13 (от 13 лет)"),
    ('R-17+ (насилие и/или нецензурная лексика)', "R-17+ (насилие и/или нецензурная лексика)"),
    ('R+ (частичная нагота)', "R+ (частичная нагота)"),
)


source_choice = (
    ('Манга', "Манга"),
    ('Оригинал', "Оригинал"),
    ('Лайт новелла', "Лайт новелла"),
    ('Визуальная новелла', "Визуальная новелла"),
)

type_choice = (
    ('Полнометражный фильм', "Полнометражный фильм"),
    ('Сериал', "Сериал"),
)

player_choice = (
    ('Kodik', "Kodik"),
    ('Sibnet', "Sibnet"),
)

state_choice = (
    ('вышел', "вышел"),
    ('выходит', "выходит"),
    ('анонс', "анонс"),
)





class Film(models.Model):
    class Meta():
        db_table = 'film'
    avatar = models.ImageField(upload_to='img',verbose_name='аватарка',default='img/standart.png', blank=False, null=True)
    name = models.CharField(verbose_name='имя',max_length=100,default='')
    year = models.IntegerField(verbose_name='год')
    season = models.CharField(verbose_name='сезон',max_length=9,choices=season_choice)
    age_rating = models.CharField(verbose_name='Возрастной рейтинг',max_length=50,choices=age_rating_choice)
    source = models.CharField(verbose_name='Первоисточник',max_length=20,choices=source_choice)
    studio = models.CharField(verbose_name='студия',max_length=30,default='')
    producer = models.CharField(verbose_name='режисер',max_length=30,default='')
    type = models.CharField(verbose_name='Тип',max_length=20,choices=type_choice)
    description = models.CharField(verbose_name='Описание',max_length=1000,default='')
    state = models.CharField(verbose_name='статус',max_length=20,choices=state_choice, default='вышел')
    views = models.IntegerField(verbose_name='просмотры', default=0 )
    def goodViews(self):
        return '{0:,}'.format(self.views).replace(',', ' ')
    def my_carma(self,user):
        carma = Carma_film.objects.filter(film = self,user = user)
        if carma.exists():
            return carma.get().carma
        else:
            return 'false'
    def my_list_film(self,user):
        carma = My_list_film.objects.filter(film = self,user = user)
        if carma.exists():
            return carma.get().name_list
        else:
            return 'false'
    def count_likes(self):
        return Carma_film.objects.filter(film = self, carma = 'like').count()
    def count_dislikes(self):
        return Carma_film.objects.filter(film = self, carma = 'dislike').count()
    def count_best(self):
        return My_list_film.objects.filter(film = self, name_list = 'best').count()
    def count_watch(self):
        return My_list_film.objects.filter(film = self, name_list = 'most_watch').count()
    def width_dislike_line(self):
        count_like = Carma_film.objects.filter(film = self, carma = 'like').count()
        count_dislike = Carma_film.objects.filter(film = self, carma = 'dislike').count()
        if count_dislike != 0:
            return round(count_dislike/(count_like+count_dislike)*100)
        else:
            return 0
    def genres(self):
        return Item_genre.objects.filter(film=self)


class Comment_film(models.Model):
    class Meta():
        db_table = 'comment_film'
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    film = models.ForeignKey(Film, on_delete=models.CASCADE)
    text = models.CharField(max_length=300,default='')
    def meCarma(self,user):
        if str(user) != 'AnonymousUser':
            if Carma_comment.objects.filter(comment = self,user = user).exists():
                return Carma_comment.objects.filter(comment = self,user = user).get().carma
        return ''
    def likes(self):
        return Carma_comment.objects.filter(comment = self, carma = 'like').count()

carma_choice = (
    ('like', "like"),
    ('dislike', "dislike"),
)

class Carma_comment(models.Model):
    class Meta():
        db_table = 'carma'
    comment = models.ForeignKey(Comment_film, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    carma = models.CharField(max_length=20,choices=carma_choice)


carma_film_choice = (
    ('like', "like"),
    ('dislike', "dislike"),
)

class Carma_film(models.Model):
    class Meta():
        db_table = 'carma_film'
    film = models.ForeignKey(Film, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    carma = models.CharField(max_length=20,choices=carma_film_choice)


list_film_choice = (
    ('most_watch', "most_watch"),
    ('best', "best"),
)

class My_list_film(models.Model):
    class Meta():
        db_table = 'My_list_film'
    film = models.ForeignKey(Film, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name_list = models.CharField(max_length=20,choices=list_film_choice)



class Block_video(models.Model):
    class Meta():
        db_table = 'видео'
    film = models.ForeignKey(Film, on_delete=models.CASCADE, related_name='block')
    voice = models.CharField(verbose_name='Озвучка',max_length=30,default='')
    player = models.CharField(verbose_name='Плеер',max_length=20,choices=player_choice)


class Item_video(models.Model):
    class Meta():
        db_table = 'одна ссылка на видео'
    block_video = models.ForeignKey(Block_video, on_delete=models.CASCADE, related_name='video')
    href_video = models.CharField(verbose_name='ссылка',max_length=100,default='')
    name = models.CharField(verbose_name='имя',max_length=100,default='')
    order = models.IntegerField(verbose_name='Порядок', default=0)

class Item_genre(models.Model):
    class Meta():
        db_table = 'genr'
    film = models.ForeignKey(Film, on_delete=models.CASCADE)
    genre = models.CharField(verbose_name='жанр',max_length=100,default='')

class News(models.Model):
    class Meta():
        db_table = 'news'
    name = models.CharField(verbose_name='имя',max_length=100,default='')
    data = models.CharField(max_length=5000,default='')

class Recommend_video(models.Model):
    href = models.CharField(verbose_name='link',max_length=100,default='')




type_choice_question = (
    ('checkbox', "checkbox"),
    ('radio', "radio"),
)

class Question_block(models.Model):
    class Meta():
        db_table = 'блок вопроса'
    name = models.CharField(max_length=100,default='')

class One_question(models.Model):
    class Meta():
        db_table = '1вопрос'
    block = models.ForeignKey(Question_block, on_delete=models.CASCADE)
    text = models.CharField(max_length=100,default='')
    type = models.CharField(max_length=30,choices=type_choice_question)

class Response_question(models.Model):
    class Meta():
        db_table = 'вопрос'
    question = models.ForeignKey(One_question, on_delete=models.CASCADE)
    text = models.CharField(max_length=100,default='')



class Response_block(models.Model):
    class Meta():
        db_table = 'блок ответа'
    question_block = models.ForeignKey(Question_block, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class One_response(models.Model):
    class Meta():
        db_table = '1ответ'
    response_block = models.ForeignKey(Response_block, on_delete=models.CASCADE)
    question = models.ForeignKey(One_question, on_delete=models.CASCADE)

class My_response(models.Model):
    class Meta():
        db_table = 'ответ'
    one_response = models.ForeignKey(One_response, on_delete=models.CASCADE)
    response_question = models.ForeignKey(Response_question, on_delete=models.CASCADE)
    response = models.BooleanField()


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to='img_user', verbose_name='Изображение',default='img_user/standart.png')
    def __unicode__(self):
        return self.user
    class Meta:
        verbose_name = 'Профиль'
        verbose_name_plural = 'Профили'

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()