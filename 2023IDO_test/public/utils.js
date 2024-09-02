// 產生user id
function generateUserId() {
    return 'user_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// 取得user id
function getUserId() {
    let userId = getCookie('userId');
    if (!userId) {
        userId = generateUserId();
        setCookie('userId', userId, 365); // 存储一年
    }
    return userId;
}

// 設置 Cookie
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// 取得 Cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// 刪除 Cookie
function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}