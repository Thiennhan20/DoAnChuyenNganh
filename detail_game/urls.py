from django.urls import path
from .views import LoginClass, RegisterClass, base, get_high_scores, save_high_score, user_info
from django.contrib.auth import views as auth_views


urlpatterns = [
    path('', base, name="base"),
    path('get_high_scores/', get_high_scores, name='get_high_scores'),
    path('save_high_score/', save_high_score, name='save_high_score'),
    path('login/', auth_views.LoginView.as_view(template_name='detail_game/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='base'), name='logout'),
    path('register/', RegisterClass.as_view(), name='register'),
    path('user_info/', user_info, name='user_info'),
    path('reset_password/', auth_views.PasswordResetView.as_view(template_name="detail_game/password_reset.html"), name="reset_password"),
    path('reset_password_sent/', auth_views.PasswordResetDoneView.as_view(template_name="detail_game/password_reset_sent.html"), name="password_reset_done"),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(template_name="detail_game/password_reset_form.html"), name="password_reset_confirm"),
    path('reset_password_complete/', auth_views.PasswordResetCompleteView.as_view(template_name="detail_game/password_reset_done.html"), name="password_reset_complete"),
]
