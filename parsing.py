from urllib.request import urlopen, Request
import urllib.request
from bs4 import BeautifulSoup
import sqlite3
import re
import time
from django.core.files import File

import os
import django
os.environ["DJANGO_SETTINGS_MODULE"] = 'anime.settings'
django.setup()
from main.models import *


href_list = [
  #  'https://yummyanime.club/catalog/item/vrata-shtajnera',
  #   'https://yummyanime.club/catalog/item/tetrad-smerti',
  #   'https://yummyanime.club/catalog/item/forma-golosa',
  #   'https://yummyanime.club/catalog/item/kod-gias-vosstavshij-lelush-r2',
  #   'https://yummyanime.club/catalog/item/gurren-lagann',
  #   'https://yummyanime.club/catalog/item/klinok-rassekayushij-demonov',
  #   'https://yummyanime.club/catalog/item/obeshannyj-neverlend',
  #   'https://yummyanime.club/catalog/item/vajolet-evergarden',
  #   'https://yummyanime.club/catalog/item/vanpanchmen',
  #   'https://yummyanime.club/catalog/item/neob-yatnyj-okean',
  #   'https://yummyanime.club/catalog/item/igra-na-vyzhivanie',
  #   'https://yummyanime.club/catalog/item/ubijca-akame',
  #   'https://yummyanime.club/catalog/item/parazit-uchenie-o-zhizni',
  #   'https://yummyanime.club/catalog/item/tvoya-aprel-skaya-lozh',
  #   'https://yummyanime.club/catalog/item/sharlotta',
  #   'https://yummyanime.club/catalog/item/doktor-stoun',
  #   'https://yummyanime.club/catalog/item/stalnoj-alhimik-tv1',
  #   'https://yummyanime.club/catalog/item/krutoj-uchitel-onidzuka',
  #   'https://yummyanime.club/catalog/item/klass-ubijc-tv-2',
  #   'https://yummyanime.club/catalog/item/naruto-uragannye-hroniki',
  #   'https://yummyanime.club/catalog/item/rezonans-uzhasa',
  #   'https://yummyanime.club/catalog/item/bezdomnyj-bog-aragoto-tv-2',
  #   'https://yummyanime.club/catalog/item/vladyka',
  #   'https://yummyanime.club/catalog/item/vtorzhenie-gigantov',


]


from PIL import Image, ImageDraw


Film.objects.filter().delete()


f = open('text.txt')
#for href_page in href_list:

proces = 0
for href_page in f:
    print(proces)
    print(href_page)
    if proces > 1500:
        break
    try:
        data = {}
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.3'}
        reg_url = href_page
        req = Request(url=reg_url, headers=headers)
        page = urlopen(req).read()
        # print(page)
        soup = BeautifulSoup(page)
        name = soup.find('h1').text
        name = re.sub("^\s+|\n|\r|\s+$", '', name)
        data['name'] = name

        avatar_url = soup.find('div', {'class': 'poster-block'}).find('img').get('src')
        avatar_url = 'https://yummyanime.club/' + avatar_url
        img = urllib.request.urlopen(Request(url=avatar_url, headers=headers)).read()
        out = open("img.jpg", "wb")
        #print(out)
        #print(img)
        out.write(img)
        out.close()
        avatar = File(open("img.jpg", 'rb'))
        #print(out)

        data['avatar'] = ''
        #data['avatar'] = urllib.request.urlopen(Request(url=avatar_url, headers=headers)).read()

        views = soup.find('ul', {'class': 'content-main-info'}).find('li').text
        views = views.replace('Просмотров:', '')
        views = re.sub("^\s+|\n|\r|\s+$", '', views)
        views = views.replace(' ', '')
        data['views'] = views

        state = soup.find('ul', {'class': 'content-main-info'}).find_all('li')[1].text
        state = state.replace('Статус:', '')
        state = re.sub("^\s+|\n|\r|\s+$", '', state)
        data['state'] = state

        year = soup.find('ul', {'class': 'content-main-info'}).find_all('li')[2].text
        year = year.replace('Год:', '')
        year = re.sub("^\s+|\n|\r|\s+$", '', year)
        data['year'] = year

        sezon = soup.find('ul', {'class': 'content-main-info'}).find_all('li')[3].text
        sezon = sezon.replace('Сезон:', '')
        sezon = re.sub("^\s+|\n|\r|\s+$", '', sezon)
        data['sezon'] = sezon

        vozrast = soup.find('ul', {'class': 'content-main-info'}).find_all('li')[4].text
        vozrast = vozrast.replace('Возрастной рейтинг:', '')
        vozrast = re.sub("^\s+|\n|\r|\s+$", '', vozrast)
        data['vozrast'] = vozrast

        zanr = soup.find('ul', {'class': 'content-main-info'}).find_all('li')[5]
        zanr = zanr.find_all('a')
        list_zanr = []
        for i in zanr:
            list_zanr.append(i.text)
        data['zanr'] = list_zanr
        #zanr = zanr.replace('Жанр:', '')
        #zanr = zanr.split()



        sours = soup.find('ul', {'class': 'content-main-info'}).find_all('li', recursive=False)[6].text
        sours = sours.replace('Первоисточник:', '')
        sours = re.sub("^\s+|\n|\r|\s+$", '', sours)
        data['sours'] = sours

        stydia = soup.find('ul', {'class': 'content-main-info'}).find_all('li', recursive=False)[7].text
        stydia = stydia.replace('Студия:', '')
        stydia = re.sub("^\s+|\n|\r|\s+$", '', stydia)
        data['stydia'] = stydia

        regiser = soup.find('ul', {'class': 'content-main-info'}).find_all('li', recursive=False)[8].text
        regiser = regiser.replace('Режиссер:', '')
        regiser = re.sub("^\s+|\n|\r|\s+$", '', regiser)
        data['regiser'] = regiser

        typ = soup.find('ul', {'class': 'content-main-info'}).find_all('li', recursive=False)[9].text
        typ = typ.replace('Тип:', '')
        typ = re.sub("^\s+|\n|\r|\s+$", '', typ)
        data['typ'] = typ

        desc = soup.find('div', {'id': 'content-desc-text'}).text
        data['desc'] = desc

        list_video = soup.find('div', {'id': 'video'}).find_all('div', {'class': 'video-block'})
        data['list_video_block'] = []
        for i in list_video:
            #print('''
            #--------------------------------------------------------------------
            #''')
            name2 = i.find('div', {'class': 'video-block-description'}).text
            name2 = name2.replace('Субтитры', '')  # 1 - озвучка 2 - плеер 3 - видео
            name2 = name2.replace('Озвучка', '')
            name2 = name2.replace('Плеер', '')
            name2 = name2.split('.')
            data2 = {'voice': re.sub("^\s+|\n|\r|\s+$", '', name2[0]), 'player':re.sub("^\s+|\n|\r|\s+$", '', name2[1]), 'list_video': []}
            for video in i.find('div', {'class': 'block-episodes'}).find_all('div', recursive=False):
                item_video = {}
                item_video['href'] = video.get('data-href')
                item_video['order'] = video.get('data-id')
                item_video['name'] = video.text
                data2['list_video'].append(item_video)
            data['list_video_block'].append(data2)




        film = Film(name = data['name'], views = int(data['views']),season = data['sezon'],age_rating = data['vozrast'], source = data['sours'], studio = data['stydia'],
                    producer = data['regiser'], type = data['typ'], description = data['desc'], year = data['year'])
        film.avatar.save('img.jpg', avatar, save = True)
        film.save()

        for zanr in data['zanr']:
            genre = Item_genre(film = film,genre = zanr)
            genre.save()


        for i in data['list_video_block']:
            #print(i['voice'],i['player'])
            if i['voice'] == 'Kodik' or i['voice'] == 'Sibnet':
                i['voice'],i['player'] = i['player'],i['voice']
            if i['player'] != 'Kodik' and i['player'] != 'Sibnet':
                continue
#            print(i)
            block_video = Block_video(film = film, voice = i['voice'], player = i['player'])
            block_video.save()

            for video in i['list_video']:
                video = Item_video(block_video=block_video, href_video=video['href'], name=video['name'], order=video['order'])
                video.save()
        time.sleep(10)
        proces += 1
    except:
        print('непошло')