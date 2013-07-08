/** GLOBAL VARS **/
var globalTimerCount=0;
var timerIntervalRefs = new Array();

/** PIE TIMER **/
function drawPieTimer(el_id, percent){
	$('div.timer#'+el_id).html(
		'<div class="percent"></div>'+
		'<div class="slice'+(percent > 50?' gt50"':'"')+'>'+
			'<div class="pie"></div>'+
			(percent > 50?'<div class="pie fill"></div>':'')+
		'</div>'
	);
	var deg = 360/100*percent;
	$('#'+el_id+' .slice .pie').css({
		'-moz-transform':'rotate('+deg+'deg)',
		'-webkit-transform':'rotate('+deg+'deg)',
		'-o-transform':'rotate('+deg+'deg)',
		'transform':'rotate('+deg+'deg)'
	});
	$('.percent').html(Math.round(percent)+'%');
}
function stopPieWatch(timerFinish, timerSeconds, timer_num, type){					
	var seconds = (timerFinish-(new Date().getTime()))/1000;				
	var el_id = 'pie_timer_'+timer_num;			
	if(seconds <= 0){
		if(type=='load'){
			drawPieTimer(el_id, 100);
		}else if(type=='unload'){
			drawPieTimer(el_id, 0);
		}					
		clearInterval(timerIntervalRefs[timer_num]);
		//calback();					
		//alert('Finished counting down from '+timerSeconds);
	}else{
		var percent = 0;
		if(type=='load'){
			percent = 100-((seconds/timerSeconds)*100);
		}else if(type=='unload'){
			percent = (seconds/timerSeconds)*100;
		}					
		drawPieTimer(el_id,percent);
	}
}

function makePieTimer(content_div, timerSecondsLeft, is_fill, load_type){				
	var timerDiv = jQuery('<div/>', {
		'id' : 'pie_timer_'+globalTimerCount,
		'class': 'timer'+ (is_fill ? ' fill' : ''),
		'html': '&nbsp;'		
	});	
	$(timerDiv).prependTo(content_div);

	var timerFinish = new Date().getTime()+(timerSecondsLeft*1000);
	timerIntervalRefs[globalTimerCount] = setInterval(
		'stopPieWatch('+timerFinish+','+timerSecondsLeft+','+globalTimerCount+',"'+load_type+'")'
		,50);
	globalTimerCount++;	
	return {timerEl:timerDiv, intervalRef:timerIntervalRefs[globalTimerCount-1]};			
}

//can be called direct
function makePieUnloadTimer(content_div, timerSecondsLeft, is_fill){
	is_fill = typeof is_fill !== 'undefined' ? is_fill : true;
	return makePieTimer(content_div, timerSecondsLeft, is_fill, 'unload');				
}
//can be called direct
function makePieLoadTimer(content_div, timerSecondsLeft, is_fill){
	is_fill = typeof is_fill !== 'undefined' ? is_fill : true;
	return makePieTimer(content_div, timerSecondsLeft, is_fill, 'load');				
}

//console.log(makePieUnloadTimer('#timers', 10));

/************** Line Timer ************************/
function drawLineLoader(el_id, percent){
	/*
	if( $('#'+el_id+' .line_loader').length==0 ){
		$('#'+el_id).html(					
			'<div class="line_loader">&nbsp;</div>'
			//+'<div style="clear:both;height:0px;">&nbsp;</div>'						
		);	
	}	
	*/						
	$('#'+el_id+' .line_loader').css({
		'width':percent+'%'								
	});
}
function stopLineWatch(timerFinish, timerSeconds, timer_num, type){					
	var seconds = (timerFinish-(new Date().getTime()))/1000;				
	var el_id = 'line_timer_'+timer_num;			
	if(seconds <= 0){
		if(type=='load'){
			drawLineLoader(el_id, 100);
		}else if(type=='unload'){
			drawLineLoader(el_id, 0);
		}					
		clearInterval(timerIntervalRefs[timer_num]);
		//$('#'+el_id).remove();					
		//calback();					
		//alert('Finished counting down from '+timerSeconds);
	}else{
		var percent = 0;
		if(type=='load'){
			percent = 100-((seconds/timerSeconds)*100);
		}else if(type=='unload'){
			percent = (seconds/timerSeconds)*100;
		}					
		drawLineLoader(el_id,percent);
	}
}
function makeLineTimer(content_div, timerSecondsLeft, load_type){				
	var timerDiv = jQuery('<div/>', {
		'id' : 'line_timer_'+globalTimerCount,
		'class': 'line_timer_holder',
		'html': '<div class="line_loader">&nbsp;</div>'			
	});	
	$(timerDiv).appendTo(content_div);

	var timerFinish = new Date().getTime()+(timerSecondsLeft*1000);
	timerIntervalRefs[globalTimerCount] = setInterval(
		'stopLineWatch('+timerFinish+','+timerSecondsLeft+','+globalTimerCount+',"'+load_type+'")'
		,50);
	globalTimerCount++;	
	return {timerEl:timerDiv, intervalRef:timerIntervalRefs[globalTimerCount-1]};			
}

//can be called direct
function makeLineUnloadTimer(content_div, timerSecondsLeft){				
	return makeLineTimer(content_div, timerSecondsLeft, 'unload');				
}
//can be called direct
function makeLineLoadTimer(content_div, timerSecondsLeft){				
	return makeLineTimer(content_div, timerSecondsLeft, 'load');				
}


/*	@param: content_div - can be jQuery selection or element (to paste the timer inside it)
*	@param: timerSecondsLeft - time to count in seconds
*	@param: type - 'line' or 'pie' (default 'line')	
*	return js Object
*			timerEl - created timer element
			intervalRef - ref to timer repeat interval (ex. for force stop)
*	@autor: Peter Denev
*	@version: 1.0
*/
function makeUnloaderTimer(content_div, timerSecondsLeft, type){
	type = typeof type !== 'undefined' ? type : 'line';
	if(type=='line'){
		return makeLineUnloadTimer(content_div, timerSecondsLeft);
	}else if(type=='pie'){
		return makePieUnloadTimer(content_div, timerSecondsLeft); 
	}
		
}

//makeLineUnloadTimer('#top_div',15);