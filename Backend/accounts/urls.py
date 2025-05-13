from django.urls import path
from .views import RegisterView, LoginView,PropertyCreateView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
     path('upload-property/', PropertyCreateView.as_view(), name='upload-property'),

]
