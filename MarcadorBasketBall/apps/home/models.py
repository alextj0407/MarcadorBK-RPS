from django.db import models

class Ciudad(models.Model):
	nombre = models.CharField(max_length=50,unique=True)
	def __str__(self):
		return self.nombre


class Equipo(models.Model):
	nombre = models.CharField(max_length=50,unique=True)
	numero_jugadores=models.IntegerField()
	ciudad = models.ForeignKey(Ciudad, on_delete = models.CASCADE)
	def __str__(self):
		return self.nombre+'  '+self.ciudad.nombre

