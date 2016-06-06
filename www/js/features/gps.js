//GPS to LocalStorage
function gps(){
	console.log("gps main");
	var watchID = navigator.geolocation.getCurrentPosition(success, error);
	function success(position) {
		//localStorage.setItem('gps',JSON.stringify(position));
		localStorage.setItem('lat',position.coords.latitude);
		localStorage.setItem('lng',position.coords.longitude);
	}
	function error(error) {
		console.log("gps error");
	}
}

