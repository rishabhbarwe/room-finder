import json
from django.shortcuts import render
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from .serializers import RegisterSerializer, LoginSerializer, PropertySerializer
from .models import Property
from rest_framework import viewsets, permissions, status
from rest_framework.permissions import AllowAny

class RegisterView(APIView):
    permission_classes = [AllowAny] 
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                "token": token.key,
               
            }, status=status.HTTP_201_CREATED)
        print("Serializer error : ",serializer.errors)
        return Response(serializer.errors, status=400)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
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
        print("Serializer login error : ",serializer.errors)
        return Response(serializer.errors, status=400)


class PropertyCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated] 
    parser_classes = (MultiPartParser, FormParser)
    
    
    def post(self, request):
        print("Request user:", request.user, "| Authenticated:", request.user.is_authenticated)

        data_dict = {
            'building_name': request.data.get('building_name'),
            'owner_name' : request.data.get('owner_name'),
            'address': request.data.get('address'),
            'city': request.data.get('city'),
            'state': request.data.get('state'),
            'pincode': request.data.get('pincode'),
            'mobile': request.data.get('mobile'),
            'alt_mobile': request.data.get('alt_mobile'),
            'email': request.data.get('email'),
            'alt_email': request.data.get('alt_email'),
            'rent_from': request.data.get('rent_from'),
            'rent_to': request.data.get('rent_to'),
            'building_image': request.FILES.get('building_image'),
        }

        # Handle facilities
        facilities_str = request.data.get('facilities', '{}')
        try:
            data_dict['facilities'] = json.loads(facilities_str)
        except json.JSONDecodeError:
            data_dict['facilities'] = {}

        # Handle room_types
        room_data_list = request.data.getlist('room_data[]')
        room_types = []
        for room_str in room_data_list:
            try:
                room_obj = json.loads(room_str)
                # Here you can fetch the image later if needed
                room_obj['image'] = None
                room_types.append(room_obj)
            except json.JSONDecodeError:
                continue

        data_dict['room_types'] = room_types

        # Validate and save
        serializer = PropertySerializer(data=data_dict, context={'request': request})


        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        print("Serializer Errors of property view:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyPropertiesView(APIView):
    permission_classes = [permissions.IsAuthenticated]
   
    def get(self, request):
        print("Usertype : ",request.user.usertype)
        if request.user.usertype != 'owner':
            return Response({'detail': 'Only owners can view their properties.'},
                            status=status.HTTP_403_FORBIDDEN)
        properties = Property.objects.filter(owner=request.user)
        serializer = PropertySerializer(properties, many=True)
       
        return Response(serializer.data, status=status.HTTP_200_OK)

#get property data based on the owners name
class PropertyByOwnerView(APIView):
    def get(self, request, owner_name):
        properties = Property.objects.filter(owner_name=owner_name)
        serializer = PropertySerializer(properties, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
