oTop = function (name) {
    this.$ = new oPanel(name, true);
    this.img = null;
    this.active = false;
    this.Animation = new oAnimation(name + '.Animation');

    var photo = null;
    this.SetPath = function () {
        if (window.GetProperty('头像路径', './').indexOf(':') != -1)
            photo = window.GetProperty('头像路径');
        else
            photo = Wallpaper.src;
    }
    this.SetPath();

    this.Path = function () {
        $Explorer(photo);
    }

    this.UpdatePhoto = function () {
        eval(name).SetPath();
        Image.Clear(eval(name).img);

        var metadb = Metadb.Handle();
        if (metadb) {
            var oimage = AlbumArt.GetAtLeast(metadb, 0, true, true);
            if (!oimage.$ && Cover.NetCache)
                oimage = Image.Clone(Cover.NetCache);
            if (!oimage.$)
                oimage = Image.Get(photo);

            eval(name).img = Image.Circle(oimage.$, eval(name).$.h - $Z(20), 2);
            Image.Clear(oimage.$);
            oimage = null;
        }
        else {
            eval(name).img = Image.Circle(gdi.Image(photo), eval(name).$.h - $Z(20), 2);
        }
        eval(name).$.Repaint();
    }

    this.GetPhoto = function (metadb) {
        Image.Clear(this.img);
        if (metadb) {
            var oimage = AlbumArt.GetAtLeast(Metadb.Handle(), 0, true, true);
            if (!oimage.$) oimage = Image.Get(photo);
            this.img = Image.Circle(oimage.$, this.$.h - $Z(20), 2);
            Image.Clear(oimage.$);
            oimage = null;

            this.Title.Update(Metadb.TitleFormat('%title%'));
            this.Artist.Update(Metadb.TitleFormat('[%artist%]'));
        }
        else {
            this.img = Image.Circle(gdi.Image(photo), this.$.h - $Z(20), 2);

            this.Title.Update('Fomer');
            this.Artist.Update('Keperlia');
        }
    }

    this.Init = function () {
        this.OnTitle = function () {
            if (fb.IsPlaying) {
                ListManager.Show(plman.PlayingPlaylist);
                if (plman.ActivePlaylist != plman.PlayingPlaylist) {
                    plman.ActivePlaylist = plman.PlayingPlaylist;
                }
                else {
                    var nowplaying = plman.GetPlayingItemLocation().PlaylistItemIndex;
                    Playlist.Show(nowplaying);
                    AlbumBrowser.Show(AlbumBrowser.Find(nowplaying));
                    ArtistBrowser.Show(ArtistBrowser.Find(nowplaying));
                    AlbumList.Show(AlbumList.Find(nowplaying));
                    ArtistList.Show(ArtistList.Find(nowplaying));
                }
                /*if (Tab) {
                Tab.focus = 0;
                Tab.Change();
                }*/
            }
        }
        this.OnArtist = function () {
            var url = '';
            if (fb.IsPlaying) {
                url = 'http://www.last.fm/zh/music/';
                url += encodeURIComponent(Metadb.TitleFormat('[%artist%]'));
            }
            $Run(url);
        }
        this.OnSeek = function (x, y, w, h) {
            Progress.Set(x / w);
            eval(name).Seek.$.Repaint();
        }
        this.OnVolume = function (x, y, w, h) {
            Volume.Set(y / h);
            eval(name).Volume.$.Repaint();
        }
        this.ThemeStyle = {
            font: ThemeStyle.font,
            fgColor: 0xffffffff,
            fgColor_hl: 0xffffffff
        };
        this.Title = new oText(name + '.Title', 'Fomer', this.ThemeStyle, this.OnTitle);
        this.Artist = new oText(name + '.Artist', 'Keperlia', this.ThemeStyle, this.OnArtist);
        this.Seek = new oDragBar(name + '.Seek', this.OnSeek);
        this.Volume = new oDragBar(name + '.Volume', this.OnVolume, margin = { Width: 6, Height: 6 });
        this.Volume.Defocus = function () {
            if (eval(name).Volume.$.visible)
                eval(name).Animation.SSA(eval(name).Volume.$, null, eval(name).Volume.$.y - eval(name).Volume.$.h, null, null, null, null, eval(name).VolClient, 4, func = function () { eval(name).Volume.$.visible = false; });
        }

        this.OnPbo = function (x, y) {
            Menu.PlayBackOrder(x, y);
        }
        this.OnMenu = function (x, y) {
            Menu.Main(x, y);
        }
        this.OnVol = function () {
            if (eval(name).Volume.$.visible)
                eval(name).Animation.SSA(eval(name).Volume.$, null, eval(name).Volume.$.y - eval(name).Volume.$.h, null, null, null, null, eval(name).VolClient, 4, func = function () { eval(name).Volume.$.visible = false; });
            else {
                eval(name).Volume.$.Show();
                eval(name).Animation.SSA(eval(name).Volume.$, null, eval(name).Volume.$.y + eval(name).Volume.$.h, null, null, null, null, eval(name).VolClient, 4);
            }
            return true;
        }
        this.OnMini = function () {
            fb.Hide();
            window.NotifyOthers('Mini', 'MiniMode');
            return true;
        }
        this.Pbo = new oImageButton(name + '.Pbo', g_pbo_icon, this.OnPbo, $RGBA(255, 255, 255, 64), $RGBA(0, 0, 0, 64), SHAPE_SOLID | SHAPE_RECT);
        this.Menu = new oImageButton(name + '.Menu', g_menu_icon, this.OnMenu, $RGBA(255, 255, 255, 64), $RGBA(0, 0, 0, 64), SHAPE_SOLID | SHAPE_RECT);
        this.Vol = new oImageButton(name + '.Vol', g_vol_icon, this.OnVol, $RGBA(255, 255, 255, 64), $RGBA(0, 0, 0, 64), SHAPE_SOLID | SHAPE_RECT);
        this.Mini = new oImageButton(name + '.Mini', g_mini_icon, this.OnMini, $RGBA(255, 255, 255, 64), $RGBA(0, 0, 0, 64), SHAPE_SOLID | SHAPE_RECT);
    }
    this.Init();

    this.SetVisible = function (vis) {
        this.Title.$.visible = vis;
        this.Artist.$.visible = vis;
        this.Seek.$.visible = vis;

        this.Pbo.$.visible = vis;
        this.Menu.$.visible = vis;
        this.Vol.$.visible = vis;
        this.Mini.$.visible = vis;

        this.$.visible = vis;
        Tab.$.visible = vis;
    }

    this.OnSize = function (resize) {
        this.Title.$.Size(this.$.x + this.$.h, this.$.y + $Z(12), this.$.w - this.$.h - $Z(120), $Z(20), this.$.z + 1);
        this.Artist.$.Size(this.$.x + this.$.h + $Z(5), this.$.y + $Z(42), this.$.w - this.$.h - $Z(130), $Z(15), this.$.z + 1);
        this.Seek.$.Size(this.$.x, this.$.y + this.$.h - $Z(5), this.$.w, $Z(5), this.$.z + 1);
        if (fb.IsPlaying || fb.IsPaused)
            this.Seek.x = Math.floor(Progress.Value() * this.Seek.w);

        this.Volume.$.Size(this.$.x + this.$.w - $Z(95), this.$.y + this.$.h - $Z(100), $Z(30), $Z(100), this.$.z - 1);
        this.VolClient = { x: this.Volume.$.x, y: this.Volume.$.y + this.Volume.$.h, w: this.Volume.$.w, h: this.Volume.$.h };
        this.Volume.y = Math.floor(Volume.Value() * this.Volume.h);
        this.Volume.$.visible = false;

        this.Menu.$.Size(this.$.x + this.$.w - $Z(35), this.$.y + this.$.h - $Z(35), $Z(30), $Z(26), this.$.z + 1);
        this.Pbo.$.Size(this.$.x + this.$.w - $Z(65), this.$.y + this.$.h - $Z(35), $Z(30), $Z(26), this.$.z + 1);
        this.Vol.$.Size(this.$.x + this.$.w - $Z(95), this.$.y + this.$.h - $Z(35), $Z(30), $Z(26), this.$.z + 1);
        this.Mini.$.Size(this.$.x + this.$.w - $Z(125), this.$.y + this.$.h - $Z(35), $Z(30), $Z(26), this.$.z + 1);

        resize && this.GetPhoto(Metadb.Handle());
    }

    this.Update = function (metadb) {
        this.Seek.x = 0;
        this.GetPhoto(metadb);
        this.$.Repaint();
    }

    this.Invalid = function () {
        if (this.active) {
            this.active = false;
            window.SetCursor(IDC_ARROW);
        }
    }

    this.OnMouse = function (event, x, y) {
        var _x = x - this.$.x;
        var _y = y - this.$.y;
        switch (event) {
            case ON_MOUSE_LBTN_UP:
                if (this.active) {
                    Exhibition.Exhibit(true);
                    this.active = false;
                    window.SetCursor(IDC_ARROW);
                }
                break;

            case ON_MOUSE_RBTN_UP:
                if (this.active) {
                    Menu.NowPlaying(this.$.x, this.$.y + this.$.h);
                    this.active = false;
                }
                break;

            case ON_MOUSE_MOVE:
                if (_x > 10 && _x < this.$.h - 10 && _y > 7 && _y < this.$.h - 13) {
                    if (!this.active) {
                        this.active = true;
                        window.SetCursor(IDC_HAND);
                    }
                } else {
                    if (this.active) {
                        this.active = false;
                        window.SetCursor(IDC_ARROW);
                    }
                }
                break;
        }
    }

    this.OnPrevPaint = function (gr) {
        if (this.Volume.$.visible) {
            gr.FillSolidRect(this.Volume.$.x + this.Volume.marginH, this.Volume.$.y + this.Volume.marginV, this.Volume.w, this.Volume.y, $SetAlpha(ThemeStyle.bgColor_hl, 255));
            gr.DrawRect(this.Volume.$.x + 1, this.Volume.$.y + 1, this.Volume.$.w - 2, this.Volume.$.h - 2, 2, $SetAlpha(ThemeStyle.bgColor_hl, 255));
        }
        gr.FillSolidRect(this.$.x, this.$.y, this.$.w, this.$.h, $SetAlpha(ThemeStyle.bgColor_hl, 255));
    }

    this.OnPaint = function (gr) {
        if (this.$.bg)
            gr.FillSolidRect(this.$.x, this.$.y, this.$.w, this.$.h, ThemeStyle.bgColor_hl);

        Image.Draw(gr, this.img, this.$.x + 10, this.$.y + 7, 0, 255);
        gr.FillSolidRect(this.Seek.$.x, this.Seek.$.y + 2, this.Seek.x, this.Seek.$.h - 2, ThemeStyle.color);
        gr.FillGradRect(this.Seek.$.x + this.Seek.x - 30, this.Seek.$.y + 2, 30, this.Seek.$.h - 2, 0, 0, 0xffffffff, 1.0);
    }
}

var Top = null;