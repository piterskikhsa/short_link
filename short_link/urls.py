from django.urls import path

from short_link.views import redirect_long_url, HomeView

app_name = 'short_link'

urlpatterns = [
    path('<str:hash_short_link>/', redirect_long_url, name='redirect_url'),
    path('', HomeView.as_view(), name='create_url'),
]
