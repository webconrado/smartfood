//ON PAGE INIT
myApp.onPageInit('foto_perfil', function (page) {
	$("#template_foto_perfil").load("templates/foto_perfil_template.html");
	check_token();
});
myApp.onPageAfterAnimation('foto_perfil', function (page) {
	foto_perfil();
});

//usuario foto_perfil
function foto_perfil(){
	route = "/usuario";
	$.ajax({
		type: "GET",
		url: webserviceURL+route+"/"+localStorage.token,
		data: stringData,
		success: success,
		error:error
	});
	function success(data,status){
		console.log(data);
		var template = $$('#template_foto_perfil').html();
		var compiledTemplate = Template7.compile(template);
		var html = compiledTemplate(data);
		document.getElementById("div_foto_perfil").innerHTML = html;
		$$('.btn_foto_perfil').on('click', function(){action_sheet_camera()});
	}
	function error(data,status){
		myApp.alert(text_error);
	}
}
