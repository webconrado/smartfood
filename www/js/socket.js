//http://stackoverflow.com/questions/10058226/send-response-to-all-clients-except-sender-socket-io

function socket_init(){
	console.log("socket inicio");

	//Inicializa o socket
	socket = io("http://52.25.72.133:3000");

	//Pool de tokens
	socket.on('connect', function() { 
		console.log('connected');
		socket.emit('token',localStorage.token);
	});

	//Quando recebe um pedido, atualiza a lista de pedidos
	socket.on('pedido_cliente', function(token) { 
		console.log('pedido atualizado de '+token);
		if(mainView.url.split("?")[0]=="pedido_detalhe.html"){
			pedido_detalhe_header();
		}else if(mainView.url=="home.html"){
			pedidos_ler();
			pedidos_home();
		}
		myApp.addNotification({
			title: 'O status do seu pedido foi atualizado',
			text: 'Confira na sua aba de pedidos',
			hold:3000
		});
		
	});

	//socket.disconnect();
	console.log("socket fim");
}


