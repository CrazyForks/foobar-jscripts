oSearch = function (name) {
    this.$ = new oPanel(name, true);
    this.Animation = new oAnimation(name + '.Animation');

    this.padding = 5;
    this.key = window.GetProperty('搜索关键字', 0);
    this.whole = window.GetProperty('搜索全词匹配', false);
    this.cases = window.GetProperty('搜索大小写匹配', true);
    this.zch = window.GetProperty('搜索简繁体匹配', true);
    this.pos = -1;
    this.tf = null;

    var chs = ['全部', '标题', '专辑', '艺术家', '文件名', '日期', '评级', '流派'];

    this.Init = function () {
        this.Input = new oInputBox(name + '.Input', 10, '搜索', ThemeStyle);
        this.Input.Char = function (code) {
            eval(name).pos = -1;
        }
        this.Input.Key = function (vkey) {
            if (vkey == VKEY_BACK)
                eval(name).pos = -1;
            else if (vkey == VKEY_RETURN)
                eval(name).SearchAll(eval(name).Input.str);
            else if (vkey == VKEY_UP)
                eval(name).SearchPrev(eval(name).Input.str);
            else if (vkey == VKEY_DOWN)
                eval(name).SearchNext(eval(name).Input.str);
            else if (vkey == 0x1B) {
                eval(name).Hide();
            }
        }

        this.OnPrev = function () {
            eval(name).SearchPrev(eval(name).Input.str);
            return true;
        }
        this.OnNext = function () {
            eval(name).SearchNext(eval(name).Input.str);
            return true;
        }
        this.OnCancel = function () {
            eval(name).Hide();
        }
        this.OnSend = function () {
            eval(name).SearchAll(eval(name).Input.str);
            return true;
        }
        this.Prev = new oButton(name + '.Prev', '上一个', this.OnPrev, true, true);
        this.Next = new oButton(name + '.Next', '下一个', this.OnNext, true, true);
        this.Cancel = new oButton(name + '.Cancel', '取消', this.OnCancel, true, true);
        this.Send = new oButton(name + '.Send', '新建列表', this.OnSend, true, true);

        this.OnMenuChosen = function () {
            eval(name).Convert(null, eval(name).Menu.idx);
            eval(name).Key.$.Repaint();
        }
        this.Menu = new oMenu(name + '.Menu', this.OnMenuChosen, true);
        this.Menu.items = chs;

        this.OnKeyChosen = function () {
            if (eval(name).Menu.$.visible)
                eval(name).Menu.Defocus();
            else
                eval(name).Menu.Show();
            return true;
        }
        this.Key = new oButton(name + '.Key', '', this.OnKeyChosen, true, true);
        this.Key.Paint = function (gr) {
            gr.GdiDrawText(chs[eval(name).key], ThemeStyle.smallFont, ThemeStyle.fgColor, this.$.x + 10, this.$.y, this.$.w - 30, this.$.h, DT_LV);
            Image.Draw(gr, g_arrow_icon, this.$.x + this.$.w - 18, this.$.y + 2, 0, 255);
        }

        this.OnWhole = function (state) {
            eval(name).whole = state;
            window.SetProperty('搜索全词匹配', state);
        }
        this.Whole = new oCheckBar(name + '.Whole', '全词匹配', this.whole, this.OnWhole, TYPE_CHECK);
        this.OnCase = function (state) {
            eval(name).cases = state;
            window.SetProperty('搜索大小写匹配', state);
        }
        this.Case = new oCheckBar(name + '.Case', '大小写匹配', this.cases, this.OnCase, TYPE_CHECK);
        this.OnZch = function (state) {
            eval(name).zch = state;
            window.SetProperty('搜索简繁体匹配', state);
        }
        this.Zch = new oCheckBar(name + '.Zch', '简繁体匹配', this.zch, this.OnZch, TYPE_CHECK);
    }
    this.Init();

    this.Show = function () {
        this.SetVisible(true);

        this.Animation.SSA(this.$, this.$.x - this.padding, this.$.y - this.padding, this.$.w + 2 * this.padding, this.$.h + 2 * this.padding, null, null, this.$, 4, OnShow = function () {
            eval(name).$.Show();
            Panel.Analog(eval(name).Input, ON_MOUSE_MOVE);
            Panel.Analog(eval(name).Input, ON_MOUSE_LBTN_DOWN);
            Panel.Analog(eval(name).Input, ON_MOUSE_LBTN_UP);
            Panel.Analog(eval(name).Input, ON_MOUSE_LBTN_DBLCK);
            Panel.Analog(eval(name), ON_MOUSE_MOVE);
        });
    }

    this.Hide = function () {
        var client = {x: this.$.x, y: this.$.y, w: this.$.w, h: this.$.h};
        this.Animation.SSA(this.$, this.$.x + this.padding, this.$.y + this.padding, this.$.w - 2 * this.padding, this.$.h - 2 * this.padding, null, null, client, 4, OnHide = function () {
            eval(name).SetVisible(false);
            $RepaintRect(client.x, client.y, client.w, client.h);
        });
    }

    this.SetVisible = function (vis) {
        this.Input.$.visible = vis;
        this.Prev.$.visible = vis;
        this.Next.$.visible = vis;
        this.Cancel.$.visible = vis;
        this.Send.$.visible = vis;
        this.Key.$.visible = vis;
        this.Whole.$.visible = vis;
        this.Case.$.visible = vis;
        this.Zch.$.visible = vis;
        this.$.visible = vis;
        Panel.Analog(this, ON_MOUSE_MOVE);
    }

    this.OnSize = function () {
        this.Input.$.Size(this.$.x + 15, this.$.y + 20, this.$.w - 100, 30, this.$.z + 1);
        this.Prev.$.Size(this.$.x + this.$.w - 70, this.$.y + 20, 60, 30, this.$.z + 1);
        this.Next.$.Size(this.$.x + this.$.w - 70, this.$.y + 55, 60, 30, this.$.z + 1);
        this.Cancel.$.Size(this.$.x + this.$.w - 70, this.$.y + 100, 60, 30, this.$.z + 1);
        this.Key.$.Size(this.$.x + this.$.w - 155, this.$.y + 60, 70, 20, this.$.z + 1);
        this.Menu.$.Size(this.$.x + this.$.w - 155, this.$.y + 80, 70, chs.length * 20, this.$.z + 2);
        this.Send.$.Size(this.$.x + this.$.w - 155, this.$.y + 100, 70, 30, this.$.z + 1);
        this.Whole.$.Size(this.$.x + 15, this.$.y + 60, 100, 20, this.$.z + 1);
        this.Case.$.Size(this.$.x + 15, this.$.y + 85, 100, 20, this.$.z + 1);
        this.Zch.$.Size(this.$.x + 15, this.$.y + 110, 100, 20, this.$.z + 1);
    }

    this.Invalid = function () {
        this.$.click = false;
        if (this.$.drag) {
            this.$.drag = false;
            Drag.End();
            this.$.Repaint();
        }
    }

    this.OnMouse = function (event, x, y) {
        if (event == ON_MOUSE_LBTN_DOWN) {
            this.$.click = true;
        } else if (event == ON_MOUSE_LBTN_UP) {
            this.Invalid();
        } else if (event == ON_MOUSE_MOVE) {
            this.$.Move(x, y);
        }
    }

    this.OnPaint = function (gr) {
        gr.FillSolidRect(this.$.x, this.$.y, this.$.w, this.$.h, ThemeStyle.bgColor);
        gr.DrawRect(this.$.x, this.$.y, this.$.w - 1, this.$.h - 1, 1, ThemeStyle.fgColor_l);
    }

    this.Convert = function (str, num) {
        var eng = ['all', 'title', 'album', 'artist', 'filename', 'date', 'rating', 'genre'];
        if (str != null) {
            var temp = str.toLowerCase();
            for (var i = 0; i < eng.length; i++) {
                if (temp == chs[i] || temp == eng[i]) {
                    this.tf = eng[i];
                    this.key = i;
                    window.SetProperty('搜索关键字', this.key);
                    break;
                }
                else {
                    this.key = -1;
                    window.SetProperty('搜索关键字', this.key);
                }
            }
        }
        else {
            if (isNaN(num) || num < 0 || num >= eng.length) {
                num = 0;
            }
            this.tf = eng[num];
            this.key = num;
            window.SetProperty('搜索关键字', this.key);
        }
    }
    this.Convert(null, this.key);

    this.SearchNext = function (str) {
        if (this.pos > Playlist.count - 1)
            this.pos = -1;

        var tf = '';
        if (this.tf == 'all') {
            tf = '[%title%-][%album%-][%artist%-][%filename%-][%date%-][%rating%-][%genre%]';
        }
        else {
            tf = '[%' + this.tf + '%]';
        }
        var key = '', pattern = str, flag = '';
        if (this.zch)
            pattern = utils.LCMapString(str, 0x0800, 0x02000000);
        if (this.whole)
            pattern = '\\b' + pattern + '\\b';
        if (this.cases)
            flag = 'i';
        var reg = $RegExp(pattern, flag);

        for (var i = this.pos + 1; i < Playlist.count; i++) {
            key = Metadb.TitleFormat(tf, Playlist.items[i].metadb);
            if (this.zch)
                key = utils.LCMapString(key, 0x0800, 0x02000000);

            if (key.match(reg)) {
                this.pos = i;
                plman.SetPlaylistFocusItem(Playlist.id, this.pos);
                delete reg;
                return;
            }
        }
        delete reg;
        Console.Log('已无下一个');
    }

    this.SearchPrev = function (str) {
        if (this.pos > Playlist.count - 1)
            this.pos = -1;

        var tf = '';
        if (this.tf == 'all') {
            tf = '[%title%-][%album%-][%artist%-][%filename%-][%date%-][%rating%-][%genre%]';
        }
        else {
            tf = '[%' + this.tf + '%]';
        }
        var key = '', pattern = str, flag = '';
        if (this.zch)
            pattern = utils.LCMapString(str, 0x0800, 0x02000000);
        if (this.whole)
            pattern = '\\b' + pattern + '\\b';
        if (this.cases)
            flag = 'i';
        var reg = $RegExp(pattern, flag);

        for (var i = this.pos - 1; i >= 0; i--) {
            key = Metadb.TitleFormat(tf, Playlist.items[i].metadb);
            if (this.zch)
                key = utils.LCMapString(key, 0x0800, 0x02000000);

            if (key.match(reg)) {
                this.pos = i;
                plman.SetPlaylistFocusItem(Playlist.id, this.pos);
                delete reg;
                return;
            }
        }
        delete reg;
        Console.Log('已无上一个');
    }

    this.SearchAll = function (str) {
        if (this.pos > Playlist.count - 1)
            this.pos = -1;

        var tf = '';
        if (this.tf == 'all') {
            tf = '[%title%-][%album%-][%artist%-][%filename%-][%date%-][%rating%-][%genre%]';
        }
        else {
            tf = '[%' + this.tf + '%]';
        }
        var key = '', pattern = str, flag = '';
        if (this.zch)
            pattern = utils.LCMapString(str, 0x0800, 0x02000000);
        if (this.whole)
            pattern = '\\b' + pattern + '\\b';
        if (this.cases)
            flag = 'i';
        var reg = $RegExp(pattern, flag);

        var handles = plman.GetPlaylistItems(-1);
        for (var i = 0; i < Playlist.count; i++) {
            key = Metadb.TitleFormat(tf, Playlist.items[i].metadb);
            if (this.zch)
                key = utils.LCMapString(key, 0x0800, 0x02000000);

            if (key.match(reg)) {
                handles.Add(Playlist.items[i].metadb);
            }
        }
        delete reg;
        fb.CreatePlaylist(fb.PlaylistCount, str);
        fb.ActivePlaylist = fb.PlaylistCount - 1;
        plman.InsertPlaylistItems(fb.ActivePlaylist, 0, handles, true);
        Console.Log('找到' + handles.Count + '项');
        handles.Dispose();
        handles = null;
    }
}

var Search = null;

function ASearch(x, y, z) {
    if (Search) {
        if (Search.$.visible)
            Search.Hide();
        else
            Search.Show();
    }
    else {
        Search = new oSearch('Search');
        Search.$.Size(x + Search.padding, y + Search.padding, 280 - 2 * Search.padding, 150 - 2 * Search.padding, z);
        Panel.Sort();
        Search.Show();
    }
}