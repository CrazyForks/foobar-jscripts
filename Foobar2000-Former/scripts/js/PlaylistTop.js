oPlaylistTop = function (name) {
    this.$ = new oPanel(name, false);
    this.text = null;
    this.type = window.GetProperty('播放列表显示模式', false);
    this.searchfrom = window.GetProperty('搜索从', 0);

    var search = ['本地', '网络'];

    this.Init = function () {

        this.Tab = new oTabView(name + '.Tab', false, false, true);
        this.Tab.num = 3;

        this.Tab.Paint = function (gr, x, y, w, h) {
            gr.GdiDrawText('Tracks', ThemeStyle.font, ThemeStyle.fgColor, x, y, w, h, DT_CV);
            gr.GdiDrawText('Albums', ThemeStyle.font, ThemeStyle.fgColor, x + w, y, w, h, DT_CV);
            gr.GdiDrawText('Artists', ThemeStyle.font, ThemeStyle.fgColor, x + 2 * w, y, w, h, DT_CV);
        }

        this.Tab.OnChange = function () {
            g_playlist_tab = this.focus;
            window.SetProperty('播放列表标签', g_playlist_tab);
            PlaylistTabShow(g_playlist_tab);
            window.Repaint();
        }

        this.OnType = function () {
            eval(name).type = eval(name).type ? false : true;
            window.SetProperty('播放列表显示模式', eval(name).type);
            if (eval(name).type) {
                g_playlist_tabs = [Playlist, AlbumBrowser, ArtistBrowser];
                AlbumList.SetVisible(false);
                ArtistList.SetVisible(false);
            } else {
                g_playlist_tabs = [Playlist, AlbumList, ArtistList];
                AlbumBrowser.SetVisible(false);
                ArtistBrowser.SetVisible(false);
            }
            PlaylistTabShow(g_playlist_tab);
            window.Repaint();
            return true;
        }
        this.Type = new oSimpleButton(name + '.Type', this.OnType, SHAPE_ELLIPSE);
        this.Type.Paint = function (gr) {
            Image.Draw(gr, eval(name).type ? g_list_icon : g_group_icon, this.$.x, this.$.y, 0, 255);
        }

        this.OnMenuChosen = function () {
            eval(name).searchfrom = eval(name).Menu.idx;
            window.SetProperty('搜索从', eval(name).searchfrom);
            eval(name).Key.$.Repaint();
        }
        this.Menu = new oMenu(name + '.Menu', this.OnMenuChosen, true);
        this.Menu.items = search;

        this.OnKeyChosen = function () {
            if (eval(name).Menu.$.visible)
                eval(name).Menu.Defocus();
            else
                eval(name).Menu.Show();
            return true;
        }
        this.Key = new oButton(name + '.Key', '', this.OnKeyChosen, true, true);
        this.Key.Paint = function (gr) {
            gr.GdiDrawText(search[eval(name).searchfrom], ThemeStyle.smallFont, ThemeStyle.fgColor, this.$.x + 10, this.$.y, this.$.w - 30, this.$.h, DT_LV);
            Image.Draw(gr, g_arrow_icon, this.$.x + this.$.w - 18, this.$.y + 2, 0, 255);
        }

        this.OnSort = function () {
            if (g_playlist_tab == 0)
                ASort();
            else {
                window.SetProperty('分组升序', !window.GetProperty('分组升序', true));
                Browser.SetProperty();
            }
            return true;
        }
        this.Sort = new oSimpleButton(name + '.Sort', this.OnSort, SHAPE_ELLIPSE);
        this.Sort.Paint = function (gr) {
            Image.Draw(gr, g_sort_icon, this.$.x, this.$.y, 0, 255);
        }

        this.OnSearch = function () {
            if (eval(name).searchfrom) {
                var str = '网络搜索';
                AInput(str, eval(name).$.x + $Z(35), eval(name).$.y + $Z(3), eval(name).$.w - $Z(180), $Z(24));

                Input.Defocus = function () {
                    Input.$.Hide();
                    if (Input.str != str && Input.str.length > 0) {
                        Web.Search(Input.str);
                    }
                }
            } else {
                ASearch(Math.floor(Playlist.$.x + (Playlist.$.w - $Z(280)) / 2), Math.floor(Playlist.$.y + $Z(25)), Playlist.$.z + 4);
            } /* else if (g_playlist_tab == 1) {
                var str = '专辑搜索';
                AInput(str, eval(name).$.x + 35, eval(name).$.y + 3, eval(name).$.w - 180, 24);

                Input.Defocus = function () {
                    Input.$.Hide();
                    if (Input.str != str && Input.str.length > 0) {
                        g_playlist_tabs[1].Search(Input.str);
                    }
                }
            } else if (g_playlist_tab == 2) {
                var str = '艺术家搜索';
                AInput(str, eval(name).$.x + 35, eval(name).$.y + 3, eval(name).$.w - 180, 24);

                Input.Defocus = function () {
                    Input.$.Hide();
                    if (Input.str != str && Input.str.length > 0) {
                        g_playlist_tabs[2].Search(Input.str);
                    }
                }
            }*/
            return true;
        }
        this.Search = new oSimpleButton(name + '.Search', this.OnSearch, SHAPE_ELLIPSE);
        this.Search.Paint = function (gr) {
            Image.Draw(gr, g_search_icon, this.$.x, this.$.y, 0, 255);
        }
    }
    this.Init();

    this.SetVisible = function (vis) {
        this.Type.$.visible = vis;
        this.Sort.$.visible = vis;
        this.Search.$.visible = vis;
        this.Key.$.visible = vis;
        this.Tab.$.visible = vis;
        this.$.visible = vis;
        if (vis) {
            PlaylistTabShow(g_playlist_tab);
        } else {
            PlaylistTabShow(-1);
            if (Search && Search.$.visible)
                Search.SetVisible(false);
        }
    }

    this.OnSize = function (resize) {
        if (resize) {
            if (fb.ActivePlaylist == Math.pow(2, 32) - 1)
                this.text = '未指定有效列表';
            else {
                this.text = plman.GetPlaylistName(fb.ActivePlaylist) + ': 共 ';
                if (g_playlist_tab == 0)
                    this.text += Playlist.items.length + ' 首';
                else if (g_playlist_tab == 1)
                    this.text += g_playlist_tabs[1].items.length + ' 个';
                else if (g_playlist_tab == 2)
                    this.text += g_playlist_tabs[2].items.length + ' 位';
            }
        }

        this.Type.$.Size(this.$.x + $Z(5), this.$.y, $Z(30), $Z(30), this.$.z + 1);
        this.Sort.$.Size(this.$.x + this.$.w - $Z(65), this.$.y, $Z(30), $Z(30), this.$.z + 1);
        this.Search.$.Size(this.$.x + this.$.w - $Z(35), this.$.y, $Z(30), $Z(30), this.$.z + 1);
        this.Key.$.Size(this.$.x + this.$.w - $Z(140), this.$.y + $Z(5), $Z(70), $Z(20), this.$.z + 1);
        this.Menu.$.Size(this.$.x + this.$.w - $Z(140), this.$.y + $Z(25), $Z(70), $Z(40), this.$.z + 1);
        this.Tab.$.Size(this.$.x, this.$.y + $Z(30), this.$.w, $Z(30), this.$.z + 1);

        Sort.$.Size(Math.floor(this.$.x + (this.$.w - $Z(350)) / 2), this.$.y + this.$.h + $Z(50), $Z(350), $Z(100));

        Playlist.$.Size(this.$.x, this.$.y + this.$.h, this.$.w, Tab.$.y - this.$.y - this.$.h);
        AlbumBrowser.$.Size(this.$.x, this.$.y + this.$.h, this.$.w, Tab.$.y - this.$.y - this.$.h);
        ArtistBrowser.$.Size(this.$.x, this.$.y + this.$.h, this.$.w, Tab.$.y - this.$.y - this.$.h);
        AlbumList.$.Size(this.$.x, this.$.y + this.$.h, this.$.w, Tab.$.y - this.$.y - this.$.h);
        ArtistList.$.Size(this.$.x, this.$.y + this.$.h, this.$.w, Tab.$.y - this.$.y - this.$.h);
    }

    this.Update = function () {
        if (fb.ActivePlaylist == Math.pow(2, 32) - 1)
            this.text = '未指定有效列表';
        else {
            this.text = plman.GetPlaylistName(fb.ActivePlaylist) + ': 共 ';
            if (g_playlist_tab == 0)
                this.text += Playlist.items.length + ' 首';
            else if (g_playlist_tab == 1) {
                this.text += g_playlist_tabs[1].items.length + ' 个';
                if (this.type && AlbumBrowser.load < AlbumBrowser.items.length)
                    this.text += ' 已加载: ' + AlbumBrowser.load + ' 个';
            }
            else if (g_playlist_tab == 2) {
                this.text += g_playlist_tabs[2].items.length + ' 位';
                if (this.type && ArtistBrowser.load < ArtistBrowser.items.length)
                    this.text += ' 已加载: ' + ArtistBrowser.load + ' 位';
            }
        }
        this.$.Repaint();
    }

    this.OnPrevPaint = function (gr) {
        gr.FillSolidRect(this.$.x, this.$.y, this.$.w, this.$.h, $SetAlpha(ThemeStyle.bgColor_l, 255));
    }

    this.OnPaint = function (gr) {
        if (this.$.bg)
            gr.FillSolidRect(this.$.x, this.$.y, this.$.w, this.$.h, ThemeStyle.bgColor_l);
        gr.GdiDrawText(this.text, ThemeStyle.font, ThemeStyle.fgColor, this.$.x + $Z(40), this.$.y, this.$.w - $Z(200), $Z(30), DT_LV);
    }
}

var PlaylistTop = null;