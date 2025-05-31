import json
from hashlib import sha256
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import User
from .models import Message
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.contrib.auth import get_user_model
from jwt import decode as jwt_decode
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.recipient = self.scope['url_route']['kwargs']['recipient']
        self.sender = self.scope['user'].username  # فرض میگیریم کاربر لاگین کرده
        self.room_group_name = f'chat_{min(self.sender, self.recipient)}_{max(self.sender, self.recipient)}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        print(f"[DEBUG] Connected to group {self.room_group_name}")


    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        print(f"[DEBUG] Disconnected from group {self.room_group_name}")


    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        sender_username = self.sender
        recipient_username = self.recipient

        print(f"[DEBUG] Received message: {message} from {sender_username}")

        sender = await database_sync_to_async(User.objects.get)(username=sender_username)
        recipient = await database_sync_to_async(User.objects.get)(username=recipient_username)

        saved_message = await database_sync_to_async(Message.objects.create)(
            sender=sender,
            recipient=recipient,
            content=message
        )

        # ارسال پیام به گروه
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': saved_message.content,
                'sender': sender.username,
            }
        )
        print(f"[DEBUG] Broadcast message: {saved_message.content}")


    async def chat_message(self, event):
        message = event['message']
        sender = event['sender']

        await self.send(text_data=json.dumps({
            'message': message,
            'sender': sender,
        }))
        print(f"[DEBUG] Sent message to WebSocket: {message}")