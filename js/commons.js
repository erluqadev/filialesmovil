var requestAjax = function(rq_type , rq_url , rq_data , rq_callback){
	var fn_success = function(data , status , jqXHR){
		if(status == 'success'){
			rq_callback(data);
		}
	};
	var fn_error = function(jqXHR , status , error){
		showToastr(jqXHR.responseJSON.msg , 'error');
	};
	$.ajax({
		type 		: rq_type,
		url			: 'http://192.168.1.188/administracion/wsicg/'+rq_url,
		data 		: rq_data,
		dataType 	: 'json',
		success 	: fn_success,
		error 		: fn_error
	});
};
var requestAjaxHtml = function(rq_url , rq_callback){
	var fn_success = function(data , status , jqXHR){
		if(status == 'success'){
			rq_callback(data);
		}
	};
	var fn_error = function(jqXHR , status , error){
		showToastr(jqXHR.responseJSON.msg);
	};
	$.ajax({
		type 		: 'GET',
		url			: 'http://192.168.1.128/filialesmovil/'+rq_url+'.html',
		dataType 	: 'html',
		cache		: false,
		success 	: fn_success,
		error 		: fn_error
	});
};
var showToastr = function(msg , type = "error"){
	if(typeof msg == 'undefined' || msg == ''){
		msg = 'Disculpe, existió un error';
	}
	toastr[type](msg);

	toastr.options = {
	  "closeButton": true,
	  "debug": false,
	  "newestOnTop": false,
	  "progressBar": false,
	  "positionClass": "toast-bottom-full-width",
	  "preventDuplicates": false,
	  "onclick": null,
	  "showDuration": "300",
	  "hideDuration": "1000",
	  "timeOut": "5000",
	  "extendedTimeOut": "1000",
	  "showEasing": "swing",
	  "hideEasing": "linear",
	  "showMethod": "fadeIn",
	  "hideMethod": "fadeOut"
	}
};