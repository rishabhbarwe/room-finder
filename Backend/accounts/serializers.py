from rest_framework import serializers
from .models import CustomUser, PropertyRequest
from .models import Property
from django.contrib.auth import authenticate

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['name', 'username', 'email','phone', 'password', 'usertype']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            name=validated_data['name'],
            email=validated_data['email'],
            phone=validated_data['phone'],
            usertype=validated_data['usertype'],
            password=validated_data['password']
        )
        return user
#-----------------------------------------------------------------------------------------
class LoginSerializer(serializers.Serializer):
    username_or_email = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username_or_email = data.get('username_or_email')
        password = data.get('password')

        user = CustomUser.objects.filter(username=username_or_email).first() or \
               CustomUser.objects.filter(email=username_or_email).first()

        if user is None or not user.check_password(password):
            print("Invalid Credentials")
            raise serializers.ValidationError("Invalid credentials")
           

        data['user'] = user
        return data
#-----------------------------------------------------------------------------------------




class PropertySerializer(serializers.ModelSerializer):
    building_name = serializers.CharField(required=False, allow_blank=True)
    owner_name = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)
    city = serializers.CharField(required=False, allow_blank=True)
    state = serializers.CharField(required=False, allow_blank=True)
    pincode = serializers.CharField(required=False, allow_blank=True)
    mobile = serializers.CharField(required=False, allow_blank=True)
    alt_mobile = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    alt_email = serializers.EmailField(required=False, allow_blank=True)
    rent_from = serializers.DecimalField(required=False, max_digits=10, decimal_places=2)
    rent_to = serializers.DecimalField(required=False, max_digits=10, decimal_places=2)
    facilities = serializers.JSONField(required=False)
    room_types = serializers.ListField(child=serializers.JSONField())


    building_image = serializers.ImageField(required=False)

    class Meta:
        model = Property
        fields = '__all__'
        read_only_fields = ['owner']  # Important: don't let frontend send this

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request else None

        room_types_data = validated_data.pop('room_types', [])
        property_instance = Property.objects.create(owner=user, **validated_data)
        property_instance.room_types = room_types_data
        property_instance.save()

        return property_instance
    def to_representation(self, instance):
           representation = super().to_representation(instance)
           # Cloudinary already gives full URL
           representation['building_image'] = instance.building_image.url if instance.building_image else None
           return representation

#-----------------------------------------------------------------------------------------

class PropertyRequestSerializer(serializers.ModelSerializer):
    property_name = serializers.CharField(source='property.building_name', read_only=True)
    tenant_name = serializers.CharField(source='tenant.username', read_only=True)
    owner_name = serializers.SerializerMethodField()
    owner_email = serializers.SerializerMethodField()
    owner_mobile = serializers.SerializerMethodField()

    class Meta:
        model = PropertyRequest
        fields = [
            'id', 'property', 'property_name', 'tenant', 'tenant_name', 'status', 'message',
            'timestamp', 'owner_name', 'owner_email', 'owner_mobile'
        ]

    def get_owner_name(self, obj):
        if obj.status == 'accepted':
            return obj.property.owner_name
        return None

    def get_owner_email(self, obj):
        if obj.status == 'accepted':
            return obj.property.email
        return None

    def get_owner_mobile(self, obj):
        if obj.status == 'accepted':
            return obj.property.mobile
        return None

