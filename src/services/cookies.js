function createCookie(name,value) {
    var expires = "";
    var date = new Date();
    date.setTime(date.getTime()+(8*60*60*1000));
    expires = "; expires="+date.toGMTString();
    document.cookie = name+"="+value+expires+"; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return JSON.parse(c.substring(nameEQ.length,c.length));
    }
    return null;
}

function removeCookie(name){
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

  module.exports = {
    getCookie, removeCookie, createCookie
  }