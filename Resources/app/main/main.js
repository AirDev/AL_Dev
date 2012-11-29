/*
 * 	メイン処理
 * ログイン完了したら呼ばれる
 * 
 */	
//	var resv 	= require('app/talk/resvmsg');
//	var room 	= require('app/talk/room');
//	var wrk		= require('app/main/work');
//	var ind		= require('app/main/indicator');
//	var prof 	= require('app/main/prof');
		
	var defaultStyle = {
		barColor: '#000',
		backgroundColor: '#000'
	};
	
//	var tabGroup;
	var app;
	
exports.createMainView = function(apps){
	app = apps;
	
	Ti.UI.setBackgroundColor('#000');
	
	app.tabGroup = Ti.UI.createTabGroup({id:'tabGroup1'});

	// ロビー
//	var win1 = Titanium.UI.createWindow({className:'win1'});
	var winRobby = Titanium.UI.createWindow({
		app:				app,
		backgroundColor: 	'#4682B4',
		url:				'app/main/robby.js',
		titleid:			'Robby'
//		className:'win1'
	});
	
	// マップ表示
	var winMap = Titanium.UI.createWindow({
		app:				app,
		url:			'app/map/map.js',
		titleid:		'map'
	});
	
	// 会話ウィンドウ（ダミー）
	var winChat = Titanium.UI.createWindow({
		app:			app,
		url:			'app/talk/kaiwa.js',
		titleid:		'talk'
	});

	// セッティング
	var winSetting = Titanium.UI.createWindow({
		app:			app,
		url:			'app/main/setting.js',
		titleid:		'setting'
	});
	
	// イベント群
	var winEvent = Titanium.UI.createWindow({
		app:			app,
		url:			'app/main/event.js',
		titleid:		'events'
	});

	// タブの設定
	var tabRobby = Titanium.UI.createTab({
		title:			'ロビー',
		icon:			'images/tabs/KS_nav_ui.png',
		id:				'tab1',
		window:			winRobby
	});
	
	var tabMap = Titanium.UI.createTab({
		title:			'Map',
		icon:			'images/tabs/KS_nav_mashup.png',
		titleid:		'controls_win_map',
		window:			winMap
	});


	var tabChat = Titanium.UI.createTab({
		title:			'会話',
		icon:			'images/tabs/KS_nav_phone.png',
		titleid:		'controls_win_talk',
		window:			winChat
	});

	var tabSetting = Titanium.UI.createTab({
		title:			'Setting',
		icon:			'images/tabs/KS_nav_views.png',
		titleid:		'controls_win_setting',
		window:			winSetting
	});

	var tabEvent = Titanium.UI.createTab({
		title:			'Event',
		icon:			'images/tabs/KS_nav_platform.png',
		titleid:		'controls_win_event',
		window:			winEvent
	});
	
	app.tabGroup.addTab(tabRobby);
	app.tabGroup.addTab(tabMap);
	app.tabGroup.addTab(tabChat);
	app.tabGroup.addTab(tabEvent);
	app.tabGroup.addTab(tabSetting);

	app.tabGroup.addEventListener('open',function()
	{
		// set background color back to white after tab group transition
		Ti.UI.setBackgroundColor('#fff');
	});
	
	app.tabGroup.setActiveTab(0);
	
	// open tab group with a transition animation
	app.tabGroup.open({
		transition: Titanium.UI.iPhone && Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
	});

	Ti.App.addEventListener('chat_receive', function(e){

		if ( e.data[0].ROOM != app.room.GetRoomId() ){

			Ti.API.info('receive chat request '+JSON.stringify(e));
			
			app.tabGroup.setActiveTab(2);
//			main.SetActiveTab(2);
//			room.OpenRoomWindow(e.data);
			Ti.App.fireEvent('openroom',{DATA:e.data, APP:app});				
		}	
	});
	
	app.tabGroup.addEventListener('focus', function(e)
	{
		if ( e.previousIndex == 0 || e.previousIndex == 3){
			app.prof.close();
		}
		
		if ( e.index == 1 ){
			Ti.App.fireEvent('tabmap');
		}		
			Ti.API.info('tab ' + e.tab.title  + ' prevTab = ' + (e.previousTab ? e.previousTab.title : null));
	});
	
	app.ind.hide();
};
