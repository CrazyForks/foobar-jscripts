window.GetProperty('计划时间', 20);

function ScheduleTime() {
    if (Schedule) {
        Schedule.Plan.time = window.GetProperty('计划时间', 20);
        if (Schedule.timer) {
            Console.Log('计划任务中止');
            Schedule.End();
        }
    }
}

oSchedule = function (name) {
    this.On = false;
    this.opera = 0;
    this.timer = null;
    this.Plan = {
        time: window.GetProperty('计划时间', 20),
        to: 0,
        clock: null,
        remain: 0
    };

    var items = ['停止', '退出', '关机'];

    this.Delay = function (delay) {
        var D = new Date();
        var milliseconds = D.getTime() + delay * 60000;
        return milliseconds;
    }

    this.TimeFormat = function (milliseconds) {
        var minutes = Math.floor(Schedule.Plan.remain / 60000);
        var seconds = Math.floor((Schedule.Plan.remain - minutes * 60000) / 1000);
        if (minutes < 10)
            minutes = '0' + minutes;
        if (seconds < 10)
            seconds = '0' + seconds;
        var ret = minutes + ' : ' + seconds;
        return ret;
    }

    this.Run = function (x, y) {
        if (this.timer) {
            Console.Log('计划任务中止');
            this.End();
        }
        else
            this.Menu(x, y);
    }

    this.Menu = function (x, y) {
        var m = window.CreatePopupMenu();
        for (var i = 1; i <= 3; i++)
            m.AppendMenuItem(0, i, items[i - 1]);

        this.opera = m.TrackPopupMenu(x, y);
        this.opera && Console.Log(this.Plan.time + '分钟后' + items[this.opera - 1]);
        this.Start();
        m.Dispose();
    }

    this.OnOpera = function () {
        fb.Stop();
        if (this.opera == 3) $Run('shutdown -s -t 10');
        if (this.opera > 1) fb.Exit();
    }

    this.End = function () {
        this.opera = 0;
        this.Plan.to = 0;
        this.Plan.clock = null;
        this.Plan.remain = 0;

        Image.Clear(g_clock_icon);
        g_clock_icon = null;
        window.ClearInterval(this.timer);
        this.timer = null;

        Home.items[1].text = $Font2Icon('61602');
        Home.$.Repaint();
    }

    this.Start = function () {
        if (this.opera <= 0 || this.Plan.time < 0 || this.timer) return;
        this.Plan.to = this.Delay(this.Plan.time);

        this.timer = window.SetInterval(function () {
            eval(name).Plan.remain = eval(name).Plan.to - eval(name).Delay(0);
            eval(name).Plan.clock = eval(name).TimeFormat(eval(name).Plan.remain);

            if (eval(name).Plan.remain <= 0) {
                eval(name).OnOpera();
                eval(name).End();
            }
            var remain = eval(name).Plan.remain / (eval(name).Plan.time * 60000);
            GetClock(remain);
            if (!AnimationOn)
                Home.$.Repaint();
        }, 1000);
    }
}

var Schedule = null;