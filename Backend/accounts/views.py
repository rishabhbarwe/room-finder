import json
from django.shortcuts import render
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from .serializers import RegisterSerializer, LoginSerializer, PropertySerializer

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                "token": token.key,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "name": user.name,
                    "usertype": user.usertype,
                    "phone" : user.phone
                }
            }, status=status.HTTP_201_CREATED)
        print("Serializer error : ",serializer.errors)
        return Response(serializer.errors, status=400)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key}, status=200)
        print("Serializer login error : ",serializer.errors)
        return Response(serializer.errors, status=400)


class PropertyCreateView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        data = request.data.copy()  # Copy the incoming request data
        files = request.FILES  # Get files

        print("DATA KEYS:", data.keys())
        print("FILES KEYS:", files.keys())
        print("Received Data:", data)

        room_types = []  # Initialize room_types to collect room data
        i = 0

        # Extract room_types data from incoming request
        while f'room_types[{i}][type]' in data:
            room = {
                'type': data.get(f'room_types[{i}][type]'),  # Get the room type
                'image': files.get(f'room_types[{i}][image]')  # Get the room image if available
            }
            room_types.append(room)
            i += 1

        # Handle facilities data, if available
        facilities = data.get('facilities')
        if isinstance(facilities, str):
            try:
                data['facilities'] = json.loads(facilities)  # Parse stringified JSON for facilities
            except:
                data['facilities'] = {}

        # Create a new Property instance using the serializer
        serializer = PropertySerializer(data={
            **data,
            "room_types": room_types  # Append the room_types data to the property data
        })

        if serializer.is_valid():  # Check if the data is valid (we will disable detailed validation for now)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        print("Serializer Errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
