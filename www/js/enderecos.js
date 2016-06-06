//ON PAGE INIT
myApp.onPageInit('enderecos', function (page) {
	$("#template_enderecos").load("templates/enderecos_template.html");
	$$('.btn_enderecos_adicionar').on('click', enderecos_adicionar);
	check_token();
	$('#cep').on('keyup', pesquisa_cep);
	//$('#cep').mask("99999-999");
	$("#endereco_li").hide();
	$("#numero_li").hide();
	$("#complemento_li").hide();
	$("#cidade_li").hide();
	$("#estado_li").hide();
	$("#bairro_li").hide();
});
myApp.onPageAfterAnimation('enderecos', function (page) {
	enderecos_ler();
});


//pesquisa cep
function pesquisa_cep(){
	cep = $("#cep").val();
	if(cep.length==8){
		$("#endereco_li").show();
		$("#numero_li").show();
		$("#complemento_li").show();
		$("#cidade_li").show();
		$("#estado_li").show();
		$("#bairro_li").show();
		cep.replace("-",""); 
		$("#cep").prop( "disabled", true);
		$.ajax({
			type: "GET",
			//url: "http://maps.googleapis.com/maps/api/geocode/json?address="+cep,
			url: "http://cep.correiocontrol.com.br/"+cep+".json",
			data: stringData,
			success: success,
			error:error
		});
		function success(data,status){
			$("#cep").prop( "disabled", false);
			if(data.logradouro.replace(/\s/g, '').length>0){
				$("#endereco").prop("disabled", true);
				$("#endereco").val(data.logradouro);
			}else{
				$("#endereco").prop( "disabled", false);
			}
			if(data.bairro.length>0){
				$("#bairro").prop("disabled", true);
				$("#bairro").val(data.bairro);
			}else{
				$("#bairro").prop( "disabled", false);
			}
			if(data.uf.length>0){
				$("#estado").prop("disabled", true);
				$("#estado").val(data.uf);
			}else{
				$("#estado").prop( "disabled", false);
			}
			if(data.localidade.length>0){
				$("#cidade").prop("disabled", true);
				$("#cidade").val(data.localidade);
			}else{
				$("#cidade").prop( "disabled", false);
			}
			console.log(data);
		}
		function error(data,status){
			$("#cep").prop( "disabled", false);
			$("#endereco").prop( "disabled", false);
			$("#bairro").prop( "disabled", false);
			$("#cidade").prop( "disabled", false);
			$("#estado").prop( "disabled", false);
			console.log(data);
		}
	}
}

//Enderecos ler
function enderecos_ler(){
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
		var template = $$('#template_enderecos').html();
		var compiledTemplate = Template7.compile(template);
		var html = compiledTemplate(data);
		document.getElementById("div_enderecos").innerHTML = html;

		if(data.text=="Erro"){
			localStorage.enderecos=0;
		}
	}
	function error(data,status){
		myApp.alert(text_error);
	}
}

//Enderecos_remover
function enderecos_remover(obj){
	myApp.confirm("Deseja mesmo remover o item do carrinho?",function(){
		route = "/usuario_enderecos_remover";
		if(obj.dataset.id>0){
			$.ajax({
				type: "GET",
				url: webserviceURL+route+"/"+localStorage.token+"/"+obj.dataset.id,
				success: success,
				error:error
			});
			function success(data,status){
				enderecos_ler();
			}
			function error(data,status){
				enderecos_ler();
				myApp.alert(text_error);
			}
		}else{
			myApp.alert(text_fields_error);
		}
	})
}


//Enderecos adicionar
function enderecos_adicionar(event){
	var formData = myApp.formToJSON("#form_enderecos_adicionar");
	route = "/usuario_enderecos_adicionar";
	if(formData.endereco.length>0 && formData.numero.length>0){
		stringData = JSON.stringify(formData);
		$.ajax({
			type: "POST",
			url: webserviceURL+route+"/"+localStorage.token,
			data: stringData,
			success: success,
			error:error
		});
		function success(data,status){
			$("#form_enderecos_adicionar")[0].reset();
			enderecos_ler();
			$("#endereco_li").hide();
			$("#numero_li").hide();
			$("#complemento_li").hide();
			$("#cidade_li").hide();
			$("#estado_li").hide();
			$("#bairro_li").hide();

			//Atualiza o localstorage de enderecos
			localStorage.enderecos=1;
			if(event.srcElement.dataset.novo==1){
				mainView.router.loadPage('pedido_finalizar.html');
			}else{
				mainView.router.loadPage('home.html');
			}
			myApp.alert(data.text);
		}
		function error(data,status){
			enderecos_ler();
			myApp.alert(text_error);
		}
	}else{
		myApp.alert(text_fields_error);
	}
}
