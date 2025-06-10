from django.urls import path
from .views import RegisterView, LoginView,PropertyCreateView,PropertyByOwnerView,MyPropertiesView, TenantPropertyListView 
from .views import (
    CreatePropertyRequestView,
    OwnerPropertyRequestsView,
    TenantSentRequestsView,
    UpdateRequestStatusView,
    AllPropertiesAPIView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('upload-property/', PropertyCreateView.as_view(), name='upload-property'),
    path('properties/owner/<str:owner_name>/', PropertyByOwnerView.as_view(), name='properties-by-owner'),
    path('my-properties/', MyPropertiesView.as_view(), name='my-properties'),
    path('property-request/', CreatePropertyRequestView.as_view(), name='create-request'),
    path('owner/requests/', OwnerPropertyRequestsView.as_view(), name='owner-requests'),
    path('tenant/requests/', TenantSentRequestsView.as_view(), name='tenant-requests'),
    path('request/update/<int:request_id>/', UpdateRequestStatusView.as_view(), name='update-request-status'),
    path('tenant/properties/', TenantPropertyListView.as_view(), name='tenant-properties'),

     

]
