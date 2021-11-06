/*oListView 实例化*/
oInfoItem = function (title, tf, write) {
    this.title = title;
    this.tf = typeof (tf) == 'undefined' ? false : tf;
    this.write = this.tf ? write : false;
    this.selected = false;

    this.Update = function () {
        if (this.tf)
            this.text = Metadb.TitleFormat(this.tf);
    }

    this.Paint = function (gr, x, y, w, h) {
        if (!this.tf)
            gr.FillSolidRect(x, y, w, h, ThemeStyle.bgColor_l);
        else {
            gr.FillSolidRect(x, y, w, h, ThemeStyle.bgColor);
            if (this.selected)
                gr.FillSolidRect(x, y, w, h, ThemeStyle.bgColor_hl);
            else
                gr.DrawLine(x + $Z(15), y + h, x + w - $Z(15), y + h, $Z(1), $SetAlpha(ThemeStyle.fgColor, 32));
        }
        gr.GdiDrawText(this.title, ThemeStyle.font, ThemeStyle.fgColor, x + $Z(15), y, $Z(80), h, DT_LV);
        if (this.text)
            gr.GdiDrawText(this.text, ThemeStyle.font, ThemeStyle.fgColor, x + $Z(100), y, w - $Z(120), h, DT_LV);
    }
}

var Info = new oListView('Info', $Z(35), ENABLE_NONE);

Info.Init = function () {
    this.Dispose();
    this.items.push(new oInfoItem('元数据'));
    this.items.push(new oInfoItem('标题', '[%title%]', true));
    this.items.push(new oInfoItem('艺术家', '[%artist%]', true));
    this.items.push(new oInfoItem('专辑', '[%album%]', true));
    this.items.push(new oInfoItem('日期', '[%date%]', true));
    this.items.push(new oInfoItem('流派', '[%genre%]', true));
    this.items.push(new oInfoItem('作曲', '[%composer%]', true));
    this.items.push(new oInfoItem('演奏', '[%performer%]', true));
    this.items.push(new oInfoItem('专辑歌手', '[%album artist%]', true));
    this.items.push(new oInfoItem('音轨号', '[%tracknumber%]', true));
    this.items.push(new oInfoItem('合计音轨', '[%totaltracks%]', true));
    this.items.push(new oInfoItem('光盘编号', '[%discnumber%]', true));
    this.items.push(new oInfoItem('合计光盘', '[%totaldiscs%]', true));

    this.items.push(new oInfoItem('属性'));
    this.items.push(new oInfoItem('文件名', '[%filename_ext%]', false));
    this.items.push(new oInfoItem('文件路径', '[%path%]', false));
    this.items.push(new oInfoItem('文件大小', '[%filesize_natural%]', false));
    this.items.push(new oInfoItem('修改时间', '[%last_modified%]', false));

    this.items.push(new oInfoItem('常规'));
    this.items.push(new oInfoItem('持续时间', '[%length%]', false));
    this.items.push(new oInfoItem('比特率', '[%bitrate% kbps]', false));
    this.items.push(new oInfoItem('声道数', '[%channels%]', false));
    this.items.push(new oInfoItem('采样率', '[%samplerate% Hz]', false));
    this.items.push(new oInfoItem('编码格式', '[%codec%]', false));

    this.items.push(new oInfoItem('播放增益'));
    this.items.push(new oInfoItem('音轨增益', '[%replaygain_track_gain%]', false));
    this.items.push(new oInfoItem('音轨峰值', '[%replaygain_track_peak%]', false));
    this.items.push(new oInfoItem('专辑增益', '[%replaygain_album_gain%]', false));
    this.items.push(new oInfoItem('专辑峰值', '[%replaygain_album_peak% Hz]', false));

    this.start = 0;
    this.count = this.items.length;
    this.$.offsetY = 0;
    this.$.totalY = this.count * this.rowHeight;
    if (this.sized) {
        this.OnSize();
    }

    for (var i = 0; i < this.count; i++) {
        this.items[i].Update();
    }
}

Info.Update = function () {
    for (var i = 0; i < this.count; i++) {
        this.items[i].Update();
    }
    this.$.Repaint();
}

Info.Edit = function (idx) {
    var metadb = Metadb.Handle();
    if (!metadb) return;

    var key = this.items[idx].tf.match(/%.*%/g)[0];
    key = key.substring(1, key.length - 1);

    var str = this.items[idx].text;
    AInput(str, this.$.x + 100, this.select * this.rowHeight - this.$.offsetY + this.$.y + 3, this.$.w - 120, this.rowHeight - 6);

    Input.Defocus = function () {
        if (Input.str != str) {
            if (Info.items[idx].write)
                metadb.UpdateFileInfoSimple(key, Input.str);
            else
                Console.Log('属性不可写');
        }
        Input.$.Hide();
    }
}

Info.Mouse = function (event, x, y) {
    switch (event) {
        case ON_MOUSE_LBTN_DBLCK:
            if (this.select > -1 && this.items[this.select].tf) {
                this.Edit(this.select);
            }
            break;
    }
}