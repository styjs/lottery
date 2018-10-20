/******************************
  author: koma
*******************************/
export function getAllCookies() {
    return wx.getStorageSync("cookie")
}

export function getCookie(key) {
    let r = new RegExp('(?:^|;+|\\s+)' + key + '=([^;]*)'),
        m = wx.getStorageSync("cookie").match(r);
    return (!m ? '' : m[1]);
}

export function setCookie(key, value) {
    let cookie = wx.getStorageSync("cookie");
    let val = getCookie(key);
    if(val) {
        wx.setStorageSync("cookie", cookie.replace(new RegExp('(^|;+|\\s+)(' + key + '=)([^;]*);', "i"),(match, g1, g2, g3) => {
            return g1 + g2 + value + ";";
        }));
    } else {
        wx.setStorageSync("cookie", (cookie || "") + key + '=' + escape(value) + ';');
    }
}

export function delCookie(key) {
    let value = getCookie(key);
    if(value) {
        let cookie = wx.getStorageSync("cookie");
        wx.setStorageSync("cookie", cookie.replace(new RegExp('(^|;+|\\s+)(' + key + '=)([^;]*);', "i"), (match, g1, g2, g3) => {
            return g1;
        }));
    }
}