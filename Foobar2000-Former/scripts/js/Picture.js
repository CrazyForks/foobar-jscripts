oPictureItem = function (id) {
    this.id = id;
    this.Img = new oImage();

    this.Size = function (x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    this.Dispose = function () {
        this.Img.src = null;
        Image.Clear(this.Img.$);
        this.Img.$ = null;
    }

    this.Repaint = function () {
        Picture.$.RepaintRect(this.x - Picture.$.offsetX, this.y, this.w, this.h);
    }

    this.Load = function (src) {
        if (!this.Img.src) {
            this.Img.src = src;
            this.Img.$ = gdi.Image(src);
            this.Img.$ = Image.Process(this.Img.$, this.w, this.h, IMG_STRETCH, 2);
            this.Repaint();
        }
    }

    this.DownLoad = function () {
        var url = 'http://img2-ak.lst.fm/i/u/770x0/';
        var name = $GetFn(this.Img.src);
        var ext = '.' + $GetExt(name);
        $Download(url + name, Picture.target + ext);
        AlbumArt.Monitor(Picture.target + ext);

        Picture.Close();
    }

    this.IsActive = function (xx, yy) {
        var x = xx + Picture.$.offsetX - Picture.$.x;
        var y = yy - Picture.$.y;
        if (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h)
            return true;
        else
            return false;
    }

    this.OnMouse = function (event, x, y) {
        switch (event) {
            case ON_MOUSE_LBTN_DOWN:
                if (this.IsActive(x, y)) {
                    Picture.select = this.id;
                    Picture.$.Repaint();
                    return this.id;
                }
                break;

            case ON_MOUSE_LBTN_DBLCK:
                if (this.IsActive(x, y)) {
                    this.DownLoad();
                    return this.id;
                }
                break;

            case ON_MOUSE_RBTN_UP:
                if (this.IsActive(x, y)) {
                    Picture.select = this.id;
                    Picture.$.Repaint();
                    $ImageView(this.Img.src);
                    return this.id;
                }
                break;
        }
        return -1;
    }

    this.Paint = function (gr, x, y) {
        if (this.x + x > Picture.$.x + Picture.$.w || this.x + x + this.w < Picture.$.x) return;

        Image.Draw(gr, this.Img.$, this.x + x, this.y + y, 0, Picture.$.alpha);
        if (this.id == Picture.select)
            gr.FillSolidRect(this.x + x, this.y + y, this.w, this.h, 0x80000000);
    }
}

oPicture = function (name) {
    this.$ = new oPanel(name, false);
    this.$.alpha = 0;
    this.size = 90;
    this.marginH = 0;
    this.marginV = 0;
    this.items = [];
    this.Animation = new oAnimation(name + '.Animation');
    this.hScroll = new oScrollBar(name + '.hScroll', this.$, false);
    this.$.offsetX = 0;
    this.$.totalX = 0;
    this.select = -1;
    this.folder = null;
    this.target = null;
    this.num = 0;

    var timeout = 0;
    var loaded = true;

    this.Dispose = function () {
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].Dispose();
            delete this.items[i];
        }
        this.items.length = 0;
    }

    this.Init = function () {
        this.OnBack = function () {
            eval(name).Close();
            return true;
        }
        this.Back = new oSimpleButton(name + '.Back', this.OnBack, SHAPE_SOLID);
        this.Back.Paint = function (gr) {
            gr.GdiDrawText($Font2Icon('61700') + '  返回', gdi.Font('Fontawesome', 12), ThemeStyle.fgColor, this.$.x, this.$.y, this.$.w, this.$.h, DT_CV);
        }

        this.OnClean = function () {
            eval(name).Delete();
            return true;
        }
        this.Clean = new oSimpleButton(name + '.Clean', this.OnClean, SHAPE_SOLID);
        this.Clean.Paint = function (gr) {
            gr.GdiDrawText('清空缓存 ' + $Font2Icon('61460'), gdi.Font('Fontawesome', 12), ThemeStyle.fgColor, this.$.x, this.$.y, this.$.w, this.$.h, DT_CV);
        }
    }
    this.Init();

    this.Delete = function () {
        var fso = $Fso();
        if (this.folder.length > PATH_TEMP.length) {
            try {
                fso.DeleteFolder(this.folder.replace(/^(.*)(\\)$/g, "$1"), true);
                this.folder = $GetDir(this.folder);
            }
            catch (e) {
                Console.Log(e.message);
                fso = null;
            }
        }
        fso = null;
        this.Dispose();
        this.Set(0);
    }

    this.Load = function (once) {
        var arr = utils.Glob(this.folder + "*.*").toArray();
        var last = this.items.length;

        if (arr.length != this.items.length) {
            var nonexistent = [];
            if (once)
                nonexistent = arr;
            else {
                for (var i = 0; i < arr.length; i++) {
                    var j = 0;
                    for (; j < last; j++) {
                        if (arr[i] == this.items[j].Img.src) {
                            break;
                        }
                    }
                    if (j == last) {
                        nonexistent.push(arr[i]);
                    }
                }
            }
            this.Set(arr.length);
            for (var i = 0; i < nonexistent.length; i++) {
                this.items[i + last].Load(nonexistent[i]);
            }
        }

        if (timeout > 5) {
            this.num = 0;
            this.$.Repaint();
            return;
        }
        this.$.Repaint();
        if (this.items.length < this.num) {
            timeout++;
            window.SetTimeout(function () {
                eval(name).Load();
            }, 1000);
        } else {
            this.num = 0;
            this.$.Repaint();
            return;
        }
    }

    this.OnOpen = function (needload) {
        if (needload) {
            window.SetTimeout(function () {
                eval(name).Load(true);
            }, 500);
        }
    }

    this.Open = function (folder, target, num) {
        this.SetVisible(true);
        this.$.alpha = 0;
        timeout = 0;

        if (this.folder != folder) {
            this.folder = folder;
            this.target = target;
            this.num = typeof (num) == 'undefined' ? 0 : num;
            loaded = true;
            if (this.items.length) {
                this.Dispose();
                this.Set(0);
            }
        }
        this.Animation.SSA(this.$, null, Main.$.y + Main.$.h - 250, null, null, null, 255, true, 4, this.OnOpen(loaded));
    }

    this.OnClose = function () {
        eval(name).SetVisible(false);
    }

    this.Close = function () {
        this.Animation.SSA(this.$, null, Main.$.y + Main.$.h, null, null, null, 0, true, 4, this.OnClose);
    }

    this.OnSize = function (resize) {
        if (resize) {
            this.col = Math.ceil((this.$.w - 10) / this.size) - 1;
            this.row = Math.ceil((this.$.h - 50) / this.size) - 1;
            this.marginH = Math.floor((this.$.w - this.col * this.size) / (this.col + 1));
            this.marginV = Math.floor((this.$.h - 40 - this.row * this.size) / (this.row + 1));
        }

        this.hScroll.$.Size(this.$.x, this.$.y + this.$.h - 10, this.$.w, 10, this.$.z + 1);
        this.Back.$.Size(this.$.x, this.$.y, 60, 30, this.$.z + 1);
        this.Clean.$.Size(this.$.x + this.$.w - 80, this.$.y, 80, 30, this.$.z + 1);
    }

    this.Set = function (num) {
        for (var i = this.items.length; i < num; i++) {
            this.items.push(new oPictureItem(i));
            if (i >= this.row * this.col) {
                this.items[i].Size(this.items[i - this.row * this.col].x + this.$.w, this.items[i - this.row * this.col].y, this.size, this.size);
            }
            else {
                for (var j = 1; j < this.row + 1; j++) {
                    if (i < j * this.col) {
                        this.items[i].Size(this.marginH + (i - (j - 1) * this.col) * (this.marginH + this.size), 30 + this.marginV + (j - 1) * (this.marginV + this.size), this.size, this.size);
                        break;
                    }
                }
            }
        }
        this.$.offsetX = 0;
        this.$.totalX = Math.ceil(num / (this.row * this.col)) * this.$.w;
        this.hScroll.OnSize();
    }

    this.SetVisible = function (vis) {
        this.hScroll.$.visible = vis;
        this.Back.$.visible = vis;
        this.Clean.$.visible = vis;
        this.$.visible = vis;
    }

    this.Show = function (idx) {
        if (idx >= 0 && idx < this.items.length) {
            if (this.items[idx].x - this.$.offsetX < 0 || this.items[idx].x - this.$.offsetX > this.$.w) {
                var des = this.items[idx].x - this.marginH;
                this.hScroll.Show(des);
            }
            else
                this.$.Repaint();
        }
    }

    this.OnKey = function (vkey) {
        this.hScroll.OnKey(vkey);
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
                if (this.select > -1)
                    this.items[this.select].DownLoad();
                break;

            case VKEY_ESC:
                this.Close();
                break;
        }
    }

    this.Menu = function (x, y) {
        var m = window.CreatePopupMenu();
        m.AppendMenuItem(0, 1, '刷新');
        m.AppendMenuItem(0, 2, '打开当前路径');
        var idx = m.TrackPopupMenu(x, y);
        if (idx == 1)
            this.Load();
        else if (idx == 2)
            $Explorer(this.folder);
    }

    this.OnMouse = function (event, x, y) {
        var blank = true;
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].OnMouse(event, x, y) > -1) {
                blank = false;
                break;
            }
        }
        if (event == ON_MOUSE_RBTN_UP && blank)
            this.Menu(x, y);
        if (event == ON_MOUSE_WHEEL)
            this.hScroll.Scroll(x * 30, 4);
    }

    this.OnPaint = function (gr) {
        gr.FillSolidRect(this.$.x, this.$.y, this.$.w, this.$.h, $SetAlpha(ThemeStyle.bgColor_l, this.$.alpha));
        gr.FillSolidRect(this.$.x, this.$.y, this.$.w, 30, $SetAlpha(ThemeStyle.bgColor, this.$.alpha));

        gr.GdiDrawText(this.folder, ThemeStyle.smallFont, ThemeStyle.fgColor, this.$.x + 65, this.$.y, this.$.w - 150, 30, DT_CV);

        if (this.num > 0 && this.items.length < this.num)
            gr.DrawLine(this.$.x, this.$.y + 31, this.$.x + Math.floor(this.items.length / this.num * this.$.w), this.$.y + 31, 2, $SetAlpha(ThemeStyle.color, this.$.alpha));
        else if (loaded) {
            loaded = false;
            gr.DrawLine(this.$.x, this.$.y + 31, this.$.x + this.$.w, this.$.y + 31, 2, $SetAlpha(ThemeStyle.color, this.$.alpha));
            window.SetTimeout(function () {
                eval(name).$.Repaint();
            }, 500);
        }
        gr.DrawLine(this.$.x, this.$.y + 30, this.$.x + this.$.w, this.$.y + 30, 1, $SetAlpha(ThemeStyle.fgColor_l, 128));

        for (var i = 0; i < this.items.length; i++) {
            this.items[i].Paint(gr, this.$.x - this.$.offsetX, this.$.y);
        }
    }
}

var Picture = null;

function APicture(folder, target, num) {
    if (Picture) {
        if (Picture.$.visible) {
            Picture.Close();
        }
        else {
            Picture.$.Size(0, Main.$.y + Main.$.h, ww, 250, 40);
            Picture.Open(folder, target, num);
        }
    }
    else {
        Picture = new oPicture('Picture');
        Picture.$.Size(0, Main.$.y + Main.$.h, ww, 250, 40);
        Panel.Sort();
        Picture.Open(folder, target, num);
    }
}