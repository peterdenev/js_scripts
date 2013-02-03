// ==UserScript==
// @name       BGN for DX.com
// @namespace  http://browserbase.biz/
// @version    0.1
// @description  bgn for dx.com
// @match      http*://*dx.com/*
// @copyright  2013+, Peter Denev
// ==/UserScript==

if (!String.prototype.trim) {
   //code for trim
   String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};
}


price_to_bg = function(){
    var prices, val_split, i, old_value, bg_val, del_val, dels, product_price, p_cur, old_value_clean, del_old_val;

    prices = document.getElementsByClassName('price');
    for(i=0; i<prices.length; i++){        
        old_value = prices[i].innerHTML;       
        bg_val = '';
        del_val = '';   
        
        dels = prices[i].getElementsByTagName('del');
        if(dels.length>0){            
            del_old_val = dels[0].innerHTML.trim(); 
            
            if(del_old_val.indexOf('$')!=-1){
                val_split = del_old_val.split('$');
                del_val = val_split[1].trim() * 1.43;
            }else if(del_old_val.indexOf('€')!=-1){
                val_split = del_old_val.split('€');
                del_val = val_split[1].trim() * 1.955;
            }            
            
            del_val = Math.ceil(del_val * 100) / 100;
            del_val = '<del>BGN '+del_val+'</del>';
            del_old_val = '<del>'+del_old_val+'</del>';
        }
        old_value_clean = old_value.replace(del_old_val,'');
        
        if(old_value_clean.indexOf('$')!=-1){
            val_split = old_value_clean.split('$');
            bg_val = val_split[1].trim() * 1.43;
        }else if(old_value_clean.indexOf('€')!=-1){
            val_split = old_value_clean.split('€');
            bg_val = val_split[1].trim() * 1.955;
        } 
        
        prices[i].setAttribute('title',old_value.trim());
        bg_val = Math.ceil(bg_val * 100) / 100;
        bg_val = 'BGN '+bg_val; 
        prices[i].innerHTML = del_val + bg_val;
    }
    
    product_price = document.getElementById('price');
    if(product_price!=null){
        old_value = product_price.innerHTML;
        p_cur = document.getElementsByClassName('cur_cy')[0].innerHTML;
        if(p_cur.indexOf('$')!=-1){            
            bg_val = old_value.trim() * 1.43;
        }else if(p_cur.indexOf('€')!=-1){           
            bg_val = old_value.trim() * 1.955;
        }
        
        dels = product_price.getElementsByTagName('del');
        if(dels.length>0){
            del_val = '<del>'+dels[0].innerHTML+'</del>';
        }
        
        product_price.setAttribute('title',old_value.trim());
        bg_val = Math.ceil(bg_val * 100) / 100;
        bg_val = 'BGN '+bg_val; 
        product_price.innerHTML = del_val + bg_val;
    }
        
}

setTimeout(price_to_bg,1000);