//define
IMG_ADAPT = 0;      //适应
IMG_CROP = 1;       //修剪
IMG_STRETCH = 2;    //拉伸
IMG_FILL = 3;       //填充

IMG_NONE = 0;       //默认
IMG_SHADOW = 1;     //阴影
IMG_INVERT = 2;     //倒影

IMG_CENTER = 0;     //居中
IMG_LEFT = 1;       //靠左
IMG_TOP = 2;        //靠上
IMG_RIGHT = 4;      //靠右
IMG_BOTTOM = 8;     //靠下

/*
Image：对象实例
oimage Get(path)：获取 oimage { src : 路径, $ : 图像 }
bool IsImage(image)：是否为图像对象
Clear(image)：释放资源
oimage Clone(oimage)：副本
pixels GetPixels(image)；获取像素数组，最大300*300像素
image SetPixels(pixels)：像素打印为图像
xy[] GetXY(image, w, h, align)：图像相对位置，align = IMG_CENTER, IMG_LEFT, IMG_TOP, IMG_RIGHT, IMG_BOTTOM
Draw(g, image, x, y, angle, alpha)：绘制图像
image ApplyShadow(image, w, h, InterpolationMode, padding)：获取阴影
image ApplyInvert(image, w,  h, InterpolationMode, padding)：获取倒影
image Process(image, w, h, aspect, [InterpolationMode, option, padding])：图像处理，Resize(w，h)，aspect = IMG_ADAPT, IMG_CROP, IMG_FILL, IMG_STRETCH, option = IMG_NONE, IMG_SHADOW, IMG_INVERT
image Circle(image, size, InterpolationMode)：裁剪为圆形
image Smooth(image, padding)：平滑渐隐
image Blur(image, radius, iteration)：模糊平滑
image Cut (image, x, y, w, h)：裁剪
image Shadow(image, offsetX, offsetY, radius, iteration, alpha)：获取阴影（不规则透明图像，低效率）
image Gray(image)：灰度化
*/

Image = {

    Get: function (path) {
        var ret = new oImage();
        if (typeof (path) == 'string')
            ret.src = path;
        var img = gdi.Image(path);
        if (img)
            ret.$ = img;
        return ret;
    },

    IsImage: function (image) {
        if (image) {
            if (typeof (image.Width) == 'number' && typeof (image.Height) == 'number') {
                return true;
            }
        }
        return false;
    },

    Clear: function (image) {
        if (this.IsImage(image)) image.Dispose();
    },

    Clone: function (oimage) {
        var ret = new oImage(oimage.src);
        if (this.IsImage(oimage.$))
            ret.$ = oimage.$.Clone(0, 0, oimage.$.Width, oimage.$.Height);
        else
            ret.$ = null;
        return ret;
    },

    GetPixels: function (image) {
        if (!this.IsImage(image)) {
            return null;
        }
        var pixels = [];
        for (var i = 0; i < image.Width; i++) {
            pixels[i] = [];
            for (var j = 0; j < image.Height; j++) {
                pixels[i][j] = image.getPixel(i, j);
            }
        }
        return pixels;
    },

    SetPixels: function (pixels) {
        if (!$IsBinaryArray(pixels)) {
            return null;
        }
        var image = gdi.CreateImage(pixels.length, pixels[0].length);
        var g = image.GetGraphics();

        for (var i = 0; i < pixels.length; i++) {
            for (var j = 0; j < pixels[0].length; j++) {
                g.FillSolidRect(i, j, 1, 1, pixels[i][j]);
            }
        }

        image.ReleaseGraphics(g);
        return image;
    },

    GetXY: function (image, w, h, align) {
        if (!this.IsImage(image)) {
            return null;
        }
        if (typeof (align) == 'undefined') {
            align = 0;
        }
        var x = Math.floor((w - image.Width) / 2);
        var y = Math.floor((h - image.Height) / 2);
        if (align == IMG_CENTER) {
            return [x, y];
        }
        if (align.IsOne(1)) //IMG_LEFT
        {
            x = 0;
        }
        if (align.IsOne(2)) //IMG_TOP
        {
            y = 0;
        }
        if (align.IsOne(3)) //IMG_RIGHT
        {
            x = w - image.Width;
        }
        if (align.IsOne(4)) //IMG_BOTTOM
        {
            y = h - image.Height;
        }
        return [x, y];
    },

    Draw: function (g, image, x, y, angle, alpha) {
        if (!this.IsImage(image) || alpha < 0 || alpha > 255) {
            return null;
        }
        g.DrawImage(image, x, y, image.Width, image.Height, 0, 0, image.Width, image.Height, angle, alpha);
    },

    ApplyShadow: function (image, w, h, InterpolationMode, padding) {
        if (!this.IsImage(image)) {
            return null;
        }
        var img = image.Resize(w, h, InterpolationMode);
        var g = null;

        var shadow = gdi.CreateImage(w + 2 * padding, h + 2 * padding);
        g = shadow.GetGraphics();
        g.SetSmoothingMode(2);
        g.DrawRoundRect(padding, padding, w, h, 2, 2, 2, $RGB(0, 0, 0));
        shadow.ReleaseGraphics(g);
        shadow.BoxBlur(1, 2);

        var ret = gdi.CreateImage(w + 2 * padding, h + 2 * padding);
        g = ret.GetGraphics();
        this.Draw(g, shadow, 0, 0, 0, 128);
        this.Draw(g, img, padding, padding, 0, 255);
        g.DrawRect(padding, padding, w, h, 1, $RGBA(0, 0, 0, 64));
        ret.ReleaseGraphics(g);

        img.Dispose();
        shadow.Dispose();
        return ret;
    },

    ApplyInvert: function (image, w, h, InterpolationMode, padding) {
        if (!this.IsImage(image)) {
            return null;
        }
        var img = image.Resize(w, h, InterpolationMode);
        var invert = img.Resize(w, h, InterpolationMode);
        invert.RotateFlip(6);
        var g = null;

        var shade = gdi.CreateImage(w, h);
        g = shade.GetGraphics();
        g.FillGradRect(-1, -1, w + 2, padding + 2, 90, $RGB(0, 0, 0), $RGB(255, 255, 255), 1.0);
        shade.ReleaseGraphics(g);
        shade.BoxBlur(1, 1);
        invert.ApplyMask(shade);

        var ret = gdi.CreateImage(w, h + padding);
        g = ret.GetGraphics();
        this.Draw(g, img, 0, 0, 0, 255);
        this.Draw(g, invert, 0, h, 0, 255);
        ret.ReleaseGraphics(g);

        img.Dispose();
        invert.Dispose();
        shade.Dispose();
        return ret;
    },

    Process: function (image, w, h, aspect, InterpolationMode, option, padding) {
        if (!this.IsImage(image)) {
            return null;
        }
        if (typeof (InterpolationMode) == 'undefined') {
            InterpolationMode = 0;
        }
        if (typeof (option) == 'undefined') {
            option = 0;
        }
        else if (typeof (padding) == 'undefined') {
            if (option == IMG_SHADOW) padding = 6;
            else padding = 30;
        }
        if (option == IMG_SHADOW) {
            w -= 2 * padding;
            h -= 2 * padding;
        }
        else if (option == IMG_INVERT) {
            h -= padding;
        }
        if (w <= 0 || h <= 0) {
            return null;
        }
        var _w = 0, _h = 0;
        switch (aspect) {
            default:

            case IMG_ADAPT:
                var scale = 0;
                if (Math.max(image.Width, image.Height) < Math.min(w, h)) {
                    scale = 1;
                }
                else {
                    scale = Math.min(w / image.Width, h / image.Height);
                }
                _w = Math.floor(scale * image.Width);
                _h = Math.floor(scale * image.Height);
                break;

            case IMG_CROP:
                var scale = Math.max(w / image.Width, h / image.Height);

                _w = Math.ceil(scale * image.Width);
                _h = Math.ceil(scale * image.Height);

                if (_w > w) {
                    var img = image.Resize(_w, _h, InterpolationMode);
                    var _x = Math.floor((_w - w) / 2);
                    _w = w;
                    image = this.Cut(img, _x, 0, _w, _h);
                }
                if (_h > h) {
                    var img = image.Resize(_w, _h, InterpolationMode);
                    var _y = Math.floor((_h - h) / 2);
                    _h = h;
                    image = this.Cut(img, 0, _y, _w, _h);
                }
                
                break;

            case IMG_STRETCH:
                _w = w;
                _h = h;
                break;

            case IMG_FILL:
                var scale = Math.max(w / image.Width, h / image.Height);

                _w = Math.ceil(scale * image.Width);
                _h = Math.ceil(scale * image.Height);
                break;
        }
        if (option == IMG_SHADOW) {
            return this.ApplyShadow(image, _w, _h, InterpolationMode, padding);
        }
        else if (option == IMG_INVERT) {
            return this.ApplyInvert(image, _w, _h, InterpolationMode, padding);
        }
        return image.Resize(_w, _h, InterpolationMode);
    },

    Circle: function (image, size, InterpolationMode) {
        if (!this.IsImage(image)) {
            return null;
        }
        var img = this.Process(image, size, size, IMG_FILL, InterpolationMode);
        var g = null;

        var circle = gdi.CreateImage(size, size);
        g = circle.GetGraphics();
        g.SetSmoothingMode(2);
        g.FillSolidRect(0, 0, size, size, 0xffffffff);
        g.FillEllipse(1, 1, size - 2, size - 2, 0xff000000);
        g.DrawEllipse(1, 1, size - 2, size - 2, 1, 0x80000000);
        g.DrawEllipse(1, 1, size - 2, size - 2, 2, 0x40000000);
        circle.ReleaseGraphics(g);

        var ret = gdi.CreateImage(size, size);
        g = ret.GetGraphics();
        var xy = this.GetXY(img, size, size, IMG_CENTER);
        this.Draw(g, img, xy[0], xy[1], 0, 255);
        ret.ReleaseGraphics(g);

        ret.ApplyMask(circle);
        circle.Dispose();
        return ret;
    },

    Smooth: function (image, padding) {
        if (!this.IsImage(image)) {
            return null;
        }
        var g = null;

        var border = gdi.CreateImage(image.Width, image.Height);
        g = border.GetGraphics();
        g.FillGradRect(-1, Math.floor(image.Height - padding), image.Width + 2, padding + 2, 90, $RGB(0, 0, 0), $RGB(255, 255, 255), 1.0);
        border.ReleaseGraphics(g);
        border.BoxBlur(1, 2);

        image.ApplyMask(border);
    },

    Blur: function (image, radius, iteration) {
        var blur = image.Clone(0, 0, image.Width, image.Height);
        blur.BoxBlur(radius, iteration);
        var ret = gdi.CreateImage(image.Width, image.Height);
        var g = ret.GetGraphics();
        this.Draw(g, blur, 0, 0, 0, 255);
        this.Draw(g, image, 0, 0, 0, 255);
        ret.ReleaseGraphics(g);

        blur.Dispose();
        return ret;
    },

    Cut: function (image, x, y, w, h) {
        if (!this.IsImage(image)) {
            return null;
        }

        var ret = gdi.CreateImage(w, h);
        var g = ret.GetGraphics();
        this.Draw(g, image, -x, -y, 0, 255);
        ret.ReleaseGraphics(g);

        return ret;
    },

    Shadow: function (image, offsetX, offsetY, radius, iteration, alpha) {
        if (!this.IsImage(image)) return null;

        var pixels = this.GetPixels(image);
        for (var i = 0; i < pixels.length; i++) {
            for (var j = 0; j < pixels[0].length; j++) {
                var rgb = $GetRGBA(pixels[i][j]);
                if (rgb[3] > 0) {
                    pixels[i][j] = $RGB(0, 0, 0);
                }
            }
        }
        var shadow = this.SetPixels(pixels);
        if (radius)
            shadow.BoxBlur(radius, iteration);
        var ret = gdi.CreateImage(image.Width, image.Height);
        var g = ret.GetGraphics();
        this.Draw(g, shadow, offsetX, offsetY, 0, alpha);
        this.Draw(g, image, 0, 0, 0, 255);
        ret.ReleaseGraphics(g);

        shadow.Dispose();
        return ret;
    },

    Gray: function (image) {
        if (!this.IsImage(image)) {
            return null;
        }
        var pixels = this.GetPixels(image);
        for (var i = 0; i < pixels.length; i++) {
            for (var j = 0; j < pixels[0].length; j++) {
                var rgb = $GetRGBA(pixels[i][j]);
                var gray = ((1224 * rgb[0] + 2404 * rgb[1] + 467 * rgb[2])) >> 12;
                pixels[i][j] = $RGB(gray, gray, gray);
            }
        }
        return this.SetPixels(pixels);
    }
}

/*
var oimage = new oImage(src, $);
var img = new oImg(oimage, w, h, aspect, angle, alpha, [InterpolationMode, align, option, padding])：实例化对象
Update(oimage)
Paint(gr, x, y)：绘制画布
*/
oImage = function (src, $) {
    this.src = typeof (src) == 'undefined' ? null : src;
    this.$ = typeof ($) == 'undefined' ? null : $;
}

oImg = function (oimage, w, h, aspect, angle, alpha, InterpolationMode, align, option, padding) {
    this.x = 0;
    this.y = 0;
    this.w = w;
    this.h = h;
    this.aspect = aspect;
    this.angle = angle;
    this.alpha = alpha;
    this.src = oimage.src;

    if (typeof (InterpolationMode) == 'undefined') this.InterpolationMode = 0;
    else this.InterpolationMode = InterpolationMode;

    if (typeof (align) == 'undefined') this.align = IMG_CENTER;
    else this.align = align;

    if (typeof (option) == 'undefined') this.option = IMG_NONE;
    else this.option = option;

    if (typeof (padding) == 'undefined') {
        if (this.option == IMG_SHADOW) this.padding = 6;
        else this.padding = 30;
    }
    else this.padding = padding;

    this.image = Image.Process(oimage.$, w, h, aspect, InterpolationMode, this.option, this.padding);

    this.Update = function (oimage) {
        Image.Clear(this.image);
        this.image = Image.Process(oimage.$, w, h, aspect, InterpolationMode, this.option, this.padding);
        this.src = oimage.src;
    }

    this.Paint = function (gr, x, y) {
        if (!this.image) return;

        var xy = Image.GetXY(this.image, this.w, this.h, this.align);
        var canvas = gdi.CreateImage(this.w, this.h);
        if (null == canvas) {
            return;
        }
        var g = canvas.GetGraphics();
        Image.Draw(g, this.image, this.x + xy[0], this.y + xy[1], this.angle, this.alpha);
        canvas.ReleaseGraphics(g);

        Image.Draw(gr, canvas, x, y, 0, 255);
        canvas.Dispose();
    }
}

/*
图像内存缓存
*/
ImageCache = function () {

    this.data = new HashMap();
    this.size = 0;

    this.Contains = function (key) {
        return this.data.Contains(key);
    }

    this.Add = function (key, obj) {
        this.data.Set(key, obj);
        this.size++;
    }

    this.Clear = function () {
        delete this.data;
        this.data = new HashMap();
        this.size = 0;
    }

    this.Get = function (key) {
        return this.data.Get(key);
    }

    this.Remove = function (key) {
        this.data.Remove(key);
        this.size--;
    }
}