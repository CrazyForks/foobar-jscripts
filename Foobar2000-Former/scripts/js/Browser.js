// mode
BROWSER_ALBUM = 0;
BROWSER_ARTIST = 1;

ORIENTATION_VERTICAL = 0;
ORIENTATION_HORIZONTAL = 1;
ORIENTATION_BASELINE = 2;

var keys = ['专辑', '艺术家'];
var group_tf = ['[%album%-][%album artist%]', '[%artist%]'];
var order_tf = ['%album% - %album artist% - %discnumber% - %tracknumber% - %filename% - %title%',
    '%artist% - %album% - %album artist% - %discnumber% - %tracknumber% - %filename% - %title%'];

oBrowserItem = function (parentName, id, idx, metadb) {
    this.id = id;
    this.idx = idx;
    this.metadb = metadb;
    this.parent = eval(parentName);
    this.Img = null;
    this.col = 0;
    this.row = 0;
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
    this.num = 0;

    this.Dispose = function () {
        this.metadb = null;
        this.Img = null;
    }

    this.Open = function () {
        if (!Group) {
            Group = new oGroup('Group');
            Group.$.Size(0, 0, ww, wh, 30);
            Panel.Sort();
        }

        var list = plman.GetPlaylistItems(-1);
        for (var i = 0; i < this.num; i++) {
            list.Add(this.parent.list.item(i + this.idx));
        }

        var x = this.x - this.parent.$.offsetX + this.parent.$.x;
        var w = this.w;
        if (x < this.parent.$.x) {
            w = (w - (this.parent.$.x - x)).Limit(0, this.w);
            x = this.parent.$.x;
        } else if (x + this.w > this.parent.$.x + this.parent.$.w) {
            w = (this.parent.$.x + this.parent.$.w - x).Limit(0, this.w);
            x = this.parent.$.x + this.parent.$.w - w;
        }

        var y = this.y - this.parent.$.offsetY + this.parent.$.y;
        var h = this.h;
        if (y < this.parent.$.y) {
            h = (h - (this.parent.$.y - y)).Limit(0, this.h);
            y = this.parent.$.y;
        } else if (y + this.h > this.parent.$.y + this.parent.$.h) {
            h = (this.parent.$.y + this.parent.$.h - y).Limit(0, this.h);
            y = this.parent.$.y + this.parent.$.h - h;
        }

        Group.Set(x, y, w, h, this.parent.key == BROWSER_ALBUM ? 0 : 4,
            Metadb.TitleFormat(this.parent.key ? '[%artist%]' : '[%album%]', this.metadb), list);
        Group.Open(this.Img.src);
    }

    this.Size = function (margin) {
        if (this.row == 1) return;

        var lt = this.parent.Exist(this.row - 1, this.col - 1);
        var t = this.parent.Exist(this.row - 1, this.col);
        var rt = this.parent.Exist(this.row - 1, this.col + 1);

        var y1 = 0, y2 = 0, y3 = 0;

        if (lt > -1 && this.x < this.parent.items[lt].x + this.parent.items[lt].w + margin / 2)
            y1 = this.parent.items[lt].y + this.parent.items[lt].h + margin;
        if (t > -1)
            y2 = this.parent.items[t].y + this.parent.items[t].h + margin;
        if (rt > -1 && this.x + this.w > this.parent.items[rt].x - margin / 2)
            y3 = this.parent.items[rt].y + this.parent.items[rt].h + margin;

        var result = Math.max(y1, y2, y3);
        if (result > 0) {
            this.y = result;
        }

        var l = this.parent.Exist(this.row, this.col - 1);
        if (l > -1 && result >= this.parent.items[l].y + this.parent.items[l].h + margin) {
            this.row++;
            this.col--;
            this.x = this.parent.items[l].x;
            this.Size(margin);
        } else if (l > -1 && lt > -1 && result + this.h + margin <= this.parent.items[l].y) {
            if (this.x > this.parent.items[lt].x + this.parent.items[lt].w + margin) {
                this.x = this.parent.items[lt].x + this.parent.items[lt].w + margin;
            }
        }
    }

    this.Load = function (prev, size, margin, max) {
        if (this.Img) return;

        if (prev == 0) {
            this.x = margin;
            this.y = margin;
            this.col = 1;
            this.row = 1;
        }
        else {
            this.x += prev.x + prev.w + margin;
            this.col = prev.col + 1;
            this.y = prev.y;
            this.row = prev.row;
        }

        var key = Metadb.TitleFormat(this.parent.key ? '[%artist%]' : '[%album%-][%album artist%]', this.metadb);

        var profiler = g_debug ? fb.CreateProfiler() : null;

        if (this.parent.ImageCache.Contains(key)) {
            // 内存缓存中查找
            this.Img = this.parent.ImageCache.Get(key);
            if (profiler)
                fb.trace('从内存加载' + key + '耗时：', profiler.Time + ' ms');
        } else {
            // 查找加载
            this.Img = AlbumArt.Get(this.metadb, this.parent.key ? 4 : 0, true, true);
            var needProcess = true;
            if (!this.Img.$) {
                // 默认图像
                key = this.parent.key ? 'noartist' : 'noalbum';
                if (this.parent.ImageCache.Contains(key)) {
                    // 内存缓存中查找
                    this.Img = this.parent.ImageCache.Get(key);
                    if (profiler)
                        fb.trace('从内存加载' + key + '耗时：', profiler.Time + ' ms');
                    needProcess = false;
                } else {
                    this.Img = Cover.None(this.metadb, this.parent.key ? 4 : 0);
                }
            }
            if (needProcess) {
                // 裁剪处理
                switch (this.parent.type) {
                    default:

                    case ORIENTATION_VERTICAL:
                        this.Img.$ = Image.Process(this.Img.$, size - 10, size - 10, IMG_FILL, 2);
                        if (this.Img.$.Width > size - 10) {
                            var _x = Math.floor((this.Img.$.Width - size) / 2 + 5);
                            this.Img.$ = Image.Cut(this.Img.$, _x, 0, size - 10, this.Img.$.Height);
                        }
                        break;

                    case ORIENTATION_HORIZONTAL:
                        this.Img.$ = Image.Process(this.Img.$, size - 10, size - 10, IMG_FILL, 2);
                        if (this.Img.$.Height > size - 50) {
                            var _y = Math.floor((this.Img.$.Height - size) / 2 + 5);
                            this.Img.$ = Image.Cut(this.Img.$, 0, _y, this.Img.$.Width, size - 10);
                        }
                        break;

                    case ORIENTATION_BASELINE:
                        this.Img.$ = Image.Process(this.Img.$, size - 10, size - 10, IMG_CROP, 2);
                        break;
                }
                if (this.Img.$) {
                    // 加入内存缓存
                    this.parent.ImageCache.Add(key, this.Img);
                    if (profiler)
                        fb.trace('从硬盘加载' + key + '耗时：', profiler.Time + ' ms');
                }
            }
        }
        profiler = null;
        this.w = this.Img.$.Width + $Z(10);
        this.h = this.Img.$.Height + $Z(50);

        // 转行
        if (this.col > this.parent.col) {
            this.x = margin;
            this.col = 1;
            this.y += prev.h + margin;
            this.row = prev.row + 1;
        }
        this.Size(margin);
        return true;
    }

    this.IsActive = function (xx, yy) {
        var x = xx + this.parent.$.offsetX - this.parent.$.x;
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
                    this.Open();
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
        if (!this.Img) return;
        if (this.x - x >= this.parent.$.x + this.parent.$.w || this.y - y >= this.parent.$.y + this.parent.$.h) return;
        if (this.x - x + this.w <= this.parent.$.x || this.y - y + this.h <= this.parent.$.y) return;

        gr.FillSolidRect(this.x - x, this.y - y, this.w, this.h, ThemeStyle.bgColor);
        if (this.parent.select == this.id)
            gr.FillSolidRect(this.x - x, this.y - y, this.w, this.h, ThemeStyle.bgColor_hl);

        Image.Draw(gr, this.Img.$, this.x - x + $Z(5), this.y - y + $Z(5), 0, 255);
        if (this.parent.key) {
            gr.GdiDrawText(Metadb.TitleFormat('[%artist%]', this.metadb), ThemeStyle.font, ThemeStyle.fgColor, this.x + $Z(10) - x, this.y - y + this.h - $Z(40), this.w - $Z(20), $Z(20), DT_LV);
        }
        else {
            gr.GdiDrawText(Metadb.TitleFormat('[%album%]', this.metadb), ThemeStyle.font, ThemeStyle.fgColor, this.x + $Z(10) - x, this.y - y + this.h - $Z(40), this.w - $Z(20), $Z(20), DT_LV);
            gr.GdiDrawText(Metadb.TitleFormat('[%album artist%]', this.metadb), ThemeStyle.smallFont, ThemeStyle.fgColor_l, this.x + $Z(10) - x, this.y - y + this.h - $Z(20), this.w - $Z(50), $Z(20), DT_LV);
        }
        gr.GdiDrawText(this.num + '首', ThemeStyle.smallFont, ThemeStyle.fgColor_l, this.x - x + this.w - $Z(45), this.y - y + this.h - $Z(20), $Z(40), $Z(20), DT_RV);
    }
}

oBrowser = function (name) {
    this.$ = new oPanel(name, false);
    this.ImageCache = new ImageCache();

    this.vScroll = new oScrollBar(name + '.vScroll', this.$, true, false);
    this.hScroll = new oScrollBar(name + '.hScroll', this.$, false, false);

    this.ascend = window.GetProperty('分组升序', true);
    this.size = window.GetProperty('分组大小', 200);
    this.size = $Z(this.size);
    this.type = window.GetProperty('分组显示模式', 0);
    this.auto = window.GetProperty('分组后台加载', false);
    this.speed = window.GetProperty('分组加载速度', 5);

    this.initialized = false;
    this.sized = false;
    this.margin = 10;
    this.col = 0;
    this.num = 0;
    this.load = 0;
    this.loading = false;
    this.select = -1;

    this.items = [];
    this.list = null;
    this.timer = null;

    this.key = 0;

    this.Dispose = function () {
        this.initialized = false;
        if (Group && Group.$.visible)
            Group.Close();
        this.timer && window.ClearTimeout(this.timer);
        this.timer = null;

        this.load = 0;
        this.select = -1;
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].Dispose();
            delete this.items[i];
        }
        this.items.length = 0;
        this.list && this.list.Dispose();
    }

    this.OnTime = function () {
        if (this.loading) return;
        if (!this.auto || !this.initialized) return;
        if (this.load == this.items.length) return;
        if (this.speed <= 0) return;
        if (this.speed > 10)
            this.speed = 10;

        var des = Math.min(this.load + this.num, this.items.length);
        var sleep = Math.floor(500 / this.speed);
        this.LoadImage(des, sleep);
    }

    this.SetProperty = function () {
        eval(name).ascend = window.GetProperty('分组升序', true);
        var size = eval(name).size;
        eval(name).size = window.GetProperty('分组大小', 200);
        var type = eval(name).type;
        eval(name).type = window.GetProperty('分组显示模式', 0);

        if (eval(name).size != size || eval(name).type != type) {
            // 刷新缓存
            eval(name).ImageCache.Clear();
        }
        eval(name).col = Math.floor(eval(name).$.w / eval(name).size);
        eval(name).num = (Math.ceil(eval(name).$.h / eval(name).size) + 2) * eval(name).col;
        eval(name).Init();
    }

    this.SetControl = function () {
        eval(name).auto = window.GetProperty('分组后台加载', false);
        eval(name).speed = window.GetProperty('分组加载速度', 5);
    }

    this.OnSize = function (resize) {
        if (resize) {
            this.col = Math.floor(this.$.w / this.size);
            this.num = (Math.ceil(this.$.h / this.size) + 2) * this.col;
        }
        this.sized = true;
        this.vScroll.$.Size(this.$.x + this.$.w - 15, this.$.y, 15, this.$.h, this.$.z + 1);
        this.hScroll.$.Size(this.$.x, this.$.y + this.$.h - 15, this.$.w, 15, this.$.z + 1);
    }

    this.Exist = function (i, j) {
        do {
            for (var k = 0; k < this.items.length; k++) {
                if (this.items[k].row == i && this.items[k].col == j)
                    return k;
            }
            i--;
        } while (i > 0);

        return -1;
    }

    this.Init = function () {
        this.Dispose();

        this.start = 0;
        this.$.offsetX = 0;
        this.$.totalX = 0;
        this.$.offsetY = 0;
        this.$.totalY = 0;

        this.list = Playlist.list.Clone();
        this.list.OrderByFormat(fb.TitleFormat(order_tf[this.key]), this.ascend ? 1 : 0);
        if (this.$.visible || this.auto)
            this.Get(0, '!@#$%^&*');
    }

    this.SetVisible = function (vis) {
        this.vScroll.$.visible = vis;
        this.hScroll.$.visible = vis;
        this.$.visible = vis;

        if (vis && !this.initialized) {
            this.Get(0, '!@#$%^&*');
            this.OnRepaint();
        }
    }

    this.OnRepaint = function () {
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].y + this.items[i].h > this.$.offsetY) {
                this.start = i;
                break;
            }
        }

        var des = Math.min(this.start + this.num, this.items.length);
        if (this.load < des && !this.loading) {
            this.Load(des);
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
                this.items.push(new oBrowserItem(name, id, i, metadb));
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
            this.OnSize();
        }
    }

    this.Load = function (des) {
        this.timer && window.ClearTimeout(this.timer);
        this.timer = window.SetTimeout(function () {
            eval(name).timer && window.ClearTimeout(eval(name).timer);
            eval(name).timer = null;
            eval(name).LoadImage(des, 25);
        }, 5);
    }

    this.LoadImage = function (des, sleep) {
        if (this.load < Math.min(des, this.items.length)) {
            this.loading = true;
            if (!this.auto || !AnimationOn) {
                if (this.items[this.load].Load(this.load > 0 ? this.items[this.load - 1] : 0, this.size, this.margin, Math.max(this.$.totalX, this.$.w))) {
                    var totalX = this.items[this.load].x + this.items[this.load].w + this.margin;
                    var totalY = this.items[this.load].y + this.items[this.load].h + this.margin;
                    if (this.vScroll.need) {
                        totalX += this.vScroll.$.w;
                    }
                    if (this.hScroll.need) {
                        totalY += this.hScroll.$.h;
                    }
                    this.$.totalX = Math.max(totalX, this.$.totalX);
                    this.$.totalY = Math.max(totalY, this.$.totalY);
                    if (this.$.totalY > this.$.h || this.$.totalX > this.$.w)
                        this.OnSize();
                    else
                        this.$.Repaint();
                }
                this.load++;
                PlaylistTop && PlaylistTop.Update();
            }

            window.SetTimeout(function () {
                eval(name).LoadImage(des, sleep);
            }, sleep);
        }
        else {
            this.loading = false;
            if (this.load == this.items.length) {
                Console.Log('分组加载完成');
            }
        }
    }

    this.Search = function (str) {
        var key = this.key ? '[%artist%]' : '[%album%]';
        str = utils.LCMapString(str, 0x0800, 0x02000000);
        for (var i = 0; i < this.load; i++) {
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
        for (var i = 0; i < this.load; i++) {
            if (location >= this.items[i].idx && location < this.items[i].idx + this.items[i].num) {
                this.select = i;
                return i;
            }
        }
        return -1;
    }

    this.Show = function (idx) {
        if (idx >= 0 && idx < this.load) {
            if (this.items[idx].x - this.$.offsetX < 0 || this.items[idx].x - this.$.offsetX > this.$.w - this.items[idx].w) {
                this.$.offsetX = this.items[idx].x - this.margin;
                this.hScroll.Update();
            }
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
        m.AppendMenuItem(0, 1, '清空图像缓存');
        var idx = m.TrackPopupMenu(x, y);
        if (idx == 1) {
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
                if (this.select < this.load - 1) {
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
                this.items[this.select].Open();
                break;
        }
    }

    this.OnMouse = function (event, x, y) {
        var blank = true;
        for (var i = this.start; i < this.items.length; i++) {
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

        for (var i = this.start; i < this.items.length; i++) {
            var step = 0;
            if (this.load == this.items.length && this.vScroll.overstep > 0) {
                step = (this.items.length - i - 1) * this.vScroll.overstep;
            }
            else if (this.vScroll.overstep < 0) {
                step = i * this.vScroll.overstep;
            }
            this.items[i].Paint(gr, this.$.offsetX - this.$.x, this.$.offsetY - this.$.y + step);
        }
        if (this.vScroll.need && this.hScroll.need)
            gr.FillSolidRect(this.$.x + this.$.w, this.$.y + this.$.h, this.vScroll.$.w, this.hScroll.$.h, ThemeStyle.bgColor_l);
    }
}

Browser = {
    SetProperty: function () {
        AlbumBrowser && AlbumBrowser.SetProperty();
        ArtistBrowser && ArtistBrowser.SetProperty();
        AlbumList && AlbumList.SetProperty();
        ArtistList && ArtistList.SetProperty();
    },

    SetControl: function () {
        AlbumBrowser && AlbumBrowser.SetControl();
        ArtistBrowser && ArtistBrowser.SetControl();
    }
}

var AlbumBrowser = null;
var ArtistBrowser = null;