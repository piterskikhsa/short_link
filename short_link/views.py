from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.shortcuts import render, get_object_or_404
from django.utils.crypto import get_random_string
from django.views import View

from short_link.forms import UrlForm
from short_link.models import ShortUrl, Transition


class HomeView(View):
    def get(self, request):
        form = UrlForm()
        return render(request, 'home.html', context={'form': form, })

    def post(self, request):
        form = UrlForm(request.POST)
        if form.is_valid():
            form = form.save(commit=False)
            domain = request.build_absolute_uri()
            url_hash = get_random_string(length=8)
            form.hash = url_hash
            form.short_url = f'{domain}{url_hash}/'
            form.save()
            return JsonResponse({'long_url': form.long_url, 'short_url': form.short_url})
        return JsonResponse({'error': form.errors})


def redirect_long_url(request, hash_short_link):
    user_agent = request.META.get('HTTP_USER_AGENT', '')
    user_ip = request.META.get('REMOTE_ADDR', '')
    short_url = get_object_or_404(ShortUrl, hash=hash_short_link)
    Transition.objects.create(user_agent=user_agent, user_ip=user_ip, url=short_url)
    return HttpResponseRedirect(short_url.long_url)
