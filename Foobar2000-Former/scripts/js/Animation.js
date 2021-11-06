ANIMATION_INTERVAL = 15; //刷新间隔 ms
var AnimationOn = false;
/*
new oAnimation(name)：动画实例
func = function(){}：回调函数
Alpha(obj, from, to, client, time, func)：obj = 拥有alpha属性对象 client = 拥有x,y,w,h属性对象,非object对象默认刷新全局
AlphaV2(objArr, client, time, func)：objArr = [[obj1,from,to],[obj2,from,to],...]
SSA(obj, x, y, w, h, angle, alpha, client, iter, func)：obj至少拥有x或y属性，iter递归参数
SSAV2(objArr, client, iter, func)：objArr = [[obj1,x,y,w,h,angle,alpha],[obj2,x,y,w,h,angle,alpha],...]
*/
oAnimation = function (name) {
    this.timer = null;

    this.Alpha = function (obj, from, to, client, time, func) {
        AnimationOn = true;
        if (eval(name).timer) {
            window.ClearInterval(eval(name).timer);
        }
        obj.alpha = from;
        var interval = Math.floor((to - from) / time);
        eval(name).timer = window.SetInterval(function () {
            obj.alpha += interval;

            if (obj.alpha <= 0 || obj.alpha >= 255) {
                obj.alpha = to;
                window.ClearInterval(eval(name).timer);
                eval(name).timer = null;

                if (typeof (client) == 'object')
                    $RepaintRect(client.x, client.y, client.w, client.h);
                else
                    $RepaintRect(obj.x, obj.y, obj.w, obj.h);
                if (typeof (func) == 'function') func();
                AnimationOn = false;
                return;
            }
            if (typeof (client) == 'object')
                $RepaintRect(client.x, client.y, client.w, client.h);
            else
                $RepaintRect(obj.x, obj.y, obj.w, obj.h);

        }, ANIMATION_INTERVAL);
    }

    this.AlphaV2 = function (objArr, client, time, func) {
        AnimationOn = true;
        if (eval(name).timer) {
            window.ClearInterval(eval(name).timer);
        }
        if (!$IsBinaryArray(objArr)) return;

        for (var i = 0; i < objArr.length; i++) {
            objArr[i][0].alpha = objArr[i][1];
        }
        eval(name).timer = window.SetInterval(function () {
            for (var i = 0; i < objArr.length; i++) {
                objArr[i][0].alpha += Math.floor((objArr[i][2] - objArr[i][1]) / time);
            }
            if (objArr[0][0].alpha <= 0 || objArr[0][0].alpha >= 255) {
                for (var i = 0; i < objArr.length; i++) {
                    objArr[i][0].alpha = objArr[i][2];
                }
                window.ClearInterval(eval(name).timer);
                eval(name).timer = null;

                if (typeof (client) == 'object')
                    $RepaintRect(client.x, client.y, client.w, client.h);
                else
                    $RepaintRect(objArr[0][0].x, objArr[0][0].y, objArr[0][0].w, objArr[0][0].h);
                if (typeof (func) == 'function') func();
                AnimationOn = false;
                return;
            }
            if (typeof (client) == 'object')
                $RepaintRect(client.x, client.y, client.w, client.h);
            else
                $RepaintRect(objArr[0][0].x, objArr[0][0].y, objArr[0][0].w, objArr[0][0].h);

        }, ANIMATION_INTERVAL);
    }

    this.SSA = function (obj, x, y, w, h, angle, alpha, client, iter, func) {
        AnimationOn = true;
        if (eval(name).timer) {
            window.ClearInterval(eval(name).timer);
        }
        eval(name).timer = window.SetInterval(function () {
            if (typeof (x) == 'number') obj.x += ((x - obj.x) / iter).One();
            if (typeof (y) == 'number') obj.y += ((y - obj.y) / iter).One();
            if (typeof (w) == 'number') obj.w += ((w - obj.w) / iter).One();
            if (typeof (h) == 'number') obj.h += ((h - obj.h) / iter).One();
            if (typeof (angle) == 'number') obj.angle += ((angle - obj.angle) / iter).One();
            if (typeof (alpha) == 'number') {
                obj.alpha += ((alpha - obj.alpha) / iter).One().Limit(0, 255);
            }
            if (typeof (obj.Size) == 'function') {
                obj.Size(obj.x, obj.y, obj.w, obj.h);
            }

            if ((typeof (x) != 'number' || Math.abs(x - obj.x) <= 1) &&
				 (typeof (y) != 'number' || Math.abs(y - obj.y) <= 1) &&
				 (typeof (w) != 'number' || Math.abs(w - obj.w) <= 1) &&
				 (typeof (h) != 'number' || Math.abs(h - obj.h) <= 1)) {
                if (typeof (x) == 'number') obj.x = x;
                if (typeof (y) == 'number') obj.y = y;
                if (typeof (w) == 'number') obj.w = w;
                if (typeof (h) == 'number') obj.h = h;
                if (typeof (angle) == 'number') obj.angle = angle;
                if (typeof (alpha) == 'number') obj.alpha = alpha;

                window.ClearInterval(eval(name).timer);
                eval(name).timer = null;
                
                if (typeof (obj.Size) == 'function') {
                    obj.Size(obj.x, obj.y, obj.w, obj.h);
                }
                if (typeof (client) == 'object')
                    $RepaintRect(client.x, client.y, client.w, client.h);
                else
                    window.Repaint();
                if (typeof (func) == 'function') func();
                AnimationOn = false;
                return;
            }

            if (typeof (client) == 'object')
                $RepaintRect(client.x, client.y, client.w, client.h);
            else
                window.Repaint();

        }, ANIMATION_INTERVAL);
    }

    this.SSAV2 = function (objArr, client, iter, func) {
        AnimationOn = true;
        if (eval(name).timer) {
            window.ClearInterval(eval(name).timer);
        }
        if (!$IsBinaryArray(objArr)) return;
        eval(name).timer = window.SetInterval(function () {
            for (var i = 0; i < objArr.length; i++) {
                if (typeof (objArr[i][1]) == 'number') objArr[i][0].x += ((objArr[i][1] - objArr[i][0].x) / iter).One();
                if (typeof (objArr[i][2]) == 'number') objArr[i][0].y += ((objArr[i][2] - objArr[i][0].y) / iter).One();
                if (typeof (objArr[i][3]) == 'number') objArr[i][0].w += ((objArr[i][3] - objArr[i][0].w) / iter).One();
                if (typeof (objArr[i][4]) == 'number') objArr[i][0].h += ((objArr[i][4] - objArr[i][0].h) / iter).One();
                if (typeof (objArr[i][5]) == 'number') objArr[i][0].angle += ((objArr[i][5] - objArr[i][0].angle) / iter).One();
                if (typeof (objArr[i][6]) == 'number') {
                    objArr[i][0].alpha += ((objArr[i][6] - objArr[i][0].alpha) / iter).One().Limit(0, 255);
                }
                if (typeof (objArr[i][0].Size) == 'function') {
                    objArr[i][0].Size(objArr[i][0].x, objArr[i][0].y, objArr[i][0].w, objArr[i][0].h);
                }
            }
            if ((typeof (objArr[0][1]) != 'number' || Math.abs(objArr[0][1] - objArr[0][0].x) <= 1) &&
				(typeof (objArr[0][2]) != 'number' || Math.abs(objArr[0][2] - objArr[0][0].y) <= 1)) {
                for (var i = 0; i < objArr.length; i++) {
                    if (typeof (objArr[i][1]) == 'number') objArr[i][0].x = objArr[i][1];
                    if (typeof (objArr[i][2]) == 'number') objArr[i][0].y = objArr[i][2];
                    if (typeof (objArr[i][3]) == 'number') objArr[i][0].w = objArr[i][3];
                    if (typeof (objArr[i][4]) == 'number') objArr[i][0].h = objArr[i][4];
                    if (typeof (objArr[i][5]) == 'number') objArr[i][0].angle = objArr[i][5];
                    if (typeof (objArr[i][6]) == 'number') objArr[i][0].alpha = objArr[i][6];
                    if (typeof (objArr[i][0].Size) == 'function') {
                        objArr[i][0].Size(objArr[i][0].x, objArr[i][0].y, objArr[i][0].w, objArr[i][0].h);
                    }
                }

                window.ClearInterval(eval(name).timer);
                eval(name).timer = null;

                if (typeof (client) == 'object')
                    $RepaintRect(client.x, client.y, client.w, client.h);
                else
                    window.Repaint();
                if (typeof (func) == 'function') func();
                AnimationOn = false;
                return;
            }
            if (typeof (client) == 'object')
                $RepaintRect(client.x, client.y, client.w, client.h);
            else
                window.Repaint();

        }, ANIMATION_INTERVAL);
    }
}