from django.urls import path
from .views import *
from django.views.generic import TemplateView

urlpatterns = [
    path('agregar_punto_ajax/',agregar_punto_ajax,name='agregar_punto_ajax'),
    path('crear_juego/',crear_juego,name='crear_juego'),
    path('anular_punto/',anular_punto,name='anular_punto'),
    path('agregar_falta/',agregar_falta,name='agregar_falta'),
    path('tablero/',tablero_view,name='tablero2'),
]