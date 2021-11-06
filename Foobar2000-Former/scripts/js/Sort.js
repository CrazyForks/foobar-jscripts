oSort = function (name) {
    this.$ = new oPanel(name, false);
    this.order = window.GetProperty('排序顺序', true);
    this.lock = window.GetProperty('排序锁定', false);
    this.only = window.GetProperty('排序选择项', false);
    this.key = 0;

    var deftxt = '自定义';
    var chs = ['标题', '专辑', '艺术家', '路径', '日期', '评级', '流派', '随机'];
    var eng = ['%title% - %artist% - %last_modified%',
	'%album% - %album artist% - %discnumber% - %tracknumber% - %filename% - %title%',
	'%artist% - %album% - %album artist% - %discnumber% - %tracknumber% - %filename% - %title%',
	'%path% - %filenam% - %title% - %artist%',
	'%date% - %album% - %album artist% - %discnumber% - %tracknumber% - %filename% - %title%',
	'$meta(RATING) - %album% - %album artist% - %discnumber% - %tracknumber% - %filename% - %title%',
	'%genre% - %album% - %album artist% - %discnumber% - %tracknumber% - %filename% - %title%',
	''];

    this.Init = function () {
        this.Input = new oInputBox(name + '.Input', 10, deftxt, ThemeStyle);
        if (this.lock)
            this.Input.str = window.GetProperty('排序模板', deftxt);
        this.Input.Key = function (vkey) {
            if (vkey == VKEY_RETURN && eval(name).Input.str != deftxt && eval(name).Input.str.length > 0)
                eval(name).Sort(eval(name).Input.str);
            else if (vkey == 0x1B) {
                eval(name).SetVisible(false);
                eval(name).$.Repaint(true);
            }
        }

        this.OnEnsure = function () {
            if (eval(name).Input.str != deftxt && eval(name).Input.str.length > 0)
                eval(name).Sort(eval(name).Input.str);
            eval(name).OnCancel();
        }
        this.OnCancel = function () {
            eval(name).SetVisible(false);
            eval(name).$.Repaint(true);
        }
        this.Ensure = new oButton(name + '.Ensure', '确定', this.OnEnsure, true, true);
        this.Cancel = new oButton(name + '.Cancel', '取消', this.OnCancel, true, true);

        this.OnMenuChosen = function () {
            eval(name).key = eval(name).Menu.idx;
            eval(name).Input.str = eng[eval(name).Menu.idx];
            eval(name).Input.$.Repaint();
            eval(name).Key.$.Repaint();
        }
        this.Menu = new oMenu(name + '.Menu', this.OnMenuChosen, true);
        this.Menu.items = chs;

        this.OnKeyChosen = function () {
            if (eval(name).Menu.$.visible)
                eval(name).Menu.Defocus();
            else
                eval(name).Menu.Show(chs.length * 20);
            return true;
        }
        this.Key = new oButton(name + '.Key', '', this.OnKeyChosen, true, true);
        this.Key.Paint = function (gr) {
            gr.GdiDrawText(chs[eval(name).key], ThemeStyle.smallFont, ThemeStyle.fgColor, this.$.x + 10, this.$.y, this.$.w - 30, this.$.h, DT_LV);
            Image.Draw(gr, g_arrow_icon, this.$.x + this.$.w - 18, this.$.y + 2, 0, 255);
        }

        this.OnAscend = function (state) {
            eval(name).order = true;
            eval(name).Descend.Exclusive();
            window.SetProperty('排序顺序', true);
        }
        this.Ascend = new oCheckBar(name + '.Ascend', '升序', this.order, this.OnAscend, TYPE_RADIO);
        this.OnDescend = function (state) {
            eval(name).order = false;
            eval(name).Ascend.Exclusive();
            window.SetProperty('排序顺序', false);
        }
        this.Descend = new oCheckBar(name + '.Descend', '降序', !this.order, this.OnDescend, TYPE_RADIO);
        this.OnLock = function (state) {
            eval(name).lock = state;
            if (state && eval(name).Input.str == deftxt);
            {
                eval(name).Input.str = window.GetProperty('排序模板', deftxt);
                eval(name).Input.$.Repaint();
            }
            window.SetProperty('排序锁定', state);
        }
        this.Lock = new oCheckBar(name + '.Lock', '强制锁定', this.lock, this.OnLock, TYPE_CHECK);
        this.OnOnly = function (state) {
            eval(name).only = state;
            eval(name).Ascend.Able(state);
            eval(name).Descend.Able(state);
            eval(name).Lock.Able(state);
            window.SetProperty('排序选择项', state);
        }
        this.Only = new oCheckBar(name + '.Only', '仅排序选择项', this.only, this.OnOnly, TYPE_CHECK);
    }
    this.Init();

    this.SetVisible = function (vis) {
        this.Input.$.visible = vis;
        this.Ensure.$.visible = vis;
        this.Cancel.$.visible = vis;
        this.Ascend.$.visible = vis;
        this.Descend.$.visible = vis;
        this.Lock.$.visible = vis;
        this.Only.$.visible = vis;
        this.Key.$.visible = vis;
        this.$.visible = vis;
        if (vis) {
            if (this.lock)
                this.Input.str = window.GetProperty('排序模板', deftxt);
            else
                this.Input.str = deftxt;
            this.key = 0;

            this.Ascend.gray = this.only;
            this.Descend.gray = this.only;
            this.Lock.gray = this.only;
        }
    }

    this.OnSize = function () {
        this.Input.$.Size(this.$.x + 15, this.$.y + 15, this.$.w - 100, 30, this.$.z + 1);
        this.Ensure.$.Size(this.$.x + this.$.w - 70, this.$.y + 15, 60, 30, this.$.z + 1);
        this.Cancel.$.Size(this.$.x + this.$.w - 70, this.$.y + 55, 60, 30, this.$.z + 1);

        this.Ascend.$.Size(this.$.x + this.$.w - 210, this.$.y + 50, 50, 20, this.$.z + 1);
        this.Descend.$.Size(this.$.x + this.$.w - 210, this.$.y + 70, 50, 20, this.$.z + 1);
        this.Lock.$.Size(this.$.x + 15, this.$.y + 50, 100, 20, this.$.z + 1);
        this.Only.$.Size(this.$.x + 15, this.$.y + 70, 100, 20, this.$.z + 1);
        this.Key.$.Size(this.$.x + this.$.w - 155, this.$.y + 60, 70, 20, this.$.z + 1);
        this.Menu.$.Size(this.$.x + this.$.w - 155, this.$.y + 80, 70, chs.length * 20, this.$.z + 2);
    }

    this.OnPaint = function (gr) {
        gr.FillSolidRect(this.$.x, this.$.y, this.$.w, this.$.h, ThemeStyle.bgColor);
        gr.DrawRect(this.$.x, this.$.y, this.$.w - 1, this.$.h - 1, 1, ThemeStyle.fgColor_l);
    }

    this.Sort = function (str) {
        if (str == deftxt) return;
        if (this.only) {
            var count = plman.GetPlaylistSelectedItems(plman.ActivePlaylist).Count;
            if (count > 1) {
                plman.SortByFormat(fb.ActivePlaylist, str, true);
                Console.Log('排序 ' + count + ' 项...');
            }
            else
                Console.Log('选择至少2项以上的排序目标');
        }
        else {
            if (this.lock)
                window.SetProperty('排序模板', str);
            plman.SortByFormatV2(fb.ActivePlaylist, str, this.order ? 1 : -1);
        }
    }
}

var Sort = null;

function ASort() {
    Sort.SetVisible(!Sort.$.visible);
    Sort.$.Repaint(true);
}