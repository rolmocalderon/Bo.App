function setCookie(name,value) {
    var expires = "";
    var date = new Date();
    date.setTime(date.getTime() + (2*61*60*1000));
    expires = "; expires=" + date.toGMTString();
    let cookie = name + "=" + (value || "")  + expires + "; path=/";
    console.log(cookie)
    document.cookie = cookie;
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function removeCookie(){
    
}

  module.exports = {
    getCookie, setCookie, removeCookie
  }