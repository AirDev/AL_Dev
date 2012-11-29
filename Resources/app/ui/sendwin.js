/*
 * 添付ファイル送信確認ウィンドウ
 */

	var app;
	var scale;
/**
 * ウィンドウ生成
 * @param {Object} apps			requireされた色々
 * @param {Object} image		サムネイル画像
 * @param {Object} title		注意文
 * @param {Object} callback		終了時に呼ばれるコールバック{RESULT:'ok' / 'cancel'}
 */
exports.createWindow = function(apps, image, title, callback){
	
	app = apps;
	scale = app.wrk.GetScale();
	
	Ti.API.info("image " + JSON.stringify(image) );
	
	var win = Ti.UI.createWindow({
		borderRadius:		10,
		borderColor:		'#000000',
		borderWidth:		2,
 		backgroundColor: 	'#FAFAD2',
 		height:				400*scale		
	});
	
	var text = Ti.UI.createLabel({
		color:		'#000000',
		top:		2*scale,
		text:		title
	});
	var thumb = Ti.UI.createImageView({
		top:		(2+80)*scale,
		width:		200*scale,
		height:		"fill",
		image:		image
	});
	var btnOK = Ti.UI.createButton({
		bottom:		5*scale,
		left:		5*scale,
		title:		"送信"
	});
	var btnNG = Ti.UI.createButton({
		bottom:		5*scale,
		right:		5*scale,
		title:		"キャンセル"
	});
	
	// 送信OKボタン
	btnOK.addEventListener('click', function(e){
		win.close();
		win = null;
		
		if (callback) callback({RESULT:'ok'});		
	});
	// キャンセルボタン
	btnNG.addEventListener('click', function(e){
		win.close();
		win = null;
		
		if (callback) callback({RESULT:'cancel'});
	});
	
	win.add(text);
	win.add(thumb);
	win.add(btnOK);
	win.add(btnNG);
	win.open();
}

