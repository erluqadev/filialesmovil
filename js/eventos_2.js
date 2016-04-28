var changeMes = function(id , desc){
	if(id != -1){
		var split = id.split("-");
		var mes = split[0];
		var anio = split[1];
		var callback_success = function(data){
			showEventos(data.data);
		};
		requestAjax('POST' , 'eventos/eventos_por_mes' , {token : token , mes : mes , año : anio} , callback_success);
	}
	else{
		loadEventosFrecuentes();
	}
};
var showViewSolicitar = function(){
	var idEvento = $("dialog .mdl-dialog__content").data('idevento');
	var data = $("[data-id='"+idEvento+"']").data();
	$("#content-seccion-evento").hide('slow');
	$("#content-solicitud-codigo").attr('data-id' , data.id).show('slow');
	$("#evento-name").html(data.nombre);
	$("#span-lugarfecha").text(data.lugarfecini);
	$("#span-numinsc").text(data.numinsc);
	showCantCodigos(data.id);
	$("dialog .close").trigger('click');
};
var showViewIncribir = function(){
	var idEvento = $("dialog .mdl-dialog__content").data('idevento');
	var data = $("[data-id='"+idEvento+"']").data();
	$("#content-seccion-evento").hide('slow');
	$("#content-inscripcion").attr('data-id' , data.id).show('slow');
	$("#insc-evento-name").html(data.nombre);
	$("#insc-span-lugarfecha").text(data.lugarfecini);
	$("#insc-span-numinsc").text(data.numinsc);
	$("dialog .close").trigger('click');
};
var showCantCodigos = function(idEvento){
	var callback_success = function(data){
		var separados = data.data.codigos_disponibles_sucursal;
		var disponibles = data.data.codigos_disponibles_evento;
		$("#cant-separados").html(separados.cantidad);
		$("#cant-disponibles").html(disponibles.cantidad);
		$.each(separados.codigos , function(i,v){
			var item = $("<div class='codigo with-padding-p2 col-xs-2'>").html(v);
			$("#content-codigos").append(item);
		});
	};
	requestAjax('POST' , 'eventos/codigos_disponibles' , {'token' : token , 'id_evento' : idEvento , 'id_suc' : user_idsuc} , callback_success);
};
var solicitarCodigos = function(){
	var numCodDis = parseInt($("#cant-disponibles").html());
	var txtCanCod = $("#txtCanCod").val().trim();
	if(txtCanCod == '' || isNaN(txtCanCod)){
		showToastr("Ingrese cantidad de códigos a solicitar.");
		return;
	}
	else{
		if(parseInt(txtCanCod) > numCodDis){
			showToastr("La cantidad de códigos solicitados no puede ser mayor a las disponibles." , "warning");
			return
		}
	}
	var cantCods = parseInt(txtCanCod);
	var idEveSelect = $("#content-solicitud-codigo").data('id');
	var callback_success = function(data){
		var numAsig = data.data.codigos_asignados;
		if(numAsig > 0){
			if(numAsig < cantCods){
				showToastr("Sólo se activaron "+numAsig+" códigos para el evento." , "warning");
			}
			else{
				showToastr("Conforme. "+data.msg , "success");
			}
		}
		else{
			showToastr("Perdón. "+data.msg , "error");
		}
		showCantCodigos(idEveSelect);
		$("#txtCanCod").val('')
						.parent().removeClass('is-dirty');
	}
	requestAjax('POST' , 'eventos/activar_codigos' , {'token' : token , 'id_suc' : user_idsuc , 'id_evento' : idEveSelect , 'cantidad_codigos' : cantCods} , callback_success);
}
var showEventos = function(eventos){
	$("#container-eventos").html('');
	$.each(eventos ,  function(i,v){
		var clone = $("#template-evento .item-evento").clone();
		$(clone).find("header").html(v.nombre);
		$(clone).find(".body .numinsc").text(v.cnt_insc);
		$(clone).attr("data-id" , v.id_evento);
		$(clone).attr("data-nombre" , v.nombre);
		$(clone).attr("data-numinsc" , v.cnt_insc);
		if(v.lugar.trim() != ''){
			$(clone).find(".body .lugar-fecini").text(v.lugar + " - " + v.fecha_inicio);
			$(clone).attr("data-lugarfecini" , v.lugar + " - " +v.fecha_inicio);
		}
		else{
			$(clone).find(".body .lugar-fecini").text(v.fecha_inicio);
			$(clone).attr("data-lugarfecini" , v.fecha_inicio);
		}
		$(clone).on('click' , function(){
			$("dialog .mdl-dialog__content").attr("data-idevento" , $(this).data('id'));
			document.querySelector('dialog').showModal();
		});
		$("#container-eventos").append(clone);
	});
};
var loadMeses = function(){
	var objSelect = select();
	if($("#input-select-mes").siblings('.select').length == 0){
		var inputSelectMes = document.getElementById("input-select-mes");
		var dataMeses = [];
		var callback_success = function(data){
			if(data.data.length > 0){
				dataMeses.push({id : -1 , 'desc' : 'Frecuentes'});
				$.each(data.data , function(i , v){
					dataMeses.push({id : v.mes+"-"+v.año , 'desc' : v.mes_nombre});
				});
				objSelect.init(inputSelectMes , dataMeses , false , '-1' , true , changeMes);
			}
			else{
				console.log("No hay meses");
			}
		};
		requestAjax('POST' , 'eventos/meses_eventos' , {'token' : token} , callback_success);
		
	}
};
var loadEventosFrecuentes = function(){
	var callback_success = function(data){
		if(data.data.length > 0){
			showEventos(data.data);
		}
		else{
			showToastr("No hay eventos para tu sucursal" , 'warning');
		}
	};
	requestAjax('POST' , 'eventos/listar_eventos' , {'token' : token , 'id_suc' : user_idsuc} , callback_success);
};
var resetFormSolicitar = function(e){
	$(this).find('input').val('').parent().removeClass('is-dirty');
};
var initModalDialog = function(){
	var dialog = document.querySelector('dialog');
    if (! dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }
    dialog.querySelector('.close').addEventListener('click', function() {
      dialog.close();
    });
};
initEventos2 = function(){
	var cbSuccess = function(data){
		$("#section-content").html(data);
		if(!(typeof(componentHandler) == 'undefined')){
		  componentHandler.upgradeAllRegistered();
		}
		loadMeses();
		loadEventosFrecuentes();
		$("#form-solicitar-codigos").on('submit' , function(e){e.preventDefault();});
		$("#form-solicitar-codigos").on('reset' , resetFormSolicitar);
		$("#btn-send").on('click' , solicitarCodigos);
		initModalDialog();
		$("#btn-dialog-solicitar").on('click' , showViewSolicitar);
		$("#btn-dialog-inscribir").on('click' , showViewIncribir);
	};
	requestAjaxHtml('solicitar_cod_insc_eve' , cbSuccess);
};