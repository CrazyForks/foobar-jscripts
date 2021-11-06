/*oListView 实例化*/
oPlaylistItem = function (id, metadb) {
    this.id = id;
    this.metadb = metadb;
    this.selected = false;

    this.Dispose = function () {
        this.metadb = null;
    }

    this.Paint = function (gr, x, y, w, h) {
        if (this.id & 1)
            gr.FillSolidRect(x, y, w, h, ThemeStyle.bgColor_l);
        else
            gr.FillSolidRect(x, y, w, h, ThemeStyle.bgColor);
        if (plman.IsPlaylistItemSelected(Playlist.id, this.id))
            gr.FillSolidRect(x, y, w, h, ThemeStyle.bgColor_hl);

        var color = 0;
        if (this.id == Playlist.playing && fb.IsPlaying) {
            color = ThemeStyle.fgColor_hl;
            if (Playlist.isp)
                Image.Draw(gr, g_isp1_icon, x + $Z(23), Math.floor(y + (h - g_isp1_icon.Height) / 2), 0, 255);
            else
                Image.Draw(gr, g_isp2_icon, x + $Z(23), Math.floor(y + (h - g_isp2_icon.Height) / 2), 0, 255);
            gr.GdiDrawText(Metadb.TitleFormat("$if( %length%, [%playback_time% / ]%length%, '--:--' )"), ThemeStyle.font, color, x + w - $Z(110), y, $Z(100), h, DT_RV);
        }
        else {
            color = ThemeStyle.fgColor;
            gr.GdiDrawText(this.id + 1, ThemeStyle.font, color, x + $Z(5), y, $Z(50), h, DT_CV);
            gr.GdiDrawText(Metadb.TitleFormat("$if( %length%, %length%, '--:--' )", this.metadb), ThemeStyle.font, color, x + w - $Z(110), y, $Z(100), h, DT_RV);
        }
        gr.GdiDrawText(Metadb.TitleFormat('%title%', this.metadb), ThemeStyle.font, color, x + $Z(60), y, w - $Z(180), h, DT_LV);
    }
}

var Playlist = new oListView('Playlist', $Z(35), ENABLE_SELECT);
Playlist.title = '单曲';

Playlist.OnTime = function () {
    this.isp = this.isp ? false : true;
    if (this.start <= this.playing && this.playing < this.start + this.capacity)
        this.$.RepaintRect(0, this.rowHeight * this.playing - this.$.offsetY, this.$.w, this.rowHeight);
}

Playlist.OnVisible = function (vis) {
    if (!vis) {
        if (Sort && Sort.$.visible)
            Sort.SetVisible(false);
    }
}

Playlist.OnSelect = function () {
    plman.ClearPlaylistSelection(this.id);
    if (this.selects.length > 0)
        plman.SetPlaylistSelection(this.id, this.selects, true);
    else
        plman.SetPlaylistSelectionSingle(this.id, this.select, true);
}

Playlist.Init = function () {
    this.Dispose();
    this.list && this.list.Dispose();

    this.isp = false;
    this.start = 0;
    this.select = -1;
    this.selects.length = 0;
    this.playing = -1;
    this.id = plman.ActivePlaylist;
    this.list = plman.GetPlaylistItems(this.id);
    this.count = plman.PlaylistItemCount(this.id);

    for (var i = 0; i < this.count; i++) {
        this.items.push(new oPlaylistItem(i, this.list.item(i)));
    }

    if (this.id == fb.PlayingPlaylist && fb.IsPlaying) {
        var playing_item_locaton = plman.GetPlayingItemLocation();
        if (playing_item_locaton.IsValid)
            this.playing = playing_item_locaton.PlaylistItemIndex;
        else
            this.playing = -1;
    }
    this.$.offsetY = 0;
    this.$.totalY = this.count * this.rowHeight;
    if (this.sized) {
        this.OnSize();
    }
}

Playlist.SetPlaying = function () {
    if (fb.IsPlaying) {
        if (this.id == fb.PlayingPlaylist) {
            var playing_item_locaton = plman.GetPlayingItemLocation();
            if (playing_item_locaton.IsValid)
                this.playing = playing_item_locaton.PlaylistItemIndex;
            else
                this.playing = -1;
            this.$.Repaint();
        }
    }
    else {
        this.playing = -1;
        this.$.Repaint();
    }
}

Playlist.OnInvalid = function () {
    plman.ClearPlaylistSelection(this.id);
    if (this.selects.length > 0)
        plman.SetPlaylistSelection(this.id, this.selects, true);
    else
        plman.SetPlaylistSelectionSingle(this.id, this.select, true);
}

Playlist.Key = function (vkey) {
    switch (vkey) {
        case VKEY_UP:
        case VKEY_DOWN:
            plman.ClearPlaylistSelection(this.id);
            plman.SetPlaylistSelectionSingle(this.id, this.select, true);
            break;

        case VKEY_RETURN:
            if (this.id == fb.PlayingPlaylist && this.select == this.playing)
                fb.PlayOrPause();
            else
                plman.ExecutePlaylistDefaultAction(this.id, this.select);
            break;

        case VKEY_DELETE:
            plman.RemovePlaylistSelection(this.id);
            break;

        case 0x41: //A
            if ($GetKeyboardMask() == KMask.ctrl) {
                plman.ClearPlaylistSelection(this.id);
                plman.SetPlaylistSelection(this.id, this.selects, true);
            }
            break;

        case 0x46: //F
            if ($GetKeyboardMask() == KMask.ctrl) {
                ASearch(Math.floor(this.$.x + (this.$.w - 280) / 2), Math.floor(this.$.y + 25), this.$.z + 4);
            }
            break;

        case 0x53: //S
            if ($GetKeyboardMask() == KMask.ctrl) {
                ASort(Math.floor(this.$.x + (this.$.w - 350) / 2), Math.floor(this.$.y + 50), this.$.z + 2);
            }
            break;

        case 0x72: //F3
            if ($GetKeyboardMask() == KMask.shift) {
                Search && Search.SearchPrev(Search.Input.str);
            }
            else if ($GetKeyboardMask() == KMask.none)
                Search && Search.SearchNext(Search.Input.str);
            break;
    }
}

Playlist.Mouse = function (event, x, y) {
    switch (event) {
        case ON_MOUSE_LBTN_DBLCK:
            if (this.select == this.playing)
                fb.PlayOrPause();
            else
                plman.ExecutePlaylistDefaultAction(this.id, this.select);
            break;

        case ON_MOUSE_RBTN_UP:
            var idx = Math.floor((y - this.$.y + this.$.offsetY) / this.rowHeight);
            if (idx < 0 || idx >= this.count) return;

            if (!plman.IsPlaylistItemSelected(this.id, idx)) {
                plman.ClearPlaylistSelection(this.id);
                plman.SetPlaylistSelectionSingle(this.id, this.select, true);
            }
            Menu.Context(x, y);
            break;
    }
}

