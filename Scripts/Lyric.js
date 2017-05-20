// vim: set ft=javascript fileencoding=utf-8 bomb et:

// Lyric script to display lyric on a wsh panel and use `ESLyric' as search
// engine.
//
// Required:
// * foobar2000 v1.3.3+
// * WSH Panel Mod Plus v1.5.7+
// * ESLyric v0.3.x+

// TODO: 
// * parse Lyric
// * show Lyric
// * handle mouse event
// * scrolling improvement
// * ...

var Lyric, ESLyric;
var ww, wh;
var DT_CC = 0x00000001 | 0x00000004 | 0x00000400 | 0x00000800;

try {
    ESLyric = new ActiveXObject("ESLyric");
} catch (e) {
    throw new Error("ESLyric has not support COM yet!");
}

;(function() {

    // Dependences
    var undefined;
    var click = false,
        line = 0,
        mid = 0,
        get = false,
        focus = 0,
        timer = null,
        withTimeStamp = true;
    var translate = window.GetProperty("Translate", false);
    var visible = true;
    var margin = 10;

    var lrc_txt = "",
        tlrc_txt = ""; // Traslated lyric text;
    var lrc = [],
        tlrc = [];

    var TF_DEFAULT = fb.TitleFormat("[%artist% - ]%title%");
    var TF_LENGTH_SEC = fb.TitleFormat("%length_seconds%");
    var TF_NO_LYRIC = fb.TitleFormat("Title: %title%||[Artist: %artist%||][Album: %album%||]||-No Lyric-");

    var lrcX, lrcY, lrcW, lrcH;
    var lrcFont = gdi.Font(window.GetProperty("Lyric font", "Segoe UI Semibold"), 14);
    var lrcFontBig = gdi.Font("Segoe UI Semibold", 14);
    var rowHeight = Math.round(lrcFont.Height * 1.35);

    var reTimeStamp = /\[[0-9]*:[0-9]*\.[0-9]*\]/g;


    // Parse lyricText to lyricArray
    function handle(lyricText) {
        var time_stamps = [];
        var lyrics = []; // {tag: Number, str: String, lrc: []};
        var text = [];
        var stamp = [];

        // 判断时间标签
        var timeArr = lyricText.match(reTimeStamp);
        var withTimeStamp = !!timeArr; // => boolean

        // 判断行尾
        //lyricText = lyricText.replace(/\n|\r/g, "\n\r"); 
        if (lyricText.indexOf("\n\r") != -1) {
            text = lyricText.split(/\r\n/g);
        } else if (lyricText.indexOf("\n") != -1) {
            text = lyricText.split(/\n/g);
        } else if (lyricText.indexOf("\r") != -1) {
            text = lyricText.split(/\r/g);
        }
        // 时间戳、文本分离
        for (var i = 0; i < text.length; i++) {
            stamp = text[i].match(/\[[0-9]*:[0-9]*\.[0-9]*\]/);
            text[i] = text[i].replace(/\[..:.*?\]/g, "");
            text[i] = text[i].length == 0 ? ' ' : text[i];
            // 含时间戳
            if (withTimeStamp && stamp != null) {
                for (var j = 0; j < stamp.length; j++) {
                    stamp[j] = parseTimeStamp(stamp[j])
                    if (!isNaN(stamp[j]))
                        time_stamps.push(stamp[j]);
                }
                stamp.push(text[i]);
                lyrics.push(stamp);
            } else if (!withTimeStamp) {
                var interval = Math.floor(fb.PlaybackLength * 1000 / text.length);
                time_stamps.push(interval * i);
                stamp = [];
                stamp.push(interval * i);
                stamp.push(text[i]);
                lyrics.push(stamp);
            }
        }
        if (time_stamps.length > 0) {
            time_stamps.sort(function(a, b) { return a - b });
            time_stamps = uniques(time_stamps);
            return rebuild(time_stamps, lyrics);
        }
        return [];

    }

    function uniques(arr) {
        var a = [];
        for (var i=0, l=arr.length; i<l; i++)
            if (a.toString().indexOf(arr[i]) === -1 && arr[i] !== '')
            a.push(arr[i]);
        return a;
    }

    function rebuild(arrTime, arrLyric) {
        var t = 0, l = 0, lt = 0;
        var r = 0, b = 0, e = 0;
        var lrc = [];

        for (t = 0; t < arrTime.length; t++) {
            loop:
            for (l = 0; l < arrLyric.length; l++) {
                if (arrLyric[l] != undefined) {
                    for (lt = 0; lt < arrLyric[l].length - 1; lt++) {
                        if (arrTime[t] == arrLyric[l][lt]) {
                            lrc[t] = {};
                            lrc[t].tag = arrTime[t];
                            lrc[t].str = arrLyric[l][arrLyric[l].length - 1];
                            lrc[t].lrc = [];

                            r = Math.ceil(calc(lrc[t].str, lrcFont, true) / (lrcW - 10)); // 10 => magic number
                            b = 0;
                            for (e = 1; e <= lrc[t].str.length; e++) {
                                if (calc(lrc[t].str.substring(b, e), lrcFont, true) >= (lrcW - 10)) {
                                    lrc[t].lrc.push(lrc[t].str.substring(b, e - 1));
                                    b = e - 1;
                                }
                                if (lrc[t].lrc.length == r - 1) {
                                    lrc[t].lrc.push(lrc[t].str.substring(b, lrc[t].str.length));
                                    break;
                                }
                            }
                            break loop;
                        }
                    }
                }
            }
        }
        return lrc;
    }


    // Conv timestamp string to seconds
    function parseTimeStamp(stamp) {
        return (parseInt(stamp.slice(1, 3), 10) * 60 + parseInt(stamp.slice(4, 6), 10)) * 1000 
            + parseInt(stamp.slice(7, 9), 10);
    }



    // Set lyric layout ======================================================

    function setSize(x, y, w, h) {
        lrcX = x;
        lrcY = y;
        lrcW = w;
        lrcH = h;
        onSize(true);
    }

    function onSize(resize) {
        if (!resize) return;
        mid = Math.floor(lrcH / rowHeight / 2) * rowHeight + 5;
        init(false);
    }

    function layout(_lrc, _tlrc) {
        for (var i = 0; i < lrc.length; i++) {
            for (var j = 0; j < tlrc.length; j++) {
                if (tlrc[j].tag == lrc[i].tag && tlrc[j].str != lrc[i].str) {
                    for (var k = 0; k < tlrc[j].lrc.length; k++) {
                        lrc[i].lrc.push(tlrc[j].lrc[k]);
                    }
                }
            }
            if (i == 0) {
                lrc[0].y = 0;
            } else {
                lrc[i].y = lrc[i - 1].y + lrc[i - 1].lrc.length * rowHeight;
            }
        }
        tlrc.length = 0;

        return lrc;
    }

    function process(lyricText, tlyricText) {
        if (lrc_txt.length == 0 && tlrc_txt.length == 0) {
            return false;
        } else {
            if (lrc_txt.length == 0) {
                if (tlrc_txt.length > 0) {
                    lrc_txt = tlrc_txt;
                    lrc = handle(lrc_txt);
                    layout();
                    tlrc_txt = "";
                } 
            }else {
                lrc = handle(lrc_txt);
                if (tlrc_txt.length > 0) {
                    tlrc = handle(tlrc_txt);
                }
                layout();
            }
            return true;
        }
    }


    function getLyric(lyricText, tlyricText) {
        timer && window.ClearInterval(timer);
        timer = null;
        get = false;
        // delet arrays
        lrc.length = 0;
        tlrc.length = 0;

        return process();
    }

    // Default text ===============================================================

    function getDefaultText(tf, fallbackstr, font) {

        var text = fb.IsPlaying ? tf.Eval() : fallbackstr;
        fb.trace(text);
        var arrText = text.split("||");
        fb.trace(arrText.length);
        var arr = [];
        var maxWidth = ww - margin * 2;
        
        var temp_bmp = gdi.CreateImage(1, 1);
        var temp_gr = temp_bmp.GetGraphics();

        for (var i = 0; i < arrText.length; i++) {
            if (temp_gr.CalcTextWidth(arrText[i], font) > maxWidth) {
                var arrTemp = temp_gr.EstimateLineWrap(arrText[i], font, maxWidth).toArray();
                for (var j = 0; j < arrTemp.length; j += 2) {
                    arr.push(arrTemp[j]);
                }
            } else {
                arr.push(arrText[i]);
            }
        }

        temp_bmp.ReleaseGraphics(temp_gr);
        temp_bmp.Dispose();

        return arr;

    }


    // On time display ============================================================

    // show(playbackTime, lyricArr);
    function show() {
        var playback_time = fb.PlaybackTime * 1000;
        var t = 0;
        for (; t < lrc.length; t++) {
            if (playback_time < lrc[t].tag) {
                if (t > 0) {
                    focus = Math.abs(playback_time - lrc[t].tag) > 50 ? t - 1 : t;
                } else {
                    focus = 0;
                }
                break;
            }
        }
        if (t == lrc.length) {
            focus = lrc.length - 1;
        }
    }

    // setProgress(line, lyricArr)
    // return focus
    // setPlaybackTime(focus, lyricArr);
    // return playbackTime
    function setProgress() {
        for (var t = 0; t < lrc.length; t++) {
            if (-line < lrc[t].y) {
                focus = t - 1 < 1 ? 0 : t - 1;
                repaintAll();
                fb.PlaybackTime = lrc[focus].tag  /1000;
                break;
            }
            if (t == lrc.length - 1) {
                focus = t;
                repaintAll();
                fb.PlaybackTime = lrc[focus].tag / 1000;
            }
        }
    }

    // Math.round() ?
    function one(num) {
        if (num == 0) {
            return Number(0);
        } else if (num < 0) {
            return Math.min(-1, Math.floor(num));
        } else if (num > 0) {
            return Math.max(1, Math.ceil(num));
        }
    }

    // timer = clearTimeout(timer);
    function clearTimeout(timer) {
        timer && window.ClearTimeout(timer);
        return null;
    }

    function clearInterval(timer) {
        timer && window.ClearInterval(timer);
        return null;
    }


    function onTime() {
        if (!fb.IsPlaying || !get || click) {
            return;
        }
        var temp = focus;
        show();
        if (temp != focus) {
            var org = line;
            var des = -lrc[focus].y;
            timer && window.ClearInterval(timer);
            timer = null;
            if (visible) {
                timer = window.SetInterval(function() {
                    org += one((des - org) / rowHeight)
                    if (Math.abs(des - org) <= 1) {
                        window.ClearInterval(timer);
                        timer = null;
                        org = des;
                        line = org;
                        repaintAll();
                        return;
                    }
                    line = org;
                    repaintAll();
                }, 15);
            } else {
                line = -lrc[focus].y;
            }
        }
    }

    function init(reset) {
        if (reset) {
            lrc_txt = '';
            tlrc_txt = '';
        } 
        get = getLyric();
        if (get && !reset) {
            line = -lrc[focus].y;
        } else {
            line = 0;
            focus = 0;
            repaintAll();
        }
    }

    function isInvalid() {
        if (click) {
            click = false;
        }

    }


    function getDrawMethod(method, align) {
        return function (gr, text, font, color, x, y, w, h) {
            switch (method) {
                default:
                case 0: // GDI
                    gr.GdiDrawText(text, font, color, x, y, w, h, DT_CC);
                    break;
                case 1:
                    gr.DrawString(text, font, color, x, y, w, h, StringFormat(1, 1));
                    break;
            }
        }
    }

    var drawStyle = 1; // 0: gdi, 1: gdi+
    var drawFunc = getDrawMethod(drawStyle);

    function drawNoLyric(gr) {
        var arrText = getDefaultText(TF_NO_LYRIC, "foobar2000", lrcFont);
        var totalHeight = rowHeight * arrText.length;
        var offsetY = (wh - totalHeight) / 2;
        for (var i = 0; i < arrText.length; i++) {
            arrText[i] && drawFunc(gr, arrText[i], lrcFont, 0xffe8e8e8, margin, offsetY, ww - margin, rowHeight);
            offsetY += rowHeight;
        }
    }

    function drawLyric(gr) {
        drawStyle && gr.SetTextRenderingHint(4);
        if (!get) {
            drawNoLyric(gr);
            return;
        } 
        // Draw lyrics
        for (var i = 0; i < lrc.length; i++) {
            if (lrc[i].lrc != null) {
                for (var j = 0; j < lrc[i].lrc.length; j++) {
                    var y = lrc[i].y + line + mid + j * rowHeight;
                    if (y > lrcH - rowHeight) {
                        return;
                    }
                    if (y >= 0) {
                        var font = (i == focus ? lrcFont : lrcFont);
                        var color = (i == focus ? 0xffd74164 : 0xff8e8e8e);
                        drawFunc(gr, lrc[i].lrc[j], font, color, lrcX, lrcY + y, lrcW, rowHeight);
                    }
                }
            }
        }
        gr.SetTextRenderingHint(0);
    }

    function onLyricGet(lyric) {
        lrc_txt = lyric.lyricText;
        init(false);
        fb.trace("get: " + get);
        repaintAll();
    }

    ESLyric && ESLyric.SetLyricCallback(onLyricGet);

    Lyric = {};
    Lyric.init = init;
    Lyric.draw = drawLyric;
    Lyric.size = setSize;
    Lyric.onPlaybackTime = onTime;


}.call(this));

function repaintAll() {
    window.Repaint();
}


function StringFormat() {
	var h_align = 0, v_align = 0, trimming = 0, flags = 0;
	switch (arguments.length)
	{
	// fall-thru
	case 4:
		flags = arguments[3];
	case 3:
		trimming = arguments[2];
	case 2:
		v_align = arguments[1];
	case 1:
		h_align = arguments[0];
		break;
	default:
		return 0;
	}
	return ((h_align << 28) | (v_align << 24) | (trimming << 20) | flags);
}


function calc(str, font, GDI) {
	var temp_bmp = gdi.CreateImage(1, 1);
	var temp_gr = temp_bmp.GetGraphics();
	if (GDI) {
		var width = temp_gr.CalcTextWidth(str, font); //GDI
		temp_bmp.ReleaseGraphics(temp_gr);
		temp_bmp.Dispose();
		temp_gr = null;
		temp_bmp = null;
		return width;
	} else {
		var info = temp_gr.MeasureString(str, font, 0, 0, 99999, 99999, 0); //GDI+
		temp_bmp.ReleaseGraphics(temp_gr);
		temp_bmp.Dispose();
		temp_gr = null;
		temp_bmp = null;
		return info.Width;
	}
}

window.SetTimeout(function() {
    fb.trace(fb.IsPlaying && fb.RunMainMenuCommand('View/ESLyric/Reload lyric')); // trigger onLyricGet
    fb.trace(fb.IsPlaying && fb.RunMainMenuCommand('视图/ESLyric/重载歌词'));
    ESLyric.RunPanelContextMenu("重载歌词");
}, 200);

function on_size() {
    ww = window.Width;
    wh = window.Height;
    if (!ww || !wh) return;

    Lyric.size(0, 0, ww, wh);
}

function on_paint(gr) {

    gr.FillSolidRect(0, 0, ww, wh, 0xff1e1e1e);

    Lyric.draw(gr);

}


function on_playback_new_track(metadb) {
    Lyric.init(true);
}

function on_playback_seek() {

    // TODO

}

function on_playback_stop(reason) {
    if (reason != 2) {
        Lyric.init(true);
    }
}

function on_playback_time(time) {

    Lyric.onPlaybackTime();

}

