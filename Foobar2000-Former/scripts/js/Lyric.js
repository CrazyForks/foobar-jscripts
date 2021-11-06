oLyric = function (name) {
    this.$ = new oPanel(name, false);
    this.rowHeight = $Z(35);
    this.click = false;
    this.timer = null;
    this.line = 0;
    this.mid = 0;
    this.get = false;
    this.focus = 0;
    this.lrc = '';
    this.tlrc = '';
    this.withTimeStamp = true;
    this.tf = "[%artist% - ]%title%";
    this.Loading = new oLoading(name + '.Loading', name);

    // this.auto = window.GetProperty('歌词自动下载', false);
    // this.first = window.GetProperty('歌词中文优先', false);
    this.tran = window.GetProperty('歌词翻译', false);


    var lrc = [];
    var tlrc = [];
    var lyric_path = null;
    var lrc_path = null;
    var tlrc_path = null;
    var _y = 0;
    var y_ = 0;

    this.SetPath = function () {
        if (window.GetProperty('歌词路径', './').indexOf(':') != -1)
            lyric_path = window.GetProperty('歌词路径');
        else
            lyric_path = PATH_LRC;
    }
    this.SetPath();

    this.Path = function () {
        $Explorer(lyric_path);
    }

    this.SetProperty = function () {
        // eval(name).auto = window.GetProperty('歌词自动下载', false);
        // eval(name).first = window.GetProperty('歌词中文优先', false);
        eval(name).tran = window.GetProperty('歌词翻译', false);
        eval(name).Init(true);
    }

    this.OnSize = function (resize) {
        if (!resize) return;
        this.mid = Math.floor(this.$.h / this.rowHeight / 2) * this.rowHeight + 5;
        this.Init(false);
    }

    this.SetVisible = function (vis) {
        this.$.visible = vis;
    }
    /*
    this.Search = function (artist, title) {
    var WinHttp = new oWinHttp();
    var get = 'http://music.163.com/api/search/get';
    var lrc = 'http://music.163.com/api/song/lyric';
    var limit = Web.page * 30;

    var header = {
    'Referer': 'http://music.163.com/',
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.152 Safari/537.36'
    };
    var content = 's=' + title + '&limit=' + limit + '&type=1&offset=0';

    WinHttp.Error = function () {
    WinHttp = null;
    eval(name).Load();
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
    eval(name).Load();
    return;
    }
    content = 'os=pc&id=' + id + '&lv=-1&kv=-1&tv=-1';

    WinHttp.Ready = function () {
    try {
    var lyric = json(this.request.ResponseText);

    if (eval(name).first) {
    if (lyric.tlyric && lyric.tlyric.lyric) {
    eval(name).lrc = lyric.tlyric.lyric;
    } else if (lyric.lrc && lyric.lrc.lyric) {
    eval(name).lrc = lyric.lrc.lyric;
    }
    } else {
    if (lyric.lrc && lyric.lrc.lyric) {
    eval(name).lrc = lyric.lrc.lyric;
    } else if (lyric.tlyric && lyric.tlyric.lyric) {
    eval(name).lrc = lyric.tlyric.lyric;
    }
    }
    } catch (e) { }
    WinHttp = null;
    eval(name).Load();
    }
    WinHttp.Set(WinHttp, 'POST', lrc, true, header, content);
    } catch (e) { }
    }
    WinHttp.Set(WinHttp, 'POST', get, true, header, content);
    }

    this.Load = function () {
    this.Loading.Reset();
    if (this.lrc.length > 0) {
    this.get = this.Get();
    this.auto && this.Save();
    }
    this.line = 0;
    this.focus = 0;
    this.$.Repaint();
    }
    */
    this.Save = function () {
        var fso = $Fso();
        var file = lyric_path + fb.TitleFormat(this.tf).Eval().Validate();
        $WriteText(this.lrc, this.withTimeStamp ? (file + '.lrc') : (file + '.txt'));
    }

    this.Layout = function () {
        for (var i = 0; i < lrc.length; i++) {
            for (var j = 0; j < tlrc.length; j++) {
                if (tlrc[j].tag == lrc[i].tag && tlrc[j].str != lrc[i].str) {
                    for (var k = 0; k < tlrc[j].lrc.length; k++) {
                        lrc[i].lrc.push(tlrc[j].lrc[k]);
                    }
                }
            }
            if (i == 0) {
                lrc[0].y = 0;
            } else {
                lrc[i].y = lrc[i - 1].y + lrc[i - 1].lrc.length * this.rowHeight;
            }
        }
        tlrc.length = 0;
    }

    this.Rebuild = function (arrTime, arrLyric) {
        var t = 0, l = 0, lt = 0;
        var r = 0, b = 0, e = 0;
        var lrc = [];

        for (t = 0; t < arrTime.length; t++) {
            loop:
            for (l = 0; l < arrLyric.length; l++) {
                if (arrLyric[l] != null) {
                    for (lt = 0; lt < arrLyric[l].length - 1; lt++) {
                        if (arrTime[t] == arrLyric[l][lt]) {
                            lrc[t] = new Object();
                            lrc[t].tag = arrTime[t];
                            lrc[t].str = arrLyric[l][arrLyric[l].length - 1];
                            lrc[t].lrc = [];

                            r = Math.ceil($Calc(lrc[t].str, ThemeStyle.font, true) / (this.$.w - 10));
                            b = 0;
                            for (e = 1; e <= lrc[t].str.length; e++) {
                                if ($Calc(lrc[t].str.substring(b, e), ThemeStyle.font, true) >= this.$.w - 10) {
                                    lrc[t].lrc.push(lrc[t].str.substring(b, e - 1));
                                    b = e - 1;
                                }
                                if (lrc[t].lrc.length == r - 1) {
                                    lrc[t].lrc.push(lrc[t].str.substring(b, lrc[t].str.length));
                                    break;
                                }
                            }
                            break loop;
                        }
                    }
                }
            }
        }
        return lrc;
    }

    this.Handle = function (lrcText) {
        var time_stamps = [];
        var lyrics = [];
        var text = [];
        var stamp = [];

        // 判断时间标签
        var timeArr = lrcText.match(/\[[0-9]*:[0-9]*\.[0-9]*\]/g);
        if (timeArr) {
            this.withTimeStamp = true;
        } else {
            this.withTimeStamp = false;
        }
        // 判断行尾
        if (lrcText.indexOf('\r\n') != -1) {
            text = lrcText.split(/\r\n/g);
        } else if (lrcText.indexOf('\n') != -1) {
            text = lrcText.split(/\n/g);
        } else if (lrcText.indexOf('\r') != -1) {
            text = lrcText.split(/\r/g);
        }
        // 时间戳、文本分离
        for (var i = 0; i < text.length; i++) {
            stamp = text[i].match(/\[[0-9]*:[0-9]*\.[0-9]*\]/g);
            text[i] = text[i].replace(/\[..:.*?\]/g, "");
            text[i] = text[i].length == 0 ? ' ' : text[i];
            // 含时间戳
            if (this.withTimeStamp && stamp != null) {
                for (var j = 0; j < stamp.length; j++) {
                    stamp[j] = (parseInt(stamp[j].slice(1, 3), 10) * 60 + parseInt(stamp[j].slice(4, 6), 10)) * 1000 + parseInt(stamp[j].slice(7, 9), 10);
                    if (!isNaN(stamp[j]))
                        time_stamps.push(stamp[j]);
                }
                stamp.push(text[i]);
                lyrics.push(stamp);
            } else if (!this.withTimeStamp) {
                //伪造时间戳
                var interval = Math.floor(fb.TitleFormat("%length_seconds%").Eval() * 1000 / text.length);
                time_stamps.push(interval * i);
                stamp = [];
                stamp.push(interval * i);
                stamp.push(text[i]);
                lyrics.push(stamp);
            }
        }
        if (time_stamps.length > 0) {
            time_stamps.sort(function (a, b) { return a - b });
            return this.Rebuild(time_stamps, lyrics);
        }
        return [];
    }

    this.Process = function () {
        if (this.lrc.length == 0 && this.tlrc.length == 0) {
            this.Loading.Start(Math.floor((this.$.w - this.Loading.size) / 2), Math.floor((this.$.h - this.Loading.size) / 2), 5000);
            var file = lyric_path + fb.TitleFormat(this.tf).Eval().Validate() + '.lrc';
            $Monitor(file, 5000, Callback = function () {
                eval(name).Init(true);
            });
            return false;
        } else {
            if (this.lrc.length == 0) {
                if (this.tlrc.length > 0) {
                    this.lrc = this.tlrc;
                    lrc_path = tlrc_path;
                    this.tlrc = '';
                    tlrc_path = null;
                    lrc = this.Handle(this.lrc);
                    this.Layout();
                    return true;
                }
            } else {
                lrc = this.Handle(this.lrc);
                if (this.tlrc.length > 0) {
                    tlrc = this.Handle(this.tlrc);
                }
                this.Layout();
                return true;
            }
        }
        return false;
    }

    this.Get = function () {
        this.timer && window.ClearInterval(this.timer);
        this.timer = null;
        this.get = false;
        lrc_path = null;
        tlrc_path = null;
        lrc.length = 0;
        tlrc.length = 0;

        if (this.lrc.length > 0) {
            return this.Process();
        }

        var metadb = fb.GetNowPlaying();

        if (metadb) {
            // 读取内嵌歌词
            this.lrc = fb.TitleFormat("$meta(LYRICS)").Eval(false, true);
            // 读取本地歌词
            if (this.lrc.length == 0 || this.tran) {
                var arr = utils.Glob(lyric_path + fb.TitleFormat(this.tf).Eval().Validate() + ".*").toArray();
                for (var i = 0; i < arr.length; ++i) {
                    if (this.lrc.length == 0) {
                        if (arr[i].match(/\.lrc/i)) {
                            lrc_path = arr[i];
                            this.lrc = utils.ReadTextFile(arr[i]);
                        } else if (arr[i].match(/\.txt/i)) {
                            lrc_path = arr[i];
                            this.lrc = utils.ReadTextFile(arr[i]);
                        }
                    }

                    if (this.tran && arr[i].match(/\.tlrc/i)) {
                        tlrc_path = arr[i];
                        this.tlrc = utils.ReadTextFile(arr[i]);
                    }
                }
            }
            // 加载网络歌词
            if (this.lrc.length == 0 && this.tlrc.length == 0) {
                var artist = Metadb.TitleFormat('[%artist%]', metadb);
                var title = Metadb.TitleFormat('[%title%]', metadb);
                if (artist.length == 0) {
                    Console && Console.Log('未知艺术家');
                } else {
                    var file = lyric_path + fb.TitleFormat(this.tf).Eval().Validate();
                    Web && Web.SearchLyric(artist, title, file);

                    // winhttp 内存泄漏
                    //this.Search(artist, title);
                }
                //return false;
            }
            return this.Process();
        }
    }

    this.Show = function () {
        var playback_time = fb.TitleFormat("%playback_time_seconds%").Eval() * 1000;
        var t = 0;
        for (; t < lrc.length; t++) {
            if (playback_time < lrc[t].tag) {
                if (t > 0)
                    this.focus = Math.abs(playback_time - lrc[t].tag) > 50 ? t - 1 : t;
                else
                    this.focus = 0;
                break;
            }
        }
        if (t == lrc.length) {
            this.focus = lrc.length - 1;
        }
    }

    this.SetProgress = function () {
        for (var t = 0; t < lrc.length; t++) {
            if (-this.line < lrc[t].y) {
                this.focus = t - 1 < 1 ? 0 : t - 1;
                this.$.Repaint();
                fb.PlaybackTime = lrc[this.focus].tag / 1000;
                break;
            }
            if (t == lrc.length - 1) {
                this.focus = t;
                this.$.Repaint();
                fb.PlaybackTime = lrc[this.focus].tag / 1000;
            }
        }
    }

    this.OnTime = function () {
        if (fb.IsPlaying && this.get && !this.click) {
            var temp = this.focus;
            this.Show();
            if (temp != this.focus) {
                //var sum = 0;
                //var total = lrc[this.focus].y + this.line;
                //var interval = total / this.rowHeight;
                var org = this.line;
                var des = -lrc[this.focus].y;
                this.timer && window.ClearInterval(this.timer);
                this.timer = null;
                if (this.$.visible) {
                    this.timer = window.SetInterval(function () {
                        org += ((des - org) / eval(name).rowHeight).One();
                        if (Math.abs(des - org) <= 1) {
                            window.ClearInterval(eval(name).timer);
                            eval(name).timer = null;
                            org = des;
                            eval(name).line = org;
                            eval(name).$.Repaint();
                            return;
                        }
                        eval(name).line = org;
                        /*eval(name).line -= interval;
                        sum += Math.abs(interval);
                        if (sum >= Math.abs(total)) {
                        eval(name).line = -lrc[eval(name).focus].y;
                        window.ClearInterval(eval(name).timer);
                        eval(name).timer = null;
                        }*/
                        eval(name).$.Repaint();
                    }, ANIMATION_INTERVAL)
                }
                else
                    this.line = -lrc[this.focus].y;
            }
        }
    }

    this.Init = function (reset) {
        this.Loading.Reset();
        if (reset) {    
            this.lrc = '';
            this.tlrc = '';
        }
        this.get = this.Get();
        // this.get = this.lrc.length > 0;
        if (this.get && !reset) {
            this.line = -lrc[this.focus].y;
        } else {
            this.line = 0;
            this.focus = 0;
            this.$.Repaint();
        }
    }

    this.Menu = function (x, y) {
        var metadb = fb.GetNowPlaying();
        var m = window.CreatePopupMenu();
        m.AppendMenuItem(0, 1, '歌词搜索...');
        m.AppendMenuItem(0, 2, '开启/关闭桌面歌词');
        m.AppendMenuItem(0, 3, '锁定/解锁桌面歌词');
        m.AppendMenuSeparator();
        m.AppendMenuItem(fb.IsPlaying ? 0 : 1, 4, '重载歌词');
        m.AppendMenuItem(lrc_path ? 0 : 1, 5, '打开歌词目录');
        m.AppendMenuItem(lrc_path ? 0 : 1, 6, '编辑歌词');
        m.AppendMenuItem(!lrc_path && this.lrc.length > 0 ? 0 : 1, 7, '保存歌词');
        m.AppendMenuItem(lrc_path ? 0 : 1, 8, '删除歌词');
        m.AppendMenuSeparator();
        m.AppendMenuItem(this.get && Metadb.EnableMeta(metadb) ? 0 : 1, 9, '内嵌歌词');
        m.AppendMenuItem(fb.IsPlaying && fb.TitleFormat("$meta(LYRICS)").Eval().length > 0 ? 0 : 1, 10, '去除内嵌歌词');
        m.AppendMenuItem(0, 11, '参数设置...');

        var idx = m.TrackPopupMenu(x, y);
        switch (idx) {
            case 1: fb.RunMainMenuCommand('视图/ESLyric/歌词搜索...'); break;
            case 2: fb.RunMainMenuCommand('视图/ESLyric/显示桌面歌词'); break;
            case 3: fb.RunMainMenuCommand('视图/ESLyric/锁定桌面歌词'); break;
            case 4: this.Init(true); break;
            case 5: $Explorer(lrc_path); break;
            case 6: $Run('notepad ' + lrc_path); break;
            case 7: this.Save(); break;
            case 8: $Fso().DeleteFile(lrc_path); this.Init(true); break;
            case 9: metadb.UpdateFileInfoSimple('LYRICS', this.lrc); break;
            case 10: metadb.UpdateFileInfoSimple('LYRICS', ''); break;
            case 11: fb.RunMainMenuCommand('视图/ESLyric/参数设置...'); break;
            default: break;
        }
        m.Dispose();
    }

    this.Invalid = function () {
        if (this.click) {
            this.click = false;
            if (y_ == _y)
                this.SetProgress();
            _y = y_ = 0;
        }
    }

    this.OnMouse = function (event, x, y) {
        switch (event) {
            case ON_MOUSE_LBTN_DOWN:
                if (this.get && this.line >= -lrc[lrc.length - 1].y) {
                    this.click = true;
                    _y = y;
                    this.timer && window.ClearInterval(this.timer);
                    this.timer = null;
                }
                break;

            case ON_MOUSE_LBTN_DBLCK:
                fb.IsPlaying && this.Init(true);
                break;

            case ON_MOUSE_LBTN_UP:
                this.Invalid();
                break;

            case ON_MOUSE_MOVE:
                if (this.click) {
                    y_ = y;
                    while (y_ != _y) {
                        this.line += y_ - _y;
                        _y = y_;
                    }
                    if (this.line > 0)
                        this.line = 0;
                    if (this.line < -lrc[lrc.length - 1].y)
                        this.line = -lrc[lrc.length - 1].y;

                    this.$.Repaint();
                }
                break;

            case ON_MOUSE_RBTN_UP:
                this.Menu(x, y);
                break;

            case ON_MOUSE_WHEEL:
                if (!this.get) return;
                this.line += x * this.rowHeight;
                if (this.line > 0)
                    this.line = 0;
                if (this.line < -lrc[lrc.length - 1].y)
                    this.line = -lrc[lrc.length - 1].y;
                this.SetProgress();
                this.$.Repaint();
                break;

            default:
                break;
        }
    }

    this.OnPaint = function (gr) {
        if (this.get) {
            for (var i = 0; i < lrc.length; i++) {
                if (lrc[i].lrc != null) {
                    for (var j = 0; j < lrc[i].lrc.length; j++) {
                        var y = lrc[i].y + this.line + this.mid + j * this.rowHeight
                        if (y > this.$.h - this.rowHeight)
                            return;
                        if (y >= 0) {
                            gr.GdiDrawText(lrc[i].lrc[j], ThemeStyle.font, i == this.focus ? ThemeStyle.fgColor_hl : ThemeStyle.fgColor, this.$.x, this.$.y + y, this.$.w, this.rowHeight, DT_CVN);
                        }
                    }
                }
            }
        }
        else
            this.Loading.Paint(gr) && gr.GdiDrawText('无歌词', ThemeStyle.font, ThemeStyle.fgColor, this.$.x, this.$.y, this.$.w, this.$.h, DT_CV);
    }
}

var Lyric = null;