var pk_equipo1 = 0;
var pk_equipo2 = 0;
var pk_compromiso = 0;

var ultimo_punto=0;
var ultimo_anulado=0;
var ult_select_eq1=0;
var ult_select_eq2=0;

var min = 0;
var seg = 0;
var dec = 0;

var minuto  = $('#minutos');
var segundo = $('#segundos');
var decima = $('#decimas');

(function($){
    $('#start').click(function(){
        stop_habilitar();
        habilitar();
        deshabilitar_select();
        cronometro = setInterval(organizador, 100);

        var eq1 = $('.local').val()
        var eq2 = $('.visitante').val()
        
        console.log(eq1);
        console.log(eq2);
		
		$.ajax({
			data:{'eq1':eq1,'eq2':eq2},
			url:'/crear_juego/',
			type:'get',
			success:function(data) {
				pk_equipo1 = data.j1;
				pk_equipo2 = data.j2;
				pk_compromiso = data.compromiso;
			}
		});
    })

    $('#continuar').click(function(){
		stop_habilitar();
        habilitar();
		cronometro = setInterval(organizador, 100);
    });
    
    $('#stop').click(function(){
        clearInterval(cronometro);
        continuar_habilitar();
    })
})(jQuery);

// funciones complementarias
function deshabilitar_select(){
    var eq1 = $('.local')
    var eq2 = $('.visitante')
    
    eq1.attr('disabled','disabled');
    eq2.attr('disabled','disabled');
    $('select').formSelect();
}
    // habilitar etiquetas
function habilitar(){
    $('.marcar_punto').removeAttr('disabled');
    // funciones para quipo 1
    $('#falta_eq1').removeAttr('disabled');
    // funciones para quipo 2
    $('#falta_eq2').removeAttr('disabled');
}
    // deshabilitar etiquetas
function deshabilitar(){
    $('.marcar_punto').attr('disabled','disabled');
    // funciones para quipo 1
    $('#falta_eq1').attr('disabled','disabled');
    // funciones para quipo 2
    $('#falta_eq2').attr('disabled','disabled');
}
    //deshabilitar despues de reanudar el cronometro
function stop_habilitar(){
    $('#start').attr('class','waves-effect waves-light btn green oculto');
    $('#continuar').attr('class','waves-effect waves-light btn green oculto');
    $('#stop').attr('class','waves-effect waves-light btn green');
    $('#anular_eq1').attr('disabled','disabled');
	$('#anular_eq2').attr('disabled','disabled');
}
    //deshabilitar despues de detener el cronometro
function continuar_habilitar(){
    $('#stop').attr('class','waves-effect waves-light btn green oculto');
    $('#continuar').attr('class','waves-effect waves-light btn green');
}

// Organizar las unidades de tiempo en las etiquetas correspondientes
function organizador(){
    dec++;

    if (dec<10) {decima.text('0'+dec);}
    
    if (dec==10){
        dec=0;
        seg++;
        decima.text('00');
        if (seg<10) {segundo.text('0'+seg);}
        else if (seg>=10 && seg<60){segundo.text(seg);}
    }

    if (seg==60){
        seg=0;
        min++;
        segundo.text('00')
        if(min<10){minuto.text('0'+min);}
        else {minuto.text(min);}	
    }
    
    if (seg==4 && dec==0 && min==0){
        clearInterval(cronometro);
        deshabilitar();

        min=0;
        seg=0;
        dec=0;
        minuto.text('00');
        segundo.text('00');
        decima.text('00');

        var set = parseInt($('#set').text());
        if (set <4){
            set++;
            continuar_habilitar();
            $('#set').text(set)
        }else if(set==4){
            game_over();
            continuar_habilitar();
        }
        
    }
}
function desables_cuenta_regresiva(){
    $('.marcar_punto').attr('class','oculto');
    $('#falta_eq1').attr('class','oculto');
    $('#anular_eq1').attr('class','oculto');
    $('#falta_eq2').attr('class','oculto');
    $('#anular_eq2').attr('class','oculto');
    $('#detalles').attr('class','waves-effect waves-light btn green');
    $('#nuevo').attr('class','waves-effect waves-light btn green');
    $('#continuar').attr('class','oculto');
    $('#p_end').attr('class','oculto');
    $('#periodo').attr('class','oculto');
    $('#set').text('VS');
}

 // CUENTA REGRESIVA
function centa_regresiva(){
    var time = 10;
    end_game = setInterval(function(){
        time--;
        $('#msj_end').text(time)
        if (time==0){
            desables_cuenta_regresiva();
            clearInterval(end_game);
        }
    },1000)
}

// Fin de compromiso 
function game_over(){
    $('#p_end').removeAttr('class');
    centa_regresiva();
    // alert('Compromiso terminado');
    
    
}

// marcar un punto
function crear_punto(valor,equipo) {
	var n_set = parseInt($('#set').text());
	ultimo_anulado=valor;

	var m='';
	var s='';
	var d='0'+dec;

	if (min<10){m='0'+min;}
	else if(min>9){m=min}

	if (seg<10){s='0'+seg;}
	else if(seg>9){s=seg}

	var minuto = m+':'+s+':'+d;
	$.ajax({
		data:{'pk':equipo,'valor':valor,'minuto':minuto,'n_set':n_set},
		url:'/agregar_punto_ajax/',
		type:'get',
		success:function(data) {
			ultimo_punto=data.id;
		}
	});	
}

function punto_eq1(valor) {
	crear_punto(valor,pk_equipo1);
	$('#anular_eq1').removeAttr('disabled');
	$('#anular_eq2').attr('disabled','disabled');
	var marcador = parseInt($('#marcador_eq1').text());
	marcador+=valor;
	$('#marcador_eq1').text(marcador);
}

function punto_eq2(valor) {
	crear_punto(valor,pk_equipo2);
	$('#anular_eq2').removeAttr('disabled');
	$('#anular_eq1').attr('disabled','disabled');
	var marcador = parseInt($('#marcador_eq2').text());
	marcador+=valor;
	$('#marcador_eq2').text(marcador);
}


// anular punto
function anular_punto() {
	$.ajax({
		data:{'pk':ultimo_punto},
		url:'/anular_punto/',
		type:'get',
	});
}

$('#anular_eq1').click(function() {
	anular_punto();
	$('#anular_eq1').attr('disabled','disabled');

	var marcador = parseInt($('#marcador_eq1').text());
	marcador-=ultimo_anulado;
	$('#marcador_eq1').text(marcador);
});

$('#anular_eq2').click(function() {
	anular_punto();
	$('#anular_eq2').attr('disabled','disabled');

	var marcador = parseInt($('#marcador_eq2').text());
	marcador-=ultimo_anulado;
	$('#marcador_eq2').text(marcador);
});

// marcar falta
function agregar_falta(equipo,etiqueta) {
	$.ajax({
		data:{'pk':equipo},
		url:'/agregar_falta/',
		type:'get',
		success:function(data) {
			var f = data.n_faltas
			etiqueta.text(f)
		}
	});
}

$('#falta_eq1').click(function() {
	var etiqueta = $('#faltas_eq1')
	agregar_falta(pk_equipo1,etiqueta)
});

$('#falta_eq2').click(function() {
	var etiqueta = $('#faltas_eq2')
	agregar_falta(pk_equipo2,etiqueta)
});

//  VALIDACION EN EL SELECT
$('#local').change(function() {
	var val = $(this).val();
    var opcion = '';

	if (ult_select_eq1>0) {
		opcion = '#'+ult_select_eq1+'eq2';
		$(opcion).removeAttr('disabled');
	}

	ult_select_eq1=val;
	opcion = '#'+val+'eq2';
	$(opcion).attr('disabled','disabled');
    $('#equipo2').removeAttr('disabled');
    $('select').formSelect();
});

$('#visitante').change(function() {
	var val = $(this).val();
    var opcion = '';
        
	if (ult_select_eq2>0) {
		opcion = '#'+ult_select_eq2+'eq1';
		$(opcion).removeAttr('disabled');
	}

	ult_select_eq2=val;
	opcion = '#'+val+'eq1';
	$(opcion).attr('disabled','disabled');
    $('#start').removeAttr('disabled');
    $('select').formSelect();
});

// ver detalles
$('#detalles').click(function(){
    location.href='/compromiso/'+ pk_compromiso + '/';
})

// activar Modal de alertas
