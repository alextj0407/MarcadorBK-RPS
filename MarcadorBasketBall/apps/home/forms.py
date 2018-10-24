from django import forms
from .models import *

class agregar_equipo_form(forms.ModelForm):
	class Meta:
		model = Equipo
		fields= '__all__'

	def clean_nombre(self):
		nombre=(self.cleaned_data.get('nombre')).upper()
		return nombre

	def clean_numero_jugadores(self):
		numero_jugadores = self.cleaned_data.get('numero_jugadores')

		if numero_jugadores<6 or numero_jugadores >12:
			raise forms.ValidationError('Numero de Jugadores minimo 6 maximo 12')

		return numero_jugadores

class ciudad_form(forms.ModelForm):
	class Meta:
		model = Ciudad
		fields='__all__'