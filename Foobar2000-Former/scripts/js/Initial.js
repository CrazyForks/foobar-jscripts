//全局
var hWnd = null;
var g_debug = window.GetProperty('跟踪调试', false);

var g_tab = window.GetProperty('标签', 0);
var g_tabs = null;

var g_playlist_tab = window.GetProperty('播放列表标签', 0);
var g_playlist_tabs = null;

var g_exhibit = window.GetProperty('展示', false);
var g_table = window.GetProperty('展示台', 0);
var g_tables = null;

var g_start_activity = window.GetProperty('启动界面', true);
var g_bg = window.GetProperty('背景壁纸', false);
var g_wp = window.GetProperty('桌面壁纸', false);
var g_alpha = 255;
var Wallpaper = new oImage('', null);
var g_profiler = null;

var ThemeStyle = {
    font: null,
    smallFont: null,
    bigFont: null,
    hugeFont: null,

    color: 0,

    fgColor: 0,
    fgColor_l: 0,
    fgColor_hl: 0,

    bgColor: 0,
    bgColor_l: 0,
    bgColor_hl: 0
}

function $ZImage (image, interpo) {
    return image.Resize($Z(image.width), $Z(image.height), interpo);
}

var g_mini_icon = $ZImage(gdi.Image(PATH_ICO + 'mini.png'));
var g_vol_icon = null, g_point_icon = null;
var g_pbo_icon = $ZImage(gdi.Image(PATH_ICO + 'Pbo\\' + fb.PlaybackOrder + '.png'));
var g_menu_icon = $ZImage(gdi.Image(PATH_ICO + 'menu.png'));

var g_arrow_icon = null, g_pos_icon = null;
var g_search_icon = null, g_sort_icon = null;
var g_list_icon = null, g_group_icon = null;
var g_isp1_icon = null, g_isp2_icon = null;
var g_forward_icon = null, g_back_icon = null;
var g_play_icon = null, g_pause_icon = null;
var g_prev_icon = null, g_next_icon = null;
var g_track_icon = null, g_home_icon = null;
var g_true_icon = null, g_false_icon = null;
var g_clock_icon = null, g_check_icon = null;

function GetFolder() {
    var fso = $Fso();
    !fso.FolderExists(PATH_DATA) && fso.CreateFolder(PATH_DATA);
    !fso.FolderExists(PATH_ALBUM) && fso.CreateFolder(PATH_ALBUM);
    !fso.FolderExists(PATH_ARTIST) && fso.CreateFolder(PATH_ARTIST);
    !fso.FolderExists(PATH_TEMP) && fso.CreateFolder(PATH_TEMP);
    !fso.FolderExists(PATH_TXT) && fso.CreateFolder(PATH_TXT);
    !fso.FolderExists(PATH_LRC) && fso.CreateFolder(PATH_LRC);
    !fso.FolderExists(PATH_CAPTURE) && fso.CreateFolder(PATH_CAPTURE);
    !fso.FolderExists(PATH_IMAGE) && fso.CreateFolder(PATH_MEDIA);

    !fso.FolderExists(PATH_CACHE) && fso.CreateFolder(PATH_CACHE);
    !fso.FolderExists(PATH_IMAGE) && fso.CreateFolder(PATH_IMAGE);

    fso = null;
}

function GetCustomFont() {
    var font_name = window.GetProperty('字体名称', '微软雅黑');
    var font_size = window.GetProperty('字体大小', 12);
    var font_type = window.GetProperty('字体类型', 0);
    ThemeStyle.font = gdi.Font(font_name, $Z(font_size), font_type);
}

function GetFonts() {
    if (window.GetProperty('自定义颜色，字体', false)) {
        GetCustomFont();
    }
    else if (window.InstanceType == InstanceType.CUI) {
        ThemeStyle.font = window.GetFontCUI(FontTypeCUI.items);
    }
    else if (window.InstanceType == InstanceType.DUI) {
        ThemeStyle.font = window.GetFontDUI(FontTypeDUI.defaults);
    }

    ThemeStyle.smallFont = gdi.Font(ThemeStyle.font.Name, ThemeStyle.font.Size - 2, ThemeStyle.font.Style);
    ThemeStyle.bigFont = gdi.Font(ThemeStyle.font.Name, ThemeStyle.font.Size + 2, ThemeStyle.font.Style);
    ThemeStyle.hugeFont = gdi.Font(ThemeStyle.font.Name, ThemeStyle.font.Size + 6, ThemeStyle.font.Style);
}

function GetCustomColor() {
    ThemeStyle.bgColor = window.GetProperty('背景颜色', 0xc0ffffff);
    ThemeStyle.bgColor_hl = window.GetProperty('背景高亮颜色', 0x800096fa);
    ThemeStyle.fgColor = window.GetProperty('文本颜色', 0xff000000);
    ThemeStyle.fgColor_hl = window.GetProperty('文本高亮颜色', 0xff0080ff);
}

function GetDesktopColor(enable) {
    if (!enable)
        return $SetAlpha(ThemeStyle.bgColor_hl, 255);

    var personal = 'HKEY_CURRENT_USER\\SOFTWARE\\Microsoft\\Windows\\DWM\\ColorizationColor';
    var wss = $Wss();
    try {
        return $SetAlpha(wss.RegRead(personal), 255);
    } catch (e) {
        return $SetAlpha(ThemeStyle.bgColor_hl, 255);
    }
}

function GetDesktopImage() {
    if (g_wp) {
        var personal = 'HKEY_CURRENT_USER\\Control Panel\\Desktop\\Wallpaper';
        var wss = $Wss();
        try {
            return wss.RegRead(personal);
        } catch (e) {
            return null;
        }
    } else {
        return null;
    }
}

function GetColors() {
    ThemeStyle.fgColor_l = window.GetProperty('文本颜色( 淡 )', 0xff808080);
    ThemeStyle.bgColor_l = window.GetProperty('背景颜色( 淡 )', 0xc0f0f0f0);

    if (window.GetProperty('自定义颜色，字体', false)) {
        GetCustomColor();
    }
    else if (window.InstanceType == InstanceType.CUI) {
        ThemeStyle.fgColor = window.GetColorCUI(ColorTypeCUI.text);
        ThemeStyle.fgColor_hl = window.GetColorCUI(ColorTypeCUI.active_item_frame);
        ThemeStyle.bgColor = window.GetColorCUI(ColorTypeCUI.background);
        ThemeStyle.bgColor_hl = window.GetColorCUI(ColorTypeCUI.selection_background);
    }
    else if (window.InstanceType == InstanceType.DUI) {
        ThemeStyle.fgColor = window.GetColorDUI(ColorTypeDUI.text);
        ThemeStyle.fgColor_hl = window.GetColorDUI(ColorTypeDUI.highcolor);
        ThemeStyle.bgColor = window.GetColorDUI(ColorTypeDUI.background);
        ThemeStyle.bgColor_hl = window.GetColorDUI(ColorTypeDUI.selection);
    }

    var desktop_color = GetDesktopColor(window.GetProperty('windows颜色主题', false));
    ThemeStyle.color = $RGB(111, 235, 18);
    ThemeStyle.bgColor_hl = $SetAlpha(desktop_color, 128);
}

function GetIcons() {
    var g = null;

    g_arrow_icon && g_arrow_icon.Dispose();
    g_arrow_icon = gdi.CreateImage(16, 16);
    g = g_arrow_icon.GetGraphics();
    g.SetSmoothingMode(4);
    g.DrawLine(5, 6, 8, 9, 1, ThemeStyle.fgColor);
    g.DrawLine(8, 9, 11, 6, 1, ThemeStyle.fgColor);
    g_arrow_icon.ReleaseGraphics(g);
    g_arrow_icon = g_arrow_icon.Resize($Z(16), $Z(16), 7);

    if (!g_pos_icon) {
        g_pos_icon = gdi.CreateImage(20, 20);
        g = g_pos_icon.GetGraphics();
        g.SetSmoothingMode(4);
        g.FillEllipse(2, 2, 16, 16, 0x40ffffff);
        g.FillEllipse(6, 6, 8, 8, 0xffffffff);
        g_pos_icon.ReleaseGraphics(g);
        g_pos_icon = g_pos_icon.Resize($Z(20), $Z(20), 7);
    }

    g_check_icon && g_check_icon.Dispose();
    g_check_icon = gdi.CreateImage(30, 30);
    g = g_check_icon.GetGraphics();
    g.SetSmoothingMode(4);
    g.DrawLine(8, 14, 12, 21, 2, ThemeStyle.fgColor_hl);
    g.DrawLine(12, 20, 24, 10, 2, ThemeStyle.fgColor_hl);
    g_check_icon.ReleaseGraphics(g);
    g_check_icon =  g_check_icon.Resize($Z(30), $Z(30), 7);

    g_list_icon && g_list_icon.Dispose();
    g_list_icon = gdi.CreateImage(30, 30);
    g = g_list_icon.GetGraphics();
    g.DrawRect(7, 7, 3, 3, 1, ThemeStyle.fgColor_l);
    g.DrawRect(12, 7, 11, 3, 1, ThemeStyle.fgColor_l);
    g.DrawRect(7, 13, 3, 3, 1, ThemeStyle.fgColor_l);
    g.DrawRect(12, 13, 11, 3, 1, ThemeStyle.fgColor_l);
    g.DrawRect(7, 19, 3, 3, 1, ThemeStyle.fgColor_l);
    g.DrawRect(12, 19, 11, 3, 1, ThemeStyle.fgColor_l);
    g_list_icon.ReleaseGraphics(g);
    g_list_icon = g_list_icon.Resize($Z(30), $Z(30), 7);

    g_group_icon && g_group_icon.Dispose();
    g_group_icon = gdi.CreateImage(30, 30);
    g = g_group_icon.GetGraphics();
    g.DrawRect(7, 7, 7, 7, 1, ThemeStyle.fgColor_l);
    g.DrawRect(16, 7, 7, 7, 1, ThemeStyle.fgColor_l);
    g.DrawRect(7, 16, 7, 7, 1, ThemeStyle.fgColor_l);
    g.DrawRect(16, 16, 7, 7, 1, ThemeStyle.fgColor_l);
    g_group_icon.ReleaseGraphics(g);
    g_group_icon = g_group_icon.Resize($Z(30), $Z(30), 7);

    g_sort_icon && g_sort_icon.Dispose();
    g_sort_icon = gdi.CreateImage(30, 30);
    g = g_sort_icon.GetGraphics();
    g.DrawLine(11, 8, 11, 21, 2, ThemeStyle.fgColor_l);
    g.DrawLine(20, 8, 20, 23, 2, ThemeStyle.fgColor_l);
    g.SetSmoothingMode(4);
    g.DrawLine(7, 17, 11, 22, 2, ThemeStyle.fgColor_l);
    g.DrawLine(14, 17, 10, 22, 2, ThemeStyle.fgColor_l);
    g.DrawLine(16, 13, 20, 8, 2, ThemeStyle.fgColor_l);
    g.DrawLine(23, 13, 19, 8, 2, ThemeStyle.fgColor_l);
    g_sort_icon.ReleaseGraphics(g);
    g_sort_icon = g_sort_icon.Resize($Z(30), $Z(30), 7);

    g_search_icon && g_search_icon.Dispose();
    g_search_icon = gdi.CreateImage(30, 30);
    g = g_search_icon.GetGraphics();
    g.SetSmoothingMode(4);
    g.DrawEllipse(7, 7, 13, 13, 1, ThemeStyle.fgColor_l);
    g.DrawLine(18, 18, 23, 23, 1, ThemeStyle.fgColor_l);
    g.DrawEllipse(7, 7, 13, 13, 2, $SetAlpha(ThemeStyle.fgColor_l, 128));
    g.DrawLine(18, 18, 23, 23, 2, $SetAlpha(ThemeStyle.fgColor_l, 128));
    g_search_icon.ReleaseGraphics(g);
    g_search_icon = g_search_icon.Resize($Z(30), $Z(30), 7);

    g_isp1_icon && g_isp1_icon.Dispose();
    g_isp1_icon = gdi.CreateImage(14, 12);
    g = g_isp1_icon.GetGraphics();
    g.FillSolidRect(0, 7, 2, 5, ThemeStyle.fgColor_hl);
    g.FillSolidRect(3, 3, 2, 9, ThemeStyle.fgColor_hl);
    g.FillSolidRect(6, 0, 2, 12, ThemeStyle.fgColor_hl);
    g.FillSolidRect(9, 6, 2, 6, ThemeStyle.fgColor_hl);
    g.FillSolidRect(12, 4, 2, 8, ThemeStyle.fgColor_hl);
    g_isp1_icon.ReleaseGraphics(g);
    g_isp1_icon = g_isp1_icon.Resize($Z(14), $Z(12), 7);

    g_isp2_icon && g_isp2_icon.Dispose();
    g_isp2_icon = gdi.CreateImage(14, 12);
    g = g_isp2_icon.GetGraphics();
    g.FillSolidRect(0, 6, 2, 6, ThemeStyle.fgColor_hl);
    g.FillSolidRect(3, 1, 2, 11, ThemeStyle.fgColor_hl);
    g.FillSolidRect(6, 5, 2, 7, ThemeStyle.fgColor_hl);
    g.FillSolidRect(9, 7, 2, 5, ThemeStyle.fgColor_hl);
    g.FillSolidRect(12, 2, 2, 10, ThemeStyle.fgColor_hl);
    g_isp2_icon.ReleaseGraphics(g);
    g_isp2_icon = g_isp2_icon.Resize($Z(14),$Z(12), 7);

    g_forward_icon && g_forward_icon.Dispose();
    g_forward_icon = gdi.CreateImage(25, 25);
    g = g_forward_icon.GetGraphics();
    g.SetSmoothingMode(4);
    g.DrawLine(17, 13, 8, 5, 2, ThemeStyle.fgColor_l);
    g.DrawLine(17, 12, 8, 20, 2, ThemeStyle.fgColor_l);
    g_forward_icon.ReleaseGraphics(g);
    g_forward_icon = g_forward_icon.Resize($Z(25), $Z(25), 7);
    g_forward_icon = g_forward_icon.ApplyAlpha(128);

    g_back_icon && g_back_icon.Dispose();
    g_back_icon = gdi.CreateImage(50, 50);
    g = g_back_icon.GetGraphics();
    g.SetSmoothingMode(4);
    g.DrawLine(19, 26, 30, 15, 3, ThemeStyle.fgColor);
    g.DrawLine(19, 24, 30, 35, 3, ThemeStyle.fgColor);
    g_back_icon.ReleaseGraphics(g);
    g_back_icon = g_back_icon.Resize($Z(50), $Z(50), 7);

    g_play_icon && g_play_icon.Dispose();
    g_play_icon = gdi.CreateImage(50, 50);
    g = g_play_icon.GetGraphics();
    g.SetSmoothingMode(4);
    g.FillPolygon(ThemeStyle.fgColor, 0, Array(16, 10, 16, 40, 40, 25));
    g.DrawPolygon($SetAlpha(ThemeStyle.fgColor, 128), 1, Array(16, 10, 16, 40, 40, 25));
    g_play_icon.ReleaseGraphics(g);
    g_play_icon = g_play_icon.Resize($Z(50), $Z(50), 7);

    g_pause_icon && g_pause_icon.Dispose();
    g_pause_icon = gdi.CreateImage(50, 50);
    g = g_pause_icon.GetGraphics();
    g.FillSolidRect(15, 11, 8, 29, ThemeStyle.fgColor);
    g.FillSolidRect(28, 11, 8, 29, ThemeStyle.fgColor);
    g_pause_icon.ReleaseGraphics(g);
    g_pause_icon = g_pause_icon.Resize($Z(50), $Z(50), 7);

    g_prev_icon && g_prev_icon.Dispose();
    g_prev_icon = gdi.CreateImage(50, 50);
    g = g_prev_icon.GetGraphics();
    g.SetSmoothingMode(4);
    g.FillPolygon(ThemeStyle.fgColor, 0, Array(8, 25, 23, 35, 23, 15));
    g.DrawPolygon($SetAlpha(ThemeStyle.fgColor, 128), 1, Array(8, 25, 23, 35, 23, 15));
    g.FillPolygon(ThemeStyle.fgColor, 0, Array(23, 25, 38, 35, 38, 15));
    g.DrawPolygon($SetAlpha(ThemeStyle.fgColor, 128), 1, Array(23, 25, 38, 35, 38, 15));
    g_prev_icon.ReleaseGraphics(g);
    g_prev_icon = g_prev_icon.Resize($Z(50), $Z(50), 7);

    g_next_icon && g_next_icon.Dispose();
    g_next_icon = gdi.CreateImage(50, 50);
    g = g_next_icon.GetGraphics();
    g.SetSmoothingMode(4);
    g.FillPolygon(ThemeStyle.fgColor, 0, Array(12, 15, 12, 35, 27, 25));
    g.DrawPolygon($SetAlpha(ThemeStyle.fgColor, 128), 1, Array(12, 15, 12, 35, 27, 25));
    g.FillPolygon(ThemeStyle.fgColor, 0, Array(27, 15, 27, 35, 42, 25));
    g.DrawPolygon($SetAlpha(ThemeStyle.fgColor, 128), 1, Array(27, 15, 27, 35, 42, 25));
    g_next_icon.ReleaseGraphics(g);
    g_next_icon = g_next_icon.Resize($Z(50), $Z(50), 7);

    g_track_icon && g_track_icon.Dispose();
    g_track_icon = gdi.CreateImage(50, 50);
    g = g_track_icon.GetGraphics();
    g.FillSolidRect(22, 14, 6, 6, ThemeStyle.fgColor);
    g.FillSolidRect(22, 22, 6, 6, ThemeStyle.fgColor);
    g.FillSolidRect(22, 30, 6, 6, ThemeStyle.fgColor);
    g_track_icon.ReleaseGraphics(g);
    g_track_icon = g_track_icon.Resize($Z(50), $Z(50), 7);

    if (!g_home_icon) {
        g_home_icon = gdi.CreateImage(50, 50);
        g = g_home_icon.GetGraphics();
        g.SetSmoothingMode(4);
        g.FillEllipse(5, 5, 38, 38, $RGBA(255, 255, 255, 128));
        g.DrawEllipse(5, 5, 38, 38, 2, $RGBA(0, 0, 0, 32));
        g.DrawEllipse(5, 5, 38, 38, 1, $RGBA(0, 0, 0, 64));
        g.FillEllipse(9, 9, 30, 30, $RGBA(255, 255, 255, 192));
        g.DrawEllipse(9, 9, 30, 30, 2, $RGBA(0, 0, 0, 32));
        g.DrawEllipse(9, 9, 30, 30, 1, $RGBA(0, 0, 0, 64));
        g.FillEllipse(13, 13, 22, 22, $RGBA(255, 255, 255, 255));
        g.DrawEllipse(13, 13, 22, 22, 2, $RGBA(0, 0, 0, 32));
        g.DrawEllipse(13, 13, 22, 22, 1, $RGBA(0, 0, 0, 64));
        g_home_icon.ReleaseGraphics(g);
        g_home_icon = g_home_icon.Resize($Z(50), $Z(50), 7);
    }

    if (!g_point_icon) {
        g_point_icon = gdi.CreateImage(25, 25);
        g = g_point_icon.GetGraphics();
        g.SetSmoothingMode(4);
        g.FillEllipse(5, 5, 15, 15, $RGB(255, 255, 255));
        g_point_icon.ReleaseGraphics(g);
        // g_point_icon = g_point_icon.Resize($Z(25), $Z(25), 7);
        g_point_icon = Image.Blur(g_point_icon, 1, 1);
    }

    g_false_icon && g_false_icon.Dispose();
    g_false_icon = gdi.CreateImage(45, 25);
    g = g_false_icon.GetGraphics();
    g.SetSmoothingMode(4);
    g.FillRoundRect(2, 2, 41, 21, 10, 10, ThemeStyle.bgColor_l);
    Image.Draw(g, g_point_icon, 1, 0, 0, 255);
    g_false_icon.ReleaseGraphics(g);
    g_false_icon = g_false_icon.Resize($Z(45), $Z(25), 7);

    g_true_icon && g_true_icon.Dispose();
    g_true_icon = gdi.CreateImage(45, 25);
    g = g_true_icon.GetGraphics();
    g.SetSmoothingMode(4);
    g.FillRoundRect(2, 2, 41, 21, 10, 10, ThemeStyle.bgColor_hl);
    Image.Draw(g, g_point_icon, 19, 0, 0, 255);
    g_true_icon.ReleaseGraphics(g);
    g_true_icon = g_true_icon.Resize($Z(45), $Z(25), 7);
}

function GetVol() {
    g_vol_icon && g_vol_icon.Dispose();
    var pos = Math.floor(((Math.pow(10, fb.Volume / 50) - 0.01) / 0.99) * 100);
    switch (true) {
        case pos <= 0:
            g_vol_icon = $ZImage(gdi.Image(PATH_ICO + 'Vol\\1.png'));
            break;

        case pos <= 30:
            g_vol_icon = $ZImage(gdi.Image(PATH_ICO + 'Vol\\2.png'));
            break;

        case pos <= 60:
            g_vol_icon = $ZImage(gdi.Image(PATH_ICO + 'Vol\\3.png'));
            break;

        case pos <= 100:
            g_vol_icon = $ZImage(gdi.Image(PATH_ICO + 'Vol\\4.png'));
            break;
    }
}

function GetClock(remain) {
    g_clock_icon && g_clock_icon.Dispose();
    g_clock_icon = null;
    g_clock_icon = gdi.CreateImage(50, 50);
    var g = g_clock_icon.GetGraphics();
    g.SetSmoothingMode(4);
    var degree = Math.floor(remain * 360);
    g.DrawEllipse(5, 5, 38, 38, 2, $SetAlpha(ThemeStyle.bgColor, 225));
    g.FillPie(8, 8, 32, 32, 270 - degree, degree, $SetAlpha(ThemeStyle.bgColor, 192));
    g_clock_icon.ReleaseGraphics(g);
}

//获取颜色字体
GetCustomColor();
GetCustomFont();
GetFonts();
GetColors();

function Load() {
    if (!g_unsized) return;
    if (!g_unloaded) return;

    g_unloaded = false;

    hWnd = $GetHWnd();

    g_profiler = fb.CreateProfiler();

    GetFolder();
    GetIcons();
    GetVol();

    Console = new oConsole('Console');
    Console.$.Size(0, 0, 0, $Z(40), $Z(99));

    Home = new oHome('Home');
    Home.$.Size(0, 0, $Z(50), $Z(50), 90);
    Home.$.x = window.GetProperty('主按钮左', 5);
    Home.$.y = window.GetProperty('主按钮上', 300);

    Rating = new oRating('Rating');
    Top = new oTop('Top');

    Lyric = new oLyric('Lyric');
    Cover = new oCover('Cover');
    Biography = new oBiography('Biography');
    Exhibition = new oExhibition('Exhibition');

    Playlist.Init();
    PlayQueue.Init();
    ListManager.Init();

    Sort = new oSort('Sort');
    PlaylistTop = new oPlaylistTop('PlaylistTop');

    AlbumBrowser = new oBrowser('AlbumBrowser');
    AlbumBrowser.key = BROWSER_ALBUM;
    AlbumBrowser.Init();

    ArtistBrowser = new oBrowser('ArtistBrowser');
    ArtistBrowser.key = BROWSER_ARTIST;
    ArtistBrowser.Init();

    AlbumList = new oLinear('AlbumList');
    AlbumList.key = BROWSER_ALBUM;
    AlbumList.Init();

    ArtistList = new oLinear('ArtistList');
    ArtistList.key = BROWSER_ARTIST;
    ArtistList.Init();

    Info.Init();
    Setting.Init();
    Explorer.ListDrives();

    g_tabs = [PlaylistTop, ListManager, Explorer, Setting];
    if (window.GetProperty('播放列表显示模式', false)) {
        g_playlist_tabs = [Playlist, AlbumBrowser, ArtistBrowser];
    } else {
        g_playlist_tabs = [Playlist, AlbumList, ArtistList];
    }
    g_tables = [Lyric, Cover, Biography];

    Cover.OnUpdate = function () {
        Biography.Update();
        window.SetTimeout(function () {
            Exhibition.Update();
        }, 50);
    }

    AlbumArt.OnDownload = function () {
        Cover.Update();
        Top.UpdatePhoto();
    }

    g_debug && fb.trace('加载完成: ' + g_profiler.Time + ' 毫秒');

    SetVisible(true);
    Stack();
}

function Stack() {
    //面板堆叠
    Playlist.$.z = 1;
    AlbumBrowser.$.z = 1;
    ArtistBrowser.$.z = 1;
    AlbumList.$.z = 1;
    ArtistList.$.z = 1;

    Sort.$.z = Playlist.$.z + 2;
    PlaylistTop.$.z = 8;

    ListManager.$.z = 1;
    Explorer.$.z = 1;
    Setting.$.z = 1;
    Tab.$.z = 10;

    Top.$.z = 11;

    Info.$.z = 1;
    Exhibition.$.z = 20;

    Rating.$.z = 25;
    Lyric.$.z = 25;
    Cover.$.z = 25;
    Biography.$.z = 25;

    Layout();
}

function Layout() {
    if (g_unloaded) return;

    if (Group && Group.$.visible)
        Group.SetVisible(false);
    if (Picture && Picture.$.visible)
        Picture.SetVisible(false);
    if (Activity && Activity.$.visible)
        Activity.SetVisible(false);
    if (Info && Info.$.visible)
        Info.SetVisible(false);

    Main.$.Size(0, 0, ww, wh);

    if (g_unsized) {
        Panel.Sort();
        g_unsized = false;

        g_debug && fb.trace('布局完成: ' + g_profiler.Time + ' 毫秒');

        if (g_start_activity) {
            WpUpdate(g_profiler.Time);
        }
        else {
            g_alpha = 0;
            g_bg && UpdateWp();
            window.Repaint();
        }

        g_profiler = null;
        ProcessTimer(1000); //callback: on_process_time()
    } else {
        g_bg && UpdateWp();
    }
}

function TabShow(idx, ex) {
    var arr = [false, false, false, false];
    if (idx >= 0 && idx < arr.length) {
        arr[idx] = true;
        ex && Top.SetVisible(true);
    }
    else {
        Top.SetVisible(false);
    }
    if (Top.$.visible || Exhibition.$.visible)
        Rating.$.visible = true;
    else
        Rating.$.visible = false;

    g_tabs[0].SetVisible(arr[0]);
    g_tabs[1].SetVisible(arr[1]);
    g_tabs[2].SetVisible(arr[2]);
    g_tabs[3].SetVisible(arr[3]);
}

function PlaylistTabShow(idx) {
    var arr = [false, false, false];
    if (idx >= 0 && idx < arr.length) {
        arr[idx] = true;
    }

    g_playlist_tabs[0].SetVisible(arr[0]);
    g_playlist_tabs[1].SetVisible(arr[1]);
    g_playlist_tabs[2].SetVisible(arr[2]);
    PlaylistTop.Update();
}

function TableShow(idx, ex) {
    var arr = [false, false, false];
    if (idx >= 0 && idx < arr.length) {
        arr[idx] = true;
        ex && Exhibition.SetVisible(true);
    }
    else {
        Exhibition.SetVisible(false);
    }
    if (Top.$.visible || Exhibition.$.visible)
        Rating.$.visible = true;
    else
        Rating.$.visible = false;

    g_tables[0].SetVisible(arr[0]);
    g_tables[1].SetVisible(arr[1]);
    g_tables[2].SetVisible(arr[2]);
}

function SetVisible(ex) {
    if (typeof (ex) == 'undefined')
        var ex = false;
    Tab.focus = g_tab;
    PlaylistTop.Tab.focus = g_playlist_tab;
    Exhibition.Table.focus = g_table;

    if (g_exhibit) {
        TableShow(g_table, ex);
        TabShow(-1);
        PlaylistTabShow(-1);
    }
    else {
        TabShow(g_tab, ex);
        if (g_tab == 0) {
            PlaylistTabShow(g_playlist_tab);
        } else {
            PlaylistTabShow(-1);
        }
        TableShow(-1);
    }
}

function ActivityMain(vis) {
    if (vis) {
        g_tab = window.GetProperty('标签', 0);
        g_table = window.GetProperty('展示台', 0);
        g_playlist_tab = window.GetProperty('播放列表标签', 0);
    }
    else {
        g_tab = -1;
        g_table = -1;
        g_playlist_tab = -1;
    }
    SetVisible(true);
}

function GetBackgroundImage(x, y, w, h) {
    if (Wallpaper.$) {
        return Image.Cut(Wallpaper.$, x, y, w, h);
    }
    return null;
}

function UpdateWp() {
    var file = GetDesktopImage();
    if (!file)
        file = PATH_WP + window.GetProperty("壁纸", 'wp.png');
    Wallpaper.src = g_start_activity || g_bg ? file : '';

    Image.Clear(Wallpaper.$);
    Wallpaper.$ = gdi.Image(Wallpaper.src);
    if (Wallpaper.$) {
        Wallpaper.$ = Image.Process(Wallpaper.$, ww, wh, IMG_CROP, 2);
    }
    if (!g_unsized) {
        Top.UpdatePhoto();
    }

    if (g_unsized) return;

    // 背景关联面板更新
    Tab.$.GetBackgroundImage(g_bg);
    Top.$.GetBackgroundImage(g_bg, 5, 2);
    PlaylistTop.$.GetBackgroundImage(g_bg);
}

function WpUpdate(consume) {
    var delay = 1000;

    if (arguments.length) {
        //初始化完成
        delay = Math.max(delay - consume, consume);
        if (!g_unsized) {
            // 背景关联面板更新
            Tab.$.GetBackgroundImage(g_bg);
            Top.$.GetBackgroundImage(g_bg, 5, 2);
            PlaylistTop.$.GetBackgroundImage(g_bg);
        }
    } else {
        g_start_activity = window.GetProperty('启动界面', true);
        g_alpha = 255;
        UpdateWp();
        window.Repaint();
    }

    window.SetTimeout(function () {
        var shade = window.SetInterval(function () {
            g_alpha -= 15;
            if (g_alpha <= 0) {
                g_alpha = 0;
                window.ClearInterval(shade);
                shade = null;
            }
            window.Repaint();
        }, 15);
    }, delay);
}

function ChangeMode() {
    g_debug = window.GetProperty('跟踪调试', false);
}

function ChangeFonts() {
    on_font_changed();
}

function ChangeColors() {
    on_colors_changed();
}

function ChangeColorsFonts() {
    GetFonts();
    GetColors();
    GetIcons();
    window.Repaint();
}
