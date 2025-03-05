from django.urls import path
from users.views import CustomTokenObtainPairView

urlpatterns = [
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
]