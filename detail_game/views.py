from django.shortcuts import render, HttpResponse, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import HighScore
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login
from django.views import View
import json, random
from .forms import CustomUserCreationForm
from django.contrib import messages
from django.contrib.auth.models import User

def base(request):
    if request.user.is_authenticated:
        username = request.user.username
    else:
        username = f"Guest{random.randint(1000, 9999)}"
    return render(request, 'detail_game/base.html', {'username': username})

def get_high_scores(request):
    scores = HighScore.objects.order_by('-score')[:10]
    score_data = [{"username": score.user.username, "score": score.score} for score in scores]
    return JsonResponse(score_data, safe=False)

@csrf_exempt
@login_required
def save_high_score(request):
    if request.method == "POST":
        data = json.loads(request.body)
        score = data.get('score', 0)
        user = request.user
        HighScore.objects.create(user=user, score=score)
        return JsonResponse({"message": "Score saved successfully!"})
    return JsonResponse({"message": "Invalid request"}, status=400)

class LoginClass(View):
    def get(self, request):
        return render(request, 'detail_game/login.html')
    
    def post(self, request):
        user_name = request.POST.get('tendangnhap')
        password = request.POST.get('password')
        my_user = authenticate(username=user_name, password=password)
        if my_user is None:
            return HttpResponse('Dăng nhập không thành công')
        login(request, my_user)
        return render(request, 'detail_game/base.html',)

class RegisterClass(View):
    def get(self, request):
        form = CustomUserCreationForm()
        return render(request, 'detail_game/register.html', {'form': form})

    def post(self, request):
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            return redirect('login')
        return render(request, 'detail_game/register.html', {'form': form})
    
@login_required
def user_info(request):
    return render(request, 'detail_game/user_info.html', {'user': request.user})
