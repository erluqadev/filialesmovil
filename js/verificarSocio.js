var sendVerificarSocio = function(){
	$("#msg-nodata").addClass('hidden');
	$("#msg-data").addClass('hidden');
	var nrodoc = $("#txtNroDoc").val();
	if(nrodoc+"".trim() == ''){
		$("#txtNroDoc").parent().addClass('is-invalid');
		return;
	}
	var callback_success = function(data){
		var datasocio = data.data;
		$("#msg-name").html(datasocio.Nombres);
		var tipoLabel;
		if(datasocio.estado == 1){
			tipoLabel="label-success";
		}
		else if(datasocio.estado == 2){
			tipoLabel="label-warning";
		}
		else if(datasocio.estado == 3){
			tipoLabel="label-danger";
		}
		$("#msg-status").html("<span class='label " + tipoLabel + "'>" + data.msg + "</span>");
		$("#msg-nodata").addClass('hidden');
		$("#msg-data").removeClass('hidden');
	};
	requestAjax('POST' , 'socios/datos_socio' , {'token' : token , 'nro_doc' : nrodoc} , callback_success);
};
var reset = function(e){
	$(this).find('input').parent().removeClass('is-dirty is-invalid');
	$("#msg-data").addClass('hidden');
	$("#msg-nodata").addClass('hidden');
};
var initVerificarSocio = function(){
	var cbSuccess = function(data){
		$("#section-content").html(data);
		if(!(typeof(componentHandler) == 'undefined')){
		  componentHandler.upgradeAllRegistered();
		}
		$("#btn-verificar").on('click' , sendVerificarSocio);
		$("#form-verif-socio").on('submit' , function(e){
			e.preventDefault();
		});
		$("#form-verif-socio").on('reset' , reset);
	};
	requestAjaxHtml('verificar_socio' , cbSuccess);
};