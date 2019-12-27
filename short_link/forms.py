from django import forms

from short_link.models import ShortUrl


class UrlForm(forms.ModelForm):
    class Meta:
        model = ShortUrl
        fields = ('long_url', )
        widgets = {
            'long_url': forms.TextInput(
                attrs={'placeholder': 'Введите вашу ссылку'}),
        }