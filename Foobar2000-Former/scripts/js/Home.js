oHome = function (name) {
    this.$ = new oPanel(name, true);
    this.click = false;
    this.items = [];
    this.drag = false;
    this.suspend = false;
    this.state = STATE_NORMAL;
    this.page = window.GetProperty('主按钮页', 1);
    this.capacity = 6;
    this.Animation = new oAnimation(name + '.Animation');

    var onceShow = false;
    var lock = false;
    var xy = [];

    this.Init = function () {
        this.Item0 = function () {
            var to = eval(name).page == 1 ? 2 : 1
            eval(name).Exchange(to);
            return true;
        }
        this.Item1 = function (x, y) {
            if (!Schedule)
                Schedule = new oSchedule('Schedule');
            Schedule.Run(x, y);
            if (Schedule.opera)
                eval(name).items[1].text = $Font2Icon('61683');
            else
                eval(name).items[1].text = $Font2Icon('61602');
            return true;
        }
        this.Item2 = function () {
            eval(name).Hide();
            fb.RunMainMenuCommand("视图/ESLyric/显示桌面歌词");
        }
        this.Item3 = function () {
            eval(name).Hide();
            fb.RunMainMenuCommand("视图/均衡器");
        }
        this.Item4 = function () {
            eval(name).Hide(OnHide = function () {
                eval(name).suspend = false;
                ADialog('运行', '', Positive = function () {
                    if (Input.str.length > 0) {
                        try {
                            eval('(function(){' + Input.str + '})();');
                        } catch (e) {
                            Console.Log(e.message);
                        }
                    }
                    Input.$.Hide();
                }, Negative = function () {
                    Input.$.Hide();
                })
                AInput('', Dialog.$.x + 10, Dialog.$.y + 40, Dialog.$.w - 20, 30);

                Input.Defocus = function () {
                    this.active = false;
                    this.Update(false);
                }
            });
        }
        this.Item5 = function () {
            eval(name).Hide(OnHide = function () {
                eval(name).suspend = false;
                if (PlayQueue.$.y < Main.$.y + Main.$.h)
                    PlayQueue.Close();
                else
                    PlayQueue.Open();
            });
        }
        this.Item6 = function () {
            eval(name).Hide(OnHide = function () {
                eval(name).suspend = false;
                var artist = Metadb.TitleFormat('[%artist%]');
                if (!artist) return true;

                if (Picture && Picture.items.length > 0 && Picture.folder.indexOf(artist.Validate().Trim()) != -1)
                    APicture(Picture.folder, Picture.target);
                else
                    AlbumArt.Download(SOURCE_LASTFM, artist.Validate().Trim(), artist, null);
            });
        }
        this.Item7 = function () {
            fb.Prev();
            return true;
        }
        this.Item8 = function () {
            fb.PlayOrPause();
            eval(name).CheckItemState();
            return true;
        }
        this.Item9 = function () {
            fb.Stop();
            eval(name).CheckItemState();
            eval(name).items[8].$.Repaint();
            return true;
        }
        this.Item10 = function () {
            fb.Next();
            return true;
        }
        this.Item11 = function () {
            eval(name).Hide();
            ActivityMain(g_table == -1);
            window.Repaint();
        }
        this.Item12 = function () {
            eval(name).Hide();
            fb.ShowPreferences();
        }

        var fontAwesome30 = gdi.Font('FontAwesome', $Z(30));
        var fontAwesome25 = gdi.Font('FontAwesome', $Z(25));

        this.items.push(new oTextButton(name + '.items[0]', $Font2Icon('61902'), fontAwesome30, this.Item0, ThemeStyle, false, false));
        this.items.push(new oTextButton(name + '.items[1]', $Font2Icon('61602'), fontAwesome30, this.Item1, ThemeStyle, false, false));
        this.items.push(new oTextButton(name + '.items[2]', $Font2Icon('61744'), fontAwesome30, this.Item2, ThemeStyle, false, false));
        this.items.push(new oTextButton(name + '.items[3]', $Font2Icon('61918'), fontAwesome30, this.Item3, ThemeStyle, false, false));
        this.items.push(new oTextButton(name + '.items[4]', $Font2Icon('61728'), fontAwesome30, this.Item4, ThemeStyle, false, false));
        this.items.push(new oTextButton(name + '.items[5]', $Font2Icon('61792'), fontAwesome25, this.Item5, ThemeStyle, false, false));
        this.items.push(new oTextButton(name + '.items[6]', $Font2Icon('61954'), fontAwesome30, this.Item6, ThemeStyle, false, false));

        this.items.push(new oTextButton(name + '.items[7]', $Font2Icon('61514'), fontAwesome25, this.Item7, ThemeStyle, false, false));
        this.items.push(new oTextButton(name + '.items[8]', $Font2Icon('61515'), fontAwesome25, this.Item8, ThemeStyle, false, false));
        this.items.push(new oTextButton(name + '.items[9]', $Font2Icon('61517'), fontAwesome25, this.Item9, ThemeStyle, false, false));
        this.items.push(new oTextButton(name + '.items[10]', $Font2Icon('61518'), fontAwesome25, this.Item10, ThemeStyle, false, false));
        this.items.push(new oTextButton(name + '.items[11]', $Font2Icon('61461'), fontAwesome30, this.Item11, ThemeStyle, false, false));
        this.items.push(new oTextButton(name + '.items[12]', $Font2Icon('61459'), fontAwesome30, this.Item12, ThemeStyle, false, false));

        for (var i = 0; i < this.items.length; i++) {
            this.items[i].Defocus = function () { eval(name).Defocus(); }
        }
    }
    this.Init();

    this.CheckItemState = function () {
        if (fb.IsPlaying && !fb.IsPaused)
            this.items[8].text = $Font2Icon('61515');
        else
            this.items[8].text = $Font2Icon('61516');
    }

    this.Exchange = function (page) {
        this.page = page;
        window.SetProperty('主按钮页', this.page);

        var hideArr = [];
        for (var i = 1; i < this.items.length; i++) {
            if (i > (this.page - 1) * this.capacity && i <= this.page * this.capacity) {

            } else {
                hideArr.push([this.items[i].$, this.items[0].$.x, this.items[0].$.y]);
            }
        }
        this.Animation.SSAV2(hideArr, this.$, 4, func = function () {
            var showArr = [];
            for (var i = 1; i < eval(name).items.length; i++) {
                if (i > (eval(name).page - 1) * eval(name).capacity && i <= eval(name).page * eval(name).capacity) {
                    eval(name).items[i].$.visible = true;
                    eval(name).items[i].$.x = eval(name).items[0].$.x;
                    eval(name).items[i].$.y = eval(name).items[0].$.y;
                    showArr.push([eval(name).items[i].$, 0, 0]);
                } else {
                    eval(name).items[i].$.visible = false;
                }
            }
            showArr[0][1] = eval(name).$.x + 10; showArr[0][2] = eval(name).$.y + 65;
            showArr[1][1] = eval(name).$.x + 45; showArr[1][2] = eval(name).$.y + 10;
            showArr[2][1] = eval(name).$.x + 110; showArr[2][2] = eval(name).$.y + 10;
            showArr[3][1] = eval(name).$.x + 140; showArr[3][2] = eval(name).$.y + 65;
            showArr[4][1] = eval(name).$.x + 110; showArr[4][2] = eval(name).$.y + 120;
            showArr[5][1] = eval(name).$.x + 45; showArr[5][2] = eval(name).$.y + 120;
            eval(name).Animation.SSAV2(showArr, this.$, 4);
        });
    }

    this.OnShow = function () {
        var _x = xy[0], _y = xy[1], _z = eval(name).$.z + 1;
        eval(name).items[0].$.Size(_x + 75, _y + 65, 50, 50, _z);
        eval(name).items[1].$.Size(_x + 10, _y + 65, 50, 50, _z);
        eval(name).items[2].$.Size(_x + 45, _y + 10, 50, 50, _z);
        eval(name).items[3].$.Size(_x + 110, _y + 10, 50, 50, _z);
        eval(name).items[4].$.Size(_x + 140, _y + 65, 50, 50, _z);
        eval(name).items[5].$.Size(_x + 110, _y + 120, 50, 50, _z);
        eval(name).items[6].$.Size(_x + 45, _y + 120, 50, 50, _z);
        for (var i = 1; i < eval(name).items.length; i++) {
            if (i > eval(name).capacity) {
                var _i = i % eval(name).capacity;
                if (_i == 0) {
                    _i = eval(name).capacity;
                }
                var temp = eval(name).items[_i];
                eval(name).items[i].$.Size(temp.$.x, temp.$.y, temp.$.w, temp.$.h, _z);
            }
        }
        if (!onceShow) {
            onceShow = true;
            Panel.Sort();
        }
        eval(name).items[0].$.visible = true;
        for (var i = 1; i < eval(name).items.length; i++) {
            if (i > (eval(name).page - 1) * eval(name).capacity && i <= eval(name).page * eval(name).capacity) {
                eval(name).items[i].$.visible = true;
            } else {
                eval(name).items[i].$.visible = false;
            }
        }
        eval(name).CheckItemState();
    }

    this.CheckPostion = function (w, h) {
        var x = this.$.x - 75;
        var y = this.$.y - 65;
        if (x < 1)
            x = 1;
        else if (x + 200 > w)
            x = w - 200;
        if (y < 1)
            y = 1;
        else if (y + 180 > h)
            y = h - 180;
        return [x, y];
    }

    this.Invalid = function () {
        this.click = false;
        if (this.drag) {
            window.SetProperty('主按钮左', this.$.x);
            window.SetProperty('主按钮上', this.$.y);
            this.drag = false;
            Drag.End();
            this.$.Repaint();
        }
        if (this.state == STATE_DOWN) {
            this.state = STATE_NORMAL;
            if (!this.suspend) {
                this.suspend = true;
                xy = this.CheckPostion(ww, wh);
                this.Animation.SSA(this.$, xy[0], xy[1], 200, 180, null, null, { x: xy[0], y: xy[1], w: 200, h: 180 }, 8, this.OnShow);
            }
        }
    }

    this.OnHide = function () {
        eval(name).suspend = false;
    }

    this.Hide = function (OnHide) {
        if (!this.suspend) return;
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].$.visible = false;
        }
        this.Animation.SSA(this.$, window.GetProperty('主按钮左'), window.GetProperty('主按钮上'), $Z(50), $Z(50), null, null, 
            { x: xy[0], y: xy[1], w: 200, h: 180 }, 8, typeof (OnHide) == 'function' ? OnHide : this.OnHide);
    }

    this.Defocus = function () {
        if (Panel.focus && Panel.focus.indexOf(name) > -1) return;
        if (this.suspend) {
            this.Hide();
        }
    }

    this.OnMouse = function (event, x, y) {
        switch (event) {
            case ON_MOUSE_LBTN_DOWN:
            this.state = STATE_DOWN;
            this.$.Repaint();
            this.drag = false;
            if (this.suspend) break;
            this.click = true;
            break;

            case ON_MOUSE_MOVE:
            if (this.click && !this.drag) {
                this.drag = true;
                Drag.Start(x, y);
                Drag.Pos.x -= this.$.x;
                Drag.Pos.y -= this.$.y;
                this.state = STATE_NORMAL;
            }
            if (Drag.Move(x, y)) {
                this.$.x = (Drag.x - Drag.Pos.x).Limit(1, ww - this.$.w);
                this.$.y = (Drag.y - Drag.Pos.y).Limit(1, wh - this.$.h);
                window.Repaint();
            }
            break;

            case ON_MOUSE_LBTN_UP:
            this.Invalid();
            break;
        }
    }

    this.OnPaint = function (gr) {
        gr.SetSmoothingMode(4);
        gr.FillRoundRect(this.$.x, this.$.y, this.$.w - 2, this.$.h - 2, 8, 8, $SetAlpha(ThemeStyle.fgColor, 128));
        gr.SetSmoothingMode(0);
        if (this.items[1].$.visible) {
            if (Schedule && Schedule.Plan.clock)
                gr.GdiDrawText(Schedule.Plan.clock, ThemeStyle.font, ThemeStyle.bgColor, this.items[1].$.x, this.items[1].$.y + this.items[1].$.h, this.items[1].$.w, 15, DT_CV);
        }
        if (!this.suspend) {
            if (Schedule && Schedule.Plan.clock) {
                Image.Draw(gr, g_clock_icon, this.$.x, this.$.y, 0, 255);
            }
            else {
                if (this.state == STATE_NORMAL)
                    Image.Draw(gr, g_home_icon, this.$.x, this.$.y, 0, 255);
                if (this.state == STATE_DOWN)
                    Image.Draw(gr, g_home_icon, this.$.x, this.$.y, 0, 128);
            }
        }
    }
}

var Home = null;