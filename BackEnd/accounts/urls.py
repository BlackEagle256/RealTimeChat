from django.urls import path
from .views import SignUpView, LoginView, UserDetailView

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('user/<str:username>/', UserDetailView.as_view(), name='user_detail'),
]
