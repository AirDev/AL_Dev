/*
 * 設定画面
 */
var mainWin = Ti.UI.currentWindow;
var app = mainWin.app;

var file	= require('app/main/file');
//var resv	= require('app/talk/resvmsg');

var scale = app.wrk.GetScale();
var myData = app.wrk.GetMyData();

// var mainWin = Ti.UI.createWindow({
	// backgroundImage:	'/images/tableview/brown_bg_482.png',
// //    backgroundColor: '#333333'
// });

	mainWin.setBackgroundImage('/images/tableview/brown_bg_482.png');

var profButton = Ti.UI.createButton({
	font:{fontSize:24*scale, fontWeight:'bold'},
	top:	1*80*scale,
	left:	0,
	width:  '50%',
	title:	"プロフィール編集"		
});
profButton.addEventListener('click', function(e){
//	var prof = require('app/main/prof');
	app.prof.createWindow(app);
});

var testVoteBtn = Ti.UI.createButton({
	top:	80*3*scale,
	right:	0,
	title:	"投票テスト"	
});

var exitButton = Ti.UI.createButton({
	bottom:     0,
	right:   2+120,
//	width:  100,
	height: 80*scale,
	title: 'アプリ終了'
} );
var testbutton00 = Ti.UI.createButton({
	top:     80*3*scale,
	right:   2,
//	width:  100,
	height: 80*scale,
	title: '電話帳送信'
} );

//ike
var mic_vol = Ti.UI.createSlider({
	top:     80*5*scale,
	min:1,
	max:1024,
	value:16,
	title:	"マイク音量"
});

mic_vol.addEventListener('change', function(e){
	if(Ti.Platform.osname == 'android'){
		Titanium.API.info("マイク音量スライダ");
		app.wrk.sipclient.set_mic_vol(e.value);
	}else{
		alert('iOS 音声通話修正作業中');
	}
});

var mic_lim = Ti.UI.createSlider({
	top:     80*6*scale,
	min:1,
	max:1024,
	value:128,
	title:	"マイクリミット"
});

mic_lim.addEventListener('change', function(e){
	if(Ti.Platform.osname == 'android'){
		Titanium.API.info("マイクリミットスライダ");
		app.wrk.sipclient.set_mic_lim(e.value);
	}else{
		alert('iOS 音声通話修正作業中');
	}
});


var speaker_vol = Ti.UI.createSlider({
	top:     80*7*scale,
	min:1,
	max:1024,
	value:256,
	title:	"スピーカー音量"
});

speaker_vol.addEventListener('change', function(e){
	if(Ti.Platform.osname == 'android'){
		Titanium.API.info("スピーカー音量スライダ");
		app.wrk.sipclient.set_speaker_vol(e.value);
	}else{
		alert('iOS 音声通話修正作業中');
	}
});


var speaker_lim = Ti.UI.createSlider({
	top:     80*8*scale,
	min:1,
	max:1024,
	value:16,
	title:	"スピーカーリミット"
});

speaker_lim.addEventListener('change', function(e){
	if(Ti.Platform.osname == 'android'){
		Titanium.API.info("スピーカーリミットスライダ");
		app.wrk.sipclient.set_speaker_lim(e.value);
	}else{
		alert('iOS 音声通話修正作業中');
	}
});


var btn_ver = Ti.UI.createButton({
	top:		2*80*scale,
	right:   	2,
//	width:  	100,
	height: 	1*80*scale,
	title: 'バージョン情報'
} );
var testbutton01 = Ti.UI.createButton({
	top:     80*3*scale,
	right:   2,
//	width:  100,
	height: 80*scale,
	title: 'ユーザ情報更新'
} );
var testbutton02 = Ti.UI.createButton({
	top:	1*80*scale,
	right:   2,
//	width:  100,
	height: 80*scale,
	title: 'ローカルファイル削除'
} );
var servSwitch = Ti.UI.createSwitch({
	top:		0*80*scale,
	right: 	 	2,
	titleOn:	'サーバー；開発用',
	titleOff:	'サーバー：デモ用',	
});

var ss = Ti.App.Properties.getString('serverSwitch');
servSwitch.value = ( ss && ss == 'dev')? true:false;

servSwitch.addEventListener('click', function(e){
	var val = (servSwitch.value)? 'dev':'demo';
	
	Ti.App.Properties.setString('serverSwitch', val);
});

var iconButton = Ti.UI.createButton({
	font:{fontSize:24*scale, fontWeight:'bold'},
	top:     80*2*scale,
	left:   2,
	width:  '50%',
//	height: 80*scale,
	title: 'アイコン変更'
} );
var mapSwitch = Ti.UI.createSwitch({
	
	top:		80*3*scale,
	left:		2,
	titleOn:		'マップ表示 ON',	
	titleOff:		'マップ表示 OFF'	
});
mapSwitch.value = (myData.GPS==0)? false:true;
mapSwitch.addEventListener('click', function(e){
	myData.GPS = (mapSwitch.value)? 1:0;
	app.connect.UpdateProf(myData);	
});
var deaiSwitch = Ti.UI.createSwitch({
	
	top:		80*4*scale,
	left:		2,
	titleOn:		'検索対象 ON',	
	titleOff:		'検索対象 OFF'	
});
deaiSwitch.value = (myData.RAND==0)? false:true;
deaiSwitch.addEventListener('click', function(e){
	myData.RAND = (deaiSwitch.value)? 1:0;
	app.connect.UpdateProf(myData);
});

var iconButton2 = Ti.UI.createButton({
	top:     80*4*scale,
	right:   2,
//	width:  100,
	height: 80*scale,
	title: 'アイコン読み込み'
} );
var imageView = Titanium.UI.createImageView({
	height:200*scale,
	width:200*scale,
	bottom:2,
	left:10,
	backgroundColor:'#999'
});

//win.add(imageView);

//var popoverView;
//var arrowDirection;
/*
 * SIP設定画面起動
 */
var sipSettingButton = Ti.UI.createButton({
	font:{fontSize:24*scale, fontWeight:'bold'},
	top:     0,
	left:   2,
//	width:  100,
	width:  '50%',
//	height: 80*scale,
	title: '通話設定'
} );
sipSettingButton.addEventListener('click', function(e){

	if(Ti.Platform.osname == 'android'){
		app.wrk.sipclient.setting();
	}else{
		alert('iOS 音声通話修正作業中');											
	}

//	if(wrk.sipclient){
//		wrk.sipclient.setting();
//	}	

});
/*
 * アイコン読み込みテスト
 */
iconButton2.addEventListener('click', function(e){
	
	var img = file.readIcon( app.wrk.GetUID() );

	if ( img ){
		Ti.API.info(JSON.stringify(img));
		
		imageView.image = img;
		mainWin.add(imageView);
	}

});

/**
 * アイコンの変更
 */
iconButton.addEventListener('click', function(e){
		
	Titanium.Media.openPhotoGallery({

	success:function(event){
		
		// set image view
//		Ti.API.debug('Our type was: '+event.mediaType);
		if( event.media.mimeType == 'image/jpeg' )
		{			
			Ti.API.info("event:"+JSON.stringify(event));
			
			var baseImage = Titanium.UI.createImageView({
//    			width:	event.cropRect.width,
//   			height:	event.cropRect.height,
			    image:	event.media
			});
 
// 			Ti.API.info("baseImage "+baseImage.media.)
			var cropView = Titanium.UI.createView({
			    width:100,
			    height:100
			});
 
			cropView.add(baseImage);
//			baseImage.left	=-baseImage.width/2;
//			baseImage.top	=-baseImage.height/2;
 
			var croppedImage = cropView.toImage();

			file.saveIcon(app.wrk.GetUID(), croppedImage.media );
			
			mainWin.add(cropView);
			
//			Ti.API.info("icon image:"+JSON.stringify(croppedImage));
					
			app.connect.UploadIcon(
				(Ti.Platform.osname == 'android')? croppedImage.media:croppedImage,	// iOSとAndroidはなんか違うので分岐
				function(status, data){
				},
				function(error){
				}
			);
		}
		else
		{
			Ti.API.info("no image");
			// is this necessary?
			imageView.image = file.getDefaultIcon();
			mainWin.add(imageView);
		}

//		Titanium.API.info('PHOTO GALLERY SUCCESS cropRect.x ' + cropRect.x + ' cropRect.y ' + cropRect.y  + ' cropRect.height ' + cropRect.height + ' cropRect.width ' + cropRect.width);

	},
	cancel:function(){
	},
	error:function(error){
	},
	allowEditing:	true,
//	popoverView:	popoverView,
//	arrowDirection:	arrowDirection,
	mediaTypes:		[Ti.Media.MEDIA_TYPE_PHOTO]
});

});
btn_ver.addEventListener('click', function(e){
	alert("Ver "+Ti.App.getVersion() );
});
testbutton00.addEventListener( 'click', function( e ) {
	
	var contacts = require('app/main/getContacts');
	
	contacts.getAllPeople();
	contacts.sendAddress(
		function(){
				
		},
		function(){
			
		});

} );
exitButton.addEventListener( 'click', function(e){
	// デバッグ用アプリ終了機能
});
testbutton01.addEventListener( 'click', function( e ) {
		
	Ti.API.info('Users Update');
	
	app.geo.GetCurrentPosition(
	function(data){
		app.connect.updateUsers(
			{ LALTITUDE:data.latitude, LONGITUDE:data.longitude },
			function(status, data){
					
			},function(error){
					
			});
		
	},function(error){
		Ti.API.info('Users GPS Error '+error);
	});
} );
/*
 * デバッグ用：ローカルファイルの削除
 */
testbutton02.addEventListener( 'click', function( e ) {

	Ti.App.Properties.removeProperty('myprof.txt');

	alert('ローカルファイル削除完了');
} );
// exports.createWindow = function(){
// 	
// }

/*
 * 投票テストボタン
 */
testVoteBtn.addEventListener('click', function(e){
	
	var eventId;
	
	var GetRanking = function(eId){
		app.connect.GetVoteRanking(eId,
			function(status, data){
			},function(error){
			}
		);
	}
	var Vote = function(eId, id){
		app.connect.Vote(eId, id,
			function(status, data){
				GetRanking(eId);
			},function(error){
			}
		);
	}	
	var GetVoteList = function(){
		app.connect.GetVoteList(
			function(status, data){
				if ( data.RESULT == 'OK' && data.RESPONSE.length > 0){
					eventId = data.RESPONSE[0].ID;
					
					Vote(eventId, 2);
				}
			},function(error){
			}
		);
	}	
	
	GetVoteList();	
});

//mainWin.add(testVoteBtn);
mainWin.add(mic_vol);
mainWin.add(mic_lim);
mainWin.add(speaker_vol);
mainWin.add(speaker_lim);
mainWin.add(profButton);
mainWin.add(testbutton00);
//mainWin.add(testbutton01);
mainWin.add(testbutton02);
mainWin.add(iconButton);
//mainWin.add(iconButtonTest);
//mainWin.add(iconButton2);
mainWin.add(sipSettingButton);
mainWin.add(mapSwitch);
mainWin.add(deaiSwitch);
mainWin.add(servSwitch);
mainWin.add(btn_ver);

//mainWin.add(testbutton03);
//mainWin.add(testbutton04);
//mainWin.add(testbutton05);
//mainWin.add(testbutton06);
//mainWin.add(testbutton07);

mainWin.open();
