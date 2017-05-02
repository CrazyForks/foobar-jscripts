// ======================================================
// Created by Jeannela <jeannela@foxmail.com>
// Updated: 2016-07-24 10:15
// Refer: www.bkjia.com/jQuery/1017034.html
// ======================================================

/** 说明：
 * - ESLyric 的天天动听歌词搜索脚本，仅适用于 ESLyric！
 * - 只适用于 ESLyric version 0.3.5+, 老版本的 ESLyric 还请用老脚本
 *   (当然还是推荐升级 ESLyric 到最新版) */

var dbg = false; // 如果要调试的话，改为 true.

function get_my_name () {
  return 'TTPod|天天动听';
}

function get_version () {
  return '0.2.0';
}

function get_author () {
  return 'Jeannela';
}

function start_search (info, callback) {
  var url;
  var jsonText;
  var title = info.Title;
  var artist = info.Artist;

  // New method instead of xmlhttp...
  var httpClient = utils.CreateHttpClient();

  url = generateURL(title, artist, true, -1);
  // dbg && console(url)
  jsonText = httpClient.Request(url);
  if (httpClient.StatusCode !== 200) {
    console('Request url[' + url + '] error : ' + httpClient.StatusCode);
    return;
  }

  var _newLyric = callback.CreateLyric();

  // parse json_txt
  // dbg && console(json_txt)
  var data = json(jsonText)['data'];
  dbg && console('data.length == ' + data.length);
  // download lyric
  for (var j = 0; j < data.length; j++) {
    if (callback.IsAborting()) {
      console('user aborted');
      break;
    }
    url = generateURL(data[j].singer_name, data[j].song_name, false, data[j].song_id);
    jsonText = httpClient.Request(url);
    if (httpClient.StatusCode !== 200) {
      console('Request url[' + url + '] error : ' + httpClient.StatusCode);
      continue;
    }
    // add to eslyric
    try {
      var lrcText = json(jsonText).data.lrc;
      if (lrcText.indexOf('无歌词') > -1) {
        continue;
      }
      _newLyric.LyricText = lrcText;
      _newLyric.Title = data[j].song_name;
      _newLyric.Artist = data[j].singer_name;
      _newLyric.Album = data[j].album_name;
      _newLyric.Source = get_my_name();
      _newLyric.Location = url;
      callback.AddLyric(_newLyric);
      (j % 2 === 0) && callback.Refresh();
    } catch (e) {
      continue;
    }
  }
  _newLyric.Dispose();
}

function generateURL (artist, title, query, songId) {
  var url = '';
  if (query) {
    title = processKeywords(title);
    artist = processKeywords(artist);
    url = 'http://so.ard.iyyin.com/s/song_with_out?q=' +
    encodeURIComponent(title) + '+' +
    encodeURIComponent(artist);
  } else {
    url = 'http://lp.music.ttpod.com/lrc/down?lrcid=&artist=' + encodeURIComponent(artist) + '&title=' + encodeURIComponent(title) + '&song_id=' + songId;
  }
  return url;
}

function processKeywords (str) {
  var s = str;
  s = s.toLowerCase();
  s = s.replace(/'|·|\$|&|–/g, '');
  // truncate all symbols
  s = s.replace(/\(.*?\)|\[.*?]|{.*?}|（.*?/g, '');
  s = s.replace(/[-/:-@[-`{-~]+/g, '');
  s = s.replace(/[\u2014\u2018\u201c\u2026\u3001\u3002\u300a\u300b\u300e\u300f\u3010\u3011\u30fb\uff01\uff08\uff09\uff0c\uff1a\uff1b\uff1f\uff5e\uffe5]+/g, '');
  return s;
}

function json (text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    return false;
  }
}

function console (s) {
  dbg && fb.trace(get_my_name() + ' $>  ' + s);
}
