oRating = function (name) {
    this.$ = new oPanel(name, false);
    this.tf = "$meta(RATING)";
    this.icon = [];
    this.btn = [];
    this.rate = 0;
    this.click = -1;
    this.metadb = null;
    this.move = false;

    this.starW = $Z(20);

    this.GetIcon = function () {
        var ico = gdi.Image(PATH_ICO + 'star.png');
        var image = null;
        var g = null;
        for (var i = 0; i < 3; i++) {
            image = gdi.CreateImage(15, 14);
            g = image.GetGraphics();
            g.SetInterpolationMode(5);
            g.DrawImage(ico, 0, 0, 15, 14, i * 15, 0, 15, 14, 0, 255);
            image.ReleaseGraphics(g);
            this.icon[i] = image.Resize($Z(15), $Z(14));
            image.Dispose();
        }
        ico.Dispose();
    }
    this.GetIcon();

    this.Menu = function (x, y) {
        var m = window.CreatePopupMenu();
        m.AppendMenuItem(this.metadb ? 0 : 1, 1, '去除评级');
        var idx = m.TrackPopupMenu(x, y);
        if (idx == 1) {
            this.metadb.UpdateFileInfoSimple("RATING", '');
            this.$.Repaint();
        }
        m.Dispose();
    }

    this.Init = function () {
        this.metadb = Metadb.Handle();
        if (this.metadb) {
            if (Metadb.EnableMeta(this.metadb)) {
                this.rate = Number(Metadb.TitleFormat(this.tf, this.metadb));
            }
            else {
                this.metadb = null;
                this.rate = '<not set>';
            }
        }
        else
            this.rate = '<not set>';
    }
    this.Init();

    this.Update = function () {
        this.Init();
        this.$.Repaint();
    }

    this.Invalid = function () {
        this.move = false;
        this.click = -1;
        this.Init();
        this.$.Repaint();
    }

    this.OnMouse = function (event, x, y) {
        if (this.rate == '<not set>') return;
        switch (event) {
            case ON_MOUSE_LBTN_DOWN:
                for (var i = 0; i < 5; i++) {
                    if (this.$.x + i * this.starW < x && this.$.x + this.starW * (i + 1) > x) {
                        this.rate = i + 1;
                        this.click = i;
                        this.$.Repaint();
                        break;
                    }
                }
                break;

            case ON_MOUSE_LBTN_UP:
                if (this.click >= 0) {
                    this.click = -1;
                    if (this.metadb && this.rate != Number(Metadb.TitleFormat(this.tf, this.metadb))) {
                        this.metadb.UpdateFileInfoSimple("RATING", this.rate);
                    }
                    this.$.Repaint();
                }
                break;

            case ON_MOUSE_RBTN_UP:
                this.Menu(x, y);
                break;

            case ON_MOUSE_MOVE:
                this.move = true;
                for (var i = 0; i < 5; i++) {
                    if (this.$.x + i * this.starW < x && this.$.x + this.starW * (i + 1) > x) {
                        if (this.rate != i + 1) {
                            this.rate = i + 1;
                            this.$.Repaint();
                            break;
                        }
                    }
                }
                break;

            default:
                break;
        }
    }

    this.OnPaint = function (gr) {
        if (this.rate == '<not set>') return;
        for (var i = 0; i < this.rate; i++) {
            Image.Draw(gr, this.icon[1], this.$.x + i * this.starW, this.$.y + $Z(8), 0, 255);
        }
        for (var j = this.rate; j < 5; j++) {
            Image.Draw(gr, this.icon[0], this.$.x + j * this.starW, this.$.y + $Z(8), 0, 255);
        }
        if (this.click >= 0) {
            Image.Draw(gr, this.icon[2], this.$.x + this.click * this.starW, this.$.y + $Z(8), 0, 255);
        }
    }
}

var Rating = null;
