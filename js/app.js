var token;
var user_idsuc;
var user_nomsuc;
var user_username;
var user_idusu;
(function(){
	if(typeof sessionStorage.getItem("token") != 'undefined' && sessionStorage.getItem("token") != ''){
		token = sessionStorage.getItem("user_token");
		user_idsuc = sessionStorage.getItem("user_idsuc");
		user_nomsuc = sessionStorage.getItem("user_nomsuc");
		user_username = sessionStorage.getItem("user_name");
		user_idusu = sessionStorage.getItem("user_id");
		$(".user-username").html(user_username);
		$(".user-sucursal").html(user_nomsuc);
	}
})();
