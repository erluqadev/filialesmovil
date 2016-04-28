var sendLogin = function(){
	$("#form-login input").parent().removeClass('is-invalid');
	var username = $("#txtUsername").val();
	var password = $("#txtPassword").val();
	if(username == ''){
		$("#txtUsername").parent().addClass('is-invalid');
		return;
	}
	if(password == ''){
		$("#txtPassword").parent().addClass('is-invalid');
		return;
	}
	var callback_success = function(data){
		sessionStorage.setItem("user_token" , data.data.token);
		sessionStorage.setItem("user_id" , data.data.id_usuario);
		sessionStorage.setItem("user_name" , data.data.nombres);
		sessionStorage.setItem("user_idsuc" , data.data.id_suc);
		sessionStorage.setItem("user_nomsuc" , data.data.nom_suc);
		location.href = "home.html";
	};
	requestAjax('POST' , 'user/login' , {'username' : username , 'password' : password , 'type' : 1} , callback_success);
};
var reset = function(e){
	$(this).find('input').parent().removeClass('is-dirty is-invalid');
}
$(function(){
	$("#form-login").on('submit' , function(e){
		e.preventDefault();
	});
	$("#form-login").on('reset' , reset);
	$("#btn-login").on('click' , sendLogin);
});