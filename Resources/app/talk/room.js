/*
 * `ROOM（会話用の部屋）
 * 
 * 		ROOM１つに付きローカルにログファイルを１つ作成する
 * 		サーバーには保存されない。
 * 		他人は左付きで左からアイコン＋テキストの順に並ぶ。自分はアイコン無しで右詰で並ぶ。
 * 		外からのログはTCPで流れてくる。（自分のも？）
 * 		
 */	
	var list	= require('app/ui/list');
	var talkopt	= require('app/ui/talkopt');	
//	var connect = require('app/comm/connect');
//	var wrk		= require('app/main/work');
//	var ind		= require('app/main/indicator');
//	var resv	= require('app/talk/resvmsg');
	
	var roomId = -1;
	var logfile;
	var members = [];
	var messageLog = [];
	var sendEnable = true;
	var win;
	var app;
/*
 * 現在アクティブなROOMIDを取得
 */	
exports.GetRoomId = function(){
	return roomId;
}
var viewMovieFile = function(url){
}
/*
 * 送られてきた画像ファイルをフルサイズで閲覧する
 */
var viewImageFile = function(url){

		
	var win = Ti.UI.createWindow({
	});
	
	var iv = Ti.UI.createImageView({
		image:	url	
	})
		
	// iOSなら保存にこれが使える。
//	Titanium.Media.saveToPhotoGallery(iv.image);
		
	// 画像をタッチしたら保存メニュー出す
	iv.addEventListener('click', function(e){
		win.close();	
	});
	// 読み込みが終わった所で保存（テスト）
	iv.addEventListener('load', function(e){
				
		Ti.API.info('iv '+JSON.stringify(iv));
		
		app.file.saveImage(url, iv.toImage(null,true) );		
	});
	
	win.add(iv);
	win.open();
};
// /**
 // * ROOMの一覧を作成
 // * 	TableView作成
 // * 	window作成
 // */	
// exports.CreateRoomsWindow = function(){
	// var rooms = app.wrk.GetRooms();
// }

/*
 * チャットウィンドウのベース部分登録
 */
var makeWindow = function(){
	
		var scale = app.wrk.GetScale();
		
		win = Ti.UI.createWindow({
			backgroundColor: '#2E8B57',
		});
//       var win = Ti.UI.currentWindow;
       
        var optBtn = Ti.UI.createButton({
        	bottom:    	2,
        	left:	  	0,
        	title:  	'機能'
		});
        
        var sendBtn = Ti.UI.createButton({
              	bottom:	2,
            	right:	2,
				title:	"送信"
		});
        var textField = Ti.UI.createTextField({
            bottom:        0,
            left:          50*scale,
            right:         50*scale,
//          height:        80,
//          width:               280,
//          color:         '#336699',
            hintText:      "入力してください" ,
            keyboardType:  Titanium.UI.KEYBOARD_DEFAULT,
            returnKeyType: Titanium.UI.RETURNKEY_DEFAULT,
			borderStyle:   Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
		});
		optBtn.addEventListener( 'click', function (){
              talkopt.createWindow(roomId, app, members);
       });
       
       sendBtn.addEventListener( 'click', function (){
               if ( textField.value && roomId && sendEnable ){
                     
                     sendEnable = false;
                     
                     app.connect.SendChatMsg(
                           roomId,
                           textField.value,
                           // 送信完了
                            function(status , data){
                            	
                            	//チャット相手全員にメッセージング処理
                            	members.forEach(function(data){
									app.wrk.sipclient.sendMessage(""+data.USERNAME, "chatupdate");
                            	});
								
                                textField.value = '';
                                sendEnable = true;
                           },
                            function(error ){
                                  sendEnable = true;
                           }
                     );
                     
                     textField.blur();
              }
       });
        // ログファイル検索
       logfile = getLogFile(members);
       
        // ログファイルがあるなら状態を復帰
        if ( logfile ){
              messageLog = list.createList(win);
              
              recoverLog(messageLog, logFile);
                           
              
              Ti.App.addEventListener( 'chat_receive', function (e){
                     addDisplayLog(messageLog, e.data);
              });
       } else{
               // ログファイルの作成
              makeLogFile(roomId, members);
              messageLog = list.createList(win);
                           
              Ti.App.addEventListener( 'chat_receive', function (e){
                     addDisplayLog(messageLog, e.data);
              });
       }      
//		addDisplayLog(logs, rooms);
       
       	win.add(textField);
       	win.add(sendBtn);
       	win.add(optBtn);
		win.add(messageLog);
		
		// ウィンドウが多重に開いているようなので対処予定
       win.open();
	}

/*
 * ROOMID指定で表示
 */
exports.OpenRoomWindow = function(rooms, onFail){
	
	roomId = rooms[0].ROOM;
	
	// 招待されたルームのメンバーを調べる
	app.connect.GetChatList(
		function(status, data){

			if ( data.RESULT == 'OK' && data.RESPONSE ){
			}
		
			// ルームの参加メンバー取得(IDだけの配列)		
			var mems = SearchRoomData(roomId, data.RESPONSE);
	
			var myData = app.wrk.GetMyData();
			
			var whoiscount = 0;
				
			members = [];

			// ルームのメンバーリスト作成(memsには全員入っている)
			mems.forEach(function(id){
				whoiscount++;
				app.connect.WhoIs(
					id,
					function(status, data){
						
						var m = data.RESPONSE;
						
						members.push({ID:m.ID, NAME:m.NAME, LALTITUDE:m.LALTITUDE, LONGITUDE:m.LONGITUDE, ICON:m.ICON, USERNAME:m.USERNAME});
						whoiscount--;
						
						if (whoiscount < 1){
							// 全員の情報が取得終わったらウィンドウを作る
							makeWindow();
							addDisplayLog(messageLog, rooms);
						}						
					},
					function(error){
						Ti.API.info("取得エラー " +id);
						
						whoiscuont--;
						
						if ( whoiscount < 1){
							// 全員の情報が取得終わったらウィンドウを作る
							makeWindow();
							addDisplayLog(messageLog, rooms);
						}						
					}
				);
			});
		},
		function(error){
			alert('チャットの開始に失敗しました');
			if(onFail) onFail();
		}
	);
}
/**
 * 自分の所属しているルーム一覧から指定IDを検索して参加者IDリストを取得する
 */
var SearchRoomData = function(id, roomDatas){
	
	for ( var i=0; i<roomDatas.length; i++){
		if ( roomDatas[i].ROOM == id){
			
			Ti.API.info("room found member "+roomDatas[i].MEMBER );
			
			return roomDatas[i].MEMBER;
		}
	}
	
	return null;
}
/**
 * チャット参加メンバーのユーザー情報取得
 */
var getUser = function(id){
	
	for ( var i=0;i<members.length; i++){
//		Ti.API.info("getuser "+members[i].ID +" "+id);
		if ( members[i].ID == id){
			return members[i];
		}
	}
	
	return null;
}
/**
 * 受信したメッセージを表示中のログへ追加
 * data
		
		ROOM	整数	チャットルームID
		FROM	整数	送信者ID
		MESSAGE	文字列	メッセージ内容
		MSGTYPE	整数	メッセージカテゴリ * 		FROM
 */
var addDisplayLog = function(logs, data){
	
//	Ti.API.info("fire "+JSON.stringify(data));
	
	var scale 	= app.wrk.GetScale();
	var myId 	= parseInt(app.wrk.GetUID());
	
//	Ti.API.info("data "+JSON.stringify(data));
	
//	Ti.API.info("members "+JSON.stringify(members));
	
	data.forEach(function(log){
		
		var logId	= parseInt(log.FROM);
		var member	= getUser(log.FROM);
		
		if ( !member ){
			Ti.API.info("No member Data "+log.FROM);
		}else{
			var iv;
			var ivl;
			var ivr;
			var tv;
			var urls;
			
			var row = Ti.UI.createTableViewRow({
			        className: 	'row',
			        objName: 	'row',
//			        height: 100,
//			        title:log.MESSAGE,
//			        leftImage:'/images/icon/0'+id%10+'.jpg',
//			        touchEnabled: true
			});
			ivl = Ti.UI.createImageView({
				left:	1,
				width:	100*scale,
//				height:	100*scale,
//				image:	log.MESSAGE						
			});
			ivr = Ti.UI.createImageView({
				right:	1,
				width:	100*scale,
//				height:	100*scale,
//				image:	log.MESSAGE						
			});
			
			// 画像表示
			if ( log.MSGTYPE == 1){
				
				if ( logId != myId  ){
					ivl.setImage(log.MESSAGE);
//					ivl.setImage('http://news.mynavi.jp/news/2012/10/22/145/images/001l.jpg');
					ivl.width = 200*scale;
				}else{
					ivr.setImage(log.MESSAGE);
//					ivr.setImage('http://news.mynavi.jp/news/2012/10/22/145/images/001l.jpg');
					ivr.width = 200*scale;
				}
				row.add(ivl);
				row.add(ivr);
				
				// 画像閲覧機能
				row.addEventListener('click', function(e){
					viewImageFile(log.MESSAGE);
				} );

				// イベントを設定して保存できるようにする。					
							
			// スタンプ表示
			}else if ( log.MSGTYPE == 2){
				if ( logId != myId  ){
					// iv = Ti.UI.createImageView({
						// left:	1,
						// width:	100*scale,
						// height:	100*scale,
						// image:	log.MESSAGE						
					// });
					ivl.setImage(log.MESSAGE);
					ivl.width = 200*scale;
				}else{
					// iv = Ti.UI.createImageView({
						// right:	1,
						// width:	100*scale,
						// height:	100*scale,
						// image:	log.MESSAGE						
					// });					
					ivr.setImage(log.MESSAGE);
					ivr.width = 200*scale;
				}
//				row.add(iv);
				row.add(ivl);
				row.add(ivr);
			
			// 動画ファイルサムネイル表示（保存用イベントセット）
			}else if ( log.MSGTYPE == 10){
							
				var image = null;
				
				urls = JSON.parse(log.MESSAGE);
				
				if ( urls ){
					if ( urls.THUMB !== undefined ){
					 	image = urls.THUMB;
					 	// dummy
//						image = "http://yajidesign.com/i/0039/tnm.png";
												
						if ( logId != myId  ){
							ivl.setImage(image);
							ivl.width = 200*scale;
						}else{
							ivr.setImage(image);
							ivr.width = 200*scale;
						}
						row.add(ivl);
						row.add(ivr);
											
						row.addEventListener('click', function(e){
							saveFile(urls.URL, 0);
						} );
					}
				}else{
					Ti.API.info("no audio thumbnail");						
				}
			// 音声ファイルサムネイル表示（保存用イベントセット）
			}else if ( log.MSGTYPE == 11){
							
				var image = null;
				
				urls = JSON.parse(log.MESSAGE);
				
				if ( urls )
				{
					if ( urls.THUMB !== undefined ){
					 	image = urls.THUMB;
					 	// dummy
//						image = "http://yajidesign.com/i/0039/tnm.png";
												
						if ( logId != myId  ){
							ivl.setImage(image);
							ivl.width = 200*scale;
						}else{
							ivr.setImage(image);
							ivr.width = 200*scale;
						}
						row.add(ivl);
						row.add(ivr);
											
						row.addEventListener('click', function(e){
							if ( !app.recwin.isActive() ){
								saveFile(urls.URL, 1);								
							}
						} );
					}
				}else{
					Ti.API.info("no audio thumbnail");						
				}
			}else{			
				if ( logId != myId || log.MSGTYPE == 3 ){
					// iv = Ti.UI.createImageView({
						// left:	1,
						// width:	100*scale,
						// height:	100*scale,
						// image:	'http://'+member.ICON,						
					// });	
					
					ivl.setImage('http://'+member.ICON);

					tv = Ti.UI.createLabel({
							font:{fontSize:24*scale, fontWeight:'bold'},
							text:log.MESSAGE,
//							left :1+100*scale,
							color:	'#ffffff',
	//						width:'auto'
					});
				}else{
					// iv = Ti.UI.createImageView({
						// right:	1,
						// width:	100*scale,
						// height:	100*scale,
						// image:	'http://'+member.ICON,						
					// });	
					ivr.setImage('http://'+member.ICON);
	
					tv = Ti.UI.createLabel({
						font:	{fontSize:24*scale, fontWeight:'bold'},
						text:	log.MESSAGE,
//						right:	1+100*scale,
//						textAlign:'right',
						color:		'#ffffff',
	//					width:'auto'
					});
				}
//				row.add(iv);
				row.add(ivl);
				row.add(ivr);
				row.add(tv);
			}			
			logs.appendRow(row);
			
			logs.scrollToIndex(logs.getBottom());
			
//			for ( var i=0; i<logs.sections[0].rowCount; i++ ){
//				Ti.API.info(""+i+" "+JSON.stringify(logs.sections[0].rows[i]));	
//			}
//			Ti.API.info("会話ログ　"+JSON.stringify(logs));
		}			
	});
}
/**
 * 	url
 * 	no	0:movie
 * 		1:audio
 */
var saveFile = function(url,no){
	
//	Ti.API.info("ダウンロードファイル名 "+url );
	
	app.ind.setText("ダウンロード中……");
	
	var xhr = Ti.Network.createHTTPClient({
    	onload: function(e) {
			// this function is called when data is returned from the server and available for use
   	     // this.responseText holds the raw text return of the message (used for text/JSON)
   	     // this.responseXML holds any returned XML (including SOAP)
   	     // this.responseData holds any returned binary data
			
			if ( this.responseData ){
				var file = this.responseData;
				var save_file_name = url.substring(url.lastIndexOf("/")+1,url.length);
      			
     			var dir =  Ti.Filesystem.externalStorageDirectory;
  					if(!Ti.Filesystem.getFile(dir).exists()){
 					Ti.Filesystem.getFile(dir).createDirectory();
				}
      			var f = Ti.Filesystem.getFile(dir, save_file_name);
      			
  				f.write(this.responseData);
	  				
				Ti.Media.Android.scanMediaFiles([f.nativePath], null,function(e){
				    if (e.uri) {
						Ti.API.info(e.uri);
    				} else {
      					Ti.API.info('no uri');
    				}
				});			
				
				app.recwin.create( app, null, null, f.nativePath );

			}else{
				Ti.API.debug("ダウンロードデータの実体がありません");				
			}
//        	alert('success '+url);
			app.ind.hide();
	    },
	    onerror: function(e) {
			// this function is called when an error occurs, including a timeout
        	Ti.API.debug(e.error);
        	alert('error');
			app.ind.hide();
    	},
    	timeout:5000  /* in milliseconds */
	});
	xhr.open("GET", url);
	xhr.send();  // request is actually sent with this statement
//	alert("save "+"url");	
};
/*
 * ログファイルからチャット履歴を復帰
 */
var recoverLog = function(logs, logfile){

	// 履歴から復帰させる	
}

/**
 * ROOMを作成(自分でチャットルームを開いた場合)
 * membersはAirlineIDの文字列配列（通常は一人だが複数対応しておく）
 */
exports.CreateRoomWindow = function(mems){
	
	var logs;
	
	var scale 	= app.wrk.GetScale();
	
	win = Ti.UI.createWindow({
		backgroundColor: '#2E8B57',
	});
	
	var optBtn = Ti.UI.createButton({
		bottom:		2,
		left:		0,
		title:		'機能'
	});
	var sendBtn = Ti.UI.createButton({
		bottom:			2,
		right:			0,
		title:			"送信"
	});
	var textField = Ti.UI.createTextField({
		bottom:        2,
		left:           50*scale,
		right:         50*scale,
//		height:        80,
//		width:			280,
//		color:         '#336699',
		hintText:      "入力してください",
		keyboardType:  Titanium.UI.KEYBOARD_DEFAULT,
		returnKeyType: Titanium.UI.RETURNKEY_DEFAULT,
		borderStyle:   Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});		
	optBtn.addEventListener('click', function(){		
        talkopt.createWindow(roomId, app, members);
	});
	
	sendBtn.addEventListener('click', function(){
		if ( textField.value && roomId && sendEnable ){
			
			sendEnable = false;
			
			app.connect.SendChatMsg(
				roomId,
				textField.value,
				function(status, data){
					
                   	//チャット相手全員にメッセージング処理
                   	members.forEach( function(data){
						app.wrk.sipclient.sendMessage(data.USERNAME, 'chatupdate');
                   	});

					textField.value = '';
					sendEnable = true;
				},
				function(error){
					sendEnable = true;
				}
			);
			
			textField.blur();
		}
	});
	// ログファイル検索
	logfile = getLogFile(mems);
	
	// ログファイルがあるなら状態を復帰
	if ( logfile ){
		logs = list.createList(win);
		
		recoverLog(logs, logFile);
				
		win.add(textField);
		win.add(sendBtn);
		win.add(optBtn);
		win.add(logs);
		
		Ti.App.addEventListener('chat_receive', function(e){
			addDisplayLog(logs, e.data);
		});

		win.open();
	}else{
		// ルームを作成（ルームは１：１でしか作れないので最初の一人を使う）
		// 20120901 拡張済み。10人まで指定できる
		var memList=[];
		
		mems.forEach(function(mem){
			memList.push(mem.ID);
		});
		app.connect.CreateChat(memList,
			function(status, data){
				
				if ( data.RESULT && data.RESULT == 'OK'){
					
					var myData = app.wrk.GetMyData();
					
					roomId = data.RESPONSE.ROOM;
					
					Ti.API.info( "チャット登録自分 "+JSON.stringify(myData) );
					
					// 自分のデータをルームメンバーの先頭に
					members.push({ID:myData.ID, NAME:myData.NAME, LALTITUDE:myData.LALTITUDE, LONGITUDE:myData.LONGITUDE, ICON:myData.ICON, USERNAME:myData.USERNAME});
					
					// ルームのメンバーリスト作成
					mems.forEach(function(m){

						app.connect.WhoIs(
							m.ID,
							function(status, data){
						
								var m = data.RESPONSE;
						
								members.push({ID:m.ID, NAME:m.NAME, LALTITUDE:m.LALTITUDE, LONGITUDE:m.LONGITUDE, ICON:m.ICON, USERNAME:m.USERNAME});
							},
							function(error){
								Ti.API.info("取得エラー " +id);
							}
						);
					});
//					Ti.API.info('chat members data '+JSON.stringify(members));										
//					app.connect.InviteChat(roomId,mems[0].ID,
	//					function(status, data){
//							Ti.API.info('チャット相手招待成功' + data.RESULT );
							
							// ログファイルの作成
							makeLogFile(roomId, mems);
							logs = list.createList(win);
				
							win.add(textField);
							win.add(sendBtn);
							win.add(logs);
							win.add(optBtn);
							
							Ti.App.addEventListener('chat_receive', function(e){
								addDisplayLog(logs, e.data);
							});
							
							// 初期メッセージ登録
							addDisplayLog(logs, [{ROOM:roomId, FROM:app.wrk.GetUID(), MESSAGE:'', MSGTYPE:3}]);

							win.open();
//						},
//						function(error){
//							Ti.API.info('チャット相手招待失敗 '+error);							
//						}
//					);
				}
			},
			function(error){
			}
		);
	}
	
	Ti.App.addEventListener('chat_close',function(){
		win.close();
	});
}
var CloseRoom = function(){	
}
/*
 * 
 */
var GetRooms = function(){
	
	var rooms = Ti.App.Properties.getString('rooms.txt');	
	
	if ( !rooms ) return null;
	
	return JSON.parse(rooms);
};

/*
 * ログファイルの作成
 */
var makeLogFile = function(roomId, members){
	
	var filename = makeLogFileName(roomId);
	var messages = [];
	
//	messages.push({ID:-1, MESSAGE:'dummy', MSGTYPE:0});	
	
	Ti.App.Properties.setString(filename, JSON.stringify({VER:'0.0',ID:roomId, MEMBERS:members, MESSAGES:messages}) );	
	
	Ti.API.info("log file initiarized."+filename );
	
	var room = Titanium.App.Properties.getString(filename);
	Ti.API.info(JSON.stringify(room));
}
/*
 * ROOMのログファイルがローカルに保存されていれば読み出す
 * 	バージョン違いは無しとする。
 */
var getLogFile = function(id){
	
	return null;
	
	// var file = Ti.App.Properties.getString(makeLogFileName(id));
// 	
	// return file;
}
/*
 * ROOMのログファイル名を生成する
 */
var makeLogFileName = function(id){
	
	// var name = 'f';
// 	
	// for(var i=0;i<members.length; i++){
		// name +='_'+members[i];
	// }
	// name +='.log';
	// return name;
	
	var name = 'room';
	
	name = name+id+'.log';
	
	return name;
}
/**
 * ROOM参加者登録
 */
exports.setMembers = function(members){
	
}
/**
 * ROOM参加者追加
 */
exports.addMembers = function(members){
	
}
/**
 * ログを復帰。ログがローカルに無ければファイル作成
 */
exports.restoreRoomWindow = function(){
	
}

/*
 * ROOM	整数	チャットルームID
 * FROM	整数	送信者ID
 * MESSAGE	文字列	メッセージ内容
 * MSGTYPE	整数	メッセージカテゴリ
 */	
exports.AddMessages = function(rooms){
	
 	var filename;
 	
//	Ti.API.info("rooms"+JSON.stringify(rooms)+' '+rooms.length);

	rooms.forEach( function(room){
		
		filename = makeLogFileName(room.ROOM);

//		alert("FROM "+room.FROM+" "+room.MESSAGE);
	
		// ログファイルの取得
		logs = Titanium.App.Properties.getString(filename);
		
//		Ti.API.info('更新前ログ '+logs);
		
		// ログファイルが無ければ作成（メンバーはダミー)
		// ここら辺は要見直し
		if ( !logs ){
			makeLogFile(room.ROOM, ['-1']);			
			logs = Titanium.App.Properties.getString(filename);
		}
		
		logs = JSON.parse(logs);

		// ログファイルのメッセージを一度戻して送られてきたメッセージを足す。効率悪そうなので修正予定。		
		var m = [];	
		// for(var log in logs.MESSAGES){
			// m.push({ID:log.ID, MESSAGE:log.MESSAGE, MYGTYPE:log.MSGTYPE});	
		// }
		logs.MESSAGES.forEach(function(log){
			m.push({ID:log.ID, MESSAGE:log.MESSAGE, MYGTYPE:log.MSGTYPE});				
		});
		m.push({ID:room.FROM, MESSAGE:room.MESSAGE, MYGTYPE:room.MSGTYPE});	

		Ti.App.Properties.setString(filename, JSON.stringify({VER:'0.0',ID:logs.ID, MEMBERS:logs.MEMBERS, MESSAGES:m}) );	
				
//		Ti.API.info('更新後メッセージログ '+JSON.stringify(m));
	});
}
Ti.App.addEventListener('createroom',function(e){
	
	app = e.APP;
	if ( e.TAB === undefined ){
//		Ti.API.info("タブ指定無し");
	}else{
//		Ti.API.info("タブ指定有り " + e.TAB);
		app.tabGroup.setActiveTab(e.TAB);
	}
	exports.CreateRoomWindow(e.DATA);	
});

Ti.App.addEventListener('openroom',function(e){
	app = e.APP;
	exports.OpenRoomWindow(e.DATA);
});


