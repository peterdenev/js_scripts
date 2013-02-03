// ==UserScript==
// @name       IMDB rate
// @namespace  http://browserbase.biz
// @version    0.1
// @description   IMDB rate in link hover
// @match      http://*/*
// @copyright  2012+, Peter Denev
// ==/UserScript==
//  IMDB LOAD RATE  
var all_a = document.getElementsByTagName('a');
for(a_i=0; a_i<all_a.length; a_i++){
    var a_href = all_a[a_i].getAttribute('href');
    if(a_href!=null && a_href.indexOf('http://www.imdb.com/title/')>=0){ 
        var this_a = all_a[a_i];
        var imdb_id = a_href.replace('http://www.imdb.com/title/','');                   
        this_a.setAttribute('title', 'Loading rate...');  
        
        //get rate
        var client2 = new XMLHttpRequest();
        client2.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            var data = this.responseText;
            this_a.setAttribute('title', data);			    
          }
        };
        client2.open('GET', 'http://browserbase.biz/API/extract/imdb_rate.php?id='+imdb_id);
        client2.send(); 
    }
}