/* 实例化示例
var items = [];
for (var i = 0; i < num; i++) {
    items.push(new oActivityItem(i));
}
AActivity(title, items);

oActivityItem = function (id) {
    this.id = id;

    this.Size = function (x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    this.Dispose = function () {
        //clear new
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
        }
        return -1;
    }

    this.Paint = function (gr, x, y) {
        if (this.y + y + this.h < Activity.$.y || this.y + y > Activity.$.y + Activity.$.h) return;

        if (this.id == Activity.select)
            gr.FillSolidRect(this.x + x, this.y + y, this.w, this.h, ThemeStyle.bgColor_hl);
    }
}*/

oActivity = function (name) {
    this.$ = new oPanel(name, false);
    this.$.alpha = 0;
    this.select = -1;
    this.tile = '';
    this.TopHeight = $Z(40);
    this.items = [];

    this.Animation = new oAnimation(name + '.Animation');

    this.vScroll = new oScrollBar(name + '.vScroll', this.$, true);
    this.$.offsetY = 0;
    this.$.totalY = 0;

    this.Dispose = function () {
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].Dispose();
            delete this.items[i];
        }
        this.items.length = 0;
    }

    this.Init = function () {
        this.OnBack = function () {
            $Invoke(name, 'Close');
            return true;
        }
        this.Back = new oSimpleButton(name + '.Back', this.OnBack, SHAPE_SOLID);
        var fontAwe = gdi.Font('Fontawesome', $Z(15));
        this.Back.Paint = function (gr) {
            gr.GdiDrawText($Font2Icon('61700') + '  返回', fontAwe, 0xffffffff, this.$.x, this.$.y, this.$.w, this.$.h, DT_CV);
        }
    }
    this.Init();

    this.OnOpen = function () {
        $Invoke(name, 'SetVisible', true);
        Panel.Mouse(ON_MOUSE_MOVE, Mouse.x, Mouse.y);
        $Invoke(name, 'Load');
    }

    this.Open = function (title, items) {
        this.$.x = ww;
        this.vScroll.$.visible = true;
        this.Back.$.visible = true;
        this.$.visible = true;
        this.$.alpha = 0;
        this.title = title;
        this.Set(items);
        this.Animation.SSA(this.$, 0, null, null, null, null, 255, true, 4, this.OnOpen);
    }

    this.OnClose = function () {
        $Invoke(name, 'SetVisible', false);
        $Invoke(name, 'Dispose');
    }

    this.Close = function () {
        ActivityMain(true);
        this.Animation.SSA(this.$, ww, null, null, null, null, 0, true, 4, this.OnClose);
    }

    this.OnSize = function () {
        this.vScroll.$.Size(this.$.x + this.$.w - 5, this.$.y + this.TopHeight, 5, this.$.h - this.TopHeight, this.$.z + 1);
        this.Back.$.Size(this.$.x, this.$.y, this.TopHeight * 2, this.TopHeight, this.$.z + 1);
    }

    this.Set = function (items) {
        this.Dispose();
        this.items = items;

        this.$.offsetY = 0;
        if (this.items.length > 0)
            this.$.totalY = this.items[this.items.length - 1].y + this.items[this.items.length - 1].h;
        else
            this.$.totalY = 0;

        this.vScroll.OnSize();
    }

    this.SetVisible = function (vis) {
        this.vScroll.$.visible = vis;
        this.Back.$.visible = vis;
        this.$.visible = vis;
        ActivityMain(!vis);
    }

    this.Show = function (idx) {
        if (idx >= 0 && idx < this.items.length) {
            if (this.items[idx].y - this.$.offsetY < 0 || this.items[idx].y - this.$.offsetY > this.$.h - this.TopHeight) {
                var des = this.items[idx].y - this.TopHeight;
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
                break;

            case VKEY_ESC:
                this.Close();
                break;
        }
    }

    this.Menu = function (x, y) {
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
            this.vScroll.Scroll(x * 30, 4);
    }

    this.OnPaint = function (gr) {
        gr.FillSolidRect(this.$.x, this.$.y, this.$.w, this.$.h, $SetAlpha(ThemeStyle.bgColor, this.$.alpha));
        for (var i = 0; i < this.items.length; i++) {
            var step = 0;
            if (this.vScroll.overstep > 0) {
                step = (this.items.length - i) * this.vScroll.overstep;
            }
            else if (this.vScroll.overstep < 0) {
                step = i * this.vScroll.overstep;
            }
            this.items[i].Paint(gr, this.$.x, this.$.y - this.$.offsetY - step);
        }

        gr.FillSolidRect(this.$.x, this.$.y, this.$.w, this.TopHeight, $SetAlpha($SetAlpha(ThemeStyle.bgColor_hl, 255), this.$.alpha));
        //gr.GdiDrawText($Font2Icon('61700') + '  返回', gdi.Font('Fontawesome', 15), $RGB(255, 255, 255), this.$.x, this.$.y, this.TopHeight * 2, this.TopHeight, DT_CV);
    }
}

var Activity = null;

function AActivity(title, items) {
    if (Activity) {
        if (Activity.$.visible) {
            Activity.Close();
        }
        else {
            Activity.$.Size(0, 0, ww, wh, 35);
            Activity.Open(title, items);
        }
    }
    else {
        Activity = new oActivity('Activity');
        Activity.$.Size(0, 0, ww, wh, 35);
        Panel.Sort();
        Activity.Open(title, items);
    }
}