//ON PAGE INIT
myApp.onPageInit('produto', function (page) {
	$("#template_produto").load("templates/produto_template.html");
	check_token();
});
myApp.onPageAfterAnimation('produto', function (page) {
	produto_detalhe();
	//Quantidade no carrinho
	carrinhoArray = JSON.parse(localStorage.carrinho);
	$("#carrinho_count").html(carrinhoArray.length);
});


//produtos detalhe
function produto_detalhe(){
	id_produto = mainView.url.split("id=")[1];
	route = "/produto_detalhe";
	$.ajax({
		type: "GET",
		url: webserviceURL+route+"/"+localStorage.token+"/"+id_produto,
		success: success,
		error:error
	});
	function success(data,status){
		console.log(data);
		var template = $$('#template_produto').html();
		var compiledTemplate = Template7.compile(template);
		var html = compiledTemplate(data);
		document.getElementById("div_produto").innerHTML = html;

		//document.getElementById("div_produto").style.backgroundImage = "url(http://smartfoodweb.com.br/admin/img/uploads/"+id_produto+"/"+id_produto+".jpg)";
		document.getElementById("div_produto").style.backgroundImage = "url('img/dummy480.png')";
		document.getElementById("div_produto").style.backgroundRepeat = "no-repeat";
		document.getElementById("div_produto").style.backgroundSize = "contain";

	}
	function error(data,status){
		myApp.alert(text_error);
	}
}
