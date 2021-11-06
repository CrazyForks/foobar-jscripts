var dragging = false;

var hWnd = null;
var g_dpi = [];
var ww = 0, wh = 0;
var g_hide = window.GetProperty('隐藏', true);
var wTimer = null;
var wMin = 80;
var wMax = 300;

var g_metadb = null;

var ThemeStyle = {};
ThemeStyle.smallFont = gdi.Font('华文新魏', 12);
ThemeStyle.font = gdi.Font('华文新魏', 13);
ThemeStyle.bigFont = gdi.Font('华文新魏', 15);
ThemeStyle.fgColor = 0xffffffff;
ThemeStyle.fgColor_hl = 0xffffffff;
ThemeStyle.bgColor = 0xff0080ff;

var g_nocover_icon = null;
var g_mode_icon = null;
var g_hs_icon = null;
var g_next_icon = null;

var Cover = null;
var Title = null;
var Artist = null;
var Seekbar = null;
var HSbtn = null;
var Back = null;
var Next = null;

var Animation = new oAnimation('Animation');
var WshShell = $Wss();
var RegDesktopColor = 'HKEY_CURRENT_USER\\SOFTWARE\\Microsoft\\Windows\\DWM\\ColorizationColor';
var DesktopColor = null;

oRating = function (name) {
    this.$ = new oPanel(name, true);
    this.rate = -1;
    this.solid = $Font2Icon("61445");
    this.empty = $Font2Icon("61446");
    this.font = gdi.Font('Fontawesome', 14);

    this.Update = function (metadb) {
        if (!metadb) {
            this.rate = -1;
            return;
        }
        if (Metadb.EnableMeta(metadb))
            this.rate = Metadb.TitleFormat('$meta(RATING)', metadb);
        else
            this.rate = -1;
    }

    this.Active = function (x, y) {
        if (this.rate < 0) return -1;

        if (x > this.$.x && x < this.$.x + 100 && y > this.$.y && y < this.$.y + this.$.h) {
            var i = Math.ceil((x - this.$.x) / 20);
            if (i != this.rate);
            {
                return i;
            }
        }
        return -1;
    }

    this.Activate = function () {
        if (this.rate < 0) return;
        Artist.$.visible = false;
        Artist.$.Repaint(true);
    }

    this.Invalid = function () {
        Artist.$.visible = true;
        Artist.$.Repaint();
    }

    this.OnMouse = function (event, x, y) {
        if (this.rate < 0) return;

        if (event == ON_MOUSE_LBTN_UP) {
            var rate = this.Active(x, y);
            if (rate > -1 && this.rate != rate) {
                this.rate = rate;
                g_metadb.UpdateFileInfoSimple("RATING", this.rate);
                this.$.Repaint();
            }
        }
        else if (event == ON_MOUSE_RBTN_UP) {
            g_metadb.UpdateFileInfoSimple("RATING", '');
            this.rate = 0;
            this.$.Repaint();
        }
    }

    this.OnPaint = function (gr) {
        if (this.rate < 0 || !this.$.active) return;

        for (var i = 0; i < 5; i++) {
            if (i < this.rate)
                gr.GdiDrawText(this.solid, this.font, ThemeStyle.fgColor, this.$.x + i * 20, this.$.y, 20, 25, DT_LV);
            else
                gr.GdiDrawText(this.empty, this.font, ThemeStyle.fgColor, this.$.x + i * 20, this.$.y, 20, 25, DT_LV);
        }
    }
}
var Rating = new oRating('Rating');

(function () {
    hWnd = $GetHWnd(1);
    hWnd.Height = wMin;
    hWnd.Width = wMax;

    g_dpi = $GetDPI();
    hWnd.Left = g_dpi[0] - (g_hide ? wMin : wMax);
    hWnd.Top = g_dpi[1] - 120;

    ThemeStyle.bgColor = GetDesktopColor();
})();

function MainMode() {
    window.NotifyOthers('Main', 'MainMode');
}

function Slide(org, des, func) {
    wTimer && window.ClearInterval(wTimer);
    wTimer = null;
    wTimer = window.SetInterval(function () {
        org += ((des - org) / 5).One();
        if (Math.abs(des - org) <= 1) {
            org = des;
            if (typeof (func) != 'undefined')
                func();
            wTimer && window.ClearInterval(wTimer);
            wTimer = null;
        }
        hWnd.Move(org, hWnd.Top, hWnd.Width, hWnd.Height, false);
    }, ANIMATION_INTERVAL);
}

function HideOrShow() {
    var org = hWnd.Left;
    var des = 0;
    if (g_hide) {
        g_hide = false;
        des = g_dpi[0] - wMax;
    }
    else {
        g_hide = true;
        des = g_dpi[0] - wMin;
    }
    window.SetProperty('隐藏', g_hide);
    Slide(org, des);
}

function GetDesktopColor(value) {
    try {
        DesktopColor = typeof (value) == 'undefined' ? WshShell.RegRead(RegDesktopColor) : value;
        return $SetBright($SetAlpha(DesktopColor, 255), -70);
    }
    catch (e) {
        DesktopColor = null;
        return $SetAlpha(ThemeStyle.bgColor, 255);
    }
}

function GetIcons(size) {
    var g = null;

    g_nocover_icon = gdi.CreateImage(size, size);
    g = g_nocover_icon.GetGraphics();
    g.SetSmoothingMode(4);
    g.DrawEllipse(10, 10, size - 20, size - 20, 1, 0xffffffff);
    g.DrawEllipse(30, 30, size - 60, size - 60, 1, 0xffffffff);
    g.DrawEllipse(10, 10, size - 20, size - 20, 2, 0x80ffffff);
    g.DrawEllipse(30, 30, size - 60, size - 60, 2, 0x80ffffff);
    g_nocover_icon.ReleaseGraphics(g);

    g_hs_icon = gdi.CreateImage(size, size);
    g = g_hs_icon.GetGraphics();
    g.SetSmoothingMode(4);
    var mid = Math.floor(size / 2);
    g.DrawLine(mid - 10, mid - 20, mid + 10, mid + 1, 3, 0xffffffff);
    g.DrawLine(mid - 10, mid + 20, mid + 10, mid - 1, 3, 0xffffffff);
    g_hs_icon.ReleaseGraphics(g);

    g_mode_icon = gdi.CreateImage(30, 30);
    g = g_mode_icon.GetGraphics();
    g.FillSolidRect(6, 9, 18, 2, 0xffffffff);
    g.FillSolidRect(6, 15, 18, 2, 0xffffffff);
    g.FillSolidRect(6, 21, 18, 2, 0xffffffff);
    g_mode_icon.ReleaseGraphics(g);

    g_next_icon = gdi.CreateImage(30, 30);
    g = g_next_icon.GetGraphics();
    g.SetSmoothingMode(4);
    g.DrawPolygon(0xffffffff, 2, Array(9, 8, 9, 22, 19, 15));
    g.DrawPolygon(0x80ffffff, 2, Array(9, 8, 9, 22, 19, 15));
    g.SetSmoothingMode(0);
    g.DrawLine(23, 9, 23, 23, 2, 0xffffffff);
    g_next_icon.ReleaseGraphics(g);

    g = null;
}

function Update(metadb) {
    var objArrHide = [
		[Cover, -(wMin + 2), null, null, null, -90, 0],
			[Title.$, null, -55, null, null, null, null],
			[Artist.$, null, -55, null, null, null, null],
			[Seekbar.$, null, wMin, null, null, null, null]
	];
    var objArrShow = [
		[Cover, -1, null, null, null, 0, 255],
			[Title.$, null, 10, null, null, null, null],
			[Artist.$, null, 35, null, null, null, null],
			[Seekbar.$, null, 60, null, null, null, null]
	];
    Animation.SSAV2(objArrHide, true, 8, onHide = function () {
        onUpdate(metadb);
        Animation.SSAV2(objArrShow, true, 8, onShow = function () {
        });
    });
}

function onUpdate(metadb) {
    g_metadb = metadb;
    //封面更新
    var oimage = AlbumArt.GetAtLeast(metadb, 0, true, true);
    if (!oimage.$) {
        oimage = new oImage(null, g_nocover_icon);
    }
    Cover.Update(oimage);

    //音轨信息更新
    Rating.Update(metadb);
    if (metadb) {
        Title.Update(Metadb.TitleFormat('%title%', metadb));
        Artist.Update(Metadb.TitleFormat('%artist%', metadb));
    }
    else {
        Title.Update('Fomer Mini');
        Artist.Update('Keperlia');
    }
}

function on_process_time() {
    try {
        var color = WshShell.RegRead(RegDesktopColor);
        if (color != DesktopColor) {
            ThemeStyle.bgColor = GetDesktopColor(color);
            window.NotifyOthers('Main', 'ChangeColor');
            window.Repaint();
        }
    } catch (e) { }
}

function Load() {
    if (!g_unsized) return;
    if (!g_unloaded) return;

    if (DesktopColor != null)
        ProcessTimer(1000);
    //封面加载
    GetIcons(wMin + 2);
    var oimage = new oImage(null, g_nocover_icon);
    Cover = new oImg(oimage, wMin + 2, wMin + 2, IMG_FILL, 0, 255, 2, IMG_CENTER, IMG_NONE);
    g_unloaded = false;

    //控件加载
    Title = new oText('Title', 'Fomer', ThemeStyle, onTitle = function () {
        fb.PlayOrPause();
    });
    Artist = new oText('Artist', 'Keperlia', ThemeStyle);

    Seekbar = new oDragBar('Seekbar', onSeek = function (x, y, w, h) {
        Progress.Set(x / w);
        Seekbar.$.Repaint();
    });
    HSbtn = new oImageButton('HSbtn', null, HideOrShow, 0x80000000, 0x80000000, SHAPE_SOLID);
    Back = new oImageButton('Back', g_mode_icon, MainMode, 0x40000000, 0x80000000, SHAPE_ELLIPSE);
    Next = new oImageButton('Next', g_next_icon, onNext = function () { fb.Next(); return true; }, 0x40000000, 0x80000000, SHAPE_ELLIPSE);

    SetVisible(true);
    Layout();
}

function SetVisible(vis) {
    for (var i = 0; i < Panel.panels.length; i++) {
        eval(Panel.panels[i]).$.visible = true;
    }
}

function Layout() {
    if (g_unloaded) return;

    //布局
    Cover.x = -1;
    Cover.y = -1;

    Title.$.Size(wMin + 10, 10, wMax - wMin - 80, 20);
    Artist.$.Size(wMin + 10, 35, wMax - wMin - 100, 20);
    Rating.$.Size(wMin + 10, 35, wMax - wMin - 100, 20, 1);

    Seekbar.$.Size(wMin + 10, 60, wMax - wMin - 20, 10);
    HSbtn.$.Size(0, 0, wMin + 1, wMin);
    Back.$.Size(wMax - 40, 6, 30, 30);
    Next.$.Size(wMax - 70, 6, 30, 30);

    if (g_unsized) {
        onUpdate(Metadb.Handle());
        Panel.Sort();
        window.Repaint();
        g_unsized = false;
    }
}

function on_size() {
    if (!window.Width || !window.Height) {
        return;
    }
    ww = window.Width;
    wh = window.Height;

    Layout();
}

function on_paint(gr) {
    gr.FillSolidRect(0, 0, ww, wh, ThemeStyle.bgColor);

    if (g_unsized)
        window.SetTimeout(function () { Load(); }, 1);
    else {
        Cover.Paint(gr, Cover.x, Cover.y);
        Panel.Paint(gr);

        if (HSbtn.state != STATE_NORMAL) {
            Image.Draw(gr, g_hs_icon, 0, 0, g_hide ? -180 : 0, HSbtn.state == STATE_HOVER ? 255 : 128);
        }
        gr.FillSolidRect(Seekbar.$.x, Seekbar.$.y + 4, Seekbar.$.w, Seekbar.$.h - 8, 0x40ffffff);
        if (fb.IsPlaying) {
            var seektip = Metadb.TitleFormat("$if( %length%, [%playback_time%], '--:--' ) / $if( %length%, %length%, '0:00' )");
            gr.GdiDrawText(seektip, ThemeStyle.smallFont, ThemeStyle.fgColor, Seekbar.$.x + Seekbar.$.w - 70, Seekbar.$.y - 20, 70, 20, DT_RV);
            gr.FillSolidRect(Seekbar.$.x, Seekbar.$.y + 4, Seekbar.x, Seekbar.$.h - 8, 0xffffffff);
        }
    }
}

function on_mouse_lbtn_down(x, y) {
    Panel.Mouse(ON_MOUSE_LBTN_DOWN, x, y);
}

function on_mouse_lbtn_up(x, y) {
    Panel.Mouse(ON_MOUSE_LBTN_UP, x, y);
}

function on_mouse_lbtn_dblclk(x, y) {
    Panel.Mouse(ON_MOUSE_LBTN_DBLCK, x, y);
}

function on_mouse_rbtn_down(x, y) {
    Panel.Mouse(ON_MOUSE_RBTN_DOWN, x, y);
}

function on_mouse_rbtn_up(x, y) {
    Panel.Mouse(ON_MOUSE_RBTN_UP, x, y);
    if (HSbtn.state != STATE_NORMAL) {
        Menu.NowPlaying(x, y);
    }
    return true;
}

function on_mouse_mbtn_down(x, y) {
    Panel.Mouse(ON_MOUSE_MBTN_DOWN, x, y);
}

function on_mouse_mbtn_up(x, y) {
    Panel.Mouse(ON_MOUSE_MBTN_UP, x, y);
}

function on_mouse_move(x, y) {
    if (Mouse.x != x || Mouse.y != y) {
        Mouse.x = x;
        Mouse.y = y;
        Panel.Mouse(ON_MOUSE_MOVE, x, y);
    }
}

function on_mouse_leave() {
    Panel.Mouse(ON_MOUSE_LEAVE);
}

function on_mouse_wheel(step) {
    Panel.Mouse(ON_MOUSE_WHEEL, step);
}

function on_playback_time(time) {
    if (AnimationOn || g_unsized) return;

    Seekbar.x = Math.floor(Progress.Value() * Seekbar.w);
    Seekbar.$.Repaint();
    Seekbar.$.RepaintRect(Seekbar.$.w - 80, -20, 80, 20);
}

function on_playback_new_track(metadb) {
    if (g_unsized) return;

    Seekbar.x = 0;
    Seekbar.$.Repaint();
    Update(metadb);
    if (metadb.Path.indexOf('http://') != -1)
        utils.GetAlbumArtAsync(window.ID, metadb, 0, true, true);
}

function on_playlist_switch() {
    if (g_unsized) return;
}

function on_playlists_changed() {
    if (g_unsized) return;
}

function on_playlist_items_selection_change() {
    if (g_unsized) return;
}

function on_item_focus_change(pl, from, to) {
    if (g_unsized) return;
}

function on_playlist_items_added(pl) {
    if (g_unsized) return;
}

function on_playlist_items_removed(pl, new_count) {
    if (g_unsized) return;
}

function on_playlist_items_reordered(pl) {
    if (g_unsized) return;
}

function on_playback_edited() {
    if (g_unsized) return;

    Rating.Update(g_metadb);
}

function on_playback_starting(cmd, is_paused) {

}

function on_playback_order_changed(new_index) {
    if (g_unsized) return;
}

function on_playback_pause(state) {

}

function on_playback_stop(reason) {
    if (g_unsized) return;

    if (reason != 2) {
        Seekbar.x = 0;
        Seekbar.$.Repaint();
        Update(null);
    }
}

function on_volume_change(val) {
    if (g_unsized) return;
}

function on_notify_data(name, info) {
    if (name == 'Mini') {
        if (info == 'MiniMode') {
            fb.RunMainMenuCommand('视图/浮动面板/激活/1 - Mini');
            hWnd.Left = g_dpi[0];
            /*var top = fb.GetMainMenuCommandStatus("视图/总在最上面");
            if (!top) {
            fb.RunMainMenuCommand("视图/总在最上面");
            }*/

            var des = g_dpi[0] - (g_hide ? wMin : wMax);
            var org = g_dpi[0];
            Slide(org, des);
        }
    }
}

function on_key_down(vkey) {
    Panel.Key(vkey);
}

function on_char(code) {
    Panel.Char(code);
}

function on_drag_enter() {
    dragging = true;
}

function on_drag_over(action, x, y) {
    Panel.Mouse(ON_MOUSE_LBTN_DOWN, x, y);
}

function on_drag_leave() {
    dragging = false;
}

function on_drag_drop(action, x, y) {
    action.ToPlaylist();
    action.Playlist = Playlist.id;
    dragging = false;
}

function on_get_album_art_done(metadb, art_id, image, image_path) {
    if (!image || !g_metadb) return;

    if (metadb.Compare(g_metadb)) {
        //封面更新
        var oimage = new oImage(image_path, image);
        Cover.Update(oimage);
        window.Repaint();
    }
    image.Dispose();
}