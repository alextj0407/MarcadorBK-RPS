from django.shortcuts import render
from apps.home.models import *
from apps.tablero.models import *

def resultados_view(request):
	equipos = []
	compr = Compromiso.objects.all()
	juego = Juego.objects.all()
	
	eqps=2
	for c in compr:
		p=[c.id]
		for j in juego:
			if j.compromiso.id == c.id:
				
				equipo = j.equipo.nombre
				puntos =0
				cestas = Punto.objects.filter(juego=j.id)
				if cestas:
					for pnt in cestas:
						puntos += pnt.valor

				p.append(equipo)
				p.append(puntos)

		equipos.append(p)

	return render(request,'resultados/resultados.html',locals())


def compromiso_view(request,pk):
	faltas=0
	equipos = Juego.objects.filter(compromiso=pk)

	equipo1 = equipos[0]
	equipo2 = equipos[1]

	pnt_eq1 = Punto.objects.filter(juego=equipo1.id)
	pnt_eq2 = Punto.objects.filter(juego=equipo2.id)

	cest_eq1 = pnt_eq1.count()
	cest_eq2 = pnt_eq2.count()

	tot_eq1 = 0
	tot_eq2 = 0

	if pnt_eq1:
		for pe1 in pnt_eq1:
			tot_eq1 += pe1.valor
	if pnt_eq2:
		for pe2 in pnt_eq2:
			tot_eq2 += pe2.valor

	return render(request,'resultados/compromiso.html',locals())