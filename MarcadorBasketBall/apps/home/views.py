from django.shortcuts import render,redirect, get_object_or_404
from django.views.generic.edit import (CreateView,UpdateView,DeleteView)
from django.urls import reverse_lazy
from .forms import *
from .models import *

#========================CRUD EQUIPOS=======================#
def lista_equipos_view(request):
	equipo_list = Equipo.objects.all().order_by('nombre')
	return render(request,'home/equipo_list.html',locals())

class agregar_equipo_view(CreateView):
	model=Equipo
	form_class=agregar_equipo_form
	success_url = reverse_lazy('lista_equipos')

class editar_equipo_view(UpdateView):
	model=Equipo
	form_class=agregar_equipo_form
	success_url = reverse_lazy('lista_equipos')

class eliminar_equipo_view(DeleteView):
	model=Equipo
	success_url = reverse_lazy('lista_equipos')

#========================CRUD CIUDAD=======================#
def view_ciudad(request):
	ciudades = Ciudad.objects.all()
	return render(request, "home/ciudades.html",locals())

def agregar_ciudad(request):
	msj = 'Agrgar Ciudad'
	if request.method == "POST":
		form = ciudad_form(request.POST)
		if form.is_valid():
			nombre = form.cleaned_data['nombre'].upper()
			if not Ciudad.objects.filter(nombre=nombre):
				guardar = form.save(commit = False)
				guardar.nombre = nombre
				guardar.save()
				return redirect('/ciudades/')
			else:
				msjError = nombre + " ya esta registrada"
		else:
			msjError = "Intentelo nuevamente"

	form = ciudad_form()
	return render(request, "home/ciudad_form.html", locals())

def editar_ciudad(request, id):
	msj = 'Editar Ciudad'
	editar = get_object_or_404(Ciudad, id=id)
	if request.method == "POST":
		form = ciudad_form(request.POST, instance = editar)
		if form.is_valid():
			nombre = form.cleaned_data['nombre'].upper()
			if not Ciudad.objects.filter(nombre=nombre):
				guardar = form.save(commit = False)
				guardar.nombre = nombre
				guardar.save()
				return redirect('/ciudades/')
			else:
				msjError = "Esta ciudad ya esta registrada"
		else:
			msjError = "Intentelo nuevamente"

	form = ciudad_form(instance=editar)
	return render(request, "home/ciudad_form.html", locals())

def eliminar_ciudad(request, id):
	eliminar = get_object_or_404(Ciudad, id=id)
	eliminar.delete()
	return redirect('/ciudades/')