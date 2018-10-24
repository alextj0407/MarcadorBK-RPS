from django.shortcuts import render
from django.http import HttpResponse
from apps.home.models import Equipo
from .models import *
import json

def tablero_view(request):
	equipos = Equipo.objects.all().order_by('nombre')
	return render(request,'tablero/tablero2.html',locals())

def agregar_punto_ajax(request):
	pk = request.GET.get('pk')
	valor = request.GET.get('valor')
	minuto = request.GET.get('minuto')
	n_set = request.GET.get('n_set')

	juego = Juego.objects.get(id=pk)

	punto = Punto.objects.create(valor=valor,minuto=minuto,numero_set=n_set,juego=juego)
	punto.save()

	response = {'id':punto.id}

	return HttpResponse(json.dumps(response),content_type='application/json')
	 

def crear_juego(request):

	n = (Compromiso.objects.all().count())+1
	eq1=request.GET.get('eq1')
	eq2=request.GET.get('eq2')

	compromiso = Compromiso.objects.create(numero=n)
	compromiso.save()

	equipo1 = Equipo.objects.get(id=eq1)
	equipo2 = Equipo.objects.get(id=eq2)

	j1 = Juego.objects.create(equipo=equipo1,compromiso=compromiso)
	j2 = Juego.objects.create(equipo=equipo2,compromiso=compromiso)

	j1.save()
	j2.save()

	response = {'compromiso':compromiso.id,'j1':j1.id,'j2':j2.id}

	return HttpResponse(json.dumps(response),content_type='application/json')

def anular_punto(request):
	pk = request.GET.get('pk')
	punto = Punto.objects.get(id=pk)
	valor = punto.valor
	punto.delete()

	return HttpResponse(json.dumps({'valor':valor}),content_type='application/json')

def agregar_falta(request):
	pk = request.GET.get('pk')
	ju = Juego.objects.get(id=pk)
	ju.numero_faltas+=1
	ju.save()
	n_faltas=ju.numero_faltas
	return HttpResponse(json.dumps({'n_faltas':n_faltas}),content_type='application/json')