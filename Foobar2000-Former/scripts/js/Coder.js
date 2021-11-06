/*
* Base64Encode(str);
* Base64Decode(str);
* UnicodeToUtf8(str);
* Utf8ToUnicode(str);
* 
* 实例
* Base64Encode(UnicodeToUtf8(str));
* Utf8ToUnicode(Base64Decode(str));
* MD5(str); // 返回字符串
* md5(str); // 返回二进制字符串
*/

var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57,
  58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6,
  7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
  25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
  37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1,
  -1, -1);

function Base64Encode(str) {
    if (null == str) {
        return null;
    }
    var i = 0;
    var ret = "";
    var len = str.length;

    var c1, c2, c3;
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;

        if (i == len) {
            ret += base64EncodeChars.charAt(c1 >> 2);
            ret += base64EncodeChars.charAt((c1 & 0x3) << 4);
            ret += "==";
            break;
        }

        c2 = str.charCodeAt(i++);

        if (i == len) {
            ret += base64EncodeChars.charAt(c1 >> 2);
            ret += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            ret += base64EncodeChars.charAt((c2 & 0xF) << 2);
            ret += "=";
            break
        }

        c3 = str.charCodeAt(i++);
        ret += base64EncodeChars.charAt(c1 >> 2);
        ret += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        ret += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        ret += base64EncodeChars.charAt(c3 & 0x3F);
    }

    return ret;
}

function Base64Decode(str) {
    if (null == str) {
        return null;
    }
    var i = 0;
    var ret = "";
    var len = str.length;

    var c1, c2, c3, c4;
    while (i < len) {
        do {
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c1 == -1);

        if (c1 == -1)
            break;

        do {
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c2 == -1);

        if (c2 == -1)
            break;

        ret += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

        do {
            c3 = str.charCodeAt(i++) & 0xff;

            if (c3 == 61)
                return ret;

            c3 = base64DecodeChars[c3];
        } while (i < len && c3 == -1);

        if (c3 == -1)
            break;

        ret += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

        do {
            c4 = str.charCodeAt(i++) & 0xff;

            if (c4 == 61)
                return ret;

            c4 = base64DecodeChars[c4];
        } while (i < len && c4 == -1);

        if (c4 == -1)
            break;

        ret += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }

    return ret;
}

function UnicodeToUtf8(str) {
    if (null == str) {
        return null;
    }
    var strUni = String(str);
    var strUtf = String();
    var c0, c1, c2;
    for (var i = 0; i < strUni.length; i++) {
        var c0 = strUni.charCodeAt(i);
        if (c0 < 0x80) {
            strUtf += strUni.charAt(i);
        }
        else if (c0 < 0x800) {
            c1 = c0 & 0xff;
            c2 = (c0 >> 8) & 0xff;
            strUtf += String.fromCharCode(0xC0 | (c2 << 2) | ((c1 >> 6) & 0x3));
            strUtf += String.fromCharCode(0x80 | (c1 & 0x3F));
        }
        else {
            c1 = c0 & 0xff;
            c2 = (c0 >> 8) & 0xff;
            strUtf += String.fromCharCode(0xE0 | (c2 >> 4));
            strUtf += String.fromCharCode(0x80 | ((c2 << 2) & 0x3C) | ((c1 >> 6) & 0x3));
            strUtf += String.fromCharCode(0x80 | (c1 & 0x3F));
        }
    }
    return strUtf;
}

function Utf8ToUnicode(str) {
    if (null == str) {
        return null;
    }
    var i = 0;
    var ret = "";
    var len = str.length;
    var re = len;

    var c0, c1, c2; // the value of the unicode
    while (i < len) {
        c0 = str.charCodeAt(i);
        if ((c0 & 0x80) == 0) // 1 byte.  
        {
            if (re < 1) // not enough data  
                break;
            ret += String.fromCharCode(c0 & 0x7F);
            i++;
            re -= 1;
        }
        else if ((c0 & 0xE0) == 0xC0) // 2 bytes  
        {
            c1 = str.charCodeAt(i + 1);
            if (re < 2 || // not enough data  
                    (c1 & 0xC0) != 0x80) // invalid pattern  
            {
                break;
            }
            ret += String
            .fromCharCode(((c0 & 0x3F) << 6) | (c1 & 0x3F));
            i += 2;
            re -= 2;
        } else if ((c0 & 0xF0) == 0xE0) // 3 bytes  
        {
            c1 = str.charCodeAt(i + 1);
            c2 = str.charCodeAt(i + 2);
            if (re < 3 || // not enough data  
                    (c1 & 0xC0) != 0x80 || // invalid pattern  
                    (c2 & 0xC0) != 0x80) {
                break;
            }
            ret += String.fromCharCode(((c0 & 0x0F) << 12)
            | ((c1 & 0x3F) << 6) | (c2 & 0x3F));
            i += 3;
            re -= 3;
        } else
        // 4 or more bytes -- unsupported  
            break;
    }
    if (re != 0) { // bad UTF8 string.                  
        return "";
    }
    return ret;
}

var hex_chr = "0123456789abcdef";

function rhex(num) {
    var str = "";
    for (j = 0; j <= 3; j++)
        str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) +
    hex_chr.charAt((num >> (j * 8)) & 0x0F);
    return str;
}

function binl2str(input) {
    var output = ''
    for (var i = 0; i < input.length * 32; i += 8) {
        output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
    }
    return output;
}

function str2blks(str) {
    var nblk = ((str.length + 8) >> 6) + 1;
    var blks = new Array(nblk * 16);

    for (i = 0; i < nblk * 16; i++)
        blks[i] = 0;

    for (i = 0; i < str.length; i++)
        blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);

    blks[i >> 2] |= 0x80 << ((i % 4) * 8);
    blks[nblk * 16 - 2] = str.length * 8;
    return blks;
}

function add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
}

function rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
}

function cmn(q, a, b, x, s, t) {
    return add(rol(add(add(a, q), add(x, t)), s), b);
}

function ff(a, b, c, d, x, s, t) {
    return cmn((b & c) | ((~b) & d), a, b, x, s, t);
}

function gg(a, b, c, d, x, s, t) {
    return cmn((b & d) | (c & (~d)), a, b, x, s, t);
}

function hh(a, b, c, d, x, s, t) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
}

function ii(a, b, c, d, x, s, t) {
    return cmn(c ^ (b | (~d)), a, b, x, s, t);
}

function Digest(str) {
    x = str2blks(str);
    a = 1732584193;
    b = -271733879;
    c = -1732584194;
    d = 271733878;

    for (i = 0; i < x.length; i += 16) {
        olda = a;
        oldb = b;
        oldc = c;
        oldd = d;
        a = ff(a, b, c, d, x[i + 0], 7, -680876936);
        d = ff(d, a, b, c, x[i + 1], 12, -389564586);
        c = ff(c, d, a, b, x[i + 2], 17, 606105819);
        b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
        a = ff(a, b, c, d, x[i + 4], 7, -176418897);
        d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
        c = ff(c, d, a, b, x[i + 6], 17, -1473231341);
        b = ff(b, c, d, a, x[i + 7], 22, -45705983);
        a = ff(a, b, c, d, x[i + 8], 7, 1770035416);
        d = ff(d, a, b, c, x[i + 9], 12, -1958414417);
        c = ff(c, d, a, b, x[i + 10], 17, -42063);
        b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
        a = ff(a, b, c, d, x[i + 12], 7, 1804603682);
        d = ff(d, a, b, c, x[i + 13], 12, -40341101);
        c = ff(c, d, a, b, x[i + 14], 17, -1502002290);
        b = ff(b, c, d, a, x[i + 15], 22, 1236535329);

        a = gg(a, b, c, d, x[i + 1], 5, -165796510);
        d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
        c = gg(c, d, a, b, x[i + 11], 14, 643717713);
        b = gg(b, c, d, a, x[i + 0], 20, -373897302);
        a = gg(a, b, c, d, x[i + 5], 5, -701558691);
        d = gg(d, a, b, c, x[i + 10], 9, 38016083);
        c = gg(c, d, a, b, x[i + 15], 14, -660478335);
        b = gg(b, c, d, a, x[i + 4], 20, -405537848);
        a = gg(a, b, c, d, x[i + 9], 5, 568446438);
        d = gg(d, a, b, c, x[i + 14], 9, -1019803690);
        c = gg(c, d, a, b, x[i + 3], 14, -187363961);
        b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
        a = gg(a, b, c, d, x[i + 13], 5, -1444681467);
        d = gg(d, a, b, c, x[i + 2], 9, -51403784);
        c = gg(c, d, a, b, x[i + 7], 14, 1735328473);
        b = gg(b, c, d, a, x[i + 12], 20, -1926607734);

        a = hh(a, b, c, d, x[i + 5], 4, -378558);
        d = hh(d, a, b, c, x[i + 8], 11, -2022574463);
        c = hh(c, d, a, b, x[i + 11], 16, 1839030562);
        b = hh(b, c, d, a, x[i + 14], 23, -35309556);
        a = hh(a, b, c, d, x[i + 1], 4, -1530992060);
        d = hh(d, a, b, c, x[i + 4], 11, 1272893353);
        c = hh(c, d, a, b, x[i + 7], 16, -155497632);
        b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
        a = hh(a, b, c, d, x[i + 13], 4, 681279174);
        d = hh(d, a, b, c, x[i + 0], 11, -358537222);
        c = hh(c, d, a, b, x[i + 3], 16, -722521979);
        b = hh(b, c, d, a, x[i + 6], 23, 76029189);
        a = hh(a, b, c, d, x[i + 9], 4, -640364487);
        d = hh(d, a, b, c, x[i + 12], 11, -421815835);
        c = hh(c, d, a, b, x[i + 15], 16, 530742520);
        b = hh(b, c, d, a, x[i + 2], 23, -995338651);

        a = ii(a, b, c, d, x[i + 0], 6, -198630844);
        d = ii(d, a, b, c, x[i + 7], 10, 1126891415);
        c = ii(c, d, a, b, x[i + 14], 15, -1416354905);
        b = ii(b, c, d, a, x[i + 5], 21, -57434055);
        a = ii(a, b, c, d, x[i + 12], 6, 1700485571);
        d = ii(d, a, b, c, x[i + 3], 10, -1894986606);
        c = ii(c, d, a, b, x[i + 10], 15, -1051523);
        b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
        a = ii(a, b, c, d, x[i + 8], 6, 1873313359);
        d = ii(d, a, b, c, x[i + 15], 10, -30611744);
        c = ii(c, d, a, b, x[i + 6], 15, -1560198380);
        b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
        a = ii(a, b, c, d, x[i + 4], 6, -145523070);
        d = ii(d, a, b, c, x[i + 11], 10, -1120210379);
        c = ii(c, d, a, b, x[i + 2], 15, 718787259);
        b = ii(b, c, d, a, x[i + 9], 21, -343485551);
        a = add(a, olda);
        b = add(b, oldb);
        c = add(c, oldc);
        d = add(d, oldd);
    }
    return [a, b, c, d];
}

function MD5(str) {
    var arr = Digest(str);
    return rhex(arr[0]) + rhex(arr[1]) + rhex(arr[2]) + rhex(arr[3]);
}

function md5(str) {
    return binl2str(Digest(str));
}

function ByteArray(str) {
    var bytes = [];
    for (var i = 0; i < str.length; i++) {
        bytes.push(str.charCodeAt(i));
    }
    return bytes;
}

