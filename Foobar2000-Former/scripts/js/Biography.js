oBiography = function (name) {
    this.$ = new oPanel(name, false);
    this.rowHeight = 0;
    this.click = false;
    this.get = false;
    this.Scroll = { timer: null, active: false };
    this.text = '';
    this.file = '';
    this.offsetY = 0;
    this.totalY = 0;
    this.scroll = 0;
    this.type = -1;
    this.Loading = new oLoading(name + '.Loading', name);

    var str = [];
    var _y = 0;
    var y_ = 0;

    this.DownLoad = function () {
        if (this.Loading.icon) return;
        if (this.get || this.type < -1) return;

        this.Loading.Start(Math.floor((this.$.w - this.Loading.size) / 2), Math.floor((this.$.h - this.Loading.size) / 2), 5000);
        var url = 'http://www.last.fm/zh/music/';
        var Http = new oHttp();
        var fso = $Fso();
        var artist = Metadb.TitleFormat('[%artist%]');
        var key, file;

        if (this.type == COVER_ARTIST) {
            key = encodeURIComponent(artist);
            file = artist.Validate().Trim();
        }
        else {
            var album = Metadb.TitleFormat('[%album%]');
            key = encodeURIComponent(artist) + '/' + encodeURIComponent(album);
            file = album.Validate().Trim();
        }

        Http.Error = function () {
            eval(name).Loading.Reset();
        }
        Http.Ready = function () {
            var text = Http.xml.responseText;

            var begin = -1, end = -1;
            begin = text.search('<div class="wiki-content">');

            if (begin > 0) {
                end = text.indexOf('</div>', begin);
                text = $Html(text.substring(begin, end)).Trim();
                var f = fso.OpenTextFile(PATH_TXT + file + '.txt', 2, true, -1);
                f.Write(text);
                f.Close();
                eval(name).Update();
            } else {
                eval(name).Loading.Reset();
            }
        }
        Http.Set(Http, 'GET', url + key, true);
    }

    this.OnSize = function (resize) {
        if (!resize) return;
        var fso = $Fso();
        this.text = '';
        this.type = window.GetProperty('封面类型', COVER_ALBUM);
        str.splice(0, str.length);

        if (Metadb.Handle() &&
		fso.FileExists(this.file = PATH_TXT + Metadb.TitleFormat((this.type == 4) ? '[%artist%]' : '[%album%]').Validate().Trim() + '.txt')) {
            this.text = utils.ReadTextFile(this.file);
            if (this.text.length == 0) {
                this.get = false;
                this.offsetY = 0;
                this.totalY = (this.$.h - 10);
                this.scroll = 0;
                fso = null;
                return;
            }
            this.get = true;
            this.Calc();
        }
        else {
            this.get = false;
            this.offsetY = 0;
            this.totalY = (this.$.h - 10);
            this.scroll = 0;
        }
        fso = null;
    }

    this.SetVisible = function (vis) {
        this.$.visible = vis;
    }

    this.Update = function () {
        this.Loading.Reset();
        this.OnSize(true);
        this.$.Repaint();
    }

    this.Calc = function () {
        var temp_bmp = gdi.CreateImage(1, 1);
        var temp_gr = temp_bmp.GetGraphics();
        str = temp_gr.EstimateLineWrap(this.text, ThemeStyle.font, this.$.w - 20).toArray();
        this.rowHeight = Math.max(20, temp_gr.CalcTextHeight(this.text, ThemeStyle.font));
        temp_bmp.ReleaseGraphics(temp_gr);
        temp_bmp.Dispose();
        temp_gr = null;
        temp_bmp = null;
        this.totalY = Math.max((this.$.h - 10), str.length / 2 * this.rowHeight);
        this.offsetY = 0;
        this.scroll = (this.$.h - 10) / this.totalY * (this.$.h - 10);
    }

    this.Menu = function (x, y) {
        var fso = $Fso();
        if (fso.FileExists(this.file))
            this.get = true;

        var m = window.CreatePopupMenu();
        m.AppendMenuItem(fb.IsPlaying ? 0 : 1, 1, '下载简介');
        m.AppendMenuItem(this.get ? 0 : 1, 2, '编辑简介');
        m.AppendMenuItem(this.get ? 0 : 1, 3, '删除简介');
        var idx = m.TrackPopupMenu(x, y);
        switch (idx) {
            case 1: this.DownLoad(); break;
            case 2: $Run('notepad ' + this.file); break;
            case 3: fso.DeleteFile(this.file); this.Update(null); break;
            default: break;
        }
        m.Dispose();
        fso = null;
    }

    this.Invalid = function () {
        if (this.click) {
            this.click = false;
            _y = y_ = 0;
        }
    }

    this.ShowScroll = function () {
        this.Scroll.timer && window.ClearTimeout(this.Scroll.timer);
        this.Scroll.timer = null;
        this.Scroll.active = true;
        this.Scroll.timer = window.SetTimeout(function () {
            eval(name).Scroll.active = false;
            eval(name).$.Repaint();
            eval(name).Scroll.timer && window.ClearTimeout(eval(name).Scroll.timer);
            eval(name).Scroll.timer = null;
        }, 1000);
    }

    this.OnMouse = function (event, x, y) {
        switch (event) {
            case ON_MOUSE_LBTN_DOWN:
                if (this.totalY > (this.$.h - 10)) {
                    this.click = true;
                    _y = y;
                }
                break;

            case ON_MOUSE_LBTN_DBLCK:
                fb.IsPlaying && this.DownLoad();
                break;

            case ON_MOUSE_LBTN_UP:
                this.Invalid();
                break;

            case ON_MOUSE_RBTN_UP:
                this.Menu(x, y);
                break;

            case ON_MOUSE_MOVE:
                if (this.click) {
                    this.ShowScroll();
                    y_ = y;
                    while (y_ != _y) {
                        this.offsetY += y_ - _y;
                        _y = y_;
                    }
                    if (this.offsetY < 0)
                        this.offsetY = 0;
                    if (this.offsetY > this.totalY - (this.$.h - 10))
                        this.offsetY = this.totalY - (this.$.h - 10);
                    this.scrolling = true;
                    this.$.Repaint();
                }
                break;

            case ON_MOUSE_WHEEL:
                if (this.totalY > (this.$.h - 10)) {
                    this.ShowScroll();
                    this.offsetY -= x * 2 * this.rowHeight;
                    if (this.offsetY < 0)
                        this.offsetY = 0;
                    if (this.offsetY > this.totalY - (this.$.h - 10))
                        this.offsetY = this.totalY - (this.$.h - 10);
                    this.scrolling = true;
                    this.$.Repaint();
                }
                break;

            default:
                break;
        }
    }

    this.OnPaint = function (gr) {
        if (this.get) {
            for (var i = 0; i < str.length / 2; i++) {
                if (i * this.rowHeight - this.offsetY > ((this.$.h - 10) - this.rowHeight))
                    break;
                if (i * this.rowHeight - this.offsetY >= 0)
                    gr.GdiDrawText(str[i * 2], ThemeStyle.font, ThemeStyle.fgColor, this.$.x + 12, this.$.y + i * this.rowHeight - this.offsetY + 5, this.$.w - 20, this.rowHeight, 0x00000000 | 0x00000010 | 0x00000800);
            }
        }
        else
            this.Loading.Paint(gr) && gr.GdiDrawText('无简介', ThemeStyle.font, ThemeStyle.fgColor, this.$.x, this.$.y + 5, this.$.w, (this.$.h - 10), DT_CV);

        if (this.totalY > (this.$.h - 10) && this.Scroll.active)
            gr.FillSolidRect(this.$.x + this.$.w - 5, this.$.y + ((this.$.h - 10) - this.scroll) * this.offsetY / (this.totalY - (this.$.h - 10)) + 5, 5, this.scroll, $SetAlpha(ThemeStyle.fgColor, 64));
    }
}

var Biography = null;