String.prototype.Validate = function () {
    return this.replace(/[\\\/\:\*\?\"\<\>\|]/g, '_');
}

String.prototype.Trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, '');
}

Number.prototype.One = function () {
    if (this == 0)
        return Number(this);
    else if (this < 0)
        return Math.min(-1, Math.floor(this));
    else if (this > 0)
        return Math.max(1, Math.ceil(this));
}

Number.prototype.IsOne = function (pos) {
    return (this >> (pos - 1) & 0x01) == 1;
}

Number.prototype.Limit = function (min, max) {
    if (this < min) {
        return min;
    } else if (this > max) {
        return max;
    } else {
        return Number(this);
    }
}

Array.prototype.IndexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val)
            return i;
    }
    return -1;
}

Array.prototype.Remove = function (val) {
    var index = this.IndexOf(val);
    if (index > -1)
        this.splice(index, 1);
}

Array.prototype.Contains = function (val) {
    var ret = 0;
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val)
            ret++;
    }
    return ret;
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

Menu = {

    Main: function (x, y) {
        var basemenu = window.CreatePopupMenu();
        var child1 = window.CreatePopupMenu(); //File
        var child2 = window.CreatePopupMenu(); //Edit
        var child3 = window.CreatePopupMenu(); //View
        var child4 = window.CreatePopupMenu(); //Playback
        var child5 = window.CreatePopupMenu(); //Library
        var child6 = window.CreatePopupMenu(); //Help

        var menuman1 = fb.CreateMainMenuManager();
        var menuman2 = fb.CreateMainMenuManager();
        var menuman3 = fb.CreateMainMenuManager();
        var menuman4 = fb.CreateMainMenuManager();
        var menuman5 = fb.CreateMainMenuManager();
        var menuman6 = fb.CreateMainMenuManager();

        child1.AppendTo(basemenu, 0, '文件');
        child2.AppendTo(basemenu, 0, '编辑');
        child3.AppendTo(basemenu, 0, '视图');
        child4.AppendTo(basemenu, 0, '播放');
        child5.AppendTo(basemenu, 0, '媒体库');
        child6.AppendTo(basemenu, 0, '帮助');
        child6.AppendMenuItem(0, 1201, '脚本更新');

        menuman1.Init("file");
        menuman2.Init("edit");
        menuman3.Init("View");
        menuman4.Init("playback");
        menuman5.Init("library");
        menuman6.Init("help");

        menuman1.BuildMenu(child1, 1, 200);
        menuman2.BuildMenu(child2, 201, 200);
        menuman3.BuildMenu(child3, 401, 200);
        menuman4.BuildMenu(child4, 601, 300);
        menuman5.BuildMenu(child5, 901, 300);
        menuman6.BuildMenu(child6, 1202, 100);


        ret = 0;

        ret = basemenu.TrackPopupMenu(x, y);

        switch (true) {
            case (ret >= 1 && ret < 201):
                menuman1.ExecuteByID(ret - 1);
                break;

            case (ret >= 201 && ret < 401):
                menuman2.ExecuteByID(ret - 201);
                break;

            case (ret >= 401 && ret < 601):
                menuman3.ExecuteByID(ret - 401);
                break;

            case (ret >= 601 && ret < 901):
                menuman4.ExecuteByID(ret - 601);
                break;

            case (ret >= 901 && ret < 1201):
                menuman5.ExecuteByID(ret - 901);
                break;

            case (ret == 1201):
                $Run(URL_UPDATE);
                break;

            case (ret >= 1202 && ret < 1301):
                menuman6.ExecuteByID(ret - 1202);
                break;

            default:
                break;
        }

        basemenu.Dispose();
        menuman1.Dispose();
        menuman2.Dispose();
        menuman3.Dispose();
        menuman4.Dispose();
        menuman5.Dispose();
        menuman6.Dispose();
    },

    Context: function (x, y) {
        var c = fb.CreateContextMenuManager();
        var selections = plman.GetPlaylistSelectedItems(plman.ActivePlaylist);
        c.InitContext(selections);

        var m = window.CreatePopupMenu();
        m.AppendMenuItem(0, 1, '下载');
        m.AppendMenuItem(fb.IsAutoPlaylist(plman.ActivePlaylist) ? 1 : 0, 2, '移除出播放列表');
        c.BuildMenu(m, 3, -1);
        var idx = m.TrackPopupMenu(x, y);

        switch (true) {
            case (idx == 1):
                Web.Download(selections);
                break;

            case (idx == 2):
                plman.RemovePlaylistSelection(plman.ActivePlaylist);
                break;

            default:
                c.ExecuteByID(idx - 3);
                break;
        }
        c.Dispose();
        m.Dispose();
    },

    NowPlaying: function (x, y) {
        if (!fb.GetNowPlaying()) return;

        var c = fb.CreateContextMenuManager();
        c.InitNowPlaying();

        var m = window.CreatePopupMenu();
        c.BuildMenu(m, 1, -1);
        var idx = m.TrackPopupMenu(x, y);

        switch (true) {
            default:
                c.ExecuteByID(idx - 1);
                break;
        }
        c.Dispose();
        m.Dispose();
    },

    PlayBackOrder: function (x, y) {
        var m = window.CreatePopupMenu();
        m.AppendMenuItem(0, 1, '默认');
        m.AppendMenuItem(0, 2, '重复(列表)');
        m.AppendMenuItem(0, 3, '重复(音轨)');
        m.AppendMenuItem(0, 4, '随机');
        m.AppendMenuItem(0, 5, '乱序(音轨)');
        m.AppendMenuItem(0, 6, '乱序(专辑)');
        m.AppendMenuItem(0, 7, '乱序(目录)');
        m.CheckMenuRadioItem(1, 7, fb.PlaybackOrder + 1);
        m.AppendMenuSeparator();
        m.AppendMenuItem(fb.StopAfterCurrent ? 8 : 0, 8, '当前音轨结束后停止');

        var idx = m.TrackPopupMenu(x, y);
        if (idx >= 1 && idx <= 7) {
            fb.PlaybackOrder = idx - 1;
        }
        else if (idx == 8) {
            if (fb.StopAfterCurrent)
                fb.StopAfterCurrent = false;
            else
                fb.StopAfterCurrent = true;
        }
        m.Dispose();
    }
}

History = {

    name: '播放历史',

    Write: function (metadb) {
        var hisList = ListManager.Check(3, History.name);
        var count = plman.PlaylistItemCount(hisList);
        var list = plman.GetPlaylistItems(hisList);

        // 记录存在
        for (var i = 0; i < count; i++) {
            if (metadb.Path == list.item(i).Path) {
                plman.ClearPlaylistSelection(hisList);
                plman.SetPlaylistSelectionSingle(hisList, i, true);
                plman.MovePlaylistSelection(hisList, -i);
                return;
            }
        }
        // 上限100
        var limit = 99;
        if (count > limit) {
            plman.ClearPlaylistSelection(hisList);
            plman.SetPlaylistSelectionSingle(hisList, limit, true);
            plman.RemovePlaylistSelection(hisList);
        }
        var handles = plman.GetPlaylistItems(-1);
        handles.Add(metadb);
        plman.InsertPlaylistItems(hisList, 0, handles, false);
    }
}

Progress = {

    Set: function (pos) {
        fb.PlaybackTime = fb.PlaybackLength * pos;
    },

    Value: function () {
        if (fb.PlaybackLength)
            return fb.PlaybackTime / fb.PlaybackLength;
        else
            return 0;
    }
}

Volume = {

    Set: function (pos) {
        fb.Volume = (50 * Math.log(0.99 * pos + 0.01) / Math.LN10);
    },

    Value: function () {
        return ((Math.pow(10, fb.Volume / 50) - 0.01) / 0.99);
    }
}

Metadb = {

    Handle: function () {
        if (fb.IsPlaying)
            return fb.GetNowPlaying();
        else
            return null;
    },

    TitleFormat: function (tf, metadb, fromfile) {
        if (typeof (fromfile) == 'undefined') fromfile = false;
        if (metadb)
            return fb.TitleFormat(tf).EvalWithMetadb(metadb, fromfile);
        else if (fb.IsPlaying)
            return fb.TitleFormat(tf).Eval(true, fromfile);
        else
            return null;
    },

    EnableMeta: function (metadb) {
        if (typeof (metadb) == 'undefined') metadb = fb.GetNowPlaying();
        if (metadb) {
            if (metadb.Path.indexOf('://') == -1 && EMBED_EXT.match($GetExt(metadb.Path))) {
                return true;
            }
        }
        return false;
    },

    IsStream: function (metadb) {
        if (typeof (metadb) == 'undefined') metadb = fb.GetNowPlaying();
        if (metadb) {
            if (metadb.Path.match('://')) {
                return true;
            }
        }
        return false;
    }
}

AlbumArt = {

    timer: null,

    Match: function (metadb, state, exist, fuzzy) {
        var root = $GetDir(metadb.Path);

        var paths = [];
        if (state == 0) paths = ALBUMART_COVER.split('|');
        if (state == 1) paths = ALBUMART_BACK.split('|');
        if (state == 2) paths = ALBUMART_DISC.split('|');
        if (state == 3) paths = ALBUMART_ICON.split('|');
        if (state == 4) paths = ALBUMART_ARTIST.split('|');

        for (var i = 0; i < paths.length; i++) {
            if (paths[i].match(/%.*%/g) != null) {
                paths[i] = Metadb.TitleFormat(paths[i], metadb).Trim();
            }
            if (paths[i].match(/.:.*\\/g) == null) {
                paths[i] = root + paths[i];
            }
        }

        var accord = [];
        for (var i = 0; i < paths.length; i++) {
            var ret = $Match($GetDir(paths[i]), $GetFn(paths[i]), ALBUMART_EXT, false);
            if (ret != null) {
                accord.push(ret);
            }
        }

        if (accord.length == 0 && !exist && fuzzy) {
            for (var i = 0; i < paths.length; i++) {
                var ret = $Match($GetDir(paths[i]), $GetFn(paths[i]), ALBUMART_EXT, true);
                if (ret != null) {
                    accord.push(ret);
                }
            }
        }
        if (accord.length == 0) return null;

        var max = 0;
        var fso = $Fso();
        for (var i = 0; i < accord.length; i++) {
            if (fso.FileExists(accord[i]) && fso.FileExists(accord[max])) {
                if (fso.GetFile(accord[i]).Size > fso.GetFile(accord[max]).Size)
                    max = i;
            }
        }
        return accord[max];
    },

    Get: function (metadb, state, embedded, fuzzy) {
        var ret = new oImage();
        if (!metadb) {
            return ret;
        }
        if (typeof (embedded) == 'undefined') embedded = false;
        if (typeof (fuzzy) == 'undefined') fuzzy = false;

        var src1 = null, src2 = null;
        var img1 = null, img2 = null;

        src1 = metadb.Path;

        if (metadb.Path.indexOf('://') == -1)
            img1 = utils.GetAlbumArtEmbedded(metadb.RawPath, state);

        if (embedded && img1) {
            ret.src = src1;
            ret.$ = img1;
            return ret;
        }
        else {
            var src = this.Match(metadb, state, img1, fuzzy);
            if (src != null) {
                src2 = src;
                img2 = gdi.Image(src2);
            }
        }

        if (!img1) {
            ret.src = src2;
            ret.$ = img2;
            return ret;
        }
        if (!img2) {
            if (!img1) return ret;
            ret.src = src1;
            ret.$ = img1;
            return ret;
        }
        else {
            if ((img1.Width * img1.Height > img2.Width * img2.Height)) {
                ret.src = src1;
                ret.$ = img1;
                src2 = img2 = null;
            }
            else {
                ret.src = src2;
                ret.$ = img2;
                src1 = img1 = null;
            }
            return ret;
        }
    },

    GetAtLeast: function (metadb, priority, embedded, fuzzy) {
        var Img = this.Get(metadb, priority, embedded, fuzzy);
        if (Img.$) return Img;

        for (var i = 0; i <= 4; i++) {
            if (i != priority) {
                Img = this.Get(metadb, i, embedded, fuzzy);
                if (Img.$) return Img;
            }
        }
        return new oImage();
    },

    Monitor: function (file) {
        var fso = $Fso();
        this.timer && window.ClearInterval(this.timer);
        this.timer = window.SetInterval(function () {
            if (fso.FileExists(file)) {
                fso = null;
                if (typeof (AlbumArt.OnDownload) != 'undefined')
                    AlbumArt.OnDownload();
            }
        }, 1000);
    },

    FromXiami: function (state, file, artist, album, title) {
        var url = 'http://www.xiami.com/search/album/?spm=a1z1s.3521877.23310069.3.e1vzaW&key=';
        var Http = new oHttp();
        var text = null;
        if (state == 0) {
            url = url + artist + ' ' + album;
            Http.Ready = function () {
                var text = Http.xml.responseText;

                var begin = -1, end = -1;
                begin = text.search('http://www.xiami.com/album/');
                if (begin < 0) {
                    Console.Log('未找到相关专辑');
                    return;
                }

                end = text.indexOf("\"", begin);
                var id = text.substring(begin, end);

                Http.Ready = function () {
                    text = Http.xml.responseText;
                    begin = -1, end = -1;
                    begin = text.search("pic:'http://img.xiami.net/images/");
                    if (begin < 0) {
                        Console.Log('未找到相关图像');
                        return;
                    }

                    begin += 5;
                    end = text.indexOf("'", begin);
                    url = text.substring(begin, end);
                    if ($Download(url, PATH_ALBUM + file + '.jpg')) {
                        AlbumArt.Monitor(PATH_ALBUM + file + '.jpg');
                    }

                    var fso = $Fso();
                    if (!fso.FileExists(PATH_TXT + file + '.txt')) {
                        begin = -1, end = -1;
                        begin = text.search('专辑介绍');
                        if (begin > 0) {
                            end = text.indexOf('</span>', begin);
                            text = $Html(text.substring(begin, end)).Trim();
                            var f = fso.OpenTextFile(PATH_TXT + file + '.txt', 2, true, -1);
                            f.Write(text);
                            f.Close();
                        }
                    }
                    fso = null;
                    Http = null;
                }
                Http.Set(Http, 'GET', id, true);
            }
            Http.Set(Http, 'GET', url, true);
        }
        else {
            url = url + artist + ' ' + title;
            Http.Ready = function () {
                var text = Http.xml.responseText;

                var begin = -1, end = -1;
                begin = text.search('http://www.xiami.com/artist/');
                if (begin < 0) {
                    Console.Log('未找到相关艺术家');
                    return;
                }

                end = text.indexOf("\"", begin);
                var id = text.substring(begin, end);

                Http.Ready = function () {
                    text = Http.xml.responseText;
                    begin = -1, end = -1;
                    begin = text.search("pic:'http://img.xiami.net/images/");
                    if (begin < 0) {
                        Console.Log('未找到相关图像');
                        return;
                    }

                    begin += 5;
                    end = text.indexOf("'", begin);
                    url = text.substring(begin, end);
                    if ($Download(url, PATH_ARTIST + file + '.jpg')) {
                        AlbumArt.Monitor(PATH_ARTIST + file + '.jpg');
                    }

                    var fso = $Fso();
                    if (!fso.FileExists(PATH_TXT + file + '.txt')) {
                        begin = -1, end = -1;
                        begin = text.search('<div class="record">');
                        if (begin > 0) {
                            end = text.indexOf('</div>', begin);
                            text = $Html(text.substring(begin, end)).Trim();
                            var f = fso.OpenTextFile(PATH_TXT + file + '.txt', 2, true, -1);
                            f.Write(text);
                            f.Close();
                        }
                    }
                    fso = null;
                    Http = null;
                }
                Http.Set(Http, 'GET', id, true);
            }
            Http.Set(Http, 'GET', url, true);
        }
    },

    FromLastfm: function (state, file, artist, album) {
        var url = 'http://www.last.fm/zh/music/';
        var fso = $Fso();
        var path = null;

        if (state == 0) {
            path = PATH_ALBUM;
            url += artist + '/' + album + '/+images';
        }
        else {
            path = PATH_ARTIST;
            url += artist + '/+images';
        }

        var temp = PATH_TEMP + file + "\\";
        if (!fso.FolderExists(temp))
            fso.CreateFolder(temp);
        else {
            APicture(temp, path + file);
            fso = null;
            return;
        }
        var Http = new oHttp();
        var text = null;
        AProgress('从lastfm搜索封面...', 5000);
        Http.Ready = function () {
            text = Http.xml.responseText;
            var doc = null;
            try {
                doc = new ActiveXObject("htmlfile");
            }
            catch (e) {
                Console.Log('无法创建ActiveX对象, 请关闭wsh面板安全模式');
                return;
            }
            doc.open();
            var div = doc.createElement("div");
            div.innerHTML = text;

            var data = div.getElementsByTagName("img");
            if (data.length == 0) {
                AProgress('未找到相关图像', 1000);
                //Console.Log('未找到相关图像');
                doc.close();
                Http = null;
                if (fso.FolderExists(temp))
                    fso.DeleteFolder(temp);
                fso = null;
                return;
            }
            AProgress('搜索完成', 1000);
            var target = null;
            var total = 0;
            for (var i = 0; i < Math.min(window.GetProperty('图片缓存上限', 50), data.length); i++) {
                g_debug && fb.trace(data[i].src);
                if (data[i].src.indexOf('http://img2-ak.lst.fm/i/u/avatar170') == 0) {
                    target = $GetFn(data[i].src);
                    if (target.indexOf('.') == -1) {
                        target += '.jpg';
                        $Download(data[i].src, temp + target) && total++;
                    }
                }
            }
            doc.close();
            Http = null;

            if (total > 0)
                APicture(temp, path + file, total);
            else
                Console.Log('未找到符合图像');
        }

        Http.Error = function () {
            if (fso.FolderExists(temp))
                fso.DeleteFolder(temp.replace(/^(.*)(\\)$/g, "$1"));
            fso = null;
        }
        Http.Set(Http, 'GET', url, true);
    },

    Download: function (source, file, artist, album, title) {
        if (typeof (artist) == 'undefined') return;

        var state = 0;
        artist = encodeURIComponent(artist);
        if (typeof (album) == 'string') {
            album = encodeURIComponent(album);
        }
        else {
            state = 4;
            if (typeof (title) == 'string')
                title = encodeURIComponent(title);
            else
                title = '';
        }

        if (source == 0) {
            this.FromXiami(state, file, artist, album, title);
        }
        else {
            this.FromLastfm(state, file, artist, album);
        }
    }
}

Drag = {

    Pos: { x: 0, y: 0 },
    Offset: { x: 0, y: 0 },
    dragging: false,
    x: 0,
    y: 0,

    Start: function (x, y) {
        this.dragging = true;
        this.Pos.x = x;
        this.Pos.y = y;
    },

    Move: function (x, y) {
        if (this.dragging) {
            if (x != this.x) {
                this.Offset.x += x - this.x;
                this.x = x;
            }
            if (y != this.y) {
                this.Offset.y += y - this.y;
                this.y = y;
            }
            return true;
        }
        return false;
    },

    End: function () {
        if (this.dragging) {
            this.dragging = false;
            this.Pos.x = 0;
            this.Pos.y = 0;
            this.Offset.x = 0;
            this.Offset.y = 0;
            this.x = 0;
            this.y = 0;
        }
    }
}


function $RGB(r, g, b) {
    return (0xff000000 | (r << 16) | (g << 8) | (b));
}

function $RGBA(r, g, b, a) {
    return ((a << 24) | (r << 16) | (g << 8) | (b));
}

function $SetAlpha(rgb, a) {
    return ((rgb & 0x00ffffff) | (a << 24));
}

function $SetBright(rgba, l) {
    var param = $GetRGBA(rgba);

    for (var i = 0; i < 3; i++) {
        param[i] += l;
        param[i] = param[i].Limit(0, 255);
    }
    return $RGBA(param[0], param[1], param[2], param[3]);
}

function $GetRGBA(rgba) {
    var r = rgba >> 16 & 0xff;
    var g = rgba >> 8 & 0xff;
    var b = rgba & 0xff;
    var a = rgba >> 24 & 0xff
    return [r, g, b, a];
}

function $BlurGlass(g, x, y, w, h, radius, iteration) {
    if (w <= 0 || h <= 0) return null;

    var ret = gdi.CloneGraphics(g, x, y, w, h);
    ret.BoxBlur(radius, iteration);
    return ret;
}

function $Magnifier(g, x, y, radius, factor) {
    if (radius <= 0) return null;

    var target = gdi.CloneGraphics(g, x, y, radius, radius);
    var ret = Image.Circle(target, radius * factor, 7);
    Image.Clear(target);
    return ret;
}

function $Calc(str, font, GDI) {
    var temp = gdi.CreateImage(1, 1);
    var g = temp.GetGraphics();
    if (typeof (GDI) == 'undefined') GDI = true;
    if (GDI) {
        var width = g.CalcTextWidth(str, font);  //GDI
        temp.ReleaseGraphics(g);
        temp.Dispose();
        g = null;
        temp = null;
        return width;
    }
    else {
        var info = g.MeasureString(str, font, 0, 0, 99999, 99999, 0);  //GDI+
        temp.ReleaseGraphics(g);
        temp.Dispose();
        g = null;
        temp = null;
        return info.Width;
    }
}

function $RepaintRect(x, y, w, h) {
    if (w > 0 && h > 0) {
        if (x < 0) {
            w += x;
            x = 0;
        }
        if (y < 0) {
            h += y;
            y = 0;
        }
        window.RepaintRect(x, y, w, h);
    }
}

function $GetHWnd(child) {
    if (child)
        return utils.CreateWND(window.ID).GetAncestor(child);
    else if (window.InstanceType == InstanceType.DUI)
        return utils.GetWND("{97E27FAA-C0B3-4b8e-A693-ED7881E99FC1}");
    else if (window.InstanceType == InstanceType.CUI)
        return utils.GetWND("{E7076D1C-A7BF-4f39-B771-BCBE88F2A2A8}");
}

function $GetDPI() {
    var w = utils.GetSystemMetrics(0);
    var h = utils.GetSystemMetrics(1);

    return [w, h];
}

function $Font2Icon(unicodeId) {
    return fb.TitleFormat('$char(' + unicodeId + ')').Eval(true);
}

function $Html(html) {
    return html.replace(/&.*?;/g, '').replace(/<.*?>/g, '\r\n');
}

function $GetExt(fn_ext) {
    return fn_ext.replace(/(.*)\.(\w+)$/g, "$2");
}

function $GetDir(path) {
    if (path.lastIndexOf('\\') != path.length - 1)
        return path.replace(/^(.:.*\\)(.*)$/g, "$1"); //文件目录
    else
        return path.replace(/^(.:.*\\)(.*\\)$/g, "$1"); //上一级目录
}

function $GetFn(path) {
    var noqurey = path.split('\?');
    var local = noqurey[0].lastIndexOf('\/');
    var http = noqurey[0].lastIndexOf('\\');
    var pos = Math.max(http, local) + 1;
    return noqurey[0].substring(pos).Validate();
}

function $Match(path, filename, ext, fuzzy) {
    var fso = $Fso();
    if (fuzzy) {
        var arr = utils.Glob(path + "*.*").toArray();
        for (var i = 0; i < arr.length; i++) {
            if (ext.indexOf($GetExt(arr[i]).toLowerCase()) != -1) {
                var fn = arr[i].substring(path.length, arr[i].lastIndexOf('.'));
                if (filename.indexOf(fn) != -1 || fn.indexOf(filename) != -1) {
                    file = arr[i];
                    arr.length = 0;
                    if (fso.FileExists(file)) {
                        fso = null;
                        return file;
                    }
                }
            }
        }
        arr.length = 0;
    }
    else {
        var arr = utils.Glob(path + filename + '.*').toArray();
        for (var i = 0; i < arr.length; i++) {
            if (ext.indexOf($GetExt(arr[i]).toLowerCase()) != -1) {
                file = arr[i];
                arr.length = 0;
                if (fso.FileExists(file)) {
                    fso = null;
                    return file;
                }
            }
        }
        arr.length = 0;
    }
    fso = null;
    return null;
}

function $Monitor(file, timeout, callback) {
    var fso = $Fso();
    var dead = 0;
    var timer = window.SetInterval(function () {
        dead += 1000;
        if (dead >= timeout || fso.FileExists(file)) {
            if (fso.FileExists(file) && typeof (callback) != 'undefined')
                callback();
            fso = null;
            window.ClearInterval(timer);
            timer = null;
        }
    }, 1000);
}

function $IsBinaryArray(arr) {
    try {
        if (typeof (arr) == 'object' && arr[0].length) {
            return true;
        }
    }
    catch (e) { }
    return false;
}

function $Fso() {
    try {
        return new ActiveXObject('Scripting.FileSystemObject');
    }
    catch (e) {
        Console.Log('无法创建ActiveX对象, 请关闭wsh面板安全模式');
        return null;
    }
}

function $Wss() {
    try {
        return new ActiveXObject("WScript.Shell");
    }
    catch (e) {
        Console.Log('无法创建ActiveX对象, 请关闭wsh面板安全模式');
        return null;
    }
}

function $Run(cmd) {
    var wss = $Wss();
    try {
        wss.Run(cmd);
    }
    catch (e) { }
    wss = null;
}

function $Explorer(file) {
    $Run('explorer /n,/select,' + file);
}

function $ImageView(file) {
    $Run('rundll32.exe %Systemroot%\\System32\\shimgvw.dll,ImageView_Fullscreen ' + file);
}

function $Download(url, file) {
    if (typeof (url) != 'string') return false;
    try {
        var wss = $Wss();
        var cmd = 'wscript "' + FILE_DL + '" "' + url + '" "' + file + '"';
        wss.Run(cmd, 0, false);
        Console.Log('正在下载...');
        wss = null;
        return true;
    }
    catch (e) {
        Console.Log(e.message);
        return false;
    }
}

var Week = new Array('日', '一', '二', '三', '四', '五', '六');

function $GetTime() {
    var dat = new Date();
    var Time = {};
    Time.month = dat.getMonth() + 1;
    Time.date = dat.getDate();
    Time.day = Week[dat.getDay()];
    Time.hour = dat.getHours() < 10 ? ('0' + dat.getHours()) : (dat.getHours());
    Time.minute = dat.getMinutes() < 10 ? ('0' + dat.getMinutes()) : (dat.getMinutes());
    Time.second = dat.getSeconds() < 10 ? ('0' + dat.getSeconds()) : (dat.getSeconds());

    return Time;
}

function $GetKeyboardMask() {
    var s = utils.IsKeyPressed(0x10) ? true : false; //VK_SHIFT
    var c = utils.IsKeyPressed(0x11) ? true : false; //VK_CONTROL
    var a = utils.IsKeyPressed(0x12) ? true : false; //VK_ALT
    var ret = KMask.none;
    if (c && !a && !s) ret = KMask.ctrl;
    if (!c && !a && s) ret = KMask.shift;
    if (c && !a && s) ret = KMask.ctrlshift;
    if (c && a && !s) ret = KMask.ctrlalt;
    if (c && a && s) ret = KMask.ctrlaltshift;
    return ret;
}

function $RegExp(pattern, flag) {
    try {
        return new RegExp(pattern, flag);
    } catch (e) {
        Console.Log(e.message);
        return '';
    }
}

function $Queue(current, length, func) {
    if (current < length) {
        window.SetTimeout(function () {
            func(current);
            var next = current + 1;
            $Queue(next, length, func);
        }, 15);
    }
}

function $LoadImageAsync(src, func) {
    window.SetTimeout(function () {
        var image = gdi.Image(src);
        if (image)
            func(image);
    }, 15);
}

function $WriteText(text, file) {
    if (typeof (text) != 'string') {
        return false;
    }

    var fso = $Fso();
    if (fso.FileExists(file)) {
        fso.DeleteFile(file);
    }
    fso = null;

    var ado = null;
    try {
        ado = new ActiveXObject("ADODB.Stream");
    } catch (e) {
        return false;
    }
    ado.Type = 2;
    ado.mode = 3;
    ado.Charset = "UTF-8";
    ado.open();
    ado.WriteText(text);
    ado.SaveToFile(file);
    ado.flush();
    ado.Close();
    ado = null;

    return true;
}

function $ReadText(file) {
    var fso = $Fso();
    if (!fso.FileExists(file)) {
        fso = null;
        return null;
    }
    fso = null;

    var ret = null;
    var ado = null;
    try {
        ado = new ActiveXObject("ADODB.Stream");
    } catch (e) {
        return false;
    }
    ado.Type = 2;
    ado.mode = 3;
    ado.Charset = "UTF-8";
    ado.open();
    ado.LoadFromFile(file);
    ret = ado.ReadText();
    ado.flush();
    ado.Close();
    ado = null;

    return ret;
}

function $CreateFolder(path) {
    var fso = $Fso();
    var dir = path.split('\\');
    var folder = '';
    try {
        for (var i = 0; i < dir.length; i++) {
            folder += dir[i] + '\\';
            !fso.FolderExists(folder) && fso.CreateFolder(folder);
        }
    } finally {
        fso = null;
    }
}

function $SizeFormat(size) {
    var ret = '未知';
    if (size < 1048576) {
        ret = Math.ceil(size * 100 / 1024) / 100 + ' KB';
    } else if (size < 1073741824) {
        ret = Math.ceil(size * 100 / 1048576) / 100 + ' MB';
    } else {
        ret = Math.ceil(size * 100 / 1073741824) / 100 + ' GB';
    }
    return ret;
}

function $cloneObject(obj) {
    if (typeof obj != 'object' || obj == null) return obj;
    var newObj = new Object();
    var hasProp = false;
    for (var i in obj) {
        hasProp = true;
        newObj[i] = $cloneObject(obj[i]);
    }
    if (!hasProp)
        newObj = obj;

    return newObj;
}

function $Invoke (panelName, method) {
    if (!eval(panelName)) return;
    var args = [].slice.call(arguments, 2);
    var func = eval(panelName)[method];
    return (func == null ? null : func.apply(eval(panelName), args));
}

function $Get (panelName, prop) {
    return eval(panelName)[prop];
}

// Return a zoomed value, to adapt Windows zoom percent.
var $Z = (function () {
  var zoomFactor = parseInt(window.GetProperty('zoom percent', 0)) / 100;
  var objShell, tmp, factor;

  if (zoomFactor > 0.5) {
    factor = zoomFactor;
  } else {
    objShell = new ActiveXObject('WScript.Shell');
    tmp = objShell.RegRead('HKEY_CURRENT_USER\\Control Panel\\Desktop\\WindowMetrics\\AppliedDPI');
    factor = Math.round(tmp / 96 * 100) / 100;
  }

  return function (value) {
    return Math.round(value * factor);
  };
}());