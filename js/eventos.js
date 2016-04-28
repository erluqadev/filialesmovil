var select = select();
var idSucSelect = '';
var idEveSelect = '';
var numCodDis = 0;
var numCodSep = 0;
var toggleSelectSuc = function(){
	var estado = $(this).prop('checked');
	if(estado){
		$("#input-select-suc").prop('disabled' , false);
		$("#input-select-suc").parent().removeClass('is-disabled');
		loadDataSucursales();
	}
	else{
		$("#input-select-suc").prop('disabled' , true);
		$("#input-select-suc").parent().addClass('is-disabled');
	}
};
var toggleFormControls = function(disabled){
	$("#txtNumCod").prop("disabled" , disabled);
	$(".form-buttons button").prop('disabled' , disabled);
};
var change_sucursal = function(id , desc){
	$("#input-select-eve").val('')
						   .data('select' , 0)
						   .parent().removeClass('is-dirty');
	loadDataEventos(id);
	$("#span-cod-sep").text("?");
	$("#span-cod-dis").text("?");
	$("#btn-viewcods").addClass("hidden");
	numCodDis = 0;
	numCodSep = 0;
	toggleFormControls(true);
};
var change_evento = function(id , desc){
	showNumCodsEvento(id);
}
var showNumCodsEvento = function(idEve){
	if(idEve != idEveSelect){
		var callback_success = function(data){
			numCodSep = data.data.codigos_disponibles_sucursal.cantidad;
			numCodDis = data.data.codigos_disponibles_evento.cantidad;
			$("#span-cod-sep").text(numCodSep);
			$("#span-cod-dis").text(numCodDis);
			if(numCodDis <= 0){
				toggleFormControls(true);
			}
			else{
				toggleFormControls(false);
			}
			if(numCodSep > 0){
				$("#btn-viewcods").removeClass("hidden");

				$.each(data.data.codigos_disponibles_sucursal.codigos , function(i ,v){
					$("#dialog-viewcods .body").append("<span class='lable label-default with-padding-p5 span-cods'>"+v+"</span>");
				});
			}
			else{
				$("#btn-viewcods").addClass("hidden");	
			}
		};
		requestAjax('POST' , 'eventos/codigos_disponibles' , {'token' : token , 'id_suc' : user_idsuc , 'id_evento' : idEve} , callback_success);
		idEveSelect = idEve;
	}
}
var loadDataEventos = function(idsuc){
	if(idsuc != idSucSelect){
		var callback_success = function(data){
			if(data.data.length > 0){
				var inputSelectEve = document.getElementById("input-select-eve");
				var dataEve = [];
				$.each(data.data , function(i , v){
					dataEve.push({'id' : v.id_evento , 'desc' : v.nombre_corto});
				});
				select.init(inputSelectEve , dataEve , true , '' , false , change_evento);
			}
			else{
				showToastr("La sucursal seleccionada no tiene eventos disponibles. Seleccione otra por favor." , "warning");
			}
		};
		requestAjax('POST' , 'eventos/listar_eventos' , {'token' : token , 'id_suc' : idsuc} , callback_success);
		idSucSelect = idsuc;
	}
}
var loadDataSucursales = function(){
	if($("#input-select-mes").siblings('.select').length == 0){
		var inputSelectSuc = document.getElementById("input-select-mes");
		/*var dataSuc = [];
		var callback_success = function(data){
			if(data.data.length > 0){
				$.each(data.data , function(i , v){
					dataSuc.push({id : v.id_suc , 'desc' : v.nom_suc});
				});
				select.init(inputSelectSuc , dataSuc , true , user_idsuc , true , change_sucursal);
			}
			else{
				console.log("no hay sucursales");
			}
		};
		requestAjax('POST' , 'eventos/listar_sucursales' , {'token' : token} , callback_success);*/
		select.init(inputSelectSuc , [{'id':1,'desc':'Enero'},{'id':2,'desc':'Febrero'},{'id':3,'desc':'Marzo'}] , false , '' , false , change_sucursal);
	}
};
var sendForm = function(){
	var txtNumCod = $("#txtNumCod").val().trim();
	if(txtNumCod == '' || isNaN(txtNumCod)){
		return;
	}
	else{
		if(parseInt(txtNumCod) > numCodDis){
			showToastr("La cantidad de códigos solicitados no puede ser mayor a las disponibles." , "warning");
			return
		}
	}
	var numCods = parseInt(txtNumCod);
	var callback_success = function(data){
		var numAsig = data.data.codigos_asignados;
		if(numAsig > 0){
			if(numAsig < numCods){
				showToastr("Sólo se activaron "+numAsig+" códigos para el evento." , "warning");
			}
			else{
				console.log();
				showToastr("Conforme. "+data.msg , "success");
			}
		}
		else{
			showToastr("Perdón. "+data.msg , "error");
		}
		var idAux = idEveSelect;
		idEveSelect = 0;
		showNumCodsEvento(idAux);
		$("#txtNumCod").val('')
						.parent().removeClass('is-dirty');
	}
	requestAjax('POST' , 'eventos/activar_codigos' , {'token' : token , 'id_suc' : user_idsuc , 'id_evento' : idEveSelect , 'cantidad_codigos' : numCods} , callback_success);
};
var clearForm = function(){
	$("#txtNumCod").parent().removeClass('is-dirty');
};
initEventos = function(){
	var cbSuccess = function(data){
		$("#section-content").html(data);
		if(!(typeof(componentHandler) == 'undefined')){
		  componentHandler.upgradeAllRegistered();
		}
		$("#chkChangeSuc").on('change' , toggleSelectSuc);
		loadDataEventos(user_idsuc);
		loadDataSucursales();
		toggleFormControls(true);
		$("#form-solicitud").on('submit' , function(e){
			e.preventDefault()
		});
		$("#form-solicitud").on('reset' , function(e){
			clearForm();
		});
		$("#btn-send").on('click' , sendForm);
		$("#btn-solicitar").on('click');
	};
	requestAjaxHtml('solicitar_cod_insc_eve' , cbSuccess);
};