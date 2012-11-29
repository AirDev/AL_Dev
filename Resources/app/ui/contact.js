
/*
 * 発生するイベント
 * 'messagetalk'
 * 'voicetalk'
 * 'cansel'
 * 
 */		
	var BUTTON_YOFS 	= 60;
	var BUTTON_HEIGHT 	= 70;			// ボタン高さ
	var BUTTON_WIDTH 	= 160;			// ボタン幅

	var myId;
	var myWin;
	var active = false;
	var app;
		
	exports.setActive = function(b){
		active = b;
	}	
	exports.isActive = function(){
		return active;
	}	
	exports.createWindow = function(data, apps){

		if ( apps === undefined ) alert("パラメータ指定エラー");
		
		app = apps;
				
		var scale = app.wrk.GetScale();
		
		myWin = Ti.UI.createWindow({
			borderRadius:		10,
			borderColor:		'#000000',
			borderWidth:		2,
			height:				350*scale,
			width:				320*scale,
 			backgroundColor: 	'#FAFAD2',
		});

		var label = Ti.UI.createLabel({
			top:		2*scale,
			left:		2*scale,
			font:		{fontSize:32*scale, fontWeight:'bold'},
			color:		'#000000',
			text:		data.NAME
		});
		var image = Ti.UI.createImageView({
			top:	10*scale,
			left:	10*scale,
//			image:data.image,
//	        image:'/images/icon/0'+parseInt(data.ID)%10+'.jpg',
//			image:'/images/icon/'+app.wrk.dummyIcon[parseInt(data.ID)%10],
			image:	'http://'+data.ICON,
			width:	120*scale,
			height:	"fill"
		});
		var talkButton = Ti.UI.createButton({
			top:	(BUTTON_YOFS+BUTTON_HEIGHT*0)*scale,
			right:	2*scale,
			width:	BUTTON_WIDTH*scale,
			font:	{fontSize:26*scale, fontWeight:'bold'},
			title:	"音声通話"
		});
		var videoButton = Ti.UI.createButton({
			top:	(BUTTON_YOFS+BUTTON_HEIGHT*1)*scale,
			right:	2*scale,
			width:	BUTTON_WIDTH*scale,
			font:	{fontSize:26*scale, fontWeight:'bold'},
			title:	"テレビ通話"
		});
		var chatButton = Ti.UI.createButton({
			top:	(BUTTON_YOFS+BUTTON_HEIGHT*2)*scale,
			right:	2*scale,
			width:	BUTTON_WIDTH*scale,
			font:	{fontSize:26*scale, fontWeight:'bold'},
			title:	"チャット"			
		});		
		var closeButton = Ti.UI.createButton({
			bottom:	(2)*scale,
			right:	2*scale,
			width:	BUTTON_WIDTH*scale,
			font:	{fontSize:26*scale, fontWeight:'bold'},
			title:	"もどる"
		});
		
		chatButton.addEventListener('click', function(e){
						
			myWin.close();
			Ti.App.fireEvent('createroom',{APP:app, DATA:[data], TAB:2});				
		});
		videoButton.addEventListener('click', function(e){
						
			myWin.close();
			app.voice.CreateWindow( data, app, app.define.VIDEOCALL );		
		});
		talkButton.addEventListener('click', function(e){
						
			myWin.close();
			
//			main.SetActiveTab(2);
			app.voice.CreateWindow( data, app, app.define.VOICECALL );		
		});
		closeButton.addEventListener('click', function(){
			myWin.close();
		});
		
		myWin.add(label);
		myWin.add(image);
		myWin.add(talkButton);
		myWin.add(videoButton);
		myWin.add(chatButton);
		myWin.add(closeButton);
		
		myWin.open();			
	}
	
	exports.addEvent = function(status, func){
		myWin.addEventListener(status, func);
	}
	

