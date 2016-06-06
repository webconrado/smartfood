//ON PAGE INIT
myApp.onPageInit("restaurante_self", function (page) {
	$("#template_restaurante_self").load("templates/restaurante_self_template.html");
	//$("#template_info_restaurante_self").load("templates/restaurante_self_info_template.html");
	check_token();
});
myApp.onPageAfterAnimation('restaurante_self', function (page) {
	//restaurante_detalhe_header_self();
	restaurante_produtos_self();
	//Quantidade no carrinho
	carrinho();
});


//Restaurantes detalhe cabecalho
function restaurante_detalhe_header_self(){
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
		var template = $$("#template_info_restaurante_self").html();
		var compiledTemplate = Template7.compile(template);
		var html = compiledTemplate(data);
		document.getElementById("div_info_restaurante_self").innerHTML = html;
	}
	function error(data,status){
		myApp.alert(text_error);
	}
}

//Restaurantes produtos
function restaurante_produtos_self(){
	id_restaurante = mainView.url.split("id=")[1];
	route = "/produtos_self";
	$.ajax({
		type: "GET",
		url: webserviceURL+route+"/"+localStorage.token+"/"+id_restaurante,
		success: success,
		error:error
	});
	function success(data,status){
		console.log(data);
		var template = $$("#template_restaurante_self").html();
		var compiledTemplate = Template7.compile(template);
		var html = compiledTemplate(data);
		document.getElementById("div_restaurante_self").innerHTML = html;

		/*
		$('.swiper-pagination').each(function(i){
			$(this).addClass('pagination'+i);
		});
		*/
		$('.swiper-container').each(function(i){
			$(this).addClass('swiper'+i);
			new Swiper('.swiper'+i, {
				pagination:'.swiper'+i+' .swiper-pagination',
				slidesPerView: 1,
				speed: 400
			});
		});
		/*
		var mySwiper = myApp.swiper('.swiper-container', {
			pagination:'.swiper-pagination',
			slidesPerView: 2,
			speed: 400
		});*/
	}
	function error(data,status){
		myApp.alert(text_error);
	}
}

