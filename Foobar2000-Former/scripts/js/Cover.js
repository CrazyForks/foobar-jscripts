COVER_ALBUM = 0;
COVER_BACK = 1;
COVER_DISC = 2;
COVER_ICON = 3;
COVER_ARTIST = 4;

ANIMATION_NONE = 0;
ANIMATION_ALPHA = 1;
ANIMATION_LEFT = 2;
ANIMATION_TOP = 3;
ANIMATION_RIGHT = 4;
ANIMATION_BOTTOM = 5;

SOURCE_XIAMI = 0;
SOURCE_LASTFM = 1;
/*
var Cover = new oCover('Cover');
Cover.$.Size(x, y, w, h, z);
Cover.OnUpdate = function(){}：封面更新完成回调函数
*/
oCover = function (name) {
    this.$ = new oPanel(name, false);
    this.Img = null;
    this.Image = null;
    this.Cache = null;
    this.NetCache = null;
    this.Animation = new oAnimation(name + '.Animation');

    this.state = window.GetProperty('封面类型', COVER_ALBUM);
    this.aspect = window.GetProperty('封面宽高比', IMG_ADAPT);
    this.option = window.GetProperty('封面选项', IMG_SHADOW);
    this.animation = window.GetProperty('封面动画', ANIMATION_ALPHA);
    this.source = window.GetProperty('封面下载源', SOURCE_XIAMI);
    this.embedded = window.GetProperty('封面内嵌优先', true);
    this.fuzzy = window.GetProperty('封面模糊匹配', true);
    this.force = window.GetProperty('封面强制匹配', false);
    this.autoDL = window.GetProperty('封面自动下载', false);
    this.cache = window.GetProperty('图片缓存上限', 50);

    this.SetProperty = function () {
        eval(name).source = window.GetProperty('封面下载源', SOURCE_XIAMI);
        eval(name).autoDL = window.GetProperty('封面自动下载', false);
        eval(name).cache = window.GetProperty('图片缓存上限', 50);
    }

    this.None = function (metadb, state) {
        if (metadb && Metadb.IsStream(metadb)) return Image.Get(FILE_NOSTREAM);
        if (state == COVER_ARTIST) return Image.Get(FILE_NOARTIST);
        else return Image.Get(FILE_NOCOVER);
    }

    this.Get = function () {
        var oimage = null;

        if (this.force)
            oimage = AlbumArt.GetAtLeast(Metadb.Handle(), this.state, this.embedded, this.fuzzy);
        else
            oimage = AlbumArt.Get(Metadb.Handle(), this.state, this.embedded, this.fuzzy);

        if (!oimage.$ && this.NetCache)
            oimage = Image.Clone(this.NetCache);
        if (!oimage.$)
            oimage = this.None(Metadb.Handle(), this.state);
        return oimage;
    }

    this.OnSize = function (resize) {
        if (!resize) return;
        this.Cache && Image.Clear(this.Cache.$);
        this.Img && Image.Clear(this.Img.image);
        this.Cache = this.Get();
        this.Img = new oImg(this.Cache, this.$.w, this.$.h, this.aspect, 0, 255, 2, IMG_CENTER, this.option);
    }

    this.SetVisible = function (vis) {
        this.$.visible = vis;
    }

    this.CheckState = function () {
        if (this.state < COVER_ALBUM) this.state = COVER_ARTIST;
        else if (this.state > COVER_ARTIST) this.state = COVER_ALBUM;
    }

    this.OnAnimation = function () {
        Image.Clear(eval(name).Img.image);
        eval(name).Img = null;
        eval(name).Img = eval(name).Image;
        eval(name).Image = null;
        $Invoke(name, 'OnUpdate');
    }

    this.Update = function (animation) {
        AlbumArt.timer && window.ClearInterval(AlbumArt.timer);
        AlbumArt.timer = null;
        Image.Clear(this.Cache.$);
        this.Cache.$ = null;

        this.Cache = this.Get();
        if (typeof (animation) == 'undefined') animation = this.animation;

        if (!this.$.visible || animation == ANIMATION_NONE) {
            Image.Clear(this.Img.image);
            this.Img = new oImg(this.Cache, this.$.w, this.$.h, this.aspect, 0, 255, 2, IMG_CENTER, this.option);

            this.$.Repaint();
            $Invoke(name, 'OnUpdate');
        }
        else if (animation != ANIMATION_ALPHA) {
            this.Image = new oImg(this.Cache, this.$.w, this.$.h, this.aspect, 0, 0, 2, IMG_CENTER, this.option);

            var objArr = null;
            if (animation == ANIMATION_LEFT) {
                this.Image.x = -this.$.w;
                objArr = [[this.Img, this.$.w, null, null, null, null, 0], [this.Image, 0, null, null, null, null, 255]];
            }
            else if (animation == ANIMATION_TOP) {
                this.Image.y = -this.$.h;
                objArr = [[this.Img, null, this.$.h, null, null, null, 0], [this.Image, null, 0, null, null, null, 255]];
            }
            else if (animation == ANIMATION_RIGHT) {
                this.Image.x = this.$.w;
                objArr = [[this.Img, -this.$.w, null, null, null, null, 0], [this.Image, 0, null, null, null, null, 255]];
            }
            else if (animation == ANIMATION_BOTTOM) {
                this.Image.y = this.$.h;
                objArr = [[this.Img, null, -this.$.h, null, null, null, 0], [this.Image, null, 0, null, null, null, 255]];
            }
            this.Animation.SSAV2(objArr, this.$, 8, this.OnAnimation);
        }
        else {
            this.Image = new oImg(this.Cache, this.$.w, this.$.h, this.aspect, 0, 0, 2, IMG_CENTER, this.option);

            this.Animation.AlphaV2([[this.Img, 255, 0], [this.Image, 0, 255]], this.$, 17, this.OnAnimation);
        }
    }

    this.Download = function (all) {
        if (!Metadb.Handle()) return;

        var artist = Metadb.TitleFormat('[%artist%]');
        var album = Metadb.TitleFormat('[%album%]');
        var title = Metadb.TitleFormat('[%title%]');

        if (all) {
            var file = artist.Validate().Trim();
            var search = $Match(PATH_ARTIST, file, ALBUMART_EXT, false);
            if (search == null) AlbumArt.Download(SOURCE_XIAMI, file, artist, null, title);

            file = album.Validate().Trim();
            search = $Match(PATH_ALBUM, file, ALBUMART_EXT, false);
            if (search == null) AlbumArt.Download(SOURCE_XIAMI, file, artist, album);
        }
        else {
            if (this.state == COVER_ARTIST) {
                var file = artist.Validate().Trim();
                if (file == '') {
                    Console.Log('请完善艺术家标签');
                    return;
                }
                var search = $Match(PATH_ARTIST, file, ALBUMART_EXT, false);
                if (search != null) {
                    Console.Log('存在: ' + search);
                    return;
                }
                else {
                    var tooltip = (this.source == SOURCE_XIAMI ? '虾米' : 'Lastfm');
                    Console.Log('源: ' + tooltip + ' 艺术家: ' + file);
                    AlbumArt.Download(this.source, file, artist, null, title);
                }
            }
            else {
                var file = album.Validate().Trim();
                if (file == '') {
                    Console.Log('请完善专辑标签');
                    return;
                }
                var search = $Match(PATH_ALBUM, file, ALBUMART_EXT, false)
                if (search != null) {
                    Console.Log('存在: ' + search);
                    return;
                }
                else {
                    var tooltip = (this.source == SOURCE_XIAMI ? '虾米' : 'Lastfm');
                    Console.Log('源: ' + tooltip + ' 专辑: ' + file);
                    AlbumArt.Download(this.source, file, artist, album);
                }
            }
        }
    }

    this.Menu = function (x, y) {
        var needUpdate = false;
        var enableMeta = this.Img.src && this.Img.src.indexOf('://') == -1;
        var m = window.CreatePopupMenu();

        var a = window.CreatePopupMenu();
        a.AppendMenuItem(0, 11, '适应');
        a.AppendMenuItem(0, 12, '填充');
        a.AppendMenuItem(0, 13, '拉伸');
        a.CheckMenuRadioItem(11, 13, this.aspect + 11);
        a.AppendTo(m, 0, '宽高比');

        var b = window.CreatePopupMenu();
        b.AppendMenuItem(0, 21, '封面');
        b.AppendMenuItem(0, 22, '封底');
        b.AppendMenuItem(0, 23, '唱片');
        b.AppendMenuItem(0, 24, '图标');
        b.AppendMenuItem(0, 25, '艺术家');
        b.CheckMenuRadioItem(21, 25, this.state + 21);
        b.AppendTo(m, 0, this.force ? '优先' : '类型');

        var c = window.CreatePopupMenu();
        c.AppendMenuItem(0, 31, '无');
        c.AppendMenuItem(0, 32, '阴影');
        c.AppendMenuItem(0, 33, '倒影');
        c.CheckMenuRadioItem(31, 33, this.option + 31);
        c.AppendTo(m, 0, '选项');

        var d = window.CreatePopupMenu();
        d.AppendMenuItem(0, 41, '无');
        d.AppendMenuItem(0, 42, '渐变');
        d.AppendMenuItem(0, 43, '左入');
        d.AppendMenuItem(0, 44, '上入');
        d.AppendMenuItem(0, 45, '右入');
        d.AppendMenuItem(0, 46, '下入');
        d.CheckMenuRadioItem(41, 46, this.animation + 41);
        d.AppendTo(m, 0, '动画');

        var e = window.CreatePopupMenu();
        e.AppendMenuItem(0, 51, '虾米');
        e.AppendMenuItem(0, 52, 'Lastfm');
        e.CheckMenuRadioItem(51, 52, this.source + 51);

        m.AppendMenuSeparator();
        m.AppendMenuItem(Metadb.Handle() ? 0 : 1, 1, '下载');
        m.AppendMenuItem(this.autoDL ? 8 : 0, 2, '自动');
        e.AppendTo(m, 0, '下载源');

        m.AppendMenuSeparator();
        m.AppendMenuItem(this.embedded ? 8 : 0, 3, '内嵌优先');
        m.AppendMenuItem(this.fuzzy ? 8 : 0, 4, '模糊匹配');
        m.AppendMenuItem(this.force ? 8 : 0, 5, '强制匹配');
        m.AppendMenuSeparator();
        m.AppendMenuItem(Metadb.EnableMeta(Metadb.Handle()) ? 0 : 1, 6, '管理内嵌图像');
        m.AppendMenuItem(enableMeta ? 0 : 1, 7, '打开图像目录');
        m.AppendMenuItem(enableMeta ? 0 : 1, 8, '打开外部图像');
        m.AppendMenuItem(enableMeta ? 0 : 1, 9, '删除外部图像');

        var idx = m.TrackPopupMenu(x, y);
        switch (true) {
            case (idx >= 11 && idx <= 13):
                this.aspect = idx - 11;
                window.SetProperty('封面宽高比', this.aspect);
                needUpdate = true;
                break;

            case (idx >= 21 && idx <= 25):
                this.state = idx - 21;
                window.SetProperty('封面类型', this.state);
                needUpdate = true;
                break;

            case (idx >= 31 && idx <= 33):
                this.option = idx - 31;
                window.SetProperty('封面选项', this.option);
                needUpdate = true;
                break;

            case (idx >= 41 && idx <= 46):
                this.animation = idx - 41;
                window.SetProperty('封面动画', this.animation);
                needUpdate = true;
                break;

            case (idx >= 51 && idx <= 52):
                this.source = idx - 51;
                window.SetProperty('封面下载源', this.source);
                break;

            case (idx == 1):
                this.Download();
                break;

            case (idx == 2):
                this.autoDL = this.autoDL ? false : true;
                window.SetProperty('封面自动下载', this.autoDL);
                break;

            case (idx == 3):
                this.embedded = this.embedded ? false : true;
                window.SetProperty('封面内嵌优先', this.embedded);
                needUpdate = true;
                break;

            case (idx == 4):
                this.fuzzy = this.fuzzy ? false : true;
                window.SetProperty('封面模糊匹配', this.fuzzy);
                needUpdate = true;
                break;

            case (idx == 5):
                this.force = this.force ? false : true;
                window.SetProperty('封面强制匹配', this.force);
                needUpdate = true;
                break;

            case (idx == 6):
                fb.RunContextCommand('管理内嵌图像');
                break;

            case (idx == 7):
                $Explorer(this.Img.src);
                break;

            case (idx == 8):
                if (ALBUMART_EXT.indexOf($GetExt(this.Img.src).toLowerCase()) != -1) {
                    var fso = $Fso();
                    if (fso.FileExists(this.Img.src)) $ImageView(this.Img.src);
                    fso = null;
                }
                else Console.Log('内嵌图像无法打开');
                break;

            case (idx == 9):
                if (ALBUMART_EXT.indexOf($GetExt(this.Img.src).toLowerCase()) != -1) {
                    var fso = $Fso();
                    if (fso.FileExists(this.Img.src)) fso.DeleteFile(this.Img.src);
                    fso = null;
                    this.Update();
                }
                else Console.Log('内嵌图像无法删除');
                break;

            default:
                break;
        }

        a.Dispose();
        b.Dispose();
        c.Dispose();
        d.Dispose();
        e.Dispose();
        m.Dispose();
        return needUpdate;
    }

    this.OnMouse = function (event, x, y) {
        switch (event) {
            case ON_MOUSE_LBTN_DBLCK:
                this.Download();
                break;

            case ON_MOUSE_RBTN_UP:
                if (this.Menu(x, y)) {
                    this.Update();
                }
                break;

            case ON_MOUSE_WHEEL:
                if (x > 0) {
                    this.state++;
                    this.CheckState();
                    window.SetProperty('封面类型', this.state);
                    this.Update(ANIMATION_BOTTOM);
                }
                else {
                    this.state--;
                    this.CheckState();
                    window.SetProperty('封面类型', this.state);
                    this.Update(ANIMATION_TOP);
                }
                break;

            default:
                break;
        }
    }

    this.OnPaint = function (gr) {
        if (this.Image)
            this.Image.Paint(gr, this.$.x, this.$.y);
        if (this.Img)
            this.Img.Paint(gr, this.$.x, this.$.y);
    }
}

var Cover = null;
