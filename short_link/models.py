from django.db import models


class ShortUrl(models.Model):
    long_url = models.URLField('Твоя ссылка', max_length=250, help_text='Сократи свою ссылку')
    short_url = models.URLField('Короткая ссылка', max_length=250)
    hash = models.CharField('Ключ ссылки', max_length=8, unique=True)

    def __str__(self):
        return self.long_url


class Transition(models.Model):
    url = models.ForeignKey('ShortUrl', verbose_name='Ссылка', on_delete=models.CASCADE)
    user_ip = models.GenericIPAddressField('Ip адрес посетителя', blank=True, null=True)
    user_agent = models.CharField('User-agent посетителя', blank=True, max_length=150)
    created_at = models.DateTimeField('Время посещение', auto_now_add=True)


