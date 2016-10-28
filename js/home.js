//ON PAGE INIT
myApp.onPageInit('home', function (page) {
	$("#template_home").load("templates/home_template.html");
	$("#template_usuario_home").load("templates/home_usuario_template.html");
	$("#template_pedidos").load("templates/pedidos_template.html");
	$("#template_sugestao").load("templates/sugestao_template.html");
	$("#template_carrinho").load("templates/carrinho_template.html");
	$$('#div_mapa_size').on('click', mapa_size);
	$$('#div_mapa_home').on('click', mapa_size);
	check_token();
	atualizar_regid();
	//DISABLE PANEL
	//myApp.params.swipePanel="left";	
	if(typeof socket === 'undefined'){
		socket_init();
	}

});
myApp.onPageAfterAnimation('home', function (page) {
	//localStorage.carrinho="[]";
	//localStorage.removeItem('id_restaurante');
	gps();
	usuario_home();
	restaurantes();
	//comentarios_restaurante();
	pedidos_home();
	pedidos_ler();
	sugestao();
	carrinho();
	//pagseguroSession();

	//Remove os vouchers
	carrinhoArray = JSON.parse(localStorage.carrinho);
	for(var i in carrinhoArray){
		if(carrinhoArray[i].id =="0"){
			carrinhoArray.splice(i,1);
		}
	}
	localStorage.carrinho = JSON.stringify(carrinhoArray);
	carrinho();


	if(mainView.history[mainView.history.length-2].split("?id").length>1){
	//if(mainView.history[mainView.history.length-2]!="index.html"){
		$("#home_back").show();
	}else{
		$("#home_back").hide();
	}

	/*mainView.hideNavbar();
	document.getElementById("page-content-home").style.paddingTop="0px";

	$$('#tab1').on('show', function () { mainView.hideNavbar(); document.getElementById("page-content-home").style.paddingTop="0px";});
	$$('#tab2').on('show', function () { mainView.showNavbar(); document.getElementById("page-content-home").style.paddingTop="44px";});
	$$('#tab3').on('show', function () { mainView.showNavbar(); document.getElementById("page-content-home").style.paddingTop="44px";});
	$$('#tab4').on('show', function () { mainView.showNavbar(); document.getElementById("page-content-home").style.paddingTop="44px";});
	$$('#tab5').on('show', function () { mainView.showNavbar(); document.getElementById("page-content-home").style.paddingTop="44px";});
	*/

	//Clear all intervals
	for (var i = 1; i < 99999; i++) clearInterval(i);

	//INTERVALO CHECK PEDIDOS
	//setInterval(function(){pedidos_ler()},5000);
	//setInterval(function(){pedidos_home()},5000);
	$$('#tab3').on('show',function(){ pedidos_ler() });

	/*setInterval(function(){
		if(document.getElementById("page-content-home").style.transform.split(",").length>1){
			offsetMap = document.getElementById("page-content-home").style.transform.split(",")[1].replace(" ","").replace("px","");
			console.log(offsetMap);
			$("#div_mapa_home").height(144+parseInt(offsetMap));
		}
	},500);*/

});


//Atualizar o regid (PUSH)
function atualizar_regid(){
	console.log("regid");
	if(localStorage.regid){
		route = "/usuario_gcm";
		var formData = {}
		formData.gcm = localStorage.regid; 
		if(formData.gcm){
			stringData = JSON.stringify(formData);
			$.ajax({
				type: "POST",
				url: webserviceURL+route+"/"+localStorage.token,
				data: stringData,
				success: success,
				error:error
			});
			function success(data,status){
				console.log(JSON.stringify(data));
			}
			function error(data,status){
				console.log(JSON.stringify(data));
			}
		}else{
			myApp.alert(text_error);
		}
	}
}

//usuario home
function usuario_home(){
	route = "/usuario";
	$.ajax({
		type: "GET",
		url: webserviceURL+route+"/"+localStorage.token,
		data: stringData,
		success: success,
		error:error
	});
	function success(data,status){
		console.log(data);
		var template = $$('#template_usuario_home').html();
		var compiledTemplate = Template7.compile(template);
		var html = compiledTemplate(data);
		document.getElementById("div_usuario_home").innerHTML = html;
		$$('.btn_foto_perfil').on('click', function(){action_sheet_camera()});
	}
	function error(data,status){
		myApp.alert(text_error);
	}
}

//Tamanho do mapa
function mapa_size(){
	if($("#div_mapa_home").height()==144){
		$("#div_mapa_home").height(320);
		myApp.destroyPullToRefresh(".pull-to-refresh-content");
		//$("#div_mapa_size").html('<i class="fa fa-2x fa-chevron-up"></i>');
	}else{
		myApp.initPullToRefresh(".pull-to-refresh-content");
		$("#div_mapa_home").height(144);
		//$("#div_mapa_size").html('<i class="fa fa-2x fa-chevron-down"></i>');
	}
}

//Mapa
function mapa(data){
	var data = data;
	map = new GMaps({
		div: '#div_mapa_home',
		lat: localStorage.lat,
		lng: localStorage.lng,
		zoom:10,
		disableDefaultUI: true
	});

	for(var i in data.text){
		var icon = new google.maps.MarkerImage(
			data.text[i].imagem, //url
			new google.maps.Size(32, 32), //size
			new google.maps.Point(16,16), //origin
			new google.maps.Point(0,0) //anchor 
		);
		map.addMarker({
			lat: data.text[i].lat,
			lng: data.text[i].lng,
			title: data.text[i].id,
			label: data.text[i].id,
			icon: icon,
			infoWindow: {
				content: '<a href="restaurante_detalhe.html?id='+data.text[i].id+'"><div class="img_tiny" style="float:left; margin-right:5px;"><img onerror="imgError(this);" src="'+data.text[i].imagem+'"></div><h3 style="margin:0px; display:inline-block;">'+data.text[i].titulo+'</h3></a>'
			}
			/*click: function(e) {
				console.log(e);
				mainView.router.loadPage('restaurante_detalhe.html?id='+e.title);
			}*/
		});
	}
	$("#div_mapa_size").show();
}

//Restaurantes
function restaurantes(){
	gps();
	var formData = new Object();
	formData.lat = localStorage.lat;
	formData.lng = localStorage.lng;
	stringData = JSON.stringify(formData);
	route = "/restaurantes";
	$.ajax({
		type: "POST",
		url: webserviceURL+route+"/"+localStorage.token,
		data: stringData,
		success: success,
		error:error
	});
	function success(data,status){
		var template = $$('#template_home').html();
		var compiledTemplate = Template7.compile(template);
		var html = compiledTemplate(data);
		//console.log("data:");
		//console.log(data);
		document.getElementById("div_home").innerHTML = html;
		mapa(data);
	}
	function error(data,status){
		myApp.alert(text_error);
	}
	var url = webserviceURL+route+"/"+localStorage.token;
	console.log("url:");
	console.log(url);
}
/*
//session pagseguro
function pagseguroSession(){
	route = "/session-pagseguro";
	$.ajax({
		type: "GET",
		url: APIPaymentsUrl+route+"/",
		data: stringData,
		success: success,
		error:error
	});
	function success(data,status){
		console.log("sessionId:");
		console.log(data);
		PagSeguroDirectPayment.setSessionId(data.sessionId)
	}
	function error(data,status){
		myApp.alert(text_error);
	}
}*/
/*function comentarios_restaurante(){
	route = "/restaurantes_comentarios";
	$.ajax({
		type: "POST",
		url: webserviceURL+route+"/"+localStorage.token+"/",
		data: stringData,
		success: success,
		error:error
	});
	function success(data,status){
		var template = $$('#template_home').html();
		var compiledTemplate = Template7.compile(template);
		var html = compiledTemplate(data);
		console.log("dataComments:");
		console.log(data);
	}
	function error(data,status){
		myApp.alert(text_error);
	}
	//var url = webserviceURL+route+"/"+localStorage.token;

}*/
//Restaurantes
function restaurantes_tipo(tipo){
	var formData = new Object();
	formData.lat = localStorage.lat;
	formData.lng = localStorage.lng;
	formData.tipo = tipo;
	stringData = JSON.stringify(formData);
	route = "/restaurantes_tipo";
	$.ajax({
		type: "POST",
		url: webserviceURL+route+"/"+localStorage.token,
		data: stringData,
		success: success,
		error:error
	});
	function success(data,status){
		console.log(data);
		var template = $$('#template_home').html();
		var compiledTemplate = Template7.compile(template);
		var html = compiledTemplate(data);
		document.getElementById("div_home").innerHTML = html;
		mapa(data);
	}
	function error(data,status){
		myApp.alert(text_error);
	}
}

//Restaurantes
function restaurantes_alfabetico(){
	var formData = new Object();
	formData.lat = localStorage.lat;
	formData.lng = localStorage.lng;
	stringData = JSON.stringify(formData);
	route = "/restaurantes_alfabetico";
	$.ajax({
		type: "POST",
		url: webserviceURL+route+"/"+localStorage.token,
		data: stringData,
		success: success,
		error:error
	});
	function success(data,status){
		console.log(data);
		var template = $$('#template_home').html();
		var compiledTemplate = Template7.compile(template);
		var html = compiledTemplate(data);
		document.getElementById("div_home").innerHTML = html;
		mapa(data);
	}
	function error(data,status){
		myApp.alert(text_error);
	}
}



//Restaurantes
function restaurantes_delivery(){
	var formData = new Object();
	formData.lat = localStorage.lat;
	formData.lng = localStorage.lng;
	stringData = JSON.stringify(formData);
	route = "/restaurantes_delivery";
	$.ajax({
		type: "POST",
		url: webserviceURL+route+"/"+localStorage.token,
		data: stringData,
		success: success,
		error:error
	});
	function success(data,status){
		console.log(data);
		var template = $$('#template_home').html();
		var compiledTemplate = Template7.compile(template);
		var html = compiledTemplate(data);
		document.getElementById("div_home").innerHTML = html;
		mapa(data);
	}
	function error(data,status){
		myApp.alert(text_error);
	}
}

//Restaurantes
function restaurantes_retirada(){
	var formData = new Object();
	formData.lat = localStorage.lat;
	formData.lng = localStorage.lng;
	stringData = JSON.stringify(formData);
	route = "/restaurantes_retirada";
	$.ajax({
		type: "POST",
		url: webserviceURL+route+"/"+localStorage.token,
		data: stringData,
		success: success,
		error:error
	});
	function success(data,status){
		console.log(data);
		var template = $$('#template_home').html();
		var compiledTemplate = Template7.compile(template);
		var html = compiledTemplate(data);
		document.getElementById("div_home").innerHTML = html;
		mapa(data);
	}
	function error(data,status){
		myApp.alert(text_error);
	}
}


//pedidos home
function pedidos_home(){
	route = "/pedidos/home";
	$.ajax({
		type: "GET",
		url: webserviceURL+route+"/"+localStorage.token,
		data: stringData,
		success: success,
		error:error
	});
	function success(data,status){
		console.log(data);
		if(data.text[0].total>0 && document.getElementById("pedidos_count")){
			document.getElementById("pedidos_count").innerHTML = data.text[0].total;	
		}
	}
	function error(data,status){
		console.log(data);
	}
}