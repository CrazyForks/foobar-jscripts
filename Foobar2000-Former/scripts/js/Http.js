READYSTATE = [
'初始化请求...',
'建立请求...',
'发送请求...',
'服务器响应...',
'成功响应'
];

/**
 * var Http = new oHttp(); 实例化XMLHTTP对象
 * var WinHttp = new oWinHttp(); 实例化WinHttp对像
 * Set(obj, type, url, async[, header, content]):
 * obj = Http / WinHttp
 * type = 'GET' / 'POST'
 * async = true / false
 * header = {key1: value1, key2: value2}
 * content = 'key1=value1&key2=value2';
 * Ready = function() {}: 成功回调;
 * Error = function() {}: 失败回调;
 */

oHttp = function () {
    this.xml = null;

    this.Init = function () {
        var arr = [
        "Msxml2.XMLHTTP.6.0",
        "Msxml2.XMLHTTP.3.0",
        "Msxml2.XMLHTTP",
        "Microsoft.XMLHTTP"
        ];
        for (var i = 0; i < arr.length; i++) {
            try {
                this.xml = new ActiveXObject(arr[i]);
                return;
            }
            catch (e) {
                this.xml = null;
                Console && Console.Log(e.message);
            }
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
        if (this.xml.readyState == 4) {

            g_debug && fb.trace(this.xml.getAllResponseHeaders());
            if (this.xml.status == 200) {
                if (typeof (this.Ready) != 'undefined')
                    this.Ready();
            }
            else {
                Console && Console.Log('XMLHTTP.status = ' + this.xml.status);
                if (typeof (this.Error) == 'function') {
                    this.Error();
                }
            }
        }
        g_debug && fb.trace(READYSTATE[this.xml.readyState]);
    }

    this.Set = function (Http, type, url, async, header, content) {
        if (!this.xml) {
            Console && Console.Log('创建XMLHTTP失败');
            return false;
        }

        var new_url = this.AddTimeStamp(url);
        g_debug && fb.trace(new_url);

        this.xml.open(type, new_url, async);
        // 请求报头设置
        if (typeof (header) == 'object') {
            for (var property in header) {
                if (Object.prototype.hasOwnProperty.call(header, property)) {
                    this.xml.setRequestHeader(property, header[property]);
                }
            }
        }

        try {
            content = typeof (content) == 'undefined' ? null : content;
            this.xml.send(content);
        }
        catch (e) {
            Console && Console.Log('Http', e.message);
            if (typeof (this.Error) == 'function') {
                this.Error();
            }
            return false;
        }

        if (async) {
            this.xml.onreadystatechange = function () {
                Http.Callback();
            }
        }
        else {
            this.Callback();
        }
    }
}

oWinHttp = function () {
    this.request = null;

    this.Init = function () {
        try {
            this.request = new ActiveXObject("WinHttp.WinHttpRequest.5.1");
            return;
        }
        catch (e) {
            this.request = null;
            Console && Console.Log(e.message);
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
        g_debug && fb.trace(this.request.getAllResponseHeaders());
        if (this.request.status == 200) {
            if (typeof (this.Ready) != 'undefined')
                this.Ready();
        }
        else {
            Console && Console.Log('requestHTTP.status = ' + this.request.status);
            if (typeof (this.Error) == 'function') {
                this.Error();
            }
        }
    }

    this.Set = function (WinHttp, type, url, async, header, content) {
        if (!this.request) {
            Console && Console.Log('创建WINHTTP失败');
            return false;
        }

        var new_url = this.AddTimeStamp(url);
        g_debug && fb.trace(new_url);

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
            Console && Console.Log('WinHttp', e.message);
            if (typeof (this.Error) == 'function') {
                this.Error();
            }
            return false;
        }
    }
}