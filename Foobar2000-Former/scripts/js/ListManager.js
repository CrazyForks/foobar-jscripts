/*oListView 实例化*/
oListManagerItem = function (id) {
    this.id = id;
    this.selected = false;

    this.Paint = function (gr, x, y, w, h) {
        if (this.id & 1)
            gr.FillSolidRect(x, y, w, h, ThemeStyle.bgColor_l);
        else
            gr.FillSolidRect(x, y, w, h, ThemeStyle.bgColor);
        if (this.selected)
            gr.FillSolidRect(x, y, w, h, ThemeStyle.bgColor_hl);

        var color = 0;
        if (this.id == fb.PlayingPlaylist && fb.IsPlaying) {
            color = ThemeStyle.fgColor_hl;
            if (Playlist.isp)
                Image.Draw(gr, g_isp1_icon, x + $Z(23), Math.floor(y + (h - g_isp1_icon.Height) / 2), 0, 255);
            else
                Image.Draw(gr, g_isp2_icon, x + $Z(23), Math.floor(y + (h - g_isp1_icon.Height) / 2), 0, 255);
        }
        else {
            color = ThemeStyle.fgColor;
            gr.GdiDrawText(this.id + 1, ThemeStyle.font, color, x + $Z(5), y, $Z(50), h, DT_CV);
        }
        gr.GdiDrawText(plman.GetPlaylistName(this.id), ThemeStyle.font, color, x + $Z(60), y, w - $Z(120), h, DT_LV);
        gr.GdiDrawText(plman.PlaylistItemCount(this.id), ThemeStyle.font, color, x + w - $Z(60), y, $Z(50), h, DT_RV);
    }
}

var ListManager = new oListView('ListManager', $Z(35), ENABLE_DRAG);
ListManager.title = '列表管理';

ListManager.OnTime = function () {
    if (this.start <= fb.PlayingPlaylist && fb.PlayingPlaylist < this.start + this.capacity)
        this.$.RepaintRect(0, this.rowHeight * fb.PlayingPlaylist - this.$.offsetY, this.$.w, this.rowHeight);
}

ListManager.Init = function () {
    this.start = 0;
    this.select = plman.ActivePlaylist;
    if (this.select == Math.pow(2, 32) - 1) {
        this.select = -1;
    }
    this.selects.length = 0;
    this.count = plman.PlaylistCount;

    this.Dispose();
    for (var i = 0; i < this.count; i++) {
        this.items.push(new oListManagerItem(i));
    }
    if (this.select > -1) {
        this.items[this.select].selected = true;
    }
    this.$.totalY = this.count * this.rowHeight;
    if (this.sized) {
        this.OnSize();
    }
}

ListManager.Check = function (idx, name) {
    for (var i = 0; i < this.count; i++) {
        if (plman.GetPlaylistName(i) == name) {
            return i;
        }
    }
    var id = Math.min(this.count, idx);
    plman.CreatePlaylist(id, name);
    plman.ActivePlaylist = id;
    return id;
}

ListManager.Drop = function (x, y) {
    var idx = Math.floor((y - this.$.y + this.$.offsetY) / this.rowHeight);
    if (this.drag.id != idx)
        plman.MovePlaylist(this.drag.id, idx);
}

ListManager.Key = function (vkey) {
    switch (vkey) {
        case VKEY_RETURN:
            plman.ActivePlaylist = this.select;
            Tab.focus = 0;
            Tab.Change();
            break;

        case VKEY_DELETE:
            plman.RemovePlaylist(this.select);
            break;
    }
}

ListManager.Rename = function (idx, auto) {
    var str = plman.GetPlaylistName(idx);
    AInput(str, this.$.x + 60, this.select * this.rowHeight - this.$.offsetY + this.$.y + 3, this.$.w - 120, this.rowHeight - 6);

    Input.Defocus = function () {
        if (Input.str != plman.GetPlaylistName(idx) && Input.str.length > 0)
            plman.RenamePlaylist(idx, Input.str);
        Input.$.Hide();
        auto && fb.ShowAutoPlaylistUI(idx);
    }
}

ListManager.EnsureVisible = function (idx) {
    this.select = idx;
    var des = 0;
    if (idx * this.rowHeight - this.$.offsetY < 0) {
        des = idx * this.rowHeight;
    }
    if ((idx + 1) * this.rowHeight - this.$.offsetY > this.$.h) {
        des = (idx + 1) * this.rowHeight - this.$.h;
    }
    if (des > 0) {
        this.$.offsetY = des;
        this.vScroll.Update();
    }
}

ListManager.Menu = function (x, y, pl) {
    var p = window.CreatePopupMenu();
    p.AppendMenuItem(0, 1, '重命名');
    p.AppendMenuItem(0, 2, '删除');
    p.AppendMenuItem(0, 3, '新建播放列表');
    p.AppendMenuItem(0, 4, '新建自动播放列表');
    p.AppendMenuItem(0, 5, fb.IsAutoPlaylist(pl) ? '修改自动播放列表属性' : '保存列表');

    var idx = p.TrackPopupMenu(x, y);
    switch (idx) {
        case 1:
            this.Rename(pl);
            break;

        case 2:
            fb.RemovePlaylist(pl);
            break;

        case 3:
            var name = '新建播放列表'
            fb.CreatePlaylist(pl + 1, name + ' (' + this.Calc(name) + ')');
            fb.ActivePlaylist = pl + 1;
            if (this.$.visible) {
                window.SetTimeout(function () {
                    ListManager.Rename(pl + 1, fb.IsAutoPlaylist(pl + 1));
                }, 50);
            }
            break;

        case 4:
            var name = '新建自动播放列表'
            fb.CreateAutoPlaylist(pl + 1, name + ' (' + this.Calc(name) + ')', '', '', 0);
            fb.ActivePlaylist = pl + 1;
            if (this.$.visible) {
                window.SetTimeout(function () {
                    ListManager.Rename(pl + 1, fb.IsAutoPlaylist(pl + 1));
                }, 50);
            }
            break;

        case 5:
            fb.ActivePlaylist = pl;
            fb.IsAutoPlaylist(pl) ? fb.ShowAutoPlaylistUI(pl) : fb.SavePlaylist();
            break;

        default:
            break;
    }
    p.Dispose();
}

ListManager.Calc = function (key) {
    var ret = 1;
    for (var i = 0; i < this.count; i++) {
        if (key == plman.GetPlaylistName(i).substring(0, key.length))
            ret++;
    }
    return ret;
}

ListManager.Mouse = function (event, x, y) {
    switch (event) {
        case ON_MOUSE_LBTN_DBLCK:
            plman.ActivePlaylist = this.select;
            Tab.focus = 0;
            Tab.Change();
            break;

        case ON_MOUSE_LBTN_UP:
            break;

        case ON_MOUSE_RBTN_UP:
            this.Menu(x, y, this.select);
            break;
    }
}
