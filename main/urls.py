from django.contrib import admin
from django.urls import path
from django.conf.urls import url,include
from django.conf.urls.static import static
from django.conf import settings

from . import views

urlpatterns = [
    path('', views.main),
    path('static_page/<item1>', views.main1),
    path('static_page/<item1>/<item2>', views.main2),
    path('static_page/<item1>/<item2>/<item3>', views.main3),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)