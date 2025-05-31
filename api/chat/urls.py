from django.urls import path
from . import views
from .views import get_messages_between_users
from .views import AddContactView

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('login/', views.signin, name='login'),
    path('logout/', views.user_logout, name='logout'),
    path('accounts/signup/', views.signup, name='signup'),
    path('chat/signin/', views.signin, name='signin'),
    path('', views.dashboard, name='dashboard'),
    path('api/add-contact/<str:contact_username>/', AddContactView.as_view(), name='add_contact_api'),    path('<str:contact_username>/', views.chat_view, name='chat'),  # For HTTP chat page
    path('accounts/user/<str:username>/', views.search_user, name='search_user'),  # جستجو برای کاربر
    path('api/contacts/', views.get_contacts, name='get_contacts'),
    path('api/messages/', get_messages_between_users, name='get_messages_between_users'),
]