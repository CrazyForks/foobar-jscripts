/*oListView 实例化*/
oSettingItem = function (title, value, func, skip, roaming) {
    this.title = title;
    this.value = typeof (value) == 'undefined' ? null : window.GetProperty(this.title);
    this.write = value ? true : false;
    this.selected = false;
    this.skip = typeof (skip) == 'undefined' ? false : skip;
    this.roaming = typeof (roaming) == 'undefined' ? false : true;

    this.Update = function (value) {
        if (typeof (this.value) == 'number')
            value = Number(value);
        window.SetProperty(this.title, value);
        this.value = value;
        if (typeof (func) != 'undefined')
            func();
    }

    this.Roaming = function () {
        roaming();
    }

    this.Paint = function (gr, x, y, w, h) {
        if (this.value == null)
            gr.FillSolidRect(x, y, w, h, ThemeStyle.bgColor_l);
        else {
            gr.FillSolidRect(x, y, w, h, ThemeStyle.bgColor);
            if (this.selected)
                gr.FillSolidRect(x, y, w, h, ThemeStyle.bgColor_hl);
            else
                gr.DrawLine(x + $Z(15), y + h, x + w - $Z(15), y + h, $Z(1), $SetAlpha(ThemeStyle.fgColor, 32));
        }

        if (this.skip) {
            Image.Draw(gr, g_forward_icon, x + w - $Z(40), Math.floor(y + (h - g_forward_icon.Height) / 2), 0, 255);
        }
        if (typeof (this.value) == 'boolean') {
            if (this.value)
                Image.Draw(gr, g_true_icon, x + w - $Z(60), Math.floor(y + (h - g_true_icon.Height) / 2), 0, 255);
            else
                Image.Draw(gr, g_false_icon, x + w - $Z(60), Math.floor(y + (h - g_true_icon.Height) / 2), 0, 255);
        }

        gr.GdiDrawText(this.title, ThemeStyle.font, ThemeStyle.fgColor, x + $Z(15), y, w - $Z(100), h, DT_LV);
    }
}

var Setting = new oListView('Setting', $Z(35), ENABLE_NONE);

Setting.OnVisible = function (vis) {
    if (!vis && Color && Color.$.visible)
        Color.SetVisible(false);
}

Setting.Init = function () {
    this.Dispose();

    this.items.push(new oSettingItem('字体颜色'));
    this.items.push(new oSettingItem('自定义颜色，字体', true, ChangeColorsFonts));

    this.items.push(new oSettingItem('字体名称', true, ChangeFonts));
    this.items.push(new oSettingItem('字体大小', true, ChangeFonts));
    this.items.push(new oSettingItem('字体类型', true, ChangeFonts));

    this.items.push(new oSettingItem('文本颜色', true, ChangeColors));
    this.items.push(new oSettingItem('文本颜色( 淡 )', true, ChangeColors));
    this.items.push(new oSettingItem('文本高亮颜色', true, ChangeColors));
    this.items.push(new oSettingItem('背景颜色', true, ChangeColors));
    this.items.push(new oSettingItem('背景颜色( 淡 )', true, ChangeColors));
    this.items.push(new oSettingItem('背景高亮颜色', true, ChangeColors));
    this.items.push(new oSettingItem('windows颜色主题', true, ChangeColors));

    this.items.push(new oSettingItem('背景属性'));
    this.items.push(new oSettingItem('背景模糊半径', true, Exhibition.SetProperty));
    this.items.push(new oSettingItem('背景模糊迭代', true, Exhibition.SetProperty));
    this.items.push(new oSettingItem('背景透明度', true, Exhibition.SetProperty));

    this.items.push(new oSettingItem('分组属性'));
    this.items.push(new oSettingItem('分组大小', true, Browser.SetProperty));
    this.items.push(new oSettingItem('分组后台加载', true, Browser.SetControl));
    this.items.push(new oSettingItem('分组加载速度', true, Browser.SetControl));
    this.items.push(new oSettingItem('分组显示模式', true, Browser.SetProperty, true));

    this.items.push(new oSettingItem('本地路径'));
    this.items.push(new oSettingItem('歌词路径', true, Lyric.SetPath, false, Lyric.Path));
    this.items.push(new oSettingItem('头像路径', true, Top.UpdatePhoto, false, Top.Path));
    this.items.push(new oSettingItem('网络歌曲下载目录', true, Web.SetProperty, false, Web.Path));

    this.items.push(new oSettingItem('计划任务'));
    this.items.push(new oSettingItem('计划时间', true, ScheduleTime));

    this.items.push(new oSettingItem('网络搜索'));
    //this.items.push(new oSettingItem('网络搜索编码', true, Web.SetProperty));
    this.items.push(new oSettingItem('网络搜索总页数', true, Web.SetProperty));
    //this.items.push(new oSettingItem('网络搜索源', true, Web.SetProperty, true));

    this.items.push(new oSettingItem('歌词搜索'));
    //this.items.push(new oSettingItem('歌词自动下载', true, Lyric.SetProperty));
    this.items.push(new oSettingItem('歌词翻译', true, Lyric.SetProperty));

    this.items.push(new oSettingItem('封面下载'));
    this.items.push(new oSettingItem('封面自动下载', true, Cover.SetProperty));
    this.items.push(new oSettingItem('图片缓存上限', true));
    this.items.push(new oSettingItem('封面下载源', true, Cover.SetProperty, true));

    this.items.push(new oSettingItem('壁纸属性'));
    this.items.push(new oSettingItem('启动界面', true, WpUpdate));
    this.items.push(new oSettingItem('背景壁纸', true, bgUpdate = function () {
        g_bg = window.GetProperty('背景壁纸', false);
        UpdateWp();
        window.Repaint();
    }));
    this.items.push(new oSettingItem('桌面壁纸', true, bgUpdate = function () {
        g_wp = window.GetProperty('桌面壁纸', false);
        UpdateWp();
        window.Repaint();
    }));
    this.items.push(new oSettingItem('壁纸', true, UpdateWp, true, roaming = function () {
        $Explorer(PATH_WP);
    }));

    this.items.push(new oSettingItem('开发人员选项'));
    this.items.push(new oSettingItem('跟踪调试', true, ChangeMode));

    this.start = 0;
    this.count = this.items.length;
    this.$.offsetY = 0;
    this.$.totalY = this.count * this.rowHeight;
    if (this.sized) {
        this.OnSize();
    }
}

Setting.Exchange = function (idx) {
    var bool = Setting.items[idx].value ? false : true;
    Setting.items[idx].Update(bool);
}

Setting.Color = function (idx) {
    var color = this.items[idx].value;
    AColor(Math.floor(this.$.x + (this.$.w - 250) / 2), Math.floor(this.$.y + 50), this.$.z + 2);
    Color.Set(this.items[idx].title, color);
    Color.OnGet = function () {
        if (Color.color != color) {
            Setting.items[idx].Update(Color.color);
            color = Color.color;
        }
    }
}

Setting.Edit = function (idx) {
    var str = this.items[idx].value;
    if (typeof (str) == 'number')
        str = str.toString();
    if (typeof (str) != 'string')
        str = '';
    AInput(str, this.$.x + 15, this.select * this.rowHeight - this.$.offsetY + this.$.y + 3, this.$.w - 30, this.rowHeight - 6);

    Input.Defocus = function () {
        if (Input.str != str)
            Setting.items[idx].Update(Input.str);

        Input.$.Hide();
    }
}

Setting.Mouse = function (event, x, y) {
    switch (event) {
        case ON_MOUSE_LBTN_DBLCK:
            if (this.items[this.select].skip) {
                this.Choose(this.select);
                return;
            }
            if (this.items[this.select].write) {
                if (typeof (this.items[this.select].value) == 'boolean') {
                    this.Exchange(this.select);
                    this.$.RepaintRect(0, this.rowHeight * this.select - this.$.offsetY, this.$.w, this.rowHeight);
                }
                else {
                    if (this.items[this.select].title.indexOf('颜色') != -1)
                        this.Color(this.select)
                    else
                        this.Edit(this.select);
                }
            }
            break;

        case ON_MOUSE_RBTN_UP:
            if (this.items[this.select].roaming) {
                this.items[this.select].Roaming();
            }
            break;
    }
}

Setting.Choose = function (idx) {
    var value = this.items[idx].value;
    var title = this.items[idx].title;
    var items = [];
    var Load = null;
    var w = 0;
    var h = 0;

    switch (title) {
        case '分组显示模式':
            w = ww;
            h = $Z(35);
            var sources = ['垂直对齐', '水平对齐', '两边对齐'];

            for (var i = 0; i < sources.length; i++) {
                items.push(new SelectListItem(i, sources[i], Browser.SetProperty));
                items[i].Size(0, $Z(40) + i * h, w, h);
            }
            break;

        case '网络搜索源':
            w = ww;
            h = $Z(35);
            var sources = ['网易云音乐(MP3(荐))', '天天动听(MP3|无损(快))', 'QQ 音乐(MP3)',
		'虾米音乐(MP3)', '百度音乐(MP3|无损(快))', '酷我音乐(MP3|无损(慢))', '酷狗音乐(MP3|无损(慢))'];

            for (var i = 0; i < sources.length; i++) {
                items.push(new SelectListItem(i, sources[i], Web.SetProperty));
                items[i].Size(0, $Z(40) + i * h, w, h);
            }
            break;

        case '封面下载源':
            w = ww;
            h = $Z(35);
            var sources = ['虾米', 'lastfm'];

            for (var i = 0; i < sources.length; i++) {
                items.push(new SelectListItem(i, sources[i], Cover.SetProperty));
                items[i].Size(0, $Z(40) + i * h, w, h);
            }
            break;

        case '壁纸':
            w = ww;
            h = $Z(100);
            var sources = utils.Glob(PATH_WP + '*.*').toArray();

            for (var i = 0; i < sources.length; i++) {
                items.push(new SelectTileItem(i, $GetFn(sources[i]), WpUpdate));
                items[i].Size(0, $Z(40) + i * h, w, h);
            }
            Load = function () {
                $Queue(0, Activity.items.length, func = function (i) {
                    if (Activity.items.length)
                        Activity.items[i].Load();
                });
            }
            break;
    }
    AActivity(title, items);
    Activity.Load = Load;
}

/*oActivity 实例化*/
SelectListItem = function (id, title, func) {
    this.id = id;
    this.title = title;

    this.Size = function (x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    this.Dispose = function () {
    }

    this.Repaint = function () {
        Activity.$.RepaintRect(this.x, this.y - Activity.$.offsetY, this.w, this.h);
    }

    this.IsActive = function (xx, yy) {
        var x = xx - Activity.$.x;
        var y = yy + Activity.$.offsetY - Activity.$.y;
        if (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h)
            return true;
        else
            return false;
    }

    this.OnMouse = function (event, x, y) {
        switch (event) {
            case ON_MOUSE_LBTN_DOWN:
                if (this.IsActive(x, y)) {
                    Activity.select = this.id;
                    Activity.$.Repaint();
                    return this.id;
                }
                break;

            case ON_MOUSE_LBTN_DBLCK:
                if (this.IsActive(x, y)) {
                    Activity.select = this.id;
                    if (window.GetProperty(Activity.title) != this.id) {
                        window.SetProperty(Activity.title, this.id);
                        Activity.$.Repaint();
                        if (typeof (func) != 'undefined')
                            func();
                    }
                    return this.id;
                }
                break;
        }
        return -1;
    }

    this.Paint = function (gr, x, y) {
        if (this.y + y + this.h < Activity.$.y || this.y + y > Activity.$.y + Activity.$.h) return;

        if (this.id == Activity.select)
            gr.FillSolidRect(this.x + x, this.y + y, this.w, this.h, ThemeStyle.bgColor_hl);
        else
            gr.DrawLine(this.x + x + $Z(15), this.y + y + this.h - $Z(1), this.x + x - $Z(15) + this.w, this.y + y + this.h - $Z(1), $Z(1), $SetAlpha(ThemeStyle.fgColor, 32));
        gr.GdiDrawText(this.title, ThemeStyle.font, ThemeStyle.fgColor, this.x + x + $Z(50), this.y + y, this.w - $Z(70), this.h, DT_LV);

        if (this.id == window.GetProperty(Activity.title))
            Image.Draw(gr, g_check_icon, this.x + x + $Z(10), this.y + y + 2, 0, Activity.$.alpha);
    }
}

SelectTileItem = function (id, title, func) {
    var name = 'Activity.items[' + id + ']';
    this.id = id;
    this.title = title;
    this.Img = { src: null, $: null, x: 0, y: 0 };

    this.Size = function (x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    this.Dispose = function () {
        this.Img && Image.Clear(this.Img.$);
    }

    this.Load = function () {
        this.Img.src = PATH_WP + this.title;
        $LoadImageAsync(this.Img.src, callback = function (image) {
            if (eval(name))
                eval(name).Loaded(image);
        });
    }

    this.Loaded = function (image) {
        if (Image.IsImage(image)) {
            this.Img.$ = Image.Process(image, this.h - $Z(20), this.h - $Z(20), IMG_ADAPT, 2);
            Image.Clear(image);

            var xy = Image.GetXY(this.Img.$, this.h - $Z(20), this.h - $Z(20), IMG_CENTER);
            this.Img.x = xy[0];
            this.Img.y = xy[1];
        }

        this.Repaint();
    }

    this.Repaint = function () {
        Activity.$.RepaintRect(this.x, this.y - Activity.$.offsetY, this.w, this.h);
    }

    this.IsActive = function (xx, yy) {
        var x = xx - Activity.$.x;
        var y = yy + Activity.$.offsetY - Activity.$.y;
        if (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h)
            return true;
        else
            return false;
    }

    this.OnMouse = function (event, x, y) {
        switch (event) {
            case ON_MOUSE_LBTN_DOWN:
                if (this.IsActive(x, y)) {
                    Activity.select = this.id;
                    Activity.$.Repaint();
                    return this.id;
                }
                break;

            case ON_MOUSE_LBTN_DBLCK:
                if (this.IsActive(x, y)) {
                    Activity.select = this.id;
                    if (window.GetProperty(Activity.title) != this.title) {
                        window.SetProperty(Activity.title, this.title);
                        Activity.$.Repaint();
                        if (typeof (func) != 'undefined')
                            func();
                    }
                    return this.id;
                }
                break;
        }
        return -1;
    }

    this.Paint = function (gr, x, y) {
        if (this.y + y + this.h < Activity.$.y || this.y + y > Activity.$.y + Activity.$.h) return;

        if (this.id == Activity.select)
            gr.FillSolidRect(this.x + x, this.y + y, this.w, this.h, ThemeStyle.bgColor_hl);
        else
            gr.DrawLine(this.x + x + $Z(15), this.y + y + this.h - $Z(1), this.x + x - $Z(15) + this.w, this.y + y + this.h - $Z(1), $Z(1), $SetAlpha(ThemeStyle.fgColor, 32));
        gr.GdiDrawText(this.title, ThemeStyle.font, ThemeStyle.fgColor, this.x + x + $Z(120), this.y + y, this.w - $Z(180), this.h, DT_LV);

        Image.Draw(gr, this.Img.$, this.x + x + $Z(10) + this.Img.x, this.y + y + $Z(10) + this.Img.y, 0, Activity.$.alpha);
        if (this.title == window.GetProperty(Activity.title))
            Image.Draw(gr, g_check_icon, this.x + x + this.w - $Z(50), this.y + y + $Z(35), 0, Activity.$.alpha);
    }
}