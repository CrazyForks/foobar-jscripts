TYPE_CHECK = 0;
TYPE_RADIO = 1;

SHAPE_ELLIPSE = 0;
SHAPE_SOLID = 1;
SHAPE_RECT = 2;

ENABLE_NONE = 0;
ENABLE_DRAG = 1;
ENABLE_SELECT = 2;

IDC_ARROW = 32512;
IDC_HAND = 32649;
IDC_IBEAM = 32513;

VKEY_BACK = 0x08;
VKEY_RETURN = 0x0D;
VKEY_ESC = 0x1B;
VKEY_HOME = 0x24;
VKEY_LEFT = 0x25;
VKEY_UP = 0x26;
VKEY_RIGHT = 0x27;
VKEY_DOWN = 0x28;
VKEY_DELETE = 0x2E;

STATE_NORMAL = 0;
STATE_HOVER = 1;
STATE_DOWN = 2;

SCROLL_ITERATION = 5;

/*
new oCheckBar(name, str, state, func, type);
Exclusive()：单选排他
Able(able): 允许/禁止
func(): 回调
*/
oCheckBar = function (name, str, state, func, type) {
    this.$ = new oPanel(name, false);
    this.state = state;
    this.type = type;
    this.str = str;
    this.gray = false;

    this.OnSize = function (resize) {
        if (!resize) return;
        var w = $Calc(this.str, ThemeStyle.smallFont, true) + $Z(20);
        if (w > this.$.w)
            w = this.$.w;
        this.$.w = w;
    }

    this.Activate = function () {
        if (this.gray) return;
        window.SetCursor(IDC_HAND);
    }

    this.Invalid = function () {
        if (this.gray) return;
        window.SetCursor(IDC_ARROW);
    }

    this.Exclusive = function () {
        this.state = false;
        this.$.Repaint();
    }

    this.Able = function (able) {
        this.gray = able;
        this.$.Repaint();
    }

    this.OnMouse = function (event, x, y) {
        switch (event) {
            case ON_MOUSE_LBTN_UP:
                if (this.gray) return;
                if (this.type == TYPE_CHECK) {
                    this.state = this.state ? false : true;
                    this.$.Repaint();
                    func(this.state);
                }
                else if (!this.state) {
                    this.state = true;
                    this.$.Repaint();
                    func();
                }
                break;
        }
    }

    this.OnPaint = function (gr) {
        var color = this.gray ? ThemeStyle.fgColor_l : ThemeStyle.fgColor;
        if (this.type == TYPE_RADIO) {
            gr.SetSmoothingMode(2);
            gr.DrawEllipse(this.$.x + $Z(1), this.$.y + $Z(5), $Z(10), $Z(10), $Z(2), $SetAlpha(color, 128));
            gr.DrawEllipse(this.$.x + $Z(1), this.$.y + $Z(5), $Z(10), $Z(10), $Z(1), color);
            if (this.state)
                gr.FillEllipse(this.$.x + $Z(3), this.$.y + $Z(7), $Z(6), $Z(6), color);
            gr.SetSmoothingMode(0);
        }
        else {
            gr.DrawRect(this.$.x + $Z(1), this.$.y + $Z(5), $Z(10), $Z(10), $Z(2), $SetAlpha(color, 192));
            if (this.state)
                gr.FillSolidRect(this.$.x + $Z(3), this.$.y + $Z(7), $Z(6), $Z(6), color);
        }
        gr.GdiDrawText(this.str, ThemeStyle.smallFont, this.gray ? ThemeStyle.fgColor_l : ThemeStyle.fgColor, this.$.x + $Z(15), this.$.y, this.$.w - $Z(20), this.$.h, DT_LV);
    }
}

/*
new oDragBar(name, OnDrag[, Pos])：实例化拖曳条
OnDrag = function(x, y, w, h){}：回调函数
Pos = image：拖拽点
x,y记录当前值
*/
oDragBar = function (name, func, Pos) {
    this.$ = new oPanel(name, false);
    this.Pos = { Width: 0, Height: 0 };
    if (Image.IsImage(Pos)) {
        this.Pos.Width = Pos.Width;
        this.Pos.Height = Pos.Height;
    }
    this.x = 0;
    this.y = 0;

    this.OnSize = function (resize) {
        if (!resize) return;
        this.marginH = Math.floor(this.Pos.Width / 2);
        this.marginV = Math.floor(this.Pos.Height / 2);
        this.w = this.$.w - 2 * this.marginH;
        this.h = this.$.h - 2 * this.marginV;
    }

    this.Activate = function () {
        window.SetCursor(IDC_HAND);
    }

    this.Invalid = function () {
        Drag.End();
        window.SetCursor(IDC_ARROW);
    }

    this.OnKey = function (vkey) {
        if (vkey == VKEY_UP || vkey == VKEY_LEFT || vkey == VKEY_DOWN || vkey == VKEY_RIGHT) {
            switch (vkey) {
                case VKEY_UP:
                case VKEY_LEFT:
                    this.x -= 1;
                    this.y -= 1;
                    break;

                case VKEY_DOWN:
                case VKEY_RIGHT:
                    this.x += 1;
                    this.y += 1;
                    break;
            }
            if (this.x < 0) this.x = 0;
            else if (this.x > this.w) this.x = this.w;

            if (this.y < 0) this.y = 0;
            else if (this.y > this.h) this.y = this.h;

            func(this.x, this.y, this.w, this.h);
        }
    }

    this.OnMouse = function (event, x, y) {
        switch (event) {
            case ON_MOUSE_LBTN_DOWN:
                Drag.Start(x, y);
                this.x = x - (this.$.x + this.marginH);
                this.y = y - (this.$.y + this.marginV);
                func(this.x, this.y, this.w, this.h);
                break;

            case ON_MOUSE_MOVE:
                if (Drag.Move(x, y)) {
                    this.x = x - (this.$.x + this.marginH);
                    this.y = y - (this.$.y + this.marginV);

                    if (this.x < 0) this.x = 0;
                    else if (this.x > this.w) this.x = this.w;

                    if (this.y < 0) this.y = 0;
                    else if (this.y > this.h) this.y = this.h;

                    func(this.x, this.y, this.w, this.h);
                }
                break;

            case ON_MOUSE_LBTN_UP:
                Drag.End();
                break;

            case ON_MOUSE_WHEEL:
                this.x -= x;
                this.y -= x;

                if (this.x < 0) this.x = 0;
                else if (this.x > this.w) this.x = this.w;

                if (this.y < 0) this.y = 0;
                else if (this.y > this.h) this.y = this.h;

                func(this.x, this.y, this.w, this.h);
                break;

            default:
                break;
        }
    }
}

/*
new oButton(name, delta, func, bg, anime)：window10风格按钮
bool func = function(){}：回调函数 （点击后需要刷新则返回 true ）
Paint(gr)
*/
oButton = function (name, delta, func, bg, anime) {
    this.$ = new oPanel(name, false);
    this.state = STATE_NORMAL;
    this.delta = delta;
    this.alpha = 0;
    this.bg = bg;
    this.anime = anime;
    this.Animation = anime ? new oAnimation(name + '.Animation') : null;

    this.OnPaint = function (gr) {
        if (this.bg) {
            gr.FillSolidRect(this.$.x, this.$.y, this.$.w, this.$.h, ThemeStyle.bgColor_l);
            gr.DrawRect(this.$.x, this.$.y, this.$.w - 1, this.$.h - 1, 1, $SetAlpha(ThemeStyle.fgColor_l, 128));
        }
        if (this.state == STATE_HOVER) {
            gr.FillSolidRect(this.$.x, this.$.y, this.$.w, this.$.h, $SetAlpha(ThemeStyle.bgColor, this.alpha));
            gr.DrawRect(this.$.x, this.$.y, this.$.w - 1, this.$.h - 1, 1, $SetAlpha(ThemeStyle.fgColor_hl, this.alpha));
        }
        else if (this.state == STATE_DOWN) {
            gr.FillSolidRect(this.$.x, this.$.y, this.$.w, this.$.h, $SetAlpha(ThemeStyle.bgColor_l, 128));
            gr.DrawRect(this.$.x, this.$.y, this.$.w - 1, this.$.h - 1, 1, $SetAlpha(ThemeStyle.fgColor_hl, 128));
        }
        if (this.delta) {
            if (Image.IsImage(this.delta))
                Image.Draw(gr, this.delta, this.$.x, this.$.y, 0, 255);
            else
                gr.GdiDrawText(this.delta, ThemeStyle.smallFont, ThemeStyle.fgColor, this.$.x, this.$.y, this.$.w, this.$.h, DT_CVN);
        }
        if (typeof (this.Paint) != 'undefined') this.Paint(gr);
    }

    this.Activate = function () {
        this.state = STATE_HOVER;
        if (this.anime)
            this.Animation.Alpha(this, 0, 255, this.$, 15);
        else
            this.alpha = 255;
        this.$.Repaint();
    }

    this.Reset = function () {
        eval(name).alpha = 0;
        eval(name).state = STATE_NORMAL;
    }

    this.Invalid = function () {
        if (this.anime)
            this.Animation.Alpha(this, 255, 0, this.$, 15, this.Reset);
        else {
            this.state = STATE_NORMAL;
            this.alpha = 0;
            this.$.Repaint();
        }
    }

    this.OnMouse = function (event, x, y) {
        switch (event) {
            case ON_MOUSE_LBTN_DOWN:
                this.state = STATE_DOWN;
                this.$.Repaint();
                break;

            case ON_MOUSE_LBTN_UP:
                if (this.state == STATE_DOWN) {
                    if (func(x, y)) {
                        this.state = STATE_HOVER;
                        this.$.Repaint();
                    }
                }
                break;

            default:
                break;
        }
    }
}

oSimpleButton = function (name, func, shape) {
    this.$ = new oPanel(name, false);
    this.state = STATE_NORMAL;
    this.shape = shape;

    this.OnPaint = function (gr) {
        if (this.state == STATE_HOVER) {
            if (this.shape == SHAPE_ELLIPSE) {
                gr.SetSmoothingMode(4);
                gr.FillEllipse(this.$.x, this.$.y, this.$.w - 1, this.$.h - 1, $SetAlpha(ThemeStyle.fgColor, 32));
                gr.SetSmoothingMode(0);
            }
            else {
                if (this.shape.IsOne(1))
                    gr.FillSolidRect(this.$.x, this.$.y, this.$.w, this.$.h, $SetAlpha(ThemeStyle.fgColor, 32));
                if (this.shape.IsOne(2))
                    gr.DrawRect(this.$.x, this.$.y, this.$.w - 1, this.$.h - 1, 1, $SetAlpha(ThemeStyle.fgColor, 32));
            }
        }
        else if (this.state == STATE_DOWN) {
            if (this.shape == SHAPE_ELLIPSE) {
                gr.SetSmoothingMode(4);
                gr.FillEllipse(this.$.x, this.$.y, this.$.w - 1, this.$.h - 1, $SetAlpha(ThemeStyle.fgColor, 64));
                gr.SetSmoothingMode(0);
            }
            else {
                if (this.shape.IsOne(1))
                    gr.FillSolidRect(this.$.x, this.$.y, this.$.w, this.$.h, $SetAlpha(ThemeStyle.fgColor, 64));
                if (this.shape.IsOne(2))
                    gr.DrawRect(this.$.x, this.$.y, this.$.w - 1, this.$.h - 1, 1, $SetAlpha(ThemeStyle.fgColor, 64));
            }
        }

        if (typeof (this.Paint) != 'undefined') this.Paint(gr);
    }

    this.Activate = function () {
        this.state = STATE_HOVER;
        this.$.Repaint();
    }

    this.Invalid = function () {
        this.state = STATE_NORMAL;
        this.$.Repaint();
    }

    this.OnMouse = function (event, x, y) {
        switch (event) {
            case ON_MOUSE_LBTN_DOWN:
                this.state = STATE_DOWN;
                this.$.Repaint();
                break;

            case ON_MOUSE_LBTN_UP:
                if (this.state == STATE_DOWN) {
                    if (func(x, y)) {
                        this.state = STATE_HOVER;
                        this.$.Repaint();
                    }
                }
                break;

            default:
                break;
        }
    }
}

oImageButton = function (name, image, func, hoverColor, downColor, shape) {
    this.$ = new oPanel(name, false);
    this.state = STATE_NORMAL;
    this.image = image;
    this.hoverColor = hoverColor;
    this.downColor = downColor;
    this.shape = shape;

    this.OnPaint = function (gr) {
        if (this.state == STATE_HOVER) {
            if (this.shape == SHAPE_ELLIPSE) {
                gr.SetSmoothingMode(4);
                gr.FillEllipse(this.$.x, this.$.y, this.$.w - 1, this.$.h - 1, this.hoverColor);
                gr.SetSmoothingMode(0);
            }
            else {
                if (this.shape.IsOne(1))
                    gr.FillSolidRect(this.$.x, this.$.y, this.$.w, this.$.h, this.hoverColor);
                if (this.shape.IsOne(2))
                    gr.DrawRect(this.$.x, this.$.y, this.$.w - 1, this.$.h - 1, 1, this.hoverColor);
            }
        }
        else if (this.state == STATE_DOWN) {
            if (this.shape == SHAPE_ELLIPSE) {
                gr.SetSmoothingMode(4);
                gr.FillEllipse(this.$.x, this.$.y, this.$.w - 1, this.$.h - 1, this.downColor);
                gr.SetSmoothingMode(0);
            }
            else {
                if (this.shape.IsOne(1))
                    gr.FillSolidRect(this.$.x, this.$.y, this.$.w, this.$.h, this.downColor);
                if (this.shape.IsOne(2))
                    gr.DrawRect(this.$.x, this.$.y, this.$.w - 1, this.$.h - 1, 1, this.downColor);
            }
        }

        Image.Draw(gr, this.image, this.$.x, this.$.y, 0, 255);
    }

    this.Activate = function () {
        this.state = STATE_HOVER;
        this.$.Repaint();
    }

    this.Invalid = function () {
        this.state = STATE_NORMAL;
        this.$.Repaint();
    }

    this.OnMouse = function (event, x, y) {
        switch (event) {
            case ON_MOUSE_LBTN_DOWN:
                this.state = STATE_DOWN;
                this.$.Repaint();
                break;

            case ON_MOUSE_LBTN_UP:
                if (this.state == STATE_DOWN) {
                    if (func(x, y)) {
                        this.state = STATE_HOVER;
                        this.$.Repaint();
                    }
                }
                break;

            default:
                break;
        }
    }
}

/**
* ThemeStyle = {fgColor:, bgColor:, bgColor_hl:};
*/
oTextButton = function (name, text, font, func, ThemeStyle, bg, anime) {
    this.$ = new oPanel(name, false);
    this.state = STATE_NORMAL;
    this.text = text;
    this.alpha = 0;
    this.font = font;
    this.anime = anime;
    this.bg = bg;
    this.Animation = (anime && bg) ? new oAnimation(name + '.Animation') : null;

    this.OnPaint = function (gr) {
        if (this.bg) {
            gr.FillSolidRect(this.$.x, this.$.y, this.$.w, this.$.h, $SetAlpha(ThemeStyle.bgColor_hl, this.alpha));
        }

        var color = ThemeStyle.bgColor;
        if (this.state == STATE_DOWN) color = ThemeStyle.fgColor;
        gr.GdiDrawText(this.text, this.font, color, this.$.x, this.$.y, this.$.w, this.$.h, DT_CVN);
    }

    this.Activate = function () {
        this.state = STATE_HOVER;
        if (this.anime)
            this.Animation.Alpha(this, 0, 255, this.$, 15);
        else
            this.alpha = 255;
        this.$.Repaint();
    }

    this.Reset = function () {
        eval(name).alpha = 0;
        eval(name).state = STATE_NORMAL;
    }

    this.Invalid = function () {
        if (this.anime)
            this.Animation.Alpha(this, 255, 0, this.$, 15, this.Reset);
        else {
            this.state = STATE_NORMAL;
            this.alpha = 0;
            this.$.Repaint();
        }
    }

    this.OnMouse = function (event, x, y) {
        switch (event) {
            case ON_MOUSE_LBTN_DOWN:
                this.state = STATE_DOWN;
                this.$.Repaint();
                break;

            case ON_MOUSE_LBTN_UP:
                if (this.state == STATE_DOWN) {
                    if (func(x, y)) {
                        this.state = STATE_HOVER;
                        this.$.Repaint();
                    }
                }
                break;

            default:
                break;
        }
    }
}

/**
* ThemeStyle = {font:, fgColor:, fgColor_hl:};
*/
oText = function (name, str, ThemeStyle, func) {
    this.$ = new oPanel(name, false);
    this.str = str;

    this.width = $Calc(this.str, ThemeStyle.font, true);
    this.active = false;

    this.Update = function (str) {
        this.str = str;
        this.width = $Calc(this.str, ThemeStyle.font, true);
        if (this.width > this.$.w)
            this.width = this.$.w;
        this.$.Repaint();
    }

    this.Invalid = function () {
        if (this.active) {
            this.active = false;
            window.SetCursor(IDC_ARROW);
            this.$.RepaintRect(0, 0, this.width, this.$.h);
        }
    }

    this.OnMouse = function (event, x, y) {
        switch (event) {
            case ON_MOUSE_LBTN_DOWN:
                if (this.active && typeof (func) != 'undefined')
                    func(x, y);
                break;

            case ON_MOUSE_RBTN_DOWN:
                if (this.active) {
                    utils.SetClipboardText(this.str);
                    try {
                        Console.Log('已复制到剪切板');
                    } catch (e) { };
                }
                break;

            case ON_MOUSE_MOVE:
                if (x - this.$.x < this.width) {
                    if (!this.active) {
                        this.active = true;
                        window.SetCursor(IDC_HAND);
                        this.$.RepaintRect(0, 0, this.width, this.$.h);
                    }
                }
                else
                    this.Invalid();
                break;

            default:
                break;
        }
    }

    this.OnPaint = function (gr) {
        if (this.active) {
            gr.DrawLine(this.$.x, this.$.y + this.$.h - 1, this.$.x + this.width - 1, this.$.y + this.$.h - 1, 1, ThemeStyle.fgColor_hl);
            gr.GdiDrawText(this.str, ThemeStyle.font, ThemeStyle.fgColor_hl, this.$.x, this.$.y, this.$.w, this.$.h, DT_LV);
        }
        else {
            gr.GdiDrawText(this.str, ThemeStyle.font, ThemeStyle.fgColor, this.$.x, this.$.y, this.$.w, this.$.h, DT_LV);
        }
    }
}

/*
new oMenu(name, func)：弹出菜单
idx：记录当前选项
rowHeight: 项目高度
items：菜单项字符串数组
func = function(idx){}：回调函数
*/
oMenu = function (name, func, anime) {
    this.$ = new oPanel(name, false, false);
    this.idx = 0;
    this.rowHeight = $Z(20);
    this.items = null;
    this.anime = anime;
    this.Animation = anime ? new oAnimation(name + '.Animation') : null;

    this.Defocus = function () {
        window.SetTimeout(function () {
            eval(name).$.Hide();
        }, 50);
    }

    this.Show = function () {
        if (this.anime) {
            this.$.visible = true;
            Panel.focus = name;
            var h = this.$.h;
            this.$.h = 0;
            this.Animation.SSA(this.$, null, null, null, h, null, null, this.$, 4);
        }
        else
            this.$.Show();
    }

    this.OnMouse = function (event, x, y) {
        switch (event) {
            case ON_MOUSE_MOVE:
                var idx = this.idx;
                this.idx = Math.floor((y - this.$.y) / this.rowHeight);
                if (this.idx != idx) this.$.Repaint();
                break;

            case ON_MOUSE_LBTN_UP:
                func(this.idx);
                this.Defocus();
                break;
        }
    }

    this.OnPaint = function (gr) {
        if (this.items == null) return;
        gr.FillSolidRect(this.$.x, this.$.y, this.$.w, this.$.h, ThemeStyle.bgColor_l);
        gr.FillSolidRect(this.$.x, this.$.y + this.idx * this.rowHeight, this.$.w, this.rowHeight, ThemeStyle.bgColor_hl);
        for (var i = 0; i < this.items.length; i++) {
            gr.GdiDrawText(this.items[i], ThemeStyle.smallFont, ThemeStyle.fgColor, this.$.x + $Z(10), this.$.y + i * this.rowHeight, this.$.w - $Z(30), this.rowHeight, DT_LV);
        }
    }
}

/*
var Input = new oInputBox(name, padding, deftxt, ThemeStyle)
Input.$.Size(x, y, w, h, z);
str记录当前文本
Key(vkey)
Mouse(event, x, y)
Defocus = function(){};
*/
oInputBox = function (name, padding, deftxt, ThemeStyle) {
    this.$ = new oPanel(name, false);
    this.active = false;
    this.click = false;
    this.padding = padding;
    this.paddingTop = Math.floor(padding / 2);
    this.def = deftxt;
    this.str = deftxt;
    this.pos = 0;
    this.cursor = 0;
    this.offset = 0;
    this.total = 0;
    this.selected = { from: 0, to: 0, start: 0, end: 0 };

    var cursor = false;
    var timer = null;

    this.Activate = function () {
        window.SetCursor(IDC_IBEAM);
    }

    this.Invalid = function () {
        this.click = false;
        window.SetCursor(IDC_ARROW);
    }

    this.Defocus = function () {
        this.active = false;
        this.Update(false);
    }

    this.Scroll = function () {
        this.total = $Calc(this.str, ThemeStyle.font);
        if (this.pos + this.offset >= this.$.w - 2 * this.padding) {
            this.offset = this.$.w - 2 * this.padding - this.pos;
        }
        if (this.pos + this.offset <= 0) {
            this.offset = -this.pos;
        }
        if (this.total <= this.$.w - 2 * this.padding || this.offset > 0)
            this.offset = 0;
    }

    this.Cut = function () {
        if (this.selected.to != this.selected.from) {
            utils.SetClipboardText(this.str.substring(this.selected.from, this.selected.to));
            this.cursor = Math.min(this.selected.to, this.selected.from);
            this.str = this.str.substring(0, Math.min(this.selected.to, this.selected.from)) + this.str.substring(Math.max(this.selected.to, this.selected.from), this.str.length);
            this.pos = $Calc(this.str.substring(0, this.cursor), ThemeStyle.font);
            this.Scroll();
            this.selected.from = this.selected.to = 0;
            this.selected.start = this.selected.end = 0;
            this.$.Repaint();
        }
    }

    this.Copy = function () {
        if (this.selected.to != this.selected.from)
            utils.SetClipboardText(this.str.substring(this.selected.from, this.selected.to));
    }

    this.Paste = function () {
        if (this.selected.to != this.selected.from) {
            this.cursor = Math.min(this.selected.to, this.selected.from);
            this.str = this.str.substring(0, Math.min(this.selected.to, this.selected.from)) + this.str.substring(Math.max(this.selected.to, this.selected.from), this.str.length);
            this.pos = $Calc(this.str.substring(0, this.cursor), ThemeStyle.font);
            this.Scroll();
            this.selected.from = this.selected.to = 0;
            this.selected.start = this.selected.end = 0;
        }
        var ctext = utils.GetClipboardText();
        this.str = this.str.substring(0, this.cursor) + ctext + this.str.substring(this.cursor, this.str.length);
        this.cursor += ctext.length;
        this.pos = $Calc(this.str.substring(0, this.cursor), ThemeStyle.font);
        this.Scroll();
        this.$.Repaint();
    }

    this.Menu = function (x, y) {
        var m = window.CreatePopupMenu();
        var clip = utils.GetClipboardText();
        m.AppendMenuItem(this.selected.from == this.selected.to ? 1 : 0, 1, '剪切');
        m.AppendMenuItem(this.selected.from == this.selected.to ? 1 : 0, 2, '复制');
        m.AppendMenuItem(clip.length > 0 ? 0 : 1, 3, '粘帖');
        var idx = m.TrackPopupMenu(x, y);
        switch (idx) {
            case 1:
                this.Cut();
                break;

            case 2:
                this.Copy();
                break;

            case 3:
                this.Paste();
                break;

            default:
                break;
        }
        m.Dispose();
    }

    this.Reset = function () {
        this.str = this.def;
        this.pos = 0;
        this.offset = 0;
        this.cursor = 0;
        this.active = false;
        this.selected.from = this.selected.to = 0;
        this.selected.start = this.selected.end = 0;
        timer && window.ClearInterval(timer);
        timer = null;
        cursor = false;
        this.$.Repaint();
    }

    this.Update = function (def) {
        if (!this.active) {
            if (this.str.length == 0) {
                this.Reset();
                return;
            }
            this.offset = 0;
            this.cursor = 0;
            this.active = false;
            this.selected.from = this.selected.to = 0;
            this.selected.start = this.selected.end = 0;
            cursor = false;
            timer && window.ClearInterval(timer);
            timer = null;
            this.$.Repaint();
        }
        else {
            if (this.str == this.def && def) {
                this.str = '';
            }
            timer && window.ClearInterval(timer);
            timer = window.SetInterval(function () {
                cursor = cursor ? false : true;
                eval(name).$.Repaint();
            }, 1000);
        }
        this.$.Repaint();
    }

    this.OnChar = function (code) {
        if (code > 31) {
            cursor = true;
            timer && window.ClearInterval(timer);
            timer = null;
            if (this.selected.to != this.selected.from) {
                this.cursor = Math.min(this.selected.to, this.selected.from);
                this.str = this.str.substring(0, Math.min(this.selected.to, this.selected.from)) + this.str.substring(Math.max(this.selected.to, this.selected.from), this.str.length);
                this.selected.from = this.selected.to = 0;
                this.selected.start = this.selected.end = 0;
            }
            this.str = this.str.substring(0, this.cursor) + String.fromCharCode(code) + this.str.substring(this.cursor, this.str.length);
            this.cursor++;
            this.pos = $Calc(this.str.substring(0, this.cursor), ThemeStyle.font);
            this.Scroll();
            this.Update(false);
            if (typeof (this.Char) != 'undefined') this.Char(code);
        }
    }

    this.OnKey = function (vkey) {
        cursor = true;
        timer && window.ClearInterval(timer);
        timer = null;
        var mask = $GetKeyboardMask();
        if (mask == KMask.none) {
            switch (vkey) {
                case VKEY_BACK:
                    if (this.selected.to != this.selected.from) {
                        this.cursor = Math.min(this.selected.to, this.selected.from);
                        this.str = this.str.substring(0, Math.min(this.selected.to, this.selected.from)) + this.str.substring(Math.max(this.selected.to, this.selected.from), this.str.length);
                        this.selected.from = this.selected.to = 0;
                        this.selected.start = this.selected.end = 0;
                        this.pos = $Calc(this.str.substring(0, this.cursor), ThemeStyle.font);
                        this.Scroll();
                        this.$.Repaint();
                        break;
                    }
                    if (this.cursor > 0) {
                        this.str = this.str.substring(0, this.cursor - 1) + this.str.substring(this.cursor, this.str.length);
                        this.cursor--;
                        this.pos = $Calc(this.str.substring(0, this.cursor), ThemeStyle.font);
                        if (this.pos > this.$.w - 2 * this.padding)
                            this.offset = this.$.w - 2 * this.padding - this.pos;
                        else
                            this.offset = 0;
                        this.$.Repaint();
                    }
                    break;

                case VKEY_RETURN:
                    this.Defocus();
                    break;

                case VKEY_HOME:
                    if (this.cursor > 0) {
                        this.pos = 0;
                        this.offset = 0;
                        this.cursor = 0;
                        if (this.selected.to != this.selected.from) {
                            this.selected.from = this.selected.to = 0;
                            this.selected.start = this.selected.end = 0;
                        }
                        this.$.Repaint();
                    }
                    break;

                case VKEY_DELETE:
                    this.str = '';
                    this.pos = 0;
                    this.offset = 0;
                    this.cursor = 0;
                    if (this.selected.to != this.selected.from) {
                        this.selected.from = this.selected.to = 0;
                        this.selected.start = this.selected.end = 0;
                    }
                    this.$.Repaint();
                    break;

                case VKEY_LEFT:
                    if (this.selected.to != this.selected.from) {
                        this.selected.from = this.selected.to = 0;
                        this.selected.start = this.selected.end = 0;
                    }
                    else if (this.cursor > 0) {
                        this.cursor--;
                        this.pos = $Calc(this.str.substring(0, this.cursor), ThemeStyle.font);
                        this.Scroll();
                    }
                    this.$.Repaint();
                    break;

                case VKEY_RIGHT:
                    if (this.selected.to != this.selected.from) {
                        this.selected.from = this.selected.to = 0;
                        this.selected.start = this.selected.end = 0;
                    }
                    else if (this.cursor < this.str.length) {
                        this.cursor++;
                        this.pos = $Calc(this.str.substring(0, this.cursor), ThemeStyle.font);
                        this.Scroll();
                    }
                    this.$.Repaint();
                    break;

                default:
                    break;
            }
        }
        else {
            switch (mask) {
                case KMask.ctrl:
                    switch (vkey) {
                        case 65: // CTRL+A
                            this.selected.from = 0;
                            this.selected.start = 0;
                            this.selected.end = this.pos = $Calc(this.str, ThemeStyle.font);
                            this.Scroll();
                            this.selected.to = this.cursor = this.str.length;
                            this.$.Repaint();
                            break;

                        case 67: // CTRL+C
                            this.Copy();
                            break;

                        case 88: // CTRL+X
                            this.Cut();
                            break;

                        case 86: // CTRL+V
                            this.Paste();
                            break;

                        default:
                            break;
                    }
                    break;

                default:
                    break;
            }
        }
        this.Update(false);
        if (typeof (this.Key) != 'undefined') this.Key(vkey);
    }

    this.OnMouse = function (event, x, y) {
        switch (event) {
            case ON_MOUSE_LBTN_DOWN:
                if (!this.active) {
                    this.active = true;
                    this.Update(true);
                }
                if (!this.click) {
                    if (this.str.length == 0) return;

                    cursor = true;
                    timer && window.ClearInterval(timer);
                    timer = null;
                    this.click = true;
                    for (i = 0; i <= this.str.length; i++) {
                        var temp = $Calc(this.str.substring(0, i), ThemeStyle.font);
                        if (temp > x - this.$.x - this.padding - this.offset) {
                            this.selected.from = this.selected.to = this.cursor = i;
                            this.selected.start = this.selected.end = this.pos = temp;
                            break;
                        }
                        else if (i == this.str.length) {
                            this.selected.from = this.selected.to = this.cursor = i;
                            this.selected.start = this.selected.end = this.pos = temp;
                        }
                    }
                    this.Update(false);
                }
                break;

            case ON_MOUSE_LBTN_UP:
                if (this.click) {
                    for (i = 0; i <= this.str.length; i++) {
                        var temp = $Calc(this.str.substring(0, i), ThemeStyle.font);
                        if (temp > x - this.$.x - this.padding - this.offset) {
                            this.selected.to = this.cursor = i;
                            this.selected.end = this.pos = temp;
                            break;
                        }
                        else if (i == this.str.length) {
                            this.selected.to = this.cursor = i;
                            this.selected.end = this.pos = temp;
                        }
                    }
                    this.$.Repaint();
                    this.click = false;
                }
                break;

            case ON_MOUSE_MOVE:
                if (this.click) {
                    for (i = 0; i <= this.str.length; i++) {
                        var temp = $Calc(this.str.substring(0, i), ThemeStyle.font);
                        if (temp > x - this.$.x - this.padding - this.offset) {
                            this.selected.to = this.cursor = i;
                            this.selected.end = this.pos = temp;
                            break;
                        }
                        else if (i == this.str.length) {
                            this.selected.to = this.cursor = i;
                            this.selected.end = this.pos = temp;
                        }
                    }
                    this.Scroll();
                    this.$.Repaint();
                }
                break;

            case ON_MOUSE_LBTN_DBLCK:
                if (this.selected.to != this.selected.from) {
                    this.selected.from = this.selected.to = 0;
                    this.selected.start = this.selected.end = 0;
                }
                else {
                    this.selected.from = 0;
                    this.selected.start = 0;
                    this.selected.end = this.pos = $Calc(this.str, ThemeStyle.font);
                    this.selected.to = this.cursor = this.str.length;
                }
                this.Scroll();
                this.$.Repaint();
                break;

            case ON_MOUSE_RBTN_UP:
                if (!this.active) {
                    this.active = true;
                    this.Update(true);
                }
                this.Menu(x, y);
                break;

            default:
                break;
        }
    }

    this.OnPaint = function (gr) {
        if (this.active) {
            this.textcolor = ThemeStyle.fgColor;
            this.backcolor = ThemeStyle.bgColor;
            this.rectcolor = ThemeStyle.fgColor_hl;
        } else {
            this.textcolor = ThemeStyle.fgColor_l;
            this.backcolor = ThemeStyle.bgColor_l;
            this.rectcolor = ThemeStyle.fgColor_l;
        }

        gr.FillSolidRect(this.$.x, this.$.y, this.$.w - 1, this.$.h - 1, this.backcolor);
        if (this.selected.start != this.selected.end) {
            var start = Math.min(this.selected.end, this.selected.start) + this.offset;
            if (start < 0) {
                start = 0;
            }
            var end = Math.max(this.selected.end, this.selected.start) + this.offset;
            if (end > this.$.w - 2 * this.padding) {
                end = this.$.w - 2 * this.padding;
            }
            gr.FillSolidRect(this.$.x + this.padding + start, this.$.y + this.paddingTop, end - start, this.$.h - 2 * this.paddingTop, ThemeStyle.bgColor_hl);
        }
        // 越界裁剪
        var text = this.str;
        var text_offset = this.offset;
        if (this.offset != 0) {
            for (var i = 0; i < this.str.length; i++) {
                if ((text_offset = $Calc(this.str.substring(0, i), ThemeStyle.font)) >= -this.offset) {
                    text = this.str.substr(i);
                    text_offset = text_offset + this.offset;
                    break;
                }
            }
        }
        gr.GdiDrawText(text, ThemeStyle.font, this.textcolor, this.$.x + this.padding + text_offset, this.$.y + this.paddingTop, this.$.w - 2 * this.padding - text_offset, this.$.h - 2 * this.paddingTop, DT_LVN);
        gr.DrawRect(this.$.x, this.$.y, this.$.w - 1, this.$.h - 1, 1, this.rectcolor);
        if (cursor) {
            gr.DrawLine(this.$.x + this.padding + this.pos + this.offset, this.$.y + this.paddingTop, this.$.x + this.padding + this.pos + this.offset, this.$.y + this.$.h - this.paddingTop - 1, 1, this.textcolor);
        }
    }
}

/*
this.$ = new oPanel(name, visible)：对象必须拥有oPanel属性
垂直滚动条
this.$.offsetY = 0;
this.$.totalY = this.$.h;
this.vScroll = new oScrollBar(name + '.vScroll', this.$, true, false);
this.vScroll.$.Size(this.$.w, this.$.y, 13, this.$.h, this.$.z + 1);
水平滚动条
this.$.offsetX = 0;
this.$.totalX = this.$.w;
this.hScroll = new oScrollBar(name + '.hScroll', this.$, false, false);
this.hScroll.$.Size(this.$.x, this.$.h, this.$.w, 13, this.$.z + 1);

this.overstep 越界计数
Scroll(offset, time)
Slide(x, y, iter)
Show(des, iter)
*/
oScrollBar = function (name, parent, vertical, relative, bg) {
    this.$ = new oPanel(name, false, false);
    this.parent = parent;
    this.vertical = vertical;
    this.relative = typeof (relative) == 'undefined' ? false : relative;
    this.bg = bg;
    this.active = false;
    this.click = false;
    this.need = false;
    this.timer = null;
    this.img = null;
    //this.Old = { o: 0, O: 0 };
    this.cursor = { img: null, x: 0, y: 0, w: 0, h: 0, alpha: 0 };

    this.overstep = 0;
    this.limit = false;
    this.isLimit = 'start';
    var shadeTimer = null;
    var limitTimer = null;

    this.OnRepaint = function () {
        this.parent.Repaint();
    }

    this.Draw = function () {
        Image.Clear(this.cursor.img);
        this.cursor.img = null;
        this.cursor.img = gdi.CreateImage(this.cursor.w, this.cursor.h);
        if (null == this.cursor.img) {
            return;
        }
        var g = this.cursor.img.GetGraphics();
        g.FillSolidRect(0, 0, this.cursor.w, this.cursor.h, 0xff808080);
        this.cursor.img.ReleaseGraphics(g);
        this.cursor.alpha = 64;
    }

    this.OnSize = function () {
        if (this.vertical) {
            if (this.parent.totalY <= this.parent.h) {
                this.parent.offsetY = 0;
                if (this.need) {
                    this.need = false;
                    if (this.relative) {
                        this.parent.w += this.$.w;
                        this.$.x += this.$.w;
                    }
                }
                /*if (this.Old.O == this.parent.totalY && this.Old.o == this.$.h) return;
                this.Old.O = this.parent.totalY;
                this.Old.o = this.$.h;*/
            }
            else {
                if (!this.need) {
                    this.need = true;
                    if (this.relative) {
                        this.parent.w -= this.$.w;
                        this.$.x -= this.$.w;
                    }
                }
                /*if (this.Old.O == this.parent.totalY && this.Old.o == this.$.h) return;
                this.Old.O = this.parent.totalY;
                this.Old.o = this.$.h;*/

                this.cursor.x = 0;
                this.cursor.h = Math.floor(this.$.h * this.parent.h / this.parent.totalY);
                if (this.cursor.h < $Z(50)) this.cursor.h = $Z(50);
                this.cursor.y = Math.floor((this.$.h - this.cursor.h) * this.parent.offsetY / (this.parent.totalY - this.parent.h));
                this.cursor.w = this.$.w;
                if (this.cursor.y < 0) {
                    this.cursor.y = 0;
                    this.parent.offsetY = 0;
                }
                else if (this.cursor.y + this.cursor.h > this.$.h) {
                    this.cursor.y = this.$.h - this.cursor.h;
                    this.parent.offsetY = Math.floor(this.cursor.y * (this.parent.totalY - this.parent.h) / (this.$.h - this.cursor.h));
                }
            }
        }
        else {
            if (this.parent.totalX <= this.parent.w) {
                this.parent.offsetX = 0;
                if (this.need) {
                    this.need = false;
                    if (this.relative) {
                        this.parent.h += this.$.h;
                        this.$.y += this.$.h;
                    }
                }
                /*if (this.Old.O == this.parent.totalX && this.Old.o == this.$.w) return;
                this.Old.O = this.parent.totalX;
                this.Old.o = this.$.w;*/
            }
            else {
                if (!this.need) {
                    this.need = true;
                    if (this.relative) {
                        this.parent.h -= this.$.h;
                        this.$.y -= this.$.h;
                    }
                }
                /*if (this.Old.O == this.parent.totalX && this.Old.o == this.$.w) return;
                this.Old.O = this.parent.totalX;
                this.Old.o = this.$.w;*/

                this.cursor.w = Math.floor(this.$.w * this.parent.w / this.parent.totalX);
                if (this.cursor.w < $Z(50)) this.cursor.w = $Z(50);
                this.cursor.x = Math.floor((this.$.w - this.cursor.w) * this.parent.offsetX / (this.parent.totalX - this.parent.w));
                this.cursor.y = 0;
                this.cursor.h = this.$.h;
                if (this.cursor.x < 0) {
                    this.cursor.x = 0;
                    this.parent.offsetX = 0;
                }
                else if (this.cursor.x + this.cursor.w > this.$.w) {
                    this.cursor.x = this.$.w - this.cursor.w;
                    this.parent.offsetX = Math.floor(this.cursor.x * (this.parent.totalX - this.parent.w) / (this.$.w - this.cursor.w));
                }
            }
        }
        if (this.need) {
            this.Draw();
            this.$.visible = this.parent.visible;
            this.$.Repaint();
        }
        else {
            Image.Clear(this.cursor.img);
            this.cursor.img = null;
            this.$.visible = false;
            this.$.Repaint(true);
        }
    }

    this.Limit = function () {
        limitTimer && window.ClearTimeout(limitTimer);
        limitTimer = null;
        shadeTimer && window.ClearTimeout(shadeTimer);
        shadeTimer = null;

        limitTimer = window.SetTimeout(function () {
            AnimationOn = true;
            shadeTimer = window.SetInterval(function () {
                eval(name).overstep += ((0 - eval(name).overstep) / 10).One();
                eval(name).$.Repaint();
                if (Math.abs(0 - eval(name).overstep) <= 1) {
                    AnimationOn = false;
                    eval(name).overstep = 0;
                    eval(name).limit = false;
                    window.ClearInterval(shadeTimer);
                    shadeTimer = null;
                }
            }, ANIMATION_INTERVAL);
            limitTimer && window.ClearTimeout(limitTimer);
            limitTimer = null;
        }, 100);
    }

    this.Update = function (offset) {
        if (this.vertical) {
            if (typeof (offset) != 'undefined') {
                this.parent.offsetY = offset;
            }
            this.cursor.y = (this.$.h - this.cursor.h) * this.parent.offsetY / (this.parent.totalY - this.parent.h);
            if (this.cursor.y <= 0) {
                if (this.isLimit == 'start') {
                    this.overstep--;
                    this.Limit();
                } else {
                    this.limit = true;
                }
                this.cursor.y = 0;
                this.parent.offsetY = 0;
            }
            else if (this.cursor.y + this.cursor.h >= this.$.h) {
                if (this.isLimit == 'end') {
                    this.overstep++;
                    this.Limit();
                } else {
                    this.limit = true;
                }
                this.cursor.y = this.$.h - this.cursor.h;
                this.parent.offsetY = this.parent.totalY - this.parent.h;
            }
            this.cursor.y = Math.floor(this.cursor.y);
        }
        else {
            if (typeof (offset) != 'undefined') {
                this.parent.offsetX = offset;
            }
            this.cursor.x = (this.$.w - this.cursor.w) * this.parent.offsetX / (this.parent.totalX - this.parent.w);
            if (this.cursor.x <= 0) {
                if (this.isLimit == 'start') {
                    this.overstep--;
                    this.Limit();
                } else {
                    this.limit = true;
                }
                this.cursor.x = 0;
                this.parent.offsetX = 0;
            }
            else if (this.cursor.x + this.cursor.w >= this.$.w) {
                if (this.isLimit == 'end') {
                    this.overstep++;
                    this.Limit();
                } else {
                    this.limit = true;
                }
                this.cursor.x = this.$.w - this.cursor.w;
                this.parent.offsetX = this.parent.totalX - this.parent.w;
            }

            this.cursor.x = Math.floor(this.cursor.x);
        }
        this.$.Repaint();
    }

    this.UpdateXY = function (x, y) {
        if (this.vertical) {
            this.cursor.y = y - this.$.y - Math.floor(this.cursor.h / 2);
            if (this.cursor.y < 0) {
                this.cursor.y = 0;
            }
            else if (this.cursor.y + this.cursor.h > this.$.h) {
                this.cursor.y = this.$.h - this.cursor.h;
            }
            this.parent.offsetY = Math.floor(this.cursor.y * (this.parent.totalY - this.parent.h) / (this.$.h - this.cursor.h));
        }
        else {
            this.cursor.x = x - this.$.x - Math.floor(this.cursor.w / 2);
            if (this.cursor.x < 0) {
                this.cursor.x = 0;
            }
            else if (this.cursor.x + this.cursor.w > this.$.w) {
                this.cursor.x = this.$.w - this.cursor.w;
            }
            this.parent.offsetX = Math.floor(this.cursor.x * (this.parent.totalX - this.parent.w) / (this.$.w - this.cursor.w));
        }
        this.$.Repaint();
    }

    this.UpdateOffset = function (offset) {
        if (this.vertical) {
            this.parent.offsetY -= offset;
            if (this.parent.offsetY <= 0) {
                if (this.isLimit == 'start') {
                    this.overstep--;
                    this.Limit();
                } else {
                    this.limit = true;
                }
                this.parent.offsetY = 0;
            }
            else if (this.parent.offsetY >= this.parent.totalY - this.parent.h) {
                if (this.isLimit == 'end') {
                    this.overstep++;
                    this.Limit();
                } else {
                    this.limit = true;
                }
                this.parent.offsetY = this.parent.totalY - this.parent.h;
            }
            this.cursor.y = Math.floor((this.$.h - this.cursor.h) * this.parent.offsetY / (this.parent.totalY - this.parent.h));
        }
        else {
            this.parent.offsetX -= offset;
            if (this.parent.offsetX <= 0) {
                if (this.isLimit == 'start') {
                    this.overstep--;
                    this.Limit();
                } else {
                    this.limit = true;
                }
                this.parent.offsetX = 0;
            }
            else if (this.parent.offsetX >= this.parent.totalX - this.parent.w) {
                if (this.isLimit == 'end') {
                    this.overstep++;
                    this.Limit();
                } else {
                    this.limit = true;
                }
                this.parent.offsetX = this.parent.totalX - this.parent.w;
            }
            this.cursor.x = Math.floor((this.$.w - this.cursor.w) * this.parent.offsetX / (this.parent.totalX - this.parent.w));
        }
        this.$.Repaint();
    }

    this.UpdatePage = function (positive) {
        if (this.vertical) {
            var offset = this.parent.h;
            offset = positive ? offset : -offset;
            var des = this.parent.offsetY - offset;
            this.Show(des, SCROLL_ITERATION);
        }
        else {
            var offset = this.parent.w;
            offset = positive ? offset : -offset;
            var des = this.parent.offsetX - offset;
            this.Show(des, SCROLL_ITERATION);
        }
    }

    this.OnKey = function (vkey) {
        if (!this.need) return;
        switch (vkey) {
            case VKEY_LEFT:
                this.UpdatePage(true);
                break;

            case VKEY_RIGHT:
                this.UpdatePage(false);
                break;

            default:
                break;
        }
    }

    this.Invalid = function () {
        if (this.active || this.click) {
            this.click = false;
            this.active = false;
            this.cursor.alpha = 64;
            this.$.RepaintRect(this.cursor.x, this.cursor.y, this.cursor.w, this.cursor.h);
        }
    }

    this.OnMouse = function (event, x, y) {
        if (!this.need) return;
        switch (event) {
            case ON_MOUSE_LBTN_DOWN:
                if (this.active) {
                    this.cursor.alpha = 225;
                    this.click = true;
                    this.$.RepaintRect(this.cursor.x, this.cursor.y, this.cursor.w, this.cursor.h);
                }
                else
                    this.Slide(x, y, 5);
                break;

            case ON_MOUSE_LBTN_UP:
                if (this.click) {
                    this.cursor.alpha = 128;
                    this.click = false;
                    this.active = false;
                    this.$.RepaintRect(this.cursor.x, this.cursor.y, this.cursor.w, this.cursor.h);
                }
                break;

            case ON_MOUSE_MOVE:
                if (this.click) {
                    this.UpdateXY(x, y);
                }
                else if (x > (this.$.x + this.cursor.x) && x < (this.$.x + this.cursor.x + this.cursor.w)
				&& y > (this.$.y + this.cursor.y) && y < (this.$.y + this.cursor.y + this.cursor.h)) {
                    if (!this.active) {
                        this.cursor.alpha = 128;
                        this.active = true;
                        this.$.RepaintRect(this.cursor.x, this.cursor.y, this.cursor.w, this.cursor.h);
                    }
                }
                else if (this.active) {
                    this.cursor.alpha = 64;
                    this.active = false;
                    this.$.RepaintRect(this.cursor.x, this.cursor.y, this.cursor.w, this.cursor.h);
                }
                break;

            case ON_MOUSE_WHEEL:
                this.UpdateOffset(x);
                break;

            default:
                break;
        }
    }

    this.IsLimit = function () {
        this.limit = false;
        if (this.vertical) {
            if (this.cursor.y == 0) {
                this.isLimit = 'start';
            } else if (this.cursor.y + this.cursor.h == this.$.h) {
                this.isLimit = 'end';
            } else {
                this.isLimit = '';
            }
        } else {
            if (this.cursor.x == 0) {
                this.isLimit = 'start';
            } else if (this.cursor.x + this.cursor.w == this.$.w) {
                this.isLimit = 'end';
            } else {
                this.isLimit = '';
            }
        }
    }

    this.Scroll = function (offset, time) {
        if (!this.need) return;
        this.IsLimit();

        if (time > 1) {
            var ofs = 0;
            AnimationOn = true;
            this.timer && window.ClearInterval(this.timer);
            this.timer = null;

            this.timer = window.SetInterval(function () {
                ofs += ((offset - ofs) / time).One();
                eval(name).UpdateOffset(ofs);
                if (eval(name).limit || Math.abs(offset - ofs) <= 1) {
                    AnimationOn = false;
                    eval(name).timer && window.ClearInterval(eval(name).timer);
                    eval(name).timer = null;
                }
            }, ANIMATION_INTERVAL);
        }
        else {
            this.UpdateOffset(offset);
        }
    }

    this.Slide = function (desX, desY) {
        if (!this.need) return;
        this.IsLimit();

        var x = this.cursor.x + this.$.x;
        var y = this.cursor.y + this.$.y;

        AnimationOn = true;
        this.timer && window.ClearInterval(this.timer);
        this.timer = null;

        this.timer = window.SetInterval(function () {
            x += ((desX - x) / SCROLL_ITERATION).One();
            y += ((desY - y) / SCROLL_ITERATION).One();
            eval(name).UpdateXY(x, y);
            if (eval(name).limit || Math.abs(desX - x) <= 1 && Math.abs(desY - y) <= 1) {
                AnimationOn = false;
                x = desX;
                y = desY;
                eval(name).timer && window.ClearInterval(eval(name).timer);
                eval(name).timer = null;
            }
        }, ANIMATION_INTERVAL);
    }

    this.Show = function (des) {
        if (!this.need) return;
        this.IsLimit();

        var org = this.vertical ? this.parent.offsetY : this.parent.offsetX;
        AnimationOn = true;
        this.timer && window.ClearInterval(this.timer);
        this.timer = null;
        this.timer = window.SetInterval(function () {
            org += ((des - org) / SCROLL_ITERATION).One();
            eval(name).Update(org);

            if (eval(name).limit || Math.abs(des - org) <= 1) {
                AnimationOn = false;
                org = des;
                eval(name).timer && window.ClearInterval(eval(name).timer);
                eval(name).timer = null;
            }
        }, ANIMATION_INTERVAL);
    }

    this.OnPaint = function (gr) {
        if (this.cursor.img) {
            if (this.bg)
                gr.FillSolidRect(this.$.x, this.$.y, this.$.w, this.$.h, ThemeStyle.bgColor_l);
            var g = null;
            this.img = gdi.CreateImage(this.$.w, this.$.h);
            if (null == this.img) {
                return;
            }
            g = this.img.GetGraphics();
            Image.Draw(g, this.cursor.img, this.cursor.x, this.overstep + this.cursor.y, 0, this.cursor.alpha);
            this.img.ReleaseGraphics(g);
            Image.Draw(gr, this.img, this.$.x, this.$.y, 0, 255);
            Image.Clear(this.img);
        }
    }
}

/*
Dispose()
Show(idx[, end])
select(idx, multiple)
OnVisible(vis)
OnSelect()
OnInvalid()
Drop(x, y)
Key(vkey)
Mouse(event, x, y)
Size(resize)
*/
oListView = function (name, rowHeight, enable) {
    this.$ = new oPanel(name, false);
    this.$.offsetY = 0;
    this.$.totalY = 0;
    this.rowHeight = rowHeight;
    this.title = 'ListView';
    this.items = [];
    this.start = 0;
    this.count = 0;
    this.sized = false;
    this.click = false;
    this.select = -1;
    this.selects = [];
    this.drag = { id: -1, img: null };
    this.enable = enable;
    this.vScroll = new oScrollBar(name + '.vScroll', this.$, true, true, true);

    var _x = 0;
    var x_ = 0;
    var _y = 0;
    var y_ = 0;

    this.Dispose = function () {
        for (var i = 0; i < this.items.length; i++) {
            if (typeof (this.items[i].Dispose) == 'function')
                this.items[i].Dispose();
            delete this.items[i];
        }
        this.items.length = 0;
    }

    this.SetVisible = function (vis) {
        this.vScroll.$.visible = vis;
        this.$.visible = vis;
        if (typeof (this.OnVisible) != 'undefined') this.OnVisible(vis);
    }

    this.OnRepaint = function () {
        this.start = Math.floor(this.$.offsetY / this.rowHeight);
    }

    this.OnSize = function (resize) {
        if (resize) {
            this.vScroll.need = false;
        }
        this.sized = true;
        this.capacity = Math.ceil(this.$.h / this.rowHeight) + 1;
        this.vScroll.$.Size(this.$.x + this.$.w, this.$.y, 15, this.$.h, this.$.z + 1);
    }

    this.Show = function (idx, end) {
        if (idx < 0 || idx >= this.count) return;

        this.Select(idx, false);
        if (end && end > idx) {
            for (var i = idx + 1; i < end; i++)
                this.Select(i, true);
        }
        if ((idx * this.rowHeight - this.$.offsetY < 0) || (idx * this.rowHeight - this.$.offsetY > this.$.h - this.rowHeight)) {
            var des = idx * this.rowHeight - (this.$.h - this.rowHeight) / 2;
            this.vScroll.Show(des);
        } else {
            this.$.Repaint();
        }
    }

    this.OnKey = function (vkey) {
        this.vScroll.OnKey(vkey);
        var mask = $GetKeyboardMask();
        if (mask == KMask.none) {
            switch (vkey) {
                case VKEY_UP:
                    if (this.select > 0 && this.select < this.count) {
                        this.items[this.select].selected = false;
                        this.select--;
                        this.items[this.select].selected = true;
                        var des = -1;
                        if (this.select * this.rowHeight - this.$.offsetY < 0) {
                            des = this.select * this.rowHeight;
                        }
                        else if (this.select * this.rowHeight - this.$.offsetY > this.$.h - this.rowHeight) {
                            des = this.select * this.rowHeight - this.$.h + this.rowHeight;
                        }
                        if (des > -1)
                            this.vScroll.Show(des);
                        else
                            this.$.Repaint();
                    }
                    break;

                case VKEY_DOWN:
                    if (this.select >= 0 && this.select < this.count - 1) {
                        this.items[this.select].selected = false;
                        this.select++;
                        this.items[this.select].selected = true;
                        var des = -1;
                        if (this.select * this.rowHeight - this.$.offsetY < 0) {
                            des = this.select * this.rowHeight;
                        }
                        else if (this.select * this.rowHeight - this.$.offsetY > this.$.h - this.rowHeight) {
                            des = this.select * this.rowHeight - this.$.h + this.rowHeight;
                        }
                        if (des > -1)
                            this.vScroll.Show(des);
                        else
                            this.$.Repaint();
                    }
                    break;

                default:
                    break;
            }
        }
        else {
            switch (mask) {
                case KMask.ctrl:
                    switch (vkey) {
                        case 65: // CTRL+A
                            if (!this.enable.IsOne(2)) return;
                            this.selects.length = 0;
                            for (var i = 0; i < this.count; i++) {
                                this.selects.push(i);
                                this.items[i].selected = true;
                                this.$.Repaint();
                            }
                            break;

                        default:
                            break;
                    }
                    break;

                default:
                    break;
            }
        }
        if (typeof (this.Key) != 'undefined') this.Key(vkey);
    }

    this.Invalid = function (x, y) {
        if (this.click) {
            _x = _y = x_ = y_ = 0;
            this.click = false;

            if (typeof (this.Drop) != 'undefined') this.Drop(x, y);
            this.drag.id = -1;
            Image.Clear(this.drag.img);
            this.drag.img = null;
            this.$.Repaint();
            if (typeof (this.OnInvalid) != 'undefined') this.OnInvalid();
        }
    }

    this.OnDrag = function () {
        this.drag.id = this.select;
        this.$.Repaint();
    }

    this.Select = function (idx, multiple) {
        if (idx < 0 || idx >= this.count) return;
        if (this.select > -1 && this.select < this.count) {
            if (multiple) {
                if (this.selects.length == 0) {
                    this.selects.push(this.select);
                }
                if (this.items[idx].selected) {
                    this.selects.Remove(idx);
                    this.items[idx].selected = false;
                    if (this.selects.length == 0) {
                        this.select = -1;
                    }
                }
                else {
                    this.select = idx;
                    this.selects.push(this.select);
                    this.items[this.select].selected = true;
                }
            }
            else {
                if (this.selects.length > 0) {
                    for (var i = 0; i < this.selects.length; i++) {
                        this.items[this.selects[i]].selected = false;
                    }
                }
                else {
                    this.items[this.select].selected = false;
                }
                this.select = idx;
                this.selects.length = 0;
                this.items[this.select].selected = true;
            }
        }
        else {
            this.select = idx;
            this.selects.length = 0;
            this.items[this.select].selected = true;
        }
        if (typeof (this.OnSelect) != 'undefined') this.OnSelect();
    }

    this.OnMouse = function (event, x, y) {
        switch (event) {
            case ON_MOUSE_LBTN_DOWN:
                var idx = Math.floor((y - this.$.y + this.$.offsetY) / this.rowHeight);
                if (idx < 0 || idx >= this.count) return;

                this.Select(idx, this.enable.IsOne(2) && $GetKeyboardMask() == KMask.ctrl);

                this.click = true;
                _x = x_ = x;
                _y = y_ = y + this.$.offsetY;
                break;

            case ON_MOUSE_LBTN_DBLCK:
                var idx = Math.floor((y - this.$.y + this.$.offsetY) / this.rowHeight);
                if (idx < 0 || idx >= this.count) return;
                break;

            case ON_MOUSE_LBTN_UP:
                this.Invalid(x, y);
                break;

            case ON_MOUSE_MOVE:
                if (this.click) {
                    if (this.drag.id == -1 && this.enable.IsOne(1))
                        this.OnDrag();
                    if (x < this.$.x)
                        x = this.$.x;
                    if (x > (this.$.x + this.$.w - 1))
                        x = this.$.x + this.$.w - 1;
                    if (y < this.$.y) {
                        y = this.$.y;
                        this.vScroll.Scroll(this.rowHeight);
                    }
                    if (y > (this.$.y + this.$.h - 1)) {
                        y = this.$.y + this.$.h - 1;
                        this.vScroll.Scroll(-this.rowHeight);
                    }
                    x_ = x;
                    y_ = y + this.$.offsetY;

                    if (this.drag.id == -1 && this.enable.IsOne(2)) {
                        var idx = Math.floor((y_ - this.$.y) / this.rowHeight).Limit(0, this.count);

                        if (this.select != idx) {
                            this.select = idx;
                            var start = Math.floor((_y - this.$.y) / this.rowHeight).Limit(0, this.count);
                            var end = idx;
                            this.selects.splice(0, this.selects.length);

                            for (var i = Math.min(start, end); i < Math.min(Math.max(start, end) + 1, this.count); i++) {
                                this.selects.push(i);
                                this.items[i].selected = true;
                            }
                            if (typeof (this.OnSelect) != 'undefined') this.OnSelect();
                        }

                        //this.select != idx && this.Select(idx, true, !$GetKeyboardMask() == KMask.ctrl);
                    }
                    this.$.Repaint();
                }

                break;

            case ON_MOUSE_WHEEL:
                this.vScroll.Scroll(x * 30, 4);
                break;

            case ON_MOUSE_RBTN_UP:
                var idx = Math.floor((y - this.$.y + this.$.offsetY) / this.rowHeight);
                if (idx < 0 || idx >= this.count) return;

                if (this.items[idx].selected) break;
                if (this.select > -1) {
                    if (this.selects.length > 0) {
                        for (var i = 0; i < this.selects.length; i++) {
                            this.items[this.selects[i]].selected = false;
                        }
                    }
                    else {
                        this.items[this.select].selected = false;
                    }
                    this.select = idx;
                    this.selects.length = 0;
                    this.items[this.select].selected = true;
                }
                else {
                    this.select = idx;
                    this.selects.length = 0;
                    this.items[this.select].selected = true;
                }
                this.$.Repaint();
                break;

            default:
                break;
        }
        if (typeof (this.Mouse) != 'undefined') this.Mouse(event, x, y);
    }

    this.OnPaint = function (gr) {
        if (this.items.length == 0) {
            gr.GdiDrawText(this.title, ThemeStyle.hugeFont, ThemeStyle.fgColor, this.$.x, this.$.y, this.$.w, this.$.h, DT_CVN);
        }
        for (var i = this.start; i < this.count && i < this.start + this.capacity; i++) {
            var step = 0;
            if (this.vScroll.overstep > 0) {
                step = (this.count - i - 1) * this.vScroll.overstep;
            }
            else if (this.vScroll.overstep < 0) {
                step = i * this.vScroll.overstep;
            }
            this.items[i].Paint(gr, this.$.x, this.$.y - this.$.offsetY + i * this.rowHeight - step, this.$.w, this.rowHeight);
        }
        if (this.drag.id > -1 && !this.drag.img) {
            this.drag.img = gdi.CloneGraphics(gr, this.$.x, this.$.y - this.$.offsetY + this.select * this.rowHeight, this.$.w, this.rowHeight);
        }
        if (this.drag.img) {
            var id = Math.floor((y_ - this.$.y) / this.rowHeight);
            gr.DrawRect(this.$.x, this.$.y - this.$.offsetY + id * this.rowHeight, this.$.w - 1, this.rowHeight - 1, 1, 0x80000000);
            Image.Draw(gr, this.drag.img, this.$.x, y_ - this.$.offsetY, 0, 128);
        }
        if (this.drag.id == -1 && this.click && this.enable.IsOne(2)) {
            gr.DrawLine(_x, _y - this.$.offsetY, _x, y_ - this.$.offsetY, 1, $SetAlpha(ThemeStyle.bgColor_hl, 255));
            gr.DrawLine(_x, _y - this.$.offsetY, x_, _y - this.$.offsetY, 1, $SetAlpha(ThemeStyle.bgColor_hl, 255));
            gr.DrawLine(x_, _y - this.$.offsetY, x_, y_ - this.$.offsetY, 1, $SetAlpha(ThemeStyle.bgColor_hl, 255));
            gr.DrawLine(_x, y_ - this.$.offsetY, x_, y_ - this.$.offsetY, 1, $SetAlpha(ThemeStyle.bgColor_hl, 255));
        }
    }
}

/*
focus：当前聚焦值
OnChange()
Paint(gr, x, y, w, h)
*/
oTabView = function (name, vertical, bg, defType) {
    this.$ = new oPanel(name, false);
    this.vertical = vertical;
    this.bg = bg;
    this.line = typeof (defType) == 'undefined' ? false : defType;
    this.Line = { x: 0, y: 0, w: 0, h: 0 };
    this.num = 0;
    this.focus = 0;
    this.Animation = new oAnimation(name + '.Animation');

    this.Change = function () {
        if (typeof (this.OnChange) == 'undefined')
            return;
        if (this.vertical)
            this.Animation.SSA(this.Line, null, this.focus * this.Line.h, null, null, null, null, this.$, 4, this.OnChange());
        else
            this.Animation.SSA(this.Line, this.focus * this.Line.w, null, null, null, null, null, this.$, 4, this.OnChange());
    }

    this.OnSize = function (resize) {
        if (!resize) return;
        if (this.vertical) {
            this.Line.h = this.$.h / this.num;
            this.Line.y = this.focus * this.Line.h;
            this.Line.x = 0;
            this.Line.w = $Z(3);
        }
        else {
            this.Line.w = this.$.w / this.num;
            this.Line.x = this.focus * this.Line.w;
            this.Line.h = $Z(3);
            this.Line.y = this.$.h - this.Line.h;
        }
    }

    this.OnMouse = function (event, x, y) {
        switch (event) {
            case ON_MOUSE_LBTN_DOWN:
                var old = this.focus;
                if (this.vertical)
                    this.focus = Math.floor((y - this.$.y) / (this.$.h / this.num));
                else
                    this.focus = Math.floor((x - this.$.x) / (this.$.w / this.num));
                if (old != this.focus)
                    this.Change();
                break;

            case ON_MOUSE_WHEEL:
                if (x < 0) {
                    if (this.focus < this.num - 1) {
                        this.focus++;
                        this.Change();
                    }
                }
                else {
                    if (this.focus > 0) {
                        this.focus--;
                        this.Change();
                    }
                }
                break;
        }
    }

    this.OnPrevPaint = function (gr) {
        this.bg && gr.FillSolidRect(this.$.x, this.$.y, this.$.w, this.$.h, $SetAlpha(ThemeStyle.bgColor_l, 255));
    }

    this.OnPaint = function (gr) {
        if (this.$.bg && this.bg)
            gr.FillSolidRect(this.$.x, this.$.y, this.$.w, this.$.h, ThemeStyle.bgColor_l);
        if (this.line)
            gr.FillSolidRect(this.$.x + this.Line.x, this.$.y + this.Line.y, this.Line.w, this.Line.h, $SetAlpha(ThemeStyle.bgColor_hl, 255));
        if (typeof (this.Paint) != 'undefined') {
            if (this.vertical)
                this.Paint(gr, this.$.x, this.$.y, this.$.w, this.Line.h);
            else
                this.Paint(gr, this.$.x, this.$.y, this.Line.w, this.$.h);
        }
    }
}