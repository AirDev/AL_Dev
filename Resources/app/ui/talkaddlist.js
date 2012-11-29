
	var list 	= require('app/ui/list');
//	var subWin 	= require('app/ui/contact');
	var connect = require('app/comm/connect');
//	var geo 	= require('app/main/gps');
	var wrk		= require('app/main/work');
	
//	var userList;
	var roomId;
	var users;
		
	exports.createWindow = function(id){
		
		roomId = id;
		
		var win = Ti.UI.createWindow({
			exitOnClose 	: false, 
			backgroundColor	: '#000000'
		});		
		var view = list.createList(win);
		users = wrk.GetRobbyUsers();
				
		raws = [];
		users.forEach(function(d){
					
			var raw = Ti.UI.createTableViewRow({
					font:{fontSize:32, fontWeight:'bold'},
			        className: 'row',
			        objName: 'row',
			        height: 100,
			        title:d.NAME,
					leftImage:'/images/icon/'+wrk.dummyIcon[parseInt(d.ID)%10],
			        touchEnabled: true
			});
		
			raws.push(raw);
		});
	
		list.setData(view, raws);
	
		// 招待ユーザ決定処理
		list.addEventListener(view, function(e){
			
//			Ti.API.info(JSON.stringify(e));
			
			win.close();
			
			var users = wrk.GetRobbyUsers();
			var user  = users[e.index];
			
			connect.InviteChat(roomId, user.ID,
				function(status, data){
					Ti.API.info('チャット相手招待成功');
					alert(user.NAME+'を招待しました');													
				},
				function(error){
//					Ti.API.info('チャット相手招待失敗');	
					alert(user.NAME+'の招待に失敗しました');						
				}
			);
		});
		
		win.addEventListener('android:back', function(){
			win.close();
    	});
//		win.add(list);
		win.open();
	};
