from django.urls import path
from api import views
from django.conf.urls.static import static
from django.conf import settings
from django.conf.urls import url, include

urlpatterns = [
    path('catalog/', views.catalog),
    path('log', views.log),
    path('reg', views.reg),
    path('comment', views.comment),
    path('give_comments', views.give_comments),
    path('change_carma', views.change_carma),
    path('change_carma_film', views.change_carma_film),
    path('change_list_film', views.change_list_film),
    path('give_survey', views.give_survey),
    path('add_survey', views.add_survey),
    path('change_avatar', views.change_avatar),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)