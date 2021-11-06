oGroupItem = function (id, metadb) {
    this.id = id;
    this.metadb = metadb;
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;

    var rate = -1;

    this.Dispose = function () {
        this.metadb = null;
    }

    this.Size = function (top, margin, w, h) {
        this.x = margin;
        this.y = top;
        this.w = w;
        this.h = h;
        return this.y + this.h + margin;
    }

    this.Update = function () {
        this.title = this.id + 1 + '. ' + Metadb.TitleFormat('%title%', this.metadb);
        this.artist = Metadb.TitleFormat(Group.state ? '[%album%]' : '[%artist%]', this.metadb);
        var date = Metadb.TitleFormat('[%date%]', this.metadb);;
        if (date.length) {
            date = date.substring(0, Math.min(date.length, 10));
            this.info = date + ' · ';
        } else {
            this.info = '';
        }
        this.info += Metadb.TitleFormat('[%genre% · ][%codec% · ][%bitrate% kbps · ][%samplerate% Hz]', this.metadb);

        if (Metadb.EnableMeta(this.metadb))
            this.rate = Metadb.TitleFormat('$meta(RATING)', this.metadb);
        else
            this.rate = -1;
        rate = this.rate;
    }

    this.RateActive = function (xx, yy) {
        if (rate < 0) return;
        var x = xx - Group.$.x;
        var y = yy + Group.$.offsetY - Group.$.y;
        if (x > this.x + this.w - $Z(115) && x < this.x + this.w - $Z(15) && y > this.y + this.h - $Z(30) && y < this.y + this.h - $Z(5)) {
            var i = Math.ceil((x - (this.x + this.w - $Z(115))) / 20);
            if (i != rate);
            {
                rate = i;
                this.RepaintRate();
            }
        }
        else if (rate != this.rate) {
            rate = this.rate;
            this.RepaintRate();
        }
    }

    this.RepaintRate = function () {
        Group.$.RepaintRect(this.x + this.w - 115, this.y + this.h - 30 - Group.$.offsetY, this.x + this.w - 15, this.y + this.h - 5 - Group.$.offsetY);
    }

    this.IsActive = function (xx, yy) {
        var x = xx - Group.$.x;
        var y = yy + Group.$.offsetY - Group.$.y;
        if (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h)
            return true;
        else
            return false;
    }

    this.OnMouse = function (event, x, y) {
        switch (event) {
            case ON_MOUSE_MOVE:
                this.RateActive(x, y);
                break;

            case ON_MOUSE_LBTN_DOWN:
                if (this.IsActive(x, y)) {
                    Group.select = this.id;
                    Group.$.Repaint();
                    return this.id;
                }
                break;

            case ON_MOUSE_LBTN_UP:
                if (rate != this.rate) {
                    this.metadb.UpdateFileInfoSimple("RATING", rate);
                    this.rate = rate;
                    this.RepaintRate();
                }
                break;

            case ON_MOUSE_LBTN_DBLCK:
                if (this.IsActive(x, y)) {
                    if (this.metadb.Compare(fb.GetNowPlaying()))
                        fb.PlayOrPause();
                    else
                        fb.RunContextCommandWithMetadb("播放", this.metadb, 0);
                    return this.id;
                }
                break;

            case ON_MOUSE_RBTN_UP:
                if (this.IsActive(x, y)) {
                    var location = Playlist.list.Find(this.metadb);
                    plman.ClearPlaylistSelection(fb.ActivePlaylist);
                    plman.SetPlaylistSelectionSingle(fb.ActivePlaylist, location, true);
                    Group.select = this.id;
                    Group.$.Repaint();
                    Menu.Context(x, y);
                    return this.id;
                }
                break;
        }
        return -1;
    }

    this.Paint = function (gr, x, y) {
        if (this.y - y + this.h <= Group.$.y || this.y - y >= Group.$.y + Group.$.h) return;

        gr.FillSolidRect(this.x - x, this.y - y, this.w, this.h, $SetAlpha(ThemeStyle.fgColor, 128));
        if (Group.select == this.id)
            gr.FillSolidRect(this.x - x, this.y - y, this.w, this.h, ThemeStyle.bgColor_hl);

        var color = this.metadb.Compare(fb.GetNowPlaying()) ? ThemeStyle.fgColor_hl : ThemeStyle.bgColor;
        gr.GdiDrawText(this.title, ThemeStyle.bigFont, color, this.x - x + $Z(15), this.y - y + $Z(10), this.w - $Z(30), $Z(25), DT_LV);
        gr.GdiDrawText(this.artist, ThemeStyle.font, color, this.x - x + $Z(15), this.y - y + $Z(40), this.w - $Z(30), $Z(25), DT_LV);
        gr.GdiDrawText(this.info, ThemeStyle.font, color, this.x - x + $Z(15), this.y - y + $Z(70), rate == -1 ? this.w - $Z(30) : this.w - $Z(150), $Z(25), DT_LV);

        if (rate < 0) return;
        for (var i = 0; i < 5; i++) {
            if (i < rate)
                gr.GdiDrawText(Group.Rate.solid, Group.Rate.font, color, this.x - x + this.w - $Z(115 + i * 20), this.y - y + $Z(70), $Z(20), $Z(25), DT_LV);
            else
                gr.GdiDrawText(Group.Rate.empty, Group.Rate.font, color, this.x - x + this.w - $Z(115 + i * 20), this.y - y + $Z(70), $Z(20), $Z(25), DT_LV);
        }
    }
}

oGroup = function (name) {
    this.$ = new oPanel(name, false);
    this.$.alpha = 0;
    this.$.offsetY = 0;
    this.$.totalY = 0;

    this.bg = null;
    this.font = gdi.Font('Brush Script Std', $Z(35), 1);
    this.Rate = { solid: $Font2Icon("61445"), empty: $Font2Icon("61446"), font: gdi.Font('Fontawesome', $Z(15)) };
    this.Img = { src: null, $: null };
    this.image = null;
    this.Animation = new oAnimation(name + '.Animation');
    this.vScroll = new oScrollBar(name + '.vScroll', this.$, true, false, false);
    this.items = [];
    this.list = null;
    this.rowHeight = $Z(100);
    this.margin = $Z(10);
    this.visible = false;
    this.select = -1;
    this.state = 0;

    this.Dispose = function () {
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].Dispose();
            delete this.items[i];
        }
        this.items.length = 0;
        this.list && this.list.Dispose();
        Image.Clear(this.image);
        this.image = null;
        Image.Clear(this.bg);
        this.bg = null;
        Image.Clear(this.Img.$);
        this.Img.$ = null;
    }

    this.Init = function () {
        this.OnBack = function () {
            $Invoke(name, 'Close');
            return true;
        }
        this.Back = new oSimpleButton(name + '.Back', this.OnBack, SHAPE_SOLID);
        var fontAwesome = gdi.Font('Fontawesome', $Z(15));
        this.Back.Paint = function (gr) {
            gr.GdiDrawText($Font2Icon('61700') + '  返回', fontAwesome, 0xffffffff, this.$.x, this.$.y, this.$.w, this.$.h, DT_CV);
        }

        this.OnPlay = function () {
            fb.PlaybackOrder = 5;
            fb.RunContextCommandWithMetadb("播放", eval(name).items[0].metadb, 0);
            return true;
        }
        this.Play = new oSimpleButton(name + '.Play', this.OnPlay, SHAPE_SOLID);
        this.Play.Paint = function (gr) {
            gr.GdiDrawText($Font2Icon('61676'), fontAwesome, 0xffffffff, this.$.x, this.$.y, this.$.w, this.$.h, DT_CV);
        }
    }
    this.Init();

    this.Get = function () {
        Image.Clear(this.image);
        this.image = null;
        if (this.state != BROWSER_ALBUM) return;

        var date = Metadb.TitleFormat('[%date%]', this.items[0].metadb);
        if (date.length == 0) return;
        date = date.substring(0, Math.min(date.length, 10));

        this.image = gdi.CreateImage($Z(200), $Z(50));
        var g = this.image.GetGraphics();
        g.SetTextRenderingHint(4);
        g.SetSmoothingMode(4);
        g.DrawString(date, this.font, ThemeStyle.fgColor, 0, 6, 200, 40, 0x1 << 28);
        g.DrawString(date, this.font, $SetAlpha(ThemeStyle.bgColor, 255), 0, 5, 200, 40, 0x1 << 28);

        this.image.ReleaseGraphics(g);
    }

    this.Set = function (x, y, w, h, state, title, list) {
        this.$.x = x, this.x = x;
        this.$.y = y, this.y = y;
        this.$.w = w, this.w = w;
        this.$.h = h, this.h = h;
        this.title = title;
        this.state = state;
        this.list = list;
        this.items.length = 0;
        for (var i = 0; i < list.Count; i++) {
            this.items.push(new oGroupItem(i, list.item(i)));
            this.items[i].Update();
        }
        this.$.offsetY = 0;
        this.$.totalY = 0;
        this.select = -1;
    }

    this.Load = function () {
        var top = this.Img.$.Height + this.margin;
        for (var i = 0; i < this.items.length; i++) {
            top = this.items[i].Size(top, this.margin, this.$.w - 2 * this.margin, this.rowHeight);
        }
        //this.Get();
        this.$.totalY = top;
        this.vScroll.$.Size(this.$.x + this.$.w - 5, this.$.y + 40, 5, this.$.h - 40, this.$.z + 1);
    }

    this.OnOpen = function () {
        $Invoke(name, 'SetVisible', true);
        Panel.Mouse(ON_MOUSE_MOVE, Mouse.x, Mouse.y);
        $Invoke(name, 'Load');
    }

    this.Open = function (src) {
        Image.Clear(this.bg);
        Image.Clear(this.Img.$);

        this.Img.src = src;
        if (ALBUMART_EXT.indexOf($GetExt(src).toLowerCase()) != -1)
            this.Img.$ = gdi.Image(src);
        else
            this.Img.$ = utils.GetAlbumArtEmbedded(src, this.state);

        this.bg = Image.Process(this.Img.$, ww, wh, IMG_FILL);
        var xy = Image.GetXY(this.bg, ww, wh, IMG_CENTER);
        this.bg = Image.Cut(this.bg, -xy[0], -xy[1], ww, wh);
        this.bg.BoxBlur(100, 2);

        var scale = ww / this.Img.$.Width;
        var maxSize = wh - 2 * this.rowHeight - 3 * this.margin;
        this.Img.$ = this.Img.$.Resize(ww, scale * this.Img.$.Height);
        if (this.Img.$.Height > maxSize)
            this.Img.$ = Image.Cut(this.Img.$, 0, Math.floor((this.Img.$.Height - maxSize) / 2), ww, maxSize);
        Image.Smooth(this.Img.$, 80);

        this.vScroll.$.visible = true;
        this.Back.$.visible = true;
        this.Play.$.visible = true;
        this.$.visible = true;
        this.$.alpha = 0;

        this.Animation.SSA(this.$, 0, 0, ww, wh, null, 255, true, 3, this.OnOpen);
    }

    this.OnClose = function () {
        $Invoke(name, 'SetVisible', false);
        $Invoke(name, 'Dispose');
    }

    this.Close = function () {
        this.SetVisible(false);
        this.$.visible = true;
        this.Animation.SSA(this.$, this.x, this.y, this.w, this.h, null, 0, true, 3, this.OnClose);
    }

    this.SetVisible = function (vis) {
        this.vScroll.$.visible = vis;
        this.Back.$.visible = vis;
        this.Play.$.visible = vis;
        this.$.visible = vis;
        this.visible = vis;
        ActivityMain(!vis);
    }

    this.OnSize = function () {
        this.vScroll.$.Size(this.$.x + this.$.w - 5, this.$.y + 150, 5, this.$.h - 150, this.$.z + 1);
        this.Back.$.Size(this.$.x, this.$.y, $Z(80), $Z(40), this.$.z + 1);
        this.Play.$.Size(this.$.x + this.$.w - $Z(50), this.$.y, $Z(50), $Z(40), this.$.z + 1);
    }

    this.Show = function (idx) {
        if (idx >= 0 && idx < this.items.length) {
            var top = this.Img.$.Height + this.margin;
            if (this.items[idx].y - this.$.offsetY < top || this.items[idx].y - this.$.offsetY > this.$.h - top) {
                var des = this.items[idx].y - top;
                this.vScroll.Show(des);
            }
            else
                this.$.Repaint();
        }
    }

    this.OnKey = function (vkey) {
        this.vScroll.OnKey(vkey);
        switch (vkey) {
            case VKEY_UP:
                if (this.select > 0) {
                    this.select--;
                    this.Show(this.select);
                }
                break;

            case VKEY_DOWN:
                if (this.select < this.items.length - 1) {
                    this.select++;
                    this.Show(this.select);
                }
                break;

            case VKEY_RETURN:
                if (this.items[this.select].metadb.Compare(fb.GetNowPlaying()))
                    fb.PlayOrPause();
                else
                    fb.RunContextCommandWithMetadb("播放", this.items[this.select].metadb, 0);
                break;

            case VKEY_ESC:
                this.Close();
                break;
        }
    }

    this.OnMouse = function (event, x, y) {
        if (event == ON_MOUSE_LBTN_DBLCK && y < this.$.y + $Z(40)) {
            if (fb.IsPlaying) {
                if (plman.ActivePlaylist == plman.PlayingPlaylist) {
                    var nowplaying = this.list.Find(fb.GetNowPlaying());
                    if (nowplaying != Math.pow(2, 32) - 1) {
                        this.select = nowplaying;
                        this.Show(nowplaying);
                    }
                }
            }
            return;
        }
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].OnMouse(event, x, y) > -1)
                break;
        }

        switch (event) {
            case ON_MOUSE_WHEEL:
                this.vScroll.Scroll(x * 30, 4);
                break;
        }
    }

    this.OnPaint = function (gr) {
        gr.FillSolidRect(this.$.x, this.$.y, this.$.w, this.$.h, $SetAlpha(ThemeStyle.bgColor, this.$.alpha));
        gr.DrawImage(this.bg, this.$.x, this.$.y, this.$.w, this.$.h, this.$.x, this.$.y, this.$.w, this.$.h, 0, this.$.alpha);

        if (!this.visible) return;
        for (var i = 0; i < this.items.length; i++) {
            var step = 0;
            if (this.vScroll.overstep > 0) {
                step = (this.items.length - i - 1) * this.vScroll.overstep;
            }
            else if (this.vScroll.overstep < 0) {
                step = i * this.vScroll.overstep;
            }
            this.items[i].Paint(gr, -this.$.x, this.$.offsetY - this.$.y + step);
        }

        var imgY = this.$.y - Math.floor(this.$.offsetY / 10);
        if (imgY + this.Img.$.Height < $Z(150))
            imgY = $Z(150) - this.Img.$.Height;
        Image.Draw(gr, this.Img.$, this.$.x, imgY, 0, 255);
        gr.SetSmoothingMode(4);
        Image.Draw(gr, this.image, this.$.x + this.$.w - $Z(220), imgY + this.Img.$.Height, 30, 255);
        gr.SetSmoothingMode(0);

        gr.FillSolidRect(this.$.x, this.$.y, this.$.w, $Z(40), $SetAlpha($SetAlpha(ThemeStyle.bgColor_hl, 255), 128));
        gr.GdiDrawText(this.title, ThemeStyle.bigFont, 0xffffffff, this.$.x + $Z(100), this.$.y, this.$.w - $Z(200), $Z(40), DT_CV);
    }
}

var Group = null;