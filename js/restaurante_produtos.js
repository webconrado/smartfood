//ON PAGE INIT
myApp.onPageInit('restaurante_produtos', function (page) {
	$("#template_restaurante_produtos").load("templates/restaurante_produtos_template.html");
	$("#template_info_restaurante_produtos").load("templates/restaurante_produtos_info_template.html");
	check_token();
});
myApp.onPageAfterAnimation('restaurante_produtos', function (page) {
	//Cabecalho e produtos
	//restaurante_produtos_detalhe_header();
	restaurante_produtos_produtos();

	//Quantidade no carrinho
	carrinho();
});


//restaurante_produtoss detalhe cabecalho
function restaurante_produtos_detalhe_header(){
	id_restaurante_produtos = mainView.url.split("id=")[1];
	//localStorage.id_restaurante_produtos = id_restaurante_produtos;
	route = "/restaurante";
	$.ajax({
		type: "GET",
		url: webserviceURL+route+"/"+localStorage.token+"/"+id_restaurante_produtos,
		success: success,
		error:error
	});
	function success(data,status){
		console.log(data);
		var template = $$('#template_info_restaurante_produtos').html();
		var compiledTemplate = Template7.compile(template);
		var html = compiledTemplate(data);
		document.getElementById("div_info_restaurante_produtos").innerHTML = html;
	}
	function error(data,status){
		myApp.alert(text_error);
	}
}

//restaurante_produtoss produtos
function restaurante_produtos_produtos(){
	id_restaurante_produtos = mainView.url.split("id=")[1];
	route = "/produtos_categoria";
	$.ajax({
		type: "GET",
		url: webserviceURL+route+"/"+localStorage.token+"/"+localStorage.id_restaurante+"/"+id_restaurante_produtos,
		success: success,
		error:error
	});
	function success(data,status){
		console.log(data);
		var template = $$('#template_restaurante_produtos').html();
		var compiledTemplate = Template7.compile(template);
		var html = compiledTemplate(data);
		document.getElementById("div_restaurante_produtos").innerHTML = html;
	}
	function error(data,status){
		myApp.alert(text_error);
	}
}

