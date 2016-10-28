//ON PAGE INIT
myApp.onPageInit('carrinho', function (page) {
	$("#template_carrinho").load("templates/carrinho_template.html");
	check_token();
});
myApp.onPageAfterAnimation('carrinho', function (page) {
	carrinho();
});

//Floating carrinho
function floating_carrinho(){
	mainView.router.loadPage('home.html');
	myApp.showTab("#tab4");
}

//Carrinho
function carrinho(){
	data = new Object();
	data.text = JSON.parse(localStorage.carrinho);
	total=0;
	for(i=0; i<data.text.length;i++){
		data.text[i].count=i;
		total+=parseFloat(data.text[i].valor*data.text[i].quantidade);
	}
	total = total.toFixed(2);
	if(document.getElementById("total")){
		document.getElementById("total").innerHTML = total;
	}

	if(document.getElementById("div_carrinho")){
		var template = $$('#template_carrinho').html();
		var compiledTemplate = Template7.compile(template);
		var html = compiledTemplate(data);
		document.getElementById("div_carrinho").innerHTML = html;
	}

	carrinhoArray = JSON.parse(localStorage.carrinho);

	itens_carrinho=0;
	if(carrinhoArray.length>0){

		for(var i in carrinhoArray){
			itens_carrinho+=parseInt(carrinhoArray[i].quantidade);
		}

		$("#carrinho_count").html(itens_carrinho);
		$("#floating_carrinho_count").html(itens_carrinho);
		$("#carrinho_count_self").html(itens_carrinho);
	}else{
		$("#carrinho_count").html("");
		$("#floating_carrinho_count").html("");
		$("#carrinho_count_self").html("");
	}

	if(data.text.length==0){
		$( "#btn_carrinho_finalizar" ).attr("disabled", true );
	}else{
		$( "#btn_carrinho_finalizar" ).attr("disabled", false );
	}
}

//Carrinho adicionar modal
function carrinho_adicionar_modal(){
	myApp.prompt('Qual a quantidade ?',
		function (value) {
			if(value>0){
				q = value;
				myApp.prompt('Alguma observação ?',
					function (value) {
						carrinho_adicionar($("#produto_adicionar_carrinho"),0,q,value);
					}
				);
			}
		}
	);
}
//Adicionar ao carrinho
function carrinho_adicionar(obj,voucher,quantidade,observacao){
	if(voucher==1){
		produto = new Object();
		produto.id = obj.id;
		produto.titulo = obj.titulo;
		produto.valor = obj.valor;
		produto.tipo = obj.tipo;
		produto.quantidade = 1;
	}else{
		if(obj.dataset){
			produto = new Object();
			produto.id = obj.dataset.id;
			produto.titulo = obj.dataset.titulo;
			produto.valor = obj.dataset.valor;
			produto.tipo = obj.dataset.tipo;
		}else{
			produto = new Object();
			produto.id = obj.data("id");
			produto.titulo = obj.data("titulo");
			produto.valor = obj.data("valor");
			produto.tipo = obj.data("tipo");
		}
		if(quantidade){
			produto.quantidade = quantidade;
		}else{
			produto.quantidade = 1;
		}
		if(observacao){
			produto.observacao = observacao;
		}else{
			produto.observacao = "";
		}
	}

	carrinhoArray = JSON.parse(localStorage.carrinho);

	//Regras do self service no carrinho
	count_mistura=0;
	count_guarnicao=0;
	carrinhoArray.forEach(function(element) {
		if(element.tipo){
			if(element.tipo=="MISTURA"){
				count_mistura++;
			}
			if(element.tipo=="GUARNICAO"){
				count_guarnicao++;
			}
		}
	});

	if(produto.tipo=="MISTURA" && count_mistura >= 2){
		myApp.alert("Apenas 2 misturas são permitidas");
	}else if(produto.tipo=="GUARNICAO" && count_guarnicao >= 3){
		myApp.alert("Apenas 3 guarnições são permitidas");
	}else{

		var novo=1;
		for(var i in carrinhoArray){
			if(carrinhoArray[i].id == produto.id){
				carrinhoArray[i].quantidade++;
				novo=0;
			}
		}

		if(novo==1){
			carrinhoArray.push(produto);
			localStorage.carrinho = JSON.stringify(carrinhoArray);
		}else{
			localStorage.carrinho = JSON.stringify(carrinhoArray);
		}

		//$("#carrinho_count").html(carrinhoArray.length);
		//$("#floating_carrinho_count").html(carrinhoArray.length);
		//$("#carrinho_count_self").html(carrinhoArray.length);

		myApp.addNotification({
			title: produto.titulo+' foi adicionado ao carrinho com sucesso!',
			hold:5000
		});

	}
	carrinho();
}

//Remover item do carrinho
function carrinho_remover(obj){
	myApp.confirm("Deseja mesmo remover o item do carrinho?",function(){
		carrinhoArray = JSON.parse(localStorage.carrinho);
		if(carrinhoArray[obj.dataset.count].quantidade>1){
			carrinhoArray[obj.dataset.count].quantidade--;
			localStorage.carrinho = JSON.stringify(carrinhoArray);
		}else{
			$("#div_carrinho").children().children()[obj.dataset.count].remove();
			carrinhoArray.splice(obj.dataset.count,1);
			localStorage.carrinho = JSON.stringify(carrinhoArray);
		}
		carrinho();
	})
}

//Limpar carrinho
function carrinho_limpar(force){
	if(force==1){
		localStorage.carrinho="[]";
		carrinho();
	}else{
		myApp.confirm("Deseja mesmo limpar o carrinho?",function(){
			localStorage.carrinho="[]";
			carrinho();
		})
	}

}
