/*
var Console = new oConsole('Console');
Console.maxWidth;
Console.Log(text);
*/
oConsole = function (name) {
    this.$ = new oPanel(name, true);
    this.img = null;
    this.text = '';
    this.alpha = 0;
    this.timeout = null;
    this.visible = false;

    this.Animation = new oAnimation(name + '.Animation');

    this.Draw = function () {
        var img = gdi.CreateImage(this.$.w, this.$.h);
        var g = img.GetGraphics();
        g.FillSolidRect(0, 0, this.$.w - 1, this.$.h - 1, $RGB(64, 64, 64));
        g.DrawRect(0, 0, this.$.w - 1, this.$.h - 1, 1, $RGB(32, 32, 32));
        img.ReleaseGraphics(g);
        this.img = Image.ApplyShadow(img, this.$.w - 12, this.$.h - 12, 7, 6);
        img.Dispose();
    }

    this.OnHide = function () {
        eval(name).img && eval(name).img.Dispose();
        eval(name).img = null;
        eval(name).visible = false;
        eval(name).text = '';
        eval(name).$.visible = false;
    }

    this.Hide = function () {
        eval(name).timeout = window.SetTimeout(function () {
            eval(name).Animation.Alpha(eval(name), 255, 0, eval(name).$, 15, eval(name).OnHide);
            eval(name).timeout && window.ClearTimeout(eval(name).timeout);
            eval(name).timeout = null;
        }, 3000);
    }

    this.Log = function () {
        var text = '';
        for (var i = 0; i < arguments.length; i++)
            text += (arguments[i] + ' ');
        this.$.visible = true;

        if (this.visible) {
            this.timeout && window.ClearTimeout(this.timeout);
            this.timeout = null;
            this.text = text;
            this.$.Repaint();
            var old = this.$.w;
            this.$.w = Math.min(this.maxWidth, Math.floor($Calc(this.text, ThemeStyle.font, true) + 50));
            this.$.x = Math.floor((window.Width - this.$.w) / 2);
            if (old != this.$.w || !this.img)
                this.Draw();
            this.$.Repaint();
            this.Hide();
        }
        else {
            this.visible = true;
            this.text = text;
            var old = this.$.w;
            this.$.w = Math.min(this.maxWidth, Math.floor($Calc(this.text, ThemeStyle.font, true) + 50));
            this.$.x = Math.floor((window.Width - this.$.w) / 2);
            if (old != this.$.w || !this.img)
                this.Draw();
            this.Animation.Alpha(eval(name), 0, 255, this.$, 15, this.Hide);
        }
    }

    this.OnMouse = function (event, x, y) {
        if (event == ON_MOUSE_LBTN_DBLCK) {
            utils.SetClipboardText(this.text);
            this.Log('已复制到剪切板');
        }
    }

    this.OnPaint = function (gr) {
        Image.Draw(gr, this.img, this.$.x, this.$.y, 0, this.alpha);
        try {
            gr.GdiDrawText(this.text, ThemeStyle.font, $RGB(255, 255, 255), this.$.x + 25, this.$.y, this.$.w - 50, this.$.h, DT_CV);
        }
        catch (e) {
            gr.GdiDrawText(e.name + ':' + e.message, ThemeStyle.font, $RGB(255, 255, 255), this.$.x + 25, this.$.y, this.$.w - 50, this.$.h, DT_CV);
        }
    }
}

var Console = null;