console.log("Functions START");

//ONDEVICEREADY
function onLoad(){
	document.addEventListener("deviceready", onDeviceReady, false);
	if(!window.cordova){
		setTimeout(function(){
			onDeviceReady();
		},1000);
	}
}

//IMG ERROR
function imgError(image) {
	image.onerror = "";
	image.src = "img/dummy48.png";
	return true;
}

function ping(){
	route = "/ping";
	$.ajax({
		type: "GET",
		url: webserviceURL+route,
		success: success,
		error:error
	});
	function success(data,status){
		console.log(data);
	}
	function error(data,status){
		console.log(data);
	}
}

function onDeviceReady(){
	console.log("ondeviceready");
	//CUSTOM BACK BUTTON
	document.addEventListener("backbutton", function(){
		if(mainView.history[mainView.history.length-1]=="cadastro.html"){
			mainView.router.back();
		}else if(mainView.history[mainView.history.length-2]!="index.html"){
			mainView.router.back();
		}
	}, false);

	//CARREGA A SIDEBAR
	//$("#sidebar_left").load("sidebar_left.html");
	$("#sidebar_right").load("sidebar_right.html");

	//ON PAGE INIT
	myApp.onPageInit('home', function (page) {
		//LOGIN BUTTON
		$$('.home_btn_login').on('click', login);
		//LOGIN FACEBOOK BUTTON
		$$('.home_btn_login_facebook').on('click', facebook);
		//DISABLE PANEL
		//myApp.params.swipePanel=false;	
	});

	//AUTOLOGIN
	autologin();
	//LOGIN BUTTON
	$$('.home_btn_login').on('click', login);
	//LOGIN FACEBOOK BUTTON
	$$('.home_btn_login_facebook').on('click', facebook);

	//ATUALIZA GPS
	gps();

	//CARRINHO RESET
	localStorage.carrinho="[]";

	//WEBINTENT
	/*window.plugins.webintent.startActivity({
		action: window.plugins.webintent.ACTION_VIEW,
		url: 'geo:0,0?q=' + address, 
		function() {}, 
		function() {alert('Ocorreu um erro')}
	});*/



	//PUSH NOTIFICATION
	if(window.plugins){
		var pushNotification;
		pushNotification = window.plugins.pushNotification;
		function successHandler(data) {
			console.log(JSON.stringify(data));
		}
		function errorHandler(data) {
			console.log("error "+JSON.stringify(data));
		}
		pushNotification.register(
			successHandler,
			errorHandler,
			{
			"senderID":"512728736432",
			"ecb":"onNotification"
		});

		window.onNotification = function(data){
			console.log(JSON.stringify(data));

			//Atualiza o DB com o REGID do celular
			if(data.event=="registered"){
				if(!localStorage.regid){
					localStorage.regid = data.regid;
				}
			}

			//Trata caso seja uma mensagem
			if(data.event=="message"){
				//console.log("message "+data.payload.id_pedido);
				setTimeout(function(){
				//	console.log("timeout message "+data.payload.id_pedido);
					mainView.router.loadPage('pedido_detalhe.html?id='+data.payload.id_pedido);
				//	myApp.showTab('#tab3');
				},15000);
				//console.log("message end");
			}
		}
	}




}

//INICIALIZA O APP
var myApp = new Framework7({
	swipeout: false,
	allowDuplicateUrls:false,
	material:true,
	materialRipple:true,
	swipePanelThreshold:30,
	swipePanelActiveArea:60,
	swipeBackPage:false,
	swipeBackPageAnimateOpacity:false,
	swipeBackPageAnimateShadow:false,
	//swipePanel: 'left',
	swipePanel: false,
	modalTitle: text_warning,
	modalPreloaderTitle:text_loading,
	modalButtonCancel:text_cancel,
	onAjaxStart: function (xhr) {
		myApp.showIndicator();
		myApp.closePanel();
	},
	onAjaxComplete: function (xhr) {
		myApp.hideIndicator();
		myApp.hidePreloader();
		myApp.closePanel();
	}
});
var $$ = Dom7;
var mainView = myApp.addView('.view-main', {
	dynamicNavbar: false,
	showBarsOnPageScrollEnd:false
});

//WELCOME SCREEN
var welcomescreen_slides = [
	{
		id: 'slide0',
		picture: '<div class="tutorialicon"><i class="fa fa-mobile fa-6x"></i></div>',
		text: 'Faça seu pedido no conforto da sua casa!'
	},
	{
		id: 'slide1',
		picture: '<div class="tutorialicon"><i class="fa fa-cutlery fa-5x"></i></div>',
		text: 'Monte seu prato self-service online.'
	},
	{
		id: 'slide2',
		picture: '<div class="tutorialicon"><i class="fa fa-home fa-5x"></i></div>',
		text: 'Receba em casa ou busque no local.'
	},
	{
		id: 'slide3',
		picture: '<div class="tutorialicon"><i class="fa fa-map-marker fa-5x"></i></div>',
		text: 'Tá na dúvida? Veja quais são os mais pedidos da sua região!'
	},
	{
		id: 'slide4',
		picture: '<div class="tutorialicon"><i class="fa fa-clock-o fa-5x"></i></div>',
		text: 'Cansado de esperar? Faça sua reserva antes de sair de casa!'
	}
];
var options = {
	'bgcolor': '#FF3300',
	'fontcolor': '#fff'
}
if(localStorage.welcome==undefined){
	var welcomescreen = myApp.welcomescreen(welcomescreen_slides, options);
	localStorage.welcome=1;
}


console.log("Functions END");
