from django.contrib.auth.models import User
from django.db import models

# Represents a contact relationship between two users
class Contact(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_contacts")  # The first user
    contact_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="contact_contacts")  # The second user

    def __str__(self):
        return f"{self.user.username} - {self.contact_user.username}"


# Represents a message sent from one user to another
class Message(models.Model):
    sender = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE)  # Message sender
    recipient = models.ForeignKey(User, related_name='received_messages', on_delete=models.CASCADE)  # Message recipient
    content = models.TextField()  # Message content
    timestamp = models.DateTimeField(auto_now_add=True)  # Time when the message was sent
    read = models.BooleanField(default=False)  # If the message is read or not

    def __str__(self):
        return f"Message from {self.sender} to {self.recipient} at {self.timestamp}"
