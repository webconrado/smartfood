//ON PAGE INIT
myApp.onPageInit('restaurante_detalhe', function (page) {
	$("#template_restaurante_detalhe").load("templates/restaurante_detalhe_template.html");
	$("#template_comentarios").load("templates/comentarios_template.html");
	check_token();
});
myApp.onPageAfterAnimation('restaurante_detalhe', function (page) {
	restaurante_detalhe();
});

//restaurante detalhe
function restaurante_detalhe(){
	id_restaurante = mainView.url.split("id=")[1];
	route = "/restaurantes";
	$.ajax({
		type: "GET",
		url: webserviceURL+route+"/"+localStorage.token+"/"+id_restaurante,
		success: success,
		error:error
	});
	function success(data,status){
		console.log(data);
		var template = $$('#template_restaurante_detalhe').html();
		var compiledTemplate = Template7.compile(template);
		var html = compiledTemplate(data);
		document.getElementById("div_restaurante_detalhe").innerHTML = html;
		
		//Calendario reserva
		myCalendar = myApp.calendar({
			input: '#data_reserva',
			onClose: modal_hora
		})

		document.getElementById("div_restaurante_detalhe").style.backgroundImage = "url(http://smartfoodweb.com.br/admin/img/uploads/"+id_restaurante+"/logo_"+id_restaurante+".jpg)";
		document.getElementById("div_restaurante_detalhe").style.backgroundRepeat = "no-repeat";
		document.getElementById("div_restaurante_detalhe").style.backgroundSize = "contain";

		map_detalhe = new GMaps({
			div: '#restaurante_detalhe_template_mapa',
			lat: data.text[0].lat,
			lng: data.text[0].lng,
			zoom:15,
			disableDefaultUI: true
		});

		
		map_detalhe.addMarker({
			lat: data.text[0].lat,
			lng: data.text[0].lng,
			title: data.text[0].id
		});


	}
	function error(data,status){
		myApp.alert(text_error);
	}
}
