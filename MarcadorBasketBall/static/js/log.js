var id_equipo1 = 0;
var equipo2 = 0;
var compromiso = 0;

var ultimo_punto=0;
var ultimo_anulado=0;
var ult_select_eq1=0;
var ult_select_eq2=0;

var min = 0;
var seg = 0;
var dec = 0;

(function($) {

	var minuto  = $('#minutos')
	var segundo = $('#segundos')
	var decima = $('#decimas')

	$('#start').click(function(){
		$('#start').attr('disabled', 'disabled');
		$('#mas2_eq1').removeAttr('disabled');
		$('#mas2_eq2').removeAttr('disabled');
		$('#mas3_eq1').removeAttr('disabled');
		$('#mas3_eq2').removeAttr('disabled');
		$('#falta_eq1').removeAttr('disabled');
		$('#falta_eq2').removeAttr('disabled');

		cronometro = setInterval(org, 100);

		var n = $('#numero_compromiso').val()
		var eq1 = $('#equipo1').val()
		var eq2 = $('#equipo2').val()
		
		$.ajax({
			data:{'n':n,'eq1':eq1,'eq2':eq2},
			url:'/crear_juego/',
			type:'get',
			success:function(data) {
				compromiso = data.compromiso;
				equipo1 = data.j1;
				equipo2 = data.j2;
			}
		});

	});

	$('#continuar').click(function(){
		$('#continuar').attr('disabled', 'disabled');
		$('#anular_eq1').attr('disabled','disabled');
		$('#anular_eq2').attr('disabled','disabled');

		$('#mas2_eq1').removeAttr('disabled');
		$('#mas2_eq2').removeAttr('disabled');
		$('#mas3_eq1').removeAttr('disabled');
		$('#mas3_eq2').removeAttr('disabled');

		$('#falta_eq1').removeAttr('disabled');
		$('#falta_eq2').removeAttr('disabled');

		cronometro = setInterval(org, 100);
	});


	function org(){
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
			
			if (seg==5 && dec==0 && min==0){
				clearInterval(cronometro);

				$('#mas2_eq1').attr('disabled','disabled');
				$('#mas2_eq2').attr('disabled','disabled');
				$('#mas3_eq1').attr('disabled','disabled');
				$('#mas3_eq2').attr('disabled','disabled');

				$('#falta_eq1').attr('disabled','disabled');
				$('#falta_eq2').attr('disabled','disabled');

				min=0;
				seg=0;
				dec=0;
				minuto.text('00');
				segundo.text('00');
				decima.text('00');

				var set = parseInt($('#set').text());
				if (set <4){
					set++;
					$('#continuar').removeAttr('disabled');
					$('#set').text(set)
				}else if(set==4){
					$('#limpiar').removeAttr('style')
				}
				
			}
	}

})(jQuery);

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
	crear_punto(valor,equipo1);
	$('#anular_eq1').removeAttr('disabled');
	$('#anular_eq2').attr('disabled','disabled');
	var marcador = parseInt($('#marcador_eq1').text());
	marcador+=valor;
	$('#marcador_eq1').text(marcador);
}

function punto_eq2(valor) {
	crear_punto(valor,equipo2);
	$('#anular_eq2').removeAttr('disabled');
	$('#anular_eq1').attr('disabled','disabled');
	var marcador = parseInt($('#marcador_eq2').text());
	marcador+=valor;
	$('#marcador_eq2').text(marcador);
}

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

$('#limpiar').click(function() {
	var equipo1 = 0;
	var equipo2 = 0;
	var compromiso = 0;

	var ultimo_punto=0;
	var ultimo_anulado=0;

	var min = 0;
	var seg = 0;
	var dec = 0;
})

$('#equipo1').change(function() {
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
});

$('#equipo2').change(function() {
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
});

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
	agregar_falta(equipo1,etiqueta)
});

$('#falta_eq2').click(function() {
	var etiqueta = $('#faltas_eq2')
	agregar_falta(equipo2,etiqueta)
});