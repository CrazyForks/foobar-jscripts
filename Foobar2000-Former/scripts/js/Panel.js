ON_MOUSE_LBTN_DOWN = 1;
ON_MOUSE_LBTN_UP = 2;
ON_MOUSE_LBTN_DBLCK = 3;
ON_MOUSE_RBTN_DOWN = 4;
ON_MOUSE_RBTN_UP = 5;
ON_MOUSE_MOVE = 6;
ON_MOUSE_LEAVE = 7;
ON_MOUSE_WHEEL = 8;
ON_MOUSE_MBTN_DOWN = 9;
ON_MOUSE_MBTN_UP = 10;

var g_unsized = true;
var g_unloaded = true;
var Mouse = { x: -1, y: -1, img: null, magnifier: false};
/*
Panel Template Object
this.$ = new oPanel(name, visible[, modal, ThemeStyle])：实例化
this.$.Size(x, y, w, h[, z])：面板初始化，回调this.OnSize()
Repaint([force])：刷新面板
RepaintRect(x, y, w, h)：刷新面板区域,相对位置(x, y)
Hide() / Show()：隐藏/显示
Activate() / Invalid()：鼠标首次移入移出
Focus() / Defocus()：获取鼠标焦点
OnMouse(event, x, y) Onkey(vkey) OnChar(code) OnPaint(gr)
Panel.Sort()：实例化所有oPanel对象后必须执行
Panel.CheckVisible()
Pane.Delete(name / arr)：删除面板 跳转Destory()
*/

oPanel = function (name, visible, modal, ThemeStyle) {
    this.name = name;
    this.visible = visible;
    this.active = false;
    this.click = false;
    this.drag = false;
    this.modal = modal;
    this.bg = null;

    this.x = 0, this.y = 0, this.w = 0, this.h = 0;
    this.offsetX = 0, this.offsetY = 0, this.totalX = 0, this.totalY = 0;
    this.z = 0;

    Panel.panels.push(this.name);

    this.GetBackgroundImage = function (bg, radio, iteration) {
        Image.Clear(this.bg);
        this.bg = null;
        if (bg) {
            this.bg = GetBackgroundImage(this.x, this.y, this.w, this.h);
            this.bg && radio && iteration && this.bg.BoxBlur(radio, iteration);
        }
    }

    this.Repaint = function (force) {
        $Invoke(this.name, 'OnRepaint');
        if (this.visible || force) {
            $RepaintRect(this.x, this.y, this.w, this.h);
        }
    }

    this.RepaintRect = function (x, y, w, h) {
        if (this.visible) {
            $RepaintRect(this.x + x, this.y + y, w, h);
        }
    }

    this.Size = function (x, y, w, h, z) {
        var resize = false;
        this.x = x;
        this.y = y;
        if (this.w != w || this.h != h) {
            this.w = w;
            this.h = h;
            resize = true;
        }
        if (typeof (z) == 'number') this.z = z;
        $Invoke(this.name, 'OnSize', resize);
    }

    this.Hide = function () {
        this.visible = false;
        Panel.focus = null;
        $Invoke(this.name, 'OnRepaint');
        if (this.modal)
            window.Repaint();
        else
            $RepaintRect(this.x, this.y, this.w, this.h);
        Panel.Mouse(ON_MOUSE_MOVE, Mouse.x, Mouse.y);
    }

    this.Show = function () {
        this.visible = true;
        Panel.focus = this.name;
        if (this.modal)
            window.Repaint();
        else
            this.Repaint();
        Panel.Mouse(ON_MOUSE_MOVE, Mouse.x, Mouse.y);
    }

    this.Move = function (x, y) {
        if (this.click && !this.drag) {
            this.drag = true;
            Drag.Start(x, y);
            Drag.Pos.x -= this.x;
            Drag.Pos.y -= this.y;
        }
        if (Drag.Move(x, y)) {
            this.x = Drag.x - Drag.Pos.x;
            this.y = Drag.y - Drag.Pos.y;
            $Invoke(this.name, 'OnMove', this.x, this.y);
            $Invoke(this.name, 'OnSize');
            window.Repaint();
        }
    }

    this.IsActive = function (x, y) {
        if (this.visible && this.x < x && this.y < y && this.x + this.w > x && this.y + this.h > y)
            return true;
        else
            return false;
    }

    this.Paint = function (gr) {
        $Invoke(this.name, 'OnPrevPaint', gr);
        if (this.bg) {
            Image.Draw(gr, this.bg, this.x, this.y, 0, 255);
        }
        if (ThemeStyle && typeof (ThemeStyle.bgColor) == 'number') {
            gr.FillSolidRect(this.x, this.y, this.w, this.h, ThemeStyle.bgColor);
        }
        $Invoke(this.name, 'OnPaint', gr);
    }
}

Panel = {

    panels: [],
    active: -1,
    focus: null,
    dragging: false,

    CheckVisible: function () {
        var isVisible = '';
        for (var i = 0; i < this.panels.length; i++) {
            if ($Get(this.panels[i], '$').visible) {
                isVisible += this.panels[i] + ' . ';
            }
        }
        Console && Console.Log(isVisible);
    },

    Delete: function (name) {
        this.active = -1;
        this.focus = null;
        this.dragging = false;
        if (name instanceof Array) {
            for (var i = 0; i < name.length; i++) {
                this.panels.Remove(name[i]);
                eval(name[i]).$.Hide();
                delete eval(name[i]).$;
                eval(name[i]).$ = null;
            }
            $Invoke(name[0], 'Destory');
        }
        else {
            this.panels.Remove(name);
            eval(name).$.Hide();
            delete eval(name).$;
            eval(name).$ = null;
            $Invoke(name[0], 'Destory');
        }
    },

    Sort: function () {
        for (var i = 0; i < this.panels.length - 1; i++) {
            for (var j = i + 1; j < this.panels.length; j++) {
                if (eval(this.panels[i]).$.z > eval(this.panels[j]).$.z) {
                    temp = this.panels[i];
                    this.panels[i] = this.panels[j];
                    this.panels[j] = temp;
                }
            }
        }
        if (this.active > -1) {
            for (var i = 0; i < this.panels.length; i++) {
                if (eval(this.panels[i]).$.active) {
                    this.active = i;
                    break;
                }
            }
        }
    },

    Activate: function (x, y) {
        var modal = false;
        for (var i = this.panels.length - 1; i >= 0; i--) {
            if (!modal && eval(this.panels[i]).$.IsActive(x, y)) {
                eval(this.panels[i]).$.active = true;
                this.active = i;
                break;
            }
            else {
                eval(this.panels[i]).$.active = false;
                if (i == 0) {
                    this.active = -1;
                    return;
                }
            }
            if (eval(this.panels[i]).$.modal && eval(this.panels[i]).$.visible) {
                modal = true;
            }
        }
        for (var i = 0; i < this.active; i++) {
            eval(this.panels[i]).$.active = false;
        }
    },

    Focus: function (x, y) {
        var defocus = this.focus;
        if (this.active > -1 && this.active < this.panels.length)
            this.focus = this.panels[this.active];

        if (defocus != this.focus) {
            $Invoke(defocus, 'Defocus', x, y);
            $Invoke(this.focus, 'Focus', x, y);
        }
    },

    Key: function (vkey) {
        if (g_unsized || g_unloaded) return;
        if (this.focus) {
            $Invoke(this.focus, 'OnKey', vkey);
        }
    },

    Char: function (code) {
        if (g_unsized || g_unloaded) return;
        if (this.focus) {
            $Invoke(this.focus, 'OnChar', code);
        }
    },

    Mouse: function (event, x, y) {
        if (g_unsized || g_unloaded) return;
        var unactive = false;
        if (event == ON_MOUSE_MBTN_DOWN) {
            Mouse.magnifier = true;
            Mouse.img && Mouse.img.Dispose();
            Mouse.img = null;
            window.Repaint();
        } else if (event == ON_MOUSE_MBTN_UP) {
            Mouse.magnifier = false;
            Mouse.img && Mouse.img.Dispose();
            Mouse.img = null;
            window.Repaint();
        }
        if (!this.dragging && (event == ON_MOUSE_LBTN_DOWN || event == ON_MOUSE_RBTN_DOWN)) {
            this.dragging = true;
        }
        if (this.dragging && (event == ON_MOUSE_LBTN_UP || event == ON_MOUSE_RBTN_UP)) {
            this.dragging = false;
            unactive = true;
            this.Focus(x, y);
        }
        if (event == ON_MOUSE_WHEEL) {
            if (this.focus != this.panels[this.active])
                this.Focus(x, y);
        }
        if (!this.dragging) {
            var invalid = this.active;
            if (unactive || event == ON_MOUSE_MOVE || event == ON_MOUSE_LEAVE) {
                this.Activate(x, y);
            }

            if (invalid != this.active) {
                if (invalid != -1)
                    $Invoke(this.panels[invalid], 'Invalid', x, y);
                if (this.active != -1)
                    $Invoke(this.panels[this.active], 'Activate', x, y);
            }
        }

        if (this.active != -1) {
            if (this.focus && eval(this.focus).$.modal) {
                if (eval(this.panels[this.active]).$.z >= eval(this.focus).$.z)
                    $Invoke(this.panels[this.active], 'OnMouse', event, x, y);
            }
            else
                $Invoke(this.panels[this.active], 'OnMouse', event, x, y);
        }
    },

    Exclusive: function (panel, x, y, time) {
        for (var i = this.panels.length - 1; i >= 0; i--) {
            if (eval(this.panels[i]).$.IsActive(x, y)) {
                if (this.panels[i] == panel.$.name) {
                    return [x, y];
                } else {
                    time++;
                    if (time > 5) {
                        return null;
                    }
                    var _x = x + 50;
                    var _y = y + 50;
                    if (_x > panel.$.x + panel.$.w - 2)
                        _x = panel.$.x + panel.$.w - 2;
                    if (_y > panel.$.y + panel.$.h - 2)
                        _y = panel.$.y + panel.$.h - 2;
                    return this.Exclusive(panel, _x, _y, time);
                }
            }
        }
    },

    Analog: function (panel, event) {
        var xy = this.Exclusive(panel, panel.$.x + 1, panel.$.y + 1, 0);
        xy && this.Mouse(event, xy[0], xy[1]);
    },

    Paint: function (gr) {
        for (var i = 0; i < this.panels.length; i++) {
            if (eval(this.panels[i]).$.visible) {
                if (eval(this.panels[i]).$.modal)
                    gr.FillSolidRect(0, 0, ww, wh, 0x40000000);

                eval(this.panels[i]).$.Paint(gr);
            }
        }
        if (Mouse.magnifier && !Mouse.img) {
            Mouse.img = $Magnifier(gr, Mouse.x - 25, Mouse.y - 25, 50, 2);
        }
        Image.Draw(gr, Mouse.img, Mouse.x - 50, Mouse.y - 50, 0, 255);
    }
}
