
/*	@param: innerText - can be text or html
*	@param: colorType - name of color ( must have css fpr each color) (default = gray)
*	@param: showForMsec - how long will this message stay on the screen (in miliseconds).
						Default = 7000. For default - '' (empty string)
						If 0 (zero) -> stay until manual close from "X" button
*	@autor: Peter Denev
*	@version: 1.2
*/
var globalAlertCount = 0;
function showAlert(innerText, colorType, showForMsec){	
	//defaults
	colorType =	colorType!='' ? colorType : 'gray';	
	showForMsec = showForMsec!='' ? showForMsec : '7000'; 
	var alert_class = 'anAlert '+colorType+'Alert';
	var alert_id = 'anAlert_'+globalAlertCount;	
	
	var anAlert = jQuery('<div/>', {
		'class': alert_class,			
		'id': alert_id,
		'html': innerText		
	});				
	$(anAlert).prependTo('#alertDiv');	//prependTo or appendTo	
	if(showForMsec=='0'){
		$(anAlert).html('<span class="hideAlert" onclick="javascript: this.parentNode.style.display=\'none\';">X</span>'+$(anAlert).html());
		$(anAlert).fadeIn();
	}else{		
		$(anAlert).fadeIn().delay(showForMsec).fadeOut();//.detach();
	}
	
	//** Try to delete element from dom after hide **//
	//$('#anAlert_'+globalAlertCount).delay('1000').remove();
	//anAlert.delete();
	//var parentAlertDiv = document.getElementById('alertDiv');
	//var childEl = document.getElementById('anAlert_'+globalAlertCount);
	//parentAlertDiv.removeChild(childEl);	
	
	globalAlertCount++;	
}





jQuery(document).ready(function($){ //fire on DOM ready
	/**** typical calls ****/
	var param = 'vars';
	showAlert('You can use '+param+' in code!', 'red', '15000');

	showAlert('"<i>HTML</i>" tags are allowed', 'yellow', '');

	showAlert('Press X to close this!','','0');

});

