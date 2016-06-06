//IPHONE OPEN KEYBOARD FIX
function iphone_open_keyboard_fix(){
	document.activeElement.blur();
	var inputs = document.querySelectorAll('input');
	for(var i=0; i < inputs.length; i++) {
		inputs[i].blur();
	}
}

