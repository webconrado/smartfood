//ON PAGE INIT
myApp.onPageInit('restaurante_comentarios', function (page) {
	$("#template_restaurante_detalhe").load("templates/restaurante_comentarios_detalhe.html");
	$("#template_comentarios").load("templates/comentarios_template.html");
	check_token();
});
myApp.onPageAfterAnimation('restaurante_comentarios', function (page) {
	restaurante_detalhe();
	comentarios();
});

//restaurante comentarios
function comentarios(){
	id_restaurante = mainView.url.split("id=")[1];
	route = "/comentarios";
	$.ajax({
		type: "GET",
		url: webserviceURL+route+"/"+localStorage.token+"/"+id_restaurante,
		success: success,
		error:error
	});
	function success(data,status){
		console.log(data);
		var template = $$('#template_comentarios').html();
		var compiledTemplate = Template7.compile(template);
		var html = compiledTemplate(data);
		document.getElementById("div_comentarios").innerHTML = html;
		$$('.btn_comentario_adicionar').on('click', comentario_adicionar);
	}
	function error(data,status){
		myApp.alert(text_error);
	}
}

function comentario_adicionar(){
	var formData = myApp.formToJSON("#form_comentario");
	id_restaurante = mainView.url.split("id=")[1];
	route = "/comentarios";
	if(formData.comentario.length>0){
		stringData = JSON.stringify(formData);
		$.ajax({
			type: "POST",
			url: webserviceURL+route+"/"+localStorage.token+"/"+id_restaurante,
			data: stringData,
			success: success,
			error:error
		});
		function success(data,status){
			console.log(data);
			if(data.id>0){
				comentarios();
				$("#caixa_comentario").val("");
			}
			myApp.alert(data.text);
		}
		function error(data,status){
			myApp.alert(text_error);
		}
	}else{
		myApp.alert(text_fields_error);
	}
}
