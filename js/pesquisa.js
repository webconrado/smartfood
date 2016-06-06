//ON PAGE INIT
myApp.onPageInit('pesquisa', function (page) {
	$("#template_pesquisa").load("templates/pesquisa_template.html");
	check_token();
	//DISABLE PANEL
	//myApp.params.swipePanel="left";	
});
myApp.onPageAfterAnimation('pesquisa', function (page) {
	restaurantes_pesquisa();
});

function pesquisar(){
	if($("#searchbar_pesquisa").val().length>3){
		formData = new Object();
		formData.pesquisa = $("#searchbar_pesquisa").val();
		route = "/restaurantes_pesquisa";
		stringData = JSON.stringify(formData);
		$.ajax({
			type: "POST",
			url: webserviceURL+route+"/"+localStorage.token,
			data: stringData,
			success: success,
			error:error
		});
		function success(data,status){
			var template = $$('#template_pesquisa').html();
			var compiledTemplate = Template7.compile(template);
			var html = compiledTemplate(data);
			document.getElementById("div_pesquisa").innerHTML = html;
		}
		function error(data,status){
			myApp.alert(text_error);
		}
	}else{
		restaurantes_pesquisa();
	}
}


//Restaurantes
function restaurantes_pesquisa(){
	gps();
	var formData = new Object();
	formData.lat = localStorage.lat;
	formData.lng = localStorage.lng;
	stringData = JSON.stringify(formData);
	route = "/restaurantes";
	$.ajax({
		type: "POST",
		url: webserviceURL+route+"/"+localStorage.token,
		data: stringData,
		success: success,
		error:error
	});
	function success(data,status){
		console.log(data);
		var template = $$('#template_pesquisa').html();
		var compiledTemplate = Template7.compile(template);
		var html = compiledTemplate(data);
		document.getElementById("div_pesquisa").innerHTML = html;
		mapa(data);

		//PULL TO REFRESH
		myApp.pullToRefreshDone();
		var pullToRefresh = $$('.pull-to-refresh-content');
		pullToRefresh.on("refresh", function(e){
			console.log("refresh");
			if(loading) return;
			var loading=true;
			setTimeout(function(){
				loading=false;
				myApp.attachInfiniteScroll('.infinite-scroll');
				restaurantes();
				pedidos_pesquisa();
				pedidos_ler();
				sugestao();
				carrinho();
				gps();

			},2000);
		});

	}
	function error(data,status){
		myApp.alert(text_error);
	}
}

