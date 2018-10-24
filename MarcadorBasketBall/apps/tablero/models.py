from django.db import models
from apps.home.models import Equipo

class Compromiso(models.Model):
	numero = models.IntegerField()
	def __str__(self):
		return str(self.numero)

class Juego(models.Model):
	numero_faltas = models.IntegerField(default=0)

	equipo = models.ForeignKey(Equipo, on_delete = models.CASCADE)
	compromiso = models.ForeignKey(Compromiso, on_delete = models.CASCADE)
	def __str__(self):
		return self.equipo.nombre+' Compromiso numero'+ str(self.compromiso.numero)+'  Faltas '+str(self.numero_faltas)

class Punto(models.Model):
	valor = models.IntegerField(default=2)
	minuto = models.CharField(max_length=10)
	numero_set = models.IntegerField()
	
	juego = models.ForeignKey(Juego, on_delete = models.CASCADE)
	def __str__(self):
		return 'Valor de punto:'+str(self.valor)+' Equipo:'+self.juego.equipo.nombre+' Minuto:'+self.minuto+' Set:'+str(self.numero_set)