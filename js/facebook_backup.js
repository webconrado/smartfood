//FACEBOOK
myApp.onPageInit('facebook', function (page) {
	mainView.hideToolbar();
	mainView.showNavbar();
	//facebook();
})

//FACEBOOK LOGOUT
function fb_logout(){
	facebookConnectPlugin.logout(success, error);
	function success(response){
		console.log(response)
	}
	function error(response){
		console.log(response)
	}
}


//FACEBOOK CHECK STATUS
function facebook(){
	//myApp.showPreloader("Conectando ao facebook...");
	if(!window.cordova) {
		var appId = "399248013601234";
		facebookConnectPlugin.browserInit(appId);
	}
	facebookConnectPlugin.getLoginStatus(login_facebook, error);
	function success(response){
		console.log(response)
		if(response.status=="connected"){
			console.log("conectado");
			fb_info();
		}else{
			console.log("nao conectado");
			login_facebook();
		}
	}
	function error(response){
		console.log("erro facebook");
	}
}

//FACEBOOK LOGIN
var login_facebook = function(response){
	myApp.showPreloader("Efetuando login...");
	facebookConnectPlugin.login(["email","user_friends"], fb_info,error);
	function success(response){
		console.log(response);
		fb_info();
	}
	function error(response){
		console.log("erro login_facebook");
	}
}

//FACEBOOK USER INFO
var fb_info = function(response){
	//myApp.showPreloader("Carregando informações...");
	//facebookConnectPlugin.api( "me",["user_birthday","email","user_friends"],success,error);
	facebookConnectPlugin.api( "me",null,success,error);
	function success(response){
		console.log(response);
		info = JSON.stringify(response);
		userinfo = new Object();
		userinfo.fbid = response.id;
		userinfo.nome = response.first_name+" "+response.last_name;
		userinfo.fbemail = response.email;
		userinfo.apelido = response.email;
		userinfo.email = response.email;
		userinfo.senha = response.email;
		userinfo.imagem = "http://graph.facebook.com/"+response.id+"/picture?type=large";
		if(response.birthday){
			birthday = response.birthday.split("/");
			dia = birthday[0];
			mes = birthday[1];
			ano = birthday[2];
			userinfo.nascimento = ano+"-"+mes+"-"+dia;
		}
		save_facebook(userinfo);
	}
	function error(response){
		console.log("erro fb_info");
	}
}

//FACEBOOK FRIENDS INFO
function facebook_friends(userinfo){
	//myApp.showPreloader("Carregando amigos...");
	facebookConnectPlugin.api( "me/friends",null,success,error);
	function success(response){
		info = JSON.stringify(response);
		userinfo.friends=new Array();
		for(i=0; i<response.data.length;i++){
			userinfo.friends.push(response.data[i].id);
		}
		save_facebook_friends(userinfo);
	}
	function error(response){
		info = JSON.stringify(response);
		console.log(info);
	}
}

//SALVAR CADASTRO FACEBOOK
function save_facebook_friends(userinfo){
	url = webserviceURL;
	userinfo.user_id = localStorage.getItem("id");
	userinfo.action = "user_friends_facebook";
	$.ajax({
		type: "POST",
		url: url,
		data: userinfo,
		success: success,
		error:error
	});
	function success(data,status){
		//myApp.alert(data,'Atenção');
	}
	function error(data,status){
		myApp.alert('Ocorreu um erro ao salvar os amigos do facebook, tente novamente','Atenção');
	}
}

//SALVAR CADASTRO FACEBOOK
function save_facebook(userinfo){
	url = webserviceURL;
	userinfo.action = "user_login_facebook";
	$.ajax({
		type: "POST",
		url: url,
		data: userinfo,
		success: success,
		error:error
	});
	function success(data,status){
		if(testJSON(data)){
			data  = JSON.parse(data);
			console.log(data);
			localStorage.setItem('id',data[0].id);			
			if(data[0].imagem){
				localStorage.setItem('imagem',data[0].imagem);
			}else{
				localStorage.setItem('imagem','img/dummy.jpg');
			}
			localStorage.setItem('login_facebook','1');
			localStorage.setItem('nome_usuario',data[0].nome_usuario);
			localStorage.setItem('celular',data[0].celular);
			localStorage.setItem('email',data[0].email);
			localStorage.setItem('nascimento',data[0].nascimento);
			localStorage.setItem('facebook_id',data[0].facebook_id);
			if(data[0].id){
				mainView.router.loadPage('social_timeline.html');
				facebook_friends(userinfo);
			}else{
				mainView.router.loadPage('index.html');
			}
		}else{
			myApp.alert(data,'Atenção');
		}
	}
	function error(data,status){
		myApp.alert('Ocorreu um erro ao salvar o cadastro, tente novamente','Atenção');
	}
}

