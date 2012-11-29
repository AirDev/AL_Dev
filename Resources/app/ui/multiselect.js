
	var list 	= require('app/ui/list');
//	var connect = require('app/comm/connect');
//	var geo 	= require('app/main/gps');
	var wrk		= require('app/main/work');
//	var room 	= require('/app/talk/room');
	
//	var baseUsers;
	var mainWin;
	var mainList;
	var mainUsers;
	var app;
	
	/**
	 *チャットのメンバーではないかチェック
	 * 	true	チャットにまだ加わっていない
	 * 	false	すでにチャットのメンバー 
	 */	
	var IsNotChatMember = function(id, chatMembers ){

		if ( !chatMembers ) return 	true;
			
		for ( var i=0; i<chatMembers.length; i++){
			if ( chatMembers[i] == id ){
				return false;
			}
		}
		return true;
	}			
	/*
	 * users		ユーザーリスト(users.phpの返値に準拠)
	 * 		NAME	文字列	ユーザ名
			ID	整数	ユーザID
			ICON	文字列	アイコンファイルURL

	 * chatMembers	除外するメンバーリスト
	 *		ID	整数	ユーザID
	 * 
	 * 
	 */
	exports.createWindow = function(baseUsers, chatMembers, apps ){
		
		app = apps;
//		var baseUsers	= wrk.GetRobbyUsers();
		var scale 		= app.wrk.GetScale();
		var mainUsers 	= [];
		var swList 		= new Array();
		
		mainWin = Ti.UI.createWindow({
			exitOnClose 	: false, 
			backgroundColor	: '#000000'
		});
		
		mainWin.orientationModes = [
	        Titanium.UI.PORTRAIT,
//  	    Titanium.UI.UPSIDE_PORTRAIT,
//  	    Titanium.UI.LANDSCAPE_LEFT,
//     		Titanium.UI.LANDSCAPE_RIGHT,
//     		Titanium.UI.FACE_UP,
//     		Titanium.UI.FACE_DOWN
		];

		var okBtn = Ti.UI.createButton({
			left:		1,
			bottom:		1,			
			title:		'招待する'			
		});
		var backBtn = Ti.UI.createButton({
			left:		1+100,
			bottom:		1,			
			title:		'戻る'
		});

		okBtn.addEventListener('click', function(e){
			var inviteList = [];
			
			if ( swList.length < 1 ){
				alert("一人も選択されていません");
			}else{
				for(var key in swList){
					if(swList[key]){
						inviteList.push(wrk.GetRobbyUser(key));
					}
				}
				
				Ti.API.info( "招待した人"+JSON.stringify(inviteList));	
				
				mainWin.close();
//				room.CreateRoomWindow( inviteList );										
				Ti.App.fireEvent('createroom',{APP:app, DATA:inviteList});				
			}
			
		});
		backBtn.addEventListener('click', function(e){
			mainWin.close();			
		});
		
		mainWin.add(okBtn);
//		mainWin.add(backBtn);
		
		mainList 	= list.createList(mainWin);
				
		rows = [];
				
		baseUsers.forEach(function(d){
			
			// すでにちゃっtのメンバーだったら除く
			if ( IsNotChatMember(baseUsers, chatMembers) ){
				var iv = Ti.UI.createImageView({
					left:	1,
					width:	100*scale,
					height:	100*scale,
					image:	'http://'+d.ICON,						
				});
							
				var label = Ti.UI.createLabel({
					left:	102*scale,
					font:{fontSize:36*scale, fontWeight:'bold'},
					text:	d.NAME
				});
										
				var row = Ti.UI.createTableViewRow({
			        className: 'row',
			        objName: 'row',
	        		touchEnabled: true
				});

				var sw = Ti.UI.createSwitch({
					right:		1,
					value:		false
				});
				sw.addEventListener('change', function(e){
//					Ti.API.info(" switch "+d.ID+" "+JSON.stringify(e));
					swList[d.ID] = e.value;	
				});
											
				row.add(label);
				row.add(iv);
				row.add(sw);	
				rows.push(row);
				
				mainUsers.push({ID:d.ID});
			}		
		});
	
		list.setData(mainList, rows);
	
		/*
		 * 招待ユーザ決定処理
		 * 
		 */
		// list.addEventListener(mainList, function(e){
// 			
// //			Ti.API.info(JSON.stringify(e));
// 			
			// mainWin.close();
// 			
			// var users = wrk.GetRobbyUsers();
			// var user  = users[e.index];
// 			
			// connect.InviteChat(roomId, user.ID,
				// function(status, data){
					// Ti.API.info('チャット相手招待成功');
					// alert(user.NAME+'を招待しました');													
				// },
				// function(error){
// //					Ti.API.info('チャット相手招待失敗');	
					// alert(user.NAME+'の招待に失敗しました');						
				// }
			// );
		// });
		
		mainWin.addEventListener('android:back', function(){
			mainWin.close();
    	});
//		win.add(list);
		mainWin.open();
	};
