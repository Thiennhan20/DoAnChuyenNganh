from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .models import ChatMessage
import json
import random


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_group_name = 'chat_room'

        if self.scope["user"].is_authenticated:
            self.username = self.scope["user"].username
            self.avatar = (
                self.scope["user"].userprofile.avatar.url
                if self.scope["user"].userprofile.avatar
                else "/static/images/snake.png"
            )
        else:
            session = self.scope["session"]
            if "guest_username" not in session:
                session["guest_username"] = f"Guest{random.randint(1000, 9999)}"
                session.save()
            self.username = session["guest_username"]
            self.avatar = "/static/images/snake.png"

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name,
        )
        self.accept()

        # Lấy lịch sử tin nhắn từ cơ sở dữ liệu
        recent_messages = ChatMessage.objects.order_by('-timestamp')[:50]
        history = [
            {
                "username": msg.username,
                "message": msg.message,
                "avatar": msg.avatar or "/static/images/snake.png",  # Đảm bảo avatar luôn có giá trị
            }
            for msg in recent_messages
        ]


        # Lấy tin nhắn từ session nếu chưa đăng nhập
        if not self.scope["user"].is_authenticated:
            session_messages = self.scope["session"].get("guest_messages", [])
            history.extend(session_messages)

        # Gửi lịch sử tin nhắn tới người dùng
        self.send(
            text_data=json.dumps(
                {"type": "history", "messages": history}
            )
        )



    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name,
        )

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        avatar_url = (
            self.scope["user"].userprofile.avatar.url
            if self.scope["user"].is_authenticated and self.scope["user"].userprofile.avatar
            else "/static/images/snake.png"
        )
        # Kiểm tra xem người chơi đã đăng nhập chưa
        if self.scope["user"].is_authenticated:
            # Lưu tin nhắn vào cơ sở dữ liệu nếu đã đăng nhập
            ChatMessage.objects.create(
                username=self.username,
                message=message,
                avatar=avatar_url,
            )
        else:
            # Lưu tin nhắn vào session nếu chưa đăng nhập
            session = self.scope["session"]
            if "guest_messages" not in session:
                session["guest_messages"] = []
            session["guest_messages"].append({
                "username": self.username,
                "message": message,
                "avatar": self.avatar,
            })
            session.save()

        # Gửi tin nhắn tới nhóm
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "chat_message",
                "username": self.username,
                "avatar": avatar_url,
                "message": message,
            }
        )


    def chat_message(self, event):
        # Send message to WebSocket
        self.send(
            text_data=json.dumps(
                {
                    "type": "chat",
                    "username": event["username"],
                    "avatar": event["avatar"],
                    "message": event["message"],
                }
            )
        )




