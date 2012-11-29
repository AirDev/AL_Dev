
//var wrk 	= require('app/main/work');
//var connect = require('app/comm/connect');
var subWin 	= require('app/ui/contact');
//var resv	= require('app/talk/resvmsg');
//var geo		= require('app/main/gps');

	// カテゴリ１０種類分（実際はImageで）
	var anoColor = [
				Ti.Map.ANNOTATION_PURPLE,
				Ti.Map.ANNOTATION_PURPLE,
				Ti.Map.ANNOTATION_PURPLE,
				Ti.Map.ANNOTATION_GREEN,
				Ti.Map.ANNOTATION_RED,
				Ti.Map.ANNOTATION_PURPLE,
				Ti.Map.ANNOTATION_PURPLE,
				Ti.Map.ANNOTATION_PURPLE,
				Ti.Map.ANNOTATION_PURPLE,
				Ti.Map.ANNOTATION_PURPLE
				];
	
	var anoImageMaleUrl 	= '/images/mapIconMale';
	var anoImageFemaleUrl 	= '/images/mapIconFemale';
	var anoImageFreeUrl 	= '/images/mapIconFree';
	
	var anoImageNames = [
		'help.png',
		'comments.png',
		'home.png',
		'user.png',
		'user.png',
		'heart.png',
		'star.png',
		'music.png',
		'phone.png',
		'shopping_cart.png',
		'warning.png',
		'remove.png',
		'map.png',
		'search.png',
		'lock.png'
	];
	
	var anoImage = [
				'/images/pin/c19.png',				// 灰色
				'/images/pin/c10.png',				// 水色
				'/images/pin/c16.png',				// 紫
				'/images/pin/c12.png',				// 青
				'/images/pin/c18.png',				// ピング
				'/images/pin/c20.png',				// 黒
				'/images/pin/c21.png',				// 白
				'/images/pin/c1.png',				// 朱色
				'/images/pin/f1.png',				// 肌色
				'/images/pin/c7.png',				// 緑（エメラルドグリーン）
				'/images/pin/c5.png',				// 黄緑
				'/images/pin/f12.png',				// すみれ色
				'/images/pin/c4.png',				// レモン色
				'/images/pin/c2.png'				// 橙
				];

// アプリケーション情報
var appInfo = {
	// 最後に示していたマップの中央位置
	lastLocation : {
		latitude:  0, // 緯度
		longitude: 0  // 経度
	},

	currentAddressTaskId : 0, // 現在の住所取得タスクの ID
};

// 背景色を変更
Titanium.UI.setBackgroundColor( '#000000' );

////////////////////////////////////////////////////////////////////////////////
//								コントロールの生成
////////////////////////////////////////////////////////////////////////////////
	
/** メイン ウィンドウ。 */
	var mainWindow = Ti.UI.currentWindow;
	var app = mainWindow.app;
// var mainWindow = Titanium.UI.createWindow({  
    // backgroundColor: '#666666'
// });
	mainWindow.orientationModes = [Titanium.UI.PORTRAIT];

	var scale = app.wrk.GetScale();

	/** マップを操作するためのビューです。 */
	var mapView = Titanium.Map.createView( {
		top:          0,
		bottom:       0,
		left:         0,
		right:        0,
		mapType:      Titanium.Map.STANDARD_TYPE,
		region :      { latitude:35.6, longitude: 139.77, latitudeDelta:0.05, longitudeDelta:0.05},
   		animate:      true,
		regionFit:    true,
		userLocation: true
	} );

	// Create a Button.
	var Button_reload = Ti.UI.createButton({
		title : '更新',
		height : 80*scale,
		width : 100*scale,
		bottom:	0,
		right : 0
	});
	
	// Listen for click events.
	Button_reload.addEventListener('click', function() {
		updateLocate();
	});
	
// シェイクのイベント設定
Ti.Gesture.addEventListener('shake',function(e)
{
	updateLocate();
});

	var updateLocate = function(){
		
		app.geo.GetCurrentPosition(
			function(coords){
//			Ti.API.info("locate to "+coords.latitude+" "+coords.longitude);
			
				mapView.setLocation({latitude:coords.latitude, longitude:coords.longitude});
			
//			Ti.API.info("shake after annota." );
				app.connect.updateUsersMap(
					{LALTITUDE:coords.latitude, LONGITUDE:coords.longitude},
					function(status, data){
							
						app.wrk.SetRobbyUsers(data.RESPONSE.USERS);
						setRobbyUsersAnnotation();
					},
					null,
					app.wrk.GetRobbyMatchData()
				);
			},
			function (){
				Ti.API.info("get pos error." );
			}
		);		
	};

////////////////////////////////////////////////////////////////////////////////
//									イベント
////////////////////////////////////////////////////////////////////////////////

// /**
 // * マップを指定された住所の位置へ移動します。
 // * 
 // * @param {Object} address 住所。
 // */
// function moveToAddress( address ) {
	// var url = 'http://maps.google.com/maps/api/geocode/json?address=' + address + '&sensor=true';
	// var xhr = Titanium.Network.createHTTPClient();
// 	
	// xhr.open( 'POST', url );
	// Ti.API.info( '>>> Geocoder URL: ' + url );
// 	
	// // Geocoder API から返された位置情報を設定
	// xhr.onload = function() {
		// var json = eval( '(' + xhr.responseText + ')' );
		// if( json.results[ 0 ] ) {
			// var location = json.results[ 0 ].geometry.location;
			// Ti.API.info( '>>> Geocoder results : Latitude = ' + location.lat + ', Longitude = ' + location.lng );
// 
			// mapView.setLocation({latitude:location.lat, longitude:location.lng});
		// }
	// };
// 	
	// xhr.send();
// }

/**
 * 領域変更がおこなわれたときに呼び出されます。
 * 
 * @param {Object} latitude  緯度。
 * @param {Object} longitude 経度。
 */
function onRegionChanged( latitude, longitude ) {

	// このイベントはマップの拡縮でも発生するので、必ず移動を判定する	
	if( appInfo.lastLocation.latitude == latitude && appInfo.lastLocation.longitude == longitude ) { return; }

	appInfo.lastLocation.latitude  = latitude;
	appInfo.lastLocation.longitude = longitude;

	// 領域変更はマップの移動中、大量に呼び出される。また、住所取得のコストが大きいので、
	// 住所更新の処理は識別子を割り当てたうえで遅延実行し、最後におこなわれたものだけ確定させる。
	//
	var id = ++appInfo.currentAddressTaskId;
	setTimeout( function() {
		if( appInfo.currentAddressTaskId != id ) { return; }
	
		var url = 'http://maps.google.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&language=ja&sensor=true';
		var xhr = Titanium.Network.createHTTPClient();
		
		xhr.open( 'GET', url );
		Ti.API.info( '>>> Geocoder URL: ' + url );
		
		// 現在位置を更新
		app.connect.updateUsersMap(
			{LALTITUDE:latitude,LONGITUDE:longitude},
			function(status, data){
				var users;
						
				users = data.RESPONSE.USERS;
						
				app.wrk.SetRobbyUsers(users);
			},
			null
		);
		
		// // Geocoder API から返された住所を設定
		// xhr.onload = function() {
			// var json = eval( '(' + xhr.responseText + ')' );
			// var address = ( json.results[ 0 ] ? json.results[ 0 ].formatted_address : undefined );
			// if( address ) {
				// Ti.API.info( '>>> Geocoder results : ' + address );
				// labelAddress.text = address;
			// }	
		// };
		
		xhr.send();	
	},
	200 );
}

// マップの表示領域が更新されたときのイベント
mapView.addEventListener( 'regionChanged', function( e ) {
//	Ti.API.info( '>>> on region chnaged. ' );
	onRegionChanged( e.latitude, e.longitude );
} );

function setAnnotation(id, lat, lng, title, isAnimate, color, gender) {
		
	var anno = Ti.Map.createAnnotation({
	    latitude: 	lat,
	    longitude: 	lng,
	    title: 		title,
//	    subtitle: 	subtitle,
//	    pinColor: Ti.Map.ANNOTATION_RED,
//		image:'/images/map-pin.png',
	    animate: 	isAnimate,
	    titleid:	id
	});
	
	var url;
	
	if (gender==1) 		url = anoImageMaleUrl;
	else if (gender==2) url = anoImageFemaleUrl;
	else 				url = anoImageFreeUrl;
		
	url = url+'/'+anoImageNames[color];
	
	Ti.API.info("image url "+url);
		
	anno.setImage(url);
	// if(Ti.Platform.osname == 'android'){
// //		anno.setPincolor(anoColor[color]);
		// anno.setImage(url);
	// }else{
		// anno.setPincolor(anoColor[color]);
// //		anno.setPinImage('/images/map-pin.png');		
	// }
	mapView.addAnnotation(anno);
	
	return anno;
}

/**
 *ピンをクリックしたらサブウィンドウ開く 
 */
mapView.addEventListener('click',function(evt)
{
    // map event properties 
    var annotation = evt.annotation;
    var title = evt.title;
    var clickSource = evt.clicksource;
 	
// 	Ti.API.info("evt "+JSON.stringify(evt));
 	
	if ( !subWin.isActive() ){
						
		var users = app.wrk.GetRobbyUsers();
							
		users.forEach(function(user){
			
			Ti.API.info("照合 "+annotation.titleid+" "+user.ID );
			
			if ( annotation.titleid == user.ID	){
				subWin.setActive(true);
				subWin.createWindow( user, app );
				subWin.addEvent('close', function(){
					subWin.setActive(false);
				});
			}			
		});						
	}else{
		Ti.API.info("ウィンドウアクティブ状態なのでひらけません");
	}
 
//    Titanium.API.info('MAPVIEW EVENT - you clicked on '+title+' with click source = '+clickSource);
 
if (clickSource == 'rightButton'){
 
// get custom annotation attribute
    var url = evt.annotation.url;
// code to open your url
}
 
});
/*
 * 検索結果のアノテーション登録
 */
var setRobbyUsersAnnotation = function(){
	
//	Ti.API.info("アノテーション再登録");
//	return;
	
	var mode;
	
	var robbyUsers = app.wrk.GetRobbyUsers();
	
//	Ti.API.info("表示ユーザー数 "+robbyUsers.length + JSON.stringify(robbyUsers));
	
	// 一旦アノテーション全削除
	mapView.removeAllAnnotations();
	
	var m = app.wrk.GetRobbyMatchData();

	// ピン色指定モード(0:男女 1:カテゴリ)
	if 	( ( m[0] == '1') ||
		( m[1] == '1') ||
	 	( m[2] == '1') ||
	 	( m[5] == '1') ||
	 	( m[6] == '1') ||
	 	( m[7] == '1') ||
	 	( m[8] == '1') ||
	 	( m[9] == '1') ){
		mode = 1;				 		
//		Ti.API.info("表示モード "+mode);
	 }else{
	 	// 男女しか指定が無ければこちら
	 	mode = 0;
//		Ti.API.info("表示モード "+mode);
	 }

	if ( robbyUsers && robbyUsers.length > 0){
		
		robbyUsers.forEach(function(user){
			
			Ti.API.info("設定対象 "+JSON.stringify(user));
			
			// 緯度と経度のどちらかが０なら正しい値じゃ無いので表示しない
			// if ( user.LALTITUDE != null && user.LONGIUDE != null){
				// Ti.API.info("座標有り "+user.NAME+' '+user.LALTITUDE+" "+user.LONGITUDE );
// 				
				// setAnnotation(user.LALTITUDE, user.LONGITUDE, user.NAME, user.ID, true, user.ID%3);				
			// }else{
				// Ti.API.info('座標不正 '+user.NAME+' '+user.LALTITUDE+" "+user.LONGITUDE );
			// }			
			if ( user.LALTITUDE === undefined || !user.LONGIUDE === undefined){
				Ti.API.info('座標 NG '+user.NAME+' '+user.LALTITUDE+" "+user.LONGITUDE );
			}else{
				Ti.API.info('座標 OK '+user.NAME+' '+user.LALTITUDE+" "+user.LONGITUDE );
				
				var color = 0;
				
				if ( user.FLAGS !== undefined ){
					// カテゴリ指定？
					if (mode == 0 ){
						if 		( user.GENDER == '1') 	color = 3;
						else if ( user.GENDER == '2') 	color = 4;
						else							color = 0;
//						Ti.API.info("性別表示 "+color );
					}else{
//						Ti.API.info("カテゴリ表示 ");
						for(var i=0;i<user.FLAGS.length; i++ ){
							
							// 男女はスキップ（フラグはあとで男女を省く）
							if ( i==3 || i==4 ) continue;
							
							if ( user.FLAGS[i] == '1'){
								color = i;
	//							Ti.API.info("カテゴリ決定 "+color );
								
								// BREAKdではforeach自身を抜けてしまうのでこれでループを抜ける
								i=user.FLAGS.length;
							}
						}						
					}										
				}else{
					Ti.API.info("FLAGSがありません");
				}
//				Ti.API.info("ピンカラー "+color );
								
				setAnnotation(user.ID, user.LALTITUDE, user.LONGITUDE, user.NAME, true, color, user.GENDER );				
			}

		});
	}		
};

/**
 *マップにフォーカスがうつったら現在地、ピンを更新 
 * 
 * 
 * NAME	文字列	ユーザ名
ID	整数	ユーザID
AID	整数	アバターID
LALTITUDE	文字列	緯度
LONGITUDE	文字列	経度
 */
//mainWindow.addEventListener('focus', function(e){
	Ti.App.addEventListener('tabmap', function(){
	
//		Ti.API.info("マップにフォーカス");
	
//		setRobbyUsersAnnotation();
		updateLocate();
	});
////////////////////////////////////////////////////////////////////////////////
//							ウィンドウの初期化
////////////////////////////////////////////////////////////////////////////////

//mainWindow.add( buttonGo     );
//mainWindow.add( editAddress  );
mainWindow.add( mapView );
mainWindow.add( Button_reload );

//mainWindow.add( labelAddress );

//Annotationセット
//setAnnotation(43.0, 141.3, "title1", "sub1", true);
//setAnnotation(42.0, 141.3, "title2", "sub2", true);
//setAnnotation(41.0, 141.3, "title3", "sub3", true);

//Ti.API.info("ウィンドウ初期化");
//setRobbyUsersAnnotation();

// //サウンドテスト
// var sound_remote = require("sound_remote").sound_remote;
// var _sr = new sound_remote();
// _sr.setSound("http://www.archive.org/download/CelebrationWav/1.wav");
// //テスト用にボタン表示
// _sr.setGUI(mainWindow);
// 
// //ボイスレコーダー起動(Androidのみ)
// var b = Titanium.UI.createButton({
	// title:'VoiceRecoder',
	// height:60,
	// width:145,
	// left:10,
	// top:86+60
// });
// b.addEventListener('click', function()
// {
	// var vr = require("VoiceRecoder").VoiceRecoder;
	// var _vr = new vr();
// });
// mainWindow.add(b);

	mainWindow.open();

	app.geo.GetCurrentPosition(
		function(coords){
//			Ti.API.info("locate to "+coords.latitude+" "+coords.kingitude);
			
			mapView.setLocation({latitude:coords.latitude, longitude:coords.longitude});
		},
		function (){
			Ti.API.info("GPS error." );
		}
	);
