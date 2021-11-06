oExhibition = function (name) {
    this.$ = new oPanel(name, false);
    this.Animation = new oAnimation(name + '.Animation');
    this.bg = null;
    this.Temp = { image: null, alpha: 0, Animation: new oAnimation(name + '.Temp.Animation') };
    this.radio = window.GetProperty('背景模糊半径', 10);
    this.iteration = window.GetProperty('背景模糊迭代', 3);
    this.alpha = window.GetProperty('背景透明度', 64);

    var table_x = 0, table_w = 0;
    this.SetProperty = function () {
        eval(name).radio = window.GetProperty('背景模糊半径', 10);
        eval(name).iteration = window.GetProperty('背景模糊迭代', 3);
        eval(name).alpha = window.GetProperty('背景透明度', 64);
        eval(name).Update();
    }

    this.Init = function () {
        this.OnPrev = function () {
            fb.Prev();
            return true;
        }
        this.OnPlayOrPause = function () {
            fb.PlayOrPause();
            return true;
        }
        this.OnNext = function () {
            fb.Next();
            return true;
        }
        this.OnBack = function () {
            eval(name).Exhibit(false);
        }
        this.OnTrack = function (x, y) {
            eval(name).SetInfo(!Info.$.visible);
        }
        this.OnSeek = function (x, y, w, h) {
            Progress.Set(x / w);
            eval(name).Seek.$.Repaint();
        }
        this.OnVolume = function (x, y, w, h) {
            Volume.Set(x / w);
            eval(name).Volume.$.Repaint();
        }
        this.Prev = new oSimpleButton(name + '.Prev', this.OnPrev, SHAPE_ELLIPSE);
        this.PlayOrPause = new oSimpleButton(name + '.PlayOrPause', this.OnPlayOrPause, SHAPE_ELLIPSE);
        this.Next = new oSimpleButton(name + '.Next', this.OnNext, SHAPE_ELLIPSE);
        this.Back = new oSimpleButton(name + '.Back', this.OnBack, SHAPE_ELLIPSE);
        this.Track = new oSimpleButton(name + '.Track', this.OnTrack, SHAPE_ELLIPSE);

        this.Prev.Paint = function (gr) {
            Image.Draw(gr, g_prev_icon, this.$.x, this.$.y, 0, 255);
        }
        this.PlayOrPause.Paint = function (gr) {
            if (fb.IsPlaying && !fb.IsPaused) {
                Image.Draw(gr, g_pause_icon, this.$.x, this.$.y, 0, 255);
            } else {
                Image.Draw(gr, g_play_icon, this.$.x, this.$.y, 0, 255);
            }
        }
        this.Next.Paint = function (gr) {
            Image.Draw(gr, g_next_icon, this.$.x, this.$.y, 0, 255);
        }
        this.Back.Paint = function (gr) {
            Image.Draw(gr, g_back_icon, this.$.x, this.$.y, 0, 255);
        }
        this.Track.Paint = function (gr) {
            Image.Draw(gr, g_track_icon, this.$.x, this.$.y, 0, 255);
        }

        this.Seek = new oDragBar(name + '.Seek', this.OnSeek, g_pos_icon);
        this.Volume = new oDragBar(name + '.Volume', this.OnVolume, g_pos_icon);

        this.Seek.OnPaint = function (gr) {
            gr.FillSolidRect(this.$.x + this.marginH, this.$.y + this.marginV - 1, this.w, 3, $SetAlpha(ThemeStyle.fgColor, 128));
            gr.FillSolidRect(this.$.x + this.marginH, this.$.y + this.marginV - 1, this.x, 3, $SetAlpha(ThemeStyle.bgColor_hl, 255));
            Image.Draw(gr, g_pos_icon, this.$.x + this.x, this.$.y, 0, 255);
        }
        this.Volume.OnPaint = function (gr) {
            gr.FillSolidRect(this.$.x + this.marginH, this.$.y + this.marginV - 1, this.w, 3, $SetAlpha(ThemeStyle.fgColor, 128));
            gr.FillSolidRect(this.$.x + this.marginH, this.$.y + this.marginV - 1, this.x, 3, $SetAlpha(ThemeStyle.bgColor_hl, 255));
            Image.Draw(gr, g_pos_icon, this.$.x + this.x, this.$.y, 0, 255);
        }
        this.Table = new oTabView(name + '.Table', false, false, true);
        this.Table.num = 3;

        this.Table.Paint = function (gr, x, y, w, h) {
            gr.GdiDrawText('歌词', ThemeStyle.font, ThemeStyle.fgColor, x, y, w, h, DT_CV);
            gr.GdiDrawText('封面', ThemeStyle.font, ThemeStyle.fgColor, x + w, y, w, h, DT_CV);
            gr.GdiDrawText('简介', ThemeStyle.font, ThemeStyle.fgColor, x + 2 * w, y, w, h, DT_CV);
        }

        this.Table.OnChange = function () {
            g_table = this.focus;
            window.SetProperty('展示台', g_table);
            TableShow(g_table);
            window.Repaint();
        }

        this.Table.Change = function () {
            var dest;
            var client = {
                x: Main.$.x, y: this.$.y, w: Main.$.w,
                h: g_tables[g_table].$.y + g_tables[g_table].$.h - this.$.y
            }
            if (this.focus > g_table) {
                g_tables[this.focus].$.x = table_x + table_w;
                dest = table_x - table_w;
            } else {
                g_tables[this.focus].$.x = table_x - table_w;
                dest = table_x + table_w;
            }
            g_tables[this.focus].SetVisible(true);

            var objArr = [[g_tables[this.focus].$, table_x], [g_tables[g_table].$, dest], [this.Line, this.focus * this.Line.w]];

            this.Animation.SSAV2(objArr, client, 8, this.OnChange());
        }
    }
    this.Init();

    this.GetBackImage = function () {
        this.bg = Image.Process(Cover.Cache.$, this.$.w, this.$.h, IMG_CROP);

        if (this.bg) {
            //this.bg.BoxBlur(this.radio, this.iteration);
            this.bg.StackBlur(45, 2);
        }
    }

    this.OnTime = function () {
        this.$.RepaintRect(50, this.$.h - 75, 50, 20);
    }

    this.OnSize = function (resize) {
        table_w = Math.floor(Math.min(this.$.w - $Z(100), this.$.h - $Z(325)));
        table_x = this.$.x + Math.floor((this.$.w - table_w) / 2);
        Cover.$.Size(table_x, this.$.y + $Z(90), table_w, table_w);
        Lyric.$.Size(table_x, this.$.y + $Z(90), table_w, table_w);
        Biography.$.Size(table_x, this.$.y + $Z(90), table_w, table_w);

        if (resize) {
            Image.Clear(this.bg);
            this.GetBackImage();
        }

        this.Prev.$.Size(Math.floor(this.$.x + this.$.w / 2 - $Z(150)), this.$.y + this.$.h - $Z(125), $Z(50), $Z(50), this.$.z + 1);
        this.PlayOrPause.$.Size(Math.floor(this.$.x + this.$.w / 2 - $Z(25)), this.$.y + this.$.h - $Z(125), $Z(50), $Z(50), this.$.z + 1);
        this.Next.$.Size(Math.floor(this.$.x + this.$.w / 2 + $Z(100)), this.$.y + this.$.h - $Z(125), $Z(50), $Z(50), this.$.z + 1);
        this.Back.$.Size(this.$.x + $Z(10), this.$.y + $Z(7), $Z(50), $Z(50), this.$.z + 1);
        this.Track.$.Size(this.$.x + this.$.w - $Z(60), this.$.y + $Z(7), $Z(50), $Z(50), this.$.z + 1);

        this.Seek.$.Size(this.$.x + $Z(40), this.$.y + this.$.h - $Z(55), this.$.w - $Z(80), $Z(20), this.$.z + 1);
        if (fb.IsPlaying || fb.IsPaused)
            this.Seek.x = Math.floor(Progress.Value() * this.Seek.w);
        this.Volume.$.Size(this.$.x + $Z(90), this.$.y + $Z(21), this.$.w - $Z(180), $Z(20), this.$.z + 1);
        this.Volume.x = Math.floor(Volume.Value() * this.Volume.w);

        this.Table.$.Size(this.$.x + $Z(100), this.$.y + $Z(40), this.$.w - $Z(200), $Z(30), this.$.z + 1);
    }

    this.Update = function () {
        if (this.alpha == 0) {
            Image.Clear(this.bg);
            this.$.Repaint();
            return;
        }
        this.Temp.image = this.bg;
        this.GetBackImage();
        if (this.$.visible) {
            this.Temp.Animation.Alpha(this.Temp, this.alpha, 0, this.$, 17, Clear = function () {
                Image.Clear(eval(name).Temp.image);
                eval(name).Temp.image = null;
            });
        } else {
            Image.Clear(this.Temp.image);
            this.Temp.image = null;
        }
    }

    this.SetVisible = function (vis) {
        this.Prev.$.visible = vis;
        this.PlayOrPause.$.visible = vis;
        this.Next.$.visible = vis;
        this.Back.$.visible = vis;
        this.Track.$.visible = vis;
        this.Seek.$.visible = vis;
        this.Volume.$.visible = vis;
        this.Table.$.visible = vis;
        this.$.visible = vis;
        if (this.$.x < Main.$.x) {
            Info.SetVisible(vis);
        }
    }

    this.SetInfo = function (open) {
        if (open) {
            Info.SetVisible(true);
            var objArr = [[this.$, Main.$.x - this.$.w + Info.$.x], [Rating.$, Main.$.x - this.$.w + Info.$.x + Math.floor(this.$.w / 2 - 47)]];
            this.Animation.SSAV2(objArr, true, 4, ShowInfo = function () {
                Panel.Mouse(ON_MOUSE_MOVE, Mouse.x, Mouse.y);
            });
        }
        else {
            var objArr = [[this.$, Main.$.x], [Rating.$, Main.$.x + Math.floor(this.$.w / 2 - 47)]];
            this.Animation.SSAV2(objArr, true, 4, HideInfo = function () {
                Info.SetVisible(false);
                Panel.Mouse(ON_MOUSE_MOVE, Mouse.x, Mouse.y);
            });
        }
    }

    this.Exhibit = function (ex) {
        if (ex) {
            TableShow(g_table, true);
            var y = Main.$.y;
            this.$.y = y - this.$.h;
            Rating.$.x = this.$.x + Math.floor(this.$.w / 2 - $Z(47));
            var objArr = [[Rating.$, null, y + this.$.h - $Z(160)], [this.$, null, y]];
            this.Animation.SSAV2(objArr, true, 3, SetVisible);
        }
        else {
            TabShow(g_tab, true);
            var objArr = [[Rating.$, Top.$.x + Top.$.w - $Z(110), Top.$.y + $Z(7)], [this.$, null, Main.$.y - this.$.h]];
            this.Animation.SSAV2(objArr, true, 3, SetVisible);
        }
        g_exhibit = ex;
        window.SetProperty('展示', g_exhibit);
    }

    this.OnMove = function (x, y) {
        this.$.x = x.Limit(Main.$.x - this.$.w + Info.$.x, Main.$.x);
        Rating.$.x = this.$.x + Math.floor(this.$.w / 2 - $Z(47));
        if (!Info.$.visible) {
            Info.SetVisible(true);
        }
    }

    this.Invalid = function () {
        this.$.click = false;
        if (this.$.drag) {
            this.$.drag = false;
            Drag.End();
            if (this.$.x == Main.$.x - this.$.w + Info.$.x) {
                return;
            } else if (this.$.x == Main.$.x) {
                this.SetInfo(false);
                return;
            }
            var line = Math.floor((Info.$.x - this.$.w) / 2);
            if (this.$.x > line) {
                this.SetInfo(false);
            } else {
                this.SetInfo(true);
            }
        }
    }

    this.OnMouse = function (event, x, y) {
        switch (event) {
            case ON_MOUSE_MOVE:
                this.$.Move(x, 0);
                break;

            case ON_MOUSE_LBTN_DOWN:
                this.$.click = true;
                break;

            case ON_MOUSE_LBTN_UP:
                this.Invalid();
                break;
        }
    }

    var fontAwesome = gdi.Font('FontAwesome', $Z(20));

    this.OnPaint = function (gr) {
        gr.FillSolidRect(this.$.x, this.$.y, this.$.w, this.$.h, $SetAlpha(ThemeStyle.bgColor, 255));
        this.bg && Image.Draw(gr, this.bg, this.$.x, this.$.y, 0, this.alpha);
        this.Temp.image && Image.Draw(gr, this.Temp.image, this.$.x, this.$.y, 0, this.Temp.alpha);

        gr.GdiDrawText(Top.Title.str, ThemeStyle.hugeFont, ThemeStyle.fgColor, this.$.x + $Z(25), this.$.y + this.$.h - $Z(220), this.$.w - $Z(50), $Z(30), DT_CV);
        gr.GdiDrawText(Top.Artist.str, ThemeStyle.font, ThemeStyle.fgColor, this.$.x + $Z(50), this.$.y + this.$.h - $Z(185), this.$.w - $Z(100), $Z(20), DT_CV);

        if (fb.IsPlaying) {
            gr.GdiDrawText(Metadb.TitleFormat("$if( %length%, [%playback_time%], '--:--' )"), ThemeStyle.font, ThemeStyle.fgColor, this.$.x + $Z(50), this.$.y + this.$.h - $Z(75), $Z(50), $Z(20), DT_LV);
            gr.GdiDrawText(Metadb.TitleFormat("$if( %length%, %length%, '--:--' )"), ThemeStyle.font, ThemeStyle.fgColor, this.$.x + this.$.w - $Z(100), this.$.y + this.$.h - $Z(75), $Z(50), $Z(20), DT_RV);
        }

        gr.GdiDrawText($Font2Icon('61478'), fontAwesome, ThemeStyle.fgColor, this.Volume.$.x - $Z(20), this.$.y + $Z(20), $Z(25), $Z(25), DT_CVN);
        gr.GdiDrawText($Font2Icon('61480'), fontAwesome, ThemeStyle.fgColor, this.Volume.$.x + this.Volume.$.w, this.$.y + $Z(20), $Z(25), $Z(25), DT_CVN);
    }
}

var Exhibition = null;