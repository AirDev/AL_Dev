var sound;

/**
 * コンストラクタ 
 */
function sound_remote()
{
	sound = null;
}

/**
 * サウンド読み込み
 * @param {Object} url サウンド読み込み先 
 */
sound_remote.prototype.setSound = function (url) {
	sound = Titanium.Media.createSound({url:url});
	
	Ti.API.info("setSound:url = " + url); 
}

/**
 * サウンド再生
 */
sound_remote.prototype.play = function () {
	if(sound != null)
		sound.play();
}

/**
 * デバッグ用にGUIを画面に追加
 */
sound_remote.prototype.setGUI = function(win) {
	
	var b = Titanium.UI.createButton({
		title:'Play',
		height:60,
		width:145,
		left:10,
		top:84
	});
	b.addEventListener('click', function()
	{
		sound_remote.prototype.play();
	});

	win.add(b);
}

module.exports.sound_remote = sound_remote;
