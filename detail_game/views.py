from django.shortcuts import render, HttpResponse, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import HighScore
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login
from django.views import View
import json, random, string
from django.contrib import messages
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import UserProfile, ChatMessage
from datetime import datetime
from django.utils.timezone import now
from django.contrib.auth.signals import user_logged_in





def base(request):
    if request.user.is_authenticated:
        username = request.user.username
    else:
        username = f"Guest{random.randint(1000, 9999)}"
    return render(request, 'detail_game/base.html', {'username': username})

def get_high_scores(request):
    # Lọc bảng xếp hạng trong ngày hiện tại
    today = now().strftime('%d/%m/%Y')
    scores = HighScore.objects.filter(day=today).order_by('-score')[:10]
    score_data = [
        {
            "username": score.user.username,
            "score": score.score,
        }
        for score in scores
    ]
    return JsonResponse(score_data, safe=False)

@login_required
def get_user_high_score(request):
    user = request.user
    highest_score_record = HighScore.objects.filter(user=user).order_by('-score').first()
    high_score = highest_score_record.score if highest_score_record else 0
    return JsonResponse({"high_score": high_score})


@csrf_exempt
@login_required
def save_high_score(request):
    if request.method == "POST":
        data = json.loads(request.body)
        new_score = data.get('score', 0)
        user = request.user

        # Find the current high score record for the user
        highest_score_record = HighScore.objects.filter(user=user).order_by('-score').first()

        if highest_score_record:
            if new_score > highest_score_record.score:
                highest_score_record.score = new_score
                highest_score_record.date = now()  # Cập nhật thời gian hiện tại
                highest_score_record.day = now().strftime('%d/%m/%Y')  # Lưu ngày hiện tại
                highest_score_record.week = now().isocalendar()[1]  # Lưu tuần hiện tại
                highest_score_record.save()
                return JsonResponse({"message": "High score updated successfully!"})
            else:
                return JsonResponse({"message": "Score is not higher than the current high score."})
        else:
            # Tạo điểm cao mới nếu chưa có
            HighScore.objects.create(
                user=user,
                score=new_score,
                day=now().strftime('%d/%m/%Y'),  # Gán ngày hiện tại
                week=now().isocalendar()[1]  # Gán tuần hiện tại
            )
            return JsonResponse({"message": "New high score saved successfully!"})
    return JsonResponse({"message": "Invalid request"}, status=400)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=UserProfile)
def save_user_profile(sender, instance, **kwargs):
    try:
        # Lấy avatar cũ trước khi cập nhật
        old_avatar = UserProfile.objects.get(pk=instance.pk).avatar if instance.pk else None
        # Kiểm tra nếu avatar thay đổi
        if old_avatar != instance.avatar:
            # Cập nhật avatar cho các tin nhắn liên quan
            ChatMessage.objects.filter(username=instance.user.username).update(avatar=instance.avatar.url if instance.avatar else "")
    except UserProfile.DoesNotExist:
        pass


@login_required
def user_info(request):
    user = request.user
    high_score_record = HighScore.objects.filter(user=user).order_by('-score').first()
    high_score_value = high_score_record.score if high_score_record else 0

    if request.method == 'POST':
        # Cập nhật email
        new_email = request.POST.get('email')
        if new_email and new_email != user.email:
            user.email = new_email
            user.save()
            messages.success(request, "Email đã được cập nhật thành công.")

        # Cập nhật avatar
        if 'avatar' in request.FILES:
            # Set trực tiếp avatar mới, signal sẽ tự xóa avatar cũ
            user.userprofile.avatar = request.FILES['avatar']
            user.userprofile.save()  # Lưu avatar mới và kích hoạt signal để xóa ảnh cũ
            messages.success(request, "Ảnh đại diện đã được cập nhật thành công.")

        return redirect('user_info')

    return render(request, 'detail_game/user_info.html', {
        'user': user,
        'high_score': high_score_value,
    })



@receiver(user_logged_in)
def move_guest_messages_to_db(sender, request, user, **kwargs):
    session = request.session
    if "guest_messages" in session:
        guest_messages = session.pop("guest_messages")
        for msg in guest_messages:
            ChatMessage.objects.create(
                username=user.username,
                message=msg["message"],
                avatar=msg["avatar"],
            )
        session.save()


def get_high_scores_daily(request):
    try:
        today = now().strftime('%d/%m/%Y')
        scores = HighScore.objects.filter(day=today).order_by('-score')[:10]
        score_data = [
            {
                "username": score.user.username,
                "high_score": score.score,
            }
            for score in scores
        ]
        return JsonResponse(score_data, safe=False)
    except Exception as e:
        print(f"Error in get_high_scores_daily: {e}")
        return JsonResponse({"error": "Internal server error"}, status=500)


def get_high_scores_weekly(request):
    current_week = now().isocalendar()[1]
    scores = HighScore.objects.filter(week=current_week).order_by('-score')[:10]
    score_data = [
        {
            "username": score.user.username,
            "high_score": score.score,
        }
        for score in scores
    ]
    return JsonResponse(score_data, safe=False)