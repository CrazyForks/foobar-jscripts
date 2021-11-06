URL_UPDATE = 'http://pan.baidu.com/s/1qWxMfEk';

//Path
PATH_ROOT = fb.FoobarPath;
PATH_IMG = PATH_ROOT + 'skins\\images\\';
PATH_ICO = PATH_ROOT + 'skins\\icons\\';
PATH_WP = PATH_ROOT + 'skins\\wallpapers\\';
PATH_SCR = PATH_ROOT + 'skins\\scripts\\';

PATH_DATA = PATH_ROOT + 'data\\';
PATH_ALBUM = PATH_DATA + 'albums\\';
PATH_ARTIST = PATH_DATA + 'artists\\';
PATH_TEMP = PATH_DATA + 'temps\\'
PATH_TXT = PATH_DATA + 'texts\\';
PATH_LRC = PATH_DATA + 'lyrics\\';
PATH_MEDIA = PATH_DATA + 'media\\';
PATH_CAPTURE = PATH_DATA + 'capture\\';

PATH_CACHE = PATH_ROOT + 'caches\\';
PATH_IMAGE = PATH_CACHE + 'images\\';

//File
FILE_DL = PATH_SCR + 'ws\\Download.js';
FILE_WY = PATH_SCR + 'ws\\WangYi.js';
//FILE_WS = PATH_SCR + 'tool\\WebSearch.js';
FILE_ASX = PATH_MEDIA + '_temp.asx';
FILE_NOCOVER = PATH_IMG + 'nocover.jpg';
FILE_NOARTIST = PATH_IMG + 'noartist.jpg';
FILE_NOSTREAM = PATH_IMG + 'nostream.jpg';

//AlbumArt Source
ALBUMART_COVER = 'cover|font|folder|[%album%]|[%title%]|%filename%';
ALBUMART_COVER += '|' + PATH_ALBUM + '[%album%]';

ALBUMART_BACK = 'back';
ALBUMART_DISC = 'medium|media|disc|cd|dvd';
ALBUMART_ICON = 'icon';

ALBUMART_ARTIST = 'artist|[%artist%]';
ALBUMART_ARTIST += '|' + PATH_ARTIST + '[%artist%]';

ALBUMART_EXT = 'jpg|jpeg|png|bmp|gif';
EMBED_EXT = 'mp3|m4a|aac|flac';

//GDIDrawText
DT_LV = 0x00000000 | 0x00000004 | 0x00000020 | 0x00000400 | 0x00000800 | 0x00008000;
DT_CV = 0x00000001 | 0x00000004 | 0x00000020 | 0x00000400 | 0x00000800 | 0x00008000;
DT_RV = 0x00000002 | 0x00000004 | 0x00000020 | 0x00000400 | 0x00000800 | 0x00008000;
DT_LVN = 0x00000000 | 0x00000004 | 0x00000020 | 0x00000400 | 0x00000800;
DT_CVN = 0x00000001 | 0x00000004 | 0x00000020 | 0x00000400 | 0x00000800;

//Flag
ColorTypeCUI = {
    text: 0,
    selection_text: 1,
    inactive_selection_text: 2,
    background: 3,
    selection_background: 4,
    inactive_selection_background: 5,
    active_item_frame: 6
}

FontTypeCUI = {
    items: 0,
    labels: 1
}

ColorTypeDUI = {
    text: 0,
    background: 1,
    highcolor: 2,
    selection: 3
}

FontTypeDUI = {
    defaults: 0,
    tabs: 1,
    lists: 2,
    playlists: 3,
    statusbar: 4,
    console: 5
}

InstanceType = {
    DUI: 1,
    CUI: 0
}

KMask = {
    none: 0,
    ctrl: 1,
    shift: 2,
    ctrlshift: 3,
    ctrlalt: 4,
    ctrlaltshift: 5
}

function ProcessTimer(millseconds) {
    // body...
    window.SetTimeout(function () {
        if (typeof (on_process_time) == 'function')
            on_process_time();
        ProcessTimer(millseconds);
    }, millseconds);
}
