// ==UserScript==
// @name        SerialSearch
// @namespace   ala bala
// @description arena search
// @include     http://arenabg.com/torrents/
// @version     1
// ==/UserScript==

var listOfSerials = [ 'Breaking Bad', 'the walkin dead' ];

function visualiateResults( serials ) {
	var newSerialsTable = document.getElementById( 'newSerials' );
	
	if( !newSerialsTable ) { 
		newSerialsTable = document.createElement( 'table' );
		newSerialsTable.setAttribute( 'id', 'newSerials' );
		var currentSerial = null,
			serialLink = null,
			tr = null,
			td1 = null,
			td2 = null;
		for( var i=0; i<serials.length; i++ ) {
			currentSerial = serials[ i ];
			serialLink = document.createElement( 'a' );
			serialLink.setAttribute( 'href', 'http://arenabg.com/torrents/search:' + currentSerial + '/' );
			serialLink.setAttribute( 'id', currentSerial + ' link' );
			serialLink.innerHTML = currentSerial;
			tr = document.createElement( 'tr' );
			tr.setAttribute( 'id', currentSerial + ' row' );
			td1 = document.createElement( 'td' );
			td1.setAttribute( 'id', currentSerial + ' name' );
			td1.appendChild( serialLink );
			td2 = document.createElement( 'td' );
			td2.setAttribute( 'id', currentSerial + ' newCount' );
			td2.innerHTML = 0;
			tr.appendChild( td1 );
			tr.appendChild( td2 );
			newSerialsTable.appendChild( tr );
			serialLink = null;
			tr = null;
			td1 = null;
			td2 = null;
		}
		document.getElementById( 'main' ).getElementsByTagName( 'div' )[3].childNodes[1].appendChild( newSerialsTable );
	}
}

function updateCurrentSerialInfo( serialName ) {

	function getElementsByClassName( strClassName, obj ) {
		if ( obj.className == strClassName ) {
			aryClassElements[aryClassElements.length] = obj;
		}
		for ( var i = 0; i < obj.childNodes.length; i++ )
			getElementsByClassName( strClassName, obj.childNodes[i] );
	}
	
	function checkIsThisEpisode( torrentName ) {
		var episode = torrentName.split( '.' ),
			torrentStringPart = null,
			matchedEpisode = undefined;
			
		if( episode.length < 4 ) {
			episode = torrentName.split( ' ' );
		}

		for( var i=0; i<episode.length; i++ ) {
			torrentStringPart = episode[ i ].toLowerCase();
			if( torrentStringPart.match(/s[0-9]{2}e[0-9]{2}/) ) {
				matchedEpisode = torrentStringPart;
			}
		}
		
		return matchedEpisode;
	}
	
	unsafeWindow.$.ajaxSetup({
	   //url: location,
	   global: false,
	   type: "GET"
	  });
	  
	var htmlData = unsafeWindow.$.ajax({
		url: 'http://arenabg.com/torrents/search:' + serialName + '/',
		data: { },
		async: false,
		dataType: "html"
    }).responseText;

	var trs = unsafeWindow.$(htmlData).find('.torrents tr'),
		currentRow = null,
		episode = null,
		top10Results = [];

	for(var i=1;i<10;i++){
		currentRow = trs[i].getElementsByTagName('a')[1].innerHTML;
		
		/**
		episode = currentRow.split( '.' );
		**/
		episode = checkIsThisEpisode( currentRow );

		if( episode ) {
			top10Results.push( episode );
		}
		/**
		if( episode[2] && episode[2].toLowerCase().match(/s[0-9]{2}e[0-9]{2}/) ) {
			top10Results.push( episode[2].toLowerCase() );
		} else if( currentRow.split( ' ' )[2] && currentRow.split( ' ' )[2].toLowerCase().match(/s[0-9]{2}e[0-9]{2}/) ) {
			top10Results.push( currentRow.split( ' ' )[2].toLowerCase() );
		}
		**/
	}

	//console.log( top10Results );

	function createCookie( name, value, h ) {
		if( h ) {
			var date = new Date();
			date.setTime( date.getTime() + ( h * 60 * 60 * 1000 ) );
			var expires = "; expires=" + date.toGMTString();
		} else { 
			var expires = "";
		}
		document.cookie = name + "=" + value + expires + "; path=/";
	}

	function readCookie( name ) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) {
			var c = ca[i];
			while( c.charAt( 0 ) == ' ' ) {
				c = c.substring( 1, c.length );
			}
			if ( c.indexOf( nameEQ ) == 0) {
				return {
					episode: c.substring( nameEQ.length, c.length ),
					serial: c.split( '_' )[1]
				}
			}
		}
		return null;
	}

	function eraseCookie( name ) {
		createCookie( name, "", -1 );
	}

	function getCookieTop( number, serialName ){
		var cookie_top10_td = 'arenabgTop10_' + serialName +'_pd';
		var cookieTop = readCookie( cookie_top10_td + '_' + number ); //eval('(' + readCookie(cookie_top10_td) + ')');
		if( cookieTop === null ) {
			cookieTop = "";
		}
		return {
			episode: cookieTop.episode,
			serialName: cookieTop.serial
		}
	}

	function setCookieTops( newList, serialName ){
		var cookie_top10_td = 'arenabgTop10_' + serialName +'_pd';		
		for( var i=0; i < newList.length; i++ ){
			createCookie( cookie_top10_td + '_' + i, newList[ i ], 24 );	
		}	
	}

	function init( top10Results, serialName ){
		var top10TRs = top10Results,
			curTopsList = new Array(),	
			cookie_el = null,
			numberOfNewEpisodes = 0,
			cookieName = null;
			
		for( var i=0; i<top10TRs.length; i++ ){
			var cur_el = top10TRs[ i ];
			var found = false;
			cookieName = 'arenabgTop10_' + serialName + '_pd_' + i;
			for(var j=0;j<10;j++){				
				cookie_el = getCookieTop( j, serialName );
				if( cookie_el.episode === cur_el && cookie_el.serialName === serialName ){					
					found = true;
				}
			}
			console.log( found );
			if( !found ){
				numberOfNewEpisodes = numberOfNewEpisodes + 1;
			}
			//eraseCookie( cookieName );
		}
		
		updateNewEpisodes( serialName, numberOfNewEpisodes )
		
		setCookieTops( top10Results, serialName );
		
	}

	function updateNewEpisodes( serialName, count ) {
		var serialCounter = document.getElementById( serialName + ' newCount' );
		if( serialCounter ) {
			serialCounter.innerHTML = count;
		}
	}

	init( top10Results, serialName );
}

function doTheMagic( listOfSerials ) {
	var currentSerial = null;
	for( var i=0; i<listOfSerials.length; i++ ) {
		currentSerial = listOfSerials[ i ];
		updateCurrentSerialInfo( currentSerial );
	}
}

visualiateResults( listOfSerials );
doTheMagic( listOfSerials )

//setTimeout( init, 1000 );

/*
function loadXMLDoc(url)
{
if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
        console.log( xmlhttp.responseText );
    }
  }
xmlhttp.open("GET",url,true);
xmlhttp.send();
}
loadXMLDoc('http://arenabg.com/torrents/search:Breaking%20Bad/')
*/