// ==PREPROCESSOR==
// @name = "Main Interface"
// @author "elia_is_me"
// @feature "dragdrop"
// @feature "v1.4"
// @feature "watch-metadb"
// ==/PREPROCESSOR==

// Localization
var lang = window.GetProperty("**Panel.Language", "auto").toLowerCase();

if (lang == "auto") {
    lang = fb.TitleFormat("$meta()").Eval(true) == "[未知函数]" ? "cn" :"en";
}

var LangPack;

if (lang == "cn") {
    LangPack = {
        " (Auto)":" (自动)",
        " (Now Playing)":" (正在播放)",
        " 	(Now Playing)":" 	(正在播放)",
        " item selected":" 首选中",
        " item":" 首",
        " items selected":" 首选中",
        " items":" 首",
        ", Length: ":", 时长: ",
        "Album art":"专辑封面",
        "Album":"专辑",
        "Alternate row color":"隔行不同色",
        "Artist":"艺术家",
        "Auto":"自动",
        "Autolist #":"自动列表 #",
        "Autoplaylist...":"自动播放列表...",
        "Clear history":"清除历史",
        "Collapse all but now playing":"折叠除当前播放外所有",
        "Collapse all":"折叠所有",
        "Collapse on playlist switch":"播放列表切换时折叠",
        "Collapse on start":"启动时折叠",
        "Collapse/Expand":"折叠/展开",
        "Columns":"列",
        "Convert to a normal playlist":"转换成普通列表",
        "Create New Playlist":"新建播放列表",
        "Current Playlist":"当前播放列表",
        "Cut 	Ctrl+X":"剪切 	Ctrl+X",
        "Drag some tracks here":"拖些歌曲过来",
        "Duplicate playlist":"复制播放列表",
        "Enable":"启用",
        "ESLyric on top":"ESLyric 置顶",
        "Edit/Search":"编辑/搜索",
        "Edit/Selection/Sort/Reverse":"编辑/选择/排序/颠倒",
        "Edit/Selection/Sort/Sort by...":"编辑/选择/排序/排序按...",
        "Edit/Sort/Reverse":"编辑/选择/颠倒",
        "Edit/Sort/Sort by...":"编辑/选择/排序按...",
        "Expand all":"展开所有",
        "File/Load playlist...":"文件/载入播放列表...",
        "File/Preferences":"文件/首选项",
        "File/Restart":"文件/重启",
        "File/Save all playlists...":"文件/保存所有播放列表...",
        "Flush playback queue":"清空播放队列",
        "Grouping":"分组",
        "Help":"帮助",
        "Help...":"帮助...",
        "Input autoplaylist name":"输入自动播放列表名字",
        "Input playlist name":"输入播放列表名字",
        "Library/Search":"媒体库/搜索",
        "Load playlists...":"载入播放列表...",
        "Lock":"锁定列表",
        "Mouse through":"鼠标穿透",
        "New Playlist...":"新建播放列表...",
        "New autoplaylist...":"新建自动播放列表",
        "Online Search...":"歌词搜索...",
        "Open Containing Folder":"打开所在文件夹",
        "Paste 	Ctrl+V":"粘贴 	Ctrl+V",
        "Play count":"播放次数",
        "Playlist #":"播放列表 #",
        "Playlist Manager":"播放列表管理器",
        "Playlist Manager...":"播放列表管理器...",
        "Playlist properties":"列表选项",
        "Playlist: ":"播放列表: ",
        "Randomize":"随机",
        "Rated less than 2":"评级小于 2",
        "Rated less than 3":"评级小于 3",
        "Rated less than 4":"评级小于 4",
        "Rated less than 5":"评级小于 5",
        "Rating":"评级",
        "Refresh all 	F5":"刷新所有 	F5",
        "Remove from list 	Delete":"从列表移除 	Del",
        "Remove playlist":"移除播放列表",
        "Rename playlist":"重命名播放列表",
        "Rename playlist...":"重命名播放列表...",
        "Restart":"重启",
        "Restore":"恢复",
        "Reverse":"颠倒",
        "Save all playlists...":"保存所有播放列表...",
        "Save playlist...":"保存播放列表...",
        "Scrollbar use system style":"滚动条使用系统风格",
        "Select all 	Ctrl+A":"全选 	Ctrl+A",
        "Send selection":"发送所选到",
        "Setting...":"设置...",
        "Show focus item":"显示焦点项目",
        "Show group header":"显示分组栏",
        "Show now playing":"显示正在播放项目",
        "Show queue item":"显示队列项目",
        "Show scrollbar":"显示滚动条",
        "Show":"显示",
		"Skip": "跳过",
        "Sort by album":"按专辑",
        "Sort by artist":"按艺术家",
        "Sort by date":"按时间",
        "Sort by file path":"按文件路径",
        "Sort by title":"按标题",
        "Sort by track number":"按音轨号",
        "Sort by...":"排序按...",
        "Sort selection":"排序所选项",
        "Sort":"排序",
        "To bottom":"置底",
        "To top":"置顶",
        "Use tag rating":"使用文件标签评级",
        "View/ESLyric/歌词搜索...":"视图/ESLyric/歌词搜索...",
        "View/ESLyric/配置...":"视图/ESLyric/配置...",
        "View/ESLyric/锁定桌面歌词":"视图/ESLyric/锁定桌面歌词",
        "View/ESLyric/显示桌面歌词":"视图/ESLyric/显示桌面歌词",
        "View/ESLyric/置顶桌面歌词":"视图/ESLyric/置顶桌面歌词",
        "View/Playlist Manager":"视图/播放列表管理器",
        "Weblinks":"链接",
        "Wsh configure...":"WSH 配置...",
        "Wsh properties...":"WSH 属性...",
        "by artist / album / disc number":"按艺术家 / 专辑 / 光盘编号",
        "by artist / album":"按艺术家 / 专辑",
        "by artist":"按艺术家",
        "by date":"按时间",
        "by path":"按路径",
        "by user defined":"按用户自定义",
        'If name is null, then will create a playlist autonamed with "Playlist #<number>"':'如果列表名字为空，将自动命名新建列表为 "播放列表 #<序号>"',
        'If name is null, then will create an autoplaylist autonamed with "Autolist #<number>"':'如果列表名字为空，将自动命名新建自动播放列表为 "自动列表 #<序号>"',
        "":""
    };
} else {
    LangPack = {};
}

function GetText(name) {
    var str = LangPack[name];
    if (!str) str = name;
    return str;
}

//---> Common Helpers, Flags
//--->
var themeName = "";

var themeVersion = "";

var WshWND = utils.CreateWND(window.ID);

var MWND = WshWND.GetAncestor(2);

// ================================================================================= //
var safeMode = uiHacks = false;

var UIHacks;

try {
    WshShell = new ActiveXObject("WScript.Shell");
} catch (e) {
    fb.trace("----------------------------------------------------------------------");
    fb.trace(e + GetText("\nFix: Disable safe mode in Preferences > Tools > WSH Panel Mod"));
    fb.trace("----------------------------------------------------------------------");
    safeMode = true;
}

if (!safeMode) {
    uiHacks = utils.CheckComponent("foo_ui_hacks");
    if (uiHacks) {
        UIHacks = new ActiveXObject("UIHacks");
    }
}

var gColorScheme = {
    system:{
        Text:window.GetColorDUI(0),
        Background:window.GetColorDUI(1),
        Highlight:window.GetColorDUI(2),
        Selection:window.GetColorDUI(3)
    },
    light:{
        Text: blendColors(RGB(0, 0, 0), RGB(255, 255, 255), 0.87),
        Background: RGB(255, 255, 255),
        Highlight: RGB(225, 72, 106),
        Selection: RGB(238, 238, 238)
    }
};

var gColor = {
	textNormal_1: gColorScheme.light.Text,
	textNormal_2: blendColors(RGB(0, 0, 0), RGB(255, 255, 255), 0.54),
	textNormal_3: blendColors(RGB(0, 0, 0), RGB(255, 255, 255), 0.26),
	textSelected_1: blendColors(RGB(0, 0, 0), gColorScheme.light.Selection, 0.87),
	textSelected_2: blendColors(RGB(0, 0, 0), gColorScheme.light.Selection, 0.54),
	textSelected_3: blendColors(RGB(0, 0, 0), gColorScheme.light.Selection, 0.26),
	textHighlight_1: blendColors( gColorScheme.light.Highlight, RGB(255, 255, 255), 0.87),
	textHighlight_2: blendColors( gColorScheme.light.Highlight, RGB(255, 255, 255), 0.54),
	textHighlight_3: blendColors( gColorScheme.light.Highlight, RGB(255, 255, 255), 0.26),
	selection: gColorScheme.light.Selection,
	background: gColorScheme.light.Background,
	highlight:  gColorScheme.light.Highlight
}





var panelsBackColor = RGB(30, 30, 30);

var panelsLineColor = RGB(55, 55, 55);

var panelsLineColorSelected = RGB(55, 55, 55);

var panelsNormalTextColor = RGB(145, 147, 149);

// ================================================================================= //
//--->
function print(msg) {
    fb.trace("---> " + msg);
}

//--->
function caller() {
    var caller = /^function\s+([^(]+)/.exec(arguments.callee.caller.caller);
    if (caller) return caller[1]; else return 0;
}

//--->
function $(field, metadb) {
    var tf;
    try {
        tf = fb.TitleFormat(field).EvalWithMetadb(metadb);
    } catch (e) {
        tf = e + " (Invalid metadb!)";
    }
    return tf;
}

//--->
//Time formatting secondes -> 0:00
function TimeFromSeconds(t) {
    var zpad = function(n) {
        var str = n.toString();
        return str.length < 2 ? "0" + str :str;
    };
    var h = Math.floor(t / 3600);
    t -= h * 3600;
    var m = Math.floor(t / 60);
    t -= m * 60;
    var s = Math.floor(t);
    if (h > 0) return h.toString() + ":" + zpad(m) + ":" + zpad(s);
    return m.toString() + ":" + zpad(s);
}

function timeFormat(s) {
    var weeks = Math.floor(s / 604800), days = Math.floor(s % 604800 / 86400), hours = Math.floor(s % 86400 / 3600), minutes = Math.floor(s % 86400 % 3600 / 60), seconds = Math.round(s % 86400 % 3600 % 60), weeks = weeks > 0 ? weeks + "wk " :"", days = days > 0 ? days + "d " :"", hours = hours > 0 ? hours + ":" :"", seconds = seconds < 10 ? "0" + seconds :seconds;
    caller() == "sliderEventHandler" ? minutes = minutes + ":" :minutes = (minutes < 10 ? "0" + minutes :minutes) + ":";
    return weeks + days + hours + minutes + seconds;
}

//--->
(function() {
    var _ww, _resizeTimerStarted;
    isResizingDone = function(ww, wh) {
        if (!_resizeTimerStarted) {
            _resizeTimerStarted = true;
            resizingIsDone = false;
            resizeTimer = window.SetInterval(function() {
                if (_ww == window.Width) {
                    resizeDone();
                    resizingIsDone = true;
                    _resizeTimerStarted = false;
                    window.ClearInterval(resizeTimer);
                }
            }, 200);
        }
        _ww = ww;
    };
})();

//--->
function RGBA(r, g, b, a) {
    return ((a << 24) | (r << 16) | (g << 8) | (b));
}

//--->
function RGB(r, g, b) {
    return (0xFF000000 | (r << 16) | (g << 8) | (b));
}

function setAlpha(color, a) {
    return ((color & 0x00FFFFFF) | a << 24);
}

function StringFormat() {
    var h_align = 0, v_align = 0, trimming = 0, flags = 0;
    switch (arguments.length) {
      // fall-thru
        case 4:
        flags = arguments[3];

      case 3:
        trimming = arguments[2];

      case 2:
        v_align = arguments[1];

      case 1:
        h_align = arguments[0];
        break;

      default:
        return 0;
    }
    return h_align << 28 | v_align << 24 | trimming << 20 | flags;
}

//--->
function numericAscending(a, b) {
    return a - b;
}

//--->
function numericDescending(a, b) {
    return b - a;
}

//--->
VK_CONTROL = 17;

VK_SHIFT = 16;

VK_PAUSE = 19;

VK_ESCAPE = 27;

VK_SPACE = 32;

VK_DELETE = 46;

VK_PRIOR = 33;

// PAGE UP key
VK_NEXT = 34;

// PAGE DOWN key
VK_END = 35;

VK_HOME = 36;

VK_LEFT = 37;

VK_UP = 38;

VK_RIGHT = 39;

VK_DOWN = 40;

VK_RETURN = 13;

//Enter
VK_LSHIFT = 160;

// Left SHIFT key
VK_RSHIFT = 161;

// Right SHIFT key
VK_LCONTROL = 162;

// Left CONTROL key
VK_RCONTROL = 163;

// Right CONTROL key
VK_LMENU = 164;

// Left MENU key (Left Alt)
VK_RMENU = 165;

// Right MENU key (Right Alt)
VK_KEY_0 = 48;

//	0
VK_KEY_1 = 49;

//	1
VK_KEY_2 = 50;

//	2
VK_KEY_3 = 51;

//	3
VK_KEY_4 = 52;

//	4
VK_KEY_5 = 53;

//	5
VK_KEY_6 = 54;

//	6
VK_KEY_7 = 55;

//	7
VK_KEY_8 = 56;

//	8
VK_KEY_9 = 57;

//	9
VK_KEY_A = 65;

//	A
VK_KEY_B = 66;

//	B
VK_KEY_C = 67;

//	C
VK_KEY_D = 68;

//	D
VK_KEY_E = 69;

//	E
VK_KEY_F = 70;

//	F
VK_KEY_G = 71;

//	G
VK_KEY_H = 72;

//	H
VK_KEY_I = 73;

//	I
VK_KEY_J = 74;

//	J
VK_KEY_K = 75;

//	K
VK_KEY_L = 76;

//	L
VK_KEY_M = 77;

//	M
VK_KEY_N = 78;

//	N
VK_KEY_O = 79;

//	O
VK_KEY_P = 80;

//	P
VK_KEY_Q = 81;

//	Q
VK_KEY_R = 82;

//	R
VK_KEY_S = 83;

//	S
VK_KEY_T = 84;

//	T
VK_KEY_U = 85;

//	U
VK_KEY_V = 86;

//	V
VK_KEY_W = 87;

//	W
VK_KEY_X = 88;

//	X
VK_KEY_Y = 89;

//	Y
VK_KEY_Z = 90;

//	Z
VK_F1 = 112;

//	F1
VK_F10 = 121;

//	F10
VK_F11 = 122;

//	F11
VK_F12 = 123;

//	F12
VK_F13 = 124;

//	F13
VK_F14 = 125;

//	F14
VK_F15 = 126;

//	F15
VK_F16 = 127;

//	F16
VK_F17 = 128;

//	F17
VK_F18 = 129;

//	F18
VK_F19 = 130;

//	F19
VK_F2 = 113;

//	F2
VK_F20 = 131;

//	F20
VK_F21 = 132;

//	F21
VK_F22 = 133;

//	F22
VK_F23 = 134;

//	F23
VK_F24 = 135;

// F24
VK_F3 = 114;

//	F3
VK_F4 = 115;

//	F4
VK_F5 = 116;

// F5
VK_F6 = 117;

// F6
VK_F7 = 118;

// F7
VK_F8 = 119;

// F8
VK_F9 = 120;

// F9
//--->
// Flags, used with GdiDrawText()
// For more information, see: http://msdn.microsoft.com/en-us/library/dd162498(VS.85).aspx
DT_TOP = 0;

DT_LEFT = 0;

DT_CENTER = 1;

DT_RIGHT = 2;

DT_VCENTER = 4;

DT_BOTTOM = 8;

DT_WORDBREAK = 16;

DT_SINGLELINE = 32;

DT_EXPANDTABS = 64;

DT_TABSTOP = 128;

DT_NOCLIP = 256;

DT_EXTERNALLEADING = 512;

DT_CALCRECT = 1024;

// [1.2.1] Handles well
DT_NOPREFIX = 2048;

// NOTE: Please use this flag, or a '&' character will become an underline '_'
DT_INTERNAL = 4096;

DT_EDITCONTROL = 8192;

DT_PATH_ELLIPSIS = 16384;

DT_END_ELLIPSIS = 32768;

DT_MODIFYSTRING = 65536;

// do not use
DT_RTLREADING = 131072;

DT_WORD_ELLIPSIS = 262144;

DT_NOFULLWIDTHCHARBREAK = 524288;

DT_HIDEPREFIX = 1048576;

DT_PREFIXONLY = 2097152;

//--->
// Used in AppendMenuItem()
// For more information, see: http://msdn.microsoft.com/en-us/library/ms647616(VS.85).aspx
MF_SEPARATOR = 2048;

MF_ENABLED = 0;

MF_GRAYED = 1;

MF_DISABLED = 2;

MF_UNCHECKED = 0;

MF_CHECKED = 8;

MF_STRING = 0;

MF_POPUP = 16;

MF_MENUBARBREAK = 32;

MF_MENUBREAK = 64;

//--->
// Used in window.SetCursor()
IDC_ARROW = 32512;

IDC_IBEAM = 32513;

IDC_WAIT = 32514;

IDC_CROSS = 32515;

IDC_UPARROW = 32516;

IDC_SIZE = 32640;

IDC_ICON = 32641;

IDC_SIZENWSE = 32642;

IDC_SIZENESW = 32643;

IDC_SIZEWE = 32644;

IDC_SIZENS = 32645;

IDC_SIZEALL = 32646;

IDC_NO = 32648;

IDC_APPSTARTING = 32650;

IDC_HAND = 32649;

IDC_HELP = 32651;

//--->
// Used in utils.Glob()
// For more information, see: http://msdn.microsoft.com/en-us/library/ee332330%28VS.85%29.aspx
FILE_ATTRIBUTE_READONLY = 1;

FILE_ATTRIBUTE_HIDDEN = 2;

FILE_ATTRIBUTE_SYSTEM = 4;

FILE_ATTRIBUTE_DIRECTORY = 16;

FILE_ATTRIBUTE_ARCHIVE = 32;

//FILE_ATTRIBUTE_DEVICE            = 0x00000040; // do not use
FILE_ATTRIBUTE_NORMAL = 128;

FILE_ATTRIBUTE_TEMPORARY = 256;

FILE_ATTRIBUTE_SPARSE_FILE = 512;

FILE_ATTRIBUTE_REPARSE_POINT = 1024;

FILE_ATTRIBUTE_COMPRESSED = 2048;

FILE_ATTRIBUTE_OFFLINE = 4096;

FILE_ATTRIBUTE_NOT_CONTENT_INDEXED = 8192;

FILE_ATTRIBUTE_ENCRYPTED = 16384;

//FILE_ATTRIBUTE_VIRTUAL           = 0x00010000; // do not use
//--->
// With window.DlgCode, can be combined.
// If you don't know what they mean, igonre them.
DLGC_WANTARROWS = 1;

/* Control wants arrow keys         */
DLGC_WANTTAB = 2;

/* Control wants tab keys           */
DLGC_WANTALLKEYS = 4;

/* Control wants all keys           */
DLGC_WANTMESSAGE = 4;

/* Pass message to control          */
DLGC_HASSETSEL = 8;

/* Understands EM_SETSEL message    */
DLGC_DEFPUSHBUTTON = 16;

/* Default pushbutton               */
DLGC_UNDEFPUSHBUTTON = 32;

/* Non-default pushbutton           */
DLGC_RADIOBUTTON = 64;

/* Radio button                     */
DLGC_WANTCHARS = 128;

/* Want WM_CHAR messages            */
DLGC_STATIC = 256;

/* Static item: don't include       */
DLGC_BUTTON = 8192;

/* Button item: can be checked      */
//--->
// Used in IFbTooltip.GetDelayTime() and IFbTooltip.SetDelayTime()
// For more information, see: http://msdn.microsoft.com/en-us/library/bb760404(VS.85).aspx
TTDT_AUTOMATIC = 0;

TTDT_RESHOW = 1;

TTDT_AUTOPOP = 2;

TTDT_INITIAL = 3;

//Tooltip
TOOLTIP_PADDING_LEFT = 15;
TOOLTIP_PADDING_TOP = 3;
TOOLTIP_PADDING_RIGHT = 4;
TOOLTIP_PADDING_BOTTOM = 8;
TOOLTIP_TEXT_PADDING_LEFT = 6;
TOOLTIP_TEXT_PADDING_TOP = 2;
TOOLTIP_TEXT_PADDING_RIGHT = 6;
TOOLTIP_TEXT_PADDING_BOTTOM = 2;

//--->
// Used in gdi.Font(), can be combined
// For more information, see: http://msdn.microsoft.com/en-us/library/ms534124(VS.85).aspx
FontStyle = {
    Regular:0,
    Bold:1,
    Italic:2,
    BoldItalic:3,
    Underline:4,
    Strikeout:8
};

//--->
// Used in SetTextRenderingHint()
// For more information, see: http://msdn.microsoft.com/en-us/library/ms534404(VS.85).aspx
TextRenderingHint = {
    SystemDefault:0,
    SingleBitPerPixelGridFit:1,
    SingleBitPerPixel:2,
    AntiAliasGridFit:3,
    AntiAlias:4,
    ClearTypeGridFit:5
};

//--->
// Used in SetSmoothingMode()
// For more information, see: http://msdn.microsoft.com/en-us/library/ms534173(VS.85).aspx
SmoothingMode = {
    Invalid:-1,
    Default:0,
    HighSpeed:1,
    HighQuality:2,
    None:3,
    AntiAlias:4
};

//--->
// Used in SetInterpolationMode()
// For more information, see: http://msdn.microsoft.com/en-us/library/ms534141(VS.85).aspx
InterpolationMode = {
    Invalid:-1,
    Default:0,
    LowQuality:1,
    HighQuality:2,
    Bilinear:3,
    Bicubic:4,
    NearestNeighbor:5,
    HighQualityBilinear:6,
    HighQualityBicubic:7
};

//--->
playbackOrder = {
    Default:0,
    RepeatPlaylist:1,
    RepeatTrack:2,
    Random:3,
    ShuffleTracks:4,
    ShuffleAlbums:5,
    ShuffleFolders:6
};

//--->
AlbumArtId = {
    front:0,
    back:1,
    disc:2,
    icon:3,
    artist:4
};

//--->
Guifx = {
    Play:1,
    Pause:2,
    Stop:3,
    Record:4,
    Rewind:5,
    FastForward:6,
    Previous:7,
    Next:8,
    Replay:9,
    Refresh:0,
    Mute:"!",
    Mute2:"@",
    VolumeDown:"#",
    VolumeUp:"$",
    ThumbsDown:"%",
    ThumbsUp:"^",
    Shuffle:"&",
    Repeat:"*",
    Repeat1:"(",
    Zoom:")",
    ZoomOut:"_",
    ZoomIn:"+",
    Minus:"-",
    Plus:"=",
    Up:"W",
    Down:"S",
    Left:"A",
    Right:"D",
    Up2:"w",
    Down2:"s",
    Left2:"a",
    Right2:"d",
    Start:"{",
    End:"}",
    Top:"?",
    Bottom:"/",
    JumpBackward:"[",
    JumpForward:"]",
    SlowBackward:":",
    SlowForward:'"',
    Eject:"'",
    Reject:";",
    Up3:".",
    Down3:",",
    Left3:"<",
    Right:">",
    Guifx:"g",
    ScreenUp:"|",
    ScreenDown:"\\",
    Power:"q",
    Checkmark:"z",
    Close:"x",
    Hourglass:"c",
    Heart:"v",
    Star:"b",
    Fire:"i",
    Medical:"o",
    Police:"p"
};

fontElia = {
    home:"h",
    music:"m",
    cog:"p",
    star:"B",
    star2:"b",
    heart:"v",
    heart2:"V",
    close:"x",
    checkmark:"z",
    minus:"-",
    plus:"=",
    play:"1",
    pause:"2",
    stop:"3",
    backward:"5",
    forward:"6",
    first:"7",
    last:"8",
    eject:"'",
    volume3:"%",
    volume2:"$",
    volume1:"#",
    mute:"@",
    mute2:"!",
    loop:"*",
    shuffle:"&",
    filter:"f",
    lastfm:"l"
};

var TimerMgr = new function(){
    this.timer = null;
    //this.interval = itv;
    var ontimer_funcs = [];
    var _this = this;
    
    this.RunIntervallic = function(func, obj, itv){
        ontimer_funcs.push([func, obj]);
        this.Active(itv);
    }
    
    this.Active = function(itv){
        if(!this.timer) this.timer = window.SetInterval(this.OnTimer, itv);
    }
    
    this.Stop = function(){
        if(!this.timer) return;
        window.ClearInterval(this.timer);
        this.timer = null;
    }
    
    this.OnTimer = function(){
        //fb.trace("Timer fired.");
        for(var i=0; i<ontimer_funcs.length; i++){
            if (!(ontimer_funcs[i][0].apply(ontimer_funcs[i][1]))) {
				ontimer_funcs.splice(i, 1);
				i--;
			}
        }
        if(!ontimer_funcs.length)
            _this.Stop();
    }
}();

//--->
function link(site, metadb) {
    if (!metadb) return;
    var meta_info = metadb.GetFileInfo();
    var artist = meta_info.MetaValue(meta_info.MetaFind("artist"), 0).replace(/\s+/g, "+").replace(/\&/g, "%26");
    var album = meta_info.MetaValue(meta_info.MetaFind("album"), 0).replace(/\s+/g, "+");
    switch (site) {
      case "Xiami Artist":
        site = artist ? "http://www.xiami.com/search/artist?key=" + artist :null;
        break;

      case "Xiami Album":
        site = album ? "http://www.xiami.com/search/album?key=" + album :null;
        break;

      case "Douban Artist":
        site = artist ? "http://music.douban.com/subject_search?search_text=" + artist :null;
        break;

      case "Douban Album":
        site = album ? "http://music.douban.com/subject_search?search_text=" + album :null;
        break;

      case "google":
        site = artist ? "http://images.google.com/search?q=" + artist + "&ie=utf-8" :null;
        break;

      case "googleImages":
        site = artist ? "http://images.google.com/images?hl=en&q=" + artist + "&ie=utf-8" :null;
        break;

      case "eCover":
        site = artist || album ? "http:ecover.to/?Module=ExtendedSearch&SearchString=" + artist + "+" + album + "&ie=utf-8" :null;
        break;

      case "wikipedia":
        site = artist ? "http://en.wikipedia.org/wiki/" + artist.replace(/\+/g, "_") :null;
        break;

      case "youTube":
        site = artist ? "http://www.youtube.com/results?search_type=&search_query=" + artist + "&ie=utf-8" :null;
        break;

      case "lastFM":
        site = artist ? "http://www.last.fm/music/" + artist.replace("/", "%252F") :null;
        break;

      case "discogs":
        site = artist || album ? "http://www.discogs.com/search?q=" + artist + "+" + album + "&ie=utf-8" :null;
        break;

      default:
        site = undefined;
    }
    if (!site || safeMode) return;
    try {
        WshShell.run(site);
    } catch (e) {
        fb.trace(e);
    }
}

var DT_LC = DT_VCENTER | DT_LEFT | DT_END_ELLIPSIS | DT_NOPREFIX | DT_CALCRECT;

var DT_CC = DT_VCENTER | DT_CENTER | DT_END_ELLIPSIS | DT_NOPREFIX | DT_CALCRECT;

var DT_RC = DT_VCENTER | DT_RIGHT | DT_END_ELLIPSIS | DT_NOPREFIX | DT_CALCRECT;


// SCROLLBAR
// SCROLLBARPARTS 
SBP_ARROWBTN = 1;

SBP_THUMBBTNHORZ = 2;

SBP_THUMBBTNVERT = 3;

SBP_LOWERTRACKHORZ = 4;

SBP_UPPERTRACKHORZ = 5;

SBP_LOWERTRACKVERT = 6;

SBP_UPPERTRACKVERT = 7;

SBP_GRIPPERHORZ = 8;

SBP_GRIPPERVERT = 9;

SBP_SIZEBOX = 10;

// ARROWBTNSTATES 
ABS_UPNORMAL = 1;

ABS_UPHOT = 2;

ABS_UPPRESSED = 3;

ABS_UPDISABLED = 4;

ABS_DOWNNORMAL = 5;

ABS_DOWNHOT = 6;

ABS_DOWNPRESSED = 7;

ABS_DOWNDISABLED = 8;

ABS_LEFTNORMAL = 9;

ABS_LEFTHOT = 10;

ABS_LEFTPRESSED = 11;

ABS_LEFTDISABLED = 12;

ABS_RIGHTNORMAL = 13;

ABS_RIGHTHOT = 14;

ABS_RIGHTPRESSED = 15;

ABS_RIGHTDISABLED = 16;

ABS_UPHOVER = 17;

ABS_DOWNHOVER = 18;

ABS_LEFTHOVER = 19;

ABS_RIGHTHOVER = 20;

// SCROLLBARSTYLESTATES
SCRBS_NORMAL = 1;

SCRBS_HOT = 2;

SCRBS_PRESSED = 3;

SCRBS_DISABLED = 4;

SCRBS_HOVER = 5;

var scrollbarClass = window.CreateThemeManager("SCROLLBAR");

var showScrollbar = window.GetProperty("user.Show Scrollbar", true);

var mouseInScrollbar = false;

var thumbDown = thumbDrag = false;

var thumbY;

var s = {};

var windowsVisualStyleEnabled = true;

var scrollbarUseWindowsVisualStyle = window.GetProperty("user.Scrollbar Use Windows Visual Style", false);

if (!scrollbarClass) {
    scrollbarUseWindowsVisualStyle = windowsVisualStyleEnabled = false;
}

var scrollbarTimerStarted = false;

var scrollbarTimer;

var scrollbarHoverAlpha = 0;

var pageBtnDown = false;

var listIsScrolledUp = false;

var listIsScrolledDown = false;

var needsScrollbar = false;

var scrollbarWidth = utils.GetSystemMetrics(2);

var scrollStep = window.GetProperty("user.Scroll Step", 3);

if (scrollStep < 1) {
    scrollStep = 1;
    window.SetProperty("user.Scroll Step", 1);
}

var scrollbarX = scrollbarY = scrollbarHeight = maxRows = 0;

var thisPanelName, scrollImg, scrollThumbImg;

// =================================================== //
function drawScrollbar(gr) {
    if (!listLength || !showScrollbar) return;
    gr.DrawImage(scrollImg.trackNormal, scrollbarX, scrollbarY, scrollbarWidth, scrollbarHeight, 0, 0, scrollbarWidth, 1, 0, 255);
    for (var i in s) {
        var x = s[i].x, y = s[i].y, w = s[i].w, h = s[i].h, state = s[i].state;
        hotAlpha = s[i].hoverAlpha;
        downAlpha = s[i].downAlpha;
        switch (i) {
          case "lineUp":
            gr.DrawImage(scrollImg.lineUpNormal, x, y, w, h, 0, 0, w, h, 0, 255);
            gr.DrawImage(scrollImg.lineUpHover, x, y, w, h, 0, 0, w, h, 0, scrollbarHoverAlpha);
            gr.DrawImage(scrollImg.lineUpHot, x, y, w, h, 0, 0, w, h, 0, hotAlpha);
            gr.DrawImage(scrollImg.lineUpPressed, x, y, w, h, 0, 0, w, h, 0, downAlpha);
            break;

          case "lineDown":
            gr.DrawImage(scrollImg.lineDownNormal, x, y, w, h, 0, 0, w, h, 0, 255);
            gr.DrawImage(scrollImg.lineDownHover, x, y, w, h, 0, 0, w, h, 0, scrollbarHoverAlpha);
            gr.DrawImage(scrollImg.lineDownHot, x, y, w, h, 0, 0, w, h, 0, hotAlpha);
            gr.DrawImage(scrollImg.lineDownPressed, x, y, w, h, 0, 0, w, h, 0, downAlpha);
            break;

          case "pageUp":
            if (state == 2) {
                var h = thumbY - thumbTrackY;
                gr.DrawImage(scrollImg.trackPressed, x, y, w, h, 0, 0, w, 1, 0, 255);
            }
            break;

          case "pageDown":
            if (state == 2) {
                var y = thumbY + thumbHeight;
                var h = thumbTrackY + thumbTrackHeight - (thumbY + thumbHeight);
                gr.DrawImage(scrollImg.trackPressed, x, y, w, h, 0, 0, w, 1, 0, 255);
            }
            break;

          case "thumb":
            var y = thumbY;
            gr.DrawImage(scrollThumbImg.Normal, x, y, w, h, 0, 0, w, h, 0, 255);
            gr.DrawImage(scrollThumbImg.Hot, x, y, w, h, 0, 0, w, h, 0, hotAlpha);
            gr.DrawImage(scrollThumbImg.Pressed, x, y, w, h, 0, 0, w, h, 0, scrollbarThumbDownAlpha);
            break;
        }
    }
}

// =================================================== //
(function createScrollbarImages() {
    if (scrollImg != undefined) return;
    var setPS = function(p, s) {
        scrollbarClass.SetPartAndStateId(p, s);
        return scrollbarClass;
    };
    var textRenderingHint = 5;
    var stringFormat = StringFormat(1, 2);
    scrollImg = {};
    var font = gdi.font("Segoe UI Symbol", 15, 0);
    var i, g;
    var m = 2;
    var w = scrollbarWidth;
    scrollColorNormal = RGB(225, 225, 225);
    scrollColorHover = RGB(157, 157, 157);
    scrollColorHot = scrollColorHover;
    scrollColorPressed = scrollColorHover;
    scrollSymbolColorNormal = RGB(140, 142, 144);
    scrollSymbolColorHot = RGB(40, 42, 44);
    scrollSymbolColorHover = RGB(30, 32, 34);
    scrollSymbolColorPressed = RGB(30, 32, 34);
    scrollTrackColor = RGB(250, 250, 250);
    // must be without alpha channel when cleartype font is used
    i = gdi.CreateImage(w, w);
    g = i.GetGraphics();
    if (scrollbarUseWindowsVisualStyle) {
        setPS(SBP_LOWERTRACKVERT, SCRBS_NORMAL).DrawThemeBackground(g, 0, 0, w, w);
    } else {
        g.FillSolidRect(m, 0, w - m * 2, w, scrollTrackColor);
    }
    i.ReleaseGraphics(g);
    scrollImg.trackNormal = i;
    i = gdi.CreateImage(w, w);
    g = i.GetGraphics();
    if (scrollbarUseWindowsVisualStyle) {
        setPS(SBP_LOWERTRACKVERT, SCRBS_PRESSED).DrawThemeBackground(g, 0, 0, w, w);
    } else {
        g.FillSolidRect(m, 0, w - m * 2, w, RGB(75, 80, 85));
    }
    i.ReleaseGraphics(g);
    scrollImg.trackPressed = i;
    //---> Up
    i = gdi.CreateImage(w, w);
    g = i.GetGraphics();
    if (scrollbarUseWindowsVisualStyle) {
        setPS(SBP_ARROWBTN, ABS_UPNORMAL).DrawThemeBackground(g, 0, 0, w, w);
    } else {
        g.FillSolidRect(m, 0, w - m * 2, w - 1, scrollTrackColor);
        g.SetTextRenderingHint(textRenderingHint);
        g.DrawString("", font, scrollSymbolColorNormal, 0, 0, w, w - 1, stringFormat);
    }
    i.ReleaseGraphics(g);
    scrollImg.lineUpNormal = i;
    i = gdi.CreateImage(w, w);
    g = i.GetGraphics();
    if (scrollbarUseWindowsVisualStyle) {
        setPS(SBP_ARROWBTN, ABS_UPHOT).DrawThemeBackground(g, 0, 0, w, w);
    } else {
        g.FillSolidRect(m, 0, w - m * 2, w - 1, scrollColorHot);
        g.SetTextRenderingHint(textRenderingHint);
        g.DrawString("", font, scrollSymbolColorHot, 0, 0, w, w - 1, stringFormat);
    }
    i.ReleaseGraphics(g);
    scrollImg.lineUpHot = i;
    i = gdi.CreateImage(w, w);
    g = i.GetGraphics();
    if (scrollbarUseWindowsVisualStyle) {
        setPS(SBP_ARROWBTN, ABS_UPHOVER).DrawThemeBackground(g, 0, 0, w, w);
    } else {
        g.FillSolidRect(m, 0, w - m * 2, w - 1, scrollColorHover);
        g.SetTextRenderingHint(textRenderingHint);
        g.DrawString("", font, scrollSymbolColorHover, 0, 0, w, w - 1, stringFormat);
    }
    i.ReleaseGraphics(g);
    scrollImg.lineUpHover = i;
    i = gdi.CreateImage(w, w);
    g = i.GetGraphics();
    if (scrollbarUseWindowsVisualStyle) {
        setPS(SBP_ARROWBTN, ABS_UPPRESSED).DrawThemeBackground(g, 0, 0, w, w);
    } else {
        g.FillSolidRect(m, 0, w - m * 2, w - 1, scrollColorPressed);
        g.SetTextRenderingHint(textRenderingHint);
        g.DrawString("", font, scrollSymbolColorPressed, 0, 0, w, w - 1, stringFormat);
    }
    i.ReleaseGraphics(g);
    scrollImg.lineUpPressed = i;
    //---> Down
    i = gdi.CreateImage(w, w);
    g = i.GetGraphics();
    if (scrollbarUseWindowsVisualStyle) {
        setPS(SBP_ARROWBTN, ABS_DOWNNORMAL).DrawThemeBackground(g, 0, 0, w, w);
    } else {
        g.FillSolidRect(m, 1, w - m * 2, w - 1, scrollTrackColor);
        g.SetTextRenderingHint(textRenderingHint);
        g.DrawString("", font, scrollSymbolColorNormal, 0, 0, w, w, stringFormat);
    }
    i.ReleaseGraphics(g);
    scrollImg.lineDownNormal = i;
    i = gdi.CreateImage(w, w);
    g = i.GetGraphics();
    if (scrollbarUseWindowsVisualStyle) {
        setPS(SBP_ARROWBTN, ABS_DOWNHOT).DrawThemeBackground(g, 0, 0, w, w);
    } else {
        g.FillSolidRect(m, 1, w - m * 2, w - 1, scrollColorHot);
        g.SetTextRenderingHint(textRenderingHint);
        g.DrawString("", font, scrollSymbolColorHot, 0, 0, w, w, stringFormat);
    }
    i.ReleaseGraphics(g);
    scrollImg.lineDownHot = i;
    i = gdi.CreateImage(w, w);
    g = i.GetGraphics();
    if (scrollbarUseWindowsVisualStyle) {
        setPS(SBP_ARROWBTN, ABS_DOWNHOVER).DrawThemeBackground(g, 0, 0, w, w);
    } else {
        g.FillSolidRect(m, 1, w - m * 2, w - 1, scrollColorHover);
        g.SetTextRenderingHint(textRenderingHint);
        g.DrawString("", font, scrollSymbolColorHover, 0, 0, w, w, stringFormat);
    }
    i.ReleaseGraphics(g);
    scrollImg.lineDownHover = i;
    i = gdi.CreateImage(w, w);
    g = i.GetGraphics();
    if (scrollbarUseWindowsVisualStyle) {
        setPS(SBP_ARROWBTN, ABS_DOWNPRESSED).DrawThemeBackground(g, 0, 0, w, w);
    } else {
        g.FillSolidRect(m, 1, w - m * 2, w - 1, scrollColorPressed);
        g.SetTextRenderingHint(textRenderingHint);
        g.DrawString("", font, scrollSymbolColorPressed, 0, 0, w, w, stringFormat);
    }
    i.ReleaseGraphics(g);
    scrollImg.lineDownPressed = i;
})();

// =================================================== //
function createScrollbarThumbImages() {
    var outRows = listLength - maxRows;
    var w = scrollbarWidth;
    var h = Math.max(scrollbarWidth, Math.min(scrollbarHeight, Math.ceil(scrollbarHeight - (outRows + 1) * (window.Height / listLength))));
    if (w <= 0 || h <= 0 || isNaN(h)) return;
    var setPS = function(p, s) {
        scrollbarClass.SetPartAndStateId(p, s);
        return scrollbarClass;
    };
    scrollThumbImg = {};
    var i, g;
    var m = 2;
    i = gdi.CreateImage(w, h);
    g = i.GetGraphics();
    if (scrollbarUseWindowsVisualStyle) {
        setPS(SBP_THUMBBTNVERT, SCRBS_NORMAL).DrawThemeBackground(g, 0, 0, w, h);
        w != h && setPS(SBP_GRIPPERVERT, SCRBS_NORMAL).DrawThemeBackground(g, 0, 0, w, h);
    } else {
        g.FillSolidRect(m, 0, w - m * 2, h, scrollColorNormal);
    }
    i.ReleaseGraphics(g);
    scrollThumbImg.Normal = i;
    i = gdi.CreateImage(w, h);
    g = i.GetGraphics();
    if (scrollbarUseWindowsVisualStyle) {
        setPS(SBP_THUMBBTNVERT, SCRBS_HOT).DrawThemeBackground(g, 0, 0, w, h);
        w != h && setPS(SBP_GRIPPERVERT, SCRBS_HOT).DrawThemeBackground(g, 0, 0, w, h);
    } else {
        g.FillSolidRect(m, 0, w - m * 2, h, scrollColorHot);
    }
    i.ReleaseGraphics(g);
    scrollThumbImg.Hot = i;
    i = gdi.CreateImage(w, h);
    g = i.GetGraphics();
    if (scrollbarUseWindowsVisualStyle) {
        setPS(SBP_THUMBBTNVERT, SCRBS_PRESSED).DrawThemeBackground(g, 0, 0, w, h);
        w != h && setPS(SBP_GRIPPERVERT, SCRBS_PRESSED).DrawThemeBackground(g, 0, 0, w, h);
    } else {
        g.FillSolidRect(m, 0, w - m * 2, h, scrollColorPressed);
    }
    i.ReleaseGraphics(g);
    scrollThumbImg.Pressed = i;
}

// =================================================== //
function scrollbarAlphaTimer() {
    var turnTimerOff = false, hoverInStep = 50, hoverOutStep = 11, downInStep = 100, downOutStep = 50, timerDelay = 25, currentAlpha;
    if (!scrollbarTimerStarted) {
        scrollbarTimer = window.SetInterval(function() {
            for (var i in s) {
                switch (s[i].state) {
                  case 0:
                    s[i].hoverAlpha = Math.max(0, s[i].hoverAlpha -= hoverOutStep);
                    s[i].downAlpha = Math.max(0, s[i].downAlpha -= Math.max(0, downOutStep));
                    s[i].repaint();
                    break;

                  case 1:
                    s[i].hoverAlpha = Math.min(255, s[i].hoverAlpha += hoverInStep);
                    s[i].downAlpha = Math.max(0, s[i].downAlpha -= downOutStep);
                    s[i].repaint();
                    break;

                  case 2:
                    s[i].downAlpha = Math.min(255, s[i].downAlpha += downInStep);
                    s[i].hoverAlpha = Math.max(0, s[i].hoverAlpha -= downInStep);
                    s[i].repaint();
                    break;
                }
            }
            if (mouseInScrollbar || thumbDown) scrollbarHoverAlpha = Math.min(255, scrollbarHoverAlpha += hoverInStep); else scrollbarHoverAlpha = Math.max(0, scrollbarHoverAlpha -= hoverOutStep);
            if (!thumbDown) {
                scrollbarThumbDownAlpha = Math.max(0, scrollbarThumbDownAlpha -= hoverOutStep);
            }
            //---> test alpha values and turn timer off when it's not required;
            var testAlpha = 0, currentAlphaIsFull = false, alphaIsZero = true;
            if (!mouseInScrollbar) currentAlpha = undefined;
            for (var i in s) {
                if ((s[i].hoverAlpha == 255 || s[i].downAlpha == 255) && scrollbarHoverAlpha == 255) {
                    currentAlpha = i;
                    currentAlphaIsFull = true;
                    continue;
                }
                if (currentAlpha && currentAlpha != i) {
                    alphaIsZero = (testAlpha += s[i].hoverAlpha + s[i].downAlpha + scrollbarThumbDownAlpha) == 0;
                } else {
                    alphaIsZero = (testAlpha += s[i].hoverAlpha + s[i].downAlpha + scrollbarThumbDownAlpha + scrollbarHoverAlpha) == 0;
                }
            }
            if ((!mouseInScrollbar && !currentAlphaIsFull || currentAlphaIsFull) && alphaIsZero) {
                turnTimerOff = true;
            }
            if (turnTimerOff) {
                window.ClearInterval(scrollbarTimer);
                scrollbarTimerStarted = false;
            }
        }, timerDelay);
        scrollbarTimerStarted = true;
    }
}

// =================================================== //
var scrollbarThumbDownAlpha = thumbTrackHeight = thumbHeight = thumbTrackY = 0;

function controlScrollbar(x, y, w, h) {
    if (listStep[activeList] == undefined) return;
    thumbTrackY = y + w;
    thumbTrackHeight = h - w * 2;
    outRows = listLength - maxRows;
    thumbHeight = Math.max(scrollbarWidth, Math.min(scrollbarHeight, Math.ceil(scrollbarHeight - (outRows + 1) * (wh / listLength))));
    needsScrollbar = outRows > 0 && thumbHeight < thumbTrackHeight;
    if (needsScrollbar && showScrollbar) {
        if (!thumbDown) {
            pos = Math.floor(listStep[activeList] * (thumbTrackHeight - thumbHeight) / (listLength - maxRows)) + thumbTrackY;
            thumbY = Math.max(thumbTrackY, Math.min(thumbTrackY + thumbTrackHeight - thumbHeight, pos));
        }
        s = {
            lineUp:new ScrollbarPart(x, y, w, w),
            pageUp:new ScrollbarPart(x, thumbTrackY, w, thumbY - thumbTrackY),
            thumb:new ScrollbarPart(x, thumbY, w, thumbHeight),
            pageDown:new ScrollbarPart(x, thumbY + thumbHeight, w, thumbTrackY + thumbTrackHeight - (thumbY + thumbHeight)),
            lineDown:new ScrollbarPart(x, h + y - w, w, w)
        };
    }
    if (listIsScrolledUp || listIsScrolledDown) onScrollStep(0);
}

// =================================================== //
var oldPart;

var downPart, downPartKey;

function ScrollbarPart(x, y, w, h, onClick) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.state = 0;
    this.hoverAlpha = 0;
    this.downAlpha = 0;
}

// ====================================== //
ScrollbarPart.prototype.mouseInThisPart = function(x, y) {
    return this.x <= x && x <= this.x + this.w && this.y <= y && y <= this.y + this.h;
};

// ====================================== //
ScrollbarPart.prototype.repaint = function() {
    window.RepaintRect(this.x, this.y, this.w, this.h);
};

// ====================================== //
ScrollbarPart.prototype.changeState = function(state) {
    this.state = state;
    this.repaint();
    //this.state == 0 ? window.SetCursor(IDC_ARROW) : window.SetCursor(IDC_HAND);
    scrollbarAlphaTimer();
};

// ====================================== //
function scrollEvent(event) {
    switch (event) {
      case "lineUp":
        onScrollStep(1, 1);
        break;

      case "pageUp":
        onScrollStep(1, maxRows);
        break;

      case "pageDown":
        onScrollStep(-1, maxRows);
        break;

      case "lineDown":
        onScrollStep(-1, 1);
        break;

      case "dragUp":
        onScrollStep(1, 1);
        break;

      case "dragDown":
        onScrollStep(-1, 1);
        break;
    }
}

// ====================================== //
function startScrollRepeat(key) {
    if (!scrollStepRepeatTimerStarted) {
        scrollStepRepeatTimeout = window.SetTimeout(function() {
            scrollStepRepeatTimer = window.SetInterval(function() {
                if (!mouseInScrollbar && !rowDrag && !fileDrag && !makeSelectionDrag) return;
                if (key == "pageDown" || key == "pageUp") {
                    fastScrollActive = true;
                }
                if (key == "pageDown" && mouseY < thumbY + thumbHeight) {
                    fastScrollActive = false;
                    return;
                } else if (key == "pageUp" && mouseY > thumbY) {
                    fastScrollActive = false;
                    return;
                }
                scrollEvent(key);
                if (listIsScrolledUp || listIsScrolledDown) {
                    stopScrollRepeat();
                }
            }, 50);
        }, 350);
        scrollStepRepeatTimerStarted = true;
    }
}

// ====================================== //
function stopScrollRepeat() {
    if (thisPanelName == "Playlist" && listIsScrolledDown && (rowDrag || fileDrag) && !mouseOverList) {
        linkToLastItem = true;
        r[maxRows - 1].repaint();
    }
    refreshScrollbar();
    window.ClearTimeout(scrollStepRepeatTimeout);
    window.ClearTimeout(scrollStepRepeatTimer);
    scrollStepRepeatTimerStarted = false;
    scrollStepRepeatTimeout = scrollStepRepeatTimer = undefined;
}

// ====================================== //
var thumbTempY = 0;

var tempStep;

var scrollStepRepeatTimerStarted = false;

var scrollStepRepeatTimeout;

var scrollStepRepeatTimer;

var fastScrollActive = false;

var tempThumbY;

var currentPart;

var tempPos;

var mouseY = 0;

var doubleClicked2 = false;

function scrollbarMouseEventHandler(x, y) {
    if (caller() == "on_mouse_wheel") {
        if (needsScrollbar && !showScrollbar) {
            if (utils.IsKeyPressed(VK_CONTROL)) {
                step = 1;
            } else if (utils.IsKeyPressed(VK_SHIFT)) {
                step = maxRows;
            } else {
                step = scrollStep;
            }
            onScrollStep(x, step);
        }
    }
    if (!needsScrollbar || !showScrollbar) return;
    var thisPart, thisKey;
    for (var i in s) {
        if (s[i].mouseInThisPart(x, y)) {
            thisPart = s[i];
            thisKey = i;
        }
    }
    switch (caller()) {
      case "on_mouse_move":
        mouseY = y;
        if (thisPart) {
            mouseInScrollbar = mouseInControl = true;
        } else {
            mouseInScrollbar = mouseInControl = false;
        }
        if (mouseInScrollbar && !downPart && !thumbDown && thumbY != s["thumb"].y) {
            refreshScrollbar();
        }
        if (!downPart) {
            if (oldPart && oldPart != thisPart) {
                oldPart.changeState(0);
            }
            if (thisPart && thisPart != oldPart) {
                thisPart.changeState(1);
            }
        }
        oldPart = thisPart;
        if (thisPart == s.thumb && !thumbDown) {
            thumbTempY = y - thumbY;
        }
        if (thumbDown) {
            thumbY = Math.max(thumbTrackY, Math.min(thumbTrackY + thumbTrackHeight - thumbHeight, y - thumbTempY));
            if (thumbY != s["thumb"].y) {
                thumbDrag = true;
            }
            if (thumbDrag) {
                scrollbarThumbDownAlpha = 255;
                repaintScrollbar();
                var step = Math.floor((thumbY - thumbTrackY) / ((thumbTrackHeight - thumbHeight) / (list.length - maxRows)));
                listStep[activeList] = step;
                if (tempStep != step) {
                    window.SetProperty("system.List Step", listStep.toString());
                    repaintList();
                }
                tempStep = step;
                if (!fastScrollActive) {
                    fastScrollActive = true;
                    scrollbarDragActiveTimer = window.SetInterval(function() {
                        if (tempThumbY == thumbY) {
                            window.ClearTimeout(scrollbarDragActiveTimer);
                            fastScrollActive = false;
                            listIsScrolledUp = listStep[activeList] == 0;
                            listIsScrolledDown = list[maxRows - 1 + listStep[activeList]] == list[listLength - 1];
                            if (thisPanelName == "Playlist") getAlbumArt();
                        }
                        tempThumbY = thumbY;
                    }, 100);
                }
            }
        }
        break;

      case "on_mouse_lbtn_dblclk":
      case "on_mouse_lbtn_down":
        if (thisPart) {
            downPart = thisPart;
            downPartKey = thisKey;
            if (downPart != s.thumb) downPart.changeState(2);
            if (downPart == s.thumb) {
                thumbDown = true;
            }
        }
        if (downPartKey == "pageUp" || downPartKey == "pageDown") {
            fastScrollActive = true;
        }
        if (downPart && downPart != s.thumb) {
            startScrollRepeat(downPartKey);
            if (downPartKey == "pageUp" || downPartKey == "pageDown") {
                pageBtnDown = true;
            }
        }
        if (downPart) {
            if (!scrollStepRepeatTimer) {
                scrollEvent(downPartKey);
            }
        }
        break;

      case "on_mouse_lbtn_up":
        if (thumbDrag) {
            if (listStep[activeList] == 0) {
                thumbY = thumbTrackY;
                listIsScrolledUp = true;
            }
            tempStep = undefined;
        }
        if (downPart && thisPart != downPart) {
            downPart.changeState(0);
        } else if (downPart) {
            downPart.changeState(1);
        }
        if (scrollStepRepeatTimerStarted) {
            stopScrollRepeat();
        }
        if (downPartKey == "pageUp" || downPartKey == "pageDown") {
            fastScrollActive = false;
            if (thisPanelName == "Playlist") getAlbumArt();
        }
        //-->
        if (thumbDrag) {
            refreshScrollbar();
        }
        //-->
        thumbDrag = thumbDown = pageBtnDown = false;
        downPart = downPartKey = undefined;
        //-->
        break;

      case "on_mouse_rbtn_up":
        return true;
        break;

      case "on_mouse_wheel":
        if (needsScrollbar && !downPart) {
            if (utils.IsKeyPressed(VK_CONTROL)) {
                step = 1;
            } else if (utils.IsKeyPressed(VK_SHIFT)) {
                step = maxRows;
            } else {
                step = scrollStep;
            }
            onScrollStep(x, step);
            if (listIsScrolledUp && x == 1 || listIsScrolledDown && x == -1) return;
            refreshScrollbar();
        }
        break;

      case "on_mouse_leave":
        mouseInScrollbar = mouseInControl = false;
        if (!thumbDrag) {
            for (var i in s) {
                if (s[i].state != 0) {
                    s[i].changeState(0);
                }
            }
        }
        break;
    }
}

// =================================================== //
var getAlbumArtDelay = false;

var getAlbumArtTimer;

function onScrollStep(delta, scrollStep) {
    if (listIsScrolledUp && delta == 1 || listIsScrolledDown && delta == -1) return;
    listIsScrolledUp = listIsScrolledDown = false;
    if (delta > 0 && listStep[activeList] > 0) {
        listStep[activeList] = Math.max(0, listStep[activeList] -= scrollStep);
    } else if (delta < 0 && maxRows + listStep[activeList] < listLength) {
        listStep[activeList] = Math.min(listLength - maxRows, listStep[activeList] += scrollStep);
    } else if (delta == "scrollToEnd") {
        listStep[activeList] = list.length - maxRows;
    }
    listIsScrolledUp = listStep[activeList] == 0;
    listIsScrolledDown = list[maxRows - 1 + listStep[activeList]] == list[listLength - 1];
    if (listLength == maxRows) {
        listIsScrolledDown = true;
    }
    var pos = Math.floor(listStep[activeList] * (thumbTrackHeight - thumbHeight) / (listLength - maxRows)) + thumbTrackY;
    thumbY = Math.max(thumbTrackY, Math.min(thumbTrackY + thumbTrackHeight - thumbHeight, pos));
    repaintList();
    if (needsScrollbar) {
        repaintScrollbar();
    }
    window.SetProperty("system.List Step", listStep.toString());
    if (thisPanelName == "Playlist" && !getAlbumArtDelay) {
        getAlbumArtDelay = true;
        getAlbumArtTimer = window.SetInterval(function() {
            window.ClearTimeout(getAlbumArtTimer);
            getAlbumArtDelay = false;
            getAlbumArt();
        }, 100);
    }
}

// =================================================== //
function on_selection_changed() {
    refreshScrollbar();
    refreshScrollbarStyle();
}

// =================================================== //
function refreshScrollbarStyle(style) {
    if (scrollbarUseWindowsVisualStyle != style) {
        scrollImg = undefined;
    }
    createScrollbarImages();
    createScrollbarThumbImages();
    repaintScrollbar();
}

// =================================================== //
function refreshScrollbar() {
    controlScrollbar(scrollbarX, scrollbarY, scrollbarWidth, scrollbarHeight);
}

// =================================================== //
function repaintScrollbar() {
    window.RepaintRect(scrollbarX, scrollbarY, scrollbarWidth, scrollbarHeight);
}

// Main
var FLAG_REMOVE_PLAYLIST = 32;

var WS_EX_TRANSPARENT = 32;

var WS_EX_TOPMOST = 8;

cList = {
    name:"*playlist",
    show:true,
    rowH:window.GetProperty("*playlist.Row Height", 24),
    focusItem:window.GetProperty("*playlist" + ".Show Focus Item", false),
    queueItem:window.GetProperty("*playlist" + ".Show Queue Item", true),
    alternateRowColor:window.GetProperty("*playlist" + ".Alternate Row Color", false),
    margin:{
        l:window.GetProperty("*playlist" + ".Margin Left", 0),
        t:window.GetProperty("*playlist" + ".Margin Top", 0),
        r:window.GetProperty("*playlist" + ".Margin Right", 0),
        b:window.GetProperty("*playlist" + ".Margin Bottom", 0)
    },
    x:0,
    y:0,
    w:0,
    h:0
};

column = {
    artist:window.GetProperty(cList.name + ".Show Artist", false),
    artist_x:0,
    artist_w:0,
    rating:window.GetProperty(cList.name + ".Show Rating", false),
    rating_x:0,
    rating_w:0,
    playcount:window.GetProperty(cList.name + ".Show Play Count", false),
    playcount_x:0,
    playcount_w:0
};

gGroupBy = {
    artist:"%album artist%",
    // 0
    artistAlbum:"%album artist%%album%",
    // 1
    artistAlbumDiscnumber:"%album artist%%album%%discnumber%",
    // 2
    path:"$directory_path(%path%)",
    // 3
    date:"%date%",
    // 4
    userDefined:window.GetProperty(cList.name + ".Group By", "")
};

cGroup = {
    show:window.GetProperty(cList.name + ".Show Group Header", false),
    info:window.GetProperty(cList.name + ".Show Info", false),
    rows:window.GetProperty(cList.name + ".Rows In Group", 4),
    id:window.GetProperty(cList.name + ".Grouped ID", 2),
    format:window.GetProperty(cList.name + ".Group Format", gGroupBy.artistAlbumDiscnumber),
    cover:{
		x: 0,
		y: 0,
        show:window.GetProperty(cList.name + ".Show Album Art", true),
        auto:window.GetProperty(cList.name + ".Auto Album Art", false),
		left: window.GetProperty(cList.name + ".Album Art On Left", false)

    }
};

if (cGroup.id == 5) {
    cGroup.format = gGroupBy.userDefined;
    window.SetProperty(cList.name + ".GroupBy", cGroup.format);
}

gCollapse = {
    autoExpand:window.GetProperty(cList.name + ".Auto Expand/Collapse Groups", false),
    autoOnSwitch:window.GetProperty(cList.name + ".Auto Collapse On Playlist Switch", false),
    onStart:window.GetProperty(cList.name + ".Collapse On Start", false)
};

window.DlgCode = DLGC_WANTALLKEYS;

//uncomment for DUI
//--->
var scrollStep = window.GetProperty("user.Scroll Step", 3);

if (scrollStep < 1) {
    scrollStep = 1;
    window.SetProperty("user.Scroll Step", 1);
}

//var autoExpandCollapseGroups = window.GetProperty("user.Auto Expand/Collapse Groups", false);
var alternateRowColor = window.GetProperty("user.Alternate Row Color", false);

var skipLessThan = window.GetProperty("user.Skip Less Than", 2);

var enableSkip = window.GetProperty("user.Skip Enable", false);

var componentPlayCount = utils.CheckComponent("foo_playcount", true);

var useTagRating = window.GetProperty("user.Use Tag Rating", false);

//var autoCollapseOnPlaylistSwitch = window.GetProperty("user.Auto Collapse On Playlist Switch", false);
//var collapseOnStart = window.GetProperty("user.Collapse On Start", false);
var showNowPlayingCalled = false;

var collapsedOnStart = false;

//--->
var listLength = maxRows = wh = ww = listX = listY = listW = listH = 0;

var listStep = [];

var rowDrag = fileDrag = makeSelectionDrag = linkToLastItem = false;

var panelFocus;

var nowPlayingGroupNr = -1;

var focusGroupNr = -1;

var keyPressed = false;

var guiInstanceType = window.InstanceType;

var tempFocusItemIndex;

// =================================================== //
//---> 
var thisPanelName = "Playlist";

//Don't change!! needed on Scrollbar.txt.
//---> Fonts
var globalFontName = window.GetProperty(cList.name + ".Global Font Name", "Segoe Ui");

var listFontSize = window.GetProperty(cList.name + ".List Font Size", 12);

var titleFont = gdi.font(globalFontName, listFontSize);

var artistFont = gdi.font(globalFontName, 24);

var playCountFont = gdi.font(globalFontName, 9, 0);

var albumFont = gdi.font(globalFontName, 14, 0);

var dateFont = gdi.font(globalFontName, 11, 0);

var infoFont = gdi.font(globalFontName, 11, 0);

var coverFont = gdi.font(globalFontName, 11, 0);

var ratingFontNotRated = gdi.font("Segoe Ui Symbol", 14);

var ratingFontRated = gdi.font("Segoe Ui Symbol", 16);


var artAlpha = 220;

var dropped = false;

var totalLength = selectionLength = 0;

var listInfoHeight = 26;

//
var ICON = initImage();

var B = new Buttons();

var V = new Volume(0, 0, 0, 0);

var S = new Seekbar(0, 0, 0, 0);

window.SetInterval(function() {
    if (!fb.IsPlaying || fb.IsPaused || fb.PlaybackLength == 0) return;
    S.repaint();
    window.RepaintRect(ww - 110, wh - 65 + 8, 100, 18);
}, 1e3);

var PB = new Buttons();

//========================================================================================================//
function on_paint(gr) {
	// 注意 z 轴
	// background
    gr.FillSolidRect(0, 0, ww, wh, gColor.background);

	// playlist view
    drawPlaylist(gr);

    // top bar
    gr.FillSolidRect(cList.x, cList.y - 28, cList.w, 26, RGB(247, 247, 247));
    var b = PB.btns[0];
    var font = titleFont;
    var color;
    if (b.state == 1) color = blendColors(RGB(0, 0, 0), RGB(255, 255, 255), 0.2); 
	else if (b.state == 2) color = blendColors(RGB(0, 0, 0), RGB(255, 255, 255), 0.4);
	b.state && gr.FillSolidRect(b.x, b.y, b.w, b.h, color);
    gr.GdiDrawText(b.text + ":", font, gColor.textNormal_1, b.x, b.y, b.w, b.h, DT_CC);
    var selectedIndexesLength = selectedIndexes.length;
    var totalItems = 0;
    selectedIndexesLength ? totalItems = selectedIndexesLength :totalItems = playlistItemCount;
    var items = totalItems > 1 ? GetText(" items selected") :GetText(" item selected");
    if (!selectedIndexesLength) {
        selectionLength = totalLength;
        items = totalItems > 1 ? GetText(" items") :GetText(" item");
    }
    gr.GdiDrawText(totalItems + items + (selectionLength == "NaN:NaN" ? "" :GetText(", Length: ") + selectionLength), titleFont, gColor.textNormal_1, b.x + b.w, b.y, cList.x + cList.w - b.x - b.w - 20, b.h, DT_LC);
    gr.FillSolidRect(0, 26, ww, 2, utils.GetSysColor(15));

    // bottom panel
    gr.FillSolidRect(0, wh - 65, ww, 65, RGB(247, 247, 247));
    B.draw(gr);
    V.draw(gr);
    S.draw(gr);
    var timeStr = TimeFromSeconds(fb.PlaybackTime) + " / " + TimeFromSeconds(fb.PlaybackLength);
    var h = 18;
    var w = 100;
    gr.GdiDrawText(timeStr, gdi.font(globalFontName, 11, 1), RGB(88, 88, 88), ww - w - 10, wh - 65 + 8, w, h, DT_RC);
    gr.FillSolidRect(0, wh - 67, ww, 2, utils.GetSysColor(15));
}

function drawPlaylist(gr) {
    gr.FillSolidRect(listX, listY, listW, listH, RGB(255, 255, 255));
    // draw playlist 
    var playingID;
    var selectedID;
    var focusID;
    var queueIndexes = [];
    var queueIndexCount = [];
    var isPlaylistItemQueued = [];
    var groupItemCounter = 0;
    if (plman.PlayingPlaylist == activeList) {
        playingID = plman.GetPlayingItemLocation().PlaylistItemIndex;
    }
    focusID = plman.GetPlaylistFocusItemIndex(activeList);
    if (listLength) {
        //---> Get visible group row count
        var visibleGroupRows = [];
        var tempGroupNr = 0;
        var groupRowCount = 0;
        for (var i = 0; i != maxRows; i++) {
            var ID = list[i + listStep[activeList]];
            if (ID.isGroupHeader) {
                var groupNr = ID.groupNr;
                groupNr == tempGroupNr ? groupRowCount++ :groupRowCount = 1;
                visibleGroupRows[groupNr] = groupRowCount;
            }
            tempGroupNr = groupNr;
        }
        //--->
        var tempGroupNr = -1;
        for (var i = 0; i != maxRows; i++) {
            var ID = list[i + listStep[activeList]];
            if (plman.IsPlaylistItemSelected(activeList, ID.nr)) {
                selectedID = ID.nr;
            }
            var metadb = ID.metadb;
            var x = listX, y = r[i].y, w = listW, h = cList.rowH;
            if (ID.isGroupHeader) {
                var groupNr = ID.groupNr;
                var selectedGroup = isGroupSelected(groupNr, playingID);
                groupItemCounter = 1;
                //--->
				
				rowColorFocus = gColor.textNormal_3;

				lineColor = gColor.textNormal_3;
				artistColor = gColor.textNormal_1;
				albumColor = gColor.textNormal_2;
				infoColor = gColor.textNormal_2;
				dateColor = gColor.textNormal_2;
				

                if (selectedGroup) {
                    lineColor = gColor.textSelected_3;
                    artistColor =  gColor.textNormal_1;
					albumColor = gColor.textSelected_2;
					dateColor = infoColor = gColor.textSelected_2;
                } 

				if (nowPlayingGroupNr == groupNr) {
				} 

                //---> 
                if (groupNr != tempGroupNr) {
                    var clipY = r[i].y + 1;
                    var clipH = visibleGroupRows[groupNr] * cList.rowH - 1;
                    var groupY = i == 0 && ID.rowNr > 1 ? clipY - (ID.rowNr - 1) * cList.rowH :clipY - 1;
                    var groupH = cGroup.rows * cList.rowH;

                    if (selectedGroup) gr.FillSolidRect(x, groupY, w, groupH, gColor.selection);
					// focusGroupNr do not work, do not know why.
                    //if (isCollapsed[groupNr] && focusGroupNr == groupNr) {
					if (nowPlayingGroupNr == groupNr && isCollapsed[groupNr]) 
                        gr.DrawRect(x + 2, groupY + 2, w - 4, groupH - 5, 1, rowColorFocus);
                    //}

					// gr.DrawLine(x, groupY, w, groupY, 2, RGB(224, 224, 224));
					// if (isCollapsed[groupNr]) {
					//	gr.DrawLine(x, groupY + groupH , w, groupY + groupH , 2, RGB(224, 224, 224));
					// } 

                    // albumArt
                    var art = artArray[ID.groupNr];
                    var p = 8, 
						artH = groupH - p * 2, 
						artW = cGroup.cover.show && (cGroup.cover.auto ? art !== null :true) ? groupH - p * 2 :0; 
					cGroup.cover.y = groupY + p;
					if (cGroup.cover.left) { // cover on left
						cGroup.cover.x = (cGroup.cover.show && (cGroup.cover.auto ? art !== null : true)) ? x + p : x;
					} else {
						cGroup.cover.x = (cGroup.cover.show && (cGroup.cover.auto ? art !== null : true)) ? x + w - artW - p : x + w;
					}

                    gr.FillSolidRect(cGroup.cover.x , cGroup.cover.y, artW, artH, selectedGroup ? blendColors(RGB(0, 0, 0), gColor.selection, 0.04) : blendColors(RGB(0, 0, 0), gColor.background, 0.04));
                    if (cGroup.cover.show) {
                        if (art) {
                            gr.DrawImage(art, cGroup.cover.x + 2, cGroup.cover.y + 2, artW - 4, artH - 4, 0, 0, art.Width, art.Height, 0, 220);
                        } else if (art === null && !cGroup.cover.auto) {
                            gr.GdiDrawText("NO\nCover", coverFont, artistColor, cGroup.cover.x, cGroup.cover.y, artW, artH, DT_CC);
                        } else if (!cGroup.cover.auto) {
                            gr.GdiDrawText("LOADING", coverFont, artistColor, cGroup.cover.x, cGroup.cover.y, artW, artH, DT_CC);
                        }
                    }
                    var leftPad = cGroup.cover.left ? cGroup.cover.x + artW + p : x + p ;

                    //album
                    var path = $("%path%", metadb).slice(0, 4);
                    var radio = path == "http" ? true :false;
                    var albumX = leftPad, 
						// albumW = artX - albumX - 10, 
						albumW = w - artW - p * 3,
						albumH = 24,
						albumY = groupY + groupH - albumH - p;
                    var album = $("> %album%[ - [Disc %discnumber%]]", metadb);
                    if (album == "?" && radio) album = "";
                    if (cGroup.id) {
                        gr.GdiDrawText(album, albumFont, albumColor, albumX, albumY, albumW, albumH, cGroup.cover.left ? DT_LC : DT_LC);
                    }
                    // albumArtist
                    var artistX = albumX, 
						artistW = albumW, 
						artistH = 32,
						artistY = albumY - artistH;
                    var artist = $("%album artist%", metadb);
                    if (artist == "?" && radio) artist = GetText("Radio Stream");
                    gr.GdiDrawText(artist, artistFont, artistColor, artistX, artistY, artistW, artistH, cGroup.cover.left ? DT_LC : DT_LC);
                    // var divGroupH = (groupH - p * 2) / 3;
                    //---> DATE
                    var date = $("[$left(%date%,4)]", metadb);
                    if (date == "?" && radio) date = "";
                    var dateW = gr.CalcTextWidth(date, dateFont) + 10;
                    var dateX = cGroup.cover.left ? cGroup.cover.x + artW + 5 : cGroup.cover.x - dateW - 5;
                    var dateY = groupY + p;
                    var dateH = gr.CalcTextHeight("0000", dateFont) + 2;
                    gr.GdiDrawText(date, dateFont, dateColor, dateX, dateY, dateW, dateH, cGroup.cover.left ? DT_RC : DT_RC);
                    // Genre
                    var genre = $("$if2(%genre%,Other)", metadb);
                    var genreW = gr.CalcTextWidth(genre, dateFont) + 10;
                    var genreX = cGroup.cover.left ? dateX : cGroup.cover.x - genreW - 5;
                    var genreH = gr.CalcTextHeight("gropH", dateFont) + 2;
                    var genreY = dateY + dateH;
                    gr.GdiDrawText(genre, dateFont, dateColor, genreX, genreY, genreW, genreH, cGroup.cover.left ? DT_RC : DT_RC);
                }
                tempGroupNr = groupNr;
            } else {
                if (!ID.isOdd && alternateRowColor) {
                    gr.FillSolidRect(x, y + 1, w, h - 1, RGB(250, 250 ,250));
                }

				titleFont = titleFont;

				rowColorFocus = gColor.textNormal_2;

				titleColor = gColor.textNormal_1;
				countColor = gColor.textNormal_3;
				titleArtistColor = gColor.textNormal_2;



                if (selectedID == ID.nr) {

                    gr.FillSolidRect(x, y, w, h, gColor.selection);

                    titleColor = gColor.textSelected_1;
                    countColor = gColor.textSelected_3;
                    titleArtistColor = gColor.textSelected_2;


                }                    

				if (playingID == ID.nr) {
					titleColor = gColor.textHighlight_1;
					titleArtistColor = gColor.textHighlight_2;
					countColor = gColor.textHighlight_3;
				}
				
				//--->
                if (cList.focusItem && panelFocus && focusID == ID.nr) {
                    gr.DrawRect(x + 1, y + 1, w - 3, h - 3, 1, rowColorFocus);
                }
                if ((rowDrag || fileDrag) && r[i].state == 1) {
                    gr.DrawLine(x, y, x + w, y, 2, gColor.textNormal_2);
                }
                if (!dropped && linkToLastItem && !makeSelectionDrag && i == maxRows - 1) {
                    gr.DrawLine(x, y + h - 1, x + w, y + h - 1, 2, gColor.highlight);
                }
                //--->
                var testRect = 0;
                //	testRect && gr.FillSolidRect(x, y - 1, w - 5, h - 2, RGB(150, 150, 150));
                var playCount = $("[%play_count%]", metadb);
                var length = $("[%length%]", metadb);
                var lengthWidth = 50;
                var playCountWidth = 0;
                if (playCount != 0 && column.playcount) {
                    playCount = playCount + " |";
                    playCountWidth = gr.MeasureString("0000 |", playCountFont, 0, 0, 0, 0).Width;
                }
                var ratingW = 0;
                if (componentPlayCount && column.rating) ratingW = listX + listW - ratingBtnX + ratingBtnRightPad + 5;
                //---> QUEUE
                var queueContents = plman.GetPlaybackQueueContents().toArray();
                if (cList.queueItem && queueContents.length) {
                    var queueIndex = plman.FindPlaybackQueueItemIndex(metadb, activeList, ID.nr);
                    for (var q = 0; q != queueContents.length; q++) {
                        var handle = queueContents[q].Handle;
                        var indexCount = 0;
                        if (metadb.Compare(handle)) {
                            queueIndexes.push(queueIndex);
                            isPlaylistItemQueued[i] = true;
                            for (var qi = 0, l = queueIndexes.length; qi < l; qi++) {
                                if (queueIndex == queueIndexes[qi]) queueIndexCount[queueIndex] = ++indexCount;
                            }
                        }
                    }
                }
                if (isPlaylistItemQueued[i]) gr.FillSolidRect(x, y, w, h, rowColorQueued);
                var queue = cList.queueItem && queueContents.length && queueIndex != -1 ? "  [" + (queueIndex + 1) + "]" + (queueIndexCount[queueIndex] > 1 ? "*" + queueIndexCount[queueIndex] :"") :"";
                //---> LENGTH
                X = x + w - lengthWidth - ratingW;
                W = lengthWidth;
                gr.GdiDrawText(length, titleFont, titleColor, X, y, W, h, DT_CC);
                testRect && gr.DrawRect(X, y - 1, W, h, 1, RGBA(155, 155, 255, 250));
                //---> COUNT
                if (componentPlayCount && playCount != 0 && column.playcount) {
                    X = X - playCountWidth;
                    W = playCountWidth;
                    gr.GdiDrawText(playCount, playCountFont, countColor, X, y, W, h, DT_RC);
                    testRect && gr.DrawRect(X, y - 1, W, h, 1, RGBA(155, 155, 255, 250));
                }
                //---> TRACKNUMBER
                var gic = groupItemCounter++;
                var itemNr = gic < 10 ? "0" + gic :gic;
                var tracknumber = $("$if(%tracknumber%,%tracknumber%," + itemNr + ")", metadb);
                var tracknumberLength = gr.MeasureString(tracknumber, titleFont, 0, 0, 0, 0).Width + 20;
                gr.GdiDrawText(tracknumber, titleFont, titleColor, x + 5, y, tracknumberLength, h, DT_CC);
                testRect && gr.DrawRect(x + 5, y - 1, tracknumberLength, h, 1, RGBA(155, 155, 255, 250));
                //---> ARTIST
                W = X - x - tracknumberLength - 5;
                var artistW = 0;
                var artist = $("[$if($greater($len(%album artist%),1),$if($greater($len(%track artist%),1),%track artist%))]", metadb);
                if (!cGroup.show) artist = $("[%artist%]", metadb);
                if (column.artist && artist) {
                    artistW = W * .4;
                    var titleArtistFont = gdi.font(globalFontName , 12, 0);
                    gr.GdiDrawText(artist, titleArtistFont, titleArtistColor, x + tracknumberLength + W * .6 + 5, y, artistW - 5, h, DT_RC);
                    testRect && gr.DrawRect(x + W * .6 + tracknumberLength + 5, y - 1, artistW - 5, h, 1, RGBA(155, 155, 255, 250));
                    W -= artistW;
                }
                //---> TITLE
                var title = $("%title%", metadb);
                gr.GdiDrawText(title + queue, titleFont, titleColor, x + tracknumberLength + 5, y, W - 5, h, DT_LC);
                testRect && gr.DrawRect(x + tracknumberLength + 5, y - 1, W - 5, h, 1, RGBA(155, 155, 255, 250));
                //---> RATING
                var rating;
                if (useTagRating) {
                    var fileInfo = metadb.GetFileInfo();
                    rating = fileInfo.MetaValue(fileInfo.MetaFind("rating"), 0);
                } else {
                    rating = $("%rating%", metadb);
                }
                if (componentPlayCount && column.rating) {
                    for (var j = 0; j < 5; j++) {
                        var x = ratingBtnX + j * ratingBtnW - ratingBtnRightPad;
                        var w = ratingBtnW;
                        if (j < rating) gr.GdiDrawText("\u2605", ratingFontRated, titleColor, x, y - 1, w, h, DT_CC);
                        else gr.GdiDrawText("\u2219", ratingFontNotRated, titleColor, x, y - 1, w, h, DT_CC);
                    }
                    //eol
                    testRect && gr.DrawRect(ratingBtnX - ratingBtnRightPad, y - 1, ratingW - ratingBtnRightPad - 5, h, 1, RGBA(155, 155, 255, 155));
                }
            }
        }
        // eo_row_loop
        needsScrollbar && drawScrollbar(gr);
    } else {
        //eo ifListLength
        var text = GetText("Drag some tracks here") + "\n<--- 没有播放列表 --->";
        if (fb.PlaylistCount) {
            text = GetText("Playlist: ") + plman.GetPlaylistName(activeList) + GetText("\n<--- Empty --->");
        } 
        gr.GdiDrawText(text, gdi.font(globalFontName, 16, 0), gColor.textNormal_1, listX, listY, listW, listH, DT_CC);
    }
    //gr.DrawRect(listX, listY, listW-1, listH-1, 1, RGB(220, 220, 220)); // Test
    gr.FillSolidRect(0, listY - cList.rowH * 3, ww, cList.rowH * 3, gColor.background);
    gr.FillSolidRect(0, listY + listH, ww, cList.rowH * 3, gColor.background);
}

// =================================================== //
var mouseOnList = false;

function traceMouse(x, y, left, top, width, height) {
    return x > left && x < left + width && y > top && y < top + height;
}

function on_mouse_move(x, y, m) {
    if (uiHacks) {
        try {
            if (m && UIHacks && UIHacks.FrameStyle == 3 && !UIHacks.DisableSizing) {
                UIHacks.DisableSizing = true;
            }
        } catch (e) {
            fb.trace(e);
        }
    }
    B.move(x, y);
    S.move(x, y);
    V.move(x, y);
    PB.move(x, y);
    if (traceMouse(x, y, cList.x, cList.y, cList.w, cList.h)) mouseOnList = true; else mouseOnList = false;
    if (!listLength) return;
    rowMouseEventHandler(x, y, m);
    scrollbarMouseEventHandler(x, y);
}

// =================================================== //
var onMouseLbtnDown = false;

var g_drag = false;
function on_mouse_lbtn_down(x, y, m) {
	g_drag  = true;
    B.lbtnDown(x, y);
    S.lbtnDown(x, y);
    V.lbtnDown(x, y);
    PB.lbtnDown(x, y);
    onMouseLbtnDown = true;
    if (!listLength) return;
    rowMouseEventHandler(x, y, m);
    scrollbarMouseEventHandler(x, y);
}

// =================================================== //
function on_mouse_rbtn_down(x, y, m) {
    if (!listLength) return;
    rowMouseEventHandler(x, y, m);
}

// =================================================== //
function on_mouse_lbtn_dblclk(x, y, m) {
    if (!listLength && !safeMode) {
        try {
            WshShell.Run("explorer.exe /e,::{20D04FE0-3AEA-1069-A2D8-08002B30309D}");
        } catch (e) {
            fb.trace(e);
        }
    }
    B.lbtnDown(x, y);
    S.lbtnDown(x, y);
    V.lbtnDown(x, y);
    PB.lbtnDown(x, y);
    if (!listLength) return;
    rowMouseEventHandler(x, y, m);
    scrollbarMouseEventHandler(x, y);
}

// =================================================== //
function on_mouse_lbtn_up(x, y, m) {
	g_drag = false;
    onMouseLbtnDown = false;
    if (uiHacks) {
        try {
            if (UIHacks && UIHacks.FrameStyle == 3 && UIHacks.DisableSizing) {
                UIHacks.DisableSizing = false;
            }
        } catch (e) {
            fb.trace(e);
        }
    }
    B.lbtnUp(x, y);
    S.lbtnUp(x, y);
    V.lbtnUp(x, y);
    PB.lbtnUp(x, y);
    if (!listLength) return;
    rowMouseEventHandler(x, y, m);
    scrollbarMouseEventHandler(x, y);
}

// =================================================== //
function on_mouse_wheel(delta) {
    S.wheel(delta);
    V.wheel(delta);
    B.wheel(delta);
    if (!listLength) return;
    if (mouseOnList) {
        scrollbarMouseEventHandler(delta);
    }
}

// =================================================== //
function on_mouse_leave() {
    B.leave();
    S.leave();
    V.leave();
    PB.leave();
    mouseOnList = false;
    rowMouseEventHandler(0, 0);
    scrollbarMouseEventHandler(0, 0);
}

// =================================================== //
function on_playlist_switch() {
    initList();
    if (!showNowPlayingCalled && gCollapse.autoExpand && gCollapse.autoOnSwitch) collapseExpand("collapse");
    if (fb.ActivePlaylist == plman.PlayingPlaylist) showNowPlaying();
    showNowPlayingCalled = false;
    PB.btns[0].text = plman.GetPlaylistName(fb.ActivePlaylist);
    PB.btns[0].w = calcButtonWidth();
}

// =================================================== //
function on_playlists_changed() {
    if (fb.ActivePlaylist > fb.PlaylistCount - 1) {
        fb.ActivePlaylist = fb.PlaylistCount - 1;
    }
    window.SetProperty("system.List Step", "");
    initList();
    PB.btns[0].text = plman.GetPlaylistName(fb.ActivePlaylist);
    PB.btns[0].w = calcButtonWidth();
}

// =================================================== //
function on_playlist_items_reordered(playlist) {
    if (playlist != activeList) return;
    if (!collapsedOnStart) {
        initList();
    }
}

// =================================================== //
function on_playlist_items_removed(playlist) {
    if (playlist != activeList) return;
    initList();
}

// =================================================== //
function on_playlist_items_added(playlist) {
    if (playlist != activeList) return;
    if (dragOverID && !linkToLastItem) {
        if (dragOverID.isGroupHeader) {
            plman.MovePlaylistSelection(playlist, -(playlistItemCount - firstItem[dragOverID.groupNr]));
        } else {
            plman.MovePlaylistSelection(playlist, -(playlistItemCount - dragOverID.nr));
        }
    }
    dragOverID = undefined;
    fileDrag = false;
    initList();
    if (linkToLastItem) {
        onScrollStep("scrollToEnd");
        linkToLastItem = false;
        refreshScrollbar();
    }
    for (var i = 0; i != playlistItemCount; i++) {
        if (plman.IsPlaylistItemSelected(activeList, i)) {
            plman.SetPlaylistFocusItem(activeList, i);
            print(i);
            repaintList();
            break;
        }
    }
}

// =================================================== //
function on_playlist_items_selection_change() {
    repaintList();
    if (!mouseOverList) {
        //this code executes only if selection is made from external panel.
        if (plman.GetPlaylistSelectedItems(plman.ActivePlaylist).Count <= 1) {
            selectedIndexes = [];
            window.Repaint();
        }
    }
    selectedIndexes.length > 0 ? selectionLength = calculateSelectionLength() :selectionLength = $("[%length%]", fb.GetNowPlaying());
    if (selectionLength == "0:00") selectionLength = totalLength;
    window.RepaintRect(cList.x, cList.y - 28, cList.w, 28);
}

// =================================================== //
function on_metadb_changed(handles, fromhook) {
    repaintList();
}

// =================================================== //
function on_item_focus_change(playlist, from, to) {
    var CtrlKeyPressed = utils.IsKeyPressed(VK_CONTROL);
    var ShiftKeyPressed = utils.IsKeyPressed(VK_SHIFT);
    //-----------------------------------------------------//
    if (!mouseOverList) {
        //this code executes only if selection is made from external panel.
        if (!selectedIndexes.length && !ShiftKeyPressed && !CtrlKeyPressed) {
            selectedIndexes = [];
            selectedIndexes[0] = to;
        }
        if (CtrlKeyPressed) {
            if (!selectedIndexes.length) {
                selectedIndexes[0] = from;
            }
            for (var i = 0; i < selectedIndexes.length; i++) {
                if (selectedIndexes[i] == to) {
                    selectedIndexes.splice(i, 1);
                }
            }
            //eol
            if (plman.IsPlaylistItemSelected(fb.ActivePlaylist, to)) {
                selectedIndexes.push(to);
                selectedIndexes.sort(numericAscending);
            }
        }
        //Ctrl end
        if (ShiftKeyPressed) {
            var a = new Date();
            time = 0;
            var fromTo = [ from, to ].sort(numericAscending);
            for (i = fromTo[0], l = fromTo[1]; i <= l; i++) {
                selectedIndexes.push(i);
            }
            //eol i
            //find and remove duplicates.
            var tempSelectedIndexes = [];
            var obj = {};
            for (i = 0, l = selectedIndexes.length; i < l; i++) {
                obj[selectedIndexes[i]] = 0;
            }
            for (i in obj) {
                tempSelectedIndexes.push(i);
            }
            selectedIndexes = tempSelectedIndexes;
            // cleanup selectedIndexes
            tempSelectedIndexes = [];
            for (i = 0, l = selectedIndexes.length; i < l; i++) {
                if (plman.IsPlaylistItemSelected(fb.ActivePlaylist, selectedIndexes[i])) {
                    tempSelectedIndexes.push(selectedIndexes[i]);
                }
            }
            selectedIndexes = tempSelectedIndexes.sort(numericAscending);
            var b = new Date();
            time = "Initialized: " + (b - a) + " ms";
        }
    }
    //------------------------------------------------------------//
    if (CtrlKeyPressed || ShiftKeyPressed) repaintList();
    if (!ShiftKeyPressed) tempFocusItemIndex = undefined;
    if (!CtrlKeyPressed && !ShiftKeyPressed && plman.GetPlaylistSelectedItems(plman.ActivePlaylist).Count > 1) repaintList();
    focusGroupNr = -1;
    if (!onMouseLbtnDown && fb.ActivePlaylist == plman.PlayingPlaylist) displayFocusItem(to);
    for (var i = 0; i != maxRows; i++) {
        var ID = list[i + listStep[activeList]];
        var groupNr = ID.groupNr;
        if (isCollapsed[groupNr] && ID.isGroupHeader) {
            for (var item = firstItem[groupNr]; item <= lastItem[groupNr]; item++) {
                if (to == item) {
                    focusGroupNr = groupNr;
                    window.Repaint();
                    return;
                }
            }
        }
    }
}

// =================================================== //
function on_playback_time() {}

function on_playback_pause(state) {
    B.update();
    repaintList();
}

// =================================================== //
function on_playback_starting(cmd, is_paused) {
    B.update();
    repaintList();
}

// =================================================== //
function on_playback_edited(metadb) {
    repaintList();
}

// =================================================== //
function on_playback_queue_changed() {
    repaintList();
}

function on_playback_order_changed(new_order_index) {
    B.update();
}

// =================================================== //
var oldPlayingID;

function on_playback_new_track(metadb) {
    var playingID = plman.GetPlayingItemLocation().PlaylistItemIndex;
    var rating;
    if (useTagRating) {
        var fileInfo = metadb.GetFileInfo();
        rating = fileInfo.MetaValue(fileInfo.MetaFind("rating"), 0);
    } else {
        rating = $("%rating%", metadb);
    }
    repaintList();
    if (newTrackByClick) {
        newTrackByClick = false;
    } else {
        //----------------------->
        if (enableSkip && rating && rating < skipLessThan) {
            if (oldPlayingID < playingID) fb.Next(); else if (oldPlayingID == undefined || oldPlayingID > playingID) fb.Prev();
        }
        //----------------------->  
        var album = $("%artist%%album%%discnumber%", metadb);
        if (album != tempAlbumOnPlaybackNewTrack || fb.ActivePlaylist == plman.PlayingPlaylist) {
            tempAlbumOnPlaybackNewTrack = album;
            if (gCollapse.autoExpand) getPlayingGroupCollapseExpand();
        }
    }
    oldPlayingID = playingID;
}

// =================================================== //
function on_playback_stop(reason) {
    if (reason != 2) {
        S.repaint();
        B.update();
        repaintList();
    }
}

// =================================================== //
function on_focus(is_focused) {
    panelFocus = is_focused;
    repaintList();
}

// =================================================== //
function on_key_down(vkey) {
    var CtrlKeyPressed = utils.IsKeyPressed(VK_CONTROL);
    var ShiftKeyPressed = utils.IsKeyPressed(VK_SHIFT);
    var focusItemIndex = plman.GetPlaylistFocusItemIndex(activeList);
    if (!ShiftKeyPressed || tempFocusItemIndex == undefined) tempFocusItemIndex = focusItemIndex;
    keyPressed = true;
    switch (vkey) {
      case VK_UP:
        if (focusItemIndex == 0 && !listIsScrolledUp) displayFocusItem(0);
        if (focusItemIndex == 0) return;
        if (ShiftKeyPressed) {
            if (tempFocusItemIndex == focusItemIndex) {
                plman.ClearPlaylistSelection(activeList);
                plman.SetPlaylistSelectionSingle(activeList, focusItemIndex, true);
            }
            if (tempFocusItemIndex < focusItemIndex) {
                plman.SetPlaylistSelectionSingle(activeList, focusItemIndex, false);
            }
            plman.SetPlaylistSelectionSingle(activeList, focusItemIndex - 1, true);
        }
        if (!CtrlKeyPressed && !ShiftKeyPressed) {
            plman.ClearPlaylistSelection(activeList);
            plman.SetPlaylistSelectionSingle(activeList, focusItemIndex - 1, true);
        }
        plman.SetPlaylistFocusItem(activeList, focusItemIndex - 1);
        break;

      case VK_DOWN:
        if (focusItemIndex == playlistItemCount - 1 && !listIsScrolledDown) displayFocusItem(focusItemIndex);
        if (focusItemIndex == playlistItemCount - 1) return;
        if (ShiftKeyPressed) {
            if (tempFocusItemIndex == focusItemIndex) {
                plman.ClearPlaylistSelection(activeList);
                plman.SetPlaylistSelectionSingle(activeList, focusItemIndex, true);
            }
            if (tempFocusItemIndex > focusItemIndex) {
                plman.SetPlaylistSelectionSingle(activeList, focusItemIndex, false);
            }
            plman.SetPlaylistSelectionSingle(activeList, focusItemIndex + 1, true);
        }
        if (!CtrlKeyPressed && !ShiftKeyPressed) {
            plman.ClearPlaylistSelection(activeList);
            plman.SetPlaylistSelectionSingle(activeList, focusItemIndex + 1, true);
        }
        plman.SetPlaylistFocusItem(activeList, focusItemIndex + 1);
        break;

      case VK_PRIOR:
        var IDnr = 0;
        if (needsScrollbar) {
            fastScrollActive = true;
            onScrollStep(1, maxRows);
            // PAGE UP
            var ID = list[Math.floor(maxRows / 2) + listStep[activeList]];
            ID.isGroupHeader ? IDnr = firstItem[ID.groupNr] :IDnr = ID.nr;
        }
        plman.ClearPlaylistSelection(activeList);
        plman.SetPlaylistSelectionSingle(activeList, IDnr, true);
        plman.SetPlaylistFocusItem(activeList, IDnr);
        break;

      case VK_NEXT:
        var IDnr = playlistItemCount - 1;
        if (needsScrollbar) {
            fastScrollActive = true;
            onScrollStep(-1, maxRows);
            // PAGE DOWN
            var ID = list[Math.floor(maxRows / 2) + listStep[activeList]];
            ID.isGroupHeader ? IDnr = firstItem[ID.groupNr] :IDnr = ID.nr;
        }
        plman.ClearPlaylistSelection(activeList);
        plman.SetPlaylistSelectionSingle(activeList, IDnr, true);
        plman.SetPlaylistFocusItem(activeList, IDnr);
        break;

      case VK_DELETE:
        plman.RemovePlaylistSelection(activeList, crop = false);
        break;

      case VK_KEY_A:
        CtrlKeyPressed && selectAll();
        break;

      case VK_KEY_F:
        CtrlKeyPressed && fb.RunMainMenuCommand(GetText("Edit/Search"));
        ShiftKeyPressed && fb.RunMainMenuCommand(GetText("Library/Search"));
        break;

      case VK_RETURN:
        plman.ExecutePlaylistDefaultAction(activeList, focusItemIndex);
        newTrackByClick = true;
        break;

      case VK_HOME:
        plman.ClearPlaylistSelection(activeList);
        plman.SetPlaylistSelectionSingle(activeList, 0, true);
        plman.SetPlaylistFocusItem(activeList, 0);
        break;

      case VK_END:
        plman.ClearPlaylistSelection(activeList);
        plman.SetPlaylistSelectionSingle(activeList, playlistItemCount - 1, true);
        plman.SetPlaylistFocusItem(activeList, playlistItemCount - 1);
        break;

      case VK_KEY_N:
        if (CtrlKeyPressed) {
            fb.CreatePlaylist(fb.PlaylistCount, "");
            fb.ActivePlaylist = fb.PlaylistCount - 1;
        }
        break;

      case VK_KEY_O:
        if (ShiftKeyPressed) {
            fb.RunContextCommandWithMetadb(GetText("Open Containing Folder"), fb.GetFocusItem());
        }
        break;

      case VK_KEY_P:
        if (CtrlKeyPressed) {
            fb.RunMainMenuCommand(GetText("File/Preferences"));
        }
        break;

      case VK_KEY_M:
        if (CtrlKeyPressed) {
            fb.RunMainMenuCommand(GetText("View/Playlist Manager"));
        }
        break;

      case VK_KEY_Q:
        if (CtrlKeyPressed && ShiftKeyPressed) {
            plman.FlushPlaybackQueue();
            return;
        }
        if (CtrlKeyPressed) {
            plman.AddPlaylistItemToPlaybackQueue(activeList, focusItemIndex);
        } else if (ShiftKeyPressed) {
            var index = plman.FindPlaybackQueueItemIndex(fb.GetFocusItem(), activeList, focusItemIndex);
            plman.RemoveItemFromPlaybackQueue(index);
        }
        break;

      case VK_F5:
        initList();
        break;

      case VK_KEY_X:
        if (CtrlKeyPressed) {
            cut();
        }
        break;

      case VK_KEY_V:
        if (CtrlKeyPressed) {
            paste();
        }
        break;
    }
}

// =================================================== //
function on_key_up(vkey) {
    if (vkey == VK_PRIOR || vkey == VK_NEXT) {
        fastScrollActive = false;
        getAlbumArt();
    }
}

// =================================================== //
function on_size() {
    window.MinWidth = 370;
    ww = window.Width;
    wh = window.Height;
    if (ww <= 0 || wh <= 0) return;
    listOnSize();
    S.x = 0, S.h = 8, S.y = wh - 65, S.w = ww;
    V.w = 90, V.x = ww - V.w - 10, V.h = 5, V.y = wh - 65 + S.h + (65 - S.h - V.h) / 2;
    var ph = 65 - S.h;
    var py = wh - ph;
    var bw = bh = 24;
    //var by = py + (ph - bh)/2;
    var lrcW = ICON.Lyric[0].Width;
    B.btns = [ new Button("Prev", ICON.Prev, (ww - 42) / 2 - 32 - 10, py + (ph - 32) / 2, 32, 32, function() {
        fb.Prev();
    }), new Button("Play/Pause", fb.IsPlaying ? fb.IsPaused ? ICON.Play :ICON.Pause :ICON.Stop, (ww - 42) / 2, py + (ph - 42) / 2, 42, 42, function() {
        fb.PlayOrPause();
    }), new Button("Next", ICON.Next, (ww + 42) / 2 + 10, py + (ph - 32) / 2, 32, 32, function() {
        fb.Next();
    }), new Button("Mute", function() {
        return fb.Volume == -100 ? ICON.Muted :ICON.Mute;
    }(), V.x - bw - 2, py + (ph - bh) / 2, bw, bh, function() {
        fb.VolumeMute();
    }), new Button("Order", function() {
        var img = ICON.Default;
        if (fb.PlaybackOrder == 1) img = ICON.Repeat;
        if (fb.PlaybackOrder == 2) img = ICON.Repeat1;
        if (fb.PlaybackOrder == 3) img = ICON.Random;
        return img;
    }(), 10 + lrcW + 5, py + (ph - bh) / 2, bw, bh, function() {
        switch (fb.PlaybackOrder) {
          case 0:
            fb.PlaybackOrder = 1;
            this.img = ICON.Repeat;
            break;

          case 1:
            fb.PlaybackOrder = 2;
            this.img = ICON.Repeat1;
            break;

          case 2:
            fb.PlaybackOrder = 3;
            this.img = ICON.Random;
            break;

          default:
            this.img = ICON.Default;
            fb.PlaybackOrder = 0;
            break;
        }
        this.repaint();
    }), new Button("Setting", ICON.Setting, cList.x + cList.w - 21, (26 - 16) / 2, 16, 16, function() {
        SettingsPopupMenu(cList.x + cList.w - 21, cList.y);
    }), new Button("Lyric", checkESLyricDesktop() ? ICON.Lyric :ICON.Lyric2, 10, py + (ph - 21) / 2, lrcW, 21, function() {
        //	ESlyricMenu(10, py + (ph - 21)/2);
        fb.RunMainMenuCommand(GetText("View/ESLyric/显示桌面歌词"));
        this.img = !checkESLyricDesktop() ? ICON.Lyric :ICON.Lyric2;
        this.repaint();
    }) ];
    PB.btns[0] = new Button("Playlist", null, cList.x + 10, cList.y - 28 + (26 - 21) / 2, calcButtonWidth(), 21, function() {
        PlaylistMenu(cList.x + 10, cList.y);
    });
    PB.btns[0].text = plman.GetPlaylistName(fb.ActivePlaylist);
}

// =================================================== //
function on_drag_enter(action, x, y, mask) {
    dropped = false;
    if (listLength && y > r[maxRows - 1].y + cList.rowH && !linkToLastItem && (needsScrollbar && listIsScrolledDown || !needsScrollbar)) {
        linkToLastItem = true;
        r[maxRows - 1].repaint();
    } else linkToLastItem = false;
}

// =================================================== //
function on_drag_drop(action, x, y, mask) {
    var idx;
    if (!fb.PlaylistCount) {
        idx = fb.CreatePlaylist(0, "Default");
        fb.ActivePlaylist = 0;
    } else {
        plman.ClearPlaylistSelection(activeList);
        idx = activeList;
    }
    if (idx !== undefined) {
        action.ToPlaylist();
        action.Playlist = idx;
        action.ToSelect = true;
    }
    dropped = true;
    fileDrag = false;
    repaintList();
}

// =================================================== //
function on_drag_over(action, x, y, mask) {
    rowMouseEventHandler(x, y);
}

// =================================================== //
function on_drag_leave() {
    dragOverID = undefined;
    fileDrag = linkToLastItem = dropped = false;
    repaintList();
    if (scrollStepRepeatTimerStarted) {
        stopScrollRepeat();
    }
}

// ======================= //
function on_volume_change(val) {
    V.repaint();
    for (var i in B.btns) {
        if (B.btns[i].id == "Mute") {
            B.btns[i].img = fb.Volume == -100 ? ICON.Muted :ICON.Mute;
            B.btns[i].repaint();
        }
    }
}

// =================================================== //
function getAlbumArt() {
    if (!cGroup.cover.show) return;
    if (fastScrollActive) return;
    for (var i = 0; i != maxRows; i++) {
        var ID = list[i + listStep[activeList]];
        var groupNr = ID.groupNr;
        if (ID.isGroupHeader) {
            if (groupNr != tempGroupNrOnGetAlbumArt) {
                if (!artArray[groupNr] && artArray[groupNr] !== null) {
                    utils.GetAlbumArtAsync(window.ID, ID.metadb, AlbumArtId.front);
                }
            }
            tempGroupNrOnGetAlbumArt = groupNr;
        }
    }
}

// =================================================== //
var artSize = cGroup.rows * cList.rowH;

function on_get_album_art_done(metadb, art_id, image, image_path) {
    if (image && image.Height > artSize) {
        image = image.Resize(artSize, artSize, 0);
    }
    if (image) {
        image = image;
    } else {
        image = null;
    }
    var tempGroupNr = -1;
    for (var i = 0; i != maxRows; i++) {
        var ID = list[i + listStep[activeList]];
        var groupNr = ID.groupNr;
        if (ID.isGroupHeader && artArray[groupNr] !== null && groupNr != tempGroupNr && ID.metadb.Compare(metadb)) {
            artArray[groupNr] = image;
            tempGroupNr = groupNr;
            repaintList();
        }
    }
}

// =================================================== //
function selectAll() {
    for (var i = 0; i != playlistItemCount; i++) {
        selectedIndexes[i] = i;
    }
    plman.SetPlaylistSelection(fb.ActivePlaylist, selectedIndexes, true);
}

// =================================================== //
function resizeDone() {
    if (listLength) {
        getAlbumArt();
    }
}

// =================================================== //
function calculateSelectionLength() {
    var selectionLengthInSeconds = 0;
    var a = selectedIndexes[0];
    var b = selectedIndexes[selectedIndexes.length - 1];
    for (var item = a; item <= b; item++) {
        selectionLengthInSeconds += parseFloat(fb.TitleFormat("%length_seconds_fp%").EvalWithMetadb(getPlaylistItems.Item(item)));
    }
    return timeFormat(selectionLengthInSeconds);
}

// =================================================== //
function calculateGroupLength(a, b) {
    var groupLengthInSeconds = 0;
    for (var item = a; item <= b; item++) {
        groupLengthInSeconds += parseFloat(fb.TitleFormat("%length_seconds_fp%").EvalWithMetadb(getPlaylistItems.Item(item)));
    }
    //if(!caller())
    //return timeFormatListTotal(groupLengthInSeconds);
    //else
    return timeFormat(groupLengthInSeconds);
}

// =================================================== //
function repaintList() {
    var ex = 10;
    listW && window.RepaintRect(listX - ex, listY - ex, listW + ex * 2, listH + ex * 2);
}

// =================================================== //
function collapseExpand(arg, nowPlaying, selected) {
    collapsedOnStart = false;
    if (!playlistItemCount) return;
    var playingID = plman.GetPlayingItemLocation().PlaylistItemIndex;
    if (typeof arg == "number") {
        var thisGroupNr = arg;
        if (isCollapsed[thisGroupNr]) {
            for (var j = lastItemID[thisGroupNr]; j >= firstItemID[thisGroupNr]; j--) {
                list.splice(_firstItemID[thisGroupNr], 0, $list[j]);
            }
            isCollapsed[thisGroupNr] = false;
        } else if (selected == undefined) {
            list.splice(_firstItemID[thisGroupNr], itemCount[thisGroupNr]);
            isCollapsed[thisGroupNr] = true;
        }
    } else {
        for (var i = groupNr; i >= 0; i--) {
            if (i == selected) continue;
            if (arg == "collapse") {
                if (isCollapsed[i] && (i == nowPlaying || i == selected)) {
                    var thisGroupNr = nowPlaying;
                    for (var j = lastItemID[thisGroupNr]; j >= firstItemID[thisGroupNr]; j--) {
                        list.splice(_firstItemID[thisGroupNr], 0, $list[j]);
                    }
                    isCollapsed[thisGroupNr] = false;
                }
                if (i == nowPlaying) continue;
                if (!isCollapsed[i]) {
                    list.splice(_firstItemID[i], itemCount[i]);
                    isCollapsed[i] = true;
                }
            } else if (arg == "expand") {
                list = $list.slice(0);
                for (var i = groupNr; i >= 0; i--) {
                    isCollapsed = [];
                }
            }
        }
    }
    //---> update _firstItemID
    for (var i = 0; list[i]; i++) {
        var ID = list[i];
        if (ID.isGroupHeader && ID.rowNr == cGroup.rows) {
            _firstItemID[ID.groupNr] = i + 1;
        }
    }
    //eol
    listLength = list.length;
    listOnSize();
    window.Repaint();
    if (nowPlaying != undefined) {
        //when outo or collapse all but now playing is selected scrolls now playing album to the top
        for (var j = 0; j < listLength; j++) {
            var ID = list[j];
            if (ID.isGroupHeader && ID.groupNr == nowPlaying) {
                var step = j;
                if (step < 0) step = 0;
                listStep[activeList] = Math.min(listLength - maxRows, step);
                window.SetProperty("system.List Step", listStep.toString());
                break;
            }
        }
    }
    listOnSize();
    onScrollStep(0);
    //check and fix false scrolled up or down var if needed
    window.Repaint();
}

// =================================================== //
function getPlayingGroupCollapseExpand() {
    if (!fb.IsPlaying || fb.ActivePlaylist != fb.PlayingPlaylist) return;
    var playingItemLocation = plman.GetPlayingItemLocation();
    var isValid;
    if (playingItemLocation.IsValid) {
        collapseExpand("collapse", getPlayingGroupNr());
    }
    var counter = 0;
    if (!playingItemLocation.IsValid) {
        var timer = window.SetInterval(function() {
            // timer for getting delayed item location info when skip track selected 
            isValid = plman.GetPlayingItemLocation().IsValid;
            counter++;
            if (isValid || counter == 100 || !fb.IsPlaying) {
                window.ClearInterval(timer);
                if (fb.IsPlaying) {
                    collapseExpand("collapse", getPlayingGroupNr());
                }
            }
        }, 100);
    }
    function getPlayingGroupNr() {
        var playingIndex = -1;
        if (plman.PlayingPlaylist == activeList) {
            playingIndex = plman.GetPlayingItemLocation().PlaylistItemIndex;
        }
        for (var g = 0; g <= groupNr; g++) {
            for (var i = firstItem[g]; i <= lastItem[g]; i++) {
                if (playingIndex == i) {
                    return g;
                }
            }
        }
    }
}

// =================================================== //
function isGroupSelected(groupNr, playingID) {
    // searches only currently visible groups
    var selectedCount = 0;
    nowPlayingGroupNr = -1;
    for (var item = firstItem[groupNr]; item <= lastItem[groupNr]; item++) {
        if (plman.IsPlaylistItemSelected(activeList, item)) selectedCount++;
        if (playingID == item) nowPlayingGroupNr = groupNr;
    }
    if (selectedCount == lastItem[groupNr] + 1 - firstItem[groupNr]) return true; else return false;
}

// =================================================== //
function displayFocusItem(focusID) {
    if (listLength <= maxRows) return;
    var visibleGroupRows = [];
    var tempGroupNr = 0;
    var groupRowCount = 0;
    for (var i = 0; i != maxRows; i++) {
        var ID = list[i + listStep[activeList]];
        if (isCollapsed.length && ID.isGroupHeader) {
            var groupNr = ID.groupNr;
            groupNr == tempGroupNr ? groupRowCount++ :groupRowCount = 1;
            visibleGroupRows[groupNr] = groupRowCount;
        }
        tempGroupNr = groupNr;
    }
    for (var i = 0; i != maxRows; i++) {
        var ID = list[i + listStep[activeList]];
        var groupNr = ID.groupNr;
        if (isCollapsed[groupNr] && ID.isGroupHeader) {
            for (var item = firstItem[groupNr]; item <= lastItem[groupNr]; item++) {
                if (focusID == item && visibleGroupRows[groupNr] == cGroup.rows) {
                    return;
                }
            }
        } else if (ID && focusID == ID.nr) return;
    }
    var IDnr;
    for (var i = 0; i < listLength; i++) {
        var ID = list[i];
        var groupNr = ID.groupNr;
        if (isCollapsed.length && ID.isGroupHeader && ID.rowNr == cGroup.rows) {
            for (var item = firstItem[groupNr]; item <= lastItem[groupNr]; item++) {
                if (focusID == item && isCollapsed[groupNr]) {
                    IDnr = firstItem[groupNr];
                }
            }
        }
        if (IDnr != undefined || ID.nr == focusID) {
            var step = i - Math.floor(maxRows / 2);
            if (step < 0) step = 0;
            listStep[activeList] = step;
            window.SetProperty("system.List Step", listStep.toString());
            listOnSize();
            window.Repaint();
            listIsScrolledUp = listStep[activeList] == 0;
            listIsScrolledDown = list[maxRows - 1 + listStep[activeList]] == list[listLength - 1];
            return;
        }
    }
}

// =================================================== //
function showNowPlaying() {
    if (!fb.Isplaying) return;
    var getPlayingItemLocation = plman.GetPlayingItemLocation();
    if (!getPlayingItemLocation.IsValid) return;
    if (fb.ActivePlaylist != plman.PlayingPlaylist) {
        fb.ActivePlaylist = plman.PlayingPlaylist;
        initList();
    }
    if (gCollapse.autoExpand && gCollapse.autoOnSwitch) collapseExpand("collapse");
    var playingID = getPlayingItemLocation.PlaylistItemIndex;
    plman.ClearPlaylistSelection(activeList);
    plman.SetPlaylistSelectionSingle(activeList, playingID, true);
    plman.SetPlaylistFocusItem(activeList, playingID);
    for (var i = 0; i < listLength; i++) {
        var ID = list[i];
        var groupNr = ID.groupNr;
        if (isCollapsed.length && ID.isGroupHeader && ID.rowNr == cGroup.rows) {
            for (var item = firstItem[groupNr]; item <= lastItem[groupNr]; item++) {
                if (playingID == item && isCollapsed[groupNr]) collapseExpand(groupNr);
            }
        }
        if (ID.nr == playingID) {
            var step = i - Math.floor(maxRows / 2);
            if (step < 0) step = 0;
            listStep[activeList] = step;
            window.SetProperty("system.List Step", listStep.toString());
            on_size();
            window.Repaint();
            break;
        }
    }
    // eol
    if (fb.ActivePlaylist != plman.PlayingPlaylist) showNowPlayingCalled = true;
}

// =================================================== //
(function initList() {
    //print(caller());
    tempAlbumOnPlaybackNewTrack = undefined;
    tempGroupNrOnGetAlbumArt = -1;
    activeList = plman.ActivePlaylist;
    playlistCount = plman.PlaylistCount;
    playlistItemCount = plman.PlaylistItemCount(activeList);
    getPlaylistItems = plman.GetPlaylistItems(activeList);
    selectedItemCount = plman.GetPlaylistSelectedItems(activeList).Count;
    listIsScrolledUp = listIsScrolledDown = false;
    list = [];
    $list = [];
    firstItem = [];
    firstItemID = [];
    _firstItemID = [];
    lastItem = [];
    lastItemID = [];
    itemCount = [];
    isCollapsed = [];
    selectedIndexes = [];
    queueIndexes = [];
    artArray = [];
    groupNr = 0;
    totalGroups = 0;
    var a, b, metadb;
    var id = 0;
    var oddItem = 0;
    var from = to = 0;
    var initTest = 0;
    if (initTest) from = new Date();
    for (var i = 0; i != playlistItemCount; i++) {
        metadb = getPlaylistItems.Item(i);
        a = fb.TitleFormat(cGroup.format).EvalWithMetadb(metadb);
        if (a != b && cGroup.show) {
            for (var groupHeaderRow = 1; groupHeaderRow <= cGroup.rows; groupHeaderRow++) {
                group = {
                    groupNr:groupNr,
                    // first group nr = 0
                    metadb:metadb,
                    isGroupHeader:true,
                    rowNr:groupHeaderRow
                };
                firstItem[groupNr] = i;
                $list[id] = group;
                id++;
                if (groupHeaderRow == cGroup.rows) {
                    firstItemID[groupNr] = id;
                }
            }
            if (groupNr > 0) {
                var gNr = groupNr - 1;
                lastItem[gNr] = i - 1;
                lastItemID[gNr] = id - cGroup.rows - 1;
                itemCount[gNr] = lastItem[groupNr - 1] - firstItem[groupNr - 1] + 1;
            }
            groupNr++;
            b = a;
            if (i % 2 == 0) oddItem = 0;
            if (i % 2 == 1) oddItem = 1;
        }
        var item = {
            metadb:metadb,
            nr:i,
            isOdd:i % 2 == oddItem
        };
        $list[id] = item;
        id++;
        if (selectedItemCount && plman.IsPlaylistItemSelected(activeList, i)) {
            selectedIndexes.push(i);
        }
    }
    //eol
    if (initTest) {
        to = new Date();
        print("Initialized: " + (to - from) + " ms");
    }
    groupNr--;
    totalGroups = groupNr;
    gNr = groupNr;
    lastItem[gNr] = playlistItemCount - 1;
    lastItemID[gNr] = id - 1;
    itemCount[gNr] = lastItem[gNr] - firstItem[gNr] + 1;
    list = $list.slice(0);
    _firstItemID = firstItemID.slice(0);
    listLength = list.length;
    (listOnSize = function() {
        if (ww <= 0 || wh <= 0) return;
        isResizingDone(ww, wh);
        cList.x = 0;
        cList.y = 28;
        cList.w = ww - cList.x;
        cList.h = wh - cList.y - 65 - 2;
        listX = cList.x + cList.margin.l;
        listY = cList.y + cList.margin.t;
        listH = Math.max(0, cList.h - cList.margin.t - cList.margin.b);
        listW = Math.max(100, cList.w - cList.margin.l - cList.margin.r);
        maxRows = Math.max(0, Math.min(listLength, Math.floor(listH / cList.rowH)));
        if (listStep[activeList] + maxRows > listLength && listLength >= maxRows) {
            listStep[activeList] += listLength - (listStep[activeList] + maxRows);
            window.SetProperty("system.List Step", listStep.toString());
        }
        needsScrollbar = listLength > maxRows;
        if (needsScrollbar && showScrollbar) {
            listW = listW - scrollbarWidth;
        }
        //---> Row Object
        r = [];
        b = [];
        ratingBtnW = 14;
        ratingBtnX = listX + listW - ratingBtnW * 5;
        if (listLength) {
            for (var i = 0; i != maxRows; i++) {
                var rowY = listY + i * cList.rowH;
                r[i] = new Row(listX, rowY, listW, cList.rowH);
            }
            (initRowButton = function() {
                ratingBtnRightPad = 10;
                for (var i = 0; i != maxRows; i++) {
                    r[i].b = [];
                    for (var j = 0; j < 5; j++) {
                        var x = ratingBtnX + j * ratingBtnW - ratingBtnRightPad;
                        var y = r[i].y + cList.rowH / 2 - ratingBtnW / 2 - 1;
                        r[i].b[j] = new RowButton(x, y, ratingBtnW, ratingBtnW);
                    }
                }
            })();
        }
        //---> Scrollbar
        scrollbarX = listX + listW;
        scrollbarY = listY;
        scrollbarHeight = listH;
        scrollbarBottom = wh - listY - listH;
        refreshScrollbar();
        //---> 
        if (needsScrollbar) {
            createScrollbarThumbImages();
        }
    })();
    //---> init list step
    listStep = [];
    var step = [];
    var s = window.GetProperty("system.List Step", "");
    s.indexOf(",") != -1 ? step = s.split(",") :step[0] = Math.max(0, s);
    for (var i = 0; i < playlistCount; i++) {
        listStep[i] = step[i] == undefined ? 0 :isNaN(step[i]) ? 0 :Math.max(0, step[i]);
    }
    window.SetProperty("system.List Step", listStep.toString());
    //--->
    window.Repaint();
    if (needsScrollbar) {
        repaintScrollbar();
    }
    plman.SetActivePlaylistContext();
    totalLength = calculateGroupLength(0, playlistItemCount - 1);
    if (selectedIndexes) selectionLength = calculateSelectionLength();
})();

//eoInitList
// =================================================== //
var rowDrag = fileDrag = linkToLastItem = doubleClicked = mouseOverList = newTrackByClick = actionNotAllowed = clickedOnSelectedItem = selectWithDrag = false;

var oldRowBtn, oldRowNr, oldRow, oldID, selectedIndex, dragOverID;

function rowMouseEventHandler(x, y, m) {
    var CtrlKeyPressed = utils.IsKeyPressed(VK_CONTROL);
    var ShiftKeyPressed = utils.IsKeyPressed(VK_SHIFT);
    if (thumbDown || !listLength) return;
    var c = caller();
    var thisID, thisRow, thisRowNr, thisRowBtn;
    var thisRowBtnNr = 0;
    mouseOverList = false;
    mouseInRatingBtn = false;
    for (var i = 0; r[i]; i++) {
        if (r[i].mouseInThisRow(x, y)) {
            mouseOverList = true;
            thisRow = r[i];
            thisID = list[i + listStep[activeList]];
            thisRowNr = i;
            //->
            if (column.rating && !thisID.isGroupHeader) {
                var b = r[i].b;
                for (var j = 0; j < 5; j++) {
                    if (b[j].mouseInThisRowButton(x, y)) {
                        thisRowBtn = b[j];
                        thisRowBtnNr = j;
                        mouseInRatingBtn = true;
                    }
                }
            }
        }
    }
    if (c == "on_drag_over") {
        fileDrag = true;
        if (thisID) {
            dragOverID = thisID;
        }
        c = "on_mouse_move";
    }
    switch (c) {
      case "on_mouse_move":
        if (thisRow !== undefined) {
            mouseOverList = true;
            linkToLastItem = false;
        }
        if (selectedIndexes.length && !doubleClicked && m == 1 && oldRow && thisRow != oldRow) {
            if (fb.IsAutoPlaylist(activeList) && !actionNotAllowed) {
                window.SetCursor(IDC_NO);
                actionNotAllowed = true;
            }
            dropped = false;
            if (!actionNotAllowed && clickedOnSelectedItem) rowDrag = true;
            if (!clickedOnSelectedItem) selectWithDrag = true;
        }
        if ((fileDrag || rowDrag || makeSelectionDrag) && thisID && thisID.isGroupHeader && isCollapsed[thisID.groupNr]) {
            collapseExpand(thisID.groupNr);
        }
        //->
        if (oldRow && oldRow != thisRow) {
            if (!clickedOnSelectedItem && m == 1 && thisID && thisID.isGroupHeader) {
                var firstIDnr = firstItem[thisID.groupNr];
                if (oldID.nr < firstIDnr && selectedIndex > oldID.nr || oldID.nr == firstIDnr && selectedIndex < oldID.nr) {
                    plman.SetPlaylistSelectionSingle(activeList, oldID.nr, false);
                }
            }
            oldRow.changeState(0);
        }
        if (thisRow && thisRow != oldRow) {
            thisRow.changeState(1);
            if (rowDrag || fileDrag || makeSelectionDrag) {
                if (thisRowNr == 0 && !listIsScrolledUp) {
                    startScrollRepeat("dragUp");
                }
                if (thisRowNr == maxRows - 1 && !listIsScrolledDown) {
                    startScrollRepeat("dragDown");
                }
            }
            if (!clickedOnSelectedItem && m == 1) {
                makeSelectionDrag = true;
                selectedIndexes = [];
                if (thisID && !thisID.isGroupHeader) {
                    for (var i = selectedIndex; i <= thisID.nr; i++) {
                        selectedIndexes.push(i);
                    }
                    for (var i = selectedIndex; i >= thisID.nr; i--) {
                        selectedIndexes.push(i);
                        selectedIndexes.sort(numericAscending);
                    }
                    if (selectedIndexes[0] == selectedIndexes[1]) selectedIndexes.length = 1;
                    if (selectedIndexes[0] != undefined && !thisID.isGroupHeader) {
                        plman.ClearPlaylistSelection(activeList);
                        plman.SetPlaylistSelection(fb.ActivePlaylist, selectedIndexes, true);
                    }
                }
            }
        }
        //->
        if ((rowDrag || fileDrag) && listLength && y > r[maxRows - 1].y + cList.rowH && !linkToLastItem && (needsScrollbar && listIsScrolledDown || !needsScrollbar)) {
            linkToLastItem = true;
            r[maxRows - 1].repaint();
        }
        if ((rowDrag || fileDrag || makeSelectionDrag) && thisID && thisRowNr != 0 && thisRowNr != maxRows - 1) {
            stopScrollRepeat();
        }
        oldID = thisID;
        oldRow = thisRow;
        //->
        break;

      case "on_mouse_lbtn_down":
        if (doubleClicked) return;
        if (!thisID) {
            if (!mouseInScrollbar) {
                selectedIndexes = [];
                plman.ClearPlaylistSelection(activeList);
            }
            return;
        }
        var thisIndex = thisID.nr;
        if (thisID.isGroupHeader) {
            if (!CtrlKeyPressed) selectedIndexes = [];
            var thisGroupNr = thisID.groupNr;
            for (var id = firstItem[thisGroupNr]; id <= lastItem[thisGroupNr]; id++) {
                selectedIndexes.push(id);
            }
            plman.ClearPlaylistSelection(activeList);
            plman.SetPlaylistSelection(fb.ActivePlaylist, selectedIndexes, true);
            plman.SetPlaylistFocusItem(activeList, firstItem[thisID.groupNr]);
            clickedOnSelectedItem = true;
            if (gCollapse.autoExpand) {
                collapseExpand("collapse", undefined, thisID.groupNr);
                collapseExpand(thisID.groupNr, undefined, thisID.groupNr);
                doubleClicked = true;
            }
        } else {
            IDIsSelected = plman.IsPlaylistItemSelected(activeList, thisIndex);
            IDIsSelected ? clickedOnSelectedItem = true :clickedOnSelectedItem = false;
            if (!CtrlKeyPressed && !ShiftKeyPressed && !IDIsSelected) {
                selectedIndexes = [];
                plman.ClearPlaylistSelection(activeList);
            }
            if (ShiftKeyPressed) {
                selectedIndexes = [];
                var a = b = 0;
                if (selectedIndex == undefined) selectedIndex = plman.GetPlaylistFocusItemIndex(activeList);
                if (selectedIndex < thisIndex) {
                    a = selectedIndex;
                    b = thisIndex;
                } else {
                    a = thisIndex;
                    b = selectedIndex;
                }
                for (var id = a; id <= b; id++) {
                    selectedIndexes.push(id);
                }
                plman.ClearPlaylistSelection(activeList);
                plman.SetPlaylistSelection(activeList, selectedIndexes, true);
            } else {
                plman.SetPlaylistSelectionSingle(activeList, thisIndex, true);
                if (utils.IsKeyPressed(VK_KEY_Q)) plman.AddPlaylistItemToPlaybackQueue(activeList, thisIndex); else if (utils.IsKeyPressed(VK_KEY_Z)) {
                    var index = plman.FindPlaybackQueueItemIndex(thisID.metadb, activeList, thisIndex);
                    plman.RemoveItemFromPlaybackQueue(index);
                }
            }
            if (!IDIsSelected && !CtrlKeyPressed && !ShiftKeyPressed) {
                selectedIndexes = [];
                selectedIndexes[0] = thisIndex;
            }
            if (CtrlKeyPressed) {
                if (!IDIsSelected) selectedIndexes.push(thisIndex);
                plman.SetPlaylistSelectionSingle(activeList, thisIndex, IDIsSelected ? false :true);
                if (IDIsSelected) {
                    for (var i = 0; i < selectedIndexes.length; i++) {
                        if (selectedIndexes[i] == thisIndex) selectedIndexes.splice(i, 1);
                    }
                }
            }
            plman.SetPlaylistFocusItem(activeList, thisIndex);
            if (selectedIndex == undefined) selectedIndex = thisIndex;
            if (selectedIndexes.length > 1) selectedIndexes.sort(numericAscending);
        }
        //eof isGroup else
        break;

      case "on_mouse_rbtn_down":
        if (!thisID) {
            if (!mouseInScrollbar) {
                selectedIndexes = [];
                plman.ClearPlaylistSelection(activeList);
            }
            return;
        }
        var thisIndex = thisID.nr;
        if (thisID.isGroupHeader) {
            plman.SetPlaylistFocusItem(activeList, firstItem[thisID.groupNr]);
            if (isGroupSelected(thisID.groupNr)) return;
            selectedIndexes = [];
            var thisGroupNr = thisID.groupNr;
            for (var id = firstItem[thisGroupNr]; id <= lastItem[thisGroupNr]; id++) {
                selectedIndexes.push(id);
            }
            plman.ClearPlaylistSelection(activeList);
            plman.SetPlaylistSelection(fb.ActivePlaylist, selectedIndexes, true);
        } else {
            var IDIsSelected = plman.IsPlaylistItemSelected(activeList, thisIndex);
            if (IDIsSelected) {
                plman.SetPlaylistFocusItem(activeList, thisIndex);
                repaintList();
            } else {
                selectedIndexes = [];
                plman.ClearPlaylistSelection(activeList);
                selectedIndexes[0] = thisIndex;
                plman.SetPlaylistFocusItem(activeList, thisIndex);
                plman.SetPlaylistSelectionSingle(activeList, thisIndex, true);
            }
        }
        break;

      case "on_mouse_lbtn_dblclk":
        if (!thisID) return;
        doubleClicked = true;
        //---> Set rating
        if (mouseInRatingBtn) {
            var metadb = thisID.metadb;
            if (useTagRating) {
                var fileInfo = metadb.GetFileInfo();
                var currentRating = fileInfo.MetaValue(fileInfo.MetaFind("rating"), 0);
            } else {
                var currentRating = $("%rating%", metadb);
            }
            var rate = thisRowBtnNr + 1;
            if (useTagRating) {
                if (!metadb.RawPath.indexOf("http://") == 0) {
                    // currentRating == 1 && rate == 1 ? metadb.UpdateFileInfoSimple("RATING", undefined) :metadb.UpdateFileInfoSimple("RATING", rate);
					currentRating == rate ? metadb.UpdateFileInfoSimple("RATING", undefined) : metadb.UpdateFileInfoSimple("RATING", rate);
                }
            } else {
                //currentRating == 1 && rate == 1 ? fb.RunContextCommandWithMetadb("<not set>", metadb) :fb.RunContextCommandWithMetadb("Rating/" + rate, metadb);
				currentRating == rate ? fb.RunContextCommandWithMetadb("<not set>", metadb) : fb.RunContextCommandWithMetadb("Rating/" + rate, metadb);
            }
            return;
        }
        if (thisID.isGroupHeader) {
            collapseExpand(thisID.groupNr);
        } else if (!utils.IsKeyPressed(VK_KEY_Q) && !utils.IsKeyPressed(VK_KEY_Z)) {
            plman.ExecutePlaylistDefaultAction(activeList, thisID.nr);
            newTrackByClick = true;
        }
        break;

      case "on_mouse_lbtn_up":
        if (doubleClicked) {
            doubleClicked = false;
            return;
        }
        if (thisRow) {
            thisRow.changeState(0);
        }
        if (thisID && thisID.nr !== undefined) {
            if (rowDrag && thisID) {
                var selectedItems = plman.GetPlaylistSelectedItems(activeList);
                var selectedItemCount = selectedItems.Count;
                var focusIndex = plman.GetPlaylistFocusItemIndex(activeList);
                var focusHandle = plman.GetPlaylistFocusItemHandle(false);
                var thisIndex = thisID.nr;
                var add = 0;
                if (selectedItemCount > 1) {
                    //--->
                    var temp;
                    var odd = false;
                    for (var i = 0; i < playlistItemCount; i++) {
                        if (plman.IsPlaylistItemSelected(activeList, i)) {
                            if (temp != undefined && i - 1 != temp) {
                                odd = true;
                                break;
                            }
                            temp = i;
                        }
                    }
                    //--->
                    if (odd) {
                        for (var i = 0; i < selectedIndexes.length; i++) {
                            if (selectedIndexes[i] < thisIndex) {
                                add = i + 1;
                            }
                        }
                        plman.MovePlaylistSelection(activeList, -listLength);
                    } else {
                        for (var i = 0; i < selectedIndexes.length; i++) {
                            if (selectedIndexes[i] == focusIndex) {
                                add = i;
                                break;
                            }
                        }
                    }
                }
                if (focusIndex > thisIndex) {
                    selectedItemCount > 1 ? odd ? delta = thisIndex - add :delta = -(focusIndex - thisIndex - add) :delta = -(focusIndex - thisIndex);
                } else {
                    selectedItemCount > 1 ? odd ? delta = thisIndex - add :delta = thisIndex - focusIndex - (selectedItemCount - add) :delta = thisIndex - 1 - focusIndex;
                }
                if (!odd && plman.IsPlaylistItemSelected(plman.ActivePlaylist, thisIndex)) delta = 0;
                plman.MovePlaylistSelection(activeList, delta);
            }
            //row drag end
            if (!CtrlKeyPressed && !ShiftKeyPressed && !rowDrag && !selectWithDrag) {
                if (plman.GetPlaylistSelectedItems(activeList).Count > 1) {
                    selectedIndexes = [];
                    selectedIndexes[0] = thisID.nr;
                    plman.ClearPlaylistSelection(activeList);
                    plman.SetPlaylistSelectionSingle(activeList, thisID.nr, true);
                }
            }
        }
        if (linkToLastItem) {
            plman.MovePlaylistSelection(activeList, listLength - plman.GetPlaylistSelectedItems(activeList).Count);
            r[maxRows - 1].repaint();
        }
        if (!ShiftKeyPressed) selectedIndex = undefined;
        rowDrag = fileDrag = makeSelectionDrag = linkToLastItem = selectWithDrag = false;
        //--->
        plman.SetActivePlaylistContext();
        if (actionNotAllowed) {
            window.SetCursor(IDC_ARROW);
            actionNotAllowed = false;
        }
        break;

      case "on_mouse_leave":
        for (var i = 0; r[i]; i++) {
            if (r[i].state != 0) {
                if (r[i].b) {
                    for (var j = 0; r[i].b[j]; j++) {
                        r[i].b[j].changeState(0);
                    }
                }
                r[i].changeState(0);
            }
        }
        selectedIndex = oldRow = thisRow = undefined;
        break;
    }
}

// =================================================== //
function Row(x, y, w, h, b) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.b = b;
    this.state = 0;
}

// =================================================== //
Row.prototype.mouseInThisRow = function(x, y) {
    return this.x <= x && x <= this.x + this.w && this.y <= y && y <= this.y + this.h;
};

// =================================================== //
Row.prototype.repaint = function() {
    window.RepaintRect(this.x - 5, this.y - 5, this.w + 10, this.h + 10);
};

// =================================================== //
Row.prototype.changeState = function(state) {
    this.state = state;
    if (rowDrag || fileDrag) {
        this.repaint();
    }
};

// =================================================== //
function RowButton(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.state = 0;
}

// =================================================== //
RowButton.prototype.mouseInThisRowButton = function(x, y) {
    return this.x <= x && x <= this.x + this.w && this.y <= y && y <= this.y + this.h;
};

// =================================================== //
RowButton.prototype.repaint = function() {
    window.RepaintRect(this.x, this.y, this.w, this.h);
};

// =================================================== //
RowButton.prototype.changeState = function(state) {
    this.state = state;
    this.repaint();
};

// =============================================== //
var cuttedItems;

var cuttedItemsCount = 0;

function cut() {
    cuttedItems = plman.GetPlaylistSelectedItems(activeList);
    cuttedItemsCount = cuttedItems.Count;
    plman.RemovePlaylistSelection(activeList);
}

// =============================================== //
function paste() {
    if (cuttedItemsCount) {
        if (plman.GetPlaylistSelectedItems(plman.ActivePlaylist).Count > 0) {
            plman.ClearPlaylistSelection(activeList);
            plman.InsertPlaylistItems(activeList, plman.GetPlaylistFocusItemIndex(activeList), cuttedItems, true);
        } else {
            plman.InsertPlaylistItems(activeList, playlistItemCount, cuttedItems, true);
        }
        cuttedItemsCount = 0;
    }
}

// =============================================== //
function SettingsPopupMenu(x, y) {
    var menu = window.CreatePopupMenu();
    var ce = window.CreatePopupMenu();
    var prop = window.CreatePopupMenu();
    var skip = window.CreatePopupMenu();
    var art = window.CreatePopupMenu();
    var group = window.CreatePopupMenu();
    var colum = window.CreatePopupMenu();
    var sort = window.CreatePopupMenu();
    //---> collapse/expand
    //if (cGroup.show) {
        ce.AppendMenuItem(MF_STRING, 1, GetText("Auto"));
        ce.AppendMenuItem(MF_STRING, 2, GetText("Collapse on start"));
        ce.AppendMenuItem(MF_STRING, 3, GetText("Collapse on playlist switch"));
        ce.CheckMenuItem(1, gCollapse.autoExpand);
        ce.CheckMenuItem(2, gCollapse.onStart);
        ce.CheckMenuItem(3, gCollapse.autoOnSwitch);
        ce.AppendTo(menu, (cGroup.show ? MF_STRING : MF_GRAYED)| MF_POPUP, GetText("Collapse/Expand"));
    //}
    //---> skip
    skip.AppendMenuItem(MF_STRING, 10, GetText("Enable"));
    skip.CheckMenuItem(10, enableSkip);
	skip.AppendMenuSeparator();
    skip.AppendMenuItem(MF_STRING, 28, GetText("Use tag rating"));
    skip.CheckMenuItem(28, useTagRating);
    skip.AppendMenuSeparator();
    skip.AppendMenuItem(enableSkip ? MF_STRING :MF_GRAYED, 11, GetText("Rated less than 2"));
    skip.AppendMenuItem(enableSkip ? MF_STRING :MF_GRAYED, 12, GetText("Rated less than 3"));
    skip.AppendMenuItem(enableSkip ? MF_STRING :MF_GRAYED, 13, GetText("Rated less than 4"));
    skip.AppendMenuItem(enableSkip ? MF_STRING :MF_GRAYED, 14, GetText("Rated less than 5"));
    skip.AppendTo(menu, MF_STRING | MF_POPUP, GetText("Skip"));
    skip.CheckMenuRadioItem(11, 14, 9 + skipLessThan);
    //---> properties

    //if (cGroup.show) {
        art.AppendMenuItem(MF_STRING, 21, GetText("Show"));
        art.CheckMenuItem(21, cGroup.cover.show);
        art.AppendMenuItem(MF_STRING, 22, GetText("Auto"));
        art.CheckMenuItem(22, cGroup.cover.auto);
        art.AppendTo(prop, (cGroup.show ? MF_STRING : MF_GRAYED) | MF_POPUP, GetText("Album art"));
		prop.AppendMenuSeparator();
    //}
    prop.AppendMenuItem(MF_STRING, 23, GetText("Show focus item"));
    prop.CheckMenuItem(23, cList.focusItem);
    prop.AppendMenuItem(MF_STRING, 24, GetText("Show queue item"));
    prop.CheckMenuItem(24, cList.queueItem);
    prop.AppendMenuItem(MF_STRING, 25, GetText("Alternate row color"));
    prop.CheckMenuItem(25, alternateRowColor);
	prop.AppendMenuSeparator();
    prop.AppendMenuItem(MF_STRING, 26, GetText("Show scrollbar"));
    prop.CheckMenuItem(26, showScrollbar);
    if (showScrollbar) {
        prop.AppendMenuItem(MF_STRING, 27, GetText("Scrollbar use system style"));
        prop.CheckMenuItem(27, scrollbarUseWindowsVisualStyle);
    }

    prop.AppendTo(menu, MF_STRING | MF_POPUP, GetText("Playlist properties"));
    //---> columns
    colum.AppendMenuItem(MF_STRING, 40, GetText("Artist"));
    colum.CheckMenuItem(40, column.artist);
    colum.AppendMenuItem(MF_STRING, 41, GetText("Play count"));
    colum.CheckMenuItem(41, column.playcount);
    colum.AppendMenuItem(MF_STRING, 42, GetText("Rating"));
    colum.CheckMenuItem(42, column.rating);
    colum.AppendTo(menu, MF_STRING | MF_POPUP, GetText("Columns"));
    //---> group
	group.AppendMenuItem(MF_STRING, 20, GetText("Show group header"));
    group.CheckMenuItem(20, cGroup.show);
	group.AppendMenuSeparator();
    group.AppendTo(menu, MF_STRING | MF_POPUP, GetText("Grouping"));
    group.AppendMenuItem(cGroup.show ? MF_STRING : MF_GRAYED, 50, GetText("by artist"));
    group.AppendMenuItem(cGroup.show ? MF_STRING : MF_GRAYED, 51, GetText("by artist / album"));
    group.AppendMenuItem(cGroup.show ? MF_STRING : MF_GRAYED, 52, GetText("by artist / album / disc number"));
    group.AppendMenuItem(cGroup.show ? MF_STRING : MF_GRAYED, 53, GetText("by path"));
    group.AppendMenuItem(cGroup.show ? MF_STRING : MF_GRAYED, 54, GetText("by date"));
    group.AppendMenuItem(cGroup.show ? MF_STRING : MF_GRAYED, 55, GetText("by user defined"));
    if (cGroup.id !== undefined) group.CheckMenuRadioItem(50, 55, 50 + cGroup.id);
    var isAutoPlaylist = fb.IsAutoPlaylist(fb.ActivePlaylist);
    var selected = plman.GetPlaylistSelectedItems(plman.ActivePlaylist).Count;
    var selection = selected > 1;
    //---> sort
    sort.AppendMenuItem(MF_STRING, 80, GetText("Sort by..."));
    sort.AppendMenuItem(MF_STRING, 81, GetText("Randomize"));
    sort.AppendMenuItem(MF_STRING, 82, GetText("Reverse"));
    sort.AppendMenuItem(MF_STRING, 83, GetText("Sort by album"));
    sort.AppendMenuItem(MF_STRING, 84, GetText("Sort by artist"));
    sort.AppendMenuItem(MF_STRING, 85, GetText("Sort by file path"));
    sort.AppendMenuItem(MF_STRING, 86, GetText("Sort by title"));
    sort.AppendMenuItem(MF_STRING, 87, GetText("Sort by track number"));
    sort.AppendMenuItem(MF_STRING, 88, GetText("Sort by date"));
    sort.AppendTo(menu, isAutoPlaylist ? MF_GRAYED :MF_STRING | MF_POPUP, selection ? GetText("Sort selection") :GetText("Sort"));
    //---> others
    menu.AppendMenuSeparator();
    menu.AppendMenuItem(MF_STRING, 61, GetText("Wsh properties..."));
    menu.AppendMenuItem(MF_STRING, 62, GetText("Wsh configure..."));
    menu.AppendMenuItem(MF_STRING, 63, GetText("Restart"));
    menu.AppendMenuSeparator();
    menu.AppendMenuItem(MF_STRING, 64, GetText("Help..."));
    var id = menu.TrackPopupMenu(x, y);
    switch (id) {
      case 1:
        gCollapse.autoExpand = !gCollapse.autoExpand;
        window.SetProperty(cList.name + ".Auto Expand/Collapse Groups", gCollapse.autoExpand);
        gCollapse.autoExpand && getPlayingGroupCollapseExpand();
        break;

      case 2:
        gCollapse.onStart = !gCollapse.onStart;
        window.SetProperty(cList.name + ".Collapse On Start", gCollapse.onStart);
        break;

      case 3:
        gCollapse.autoOnSwitch = !gCollapse.autoOnSwitch;
        window.SetProperty(cList.name + ".Auto Collapse On Playlist Switch", gCollapse.autoOnSwitch);

      case 10:
        enableSkip = !enableSkip;
        window.SetProperty("user.Skip Enable", enableSkip);
        break;

      case 11:
        skipLessThan = 2;
        window.SetProperty("user.Skip Less Than", skipLessThan);
        break;

      case 12:
        skipLessThan = 3;
        window.SetProperty("user.Skip Less Than", skipLessThan);
        break;

      case 13:
        skipLessThan = 4;
        window.SetProperty("user.Skip Less Than", skipLessThan);

      case 14:
        skipLessThan = 5;
        window.SetProperty("user.Skip Less Than", skipLessThan);
        break;

      case 20:
        cGroup.show = !cGroup.show;
        window.SetProperty(cList.name + ".Show Group Header", cGroup.show);
        initList();
        break;

      case 21:
        cGroup.cover.show = !cGroup.cover.show;
        window.SetProperty(cList.name + ".Show Album Art", cGroup.cover.show);
        cGroup.cover.show && getAlbumArt();
        repaintList();
        break;

      case 22:
        cGroup.cover.auto = !cGroup.cover.auto;
        window.SetProperty(cList.name + ".Auto Album Art", cGroup.cover.show);
        cGroup.cover.show && getAlbumArt();
        repaintList();
        break;

      case 23:
        cList.focusItem = !cList.focusItem;
        window.SetProperty(cList.name + ".Show Focus Item", cList.focusItem);
        repaintList();
        break;

      case 24:
        cList.queueItem = !cList.queueItem;
        window.SetProperty(cList.name + ".Show Queue Item", cList.queueItem);
        repaintList();
        break;

      case 25:
        alternateRowColor = !alternateRowColor;
        window.SetProperty("user.Alternate Row Color", alternateRowColor);
        repaintList();
        break;

      case 26:
        showScrollbar = !showScrollbar;
        window.SetProperty("user.Show Scrollbar", showScrollbar);
        listOnSize();
        repaintList();
        break;

      case 27:
        scrollbarUseWindowsVisualStyle = !scrollbarUseWindowsVisualStyle;
        window.SetProperty("user.Scrollbar Use Windows Visual Style", scrollbarUseWindowsVisualStyle);
        refreshScrollbarStyle();
        break;

      case 28:
        useTagRating = !useTagRating;
        window.SetProperty("user.Use Tag Rating", useTagRating);
        repaintList();
        break;

      case 40:
        column.artist = !column.artist;
        window.SetProperty(cList.name + ".Show Artist", column.artist);
        initList();
        repaintList();
        break;

      case 41:
        column.playcount = !column.playcount;
        window.SetProperty(cList.name + ".Show Play Count", column.playcount);
        initList();
        repaintList();
        break;

      case 42:
        column.rating = !column.rating;
        window.SetProperty(cList.name + ".Show Rating", column.rating);
        initList();
        repaintList();
        break;

      case 50:
        cGroup.format = gGroupBy.artist;
        window.SetProperty(cList.name + ".GroupBy", cGroup.format);
        cGroup.id = 0;
        window.SetProperty(cList.name + ".Grouped ID", cGroup.id);
        initList();
        break;

      case 51:
        cGroup.format = gGroupBy.artistAlbum;
        window.SetProperty(cList.name + ".GroupBy", cGroup.format);
        cGroup.id = 1;
        window.SetProperty(cList.name + ".Grouped ID", cGroup.id);
        initList();
        break;

      case 52:
        cGroup.format = gGroupBy.artistAlbumDiscnumber;
        window.SetProperty(cList.name + ".GroupBy", cGroup.format);
        cGroup.id = 2;
        window.SetProperty(cList.name + ".Grouped ID", cGroup.id);
        initList();
        break;

      case 53:
        cGroup.format = gGroupBy.path;
        window.SetProperty(cList.name + ".GroupBy", cGroup.format);
        cGroup.id = 3;
        window.SetProperty(cList.name + ".Grouped ID", cGroup.id);
        initList();
        break;

      case 54:
        cGroup.format = gGroupBy.date;
        window.SetProperty(cList.name + ".GroupBy", cGroup.format);
        cGroup.id = 4;
        window.SetProperty(cList.name + ".Grouped ID", cGroup.id);
        initList();
        break;

      case 55:
        cGroup.format = gGroupBy.userDefined;
        window.SetProperty(cList.name + ".GroupBy", cGroup.format);
        cGroup.id = 5;
        window.SetProperty(cList.name + ".Grouped ID", cGroup.id);
        initList();
        break;

      case 61:
        window.ShowProperties();
        break;

      case 62:
        window.ShowConfigure();
        break;

      case 63:
        fb.RunMainMenuCommand(GetText("File/Restart"));
        break;

      case 64:
        fb.ShowPopupMessage("Want help?\njust wait...", GetText("Help"), 0);
        break;

      case 80:
        //---> Sort
        selection ? fb.RunMainMenuCommand(GetText("Edit/Selection/Sort/Sort by...")) :fb.RunMainMenuCommand(GetText("Edit/Sort/Sort by..."));
        break;

      case 81:
        plman.SortByFormat(activeList, "", selection ? true :false);
        break;

      case 82:
        selection ? fb.RunMainMenuCommand(GetText("Edit/Selection/Sort/Reverse")) :fb.RunMainMenuCommand(GetText("Edit/Sort/Reverse"));
        break;

      case 83:
        plman.SortByFormat(activeList, "%album%", selection ? true :false);
        break;

      case 84:
        plman.SortByFormat(activeList, "%artist%", selection ? true :false);
        break;

      case 85:
        plman.SortByFormat(activeList, "%path%%subsong%", selection ? true :false);
        break;

      case 86:
        plman.SortByFormat(activeList, "%title%", selection ? true :false);
        break;

      case 87:
        plman.SortByFormat(activeList, "%tracknumber%", selection ? true :false);
        break;

      case 88:
        plman.SortByFormat(activeList, "%date%", selection ? true :false);
        break;
    }
    menu.Dispose();
    ce.Dispose();
    prop.Dispose();
    colum.Dispose();
    skip.Dispose();
    art.Dispose();
    group.Dispose();
    sort.Dispose();
}

function on_mouse_rbtn_up(x, y) {
    if (mouseInScrollbar) {
        scrollbarMouseEventHandler(x, y);
        return true;
    }
    if (x < cList.x || x > cList.x + cList.w || y < cList.y || y > cList.y + cList.h) return true;
    var metadb = utils.IsKeyPressed(VK_CONTROL) ? fb.IsPlaying ? fb.GetNowPlaying() :fb.GetFocusItem() :fb.GetFocusItem();
    var windowsVisualStyleEnabled = window.CreateThemeManager("WINDOW");
    var selected = plman.GetPlaylistSelectedItems(plman.ActivePlaylist).Count;
    var selection = selected > 1;
    var queueActive = plman.IsPlaybackQueueActive();
    var isAutoPlaylist = fb.IsAutoPlaylist(activeList);
    var playlistCount = fb.PlaylistCount;
    var sendToPlaylistId = 0;
    var cpm = window.CreatePopupMenu();
    var web = window.CreatePopupMenu();
    var ce = window.CreatePopupMenu();
    var ccmm = fb.CreateContextMenuManager();
    var send = window.CreatePopupMenu();
    var xiami = window.CreatePopupMenu();
    var douban = window.CreatePopupMenu();
    plman.SetActivePlaylistContext();
    fb.Isplaying && cpm.AppendMenuItem(MF_STRING, 5, GetText("Show now playing"));
    if (plman.PlaylistItemCount(plman.ActivePlaylist)) {
        cpm.AppendMenuItem(MF_STRING, 6, GetText("Refresh all 	F5"));
        cpm.AppendMenuItem(MF_STRING, 7, GetText("Select all 	Ctrl+A"));
        if (selected) cpm.AppendMenuItem(isAutoPlaylist ? MF_GRAYED :MF_STRING, 8, GetText("Remove from list 	Delete"));
        if (queueActive) cpm.AppendMenuItem(MF_STRING, 9, GetText("Flush playback queue"));
        cpm.AppendMenuSeparator();
    }
    if (plman.PlaylistItemCount(plman.ActivePlaylist)) {
        // -------------------------------------------------------------- // 
        //---> Collapse/Expand
        if (cGroup.show) {
            ce.AppendMenuItem(MF_STRING, 20, GetText("Collapse all"));
            if (fb.ActivePlaylist == plman.PlayingPlaylist) ce.AppendMenuItem(MF_STRING, 21, GetText("Collapse all but now playing"));
            ce.AppendMenuItem(MF_STRING, 22, GetText("Expand all"));
            ce.AppendTo(cpm, MF_STRING | MF_POPUP, GetText("Collapse/Expand"));
        }
        // -------------------------------------------------------------- //    
        // Selection
        // -------------------------------------------------------------- //
        //---> Web links
        xiami.AppendTo(web, MF_STRING | MF_POPUP, GetText("Xiami"));
        xiami.AppendMenuItem(MF_STRING, 80, GetText("Artist"));
        xiami.AppendMenuItem(MF_STRING, 81, GetText("Album"));
        douban.AppendTo(web, MF_STRING | MF_POPUP, GetText("Douban"));
        douban.AppendMenuItem(MF_STRING, 82, GetText("Artist"));
        douban.AppendMenuItem(MF_STRING, 83, GetText("Album"));
        web.AppendTo(cpm, safeMode ? MF_GRAYED :MF_STRING | MF_POPUP, GetText("Link to"));
        // -------------------------------------------------------------- //
        //---> Send
        if (selected) {
            send.AppendMenuItem(MF_STRING, 100, GetText("To top"));
            send.AppendMenuItem(MF_STRING, 101, GetText("To bottom"));
            send.AppendMenuSeparator();
            send.AppendMenuItem(MF_STRING, 102, GetText("Create New Playlist"));
            send.AppendMenuSeparator();
            sendToPlaylistId = 103;
            for (var i = 0; i != playlistCount; i++) {
                send.AppendMenuItem(fb.IsAutoPlaylist(i) || i == activeList ? MF_GRAYED :MF_STRING, sendToPlaylistId + i, fb.GetPlaylistName(i) + " [" + fb.PlaylistItemCount(i) + "]" + (fb.IsAutoPlaylist(i) ? GetText(" (Auto)") :"") + (i == plman.PlayingPlaylist ? GetText(" (Now Playing)") :""));
            }
            send.AppendTo(cpm, MF_STRING | MF_POPUP, GetText("Send selection"));
        }
    }
    cpm.AppendMenuSeparator();
    cpm.AppendMenuItem(plman.GetPlaylistSelectedItems(plman.ActivePlaylist).Count > 0 ? MF_STRING :MF_GRAYED, 10, GetText("Cut 	Ctrl+X"));
    cpm.AppendMenuItem(cuttedItemsCount ? MF_STRING :MF_GRAYED, 11, GetText("Paste 	Ctrl+V"));
    // -------------------------------------------------------------- //
    //---> Playlists
    var playlistsStartID = sendToPlaylistId + playlistCount;
    var playlistId = playlistsStartID + 3;
    // -------------------------------------------------------------- //
    //---> Context Menu Manager
    var contextId = playlistId + playlistCount;
    if (selected) {
        cpm.AppendMenuSeparator();
        ccmm.InitContext(plman.GetPlaylistSelectedItems(activeList));
        ccmm.BuildMenu(cpm, contextId, -1);
    }
    id = cpm.TrackPopupMenu(x, y);
    if (selected) ccmm.ExecuteByID(id - contextId);
    // -------------------------------------------------------------- //
    switch (id) {
      case 5:
        showNowPlaying();
        break;

      case 6:
        initList();
        break;

      case 7:
        selectAll();
        break;

      case 8:
        plman.RemovePlaylistSelection(activeList);
        break;

      case 9:
        plman.FlushPlaybackQueue();
        break;

      case 10:
        cut();
        break;

      case 11:
        paste();
        break;

      // -------------------------------------------------------------- // 
        case 20:
        //---> Collapse/Expand
        collapseExpand("collapse");
        displayFocusItem(plman.GetPlaylistFocusItemIndex(activeList));
        break;

      case 21:
        getPlayingGroupCollapseExpand();
        break;

      case 22:
        collapseExpand("expand");
        displayFocusItem(plman.GetPlaylistFocusItemIndex(activeList));
        break;

      // -------------------------------------------------------------- //
        // Web links
        case 80:
        link("Xiami Artist", metadb);
        break;

      case 81:
        link("Xiami Album", metadb);
        break;

      case 82:
        link("Douban Artist", metadb);
        break;

      case 83:
        link("Douban Album", metadb);
        break;

      // -------------------------------------------------------------- //
        // Selection
        case 100:
        // Send to top
        plman.MovePlaylistSelection(activeList, -plman.GetPlaylistFocusItemIndex(activeList));
        break;

      case 101:
        // Send to bottom
        plman.MovePlaylistSelection(activeList, playlistItemCount - plman.GetPlaylistSelectedItems(activeList).Count);
        break;

      case 102:
		// auto name according to content.
        var newList = fb.CreatePlaylist(playlistCount, GetText("Playlist #") + (playlistCount + 1).toString());
        plman.InsertPlaylistItems(playlistCount, 0, plman.GetPlaylistSelectedItems(activeList), select = true);
		//var playlistName = plman.PlaylistGetAutoName(newList);
		//plman.RenamePlaylist(newList, playlistName);

        break;

      // -------------------------------------------------------------- //
        case playlistsStartID + 1:
        fb.RunMainMenuCommand(GetText("View/Playlist Manager"));
        break;

      case playlistsStartID + 2:
        fb.CreatePlaylist(playlistCount, "");
        fb.ActivePlaylist = fb.PlaylistCount;
        break;
    }
    for (var i = 0; i < plman.PlaylistCount; i++) {
        if (id == sendToPlaylistId + i) {
            plman.ClearPlaylistSelection(i);
            plman.InsertPlaylistItems(i, plman.PlaylistItemCount(i), plman.GetPlaylistSelectedItems(activeList), select = true);
        }
    }
    cpm.Dispose();
    ccmm.Dispose();
    web.Dispose();
    ce.Dispose();
    send.Dispose();
    xiami.Dispose();
    douban.Dispose();
    return true;
}

if (gCollapse.onStart) {
    collapseExpand("collapse");
    collapsedOnStart = true;
}

function initImage() {
    var font1 = gdi.font("Guifx v2 Transports", 22);
    var font2 = gdi.font("Guifx v2 Transports", 16);
    var c1 = RGB(38, 38, 38);
    var c2 = gColor.highlight;
    var c3 = RGB(247, 247, 247);
    var buttons = {
        Prev:{
            ico:Guifx.Previous,
            id:"Prev",
            tag:"playback"
        },
        Play:{
            ico:Guifx.Play,
            id:"Play",
            tag:"playback"
        },
        Pause:{
            ico:Guifx.Pause,
            id:"Pause",
            tag:"playback"
        },
        Stop:{
            ico:Guifx.Stop,
            id:"Stop",
            tag:"playback"
        },
        Next:{
            ico:Guifx.Next,
            id:"Next",
            tag:"playback"
        },
        Muted:{
            ico:Guifx.Mute2,
            id:"Muted",
            tag:"caption"
        },
        Mute:{
            ico:Guifx.VolumeDown,
            id:"Mute",
            tag:"caption"
        },
        Repeat:{
            ico:Guifx.Repeat,
            id:"Repeat",
            tag:"caption"
        },
        Repeat1:{
            ico:Guifx.Repeat1,
            id:"Repeat1",
            tag:"caption"
        },
        Default:{
            ico:Guifx.Repeat,
            id:"Default",
            tag:"caption"
        },
        Random:{
            ico:Guifx.Shuffle,
            id:"Random",
            tag:"caption"
        },
        Setting:{
            ico:Guifx.Down3,
            id:"Setting",
            tag:"caption"
        },
        Lyric:{
            ico:"LRC",
            id:"Lyric",
            tag:"caption"
        },
        Lyric2:{
            ico:"LRC",
            id:"Lyric2",
            tag:"caption"
        }
    };
    var buttonImages = [];
    for (var i in buttons) {
        switch (buttons[i].id) {
          case "Play":
          case "Stop":
          case "Pause":
            var w = 42;
            var h = 42;
            var font = gdi.Font("Guifx v2 Transports", 24);
            break;

          case "Prev":
          case "Next":
            var w = 32;
            var h = 32;
            var font = gdi.Font("Guifx v2 Transports", 15);
            break;

          case "Mute":
          case "Muted":
            var w = 24;
            var h = 24;
            var font = gdi.Font("Guifx v2 Transports", 21);
            break;

          case "Random":
          case "Default":
          case "Repeat":
          case "Repeat1":
            var w = 24;
            var h = 24;
            var font = gdi.Font("Guifx v2 Transports", 16);
            break;

          case "Setting":
            var w = 16;
            var h = 16;
            var font = gdi.Font("Guifx v2 Transports", 14);
            break;

          case "Lyric":
          case "Lyric2":
            var w = 0;
            var h = 21;
            var font = gdi.font(globalFontName, 11, 1);
            var tmp = gdi.CreateImage(100, 50);
            g = tmp.GetGraphics();
            w = g.MeasureString(buttons[i].ico, font, 0, 0, 0, 0).Width + 10;
            tmp.ReleaseGraphics(g);
            tmp.Dispose();
            break;
        }
        var stateImages = [];
        // 0: normal, 1: hover, 2: down;
        for (var s = 0; s <= 2; s++) {
            var color = c1;
            if (buttons[i].id == "Default") color = RGB(180, 180, 180);
            if (buttons[i].id == "Muted") color = RGB(180, 180, 180);
            if (buttons[i].id == "Lyric2") color = RGB(180, 180, 180);
            if (s == 1) color = c2;
            if (s == 2) color = blendColors(c2, c1, .5);
            var img = gdi.CreateImage(w, h);
            g = img.GetGraphics();
            g.FillSolidRect(-1, -1, w + 2, h + 2, c3);
            //g.SetSmoothingMode(4);
            g.SetTextRenderingHint(5);
            if (buttons[i].id == "Lyric") {
                g.FillRoundRect(1, 1, w - 2, h - 2, 4, 4, RGB(200, 200, 200));
                g.DrawString(buttons[i].ico, font, color, 0, 0, w, h, StringFormat(1, 1));
            } else if (buttons[i].id == "Lyric2") {
	            g.DrawString(buttons[i].ico, font, color, 0, 0, w, h, StringFormat(1, 1));
            } else {
	            g.DrawString(buttons[i].ico, font, color, buttons[i].id == "Play" ? 2 :0, 0, w, h, StringFormat(1, 1));
            }
            stateImages[s] = img;
            img.ReleaseGraphics(g);
        }
        buttonImages[i] = stateImages;
    }
    return buttonImages;
}

function toRGB(d) {
    var r = (d >> 16) & 0xFF;
    var g = (d >> 8 ) & 0xFF;
    var b = (d >> 0 ) & 0xFF;
    return [ r, g, b ];
}

// 透明计算公式:
// rgb分量 := 下层rgb分量 + (上层rgb分量 - 下层rgb分量) * 透明度
// c1 - 上层颜色
// c2 - 下层颜色
// factor - alpha in percent
function blendColors(c1, c2, factor) {
    var c1 = toRGB(c1);
    var c2 = toRGB(c2);
    var r = Math.round(c2[0] + factor * (c1[0] - c2[0]));
    var g = Math.round(c2[1] + factor * (c1[1] - c2[1]));
    var b = Math.round(c2[2] + factor * (c1[2] - c2[2]));
    return 0xFF000000 | r << 16 | g << 8 | b;
}

function Buttons() {
    this.draw = function(gr) {
        for (var i in this.btns) {
            this.btns[i].draw(gr);
        }
    };
    this.move = function(x, y) {
        if (this.dbtn) return;
        this.isHover = false;
        for (var i in this.btns) {
            if (this.btns[i].trace(x, y)) {
                this.isHover = true;
                if (this.hbtn != this.btns[i]) {
                    if (this.hbtn) this.hbtn.changeState(0);
                    this.hbtn = this.btns[i];
                    this.hbtn.changeState(1);
                }
            }
        }
        if (this.isHover == false) {
            if (this.hbtn) {
                this.hbtn.changeState(0);
                this.hbtn = undefined;
            }
        }
        if (this.dbtn) this.dbtn.changeState(2);
    };
    this.lbtnDown = function(x, y) {
        if (this.hbtn) {
            this.dbtn = this.hbtn;
            this.dbtn.changeState(2);
        }
    };
    this.lbtnUp = function(x, y) {
        if (this.dbtn) {
            this.dbtn.changeState(1);
            if (this.dbtn.trace(x, y)) this.dbtn.onClick();
            this.dbtn.changeState(0);
            this.dbtn = undefined;
        }
    };
    this.leave = function() {
        if (this.hbtn) {
            this.hbtn.changeState(0);
            this.hbtn = undefined;
        }
    };
    this.wheel = function(step) {
        if (this.hbtn && this.hbtn.id == "Mute") fb.Volume += step;
    };
    this.update = function() {
        for (var i in this.btns) {
            switch (this.btns[i].id) {
              case "Play/Pause":
                this.btns[i].img = fb.IsPlaying ? fb.IsPaused ? ICON.Play :ICON.Pause :ICON.Stop;
                break;

              case "Mute":
                this.btns[i].img = ICON.Mute;
                if (fb.Volume == -100) this.btns[i].img = ICON.Muted;
                break;

              case "Order":
                var order = fb.PlaybackOrder;
                this.btns[i].img = ICON.Default;
                if (order == 1) this.btns[i].img = ICON.Repeat;
                if (order == 2) this.btns[i].img = ICON.Repeat1;
                if (order == 3) this.btns[i].img = ICON.Random;
                if (order > 3) this.btns[i].img = ICON.Default;
                break;
            }
            this.btns[i].repaint();
        }
    };
    this.hbtn;
    //Hover button
    this.dbtn;
    //Down button
    this.isHover;
    this.btns = [];
}

function Button(id, img, x, y, w, h, func) {
    this.draw = function(gr) {
        var alpha = 150;
        //gr.SetSmoothingMode(3);//none
        if(this.opacity < 255 && this.old_state >= 0){
	        this.img && gr.DrawImage(this.img[this.old_state], this.x, (this.state == 2 ? 1 :0) + this.y, this.w, this.h, 0, 0, this.img[0].Width, this.img[0].Height, 0, 255 - this.opacity);
        }
        this.img && gr.DrawImage(this.img[this.state], this.x, (this.state == 2 ? 1 :0) + this.y, this.w, this.h, 0, 0, this.img[0].Width, this.img[0].Height, 0, this.opacity);
    };
    this.trace = function(x, y) {
        return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;
    };
    this.repaint = function() {
        window.RepaintRect(this.x - 2, this.y - 2, this.w + 4, this.h + 4);
    };
    this.changeState = function(state) {
	    if(state == this.state)return;
	    this.old_state = this.state;
        this.state = state;
        this.opacity = 0;
        switch(state)
        {
	       case 0://normal
	       		this.fadingStep = 40;
	       break;
	       case 1://hover
	       		this.fadingStep = 60;
		   break;
	       case 2://down
	       		this.fadingStep = 128;
	       break;
        }
        
        if(!this.fadingOn){//start fading.
        	this.fadingOn = true;
        	TimerMgr.RunIntervallic(this.onTimer, this, 50);
    	}
        //this.repaint();
    };
    this.onClick = function() {
        this.func && this.func();
    };
    this.onTimer = function(){
	    if(!this.fadingOn)return;
	    var ret = false;//return false to kill the timer,otherwise return true.
	    this.opacity += this.fadingStep;
    	if(this.opacity>255){
       	 	this.opacity = 255;
        	this.fadingOn = false;
        	this.old_state = -1;
        	this.repaint();
        	ret = false;
    	}
    	else{
	    	ret = true;
    	}
    	this.repaint();
    	return ret;
    }
    
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.id = id;
    this.img = img;
    this.func = func;
    this.isHover = false;
    this.state = 0; //0:normal 1: hover 2: down

    this.old_state = -1;
    this.opacity = 255;
    this.fadingOn = false;
    this.fadingStep = 25;
}

function Volume(x, y, w, h) {
    this.draw = function(gr) {
        this.calcPos();
        gr.FillSolidRect(this.x, this.y, this.w, this.h, RGB(225, 225, 225));
        gr.FillSolidRect(this.x, this.y, this.pos, this.h, RGB(88, 88, 88));
    };
    this.volumeChange = function(vol) {
        this.repaint();
    };
    this.trace = function(x, y) {
        return x > this.x && x < this.x + this.w && y > this.y - 5 - (this.drag ? 200 :0) && y < this.y + this.h + 5 + (this.drag ? 200 :0);
    };
    this.repaint = function() {
        window.RepaintRect(this.x - 2, this.y - 2, this.w + 4, this.h + 4);
    };
    this.move = function(x, y) {
        this.isHover = this.trace(x, y);
        if (this.isHover) {
            x -= this.x;
            var pos = x < 0 ? 0 :x > this.w ? 1 :x / this.w;
            this.dragVol = 50 * Math.log(.99 * pos + .01) / Math.LN10;
            if (this.drag) {
                fb.Volume = this.dragVol;
                this.repaint();
            }
        } else {
            this.leave();
        }
    };
    this.lbtnDown = function(x, y) {
        if (!this.isHover) return;
        this.drag = true;
        fb.Volume = this.dragVol;
        return;
    };
    this.lbtnUp = function(x, y) {
        if (!this.isHover) return;
        fb.Volume = this.dragVol;
        this.drag = false;
    };
    this.leave = function() {
        this.drag = false;
        this.isHover = false;
    };
    this.wheel = function(step) {
        if (!this.isHover) return;
        fb.Volume += step * Math.exp(-fb.Volume / 33.333);
    };
    this.calcPos = function() {
        this.pos = this.w * (Math.pow(10, fb.Volume / 50) - .01) / .99;
    };
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.pos = 0;
    this.drag = false;
    this.dragVol = 0;
    this.isHover = false;
}

function Seekbar(x, y, w, h) {
	
	var tooltip_font = window.GetFontDUI(0);
	
    this.draw = function(gr) {
	    this.tooltip.draw(gr);
        gr.FillSolidRect(this.x, this.y, this.w, this.h, RGB(225, 225, 225));
        if (fb.IsPlaying && fb.PlaybackLength > 0) {
            this.calcPos();
            gr.FillSolidRect(this.x, this.y, this.pos, this.h, RGB(88, 88, 88));
        }
    };
    this.wheel = function(step) {
        switch (true) {
          case !this.isHover:
          case !fb.IsPlaying:
          case fb.PlaybackLength == 0:
            break;

          case fb.PlaybackLength < 60:
            fb.PlaybackTime += step * 5;
            break;

          case fb.PlaybackLength < 600:
            fb.PlaybackTime += step * 10;
            break;

          default:
            fb.PlaybackTime += step * 60;
            break;
        }
    };
    this.move = function(x, y) {
        this.isHover = this.trace(x, y);
        if (this.isHover) {
            if (fb.IsPlaying && fb.PlaybackLength > 0) {
	            window.SetCursor(IDC_HAND);
                x -= this.x;
                this.dragSeek = x < 0 ? 0 :x > this.w ? 1 :x / this.w;
                if (this.oldX != x || this.oldY != y) {
                    this.oldX = x;
                    this.oldY = y;
                }
                if (this.drag) this.repaint();

                this.tooltip.text = timeFormat(fb.PlaybackLength * this.dragSeek);
                this.tooltip.x = x;//use relative position
                this.tooltip.y = this.y;
                this.tooltip.att_x = this.x;
                this.tooltip.att_w = this.w;//tooltip repaint width
                this.tooltip.activate();
            }
        } else {
	        window.SetCursor(IDC_ARROW);
            this.leave();
        }
    };
    this.lbtnDown = function(x, y) {
        if (this.isHover) {
			if (fb.IsPlaying && fb.PlaybackLength > 0) this.drag = true;
			this.repaint();
		}
    };
    this.lbtnUp = function(x, y) {
        if (this.isHover) {
			if (this.drag) {
				this.drag = false;
				fb.PlaybackTime = fb.PlaybackLength * this.dragSeek;
			}
		}
    };
    this.leave = function() {
		if (!this.drag) {
			this.tooltip.deactivate();
		}
    };
    this.calcPos = function() {
        this.pos = this.drag ? this.w * this.dragSeek :this.w * (fb.PlaybackTime / fb.PlaybackLength);
    };
    this.repaint = function() {
        window.RepaintRect(this.x - 2, this.y - 2, this.w + 4, this.h + 4);
    };
    this.trace = function(x, y) {
        return (x > this.x && x < this.x + this.w && y > this.y - (this.drag ? 200 :0) && y < this.y + this.h) + (this.drag ? 200 :0);
    };
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.pos = 0;
    this.drag = false;
    this.dragSeek = 0;
    this.isHover = false;
    this.oldX = 0;
    this.oldY = 0;
    this.tooltip = new Tooltip(0,0,"",tooltip_font,RGB(220,220,220));
}

function Menubar(x, y, w, h) {
    this.menu = [ "File", "Edit", "View", "Playback", "Library", "Help" ];
    this.font = gdi.Font("Tahoma", 12);
    this.menu_x = [];
    this.menu_w = [];
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.show = true;
    this.btn = new Buttons();
    (function() {
        var tmp = gdi.CreateImage(100, 50);
        g = tmp.GetGraphics();
        this.menu_x[0] = this.x + 2;
        for (var i = 0; i < this.menu.length; i++) {
            this.menu_w[i] = g.CalcTextWidth(this.menu[i], this.font) + 16;
            this.menu_x[i + 1] = this.menu_w[i] + this.menu_x[i];
        }
        tmp.ReleaseGraphics(g);
        tmp.Dispose();
    })();
}

//stolen from bossa
function Tooltip(x, y, text, font, color) {
	this.visible = false;
	this.x = x;
	this.y = y;
	this.w = 0;
	this.h = 0;
	this.text = text;

	this.att_x = 0;//attached 'control' position
	this.att_w = 0;
	
	//var BgImageObj = gdi.Image(fb.FoobarPath + "\\skins\\include\\GUI\\tooltip_bg.png");
	this.calcSize = function(){
		var temp_img = gdi.CreateImage(1,1);
		var g = temp_img.GetGraphics();
		this.w = g.CalcTextWidth(this.text, font) + TOOLTIP_TEXT_PADDING_LEFT + TOOLTIP_TEXT_PADDING_RIGHT;
		this.h = g.CalcTextHeight(this.text, font) + TOOLTIP_TEXT_PADDING_TOP + TOOLTIP_TEXT_PADDING_BOTTOM;
		temp_img.ReleaseGraphics(g);
	}
	
	this.draw = function(gr) {
		this.calcSize();
		if (this.visible) {
			var xPos = this.x - this.w/2;
			var yPos = this.y - this.h - 4;
			if(xPos < 0)
				xPos = 0;
			else if((xPos + this.w) > (this.att_x + this.att_w))
				xPos = this.att_x + this.att_w - this.w;
			gr.SetSmoothingMode(4);
			gr.FillRoundRect(xPos,yPos,this.w,this.h,3,3,RGBA(20,20,20,180));
			gr.GdiDrawText(this.text, font, color, xPos + TOOLTIP_TEXT_PADDING_LEFT, yPos + TOOLTIP_TEXT_PADDING_TOP, gr.CalcTextWidth(this.text, font), font.Height, DT_NOPREFIX);
			gr.SetSmoothingMode(0);//restore smooth mode
		}
	}

	this.repaint = function() {
		this.calcSize();
		var xPos = this.att_x - 2;
		var yPos = this.y - this.h - 4;
		window.RepaintRect(xPos, yPos, this.att_w + 4, this.h + 4);
	}

	this.activate = function() {
		//this.visible = true;
		//this.repaint();
		if(!this.visible)
			TimerMgr.RunIntervallic(this.onTimer,this,200);
		else{
			this.repaint();
		}
	}

	this.deactivate = function() {
		if (this.visible) { 
			this.visible = false;
			this.repaint();
		}
	}

	this.onTimer = function(){
		this.visible = true;
		this.repaint();
		return false;//one-shot timer
	}
}

function calcButtonWidth() {
    var text = plman.GetPlaylistName(fb.ActivePlaylist);
    var font = titleFont;
    var tmp = gdi.CreateImage(400, 50);
    g = tmp.GetGraphics();
    var w = g.CalcTextWidth(text, font) + 16;
    tmp.ReleaseGraphics(g);
    tmp.Dispose();
    return w;
}

function PlaylistMenu(x, y) {
    if (fb.ActivePlaylist >= fb.PlaylistCount - 1) {
        fb.ActivePlaylist = fb.PlaylistCount - 1;
    }
    var activePlaylistID = fb.ActivePlaylist;
    var playlistName = fb.GetPlaylistName(fb.ActivePlaylist);
    var isAutoPlaylist = fb.IsAutoPlaylist(fb.ActivePlaylist);
    var isLocked = plman.IsPlaylistLocked(fb.ActivePlaylist);
    var playlistCount = fb.PlaylistCount;
    var playlistId = 20;
    var _menu = window.CreatePopupMenu();
    var _plman = window.CreatePopupMenu();
    var _cur = window.CreatePopupMenu();
    var _prm = plman.PlaylistRecyclerManager;
    var _pr = window.CreatePopupMenu();
    var _lk = window.CreatePopupMenu();
    _plman.AppendMenuItem(MF_STRING, 1, GetText("Playlist Manager..."));
    _plman.AppendMenuSeparator();
    _plman.AppendMenuItem(MF_STRING, 2, GetText("New Playlist..."));
    _plman.AppendMenuItem(MF_STRING, 3, GetText("New autoplaylist..."));
    _plman.AppendMenuSeparator();
    _plman.AppendMenuItem(MF_STRING, 4, GetText("Save all playlists..."));
    _plman.AppendMenuItem(MF_STRING, 5, GetText("Load playlists..."));
    _plman.AppendMenuSeparator();
    if (_prm.Count >= 1) {
        for (var i = 0; i < _prm.Count; i++) {
            _pr.AppendMenuItem(MF_STRING, 2001 + i, _prm.Name(i));
        }
        _pr.AppendMenuSeparator();
        _pr.AppendMenuItem(MF_STRING, 2e3, GetText("Clear history"));
    }
    _pr.AppendTo(_plman, _prm.Count >= 1 ? MF_STRING :MF_GRAYED | MF_DISABLED, GetText("Restore"));
    _plman.AppendTo(_menu, MF_STRING | MF_POPUP, GetText("Playlist Manager"));
    _cur.AppendMenuItem(MF_STRING | MF_GRAYED, 9, GetText("Lock"));
    _cur.CheckMenuItem(9, isLocked);
    _cur.AppendMenuItem(MF_STRING, 10, GetText("Rename playlist..."));
    _cur.AppendMenuItem(MF_STRING, 11, GetText("Remove playlist"));
    _cur.AppendMenuSeparator();
    _cur.AppendMenuItem(MF_STRING, 12, GetText("Duplicate playlist"));
    _cur.AppendMenuSeparator();
    if (isAutoPlaylist) {
        _cur.AppendMenuItem(MF_STRING, 13, GetText("Convert to a normal playlist"));
        _cur.AppendMenuItem(MF_STRING, 14, GetText("Autoplaylist..."));
        _cur.AppendMenuSeparator();
    }
    _cur.AppendMenuItem(MF_STRING, 15, GetText("Save playlist..."));
    _cur.AppendTo(_menu, MF_STRING | MF_POPUP, GetText("Current Playlist"));
    _menu.AppendMenuSeparator();
    for (var i = 0; i != playlistCount; i++) {
        _menu.AppendMenuItem(MF_STRING, playlistId + i, fb.GetPlaylistName(i).replace(/\&/g, "&&") + " [" + fb.PlaylistItemCount(i) + "]" + (fb.IsAutoPlaylist(i) ? GetText(" (Auto)") :"") + (i == plman.PlayingPlaylist ? " 	(Now Playing)" :""));
        _menu.CheckMenuRadioItem(playlistId, playlistCount + playlistId - 1, fb.ActivePlaylist + playlistId);
    }
    var id = _menu.TrackPopupMenu(x, y);
    switch (id) {
      case 1:
        fb.RunMainMenuCommand(GetText("View/Playlist Manager"));
        break;

      case 2:
        var name = MWND.InputBox(GetText("Input playlist name"), GetText('If name is null, then will create a playlist autonamed with "Playlist #<number>"'), "", false);
        fb.ActivePlaylist = fb.CreatePlaylist(fb.playlistCount, name ? name :GetText("Playlist #") + (fb.PlaylistCount + 1).toString());
        break;

      case 3:
        var name = MWND.InputBox(GetText("Input autoplaylist name"), GetText('If name is null, then will create an autoplaylist autonamed with "Autolist #<number>"'), "", false);
        fb.ActivePlaylist = fb.CreateAutoPlaylist(fb.PlaylistCount, name ? name :GetText("Autolist #") + (fb.PlaylistCount + 1).toString(), "");
        fb.ShowAutoPlaylistUI(fb.ActivePlaylist);
        break;

      case 4:
        fb.RunMainMenuCommand(GetText("File/Save all playlists..."));
        break;

      case 5:
        fb.RunMainMenuCommand(GetText("File/Load playlist..."));
        break;

      //TODO
        case 9:
        if (isLocked) {
            unlockPlaylist(fb.ActivePlaylist);
        } else {
            lockPlaylist(fb.ActivePlaylist, FLAG_REMOVE_PLAYLIST);
        }
        break;

      case 10:
        fb.RunMainMenuCommand(GetText("Rename playlist"));
        break;

      case 11:
        fb.RunMainMenuCommand(GetText("Remove playlist"));
        break;

      case 12:
        fb.ActivePlaylist = plman.DuplicatePlaylist(fb.ActivePlaylist, plman.GetPlaylistName(fb.ActivePlaylist) + " - Dup");
        break;

      case 13:
        fb.DuplicatePlaylist(activePlaylistID, playlistName);
        fb.RemovePlaylist(activePlaylistID);
        fb.ActivePlaylist = activePlaylistID;
        break;

      case 14:
        fb.ShowAutoPlaylistUI(fb.ActivePlaylist);
        break;

      case 15:
        fb.RunMainMenuCommand("File/Save playlist...");
        break;
    }
    for (var i = 0; i != playlistCount; i++) {
        if (id == playlistId + i) fb.ActivePlaylist = i;
    }
    if (id >= 2e3) {
        switch (id) {
          case 2e3:
            var affectedItems = [];
            for (var i = 0; i < _prm.Count; i++) {
                affectedItems.push(i);
            }
            _prm.Purge(affectedItems);
            break;

          default:
            _prm.Count >= 1 && _prm.Restore(id - 2001);
        }
    }
    _plman.Dispose();
    _cur.Dispose();
    _menu.Dispose();
    _pr.Dispose();
}

// lock playlist:
// now it's limited to lock the playlist to un-removable.
// todo: sqlite
try {
    var fso = new ActiveXObject("Scripting.FileSystemObject");
} catch (e) {}

var ini_path = fb.ProfilePath + "\\playlists-v1.3\\locked";

if (!utils.FileTest(ini_path, "e") || !utils.FileTest(ini_path, "d")) fso.CreateFolder(ini_path);

var ini_path = ini_path + "\\";

function lockPlaylist(index, flag) {
    var name = plman.GetPlaylistName(index);
    var file = ini_path + name + ".ini";
    var section = "Playlist Lock";
    plman.PlaylistLock(index, flag);
    utils.WriteINI(file, section, "FLAG", flag);
}

function isLocked(index) {
    var name = plman.GetPlaylistName(index);
    var file = ini_path + name + ".ini";
    var section = "Playlist Lock";
    if (utils.FileTest(file, "e")) {
        return utils.ReadINI(file, section, "FLAG", 0);
    } else return 0;
}

function unlockPlaylist(index) {
    var name = plman.GetPlaylistName(index);
    var file = ini_path + name + ".ini";
    var section = "Playlist Lock";
    plman.PlaylistUnlock(index);
    if (isLocked(index)) fso.DeleteFile(file);
}

//---> init on player start
(function checkLock() {
    for (var i = 0; i < plman.PlaylistCount; i++) {
        if (isLocked(i)) {
            var section = "Playlist Lock";
            var file = ini_path + plman.GetPlaylistName(i) + ".ini";
            var flag = utils.ReadINI(file, section, "FLAG", 0);
            flag && plman.PlaylistLock(i, flag);
        }
    }
})();

function saveLockStatus() {
    for (var i = 0; i < plman.playlistCount; i++) {
        if (plman.IsPlaylistLocked(i)) {}
    }
}

// show and hide desktop lyric
function checkESLyricDesktop() {
    var eslyric = utils.CheckComponent("foo_uie_eslyric");
    if (!eslyric) return false;
    try {
        var lycWnd = utils.GetWND("uie_eslyric_desktop_wnd_class");
        return lycWnd.IsVisible();
    } catch (e) {
        return false;
    }
}

function ESlyricMenu(x, y) {
    var eslyric = utils.CheckComponent("foo_uie_eslyric");
    if (!eslyric) return;
    var lycWnd = utils.GetWND("uie_eslyric_desktop_wnd_class");
    var isVisible = lycWnd.IsVisible();
    var locked = lycWnd.ExStyle & WS_EX_TRANSPARENT ? true :false;
    var topped = lycWnd.ExStyle & WS_EX_TOPMOST ? true :false;
    var _menu = window.CreatePopupMenu();
    _menu.AppendMenuItem(MF_STRING, 1, GetText("显示桌面歌词"));
    _menu.CheckMenuItem(1, isVisible);
    _menu.AppendMenuItem(MF_STRING, 2, GetText("Online Search..."));
    if (isVisible) {
        _menu.AppendMenuSeparator();
        _menu.AppendMenuItem(MF_STRING, 3, GetText("ESLyric on top"));
        _menu.CheckMenuItem(3, topped);
        _menu.AppendMenuItem(MF_STRING, 4, GetText("Mouse through"));
        _menu.CheckMenuItem(4, locked);
    }
    _menu.AppendMenuSeparator();
    _menu.AppendMenuItem(MF_STRING, 5, GetText("Setting..."));
    var id = _menu.TrackPopupMenu(x, y);
    switch (id) {
      case 1:
        fb.RunMainMenuCommand(GetText("View/ESLyric/显示桌面歌词"));
        break;

      case 2:
        fb.RunMainMenuCommand(GetText("View/ESLyric/歌词搜索..."));
        break;

      case 3:
        fb.RunMainMenuCommand(GetText("View/ESLyric/置顶桌面歌词"));
        break;

      case 4:
        fb.RunMainMenuCommand(GetText("View/ESLyric/锁定桌面歌词"));
        break;

      case 5:
        fb.RunMainMenuCommand(GetText("View/ESLyric/配置..."));
        break;
    }
    _menu.Dispose();
}
