var ww = 0, wh = 0;
var dragging = false;

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
    g_bg && Wallpaper.$ && Image.Draw(gr, Wallpaper.$, 0, 0, 0, 255);

    if (g_unsized) {
        g_alpha && gr.FillSolidRect(0, 0, ww, wh, $SetAlpha(ThemeStyle.bgColor_hl, g_alpha));
        window.SetTimeout(function () { Load(); }, 1);
    }
    else {
        Panel.Paint(gr);
    }

    //welcome activity
    if (g_start_activity && g_alpha > 0) {
        if (Wallpaper.src.length == 0 && !Wallpaper.$) {
            window.SetTimeout(function () {
                UpdateWp();
                window.Repaint();
            }, 1);
        }
        gr.FillSolidRect(0, 0, ww, wh, $SetAlpha(ThemeStyle.bgColor_hl, g_alpha));
        if (Wallpaper.$)
            Image.Draw(gr, Wallpaper.$, 0, 0, 0, g_alpha);
    }
}

function on_mouse_lbtn_down(x, y) {
    if (g_unsized) return;
    Panel.Mouse(ON_MOUSE_LBTN_DOWN, x, y);
}

function on_mouse_lbtn_up(x, y) {
    if (g_unsized) return;
    Panel.Mouse(ON_MOUSE_LBTN_UP, x, y);
}

function on_mouse_lbtn_dblclk(x, y) {
    if (g_unsized) return;
    Panel.Mouse(ON_MOUSE_LBTN_DBLCK, x, y);
}

function on_mouse_rbtn_down(x, y) {
    if (g_unsized) return;
    Panel.Mouse(ON_MOUSE_RBTN_DOWN, x, y);
}

function on_mouse_rbtn_up(x, y) {
    if (g_unsized) return true;
    Panel.Mouse(ON_MOUSE_RBTN_UP, x, y);
    return true;
}

function on_mouse_mbtn_down(x, y) {
    if (g_unsized) return;
    Panel.Mouse(ON_MOUSE_MBTN_DOWN, x, y);
}

function on_mouse_mbtn_up(x, y) {
    if (g_unsized) return;
    Panel.Mouse(ON_MOUSE_MBTN_UP, x, y);
}

var g_activate = false;
var g_focused = false;

function on_mouse_move(x, y) {
    if (g_unsized) return;

    if (Mouse.x != x || Mouse.y != y) {
        Mouse.x = x;
        Mouse.y = y;
        Panel.Mouse(ON_MOUSE_MOVE, x, y);
    }
}

function on_mouse_leave() {
    if (g_unsized) return;

    Panel.Mouse(ON_MOUSE_LEAVE);
}

function on_focus(is_focused) {
    g_focused = is_focused;
}

var g_wheel_timer = null;
var g_step = 0;
var g_wheel_sensitive = 100;

function on_mouse_wheel(step) {
    if (g_unsized) return;

    //累加滚动步数
    g_wheel_timer && window.ClearTimeout(g_wheel_timer);
    g_wheel_timer = null;
    g_wheel_timer = window.SetTimeout(function () {
        g_step = 0;
        g_wheel_timer && window.ClearTimeout(g_wheel_timer);
        g_wheel_timer = null;
    }, g_wheel_sensitive);

    //反向立即清空
    if (g_step / step < 0)
        g_step = 0;
    g_step += step;

    Panel.Mouse(ON_MOUSE_WHEEL, g_step);
}

function on_playback_time(time) {
    if (AnimationOn || g_unsized) return;

    Top.Seek.x = Math.floor(Progress.Value() * Top.Seek.w);
    Top.Seek.$.Repaint();
    Exhibition.Seek.x = Math.floor(Progress.Value() * Exhibition.Seek.w);
    Exhibition.Seek.$.Repaint();

    Exhibition.OnTime();
    Playlist.OnTime();
    ListManager.OnTime();
    Lyric.OnTime();
}

function on_playback_new_track(metadb) {
    if (g_unsized) return;

    Top.Seek.x = 0;
    Top.Seek.$.Repaint();
    Exhibition.Seek.x = 0;
    Exhibition.Seek.$.Repaint();

    ListManager.$.Repaint();
    Playlist.SetPlaying();
    Info.Update();
    Rating.Update(Exhibition.$.visible);
    Top.Update(metadb);
    Lyric.Init(true);
    Group && Group.$.Repaint();

    window.SetTimeout(function () {
        Cover.NetCache && Image.Clear(Cover.NetCache.$);
        Cover.NetCache = null;
        Cover.Update();
        History.Write(metadb);
        Cover.autoDL && Cover.Download(true);
        if (Metadb.IsStream(metadb))
            utils.GetAlbumArtAsync(window.ID, metadb, 0, true, true);
    }, 5);
}

function on_playback_queue_changed(origin) {
    // Console.Log('播放队列更新...');
    PlayQueue.Init();
}

function on_playlist_switch() {
    if (g_unsized) return;

    Sort.lock && Sort.Sort(Sort.Input.str);
    Playlist.Init();
    AlbumBrowser.Init();
    AlbumList.Init();
    ArtistBrowser.Init();
    ArtistList.Init();
    PlaylistTop.Update();
    if (Playlist.id == fb.PlayingPlaylist) {
        window.SetTimeout(function () {
            Playlist.SetPlaying();
            Playlist.Show(Playlist.playing);
        }, 50);
    }
}

function on_playlists_changed() {
    if (g_unsized) return;

    var count = ListManager.count;
    var select = plman.ActivePlaylist;

    ListManager.Init();
    PlaylistTop.Update();

    if (count == ListManager.count - 1) {
        if (select == Math.pow(2, 32) - 1)
            select = count;

        //Tab.focus = 1;
        //Tab.Change();
        ListManager.EnsureVisible(select);
    }
}

function on_item_focus_change(pl, from, to) {
    if (g_unsized) return;

    if (pl == plman.ActivePlaylist) {
        Playlist.Show(to);
        AlbumBrowser.Show(AlbumBrowser.Find(to));
        ArtistBrowser.Show(ArtistBrowser.Find(to));
        AlbumList.Show(AlbumList.Find(to));
        ArtistList.Show(ArtistList.Find(to));
    }
}

function on_playlist_items_added(pl) {
    if (g_unsized) return;

    if (pl == plman.ActivePlaylist) {
        var last = Playlist.list.Count;
        Playlist.Init();
        Playlist.Show(last, Playlist.list.Count);

        AlbumBrowser.Init();
        ArtistBrowser.Init();

        AlbumList.Init();
        ArtistList.Init();

        PlaylistTop.Update();
    }
    ListManager.$.Repaint();
}

function on_playlist_items_removed(pl, new_count) {
    if (g_unsized) return;

    if (pl == plman.ActivePlaylist) {
        Playlist.Init();

        AlbumBrowser.Init();
        AlbumList.Init();

        ArtistBrowser.Init();
        ArtistList.Init();

        PlaylistTop.Update();
        ListManager.$.Repaint();
    }
}

function on_playlist_items_reordered(pl) {
    if (g_unsized) return;

    if (pl == plman.ActivePlaylist) {
        Playlist.Init();
        Playlist.$.Repaint();
        PlaylistTop.Update();
    }
}

function on_playback_edited() {
    if (g_unsized) return;

    Rating.Init();
    Rating.$.Repaint();
    Top.Title.Update(Metadb.TitleFormat('%title%'));
    Top.Artist.Update(Metadb.TitleFormat('[%artist%]'));
    Info.Update();
    Console.Log('更新文件标签...');
}

function on_playback_starting(cmd, is_paused) {

}

function on_playback_order_changed(new_index) {
    if (g_unsized) return;

    Image.Clear(g_pbo_icon);
    Top.Pbo.image = g_pbo_icon = $ZImage(gdi.Image(PATH_ICO + 'Pbo\\' + new_index + '.png'));
    Top.Pbo.$.Repaint();
}

function on_playback_pause(state) {

}

function on_playback_stop(reason) {
    if (g_unsized) return;

    if (reason != 2) {
        Top.Seek.x = 0;
        Top.Seek.$.Repaint();
        Exhibition.Seek.x = 0;
        Exhibition.Seek.$.Repaint();
        Playlist.SetPlaying();
        ListManager.$.Repaint();
        Info.Update();
        Lyric.Init(true);
        Cover.Update();
        Top.Update(null);
        Rating.Init();
        Rating.$.Repaint();
    }
}

function on_volume_change(val) {
    if (g_unsized) return;

    GetVol();
    Top.Vol.image = g_vol_icon;
    Top.Vol.$.Repaint();
    Top.Volume.y = Math.floor(Volume.Value() * Top.Volume.h);
    Top.Volume.$.Repaint();

    Exhibition.Volume.x = Math.floor(Volume.Value() * Exhibition.Volume.w);
    Exhibition.Volume.$.Repaint();
    Console.Log('音量: ' + Math.floor(Top.Volume.y * 100 / Top.Volume.h) + '%');
}

function on_font_changed() {
    GetFonts();
    window.Repaint();
}

function on_colors_changed() {
    GetColors();
    GetIcons();
    window.Repaint();
}

function on_notify_data(name, info) {
    if (g_unsized) return;

    if (name == 'Main') {
        if (info == 'MainMode') {
            fb.RunMainMenuCommand('视图/浮动面板/隐藏面板');
            hWnd.Show(1);
            /*var top = fb.GetMainMenuCommandStatus("视图/总在最上面");
            if (top) {
            fb.RunMainMenuCommand("视图/总在最上面");
            }*/
        }
        if (info == 'ChangeColor') {
            if (window.GetProperty('windows颜色主题', false)) {
                on_colors_changed();
            }
        }
    }
}

function on_key_down(vkey) {
    if (g_unsized) return;

    var mask = $GetKeyboardMask();
    if (mask == KMask.ctrlalt) {
        if (!Dialog || (Dialog && !Dialog.$.visible)) {
            var D = new Date();
            var milliseconds = D.getTime();
            var fn = MD5(String(milliseconds));
            var capture = hWnd.PrintWindow();
            ADialog('确认', '保存截屏?', Positive = function () {
                capture.SaveAs(PATH_CAPTURE + fn + '.jpg');
                capture.Dispose();
            }, Negative = function () {
                capture.Dispose();
            });
        }
        return;
    }

    switch (vkey) {
        case 116: //F5
            window.Repaint();
            break;
        case 32: //space
            break;
        default:
            break;
    }
    Panel.Key(vkey);
}

function on_char(code) {
    if (g_unsized) return;
    Panel.Char(code);
}

function on_drag_enter() {
    if (g_unsized) return;
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
    action.ToSelect = true;
    dragging = false;
}

function on_get_album_art_done(metadb, art_id, image, image_path) {
    if (!image && g_unsized) return;

    if (metadb.Compare(fb.GetNowPlaying())) {
        Cover.NetCache = new oImage(image_path, image);
        Cover.Update();
        Top.UpdatePhoto();
    }
}

function on_process_time() {
    AlbumBrowser.OnTime();
    ArtistBrowser.OnTime();
    if (g_wp && g_bg) {
        if (GetDesktopImage() != Wallpaper.src) {
            UpdateWp();
            window.Repaint();
        }
    }
}
