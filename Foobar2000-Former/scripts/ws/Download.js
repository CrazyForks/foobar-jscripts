if (WScript.Arguments.length < 2) WScript.Quit();

/*
var Http = new oHttp(); 实例化对象
Set(Http, type, url, async[, content])：type = 'GET'/'POST'
Ready = function(){ }: 回调函数;
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
            if (this.xml.status == 200) {
                if (typeof (this.Ready) != 'undefined')
                    this.Ready();
            }
        }
    }

    this.Set = function (Http, type, url, async, content) {
        if (!this.xml) {
            return false;
        }

        var new_url = this.AddTimeStamp(url);

        this.xml.open(type, new_url, async);
        if (type.toUpperCase() == 'POST')
            this.xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");

        try {
            content = typeof (content) == 'undefined' ? null : content;
            this.xml.send(content);
        }
        catch (e) {
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

function SaveAs(data, file) {
    var ado = new ActiveXObject("ADODB.Stream");
    ado.Type = 1;
    ado.open();
    try {
        ado.Write(data);
        ado.Position = 0;
        ado.SaveToFile(file);
    } catch (e) {
        //WScript.Echo(e.message);
    }
    ado.flush();
    ado.Close();
}

//参数读入
var url = WScript.Arguments(0);
var file = WScript.Arguments(1);
var override = WScript.Arguments.length > 2 ? WScript.Arguments(2) : false;

function Run() {
    var fso = new ActiveXObject("Scripting.FileSystemObject");
    if (fso.FileExists(file)) {
        if (override) {
            fso.DeleteFile(file);
            fso = null;
        }
        else
            return;
    }
    var Http = new oHttp();

    Http.Ready = function () {
        SaveAs(Http.xml.ResponseBody, file);
    }
    Http.Set(Http, 'Get', url, false);
    Http = null;
}

Run();
WScript.Quit();