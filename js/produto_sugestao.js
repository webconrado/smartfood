//ON PAGE INIT
myApp.onPageInit('produto_sugestao', function (page) {
	$("#template_produto_sugestao").load("templates/produto_sugestao_template.html");
	check_token();
});
myApp.onPageAfterAnimation('produto_sugestao', function (page) {
	produto_sugestao_detalhe();
	//Quantidade no carrinho
	carrinhoArray = JSON.parse(localStorage.carrinho);
	$("#carrinho_count").html(carrinhoArray.length);
});

//produto_sugestaos detalhe
function produto_sugestao_detalhe(){
	id_produto_sugestao = mainView.url.split("id=")[1];
	route = "/produto_detalhe";
	$.ajax({
		type: "GET",
		url: webserviceURL+route+"/"+localStorage.token+"/"+id_produto_sugestao,
		success: success,
		error:error
	});
	function success(data,status){
		console.log(data);
		localStorage.id_restaurante = data.text[0].id_restaurante;
		var template = $$('#template_produto_sugestao').html();
		var compiledTemplate = Template7.compile(template);
		var html = compiledTemplate(data);
		document.getElementById("div_produto_sugestao").innerHTML = html;
		//$$('.btn_modal_reserva').on('click', myCalendar.open);

		//Calendario reserva
		myCalendar = myApp.calendar({
			input: '#data_reserva',
			onClose: modal_hora
		})

	}
	function error(data,status){
		myApp.alert(text_error);
	}
}

//Go to maps
function go_to_map(lat,lng){
	if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
		var addMap = 'maps:q='+lat+','+lng;
		window.open(addMap , '_system');
	} else {
		var addMap = 'geo:0,0?q='+lat+','+lng;
		window.open(addMap , '_system');
	}
}
