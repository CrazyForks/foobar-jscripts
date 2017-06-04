/* global gdi utils fb ActiveXObject */
/* eslint-disable no-mixed-operators */
/* eslint-disable one-var */

// Required:
// * foobar2000 v1.3.3+
// * WSH Panel Mod Plus v1.5.7+
//
// Installation:
// * Import/paste the whole file content to wshmp's editor or
// * Use `PREPROCESSOR' to @import file like below.
//
// ==PREPROCESSOR==
// @author "lenka"
// @import "path\to\script.js"
// ==/PREPROCESSOR==

// Helpers
// --------

if (typeof setTimeout === 'undefined') {
  var setTimeout = function (func, delay) {
    return window.SetTimeout(func, delay);
  };
}

if (typeof clearTimeout === 'undefined') {
  var clearTimeout = function (timerId) {
    window.clearTimeout(timerId);
  };
}

if (typeof setInterval === 'undefined') {
  var setInterval = function (func, delay) {
    return window.setInterval(func, delay);
  };
}

if (typeof clearInterval === 'undefined') {
  var clearInterval = function (timerId) {
    window.clearInterval(timerId);
  };
}

function isArray (arg) {
  return Object.prototype.toString.call(arg) === '[object Array]';
}

// jQuery.isNumeric()
function isNumeric (obj) {
  return !isArray(obj) && (obj - parseFloat(obj) + 1) >= 0;
}

function inherit (subClass, superClass) {
  var F = function () {};
  F.prototype = superClass.prototype;
  subClass.prototype = new F();
  subClass.prototype.constructor = subClass;

  subClass.superclass = superClass.prototype;
  if (superClass.prototype.constructor === Object.prototype.constructor) {
    superClass.prototype.constructor = superClass;
  }
}

function throttle (fn, threshhold, scope) {
  threshhold || (threshhold = 250);
  var last,
    deferTimer;
  return function () {
    var context = scope || this;

    var now = +new Date(),
      args = arguments;
    if (last && now < last + threshhold) {
      // hold on to it
      window.clearTimeout(deferTimer);
      deferTimer = window.setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}

// Enhanced version of `window#GetProperty`.
var getProperty = function (key, defVal, check) {
  if (check && !(typeof check === 'function')) {
    throw Error('`check` is not a function.');
  }
  if (!check(defVal)) {
    throw Error('`defVal` is not valid.');
  }
  var value = window.GetProperty(key, defVal);

  if (check != null) {
    return check(value) ? value : defVal;
  } else {
    return value;
  }
};

var REFRESH_INTERVAL = getProperty('refresh_interval', 15, isNumeric);

// A throttled version of `window#Repaint`, to restrict it be executed at 
// most once every 15ms.
//
// Always use `repaintAll` instead of `window#Repaint` unless you know what
// you are doing.
var repaintAll = throttle(function () {
  window.Repaint();
}, REFRESH_INTERVAL);

// Return a zoomed value, to adapt Windows zoom percent.
var sizeOf = (function () {
  var objShell, tmp, factor;

  objShell = new ActiveXObject('WScript.Shell');
  tmp = objShell.RegRead('HKEY_CURRENT_USER\\Control Panel\\Desktop\\WindowMetrics\\AppliedDPI');
  factor = Math.round(tmp / 96 * 100) / 100;
  return function (value) {
    return Math.round(value * factor);
  };
}());

// Used in `gdi#DrawString`, set string alignment and etc.
function StringFormat () {
  var ref = [0, 0, 0, 0];
  var len = arguments.length;
  var i;

  // ref.length == 4
  for (i = 0; i < len && i < 4; i++) {
    if (ref[i] != null) {
      ref[i] = arguments[i];
    }
  }

  return ((ref[0] << 28) | (ref[1] << 24) | (ref[2] << 20) | ref[3]);
}

// Create icon image from font code. Look up font code through *Charater Map*
// which every Windows system has pre-installed.
function createIcon (code, font, color, w, h, sf) {
  var img = gdi.CreateImage(w, h);
  var g = img.GetGraphics();
  sf = (sf || StringFormat(1, 1));
  g.SetTextRenderingHint(3);
  g.DrawString(code, font, color, 0, 0, w, h, sf);
  img.ReleaseGraphics(g);
  return img;
}

function rgba (r, g, b, a) {
  return ((a << 24) | (r << 16) | (g << 8) | (b));
}

function rgb (r, g, b) {
  return (0xff000000 | (r << 16) | (g << 8) | (b));
}

function setAlpha (color, a) {
  return ((color & 0x00ffffff) | (a << 24));
}

// Globals
// ----------

var Mouse = {x: -1, y: -1};
var ww = 0;
var wh = 0;

var gColors = {
  text: 0xff000000,
  back: 0xffffffff
// highlight: hsb(5, 80, 100),
// highlight2: hsb(5, 80, 60)
};
var gFonts = {
  name: 'Open Sans',
  ico: 'Segoe MDL2 Assets'
};

var AlbumArtId = {
  front: 0,
  disc: 3
};

// Class
// ------

var Rectangle = function () {
  this.visible = true;
  this.enabled = false;
};

var isVisible = function (r) {
  if (!(r instanceof Rectangle)) {
    fb.trace(JSON.stringify(r) + ' is not a `Rectangle`');
    return false;
  }
  return r.visible;
};

Rectangle.prototype.isVisible = function () {
  return this.enabled && this.visible;
};

Rectangle.prototype.trace = function (mx, my) {
  var isMouseOver = (mx > this.x && mx < this.x + this.w && my > this.y && my < this.y + this.h);
  return this.enabled && this.visible && isMouseOver;
};

Rectangle.prototype.setXY = function (x, y) {
  this.x = x;
  this.y = y;
};

Rectangle.prototype.setBounds = function (x, y, width, height) {
  this.x = x;
  this.y = y;
  this.w = width;
  this.h = height;
  this.enabled = (width * height > 0);
};

Rectangle.prototype.repaint = function () {
  this.enabled && this.visible && repaintAll();
};

var ScrollBar = function (parent) {
  ScrollBar.superclass.constructor.call(this);
  this.cH = 0;
  this.cY = 0;
  this.state = 0;
  this.expand = false;
  parent || (this.parent = parent);
};

inherit(ScrollBar, Rectangle);

ScrollBar.prototype.draw = function (gr, areaH, totalH, offset) {
  if (!this.enabled || !this.visible) return;
  if (areaH >= totalH) return;

  this.areaH = areaH;
  this.totalH = totalH;
  this.offset = offset;

  // Calculate cursor height & position.
  this.cH = Math.round(areaH / totalH * areaH);
  if (this.cH < this.MIN_HEIGHT) this.cH = this.MIN_HEIGHT;
  this.cY = this.y + Math.round((areaH - this.cH) * offset / (totalH - areaH));

  // Draw
  gr.FillSolidRect(this.x, this.y, this.w, this.h, setAlpha(gColors.text, 0x10));
  var cursorColorAlpha = [0x30, 0x80, 0xa0];
  gr.FillSolidRect(this.x + 1, this.cY, this.w - 2, this.cH, setAlpha(gColors.text, cursorColorAlpha[this.state]));
};

ScrollBar.prototype.traceCursor = function (x, y) {
  return (x > this.x && x < this.x + this.w && y > this.cY && y < this.cY + this.cH);
};

ScrollBar.prototype.onMouseMove = function (x, y) {
  if (this.state === 2) {
    var cY = y - this.cursorDelta;
    var ratio = (cY - this.y) / (this.h - this.cH);
    var offset = Math.round((this.totalH - this.areaH) * ratio);

    this.parent.offset = this.parent.checkOffset(offset);
  } else {
    this.state = this.traceCursor(x, y) ? 1 : 0;
    //
    var me = this;

    var expanded = this.trace(x, y);
    var right = this.x + this.w;
    if (expanded !== this.expand) {
      var timer = setTimeout(function () {
        me.expand = expanded;
        if (me.expand) {
          me.x = right - me.WIDTH_EX;
          me.w = me.WIDTH_EX;
        } else {
          me.x = right - me.WIDTH;
          me.w = me.WIDTH;
        }
        me.onMouseMove(x, y);
        clearTimeout(timer);
      }, expanded ? 5 : 2000);
    }
    this.repaint();
  }
};

ScrollBar.prototype.onMouseDown = function (x, y) {
  if (this.traceCursor(x, y)) {
    this.state = 2;
    this.cursorDelta = y - this.cY;
    this.repaint();
  } else {
  }
};

ScrollBar.prototype.onMouseUp = function (x, y) {
  if (this.traceCursor(x, y)) {
    this.state = 1;
  } else {
    this.state = 0;
  }
  this.repaint();
};

ScrollBar.prototype.onMouseLeave = function () {
  this.state = 0;
  this.onMouseMove(-1, -1);
};

var Grid = function () {};

var Browser = function () {
  Browser.superclass.constructor.call(this);
  this.groupKey = '';
  this.groupKeyId = 0;
  this.groups = [];
  this.metadbs = plman.GetPlaylistItems(-1);
  this.offset = 0;
  this._offset = 0;
  this.scrollbar = new ScrollBar(this);
  this.initialize();
};

inherit(Browser, Rectangle);

Browser.prototype.getOffset = function () {
  return this._offset;
};

Browser.prototype.setOffset = function (offset) {
  this.offset = this.checkOffset(offset);
};

Browser.prototype.checkOffset = function (offset) {
  var thumbH = this.thumb.height;
  if (offset > (this.totalHeight - this.h + thumbH)) {
    offset = Math.round((this.totalHeight - this.h + thumbH) / thumbH - 0.5) * thumbH;
  }
  if (this.totalHeight < this.h || offset < 0) {
    offset = 0;
  }
  return offset;
};

var TF_GROUP = fb.TitleFormat('%album artist%^^%album%^^%discnumber%');
var TF_SORT = fb.TitleFormat('%album artist%^^%album%^^%discnumber%^^%tracknumber%');

Browser.prototype.initialize = function () {};

function getLibraryList () {
  var emptyList = plman.GetPlaylistItems(-1);
  if (!fb.IsMediaLibraryEnabled()) {
    fb.trace('Library: Media libary is not enabled!');
    return emptyList;
  }
  var list = fb.GetAllItemsInMediaLibrary();
  if (!list || list.Count === 0) {
    fb.trace('Library: No music in this library.');
    return emptyList;
  }
  return list;
}

function getAlbumList (key) {
  var emptyList = fb.GetPlaylistItems(-1);
  return emptyList;
}

Browser.prototype.updateMetadbs = function (metadbs) {
  // Update metadbs
  // metadbs || (this.metadbs = metadbs)
  this.metadbs = metadbs;
  this.metadbs.OrderByFormat(TF_SORT, 1);

  // Update groups
  this.getGroups();

  // Reset offset
  this.offset = this._offset = 0;
  this.repaint();
};

Browser.prototype.getGroups = function () {
  var compareKey = '12345689#@!';
  var _metadbs = plman.GetPlaylistItems(-1);
  var listCount = this.metadbs.Count;
  var listId = 0;
  var groupId = 0;
  var objTemp;

  // Reset groups.
  this.groups = [];

  while (listId < listCount) {
    var metadb = this.metadbs.Item(listId);
    var _compareKey = TF_GROUP.EvalWithMetadb(metadb);
    var keyArr;

    if (_compareKey !== compareKey) {
      compareKey = _compareKey;
      keyArr = compareKey.split('^^');
      objTemp = this.groups[groupId] = {
        metadb: metadb,
        album: keyArr[1],
        albumArtist: keyArr[0],
        discNumber: keyArr[2],
        key: compareKey,
        requested: false
      };
      objTemp.metadbs = _metadbs.Clone();
      objTemp.metadbs.Add(metadb);

      groupId++;
    } else {
      objTemp.metadbs.Add(metadb);
    }

    listId++;
  }

  // for TEST.
  fb.trace('Library loaded ----------------');
  fb.trace('Groups: ' + this.groups.length);
};

var MIN_WIDTH = sizeOf(150);

Browser.prototype.getFonts = function () {
  this.font = gdi.font(gFonts.name, sizeOf(12));
  this.fontBig = gdi.font(gFonts.name, this.font.size + 2);
};

Browser.prototype.getMetrics = function () {
  if (!this.isVisible()) return null;
  if (typeof this.font === 'undefined') {
    this.getFonts();
  }

  var columnCount = Math.floor(this.w / MIN_WIDTH);
  var size = {};
  var thumbW, thumbH;

  thumbW = Math.floor(this.w / columnCount);
  thumbH = thumbW + this.font.height * 3;

  this.rowCount = Math.ceil(this.h / size.thumbH);

  this.thumb = {
    width: thumbW,
    height: thumbH,
    maxWidth: Math.floor(MIN_WIDTH * 3 / 2)
  };
  this.columnCount = columnCount;

  this.totalHeight = Math.ceil(this.groups.length / columnCount) * thumbH;
};

Browser.prototype.onSize = function () {
  var scrbW = sizeOf(5);
  this.scrollbar.setBounds(this.x + this.w - scrbW, this.y, scrbW, this.h);
};

Browser.prototype.drawThumb = function (gr, index, x, y, width, height, state) {
  var padCover = sizeOf(5);
  // Draw cover image.
  var group = this.groups[index];

  // fb.trace(group.key)
  group.image = albumArtCache.hit(group.metadb, AlbumArtId.front, group.key);

  if (group.image) {
    // cover
    gr.GdiAlphaBlend(group.image, x + padCover, y + padCover, width - padCover * 2, width - padCover * 2,
      0, 0, group.image.width, group.image.height);
  } else {
    // no cover
    gr.FillSolidRect(x + padCover, y + padCover, width - padCover * 2, width - padCover * 2, rgb(240, 240, 220));
  }

  // Album & artist
  var albumY = width;
  gr.GdiDrawText(this.groups[index].album, this.fontBig, rgb(0, 0, 0), x + padCover, y + width, width - padCover * 2, this.fontBig.height, 0);
  gr.GdiDrawText(this.groups[index].albumArtist, this.font, rgb(50, 50, 50), x + padCover, y + width + this.fontBig.height + sizeOf(5), width - padCover * 2, this.font.height, 0);
};

Browser.prototype.draw = function (gr) {
  if (!this.isVisible()) return;

  var thumbW = this.thumb.width;
  var thumbH = this.thumb.height;
  var offset = this.getOffset();
  var start, end;

  // Get limits.
  if (this.groups.length <= this.columnCount * this.rowCount) {
    start = 0;
    end = this.groups.length;
  } else {
    start = Math.round(offset / thumbH) * this.columnCount;
    start = start > 0 ? start - this.columnCount : (start < 0 ? 0 : start);
    end = Math.ceil((offset + this.h) / thumbH) * this.columnCount;
    end = this.groups.length < end ? this.groups.length : end;
  }

  // Save limits to properties.
  this.startId = start;
  this.endId = end;

  // Draw thumbs.
  for (var i = start; i < end; i++) {
    var j = Math.floor(i / this.columnCount);
    var thumbX = (i % this.columnCount) * thumbW;
    var thumbY = Math.floor(j * thumbH - offset);
    this.drawThumb(gr, i, thumbX, thumbY, thumbW, thumbH, 0);
  }

  // Draw scrollbar
  this.scrollbar.draw(gr, this.h, this.totalHeight, offset);
};

Browser.prototype.scroll = function (step) {
  var self = this;
  var offset = this.getOffset();
  this.setOffset(offset - step * this.thumb.height / 3 * 2);
  // 
  if (self.scrollTimer) clearTimeout(self.scrollTimer);

  // 监控是否滚动到位
  var onTimer = function () {
    if (Math.abs(self.offset - self._offset) > 0.5) {
      self._offset += (self.offset - self._offset) / 4;
      self.isScrolling = true;
      self.repaint();
      self.scrollTimer = setTimeout(onTimer, REFRESH_INTERVAL);
    } else {
      clearTimeout(self.scrollTimer);
      self._offset = self.offset;
      self.isScrolling = false;
      self.repaint();
    }
  };
  onTimer();

// self.scrollTimer = setTimeout(onTimer, REFRESH_INTERVAL)
};

var ImageCache = function () {
  this._list = {};

  this.hit = function (metadb, artId, key) {
    if (typeof key === 'undefined') {
      key = TF_GROUP.EvalWithMetadb(metadb);
    }
    var img = this._list[key];
    if (img) return img;

    if (!ImageCache.timer) {
      ImageCache.timer = setTimeout(function () {
        if (!browser.isScrolling) {
          utils.GetAlbumArtAsync(window.ID, metadb, artId, true, false);
        }
        clearTimeout(ImageCache.timer);
        ImageCache.timer = null;
      }, REFRESH_INTERVAL);
    }
  };

  this.getit = function (metadb, image, key, callback) {
    this._list[key] = (image && image.Resize(MIN_WIDTH, MIN_WIDTH, 0).CreateRawBitmap());
    return image;
  };
};

ImageCache.timer = null;

function on_get_album_art_done (metadb, artId, image, imagePath) {
  // On image cache.
  // TODO: i = start, len = end
  for (var i = browser.startId; i < browser.endId; i++) {
    var group = browser.groups[i];
    // if (!group.requested) break
    if (group.metadb && group.metadb.compare(metadb)) {
      if (artId === AlbumArtId.front && !image) {
        albumArtCache.hit(metadb, AlbumArtId.disc, group.key);
        break;
      } else {
        albumArtCache.getit(metadb, image, group.key);
        repaintAll();
        break;
      }
    }
  }
}

var albumArtCache = new ImageCache();
var browser = new Browser();
var toolbar = null;

browser.updateMetadbs(fb.GetAllItemsInMediaLibrary());

function on_size () {
  ww = Math.max(window.width, MIN_WIDTH * 2);
  wh = window.height;
  if (!ww || !wh) return;

  browser.setBounds(0, 0, ww, wh);
  browser.getMetrics();
  browser.onSize();
}

function on_paint (gr) {
  browser.draw(gr);
}

function on_mouse_wheel (step) {
  browser.scroll(step);
}
