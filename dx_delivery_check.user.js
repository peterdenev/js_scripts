// ==UserScript==
// @name       DX Delivery Check
// @version    0.1
// @description  enter something useful
// @match      http://intmail.183.com.cn/itemtrace_en.jsp*
// @copyright  2013+, Peter Denev
// ==/UserScript==

var split_url = (location.href).split('?n=');
if(split_url.length==2){
    var no_input =  document.getElementById('sql_ITEMNO');
	no_input.value = split_url[1];
}