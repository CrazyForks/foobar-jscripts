/*oListView 实例化*/
oPlayQueueItem = function (id, metadb) {
    this.id = id;
    this.metadb = metadb;
    this.active = false;
    this.selected = false;

    this.Dispose = function () {
        this.metadb = null;
    }

    this.Paint = function (gr, x, y, w, h) {
        /*if (this.id & 1)
        gr.FillSolidRect(x, y, w, h, ThemeStyle.bgColor_l);
        else
        gr.FillSolidRect(x, y, w, h, ThemeStyle.bgColor);*/
        gr.FillSolidRect(x, y, w, h, ThemeStyle.bgColor);
        if (this.selected)
            gr.FillSolidRect(x, y, w, h, ThemeStyle.bgColor_hl);

        gr.GdiDrawText(this.id + 1, ThemeStyle.font, ThemeStyle.fgColor, x + $Z(5), y, $Z(50), h, DT_CV);
        gr.GdiDrawText(Metadb.TitleFormat("$if( %length%, %length%, '--:--' )", this.metadb), ThemeStyle.font, ThemeStyle.fgColor, x + w - $Z(90), y, $Z(80), h, DT_RV);
        gr.GdiDrawText(Metadb.TitleFormat('%title%', this.metadb), ThemeStyle.font, ThemeStyle.fgColor, x + $Z(60), y, w - $Z(160), h, DT_LV);
    }
}

oPlayQueueClearButton = function (id) {
    this.id = id;
    this.selected = false;

    this.Dispose = function () {
    }

    this.Paint = function (gr, x, y, w, h) {
        gr.FillSolidRect(x, y, w, h, ThemeStyle.bgColor);
        gr.DrawLine(x + $Z(15), y, x + w - $Z(15), y, $Z(1), $SetAlpha(ThemeStyle.fgColor, 32));
        if (this.id == PlayQueue.active)
            gr.FillSolidRect(x, y, w, h, $SetAlpha(ThemeStyle.fgColor, 32));

        gr.GdiDrawText('清空播放队列', ThemeStyle.font, ThemeStyle.fgColor, x, y, w, h, DT_CV);
    }
}

var PlayQueue = new oListView('PlayQueue', $Z(35), ENABLE_NONE);
PlayQueue.title = '播放队列';
PlayQueue.active = -1;

PlayQueue.Animation = new oAnimation('PlayQueue.Animation');

PlayQueue.vScroll.relative = false;
PlayQueue.vScroll.bg = false;

PlayQueue.OnBack = function () {
    PlayQueue.Close();
}
PlayQueue.Back = new oSimpleButton('PlayQueue.Back', PlayQueue.OnBack, SHAPE_SOLID);

PlayQueue.Back.OnPrevPaint = function (gr) {
    gr.FillSolidRect(this.$.x, this.$.y, this.$.w, this.$.h, $SetAlpha(ThemeStyle.bgColor, 255));
    gr.DrawLine(this.$.x, this.$.y + this.$.h - $Z(1), this.$.x + this.$.w - $Z(1), this.$.y + this.$.h - $Z(1), $Z(1), $SetAlpha(ThemeStyle.fgColor_l, 128));
}

var fontAwesome = gdi.Font('FontAwesome', $Z(12));

PlayQueue.Back.Paint = function (gr) {
    gr.GdiDrawText($Font2Icon('61703') + '   返回', fontAwesome, ThemeStyle.fgColor, this.$.x, this.$.y, this.$.w, this.$.h, DT_CV);
}

// override
PlayQueue.OnSize = function (resize) {
    this.sized = true;
    this.capacity = Math.ceil(this.$.h / this.rowHeight) + 1;
    this.vScroll.$.Size(this.$.x + this.$.w - 5, this.$.y, 5, this.$.h, this.$.z + 1);
    this.Back.$.Size(this.$.x, this.$.y - this.rowHeight, this.$.w, this.rowHeight, this.$.z + 1);
}

PlayQueue.Init = function () {
    this.Dispose();

    this.start = 0;
    this.select = -1;
    this.active = -1;

    this.contents = plman.GetPlaybackQueueContents().toArray();
    this.count = plman.GetPlaybackQueueCount();

    for (var i = 0; i < this.count; i++) {
        this.items.push(new oPlayQueueItem(i, this.contents[i].Handle));
    }
    if (this.count > 0) {
        this.items.push(new oPlayQueueClearButton(this.count));
        this.count++;
    }
    this.$.totalY = this.count * this.rowHeight;
    if (this.sized) {
        this.OnSize();
    }
}

PlayQueue.Key = function (vkey) {
    switch (vkey) {
        case VKEY_RETURN:
            if (this.select < this.items.length - 1) {
                // fb.RunContextCommandWithMetadb("播放", this.items[this.select].metadb, 0);
            }
            break;

        case VKEY_DELETE:
            break;
    }
}

PlayQueue.Mouse = function (event, x, y) {
    switch (event) {
        case ON_MOUSE_LBTN_UP:
            if (this.select == this.items.length - 1) {
                plman.FlushPlaybackQueue();
            }
            break;

        case ON_MOUSE_LBTN_DBLCK:
            if (this.select < this.items.length - 1) {
                // fb.RunContextCommandWithMetadb("播放", this.items[this.select].metadb, 0);
            }
            break;

        case ON_MOUSE_RBTN_UP:
            if (this.select < this.items.length - 1) {
                plman.RemoveItemFromPlaybackQueue(this.select);
                this.items.splice(this.select, 1);
                this.$.Repaint();
            }
            break;

        case ON_MOUSE_MOVE:
            var idx = Math.floor((y - this.$.y + this.$.offsetY) / this.rowHeight);

            if (this.active != idx) {
                if (idx == this.count - 1 || this.active == this.count - 1) {
                    this.$.Repaint();
                }
                this.active = idx;
            }
    }
}

PlayQueue.OnPrevPaint = function (gr) {
    gr.FillSolidRect(this.$.x, this.$.y, this.$.w, this.$.h, $SetAlpha(ThemeStyle.bgColor_l, 255));
}

PlayQueue.OnVisible = function (vis) {
    this.Back.$.visible = vis;
}

PlayQueue.Open = function () {
    this.SetVisible(true);
    this.Animation.SSA(this.$, null, Main.$.y + Main.$.h - $Z(250), null, null, null, null, true, 4);
}

PlayQueue.OnClose = function () {
    PlayQueue.SetVisible(false);
}

PlayQueue.Close = function () {
    this.Animation.SSA(this.$, null, Main.$.y + Main.$.h + this.rowHeight, null, null, null, null, true, 4, this.OnClose);
}