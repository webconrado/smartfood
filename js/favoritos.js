//ON PAGE INIT
myApp.onPageInit('favoritos', function (page) {
	$("#template_favoritos").load("templates/favoritos_template.html");
	$("#template_info_favoritos").load("templates/favoritos_info_template.html");
	check_token();
});
myApp.onPageAfterAnimation('favoritos', function (page) {
	//Cabecalho e produtos
	favoritos_produtos();
});

//favoritoss produtos
function favoritos_produtos(){
	route = "/favoritos";
	$.ajax({
		type: "GET",
		url: webserviceURL+route+"/"+localStorage.token,
		success: success,
		error:error
	});
	function success(data,status){
		console.log(data);
		var template = $$('#template_favoritos').html();
		var compiledTemplate = Template7.compile(template);
		var html = compiledTemplate(data);
		document.getElementById("div_favoritos").innerHTML = html;
	}
	function error(data,status){
		myApp.alert(text_error);
	}
}

