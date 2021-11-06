/*
var Color = new oColor('Color');
color记录当前颜色值
*/
oColor = function (name) {
    this.$ = new oPanel(name, true);
    this.Animation = new oAnimation(name + '.Animation');

    this.img = null;
    this.color = 0;
    this.padding = 5;
    this.hex = 0;
    this.title = null;

    var _r = 0;
    var _g = 0;
    var _b = 0;
    var _a = 0;

    this.Init = function () {
        this.OnEnsure = function () {
            $Invoke(name, 'Get');
            $Invoke(name, 'OnGet');
            $Invoke(name, 'Hide');
        }
        this.OnApply = function () {
            $Invoke(name, 'Get');
            $Invoke(name, 'OnGet');
            return true;
        }
        this.OnCancel = function () {
            $Invoke(name, 'Hide');
        }
        this.Ensure = new oButton(name + '.Ensure', '确定', this.OnEnsure, true, true);
        this.Apply = new oButton(name + '.Apply', '应用', this.OnApply, true, true);
        this.Cancel = new oButton(name + '.Cancel', '取消', this.OnCancel, true, true);

        this.OnRed = function (x, y) {
            _r = y;
            $Invoke(name, 'Get');
            eval(name).$.Repaint();
        }
        this.OnGreen = function (x, y) {
            _g = y;
            eval(name).Get();
            eval(name).$.Repaint();
        }
        this.OnBlue = function (x, y) {
            _b = y;
            eval(name).Get();
            eval(name).$.Repaint();
        }
        this.OnAlpha = function (x, y) {
            _a = y;
            eval(name).Get();
            eval(name).$.Repaint();
        }

        this.Red = new oDragBar(name + '.Red', this.OnRed);
        this.Green = new oDragBar(name + '.Green', this.OnGreen);
        this.Blue = new oDragBar(name + '.Blue', this.OnBlue);
        this.Alpha = new oDragBar(name + '.Alpha', this.OnAlpha);
    }
    this.Init();

    this.Show = function () {
        this.SetVisible(true);

        this.Animation.SSA(this.$, this.$.x - this.padding, this.$.y - this.padding, this.$.w + 2 * this.padding, this.$.h + 2 * this.padding, null, null, this.$, 4, OnHide = function () {
            eval(name).$.Repaint();
        });
    }

    this.Hide = function () {
        var client = {x: this.$.x, y: this.$.y, w: this.$.w, h: this.$.h};
        this.Animation.SSA(this.$, this.$.x + this.padding, this.$.y + this.padding, this.$.w - 2 * this.padding, this.$.h - 2 * this.padding, null, null, client, 4, OnHide = function () {
            $Invoke(name, 'SetVisible', false);
            $RepaintRect(client.x, client.y, client.w, client.h);
        });
    }

    this.OnSize = function () {
        this.Ensure.$.Size(this.$.x + 180, this.$.y + 160, 50, 30, this.$.z + 1);
        this.Apply.$.Size(this.$.x + 180, this.$.y + 195, 50, 30, this.$.z + 1);
        this.Cancel.$.Size(this.$.x + 180, this.$.y + 230, 50, 30, this.$.z + 1);
        this.Red.$.Size(this.$.x + 20, this.$.y + 10, 20, 255, this.$.z + 1);
        this.Green.$.Size(this.$.x + 60, this.$.y + 10, 20, 255, this.$.z + 1);
        this.Blue.$.Size(this.$.x + 100, this.$.y + 10, 20, 255, this.$.z + 1);
        this.Alpha.$.Size(this.$.x + 140, this.$.y + 10, 20, 255, this.$.z + 1);
    }

    this.SetVisible = function (vis) {
        this.Ensure.$.visible = vis;
        this.Apply.$.visible = vis;
        this.Cancel.$.visible = vis;
        this.Red.$.visible = vis;
        this.Green.$.visible = vis;
        this.Blue.$.visible = vis;
        this.Alpha.$.visible = vis;
        this.$.visible = vis;
    }

    this.Get = function () {
        this.color = $RGBA(_r, _g, _b, _a);
        if (this.color < 0)
            this.color += Math.pow(2, 32);
        this.hex = this.color.toString(16).toUpperCase();
    }

    this.Set = function (title, rgba) {
        this.title = title;
        _r = rgba >> 16 & 0xff;
        _g = rgba >> 8 & 0xff;
        _b = rgba & 0xff;
        _a = rgba >> 24 & 0xff;
        this.Red.y = _r;
        this.Green.y = _g;
        this.Blue.y = _b;
        this.Alpha.y = _a;
        this.Get();
    }

    this.Draw = function () {
        this.img = gdi.CreateImage(140, 256);
        var g = this.img.GetGraphics();
        for (var i = 0; i < 256; i++) {
            g.FillSolidRect(0, i, 20, 1, $RGB(i, 0, 0));
            g.FillSolidRect(40, i, 20, 1, $RGB(0, i, 0));
            g.FillSolidRect(80, i, 20, 1, $RGB(0, 0, i));
            g.FillSolidRect(120, i, 20, 1, $RGB(i, i, i));
        }
        this.img.ReleaseGraphics(g);
    }
    this.Draw();

    this.Invalid = function () {
        this.$.click = false;
        if (this.$.drag) {
            this.$.drag = false;
            Drag.End();
            this.$.Repaint();
        }
    }

    this.OnMouse = function (event, x, y) {
        if (event == ON_MOUSE_LBTN_DOWN) {
            this.$.click = true;
        } else if (event == ON_MOUSE_LBTN_UP) {
            this.Invalid();
        } else if (event == ON_MOUSE_MOVE) {
            this.$.Move(x, y);
        }
    }

    this.OnPaint = function (gr) {
        gr.FillSolidRect(this.$.x, this.$.y, this.$.w, this.$.h, ThemeStyle.bgColor_l);
        gr.DrawRect(this.$.x, this.$.y, this.$.w - 1, this.$.h - 1, 1, ThemeStyle.fgColor_l);
        Image.Draw(gr, this.img, this.$.x + 20, this.$.y + 10, 0, 255);
        gr.FillSolidRect(this.$.x + 20, this.$.y + 10 + _r, 20, 1, $RGB(255, 255, 0));
        gr.FillSolidRect(this.$.x + 60, this.$.y + 10 + _g, 20, 1, $RGB(255, 255, 0));
        gr.FillSolidRect(this.$.x + 100, this.$.y + 10 + _b, 20, 1, $RGB(255, 255, 0));
        gr.FillSolidRect(this.$.x + 140, this.$.y + 10 + _a, 20, 1, $RGB(255, 255, 0));
        gr.GdiDrawText(this.title + ': 0x' + this.hex, ThemeStyle.font, ThemeStyle.fgColor, this.$.x + 20, this.$.y + 270, this.$.w - 40, 25, DT_LV);
        gr.SetSmoothingMode(2);
        gr.FillPolygon(ThemeStyle.fgColor, 0, Array(this.$.x + 20, this.$.y + 10 + _r, this.$.x + 15, this.$.y + 5 + _r, this.$.x + 15, this.$.y + 15 + _r));
        gr.FillPolygon(ThemeStyle.fgColor, 0, Array(this.$.x + 60, this.$.y + 10 + _g, this.$.x + 55, this.$.y + 5 + _g, this.$.x + 55, this.$.y + 15 + _g));
        gr.FillPolygon(ThemeStyle.fgColor, 0, Array(this.$.x + 100, this.$.y + 10 + _b, this.$.x + 95, this.$.y + 5 + _b, this.$.x + 95, this.$.y + 15 + _b));
        gr.FillPolygon(ThemeStyle.fgColor, 0, Array(this.$.x + 140, this.$.y + 10 + _a, this.$.x + 135, this.$.y + 5 + _a, this.$.x + 135, this.$.y + 15 + _a));
        gr.SetSmoothingMode(0);
        gr.GdiDrawText('R: ' + _r, ThemeStyle.font, ThemeStyle.fgColor, this.$.x + 185, this.$.y + 70, 50, 20, 0);
        gr.GdiDrawText('G: ' + _g, ThemeStyle.font, ThemeStyle.fgColor, this.$.x + 185, this.$.y + 90, 50, 20, 0);
        gr.GdiDrawText('B: ' + _b, ThemeStyle.font, ThemeStyle.fgColor, this.$.x + 185, this.$.y + 110, 50, 20, 0);
        gr.GdiDrawText('A: ' + _a, ThemeStyle.font, ThemeStyle.fgColor, this.$.x + 185, this.$.y + 130, 50, 20, 0);
        gr.FillSolidRect(this.$.x + 180, this.$.y + 10, 50, 50, $RGBA(_r, _g, _b, _a));
        gr.DrawRect(this.$.x + 180, this.$.y + 10, 49, 49, 1, $SetAlpha(ThemeStyle.fgColor, 64));
    }
}

var Color = null;

function AColor(x, y, z) {
    if (Color) {
        if (Color.$.visible)
            Color.Hide();
        else
            Color.Show();
    }
    else {
        Color = new oColor('Color');
        Color.$.Size(x + Color.padding, y + Color.padding, 250 - 2 * Color.padding, 300 - 2 * Color.padding, z);
        Panel.Sort();
        Color.Show();
    }
}