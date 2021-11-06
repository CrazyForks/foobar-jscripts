Main = {
    $: new oPanel('Main'),

    OnSize: function () {
        var x = this.$.x;
        var y = this.$.y;
        var w = this.$.w;
        var h = this.$.h;
        Console.maxWidth = w - $Z(50);
        Console.$.y = y + h - $Z(100);

        Tab.$.Size(x, y + h - $Z(30), w, $Z(30));
        Top.$.Size(x, y, w, $Z(70));

        PlaylistTop.$.Size(x, Top.$.y + Top.$.h, w, $Z(60));

        ListManager.$.Size(x, Top.$.y + Top.$.h, w, h - Tab.$.h - Top.$.h);
        Explorer.$.Size(x, Top.$.y + Top.$.h, w, h - Tab.$.h - Top.$.h);
        Setting.$.Size(x, Top.$.y + Top.$.h, w, h - Tab.$.h - Top.$.h);

        Info.$.Size(x + w - Math.min(w - $Z(80), $Z(450)), y, Math.min(w - $Z(80), $Z(450)), h);
        Exhibition.$.Size(x, y, w, h);

        PlayQueue.$.Size(0, Main.$.y + Main.$.h + PlayQueue.rowHeight, ww, $Z(250), $Z(45));
        if (g_exhibit)
            Rating.$.Size(x + Math.floor(w / 2 - $Z(47)), y + h - $Z(160), $Z(100), $Z(30));
        else
            Rating.$.Size(x + w - $Z(110), y + $Z(7), $Z(100), $Z(30));
    }
}

// Dialog
oDialog = function (name) {

    this.$ = new oPanel(name, false, true, ThemeStyle);
    this.title = '';
    this.text = '';
    this.img = null;

    this.Init = function () {
        this.OnEnsure = function () {
            $Invoke(name, 'Positive');
            $Invoke(name, 'OnCancel');
        }
        this.OnCancel = function () {
            if (typeof (eval(name).Negative()) == 'function') {
                eval(name).Negative();
            }
            eval(name).SetVisible(false);
            eval(name).$.Hide();
        }

        this.Ensure = new oButton(name + '.Ensure', '确定', this.OnEnsure, true, true);
        this.Cancel = new oButton(name + '.Cancel', '取消', this.OnCancel, true, true);
    }
    this.Init();

    this.SetVisible = function (vis) {
        this.Ensure.$.visible = vis;
        this.Cancel.$.visible = vis;
        this.$.visible = vis;
        Image.Clear(this.img);
        this.img = null;
    }

    this.OnSize = function () {
        this.Ensure.$.Size(this.$.x + 10, this.$.y + this.$.h - 45, 100, 35, this.$.z + 1);
        this.Cancel.$.Size(this.$.x + this.$.w - 110, this.$.y + this.$.h - 45, 100, 35, this.$.z + 1);
    }

    this.OnPaint = function (gr) {
        if (!this.img) {
            this.img = $BlurGlass(gr, this.$.x, this.$.y, this.$.w, this.$.h, 15, 2);
        }
        Image.Draw(gr, this.img, this.$.x, this.$.y, 0, 255);
        gr.GdiDrawText(this.title, ThemeStyle.font, ThemeStyle.fgColor, this.$.x + 10, this.$.y + 5, this.$.w - 20, 30, DT_LV);
        gr.DrawLine(this.$.x, this.$.y + 35, this.$.x + this.$.w - 1, this.$.y + 35, 1, $SetAlpha(ThemeStyle.fgColor, 64));
        gr.GdiDrawText(this.text, ThemeStyle.font, ThemeStyle.fgColor, this.$.x + 15, this.$.y + 40, this.$.w - 30, 30, DT_LV);
    }
}

var Dialog = null;

function ADialog(title, text, Positive, Negative, OnShow) {
    if (Dialog) {
        Dialog.title = title;
        Dialog.text = text;
        Dialog.Positive = Positive;
        Dialog.Negative = Negative;

        Dialog.$.Size(Math.floor(ww / 2 - $Z(115)), Math.floor(wh / 2 - $Z(60)), $Z(230), $Z(120), 95);
        Dialog.SetVisible(true);
        Dialog.$.Show();
    } else {
        Dialog = new oDialog('Dialog');
        Dialog.$.Size(Math.floor(ww / 2 - $Z(115)), Math.floor(wh / 2 - $Z(60)), $Z(230), $Z(120), 95);
        Panel.Sort();

        Dialog.title = title;
        Dialog.text = text;
        Dialog.Positive = Positive;
        Dialog.Negative = Negative;

        Dialog.SetVisible(true);
        Dialog.$.Show();
    }
}

// Input
// need to override Input.Defocus();
var Input = null;

function AInput(str, x, y, w, h) {
    if (!Input) {
        var newThemeStyle = $cloneObject(ThemeStyle);
        newThemeStyle.bgColor = $SetAlpha(ThemeStyle.bgColor, 255);
        Input = new oInputBox('Input', 10, '', newThemeStyle);
        Input.$.Size(x, y, w, h, 98);
        Input.str = str;
        Panel.Sort();
    }
    else {
        Input.$.Size(x, y, w, h);
        Input.Reset();
        if (str)
            Input.str = str;
    }
    Input.$.Show();
    Panel.Analog(Input, ON_MOUSE_MOVE);
    Panel.Analog(Input, ON_MOUSE_LBTN_DOWN);
    Panel.Analog(Input, ON_MOUSE_LBTN_UP);
    Panel.Analog(Input, ON_MOUSE_LBTN_DBLCK);
    Panel.Mouse(ON_MOUSE_MOVE, Mouse.x, Mouse.y);
}

// ProgressBar
oProgressBar = function (name) {

    this.$ = new oPanel(name, false, true, ThemeStyle);
    this.Loading = new oLoading(name + '.Loading', name);
    this.text = '';
    this.img = null;
    this.timeout = 5000;

    this.Loading.OverTime = function () {
        eval(name).SetVisible(false);
        eval(name).$.Hide();
    }

    this.SetVisible = function (vis) {
        if (vis) {
            this.Loading.Start(10, 10, this.timeout);
        } else {
            this.Loading.Reset();
        }
        Image.Clear(this.img);
        this.img = null;
        this.$.visible = vis;
    }

    this.OnPaint = function (gr) {
        if (!this.img) {
            this.img = $BlurGlass(gr, this.$.x, this.$.y, this.$.w, this.$.h, 15, 2);
        }
        Image.Draw(gr, this.img, this.$.x, this.$.y, 0, 255);
        this.Loading.Paint(gr);
        gr.GdiDrawText(this.text, ThemeStyle.bigFont, ThemeStyle.fgColor, this.$.x + 60, this.$.y + 10, this.$.w - 70, 50, DT_LV);
    }
}

var ProgressBar = null;

function AProgress(text, timeout) {
    if (ProgressBar) {
        if (ProgressBar.$.visible) {
            ProgressBar.text = text;
            ProgressBar.Loading.Reset();
            ProgressBar.$.Repaint();
            window.SetTimeout(function () {
                ProgressBar.SetVisible(false);
                ProgressBar.$.Hide();
            }, timeout);
            return;
        }
        ProgressBar.$.Size(Math.floor(ww / 2 - 115), Math.floor(wh / 2 - 35), 230, 70, 95);

        ProgressBar.text = text;
        ProgressBar.timeout = timeout;
        ProgressBar.SetVisible(true);
        ProgressBar.$.Show();
    } else {
        ProgressBar = new oProgressBar('ProgressBar');
        ProgressBar.$.Size(Math.floor(ww / 2 - 115), Math.floor(wh / 2 - 35), 230, 70, 95);
        Panel.Sort();

        ProgressBar.text = text;
        ProgressBar.timeout = timeout;
        ProgressBar.SetVisible(true);
        ProgressBar.$.Show();
    }
}