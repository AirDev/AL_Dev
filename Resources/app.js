/*
 * ALテスト版
 * 
 */
	var app = {};
	 
//	var ui 		= require('app/ui/ui');
	app.define	= require('app/main/define');
	app.connect	= require('app/comm/connect');
	app.ind		= require('app/main/indicator');
	app.wrk		= require('app/main/work');
	app.geo 	= require('app/main/gps');
	app.room 	= require('app/talk/room');
	app.voice	= require('app/talk/voiceTalk');
	app.prof 	= require('app/main/prof');
	app.common	= require('app/main/common');
	app.file	= require('app/main/file');
	app.recwin 	= require('/app/ui/recwin');
	
	if(Ti.Platform.osname == 'android'){
		app.mic 		= require('jp.co.aircast.al.mic');
		app.sipclient 	= require('jp.co.aircast.module');
	}else{
		app.sipclient 	= require('me.takus.ti.voip');		
	}
			
	// 設定位置はここらへんでないとエラーが出た。	
	Ti.UI.orientation = Ti.UI.PORTRAIT;

	var login = require('app/main/login');
	
	var loginFunction = function(){
		
		// ログイン（未登録ならサインアップ含む）
		login.createLogin(app,
			// ログイン成功
			function(status, data){
				if ( data.RESULT == 'OK'){
					var main = require('app/main/main');
					main.createMainView(app);
				}else{
					app.ind.hide();
					alert("Login Fail. "+status+": "+data.RESULT );
				}
			},
			// ログイン失敗
			function(data){
				if ( data.RESULT == 'NONE')
				{
					// 再度ログイン。
					app.ind.setText('ログイン中……');
					loginFunction();
				}
			}
		);
	}
	
	app.ind.createIndicator('ログイン中……');
	
	loginFunction();
