from django.urls import path
from .views import  base, save_high_score, user_info, get_user_high_score
from django.contrib.auth import views as auth_views
from django.conf.urls.static import static
from django.conf import settings
from . import views


urlpatterns = [
    path('', base, name="base"),
    path('get_user_high_score/', get_user_high_score, name='get_user_high_score'),
    path('get_high_scores_daily/', views.get_high_scores_daily, name='get_high_scores_daily'),
    path('get_high_scores_weekly/', views.get_high_scores_weekly, name='get_high_scores_weekly'),
    path('get_high_scores_all_time/', views.get_high_scores_all_time, name='get_high_scores_all_time'),
    path('save_high_score/', save_high_score, name='save_high_score'),
    path('user_info/', user_info, name='user_info'),
    path('reset_password/', auth_views.PasswordResetView.as_view(template_name="detail_game/password_reset.html"), name="reset_password"),
    path('reset_password_sent/', auth_views.PasswordResetDoneView.as_view(template_name="detail_game/password_reset_sent.html"), name="password_reset_done"),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(template_name="detail_game/password_reset_form.html"), name="password_reset_confirm"),
    path('reset_password_complete/', auth_views.PasswordResetCompleteView.as_view(template_name="detail_game/password_reset_done.html"), name="password_reset_complete"),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
