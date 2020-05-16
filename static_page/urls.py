from django.contrib import admin
from django.urls import path
from django.conf.urls import url,include
from django.conf.urls.static import static
from django.conf import settings

from . import views

urlpatterns = [
    path('first_page', views.first_page),
    path('top-100', views.top100),
    path('top-100-films', views.top100films),
    path('film/<pk>', views.film),
    path('catalog', views.catalog),
    path('csrf', views.new_csrf),
    path('studio/<name>/<order>', views.studio),
    path('studio_pk/<name>/<order>/<pk>', views.studio_pk),
    path('producer/<name>/<order>', views.producer),
    path('producer_pk/<name>/<order>/<pk>', views.producer_pk),
    path('search/<name>', views.search),
    path('change_avatar', views.change_avatar),
]