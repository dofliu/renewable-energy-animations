/* ================= i18n =================
   Every visible string is written in Traditional Chinese in the episode code and translated at draw time.
   DICT maps the Chinese string to [English, Japanese]; kits and episode files add entries with
   Object.assign(DICT,{...}). trf() handles strings with changing numbers: trf('第 {n} 天',{n:3}).
   UI holds interface strings as [zh, en, ja]. */
const LANGS=['zh','en','ja'];
let LANG='zh',LI=-1;
const DICT={};
const UI={"secAnim": ["動畫", "Animation", "アニメーション"], "scaleNote": ["示意圖：比例經過調整", "Schematic: not to scale", "模式図：縮尺は調整しています"], "credit": ["勤益科大 劉瑞弘老師研究室", "NCUT · Prof. Liu's Lab", "勤益科技大学 劉瑞弘研究室"], "creditFull": ["國立勤益科技大學 智慧自動化工程系 劉瑞弘老師研究室 製作", "Produced by Prof. Liu's Lab, Department of Intelligent Automation Engineering, National Chin-Yi University of Technology", "制作：国立勤益科技大学 スマートオートメーション工学科 劉瑞弘研究室"], "prev": ["上一個分鏡", "Previous shot", "前のシーン"], "next": ["下一個分鏡", "Next shot", "次のシーン"], "play": ["播放", "Play", "再生"], "pause": ["暫停", "Pause", "一時停止"], "replay": ["重新播放", "Replay", "もう一度再生"], "progress": ["播放進度", "Playback position", "再生位置"], "speed": ["播放速度", "Playback speed", "再生速度"], "labels": ["標註", "Labels", "ラベル"], "labelsTip": ["顯示／隱藏標註", "Show or hide labels", "ラベルの表示／非表示"], "full": ["全螢幕", "Full screen", "全画面"], "chapNav": ["分鏡", "Shots", "シーン"], "chapHead": ["本集分鏡", "Shots in this episode", "このエピソードのシーン"], "langGroup": ["介面語言", "Interface language", "表示言語"], "sep": ["，", ", ", "、"], "rec": ["匯出影片", "Export video", "動画を書き出す"], "recTitle": ["錄製 MP4 影片", "Record an MP4 video", "MP4 動画を書き出す"], "recIntro": ["逐格離線算繪，不會掉格，也不必等動畫即時播完。語言與標註設定沿用目前畫面。", "Frames are rendered offline one at a time, so nothing drops and you don't wait for real-time playback. Language and label settings follow the current view.", "フレームを1枚ずつオフラインで描画するため、コマ落ちがなく、リアルタイム再生を待つ必要もありません。言語とラベルの設定は現在の表示に従います。"], "optSpeed": ["影片速度", "Video speed", "再生速度"], "optRange": ["範圍", "Range", "範囲"], "rangeAll": ["全片", "Whole animation", "全編"], "rangeChap": ["目前分鏡", "Current shot", "現在のシーン"], "optRes": ["解析度", "Resolution", "解像度"], "optFps": ["影格率", "Frame rate", "フレームレート"], "sum": ["影片長度 {d}，共 {f} 格，檔案最多約 {m} MB", "Length {d}, {f} frames, up to about {m} MB", "長さ {d}、{f} フレーム、最大約 {m} MB"], "sumChap": ["（{c}）", " ({c})", "（{c}）"], "start": ["開始錄製", "Start recording", "書き出し開始"], "again": ["再錄一次", "Record again", "もう一度書き出す"], "cancel": ["取消", "Cancel", "キャンセル"], "close": ["關閉", "Close", "閉じる"], "download": ["下載 MP4", "Download MP4", "MP4 をダウンロード"], "stPrep": ["準備編碼器…", "Preparing the encoder…", "エンコーダーを準備中…"], "stRun": ["算繪中 {p}%，剩餘約 {e}", "Rendering {p}%, about {e} left", "描画中 {p}%、残り約 {e}"], "stFin": ["封裝 MP4…", "Writing the MP4…", "MP4 を生成中…"], "stDone": ["完成：{s} MB，已開始下載。", "Done: {s} MB. The download has started.", "完了：{s} MB。ダウンロードを開始しました。"], "stCancel": ["已取消錄製。", "Recording cancelled.", "書き出しをキャンセルしました。"], "stNoSup": ["這個瀏覽器不支援 WebCodecs 影片編碼，請改用最新版的 Chrome、Edge 或 Safari。", "This browser does not support WebCodecs video encoding. Please use a recent Chrome, Edge or Safari.", "このブラウザーは WebCodecs による動画エンコードに対応していません。最新版の Chrome、Edge、Safari をご利用ください。"], "stNoCodec": ["找不到可用的影片編碼設定，請試試較低的解析度或影格率，或改用最新版 Chrome、Edge、Safari。", "No usable video encoder setting was found. Try a lower resolution or frame rate, or a recent Chrome, Edge or Safari.", "使用できる動画エンコード設定が見つかりません。解像度やフレームレートを下げるか、最新版の Chrome、Edge、Safari をお試しください。"], "stAlt": ["（此瀏覽器沒有 H.264 編碼器，改以 {c} 編碼；Chrome、Firefox、VLC 可播放，QuickTime 可能無法播放。）", "(This browser has no H.264 encoder, so the video uses {c}. It plays in Chrome, Firefox and VLC, but possibly not in QuickTime.)", "（このブラウザーには H.264 エンコーダーがないため {c} で書き出しました。Chrome、Firefox、VLC では再生できますが、QuickTime では再生できない場合があります。）"], "stErr": ["錄製失敗：", "Recording failed: ", "書き出しに失敗しました："], "keepTab": ["錄製期間請保持此分頁開啟。", "Keep this tab open while recording.", "書き出し中はこのタブを開いたままにしてください。"], "factsAria": ["重點數字", "Key figures", "主な数字"], "factsHead": ["本集重點數字", "Key figures", "このエピソードの主な数字"], "series": ["{s} 第 {n} 集（共 {t} 集）", "{s}, episode {n} of {t}", "{s} 第 {n} 話（全 {t} 話）"], "seriesOne": ["{s} 第 {n} 集", "{s}, episode {n}", "{s} 第 {n} 話"], "shotOf": ["{i}／{n}", "{i}/{n}", "{i}／{n}"]};
const CJK_RE=/[\u3000-\u9fff\uff00-\uffef]/;
const TPAT=[
  [/^量測第 (\d+) 天$/,m=>[`Day ${m[1]}`,`計測 ${m[1]} 日目`]],
  [/^第 (\d+) 段塔架$/,m=>[`Tower section ${m[1]}`,`タワー第 ${m[1]} 段`]],
  [/^第 (\d+) 支葉片$/,m=>[`Blade ${m[1]}`,`ブレード ${m[1]} 枚目`]]
];
function tr(s){
  if(LI<0||typeof s!=='string'||!CJK_RE.test(s))return s;
  const d=DICT[s];if(d)return d[LI];
  for(const [re,f] of TPAT){const m=s.match(re);if(m)return f(m)[LI];}
  if(s.indexOf('\u3000')>=0)return s.split('\u3000').map(tr).join('   ');
  return s;
}
function trf(k,v){let s=tr(k);for(const x in v)s=s.split('{'+x+'}').join(v[x]);return s;}
function ui(k,vars){const a=UI[k];let s=a?a[LI+1]:k;if(vars)for(const v in vars)s=s.split('{'+v+'}').join(vars[v]);return s;}
const FONT_TC='"Noto Sans TC","Noto Sans CJK TC","PingFang TC","Microsoft JhengHei",system-ui,sans-serif';
const FONT_JP='"Noto Sans JP","Noto Sans CJK JP","Hiragino Sans","Yu Gothic","Meiryo","Noto Sans TC",system-ui,sans-serif';
const LANG_KEY='rea-lang';
/* strings intentionally shown in Chinese in other languages (e.g. bilingual subtitles); qa.py ignores them */
const QA_KEEP=[];
