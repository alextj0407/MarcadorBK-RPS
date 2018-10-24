from django.urls import path
from django.views.generic import TemplateView
from .views import *

urlpatterns = [
	path('', TemplateView.as_view(template_name='index.html'), name='index'),
    path('lista_equipos/',lista_equipos_view,name='lista_equipos'),
    path('agregar_equipo/',agregar_equipo_view.as_view(),name='agregar_equipo'),
    path('editar_equipo/<int:pk>/',editar_equipo_view.as_view(),name='editar_equipo'),
    path('eliminar_equipo/<int:pk>/',eliminar_equipo_view.as_view(),name='eliminar_equipo'),

#======================== CIUDAD ==========================#
 	path('ciudades/', view_ciudad, name="ciudades"),
    path('agregar-ciudad/', agregar_ciudad, name="agregar-ciudad"),
    path('editar-ciudad/<int:id>/', editar_ciudad, name="editar-ciudad"),
    path('borrar-ciudad/<int:id>/', eliminar_ciudad, name="borrar-ciudad"),
]