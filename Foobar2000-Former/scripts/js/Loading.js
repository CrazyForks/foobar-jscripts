/**
var Loading = new oLoading('Loading', parentName);
Loading.Start(x = 0, y = 0, timeout = 5000);
Loading.Paint(gr);
*/
oLoading = function (name, parentName) {
    this.parent = typeof (parentName) == 'undefined' ? null : parentName;
    this.icon = null;
    this.timer = null;
    this.x = 0;
    this.y = 0;
    this.alpha = 0;
    this.size = 50;

    var RelativeX = 0;
    var RelativeY = 0;

    this.GetLoading = function (i) {
        this.icon && this.icon.Dispose();
        this.icon = gdi.CreateImage(50, 50);
        var g = this.icon.GetGraphics();
        g.SetSmoothingMode(4);
        for (var j = i; j > Math.max(0, i - 4); j--) {
            this.Draw(g, j);
        }
        this.icon.ReleaseGraphics(g);
    }

    this.Repaint = function () {
        if (this.parent) {
            if (!eval(this.parent).$.visible) return;
            RelativeX = eval(this.parent).$.x;
            RelativeY = eval(this.parent).$.y;
            if (!AnimationOn)
                $RepaintRect(this.x + RelativeX, this.y + RelativeY, this.size, this.size);
        } else if (!AnimationOn) {
            $RepaintRect(this.x, this.y, this.size, this.size);
        }
    }

    this.Draw = function (g, i) {
        switch (i) {
            case 1: g.FillEllipse(11, 11, 6, 6, ThemeStyle.fgColor); break;
            case 2: g.FillEllipse(20, 7, 6, 6, ThemeStyle.fgColor); break;
            case 3: g.FillEllipse(30, 9, 6, 6, ThemeStyle.fgColor); break;
            case 4: g.FillEllipse(35, 18, 6, 6, ThemeStyle.fgColor); break;
            case 5: g.FillEllipse(33, 31, 6, 6, ThemeStyle.fgColor); break;
            case 6: g.FillEllipse(24, 35, 6, 6, ThemeStyle.fgColor); break;
            case 7: g.FillEllipse(15, 34, 6, 6, ThemeStyle.fgColor); break;
            case 8: g.FillEllipse(9, 28, 6, 6, ThemeStyle.fgColor); break;
            case 9: g.FillEllipse(7, 20, 6, 6, ThemeStyle.fgColor); break;
        }
    }

    this.Start = function (x, y, timeout, start) {
        if (timeout <= 0) {
            this.Reset();
            this.OverTime();
            return;
        }
        this.x = x;
        this.y = y;
        var prev = typeof (start) == 'undefined' ? 0 : start;
        var next = prev > 8 ? 0 : prev + 1;
        this.alpha = next * 51;
        if (this.alpha > 255) {
            this.alpha = 255 - (this.alpha - 255);
        }
        var sleep = 150 - prev * 15;
        var dead = timeout - sleep;

        this.timer = window.SetTimeout(function () {
            eval(name).GetLoading(next);
            eval(name).Repaint();
            eval(name).Start(x, y, dead, next);
        }, sleep);
    }

    this.Reset = function () {
        this.timer && window.ClearTimeout(this.timer);
        this.timer = null;
        this.icon && this.icon.Dispose();
        this.icon = null;
        this.parent && eval(this.parent).$.Repaint();
    }

    this.OverTime = function () {
    }

    this.Paint = function (gr) {
        if (this.icon) {
            if (this.parent) {
                RelativeX = eval(this.parent).$.x;
                RelativeY = eval(this.parent).$.y;
            }
            gr.DrawImage(this.icon, this.x + RelativeX, this.y + RelativeY, this.size, this.size, 0, 0, this.icon.Width, this.icon.Height, 0, this.alpha);
            return false;
        }
        else
            return true;
    }
}