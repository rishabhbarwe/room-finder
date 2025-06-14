from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings  
from cloudinary.models import CloudinaryField

class CustomUser(AbstractUser):
    USER_TYPES = (
        ('tenant', 'Tenant'),
        ('owner', 'Owner'),
    )
    usertype = models.CharField(max_length=10, choices=USER_TYPES)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15, null=True, blank=True)  # Add this line
    email = models.EmailField(unique=True)
    

# models.py
class Property(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)


    building_name = models.CharField(max_length=255)
    owner_name = models.CharField(max_length=255,default="Unknown")
    building_image = CloudinaryField('image', blank=True, null=True)
    address = models.TextField()
    city =   models.CharField(max_length=100)
    state  = models.CharField(max_length=100)
    pincode = models.CharField(max_length=6)
    mobile = models.CharField(max_length=15)
    alt_mobile = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField()
    alt_email = models.EmailField(blank=True, null=True)
    rent_from = models.DecimalField(max_digits=10, decimal_places=2)
    rent_to = models.DecimalField(max_digits=10, decimal_places=2)
    # Facilities as JSON (key-value pairs)
    facilities = models.JSONField(default=dict)  
    # Room types and their images as a JSON array
    room_types = models.JSONField(default=list) 

    def __str__(self):
        return self.building_name

class PropertyRequest(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='requests')
    tenant = models.ForeignKey(settings.AUTH_USER_MODEL , on_delete=models.CASCADE, related_name='sent_requests')
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_requests')
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ], default='pending')
    message = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['tenant', 'property']

    def __str__(self):
        return f"{self.tenant.username} → {self.property.building_name} [{self.status}]"


