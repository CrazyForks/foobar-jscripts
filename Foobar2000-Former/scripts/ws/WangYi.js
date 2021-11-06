if (WScript.Arguments.length != 2) WScript.Quit();

var get = 'http://music.163.com/api/search/get';
var detail = 'http://music.163.com/api/song/detail';
var lyric = 'http://music.163.com/api/song/lyric';

var header = {
    'Referer': 'http://music.163.com/',
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36'
    //'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.152 Safari/537.36'
};

function Search(title, limit, type, offset, filePath) {
    var WinHttp = new oWinHttp();
    var content = 's=' + title + '&limit=' + limit + '&type=' + type + '&offset=' + offset;

    var filedata = '<asx version="3.0">\r\n\r\n';

    WinHttp.Error = function () {
        WinHttp = null;
    }
    WinHttp.Ready = function () {

        try {
            // SaveAs(this.request.ResponseText, 'D:\\json.txt');
            var data = json(this.request.ResponseText);
            var songs = data.result.songs;

            for (var i = 0; i < songs.length; i++) {
                content = 'id=' + songs[i].id + '&ids=%5B' + songs[i].id + '%5D';

                WinHttp.Ready = function () {
                    try {
                        // SaveAs(this.request.ResponseText, 'D:\\json'+ i + '.txt');
                        var info = json(this.request.ResponseText);

                        if (info.songs && info.songs.length > 0) {
                            var song = info.songs[0];

                            if (song.mp3Url && song.mp3Url != '') {
                                filedata = filedata + '<Entry>\r\n'
                                    + '<Title>' + song.name + '</Title>\r\n';

                                if (song.artists && song.artists.length > 0) {
                                    filedata = filedata + '<Author>' + song.artists[0].name + '</Author>\r\n'
                                }
                                // low quality
                                var songUrl = song.mp3Url;
                                var host = 'http://m1.music.126.net';

                                if (song.hMusic && song.hMusic.dfsId != '') {
                                    // high quality
                                    var encrypted_id = Base64Encode(UnicodeToUtf8(EncryptId(song.hMusic.dfsId)));
                                    encrypted_id = encrypted_id.replace('/', '_');
                                    encrypted_id = encrypted_id.replace('+', '-');

                                    // url = host + encrypted_id + dfsId
                                    songUrl = host + '/' + encrypted_id + '/' + song.hMusic.dfsId + '.mp3';
                                } else if (song.mMusic && song.mMusic.dfsId != '') {
                                    // medium quality
                                    var encrypted_id = Base64Encode(UnicodeToUtf8(EncryptId(song.mMusic.dfsId)));
                                    encrypted_id = encrypted_id.replace('/', '_');
                                    encrypted_id = encrypted_id.replace('+', '-');

                                    // url = host + encrypted_id + dfsId
                                    songUrl = host + '/' + encrypted_id + '/' + song.mMusic.dfsId + '.mp3';
                                }
                                filedata = filedata + '<Ref href="' + songUrl + '"/>\r\n'
                                //+ '<BANNE href="' + song.album.picUrl + '">\r\n'
                                + '</Entry>\r\n\r\n';
                            }
                        }
                    } catch (e) { }
                }
                WinHttp.Set(WinHttp, 'POST', detail, false, header, content);
            }
        } catch (e) { }
    }
    WinHttp.Set(WinHttp, 'POST', get, false, header, content);

    WinHttp = null;
    filedata = filedata + "</asx>";
    SaveAs(filedata, filePath);
}

function SearchLyric(artist, title, tran, limit, offset, filePath) {
    var WinHttp = new oWinHttp();
    var content = 's=' + title + '&limit=' + limit + '&type=1' + '&offset=' + offset;

    WinHttp.Error = function () {
        WinHttp = null;
    }
    WinHttp.Ready = function () {
        try {
            var data = json(this.request.ResponseText);
            var songs = data.result.songs;
            var id = null;

            for (var i = 0; i < songs.length; i++) {
                if (songs[i].name == title) {
                    var artists = songs[i].artists;
                    for (var j = 0; j < artists.length; j++) {
                        if (artists[j].name == artist) {
                            id = songs[i].id;
                        }
                    }
                }
            }
            if (!id) {
                WinHttp = null;
                return;
            }
            content = 'os=pc&id=' + id + '&lv=-1&kv=-1&tv=-1';

            WinHttp.Ready = function () {
                try {
                    var lyrics = json(this.request.ResponseText);
                    var lrc = '';
                    var tlrc = '';

                    if (tran) {
                        if (lyrics.lrc && lyrics.lrc.lyric) {
                            lrc = lyrics.lrc.lyric;
                        }
                        if (lyrics.tlyric && lyrics.tlyric.lyric) {
                            tlrc = lyrics.tlyric.lyric;
                        }
                    } else {
                        if (lyrics.lrc && lyrics.lrc.lyric) {
                            lrc = lyrics.lrc.lyric;
                        } else if (lyrics.tlyric && lyrics.tlyric.lyric) {
                            tlrc = lyrics.tlyric.lyric;
                        }
                    }
                    if (tlrc.length > 0) {
                        SaveAs(tlrc, filePath + '.tlrc');
                    }
                    if (lrc.length > 0) {
                        var timeArr = lrc.match(/\[[0-9]*:[0-9]*\.[0-9]*\]/g);
                        SaveAs(lrc, timeArr ? (filePath + '.lrc') : (filePath + '.txt'));
                    }
                } catch (e) { }
                WinHttp = null;
            }
            WinHttp.Set(WinHttp, 'POST', lyric, false, header, content);
        } catch (e) { }
    }
    WinHttp.Set(WinHttp, 'POST', get, false, header, content);
}

function EncryptId(id) {
    var byte1 = ByteArray('3go8&$8*3*3h0k(2)2');
    var byte1_len = byte1.length;
    var byte2 = ByteArray(id.toString());

    for (var i = 0; i < byte2.length; i++) {
        byte2[i] = byte2[i] ^ byte1[i % byte1_len];
        byte2[i] = String.fromCharCode(byte2[i]);

    }
    var str = byte2.join('');
    var res = md5(str);
    return res;
}

function SaveAs(str, file) {
    var ado = new ActiveXObject("ADODB.Stream");
    ado.Type = 2;
    ado.mode = 3;
    ado.Charset = "UTF-8";
    ado.open();
    try {
        ado.WriteText(str);
        ado.SaveToFile(file);
    } catch (e) {
        //WScript.Echo(e.message);
    }
    ado.flush();
    ado.Close();
}

// WinHttp
oWinHttp = function () {
    this.request = null;

    this.Init = function () {
        try {
            this.request = new ActiveXObject("WinHttp.WinHttpRequest.5.1");
            return;
        }
        catch (e) {
            this.request = null;
        }
    }
    this.Init();

    // 清空cache
    this.AddTimeStamp = function (url) {
        // '?'为首, '&'跟随
        if (url.indexOf('?') >= 0)
            return url + '&t=' + (new Date()).valueOf();
        else
            return url + '?t=' + (new Date()).valueOf();
    }

    this.Callback = function () {
        if (this.request.status == 200) {
            if (typeof (this.Ready) != 'undefined')
                this.Ready();
        }
        else {
            if (typeof (this.Error) == 'function') {
                this.Error();
            }
        }
    }

    this.Set = function (WinHttp, type, url, async, header, content) {
        if (!this.request) {
            return false;
        }

        var new_url = this.AddTimeStamp(url);

        this.request.open(type, new_url, async);
        // 请求报头设置
        if (typeof (header) == 'object') {
            for (var property in header) {
                if (Object.prototype.hasOwnProperty.call(header, property)) {
                    this.request.setRequestHeader(property, header[property]);
                }
            }
        }

        try {
            content = typeof (content) == 'undefined' ? null : content;
            this.request.send(content);
            if (async) {
                this.request.WaitForResponse();
                this.Callback();
            }
            else {
                this.Callback();
            }
        }
        catch (e) {
            if (typeof (this.Error) == 'function') {
                this.Error();
            }
            return false;
        }
    }
}

HashMap = function () {

    this.Set = function (key, value) {
        this[key] = value;
    }

    this.Get = function (key) {
        return this[key];
    }

    this.Contains = function (key) {
        return this.Get(key) == null ? false : true;
    }

    this.Remove = function (key) {
        delete this[key];
    }
}

// json
function json(text) {
    try {
        var data = JSON.parse(text);
        return data;
    }
    catch (e) {
        return null;
    }
}

if (typeof JSON !== 'object') { JSON = {}; }
(function () {
    'use strict';
    function f(n) {
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {
        Date.prototype.toJSON = function (key) {
            return isFinite(this.valueOf()) ? (this.getUTCFullYear() + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate()) + 'T' +
                f(this.getUTCHours()) + ':' +
                f(this.getUTCMinutes()) + ':' +
                f(this.getUTCSeconds()) + 'Z') : null;
        }
        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        }
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var gap, indent, rep;
    var meta = { '\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"': '\\"', '\\': '\\\\' };

    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }

    function str(key, holder) {
        var i, k, v, length, mind = gap, partial, value = holder[key];
        if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }
        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }
        switch (typeof value) {
            case 'string': return quote(value);
            case 'number': return isFinite(value) ? String(value) : 'null';
            case 'boolean':
            case 'null': return String(value);
            case 'object':
                if (!value) { return 'null'; }
                gap += indent;
                partial = [];
                if (Object.prototype.toString.apply(value) === '[object Array]') {
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }
                    v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }
                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === 'string') {
                            k = rep[i]; v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }
                v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {
            var i;
            var gap = '';
            var indent = '';
            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }
            } else if (typeof space === 'string') {
                indent = space;
            }
            rep = replacer;
            if (replacer && typeof replacer !== 'function' && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) { throw new Error('JSON.stringify'); }
            return str('', { '': value });
        }
    }

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {
            var j;
            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }
            if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                j = eval('(' + text + ')');
                return typeof reviver === 'function' ? walk({ '': j }, '') : j;
            }
            throw new SyntaxError('JSON.parse');
        }
    }
} ());

// Base64
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

// MD5
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

//参数读入
(function() {
    var filePath = WScript.Arguments(0);
    var text = WScript.Arguments(1);
    var params = text.split('&');

    if (params.length > 0) {
        var Params = new HashMap();
        for (var i = 0; i < params.length; i++) {
            var keys = params[i].split('=');
            Params.Set(keys[0], keys[1]);
        }
        // 执行
        var title = Params.Contains('title') ? Params.Get('title') : '';
        var artist = Params.Contains('artist') ? Params.Get('artist') : '';
        var album = Params.Contains('album') ? Params.Get('album') : '';

        var type = Params.Contains('type') ? Params.Get('type') : '1';
        var limit = Params.Contains('limit') ? Params.Get('limit') : '30';
        var offset = Params.Contains('offset') ? Params.Get('offset') : '0';
        var lyric = Params.Contains('lyric') ? Params.Get('lyric') : '0';

        if (lyric == '1') {
            var tran = Params.Contains('tran') ? Params.Get('tran') : '0';
            SearchLyric(artist, title, tran == '1', limit, offset, filePath);
        } else {
            Search(title, limit, type, offset, filePath);
        }
    }
})();

WScript.Quit();