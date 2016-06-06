//UPLOAD
function upload(fileURL,route){
	var success = function(response) {
		myApp.hidePreloader();
		console.log(JSON.stringify(response));
		if(mainView.url=="home.html"){
			usuario_home();
		}else{
			mainView.router.loadPage('home.html');
		}
		
	}
	var error = function (response) {
		console.log(JSON.stringify(response));
	}

	var fileUpload = new FileUploadOptions();
		fileUpload.fileKey = "file";
		fileUpload.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1)[0];
		fileUpload.mimeType = "text/plain";
	var params = {};
		params.token = localStorage.token;
		
		fileUpload.params = params;
	var ft = new FileTransfer();
	//	ft.onprogress = function(progressEvent) {
	//	if(progressEvent.lengthComputable) {
	//		console.log(progressEvent.loaded / progressEvent.total);
	//	}
	//	};
	myApp.showPreloader();
	ft.upload(fileURL, encodeURI(webserviceURL+route), success, error, fileUpload);
}
