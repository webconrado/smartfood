//APP ID
appId = "1147700068609865";

//FACEBOOK LOGOUT
function fb_logout(){
	facebookConnectPlugin.logout(success, error);
	function success(response){
		console.log(response);
	}
	function error(response){
		console.log(response);
	}
}

//FACEBOOK LOGIN
function facebook(){
	if(!window.cordova) {
		facebookConnectPlugin.browserInit(appId);
	}
	facebookConnectPlugin.getLoginStatus(success, error);
	function success(response){
		console.log(response);
		if(response.status=="connected"){
			fb_info();
		}else{
			login_facebook();
		}
	}
	function error(response){
		console.log(response);
	}
}

//FACEBOOK LOGIN
var login_facebook = function(response){
	facebookConnectPlugin.login(["email"], success,error);
	//facebookConnectPlugin.login(["user_birthday","email","user_friends"], fb_info,error);
	function success(response){
		console.log(response);
		fb_info();
	}
	function error(response){
		console.log(response);
	}
};

//FACEBOOK USER INFO
var fb_info = function(response){
	facebookConnectPlugin.api( "me?fields=id,email,name",null,success,error);
	function success(response){
		console.log(response);
		localStorage.setItem('facebook',JSON.stringify(response));
		//ACAO APOS SALVAR NO LOCALSTORAGE
		//cadastro_facebook();
		login_app_facebook(JSON.parse(localStorage.facebook).id);
	}
	function error(response){
		console.log(response);
	}
};


