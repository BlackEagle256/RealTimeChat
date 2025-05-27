from django import forms
from django.contrib import admin
from django.contrib.auth.hashers import make_password
from .models import User

class UserAdminForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'avatar']

    def clean_password(self):
        password = self.cleaned_data.get('password')
        if not password.startswith('pbkdf2_'):  # بررسی می‌کنیم که آیا رمز عبور هش شده است
            return make_password(password)
        return password

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    form = UserAdminForm
    list_display = ('username', 'email', 'avatar')
    search_fields = ('username', 'email')
    list_filter = ('username',)
