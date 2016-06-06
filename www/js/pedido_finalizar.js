//ON PAGE INIT
myApp.onPageInit('pedido_finalizar', function (page) {
	$("#template_pedido_finalizar").load("templates/pedido_finalizar_template.html");
	$("#template_pedido_finalizar_enderecos").load("templates/pedido_finalizar_enderecos_template.html");
	check_token();
	$$('.btn_pedido_finalizar').on('click', pedido_finalizar);
	$("#cpf_fiscal").mask('000.000.000-00', {reverse: true});
	//$('#troco').mask('000000000000000.00', {reverse: true});
	$("#li_troco").hide();
});
myApp.onPageAfterAnimation('pedido_finalizar', function (page) {
	pedido_finalizar_endereco();
	carrinho_finalizar();
});

//Show hide troco
function campo_troco(){
	if($("#pagamento").val()=="dinheiro"){
		$("#li_troco").show();
	}else{
		$("#li_troco").hide();
	}
}

//Carrinho finalizar
function carrinho_finalizar(){
	data = new Object();
	data.text = JSON.parse(localStorage.carrinho);
	total=0;
	for(i=0; i<data.text.length;i++){
		data.text[i].count=i;
		total+=parseFloat(data.text[i].valor*data.text[i].quantidade);
	}
	total = total.toFixed(2);

	var template = $$('#template_pedido_finalizar').html();
	var compiledTemplate = Template7.compile(template);
	var html = compiledTemplate(data);
	document.getElementById("div_pedido_finalizar").innerHTML = html;

	document.getElementById("total_pedido_finalizar").innerHTML = total;
}


//Checa se usuario quer adicionar novo endereço
function pedido_finalizar_endereco_novo(){
	if($('#div_pedido_finalizar_enderecos').val()=="novo"){
		mainView.router.loadPage('novo_endereco.html');
	}
}

//Enderecos ler
function pedido_finalizar_endereco(){
	route = "/usuario_enderecos";
	$.ajax({
		type: "GET",
		url: webserviceURL+route+"/"+localStorage.token,
		data: stringData,
		success: success,
		error:error
	});
	function success(data,status){
		console.log(data);
		var template = $$('#template_pedido_finalizar_enderecos').html();
		var compiledTemplate = Template7.compile(template);
		var html = compiledTemplate(data);
		document.getElementById("div_pedido_finalizar_enderecos").innerHTML = html;

		if(data.text=="Erro"){
			localStorage.enderecos=0;
		}
	}
	function error(data,status){
		myApp.alert(text_error);
	}
}


//Checar voucher
function pedido_finalizar_voucher(){
	if($("#voucher").val().length==5){
		$("#voucher").prop("readonly",true);
		voucher = $("#voucher").val();
		route = "/vouchers";
		$.ajax({
			type: "GET",
			url: webserviceURL+route+"/"+localStorage.token+"/"+localStorage.id_restaurante+"/"+voucher,
			data: stringData,
			success: success,
			error:error
		});
		function success(data,status){
			if(data.ok>0){
				
				console.log(data);

				//Calcula o total do carrinho
				carrinho_itens = JSON.parse(localStorage.carrinho);
				total=0;
				for(i=0; i<carrinho_itens.length;i++){
					carrinho_itens[i].count=i;
					total+=parseFloat(carrinho_itens[i].valor);
				}
				total = total.toFixed(2);
				
				//Aplica o voucher como produto desconto
				voucher = new Object();
				voucher.id = "0";
				voucher.titulo = "VOUCHER: "+data.text[0].desconto+"% de desconto";
				voucher.valor = (total*-1*(parseFloat(data.text[0].desconto)/100)).toFixed(2);
				voucher.tipo = "Voucher";
				
				carrinho_adicionar(voucher,1);
				carrinho_finalizar();

				myApp.alert("Voucher validado com sucesso!");

			}else{
				$("#voucher").prop("readonly",false);
				myApp.alert(data.text);
			}
		}
		function error(data,status){
			myApp.alert(text_error);
		}
	}
}


//Pedido finalizar
function pedido_finalizar(){
	var formData = myApp.formToJSON("#form_pedido_finalizar");
	formData.id_restaurante = localStorage.id_restaurante;
	formData.carrinho = JSON.parse(localStorage.carrinho);
	route = "/pedido_finalizar";
	if(JSON.parse(localStorage.carrinho).length>0 && localStorage.id_restaurante>0 && formData.pagamento.length>0 && formData.id_endereco.length>0){
		stringData = JSON.stringify(formData);
		$.ajax({
			type: "POST",
			url: webserviceURL+route+"/"+localStorage.token,
			data: stringData,
			success: success,
			error:error
		});
		function success(data,status){
			console.log(data);
			if(data.ok==1){
				mainView.router.loadPage('home.html');
				carrinho_limpar(1);
				myApp.alert("Pedido finalizado com sucesso!");
				socket.emit('pedido',localStorage.token);
			}else{
				myApp.alert(data.text);
			}
		}
		function error(data,status){
			myApp.alert(text_error);
		}
	}else{
		myApp.alert(text_fields_error);
	}
}


