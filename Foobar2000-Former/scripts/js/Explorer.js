oDrive = function (letter, type, name, id) {
    this.letter = letter;
    this.type = type;
    this.id = id;
    this.name = name == '' ? '本地磁盘' : name;
    this.selected = false;

    this.getType = function () {
        return 0;
    }

    this.Action = function (event) {
        if (event == ON_MOUSE_LBTN_DBLCK) {
            Explorer.ListFiles(this.letter + ':');
        }
    }

    this.Paint = function (gr, x, y, w, h) {
        if (this.id & 1)
            gr.FillSolidRect(x, y, w, h, ThemeStyle.bgColor_l);
        else
            gr.FillSolidRect(x, y, w, h, ThemeStyle.bgColor);
        if (this.selected)
            gr.FillSolidRect(x, y, w, h, ThemeStyle.bgColor_hl);

        gr.GdiDrawText(this.name + ' (' + this.letter + ':)', ThemeStyle.font, ThemeStyle.fgColor, x + $Z(20), y, w - $Z(40), $Z(35), DT_LV);
        if (this.type < Explorer.driverType.length)
            gr.GdiDrawText(Explorer.driverType[this.type], ThemeStyle.smallFont, ThemeStyle.fgColor_l, x + $Z(30), y + $Z(35), w - $Z(50), $Z(25), DT_LV);
    }
}

oFolder = function (path, name, id) {
    this.path = path;
    this.name = name;
    this.id = id;
    this.selected = false;

    this.getType = function () {
        return this.id == 0 ? -1 : 1;
    }

    this.Action = function (event) {
        if (event == ON_MOUSE_LBTN_DBLCK) {
            Explorer.ListFiles(this.path, this.id == 0);
        }
    }

    this.Paint = function (gr, x, y, w, h) {
        if (this.id & 1)
            gr.FillSolidRect(x, y, w, h, ThemeStyle.bgColor_l);
        else
            gr.FillSolidRect(x, y, w, h, ThemeStyle.bgColor);
        if (this.selected)
            gr.FillSolidRect(x, y, w, h, ThemeStyle.bgColor_hl);

        gr.GdiDrawText(this.name, ThemeStyle.font, ThemeStyle.fgColor, x + $Z(20), y, w - $Z(40), h, DT_LV);
    }
}

oFile = function (name, id, size, type, path, attr) {
    this.name = name;
    this.size = $SizeFormat(size);
    this.type = type;
    this.path = path;
    this.attr = attr;
    this.id = id;
    this.selected = false;

    this.getType = function () {
        return 2;
    }

    this.Action = function (event) {
        if (event == ON_MOUSE_LBTN_DBLCK) {
            $Run('"' + this.path + '"');
        }
    }

    this.Paint = function (gr, x, y, w, h) {
        if (this.id & 1)
            gr.FillSolidRect(x, y, w, h, ThemeStyle.bgColor_l);
        else
            gr.FillSolidRect(x, y, w, h, ThemeStyle.bgColor);
        if (this.selected)
            gr.FillSolidRect(x, y, w, h, ThemeStyle.bgColor_hl);

        gr.GdiDrawText(this.name, ThemeStyle.font, ThemeStyle.fgColor, x + $Z(20), y, w - $Z(40), $Z(35), DT_LV);
        gr.GdiDrawText(this.type + ' : ' + this.size, ThemeStyle.smallFont, ThemeStyle.fgColor_l, x + $Z(30), y + $Z(35), w - $Z(50), $Z(20), DT_LV);
    }
}

var Explorer = new oListView('Explorer', $Z(60), ENABLE_SELECT);

Explorer.title = '资源管理';
Explorer.path = '';
Explorer.driverType = ['', 'FAT32', 'NTFS'];
Explorer.showHidden = window.GetProperty("显示隐藏文件/文件夹", false);
Explorer.showOnlySupported = window.GetProperty("仅显示支持文件", true);

Explorer.Init = function () {
    this.start = 0;
    this.select = -1;
    this.count = this.items.length;
    this.$.offsetY = 0;
    this.$.totalY = this.count * this.rowHeight;
    if (this.sized) {
        this.OnSize();
    }
}

Explorer.Trace = function (path) {
    regexp = /(.*)\\(.*)\.(\w+)$/ig;
    folderpath = path.replace(regexp, "$1");
    this.ListFiles(folderpath + '\\');
}

Explorer.ListDrives = function () {
    this.items.splice(0, this.items.length);

    var fso = $Fso();
    var e = new Enumerator(fso.Drives);
    var id = 0;
    for (; !e.atEnd(); e.moveNext()) {
        x = e.item();
        if (x.IsReady) {
            this.items.push(new oDrive(x.DriveLetter, x.DriveType, x.VolumeName, id));
            id++;
        }
    }
    this.Init();
}

Explorer.ListFiles = function (dir, prnt) {
    var item, fn, f = false, fp = false;
    var fso = $Fso();
    dir += '\\';
    if (fso.FolderExists(dir)) {
        fp = fso.GetFolder(dir);
        f = prnt ? fp.ParentFolder : fp;
    } else {
        parent = dir.split('\\');
        for (var i = parent.length; i >= 0; i--) {
            parent.pop();
            path = parent.join('\\');
            if (fso.FolderExists(path)) {
                fp = fso.GetFolder(path);
                f = prnt ? fp.ParentFolder : fp;
                break;
            }
            else continue;
        }
    }

    if (fp && prnt && fp.IsRootFolder) {
        this.ListDrives();
    } else if (f) {
        this.items.splice(0, this.items.length);
        this.path = f.Path;
        fc = new Enumerator(f.SubFolders);
        this.items.push(new oFolder(this.path, '...', 0));
        var id = 1;
        for (; !fc.atEnd(); fc.moveNext()) {
            item = fc.item();
            if (!this.showHidden) {
                attr = item.Attributes >= 1024 ? item.Attributes - 1040 : item.Attributes - 16;
                if (attr != 2 && attr != 3 && attr != 6 && attr != 7) {
                    this.items.push(new oFolder(item.Path, item.Name, id));
                    id++;
                }
            }
            else {
                this.items.push(new oFolder(item.Path, item.Name, id));
                id++;
            }
        }

        fc = new Enumerator(f.files);
        for (; !fc.atEnd(); fc.moveNext()) {
            item = fc.item();
            if (this.showOnlySupported) {
                fn = fc.item().Name;
                regexp = /(.*)\.(\w+)$/ig;
                ext = fn.replace(regexp, "$2");
                exts = "8|669|7z|8svx|aac|ac3|adp|afc|ahx|aif|aifc|aiff|amf|ape|apl|asf|asx|au|brr|bw|cda|cdx|cue|dsm|dsp|dts|dtswav|eam|fla|flac|flv|fpl|gbs|gcm|gym|hes|hps|hvl|idsp|it|j2b|jma|kss|kwf|lha|m3u|m3u8|m4a|m4b|m4r|mac|map|midi|mka|mod|mp+|mp1|mp2|mp3|mp4|mpc|mpf|mpp|mss|mtm|mus|nsf|nsfe|nwa|oga|ogg|ogx|opus|org|pcm|pls|psm|ptm|px|qsf|rxw|s3m|sap|snd|sng|spc|spd|spt|spu|spx|stm|str|svx|tfmx|umx|unix|vgm|w64|waf|wav|wave|wax|wdt|wma|wpd|wv|wvx|xm|zip|677";
                r = exts.match(ext.toLowerCase());
                if (r != null) {
                    if (!this.showHidden) {
                        attr = item.Attributes >= 2048 ? item.Attributes - 2048 : (item.Attributes >= 1024 ? item.Attributes - 1024 : (item.Attributes >= 32 ? item.Attributes - 32 : item.Attributes));
                        if (attr != 2 && attr != 3 && attr != 6 && attr != 7) {
                            this.items.push(new oFile(fc.item().Name, id, fc.item().Size, fc.item().Type, fc.item().Path, fc.item().Attributes));
                            id++;
                        }
                    } else {
                        this.items.push(new oFile(fc.item().Name, id, fc.item().Size, fc.item().Type, fc.item().Path, fc.item().Attributes));
                        id++;
                    }
                }
            } else if (!this.showHidden) {
                attr = item.Attributes >= 2048 ? item.Attributes - 2048 : (item.Attributes >= 1024 ? item.Attributes - 1024 : (item.Attributes >= 32 ? item.Attributes - 32 : item.Attributes));
                if (attr != 2 && attr != 3 && attr != 6 && attr != 7) {
                    this.items.push(new oFile(fc.item().Name, id, fc.item().Size, fc.item().Type, fc.item().Path, fc.item().Attributes));
                    id++;
                }
            } else {
                this.items.push(new oFile(fc.item().Name, id, fc.item().Size, fc.item().Type, fc.item().Path, fc.item().Attributes));
                id++;
            }
        }
        this.Init();
    } else {
        this.ListDrives();
    }
}

Explorer.Mouse = function (event, x, y) {
    switch (event) {
        case ON_MOUSE_LBTN_DBLCK:
            this.items[this.select].Action(ON_MOUSE_LBTN_DBLCK);
            break;

        case ON_MOUSE_RBTN_UP:
            this.Menu(x, y);
            break;
    }
}

Explorer.Menu = function (x, y) {
    var p = window.CreatePopupMenu();
    p.AppendMenuItem(this.items[this.select].getType() > 0 ? 0 : 1, 1, '根目录');
    p.AppendMenuItem(this.items[this.select].getType() == -1 ? 1 : 0, 2, '添加资源');
    p.AppendMenuItem(this.items[this.select].getType() == -1 ? 1 : 0, 3, '打开资源管理器');
    p.AppendMenuSeparator();
    p.AppendMenuItem(this.showHidden ? 8 : 0, 4, '显示隐藏文件/文件夹');
    p.AppendMenuItem(this.showOnlySupported ? 8 : 0, 5, '仅显示支持文件');
    p.AppendMenuItem(fb.GetNowPlaying() ? 0 : 1, 6, '当前播放');

    var idx = p.TrackPopupMenu(x, y);
    switch (idx) {
        case 1:
            root = this.path.replace(/(\w\:\\)(.*)/ig, "$1");
            f = $Fso().GetFolder(root);
            this.ListFiles(f.Path);
            break;

        case 2:
            if (this.items[this.select].getType() == 0) {
                $Run('"' + fb.FoobarPath + '\\foobar2000.exe" /add ' + '"' + this.items[this.select].letter + '" /immediate');
            } else {
                $Run('"' + fb.FoobarPath + '\\foobar2000.exe" /add ' + '"' + this.items[this.select].path + '" /immediate');
            }
            break;

        case 3:
            if (this.items[this.select].getType() == 0) {
                $Explorer('"' + this.items[this.select].letter + ':\\' + '"');
            } else if (this.items[this.select].getType() != -1) {
                $Explorer(this.items[this.select].path);
            }
            break;

        case 4:
            this.showHidden = this.showHidden ? false : true;
            window.SetProperty("显示隐藏文件/文件夹", this.showHidden);
            this.Trace(this.path);
            break;

        case 5:
            this.showOnlySupported = this.showOnlySupported ? false : true;
            window.SetProperty("仅显示支持文件", this.showOnlySupported);
            this.Trace(this.path);
            break;

        case 6:
            this.Trace(fb.GetNowPlaying().Path);
            break;

        default: break;
    }
    p.Dispose();
}