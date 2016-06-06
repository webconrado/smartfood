//ON PAGE INIT
myApp.onPageInit('feedbacks', function (page) {
	$("#template_feedbacks").load("templates/feedbacks_template.html");
	$$('.btn_feedbacks_adicionar').on('click', feedbacks_adicionar);
	check_token();
});

//feedbacks adicionar
function feedbacks_adicionar(event){
	var formData = myApp.formToJSON("#form_feedbacks_adicionar");
	route = "/usuario_feedbacks_adicionar";
	console.log("feedback");
	if(formData.prazo.length>0 && formData.simplicidade.length>0 && formData.self_satisfacao.length>0 && formData.experiencia.length>0){
		stringData = JSON.stringify(formData);
		$.ajax({
			type: "POST",
			url: webserviceURL+route+"/"+localStorage.token,
			data: stringData,
			success: success,
			error:error
		});
		function success(data,status){
			$("#form_feedbacks_adicionar")[0].reset();
			mainView.router.loadPage('home.html');
			myApp.alert(data.text);
		}
		function error(data,status){
			feedbacks_ler();
			myApp.alert(text_error);
		}
	}else{
		myApp.alert(text_fields_error);
	}
}
