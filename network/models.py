from django.contrib.auth.models import AbstractUser
from django.db import models
import datetime


class User(AbstractUser):
    pass


class Post(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.CharField(max_length=160, default=None)
    post_date = models.DateTimeField(default=datetime.datetime.now)

    def __str__(self):
        return f"{self.user} to {self.text}"


class Follower(models.Model):
    follower = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='follower', default=None)
    following = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='following', default=None)

    class Meta:
        unique_together = (('follower', 'following'),)
    def __str__(self):
            return f"{self.follower} : {self.following}"


class Like(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, default=None)
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None)

    class Meta:
        unique_together = (('post', 'user'),)

    def __str__(self):
        return f"{self.post} : {self.user}"
