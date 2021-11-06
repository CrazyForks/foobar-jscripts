oLinearChild = function (parent, i, id, idx, metadb) {
    this.id = id;
    this.i = i;
    this.idx = idx;
    this.metadb = metadb;
    this.parent = parent;
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = $Z(35);
    this.num = 0;

    this.Dispose = function () {
        this.metadb = null;
    }

    this.Size = function (margin) {
        this.x = this.parent.$.x;
        this.w = this.parent.$.w;
        if (this.id > 0) {
            this.y = this.parent.items[this.id - 1].y + this.parent.items[this.id - 1].h;
        }
    }

    this.Load = function () {
    }

    this.IsActive = function (xx, yy) {
        var x = xx - this.parent.$.x;
        var y = yy + this.parent.$.offsetY - this.parent.$.y;
        if (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h)
            return true;
        else
            return false;
    }

    this.OnMouse = function (event, x, y) {
        switch (event) {
            case ON_MOUSE_LBTN_DOWN:
                if (this.IsActive(x, y)) {
                    this.parent.select = this.id;
                    this.parent.$.Repaint();
                    return this.id;
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
                    this.parent.select = this.id;
                    this.parent.$.Repaint();
                    Menu.Context(x, y);
                    return this.id;
                }
                break;
        }
        return -1;
    }

    this.Paint = function (gr, x, y) {
        if (this.y - y + this.h <= this.parent.$.y || this.y - y >= this.parent.$.y + this.parent.$.h) return;

        gr.FillSolidRect(this.x - x, this.y - y, this.w, this.h, ThemeStyle.bgColor);
        if (this.parent.select == this.id)
            gr.FillSolidRect(this.x - x, this.y - y, this.w, this.h, ThemeStyle.bgColor_hl);

        var color = this.metadb.Compare(fb.GetNowPlaying()) ? ThemeStyle.fgColor_hl : ThemeStyle.fgColor;
        gr.GdiDrawText(this.i, ThemeStyle.font, color, this.x - x + $Z(10), this.y - y, $Z(50), this.h, DT_CV);
        gr.GdiDrawText(Metadb.TitleFormat('[%title%]', this.metadb), ThemeStyle.font, color, this.x - x + $Z(65), this.y - y, this.w - $Z(120), this.h, DT_LV);
        gr.GdiDrawText(Metadb.TitleFormat("$if( %length%, %length%, '--:--' )", this.metadb), ThemeStyle.font, color, this.x - x + this.w - $Z(50), this.y - y, $Z(40), this.h, DT_RV);
    }
}

oLinearItem = function (parentName, id, idx, metadb) {
    this.id = id;
    this.idx = idx;
    this.metadb = metadb;
    this.parent = eval(parentName);
    this.Img = this.parent.icon;
    this.open = false;
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = $Z(70);
    this.num = 0;

    this.Dispose = function () {
        this.metadb = null;
        this.Img = this.parent.icon;
    }

    this.CollapseOrExpand = function (refresh) {
        if (this.open) {
            this.open = false;
            this.parent.items.splice(this.id + 1, this.num);

            for (i = this.id + 1; i < this.parent.items.length; i++) {
                this.parent.items[i].id -= this.num;
            }
        } else {
            this.open = true;
            var i = 0;
            for (; i < this.num; i++) {
                var child = new oLinearChild(this.parent, i + 1, this.id + i + 1, this.idx + i, this.parent.list.item(i + this.idx));
                this.parent.items.splice(this.id + i + 1, 0, child);
            }

            for (i = this.id + i + 1; i < this.parent.items.length; i++) {
                this.parent.items[i].id += this.num;
            }
        }
        refresh && this.parent.Size();
    }

    this.Size = function (margin) {
        this.x = this.parent.$.x;
        this.w = this.parent.$.w;
        if (this.id > 0) {
            this.y = this.parent.items[this.id - 1].y + this.parent.items[this.id - 1].h + margin;
        }
    }

    this.Repaint = function () {
        this.parent.$.RepaintRect(10, this.y - this.parent.$.offsetY + 10, this.h - 20, this.h - 20);
    }

    this.Load = function (prev, size, margin, max) {
        if (this.Img.src != 'no') return;

        var key = Metadb.TitleFormat(this.parent.key ? '[%artist%]' : '[%album%-][%album artist%]', this.metadb);

        var profiler = g_debug ? fb.CreateProfiler() : null;
        var needLoad = true;

        if (this.parent.ImageCache.Contains(key)) {
            // 内存缓存中查找
            this.Img = this.parent.ImageCache.Get(key);
            needLoad = false;
            if (profiler)
                fb.trace('从内存加载' + key + '耗时：', profiler.Time + ' ms');
        } else {
            // 本地缓存中查找
            this.Img = Image.Get(PATH_IMAGE + key);
            if (this.Img.$) {
                // 加入内存缓存
                this.parent.ImageCache.Add(key, this.Img);
                needLoad = false;
                if (profiler)
                    fb.trace('从本地缓存加载' + key + '耗时：', profiler.Time + ' ms');
            }
        }
        if (needLoad) {
            // 查找加载
            this.Img = AlbumArt.Get(this.metadb, this.parent.key ? 4 : 0, true, true);
            if (this.Img.$) {
                // 裁剪处理
                this.Img.$ = Image.Circle(this.Img.$, this.h - 20, 2);
                if (this.Img.$) {
                    // 加入内存缓存
                    this.parent.ImageCache.Add(key, this.Img);
                    // 加入本地缓存
                    this.Img.$.SaveAs(PATH_IMAGE + key);
                    if (profiler)
                        fb.trace('从硬盘加载' + key + '耗时：', profiler.Time + ' ms');
                }
            } else {
                this.Img = this.parent.icon;
            }
        }
        profiler = null;
        this.Repaint();
        return true;
    }

    this.IsActive = function (xx, yy) {
        var x = xx - this.parent.$.x;
        var y = yy + this.parent.$.offsetY - this.parent.$.y;
        if (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h)
            return true;
        else
            return false;
    }

    this.OnMouse = function (event, x, y) {
        switch (event) {
            case ON_MOUSE_LBTN_DOWN:
                if (this.IsActive(x, y)) {
                    this.parent.select = this.id;
                    this.parent.$.Repaint();
                    return this.id;
                }
                break;

            case ON_MOUSE_LBTN_DBLCK:
                if (this.IsActive(x, y)) {
                    this.CollapseOrExpand(true);
                    return this.id;
                }
                break;

            case ON_MOUSE_RBTN_UP:
                if (this.IsActive(x, y)) {
                    var affected = [];
                    for (var i = this.idx; i < this.idx + this.num; i++) {
                        var location = Playlist.list.Find(this.parent.list.item(i));
                        if (location != Math.pow(2, 32) - 1) {
                            affected.push(location);
                        }
                    }
                    plman.ClearPlaylistSelection(fb.ActivePlaylist);
                    plman.SetPlaylistSelection(fb.ActivePlaylist, affected, true);
                    this.parent.select = this.id;
                    this.parent.$.Repaint();
                    Menu.Context(x, y);
                    return this.id;
                }
                break;
        }
        return -1;
    }

    this.Paint = function (gr, x, y) {
        if (this.y - y + this.h <= this.parent.$.y || this.y - y >= this.parent.$.y + this.parent.$.h) return;

        gr.FillSolidRect(this.x - x, this.y - y, this.w, this.h, ThemeStyle.bgColor);
        if (this.parent.select == this.id)
            gr.FillSolidRect(this.x - x, this.y - y, this.w, this.h, ThemeStyle.bgColor_hl);

        if (this.Img) {
            Image.Draw(gr, this.Img.$, this.x - x + $Z(10), this.y - y + $Z(10), 0, 255);
        }

        if (this.parent.key) {
            gr.GdiDrawText(Metadb.TitleFormat('[%artist%]', this.metadb), ThemeStyle.font, ThemeStyle.fgColor, this.x - x + this.h, this.y - y + $Z(15), this.w - this.h - $Z(50), $Z(20), DT_LV);
        }
        else {
            gr.GdiDrawText(Metadb.TitleFormat('[%album%]', this.metadb), ThemeStyle.font, ThemeStyle.fgColor, this.x - x + this.h, this.y - y + $Z(15), this.w - this.h - $Z(50), $Z(20), DT_LV);
            gr.GdiDrawText(Metadb.TitleFormat('[%album artist%]', this.metadb), ThemeStyle.smallFont, ThemeStyle.fgColor_l, this.x - x + this.h, this.y - y + $Z(40), this.w - this.h - $Z(50), $Z(20), DT_LV);
        }
        gr.GdiDrawText(this.num + '首', ThemeStyle.smallFont, ThemeStyle.fgColor_l, this.x - x + this.w - $Z(50), this.y - y + $Z(15), $Z(40), $Z(20), DT_RV);
    }
}

oLinear = function (name) {
    this.$ = new oPanel(name, false);
    this.ImageCache = new ImageCache();

    this.vScroll = new oScrollBar(name + '.vScroll', this.$, true);

    this.ascend = window.GetProperty('分组升序', true);

    this.initialized = false;
    this.sized = false;
    this.loading = false;
    this.margin = 5;
    this.select = -1;

    this.items = [];
    this.icon = null;
    this.list = null;
    this.timer = null;

    this.key = 0;

    this.Dispose = function () {
        this.initialized = false;
        this.timer && window.ClearTimeout(this.timer);
        this.timer = null;

        this.select = -1;
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].Dispose();
            delete this.items[i];
        }
        this.items.length = 0;
        this.list && this.list.Dispose();
    }

    this.getIcon = function () {
        if (this.icon) return;

        // 本地缓存中查找默认图像
        key = this.key ? 'noartist' : 'noalbum';
        var Img = Image.Get(PATH_IMAGE + key);

        if (!Img.$) {
            // 查找加载
            Img = Cover.None(this.metadb, this.key ? 4 : 0);
        }
        if (Img.$) {
            // 裁剪处理
            Img.$ = Image.Circle(Img.$, $Z(50), 2);
            this.icon = Img;
            this.icon.src = 'no';
            if (Img.$) {
                // 加入内存缓存
                // this.ImageCache.Add(key, Img);
                // 加入本地缓存
                Img.$.SaveAs(PATH_IMAGE + key);
            }
        }
    }

    this.OnTime = function () { }

    this.SetProperty = function () {
        eval(name).ascend = window.GetProperty('分组升序', true);
        eval(name).Init();
        eval(name).Size();
    }

    this.OnSize = function () {
        this.sized = true;
        this.vScroll.$.Size(this.$.x + this.$.w - 5, this.$.y, 5, this.$.h, this.$.z + 1);
        if (this.initialized) {
            this.Size();
        }
    }

    this.Init = function () {
        this.getIcon();
        this.Dispose();

        this.start = 0;
        this.end = 0;

        this.$.offsetY = 0;
        this.$.totalY = 0;

        this.list = Playlist.list.Clone();
        this.list.OrderByFormat(fb.TitleFormat(order_tf[this.key]), this.ascend ? 1 : 0);
        if (this.$.visible)
            this.Get(0, '!@#$%^&*');
    }

    this.SetVisible = function (vis) {
        this.vScroll.$.visible = vis;
        this.$.visible = vis;

        if (vis && !this.initialized) {
            this.Get(0, '!@#$%^&*');
        }
    }

    this.OnRepaint = function () {
        var i = 0;
        for (; i < this.items.length; i++) {
            if (this.items[i].y + this.items[i].h > this.$.offsetY) {
                this.start = i;
                break;
            }
        }

        while (i < this.items.length) {
            if (this.items[i].y > this.$.offsetY + this.$.h) {
                this.end = i;
                break;
            }
            i++;
        }
        if (i == this.items.length) {
            this.end = this.items.length;
        }
        if (this.start != this.end) {
            this.Load(this.start, this.end);
        }
    }

    this.Get = function (start, com) {
        var metadb = null;
        var str = '';
        var compare = com;
        var id = this.items.length;

        for (var i = start; i < this.list.Count; i++) {
            metadb = this.list.item(i);
            str = Metadb.TitleFormat(group_tf[this.key], metadb);
            if (str != compare) {
                compare = str;
                this.items.push(new oLinearItem(name, id, i, metadb));
                id++;
            }
        }
        for (var j = 0; j < this.items.length; j++) {
            var next = 0;
            if (j == this.items.length - 1)
                next = this.list.Count;
            else
                next = this.items[j + 1].idx;
            this.items[j].num = next - this.items[j].idx;
        }
        this.initialized = true;
        if (this.sized) {
            this.Size();
        }
    }

    this.Size = function () {
        if (this.items.length == 0) {
            this.$.totalY = this.$.h;
            this.vScroll.OnSize();
            return;
        }
        var last = this.items.length - 1;

        for (var i = 0; i < this.items.length; i++) {
            this.items[i].Size(this.margin);
        }
        this.$.totalY = this.items[last].y + this.items[last].h;
        this.vScroll.OnSize();
    }

    this.Load = function (from, to) {
        this.timer && window.ClearTimeout(this.timer);
        this.timer = window.SetTimeout(function () {
            eval(name).timer && window.ClearTimeout(eval(name).timer);
            eval(name).timer = null;
            eval(name).LoadImage(from, to, 25);
        }, 25);
    }

    this.LoadImage = function (from, to, sleep) {
        if (from < to) {
            if (!AnimationOn) {
                this.items[from].Load();
                from++;
            }
            this.timer && window.ClearTimeout(this.timer);
            this.timer = window.SetTimeout(function () {
                eval(name).timer && window.ClearTimeout(eval(name).timer);
                eval(name).timer = null;
                eval(name).LoadImage(from, to, sleep);
            }, sleep);
        }
    }

    this.Search = function (str) {
        var key = this.key ? '[%artist%]' : '[%album%]';
        str = utils.LCMapString(str, 0x0800, 0x02000000);
        for (var i = 0; i < this.items.length; i++) {
            var target = Metadb.TitleFormat(key, this.items[i].metadb);
            target = utils.LCMapString(target, 0x0800, 0x02000000);
            if (target.match($RegExp(str, 'i'))) {
                this.select = i;
                this.Show(i);
                return;
            }
        }
        var log = '未找到';
        log += (this.key ? '艺术家: ' : '专辑: ') + str;
        Console.Log(log);
    }

    this.Find = function (idx) {
        if (idx < 0 || idx >= Playlist.count) {
            return -1;
        }
        var location = this.list.Find(Playlist.list.item(idx));
        if (location == Math.pow(2, 32) - 1) {
            return -1;
        }
        for (var i = 0; i < this.items.length; i++) {
            // 所在组
            if (location >= this.items[i].idx && location < this.items[i].idx + this.items[i].num) {
                if (this.items[i].open) {
                    this.select = i + 1 + location - this.items[i].idx;
                    return this.select;
                } else {
                    this.select = i;
                    return i;
                }
            }
        }
        return -1;
    }

    this.Show = function (idx) {
        if (idx >= 0 && idx < this.items.length) {
            if (this.items[idx].y - this.$.offsetY < 0 || this.items[idx].y - this.$.offsetY > this.$.h - this.items[idx].h) {
                var des = this.items[idx].y - this.margin;
                this.vScroll.Show(des);
            }
            else
                this.$.Repaint();
        }
    }

    this.Menu = function (x, y) {
        var m = window.CreatePopupMenu();
        m.AppendMenuItem(0, 1, '展开全部');
        m.AppendMenuItem(0, 2, '折叠全部');
        m.AppendMenuSeparator();
        m.AppendMenuItem(0, 3, '清空图像缓存');
        var idx = m.TrackPopupMenu(x, y);
        var profiler = g_debug ? fb.CreateProfiler() : null;
        if (idx == 1) {
            var j = 0;
            for (var i = 0; i < this.items.length; i++) {
                j++;
                if (this.items[i].num && !this.items[i].open) {
                    this.items[i].CollapseOrExpand(false);
                }
            }
            this.Size();
            profiler && fb.trace('展开循环 ' + j + ' 次 耗时 ', profiler.Time + ' ms');
        } else if (idx == 2) {
            var j = 0;
            for (var i = this.items.length - 1; i >= 0; i--) {
                j++;
                if (this.items[i].num && this.items[i].open) {
                    this.items[i].CollapseOrExpand(false);
                }
            }
            this.Size();
            profiler && fb.trace('折叠循环 ' + j + ' 次 耗时 ', profiler.Time + ' ms');
        } else if (idx == 3) {
            this.ImageCache.Clear();
            Console.Log('清空完毕');
        }
        m.Dispose();
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

            case VKEY_HOME:
                this.items[this.select].CollapseOrExpand(true);
                break;
        }
    }

    this.OnMouse = function (event, x, y) {
        var blank = true;
        for (var i = this.start; i < this.end; i++) {
            if (this.items[i].OnMouse(event, x, y) > -1) {
                blank = false;
                break;
            }
        }
        switch (event) {
            case ON_MOUSE_WHEEL:
                this.vScroll.Scroll(x * 30, 4);
                break;
            case ON_MOUSE_RBTN_UP:
                if (blank) {
                    this.Menu(x, y);
                }
                break;
            default:
                break;
        }
    }

    this.OnPaint = function (gr) {
        if (this.items.length == 0) {
            gr.GdiDrawText(keys[this.key], ThemeStyle.hugeFont, ThemeStyle.fgColor, this.$.x, this.$.y, this.$.w, this.$.h, DT_CV);
            return;
        }
        gr.FillSolidRect(this.$.x, this.$.y, this.$.w, this.$.h, ThemeStyle.bgColor_l);

        for (var i = this.start; i < this.end; i++) {
            var step = 0;
            if (this.vScroll.overstep > 0) {
                step = (this.items.length - i - 1) * this.vScroll.overstep;
            }
            else if (this.vScroll.overstep < 0) {
                step = i * this.vScroll.overstep;
            }
            this.items[i].Paint(gr, 0, this.$.offsetY - this.$.y + step);
        }
    }
}

var AlbumList = null;
var ArtistList = null;
