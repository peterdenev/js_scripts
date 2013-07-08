/* call function [with args] */
function argsCallback(func_obj, args){
	if(args!=null) func_obj(args); else func_obj();	
}
/*	@param: innerText - can be text or html
*	@param: colorType - name of color ( must have css fpr each color) (default = gray)
*	@param: showForMsec - how long will this message stay on the screen (in miliseconds).
						Default = 7000. For default - '' (empty string)
						If 0 (zero) -> stay until manual close from "X" button
*	@param: callback - function [or js code] to be done after alert is hidden 
*	@param: callback_args - object with arguments for callback call (ex. {param1:'data', para2:15}) 
*	return html element
*	@autor: Peter Denev
*	@version: 1.3
*/
var globalAlertCount = 0;
function showAlert(innerText, colorType, showForMsec, callback, callback_args){	
	//defaults null	
	colorType = typeof colorType !== 'undefined' ? colorType : 'gray';
	showForMsec = typeof showForMsec !== 'undefined' ? showForMsec : 7000;
	callback = typeof callback !== 'undefined' ? callback : function(){};
	//callback = typeof callback !== 'string' ? callback : function(){eval(callback);};
	callback = typeof callback !== 'function' ? function(){callback} : callback;
	callback_args = typeof callback_args !== 'undefined' ? callback_args : null;
	var doCallback = function(){
		argsCallback(callback, callback_args);
		//del hidded(old) alerts
		$('#alertDiv .anAlert').filter(function(){return $(this).css('display')=='none';}).remove();
	};
	//defaults empty
	colorType =	colorType!=='' ? colorType : 'gray';	
	showForMsec = showForMsec!=='' ? showForMsec : 7000; 
	var alert_class = 'anAlert '+colorType+'Alert';
	var alert_id = 'anAlert_'+globalAlertCount;	
	var show_hide_method = 'slide';
	var show_hide_speed = 500;
	
	var anAlert = jQuery('<div/>', {
		'class': alert_class,			
		'id': alert_id,
		'html': innerText//+'<div class="fakePadding">&nbsp;</div>'		
	});
	var clearDivSep = jQuery('<div/>', {
		'class': 'anAlert_clearBoth',
		'html': '&nbsp;'		
	});				
	$(clearDivSep).prependTo('#alertDiv');	//prependTo or appendTo	
	$(anAlert).prependTo('#alertDiv');	//prependTo or appendTo	
	if(showForMsec==0){
		$(anAlert).html('<span class="hideAlert" >&times;</span>'+$(anAlert).html());
		$('#'+alert_id+' .hideAlert').bind('click',function(){
			$(this).parent().hide(show_hide_method, { direction: 'right' }, show_hide_speed, doCallback);
		});		
		$(anAlert).show(show_hide_method, { direction: "right" }, show_hide_speed);		
	}else{		
		//$(anAlert).fadeIn().delay(showForMsec).fadeOut();//.detach();	
		var timerObj = 'undefined';
		if(typeof window.makeUnloaderTimer == 'function'){
			var total_time_show = parseInt(showForMsec)+parseInt(show_hide_speed);
			timerObj = makeUnloaderTimer(anAlert, total_time_show/1000, 'line'); //line or pie
		}	
		$(anAlert).show(show_hide_method, { direction: "right" }, show_hide_speed)
				  .delay(showForMsec)
				  .hide(show_hide_method, { direction: "right" }, show_hide_speed, doCallback);
		//on click make alert as showForMsec=0
		$(anAlert).click(function(){
			//stop animation and clear actions queue
			$(anAlert).stop(true,true);	
			//ramove animated timer if exist
			if(timerObj!='undefined'){
				clearInterval(timerObj['intervalRef']);
				$('#'+$(timerObj['timerEl']).attr('id')).hide();
				$('#'+$(timerObj['timerEl']).attr('id')).remove();
			}
			//set close button
			$(anAlert).html('<span class="hideAlert" >&times;</span>'+$(anAlert).html());			
			$('#'+alert_id+' .hideAlert').bind('click',function(){
				$(this).parent().hide(show_hide_method, { direction: 'right' }, show_hide_speed, doCallback);
			});	
			//remove click - no recursive actions :)			
			$(this).unbind('click');		
			$(anAlert).css('cursor','default');
		});
		$(anAlert).css('cursor','pointer');
	}
	

	globalAlertCount++;	
	return anAlert;
}
