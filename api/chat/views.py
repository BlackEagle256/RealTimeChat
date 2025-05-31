from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.db.models import Q
from .models import Contact, Message
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

# Signup view
@api_view(['POST'])
def signup(request):
    if request.method == 'POST':
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        
        # بررسی وجود username
        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists!"}, status=status.HTTP_400_BAD_REQUEST)

        # ساخت کاربر جدید
        user = User.objects.create(
            username=username,
            email=email,
            password=make_password(password)
        )
        user.save()

        # ارسال پاسخ موفقیت‌آمیز
        return Response({"message": "Account created successfully!"}, status=status.HTTP_201_CREATED)


# ورود کاربر
@api_view(['POST'])
def signin(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')

        # اعتبارسنجی کاربر
        user = authenticate(username=username, password=password)
        
        if user is not None:
            # تولید توکن JWT
            refresh = RefreshToken.for_user(user)

            # اطلاعات پایه کاربر
            user_data = {
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'avatar': user.profile.avatar.url if hasattr(user, 'profile') and user.profile.avatar else None,  # اگر آواتار وجود دارد
            }

            # ارسال توکن و اطلاعات کاربر در رسپانس
            response_data = {
                'status': 'success',
                'message': 'User authenticated successfully.',
                'data': {
                    'access_token': str(refresh.access_token),
                    'refresh_token': str(refresh),
                    'user_info': user_data
                }
            }

            return Response(response_data, status=status.HTTP_200_OK)

        else:
            return Response({
                'status': 'error',
                'message': 'Invalid credentials',
                'data': None
            }, status=status.HTTP_400_BAD_REQUEST)



# Logout view
def user_logout(request):
    logout(request)
    return redirect('login')


# Dashboard view
@login_required
def dashboard(request):
    search_query = request.GET.get('search', '')
    search_results = []
    if search_query:
        search_results = User.objects.filter(
            Q(username__icontains=search_query) & ~Q(username=request.user.username)
        )

    contacts = Contact.objects.filter(user=request.user)
    return render(request, 'dashboard.html', {
        'contacts': contacts,
        'search_results': search_results,
        'search_query': search_query
    })


# Add Contact view
@login_required
def add_contact(request, contact_username):
    contact_user = get_object_or_404(User, username=contact_username)
    if contact_user != request.user:
        Contact.objects.get_or_create(user=request.user, contact_user=contact_user)
        Contact.objects.get_or_create(user=contact_user, contact_user=request.user)
    return redirect('dashboard')


# Chat view
@login_required
def chat_view(request, contact_username):
    contact_user = get_object_or_404(User, username=contact_username)
    messages = Message.objects.filter(
        Q(sender=request.user, recipient=contact_user) |
        Q(sender=contact_user, recipient=request.user)
    ).order_by('timestamp')
    return render(request, 'chat.html', {
        'contact_user': contact_user,
        'messages': messages
    })

# جستجو برای کاربر
@api_view(['GET'])
def search_user(request, username):
    try:
        user = User.objects.get(username=username)
        user_data = {
            'username': user.username,
            'email': user.email,
            'avatar': user.profile.avatar.url if hasattr(user, 'profile') and user.profile.avatar else None
        }
        return Response(user_data)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])  # اطمینان از اینکه کاربر احراز هویت شده است
def get_contacts(request):
    user = request.user

    # اگر کاربر احراز هویت نشده باشد، خطای 401 برمی‌گردانیم
    if user.is_authenticated:
        contacts = Contact.objects.filter(user=user)
        contact_list = []
        for contact in contacts:
            contact_user = contact.contact_user
            contact_list.append({
                'username': contact_user.username,
                'avatar': contact_user.profile.avatar.url if hasattr(contact_user, 'profile') else None,
                'last_message': contact_user.sent_messages.last().content if contact_user.sent_messages.exists() else '',
            })
        return Response(contact_list)
    else:
        return Response({"error": "User not authenticated"}, status=401)
    
@api_view(['POST'])
def get_messages_between_users(request):
    sender_username = request.data.get('sender')
    recipient_username = request.data.get('recipient')

    if not sender_username or not recipient_username:
        return Response({"error": "Both sender and recipient usernames are required."}, status=400)

    try:
        sender = User.objects.get(username=sender_username)
        recipient = User.objects.get(username=recipient_username)
    except User.DoesNotExist:
        return Response({"error": "One or both users do not exist."}, status=404)

    # دریافت پیام‌های بین دو کاربر
    messages = Message.objects.filter(
        (Q(sender=sender) & Q(recipient=recipient)) |
        (Q(sender=recipient) & Q(recipient=sender))
    ).order_by('timestamp')

    # تبدیل پیام‌ها به فرمت JSON
    messages_data = [
        {
            'id': message.id,
            'sender': message.sender.username,
            'recipient': message.recipient.username,
            'content': message.content,
            'timestamp': message.timestamp,
            'read': message.read,
        }
        for message in messages
    ]

    return Response(messages_data, status=200)

class AddContactView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, contact_username):
        contact_user = get_object_or_404(User, username=contact_username)
        if contact_user != request.user:
            Contact.objects.get_or_create(user=request.user, contact_user=contact_user)
            Contact.objects.get_or_create(user=contact_user, contact_user=request.user)
        return Response({"message": "Contact added successfully."}, status=200)