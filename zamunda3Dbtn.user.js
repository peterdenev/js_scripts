// ==UserScript==
// @name       Sort by 3D (zamunda.net)
// @namespace  http://browserbase.biz
// @version    0.1
// @description Sort all torrents by 3D
// @match      http://zamunda.net/browse.php*
// @copyright  2012+, Peter Denev
// ==/UserScript==

//http://zamunda.net/browse.php?sort=14&type=desc

var btn_html = '<td class="bottom" style="padding-bottom: 2px;padding-left: 5px"><div align="right"><a class="catlink" href="/browse.php?sort=14&type=desc">Филми/3D</a></div></td>';

var trs = document.getElementsByTagName('form')[0].getElementsByTagName('tr');
var old_html_tr = trs[trs.length-4].innerHTML;
trs[trs.length-4].innerHTML = trs[trs.length-4].innerHTML + btn_html;
