from rest_framework import serializers
from .models import CustomUser
from .models import Property, RoomSize
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

class RoomSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomSize
        fields = ['room_type', 'size', 'image']


class PropertySerializer(serializers.ModelSerializer):
    room_sizes = RoomSizeSerializer(many=True)

    class Meta:
        model = Property
        fields = [
            'id', 'building_name', 'building_image', 'address', 'city', 'state',
            'pincode', 'mobile', 'alt_mobile', 'email', 'alt_email',
            'rent_from', 'rent_to', 'facilities', 'room_sizes'
        ]

    def create(self, validated_data):
        room_sizes_data = validated_data.pop('room_sizes')
        property_instance = Property.objects.create(**validated_data)
        for room in room_sizes_data:
            RoomSize.objects.create(property=property_instance, **room)
        return property_instance
#-----------------------------------------------------------------------------------------