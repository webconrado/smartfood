//ON PAGE INIT
myApp.onPageInit('reservas', function (page) {
	$("#template_reservas").load("templates/reservas_template.html");
	check_token();
});
myApp.onPageAfterAnimation('reservas', function (page) {
	reservas_ler();
});


//Reserva
function reserva(data,pessoas,restaurante){
	formData = {};
	formData.data = data;
	formData.npessoas = pessoas;
	formData.id_restaurante = restaurante;
	route = "/reservas";
	stringData = JSON.stringify(formData);
	console.log(stringData);
	$.ajax({
		type: "POST",
		data: stringData,
		url: webserviceURL+route+"/"+localStorage.token,
		success: success,
		error:error
	});
	function success(data,status){
		console.log(data);
		myApp.alert(data.text);
	}
	function error(data,status){
		myApp.alert(text_error);
	}
}

//Modal reserva
function modal_reserva(){
	myApp.prompt('Deseja reservar para quantas pessoas ?', 
		function (value) {
			if(value>0){
				$("#npessoas_reserva").val(value);
				myApp.confirm('Pode confirmar a reserva ?', 
					function () {
						//myApp.alert("Reserva confirmada:</br>"+$("#data_reserva").val()+" para "+$("#npessoas_reserva").val()+" pessoas");
						data = $("#data_reserva").val();
						hora = $("#hora_reserva").val();
						data = $("#data_reserva").val()+" "+$("#hora_reserva").val()+":00";
						pessoas = $("#npessoas_reserva").val();
						restaurante = localStorage.id_restaurante;
						reserva(data,pessoas,restaurante);
					}
				);	
			}else{
				modal_reserva();
			}
		}
	);	
}

//Modal hora
function modal_hora(){
	if(myCalendar.value>0){
		myPicker = myApp.picker({
			input: '#hora_reserva',
			cols: [
			   {
				 values: ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00']
			   }
			 ],
			onClose: modal_reserva
		});   
		myPicker.open();
	}
}

//reservas ler
function reservas_ler(){
	route = "/reservas_usuario";
	$.ajax({
		type: "GET",
		url: webserviceURL+route+"/"+localStorage.token,
		data: stringData,
		success: success,
		error:error
	});
	function success(data,status){
		console.log(data);
		var template = $$('#template_reservas').html();
		var compiledTemplate = Template7.compile(template);
		var html = compiledTemplate(data);
		document.getElementById("div_reservas").innerHTML = html;
	}
	function error(data,status){
		myApp.alert(text_error);
	}
}
