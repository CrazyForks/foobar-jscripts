Web = {
    //source: 0,
    //code: true,
    page: 0,
    //type: '',
    path: ''
}
/*
Web.wyList = {
hot: '3778678',
soar: '19723756',
newest: '3779629'
}

var web_type = ['wy', 'tt', 'qq', 'xm', 'bd', 'kw', 'kg'];

Web.GetType = function () {
Web.type = web_type[Web.source];
}
*/

Web.SetProperty = function () {
    // Web.source = window.GetProperty('网络搜索源', 0);
    // Web.code = window.GetProperty('网络搜索编码', true);
    Web.page = window.GetProperty('网络搜索总页数', 1);
    Web.path = window.GetProperty('网络歌曲下载目录', './');
    if (Web.path.indexOf(':') == -1) {
        Web.path = PATH_MEDIA;
    }
    // Web.GetType();
}
Web.SetProperty();

Web.Path = function () {
    $Explorer(Web.path);
}

Web.Download = function (metadbList) {
    var needDL = false;
    for (var i = 0; i < metadbList.Count; i++) {
        var metadb = metadbList.item(i);
        var url = metadb.Path;
        var filename = Metadb.TitleFormat('[%artist% - ]%title%', metadb).Validate().Trim();
        var fn = $GetFn(url);
        var ext = $GetExt(fn);

        if (url.indexOf('http://') != -1) {
            var file = Web.path + filename + '.' + ext;
            $Download(url, file);
            needDL = true;
        }
    }
    !needDL && Console.Log('无需要下载项');
}

Web.AddMedia = function () {
    AProgress('搜索完成', 1000);
    var total = plman.PlaylistCount;
    for (var i = 0; i < total; i++) {
        if (plman.GetPlaylistName(i).substr(0, 4) == '网络搜索') {
            plman.RemovePlaylist(i);
            fb.CreatePlaylist(i, '网络搜索');
            plman.ActivePlaylist = i;
            plman.AddLocations(i, [FILE_ASX]);
            return;
        }
    }
    if (total > 2)
        total = 2;

    fb.CreatePlaylist(total, '网络搜索');
    plman.ActivePlaylist = total;
    plman.AddLocations(total, [FILE_ASX]);
}

Web.Search = function (text) {
    var fso = $Fso();
    if (fso.FileExists(FILE_ASX))
        fso.DeleteFile(FILE_ASX);
    fso = null;

    if (text.substring(0, 2) == './') {
        if (Web.Run(text.substr(1))) {
            var timeout = 10 * 1000;
            AProgress('正在搜索...', timeout);
            $Monitor(FILE_ASX, timeout, Web.AddMedia);
        }
    } else if (Web.SearchSingle(text)) {
        var timeout = 10 * 1000;
        AProgress('正在搜索：' + text, timeout);
        $Monitor(FILE_ASX, timeout, Web.AddMedia);
    }
}

Web.Run = function (param) {
    if (typeof (param) != 'string') return false;
    try {
        var wss = $Wss();
        var cmd = 'wscript "' + FILE_WY + '" "'
            + FILE_ASX + '" "' + param + '"';
        wss.Run(cmd, 0, false);

        wss = null;
        return true;
    }
    catch (e) {
        Console.Log(e.message);
        return false;
    }
}

Web.SearchSingle = function (text) {
    if (typeof (text) != 'string') return false;
    try {
        var wss = $Wss();

        /* api.musicuu.com 失效
        var cmd = 'wscript "' + FILE_WS + '" "'
        + FILE_ASX + '" "' + Web.source + '" "' + Web.code + '" "' + Web.page + '" "' + Web.type + '" "' + text + '"';
        */

        var param = 'title=' + text + '&limit=' + Web.page * 30;
        var cmd = 'wscript "' + FILE_WY + '" "'
            + FILE_ASX + '" "' + param + '"';
        wss.Run(cmd, 0, false);

        wss = null;
        return true;
    }
    catch (e) {
        Console.Log(e.message);
        return false;
    }
}

Web.SearchLyric = function (artist, title, file) {
    var fso = $Fso();

    if (fso.FileExists(file + '.lrc')) {
        fso.DeleteFile(file + '.lrc');
    }
    if (fso.FileExists(file + '.txt')) {
        fso.DeleteFile(file + '.txt');
    }
    fso = null;
    var tran = window.GetProperty('歌词翻译', false) ? '1' : '0';
    try {
        var wss = $Wss();
        var param = 'artist=' + artist + '&title=' + title + '&tran=' + tran + '&limit=' + Web.page * 30 + '&lyric=1';
        var cmd = 'wscript "' + FILE_WY + '" "'
            + file + '" "' + param + '"';
        wss.Run(cmd, 0, false);

        wss = null;
        return true;
    }
    catch (e) {
        Console.Log(e.message);
        return false;
    }
}