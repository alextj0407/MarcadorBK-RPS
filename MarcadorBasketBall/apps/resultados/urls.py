from django.urls import path
from .views import *

urlpatterns = [
	path('resultados/',resultados_view,name='resultados'),
	path('compromiso/<int:pk>/',compromiso_view,name='compromiso'),
]