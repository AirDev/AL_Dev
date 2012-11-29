	/*
	 * 音声会話
	 */
//	var wrk			= require('app/main/work');
//	var connect		= require('app/comm/connect');
//	
//	if(Ti.Platform.osname == 'android'){
//		var sipclient 	= require('jp.co.aircast.module');
//	}else{
//		var sipclient 	= require('me.takus.ti.voip');		
//	}		

	var app;		
/*
 * 	NAME	文字列	ユーザ名
 * 	ID	整数	ユーザID
 * 	AID	整数	アバターID
 * 	LALTITUDE	文字列	緯度
 * 	LONGITUDE	文字列	経度
 */
	exports.CreateWindow = function(user, apps, mode){

		app = apps;
		
		var scale = app.wrk.GetScale();
		var me = app.wrk.GetMyData();
		
		var mainWin = Ti.UI.createWindow({
			borderRadius:		10,
			borderColor:		'#000000',
			borderWidth:		2,
			height:				350*scale,
			width:				320*scale,
 			backgroundColor: 	'#FAFAD2',
		});

		var talkLabel = Ti.UI.createLabel({
			font:		{fontSize:32*scale, fontWeight:'bold'},
			color:		'#000000',
			top:		10*scale,
			left:		10*scale,
			text:		'接続中'
		});
		var image = Ti.UI.createImageView({
			top:		2*scale,
			left:		10*scale,
//			image:data.image,
//	        image:'/images/icon/0'+parseInt(data.ID)%10+'.jpg',
//			image:'/images/icon/'+wrk.dummyIcon[parseInt(user.ID)%10],
			image:		'http://'+user.ICON,						

			width: 		120*scale,
			height:		"fill"
		});
		var closeButton = Ti.UI.createButton({
			bottom:		2,
			right:		2,
			width:		100*scale,
			title:		"閉じる"
		});
		closeButton.addEventListener('click', function(){
			mainWin.close();
		});
		
		mainWin.add(image);
		mainWin.add(closeButton);
		mainWin.add(talkLabel);		
		mainWin.open();
		
//		Ti.API.info("user"+JSON.stringify(user));

		// 相手先のユーザーネームを読み込んで呼び出す
		app.connect.WhoIs(
			user.ID,
			function(status, data){
				if ( data.RESULT == 'OK' && data.RESPONSE ){
					Ti.API.info("icon "+data.RESPONSE.ICON );
					
					if(Ti.Platform.osname == 'android'){
//						Ti.API.info('sip '+JSON.stringify(app.wrk.sipclient))
						
						if ( mode == app.define.VOICECALL){
//							app.wrk.sipclient.call(data.RESPONSE.USERNAME);						
							app.wrk.sipclient.call(
			              		    data.RESPONSE.USERNAME,
									data.RESPONSE.NAME,
									'http://'+data.RESPONSE.ICON,
									me.NAME,
									'http://'+me.ICON
							);
	
						}else{
//							app.wrk.sipclient.videoCall(data.RESPONSE.USERNAME);							
							app.wrk.sipclient.videoCall(
			              		    data.RESPONSE.USERNAME,
									data.RESPONSE.NAME,
									'http://'+data.RESPONSE.ICON,
									me.NAME,
									'http://'+me.ICON
							);
						}
					}else{
						alert('iOS 音声通話修正作業中');											
					}
					mainWin.close();
					// mainWin.addEventListener('focus', function(e){
// 						
						// talkLabel.text = "通話終了";
					// });
				}
			},
			function(error){
				
			}
		);
					
	}
