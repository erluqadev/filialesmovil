var select = function(){
	var _maxItemVisble = 5;
	var _html = document.getElementsByTagName("html")[0];

	var onClickHtml = function(e){
		var path = e.path;
		var clickInSelect = false;
		for(var i = 0 ; i <= path.length ; i++){
			if(path[i].className == "select"){
				clickInSelect = true;
				break;
			}
			else if(path[i].nodeName == "BODY"){
				break;
			}
		}
		if(!clickInSelect){
			var listSelect = document.getElementsByClassName("select");
			if(listSelect != 'undefined'){
				for(var i = 0 ; i < listSelect.length ; i++){
					hideList(listSelect[i].id);
				}
			}
		}
	};
	var hideList = function(idSelect){
		if(document.querySelector("#" + idSelect + " .input-search") != null){
			document.querySelector("#" + idSelect + " .input-search").value = '';
			var iconSearchSelect = document.querySelector("#" + idSelect + " .icon-search-select");
			iconSearchSelect.classList.remove('flaticon-delete');
			iconSearchSelect.classList.add('flaticon-tool');
		}
		document.querySelector("#" + idSelect).style.display = 'none';
	};
	var init = function(elem , data , search = false, itemDefault = '' , showDefault = true , callbackChangeItem ){
		var _select;
		var _search = false;
		var _inputSearch;
		var _iconInput;
		var _isDefaultSelect = false;

		var deleteList = function(){
			var items =  _select.getElementsByClassName("item");
			if(items.length > 0){
				var i = 0;
				while(typeof items[i] != 'undefined'){
					_select.removeChild(items[i]);
				}
			}
		}
		var loadListSelect = function(pattern){
			deleteList();
			var regExp = new RegExp(pattern , "i");
			var elemItemDefault = null;
			for(var i = 0 ; i < data.length ; i++){
				if(pattern == '' || data[i].desc.search(regExp) > -1){
					var item = data[i];
					var elemItem = document.createElement("div");
					elemItem.classList.add("item");
					elemItem.id = item.id;
					elemItem.innerHTML = item.desc;
					elemItem.addEventListener('click' , onClickSelectItem , true);
					_select.appendChild(elemItem);
					if(itemDefault != '' && _isDefaultSelect == false && itemDefault == elemItem.id){
						elemItemDefault = elemItem;
					}
				}
			}
			if(elemItemDefault !=null){
				elem.parentElement.classList.add("is-dirty");
				elem.value = elemItemDefault.innerHTML;
				elem.dataset.select = elemItemDefault.id;
				_isDefaultSelect = true;
			}
		};
		var onClickShowList = function(e){
			loadListSelect('');
			var select = this.nextElementSibling;
			select.style.display = "block";
			if(_search){
				select.childNodes[0].childNodes[0].childNodes[0].focus();
			}
		}
		var onClickSelectItem = function(){
			var desc = this.innerHTML;
			var id = this.id;
			elem.parentElement.classList.add("is-dirty");
			elem.value = desc;
			elem.dataset.select = id;
			hideList(this.parentElement.id);
			if(typeof callbackChangeItem == 'function'){
				callbackChangeItem(id , desc);
			}
			loadListSelect('');
		}
		var keyUpInputSearch = function(e){
			var pattern = this.value.trim();
			searchList(pattern);
		}
		var searchList = function(pattern){
			if(pattern == ''){
				if(_iconInput.classList.contains("flaticon-delete")){
					_iconInput.classList.remove("flaticon-delete");
					_iconInput.classList.add("flaticon-tool");
				}
			}
			else{
				if(_iconInput.classList.contains("flaticon-tool")){
					_iconInput.classList.remove("flaticon-tool");
					_iconInput.classList.add("flaticon-delete");
				}
			}
			loadListSelect(pattern)
		};
		var clearSearch = function(){
			if(_inputSearch.value.trim() != '' && _iconInput.classList.contains("flaticon-delete")){
				_inputSearch.value = '';
				_iconInput.classList.remove("flaticon-delete");
				_iconInput.classList.add("flaticon-tool");
				searchList();
				_inputSearch.focus();
			}
		};
		(function(){
			try{
				if(typeof elem == 'undefined'){
					throw new Error("El elemento pasado no existe");
				}
				if(typeof data != 'object'){
					throw new Error("Los Datos pasados son incorrectos");
				}
				var parentSelect = elem.parentElement;
				var nextSibling = elem.nextElementSibling;
				_select  = document.createElement("div");
				_select.classList.add("select");
				_select.id = "select-" + Math.random().toString(20).substring(10);
				parentSelect.insertBefore(_select , nextSibling);
				if(search){
					_search = true;
					var divContentSearch = document.createElement("div");
					divContentSearch.classList.add("content-search");
					var divSearch = document.createElement("div");
					divSearch.classList.add("content-input-search");
					_inputSearch = document.createElement("input");
					_inputSearch.type = "text"
					_inputSearch.classList.add("input-search");
					divSearch.appendChild(_inputSearch);
					_iconInput = document.createElement("span");
					_iconInput.classList.add("flaticon-tool");
					_iconInput.classList.add("icon-search-select");
					divSearch.appendChild(_iconInput);
					divContentSearch.appendChild(divSearch);
					_select.appendChild(divContentSearch);
					if(_search){
						_inputSearch.addEventListener('keyup' , keyUpInputSearch , true);
						_iconInput.addEventListener('click' , clearSearch , true);
					}
				}
				elem.addEventListener('click' , onClickShowList , true);
				if(itemDefault != '' && showDefault){
					loadListSelect('');
				}
			}
			catch(e){
				throw e;
			}
		})();
	};
	_html.addEventListener('click' , onClickHtml , true);
	return {
		init : init
	}
}