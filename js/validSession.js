(function(){
	if(typeof Storage == 'undefined'){
		alert("Disculpe, debe actualizar su navegador.");
	}
	else{
		var pathName = location.pathname.trim();
		var regExp = new RegExp("filialesmovil/index.html$|filialesmovil/$");
		var isIndex = (pathName.search(regExp) > -1);
		if(sessionStorage.getItem("user_token") == null || sessionStorage.getItem("user_token") == 'undefined' || sessionStorage.getItem("user_token") == ''){
			if(!isIndex){
				location.href = "index.html";
			}
		}
		else{
			if(isIndex){
				location.href = "home.html";
			}
		}
	}
})();