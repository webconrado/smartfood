//ON PAGE INIT
myApp.onPageInit('pedidos', function (page) {
	$("#template_pedidos").load("templates/pedidos_template.html");
	check_token();
});
myApp.onPageAfterAnimation('pedidos', function (page) {
	pedidos_ler();
	//INTERVALO CHECK PEDIDOS
	setInterval(function(){pedidos_ler()},3000)
});


//pedidos ler
function pedidos_ler(){
	route = "/pedidos";
	$.ajax({
		type: "GET",
		url: webserviceURL+route+"/"+localStorage.token,
		data: stringData,
		success: success,
		error:error
	});
	function success(data,status){
		console.log(data);
		var template = $$('#template_pedidos').html();
		var compiledTemplate = Template7.compile(template);
		var html = compiledTemplate(data);
		document.getElementById("div_pedidos").innerHTML = html;

		if(data.feedback==0 && data.text[0].status==2){
			for (var i = 1; i < 99999; i++) clearInterval(i);
			mainView.router.loadPage('feedback.html');
			myApp.alert("Seu pedido primeiro pedido foi concluído, se possível responda nossa pesquisa de satisfação :)")
		}

		$$('.accordion-item').on('opened', function () {
			for (var i = 1; i < 99999; i++) clearInterval(i);
			setTimeout(function(){myApp.accordionClose('.accordion-item')},30000)
		}); 

		$$('.accordion-item').on('closed', function (e) {
			pedidos_ler();
			setInterval(function(){pedidos_ler()},3000)
		});  

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
				pedidos_ler();
			},2000);
		});
 

	}
	function error(data,status){
		//Clear all intervals
		for (var i = 1; i < 99999; i++) clearInterval(i);
		myApp.alert(text_error);
	}
}
