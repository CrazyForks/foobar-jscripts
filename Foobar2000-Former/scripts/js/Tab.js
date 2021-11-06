var Tab = new oTabView('Tab', false, true, true);
Tab.num = 4;

Tab.Paint = function (gr, x, y, w, h) {
    gr.GdiDrawText('Songs', ThemeStyle.font, ThemeStyle.fgColor, x, y, w, h, DT_CV);
    gr.GdiDrawText('Playlists', ThemeStyle.font, ThemeStyle.fgColor, x + w, y, w, h, DT_CV);
    gr.GdiDrawText('Explorer', ThemeStyle.font, ThemeStyle.fgColor, x + 2 * w, y, w, h, DT_CV);
    gr.GdiDrawText('Settings', ThemeStyle.font, ThemeStyle.fgColor, x + 3 * w, y, w, h, DT_CV);
}

Tab.OnChange = function () {
    g_tab = this.focus;
    window.SetProperty('标签', g_tab);
    TabShow(g_tab);
    window.Repaint();
}
/*
Tab.Change = function () {
	var dest;
	if (this.focus > g_tab) {
		g_tabs[this.focus].$.x = Main.$.x + Main.$.w;
		dest = Main.$.x - Main.$.w;
	} else {
		g_tabs[this.focus].$.x = Main.$.x - Main.$.w;
		dest = Main.$.x + Main.$.w;
	}
	g_tabs[this.focus].SetVisible(true);
	var objArr = [[g_tabs[this.focus].$, Main.$.x], [g_tabs[g_tab].$, dest], [this.Line, this.focus * this.Line.w]];

	var client = {x: Main.$.x, y: Main.$.y + Top.$.h, w: Main.$.w, h: Main.$.h - Top.$.h}
	this.Animation.SSAV2(objArr, client, 4, this.OnChange());
}
*/
