from django.urls import path
from .views import RegisterView, LoginView,PropertyCreateView,PropertyByOwnerView,MyPropertiesView 

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('upload-property/', PropertyCreateView.as_view(), name='upload-property'),
    path('properties/owner/<str:owner_name>/', PropertyByOwnerView.as_view(), name='properties-by-owner'),
     path('my-properties/', MyPropertiesView.as_view(), name='my-properties'),
     

]
