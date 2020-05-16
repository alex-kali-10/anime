from django.contrib import admin

from .models import *


class inf(admin.ModelAdmin):
    model = Block_video
    extra = 3

admin.site.register(Film, inf)




admin.site.register(Block_video)


admin.site.register(Item_video)
admin.site.register(News)
admin.site.register(Recommend_video)



admin.site.register(Question_block)
admin.site.register(One_question)
admin.site.register(Response_question)




admin.site.register(Profile)
