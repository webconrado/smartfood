//ON PAGE INIT
myApp.onPageInit('pedido_detalhe', function (page) {
	$("#template_pedido_detalhe").load("templates/pedido_detalhe_template.html");
	$("#template_pedido_detalhe_header").load("templates/pedido_detalhe_header_template.html");
	check_token();
});
myApp.onPageAfterAnimation('pedido_detalhe', function (page) {
	pedido_detalhe_header();
	pedido_detalhe_ler();
});



//pedido detalhe ler
function pedido_detalhe_ler(){
	route = "/pedidos";
	id_pedido = mainView.url.split("id=")[1];
	$.ajax({
		type: "GET",
		url: webserviceURL+route+"/"+localStorage.token+"/"+id_pedido,
		data: stringData,
		success: success,
		error:error
	});
	function success(data,status){
		console.log(data);
		var template = $$('#template_pedido_detalhe').html();
		var compiledTemplate = Template7.compile(template);
		var html = compiledTemplate(data);
		document.getElementById("div_pedido_detalhe").innerHTML = html;
	}
	function error(data,status){
		myApp.alert(text_error);
	}
}

//pedido detalhe header
function pedido_detalhe_header(){
	route = "/pedidos_header";
	id_pedido = mainView.url.split("id=")[1];
	$.ajax({
		type: "GET",
		url: webserviceURL+route+"/"+localStorage.token+"/"+id_pedido,
		data: stringData,
		success: success,
		error:error
	});
	function success(data,status){
		console.log(data);
		var template = $$('#template_pedido_detalhe_header').html();
		var compiledTemplate = Template7.compile(template);
		var html = compiledTemplate(data);
		document.getElementById("div_pedido_detalhe_header").innerHTML = html;
	}
	function error(data,status){
		myApp.alert(text_error);
	}
}
