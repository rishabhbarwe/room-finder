import json
from django.shortcuts import render
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from .serializers import PropertyRequestSerializer, RegisterSerializer, LoginSerializer, PropertySerializer
from .models import Property, PropertyRequest
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
    permission_classes = [AllowAny] 
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
    

class CreatePropertyRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if request.user.usertype != 'tenant':
            return Response({'error': 'Only tenants can request properties.'}, status=403)

        property_id = request.data.get('property_id')
        message = request.data.get('message', '')

        try:
            property_obj = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            return Response({'error': 'Property not found.'}, status=404)

        # Prevent duplicate requests
        if PropertyRequest.objects.filter(property=property_obj, tenant=request.user).exists():
            return Response({'error': 'You have already requested this property.'}, status=400)

        request_obj = PropertyRequest.objects.create(
            property=property_obj,
            tenant=request.user,
            owner=property_obj.owner,
            message=message
        )

        serializer = PropertyRequestSerializer(request_obj)
        return Response(serializer.data, status=201)
    
class OwnerPropertyRequestsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.usertype != 'owner':
            return Response({'error': 'Only owners can view requests.'}, status=403)

        requests_qs = PropertyRequest.objects.filter(owner=request.user).order_by('-timestamp')
        serializer = PropertyRequestSerializer(requests_qs, many=True)
        return Response(serializer.data, status=200)

class TenantSentRequestsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.usertype != 'tenant':
            return Response({'error': 'Only tenants can view their sent requests.'}, status=403)

        requests_qs = PropertyRequest.objects.filter(tenant=request.user).order_by('-timestamp')
        serializer = PropertyRequestSerializer(requests_qs, many=True)
        return Response(serializer.data, status=200)

from rest_framework.generics import get_object_or_404
from .serializers import PropertyRequestSerializer

class UpdateRequestStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, request_id):
        property_request = get_object_or_404(PropertyRequest, id=request_id)

        status = request.data.get('status')
        if status not in ['accepted', 'rejected']:
            return Response({'error': 'Invalid status'}, status=400)

        property_request.status = status
        property_request.save()

        # Use serializer to get owner details only if accepted
        serializer = PropertyRequestSerializer(property_request)
        data = serializer.data

        # Create message for tenant
        if status == 'accepted':
            message = f"""
Your request for '{data['property_name']}' has been accepted!

Contact Details:
- Name: {data['owner_name']}
- Email: {data['owner_email']}
- Mobile: {data['owner_mobile']}
"""
        else:
            message = f"Your request for '{data['property_name']}' has been rejected."

        return Response({
            'success': f'Request {status} successfully.',
            'message_to_tenant': message.strip()
        }, status=200)


from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Property
from .serializers import PropertySerializer
from rest_framework.permissions import AllowAny

class AllPropertiesAPIView(ListAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # or AllowAny if you prefer
    
class TenantPropertyListView(ListAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer


class FilteredPropertyList(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        room_types = request.GET.get("room_types", "")
        locations = request.GET.get("locations", "")
        min_rent = request.GET.get("min_rent", "")

        properties = Property.objects.all()

        if room_types:
            room_type_list = room_types.split(",")
            properties = properties.filter(room_type__in=room_type_list)

        if locations:
            location_list = locations.split(",")
            properties = properties.filter(city__iexact__in=location_list)  # or use address__icontains

        if min_rent:
            properties = properties.filter(rent__gte=min_rent)

        serializer = PropertySerializer(properties, many=True)
        return Response(serializer.data)

class DeletePropertyRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, property_id):
        try:
            # Ensure the user is deleting *their own* request
            property_request = PropertyRequest.objects.get(
                tenant=request.user,
                property__id=property_id
            )
            property_request.delete()
            return Response({"message": "Request deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except PropertyRequest.DoesNotExist:
            return Response({"detail": "No request found for this property by the current user."}, status=status.HTTP_404_NOT_FOUND)

class RequestedPropertiesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        requests = PropertyRequest.objects.filter(tenant=request.user)
        property_ids = requests.values_list('property_id', flat=True)
        return Response({'requested_property_ids': list(property_ids)})
    
class TenantRequestsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.usertype != 'tenant':
            return Response({'error': 'Only tenants can access this data'}, status=403)

        requests = PropertyRequest.objects.filter(tenant=request.user).order_by('-timestamp')
        serializer = PropertyRequestSerializer(requests, many=True)
        return Response(serializer.data)