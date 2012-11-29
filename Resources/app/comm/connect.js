/*
 * 通信関係
 */
	/******************************************************
	 * Require定義
	 * 		Androidでは重複読み込みはスキップされるがiOSでは毎回読み込まれるので挙動が違う(ver2.1.1).
	 * 		なのでワークの初期化などは注意。
	 *****************************************************/	
	var comm 	= require('/app/comm/comm');
	
	/******************************************************
	 * 固定定義
	 *****************************************************/	
	var demoServer 	= '54.248.91.191'		// デモサーバ：
	var devServer	= '54.248.73.225'		// 開発サーバ
	
	var BASE_URL;
	
	var serverSwitch = Ti.App.Properties.getString('serverSwitch');
	
	if ( serverSwitch && serverSwitch == 'dev'){
	 	BASE_URL = 'http://'+devServer+'/airline/';		
	}else{
	 	BASE_URL = 'http://'+demoServer+'/airline/';				
	}

	/******************************************************
	 * PHPコマンド定義
	 *****************************************************/	
	var loginCmd 			= 'login.php?tno=';				// l.php?tno=%s
	var signupcmd 			= 'signup.php';
	var telbookcmd 			= 'telbook.php';				// 電話帳送信

	var userscmd			= 'users.php';
	var usersrobbycmd		= 'users.php?mode=lobby';
	var usersmapcmd			= 'users.php?mode=map';

	var whoiscmd			= 'whois.php';					// whois.php?id=%d
	var whoisrobbycmd		= 'whois.php?mode=lobby';		// whois.php?id=%d
	var whoismapcmd			= 'whois.php?mode=map';			// whois.php?id=%d

	var	sendmsgcmd			= 'message.php?mode=send';
	var getmsgcmd			= 'message.php?mode=read?mid=';	// message.php?mode=read?mid=%d
	var getmsglistcmd		= 'message.php?mode=recent';	// message.php?mode=recent&target=%s&start=%d&count=%d&sort=%d&col=%d
	
	var getchatlistcmd 		= 'chat.php?mode=list';
	var createchatcmd		= 'chat.php?mode=create2';		// chat.php?mode=create&invite=%d
	var joinchatcmd			= 'chat.php?mode=join';			// chat.php?mode=join?room=%d&action=%s
	var sendchatcmd			= 'chat.php?mode=send';			// chat.php?mode=send&room=%d
	var resvchatcmd			= 'chat.php?mode=receive';		// chat.php?mode=receive
	var iconuploadcmd		= 'icon.php';					
	var iconuploadtestcmd	= 'uploadtest.php';					
	var profcmd				= 'iam.php';
	var uploadfilecmd		= 'upload.php';
	var getvotelistcmd		= 'vote.php?action=list';
	var votecmd				= 'vote.php?action=vote';
	var getvoterankingcmd	= 'vote.php?action=rank';
	
	//デベロッパセンターの「ガジェットサーバのOAuthリクエスト検証」サンプル
	var authTestCmd = 'auth_test.php';
	
	/******************************************************
	 * ローカル変数定義
	 *****************************************************/	
	var SID;
	var UID;
	
	/******************************************************
	 * ローカルメソッド定義
	 *****************************************************/		
	var AddSID = function(){
		
		if ( !SID || SID == ''){
			SID = Ti.App.Properties.getString('SID');
		}
		if ( !UID || UID == ''){
			UID = Ti.App.Properties.getString('UID');
		}
		
		return '&ss='+SID + '&uu='+UID;
	};
	var SetSID = function(){

		if ( !SID || SID == ''){
			SID = Ti.App.Properties.getString('SID');
		}
		if ( !UID || UID == ''){
			UID = Ti.App.Properties.getString('UID');
		}
		
		return '?ss='+SID + '&uu='+UID;
	};

	/******************************************************
	 * グローバルメソッド定義
	 *****************************************************/
	/**
	 * サーバーのアドレス取得
	 */		
	 exports.GetServer = function(){
	 	
 		return ( serverSwitch && serverSwitch == 'dev')? devServer:demoServer;				
	 }
	/*
	 * サインアップ
	 * 
	 * 	data JSONエンコードは不要。オブジェクトのままで。
	 */
	exports.SignUp = function(data, onSuccess, onFail){
		comm.Post(BASE_URL+signupcmd, JSON.stringify(data), onSuccess, onFail);
	};
	
	/*
	 * ログイン
	 */
	exports.Login = function(id, onSuccess, onFail){
				
		comm.Get( BASE_URL+loginCmd+id,
			
			function( status, data ){
				
				if ( onSuccess ) onSuccess(status, data);
			},
			function(error){
				if ( onFail ) onFail(error);	
			}
		);
	};
		
/*
 * 	用途	電話帳送信			
 *  書式	telbook.php			
 *  				
 *  パラメータ名	値	内容		
 *  なし				
 *  				
 *  失敗				
 *  成功				
 *  				
 *  POSTデータ・フォーマット				
 *  				
 *  	[			
 *  必須		{		
 *  			NAME	名前
 *  			TEL	電話番号
 *  			ADDRESS	住所
 *  			MAIL	メールアドレス
 *  必須		}		
 *  		…		
 *  	]			
 */
	exports.SendTelbook = function(data, onSuccess, onFail){
		comm.Post(
			BASE_URL+telbookcmd+SetSID(),
			JSON.stringify(data),
			function(status, data){
				if (onSuccess) onSuccess(status, data);				
			},
			function(error){
				if (onFail) onFail(error);
			});
	};
	
/*
 * 用途	ユーザ情報取得/送信						

	data 		自分の座標。JSONエンコードは不要。オブジェクトのままで。
	onSuccess	通信が成功したときのコールバック（サーバからエラーを返されてたときもこちら。エラーコードを確認すること）
	onFail		通信そのものが失敗したときのコールバック
書式	users.php						
							
						
失敗							
成功	必須	COUNT	整数	取得件数			
		USERS	[				
	必須			{			
	必須				NAME	文字列	ユーザ名
	必須				ID	整数	ユーザID
	必須				AID	整数	アバターID
	必須				LALTITUDE	文字列	緯度
	必須				LONGITUDE	文字列	経度
	必須			}			
				…			
			]

POSTデータ・フォーマット				
				
	{			
必須		LALTITUDE	文字列	緯度
必須		LONGITUDE	文字列	経度
	}			
							
 */	
 	exports.updateUsers = function(data, onSuccess, onFail, flags){

		var flagsPrm;
		if ( flags === undefined ) 	flagsPrm = "";
		else						flagsPrm = '&flags='+flags; 		
		comm.Post(
			BASE_URL+userscmd+SetSID()+flagsPrm,
			JSON.stringify(data),
			function(status, data){
				if (onSuccess) onSuccess(status, data);				
			},
			function(error){
				if (onFail) onFail(error);
			});
 	};
 	/**
 	 * ロビー用ユーザー検索
 	 */
 	exports.updateUsersRobby = function(data, onSuccess, onFail, flags){
 		
		var flagsPrm;
		if ( flags === undefined ) 	flagsPrm = "";
		else						flagsPrm = '&flags='+flags;
		 		
		comm.Post(
			BASE_URL+usersrobbycmd+AddSID() + flagsPrm,
			JSON.stringify(data),
			function(status, data){
				if (onSuccess) onSuccess(status, data);				
			},
			function(error){
				if (onFail) onFail(error);
			});
 	};
 	/**
 	 * マップ用ユーザー検索
 	 */
 	exports.updateUsersMap = function(data, onSuccess, onFail, flags){
 		
		var flagsPrm;
		if ( flags === undefined ) 	flagsPrm = "";
		else						flagsPrm = '&flags='+flags;
		
		comm.Post(
			BASE_URL+usersmapcmd+AddSID() + flagsPrm,
			JSON.stringify(data),
			function(status, data){
				if (onSuccess) onSuccess(status, data);				
			},
			function(error){
				if (onFail) onFail(error);
			});
 	};
/*
 * 	用途	ユーザプロフィール取得				
 *  書式	whois.php?id=%d				
 *  					
 *  パラメータ名	値	内容			
 *  id	整数	対象ユーザID、省略した場合は自分			
 *  					
 *  失敗	NONE	存在しないユーザID			
 *  成功	必須	{			
 *  	必須		NAME	ユーザ名	
 *  	必須		ID	ユーザID	
 *  	必須		AID	アバターID	
 *  	必須		LALTITUDE	緯度	
 *  	必須		LONGITUDE	経度	
 *  			TEL	電話番号	
 *  			MAIL	メールアドレス	
 *  			ADDRESS	住所	
 *  			USERNAME	SIP用情報	
 *  			DOMAIN	SIP用情報	
 *  			PASSWORD	SIP用情報	
 *  			OUTBOUNDPROXY	SIP用情報	
 *  			AUTOREGISTRATION	SIP用情報	
 *  			SENDKEEPALIVE	SIP用情報	
 *  			PORT	SIP用情報	
 *  			RESERVED	SIP用情報	
 *  	必須	}			
 *  					
 *  どこまで必要なのか不明なので、詳細情報は暫定仕様とする。					
 * 
 */	 
	exports.WhoIs = function(id,onSuccess, onFail){
		
		comm.Get(
			String.format('%s%s?id=%s%s', BASE_URL, whoiscmd, id, AddSID()),
			function( status, data){
				
				if ( onSuccess ) onSuccess(status, data);
			},
			function(error){
				if ( onFail ) onFail(error);
		});
	};
	exports.WhoIsRobby = function(id,onSuccess, onFail){
		
		comm.Get(
			String.format('%s%s?id=%s%s', BASE_URL, whoisrobbycmd, id, AddSID()),
			function( status, data){
				
				if ( onSuccess ) onSuccess(status, data);
			},
			function(error){
				if ( onFail ) onFail(error);
		});
	};
	exports.WhoIsMap = function(id,onSuccess, onFail){
		
		comm.Get(
			String.format('%s%s?id=%s%s', BASE_URL, whoismapcmd, id, AddSID()),
			function( status, data){
				
				if ( onSuccess ) onSuccess(status, data);
			},
			function(error){
				if ( onFail ) onFail(error);
		});
	};

	exports.SendMessage = function(id, message, onSuccess,onFail ){
		comm.Post(
			BASE_URL+sendmsgcmd+AddSID(),
			JSON.stringify({TO:id,MESSAGE:message}),
			function(status, data){
				if (onSuccess) onSuccess(status, data);				
			},
			function(error){
				if (onFail) onFail(error);
			});		
	}
	exports.GetMessage = function(id, onSuccess,onFail ){
		comm.Get(
			BASE_URL+getmsgcmd+id+AddSID(),
			function(status, data){
				if (onSuccess) onSuccess(status, data);				
			},
			function(error){
				if (onFail) onFail(error);
		});
	}
	/*
	 * メッセージ一覧
	 * message.php?mode=recent&target=%s&start=%d&count=%d&sort=%d&col=%d
	 */
	exports.GetMessageList = function(target, start,count,sort,col, onSuccess, onFail ){
		comm.Get(
			BASE_URL+getmsglistcmd+String.format("&target=%s&start=%s&count=%s&sort=%s&col=%s",target,start,count,sort,col)+AddSID(),
			function(status, data){
				if (onSuccess) onSuccess(status, data);				
			},
			function(error){
				if (onFail) onFail(error);
		});
			
	}	
	// /**
	 // * ROOMの作成
	 // * @param {Object} members		参加するメンバーのIDの配列
	 // * @param {Object} onSuccess	通信成功時のコールバック（サーバー側のエラーもこちら）
	 // * @param {Object} onFail		通信失敗時のコールバック
	 // */
	// exports.CreateRoom = function( members, onSuccess, onFail ){
		 // comm.Post(
			// BASE_URL+createroomcmd+SetSID(),
			// function(status, data){
				// Ti.API.info("created Room");
// 				
				// if (onSuccess) onSuccess(status, data);
			// },function(error){
				// if (onFail) onFail(error);
			// }
		 // );
	// }

	exports.GetChatList = function(onSuccess, onFail){
		comm.Get(
			String.format('%s%s%s', BASE_URL, getchatlistcmd, AddSID()),
			function( status, data){
				
				if ( onSuccess ) onSuccess(status, data);
			},
			function(error){
				if ( onFail ) onFail(error);	
		});
	}
	
	exports.CreateChat = function(aids, onSuccess, onFail){
		var ids;
		
		ids = aids[0];
		
		// 参加メンバーが複数なら区切って追加
		if ( aids.length > 1){
			for(var i=1; i < aids.length; i++){
				ids +=','+aids[i];
			}
		}
		comm.Get(
			String.format('%s%s&invite=%s%s', BASE_URL, createchatcmd, ids, AddSID()),
			function( status, data){
				
				if ( onSuccess ) onSuccess(status, data);
			},
			function(error){
				if ( onFail ) onFail(error);	
		});
	}
	exports.JoinChat = function(roomId, onSuccess, onFail){
		comm.Get(
			String.format('%s%s&room=%s&action=in%s', BASE_URL, joinchatcmd, roomId, AddSID()),
			function( status, data){
				
				if ( onSuccess ) onSuccess(status, data);
			},
			function(error){
				if ( onFail ) onFail(error);	
		});
	}
	exports.ExitChat = function(roomId, onSuccess, onFail){
		comm.Get(
			String.format('%s%s&room=%s&action=out%s', BASE_URL, joinchatcmd, roomId, AddSID()),
			function( status, data){
				
				if ( onSuccess ) onSuccess(status, data);
			},
			function(error){
				if ( onFail ) onFail(error);	
		});
	}
	exports.InviteChat = function(roomId, userId, onSuccess, onFail){
		comm.Get(
			String.format('%s%s&room=%s&action=invite&user=%s%s', BASE_URL, joinchatcmd, roomId, userId, AddSID()),
			function( status, data){
				
				if ( onSuccess ) onSuccess(status, data);
			},
			function(error){
				if ( onFail ) onFail(error);	
		});
	}
	exports.SendChatMsg = function(roomId, message, onSuccess, onFail){
		comm.Post(
			String.format('%s%s&room=%s%s', BASE_URL, sendchatcmd, roomId, AddSID()),
			JSON.stringify({MESSAGE:message,MSGTYPE:0}),
			function( status, data){
				
				if ( onSuccess ) onSuccess(status, data);
			},
			function(error){
				if ( onFail ) onFail(error);	
		});
	}
	exports.SendChatFile = function(roomId, urls, onSuccess, onFail, msgtype){
		
//		Ti.API.info( "動画ファイルPOST "+JSON.stringify(urls) );
//		Ti.API.info("エンコードテスト "+ JSON.stringify({MESSAGE:urls.URL, MSGTYPE:1}));

		if (msgtype == undefined ) msgtype = 1;
		 
		comm.Post(
			String.format('%s%s&room=%s%s', BASE_URL, sendchatcmd, roomId, AddSID()),
			JSON.stringify({MESSAGE:urls, MSGTYPE:msgtype}),
			function( status, data){
				
				if ( onSuccess ) onSuccess(status, data);
			},
			function(error){
				if ( onFail ) onFail(error);	
		});
	}
	exports.SendChatStamp = function(roomId, stampName, onSuccess, onFail){
		comm.Post(
			String.format('%s%s&room=%s%s', BASE_URL, sendchatcmd, roomId, AddSID()),
			JSON.stringify({MESSAGE:stampName,MSGTYPE:2}),
			function( status, data){
				if ( onSuccess ) onSuccess(status, data);
			},
			function(error){
				if ( onFail ) onFail(error);	
		});
	}
	/*
	 * 用途	チャットメッセージ受信					
	 * 書式	chat.php?mode=receive					
	 * 						
	 * パラメータ名	値	内容				
	 * なし						
	 * 						
	 * 失敗	403	参加していないルーム				
	 * 成功	NONE	データがない場合				
	 * 	必須	[				
	 * 	必須		{			
	 * 	必須			ROOM	整数	チャットルームID
	 * 	必須			FROM	整数	送信者ID
	 * 	必須			MESSAGE	文字列	メッセージ内容
	 * 	必須			MSGTYPE	整数	メッセージカテゴリ
	 * 	必須		}			
	 * 			…			
	 * 	必須	]				
	 * 						
	 * タイマでの非同期受信を行うためのインターフェース。						
	 * レスポンスデータ形式についてはストリーム受信と共通なので、解析・クライアントへの反映は共通化するのが望ましい。						
	 */
	exports.ResvChat = function(onSuccess, onFail){
		comm.Get(
			String.format('%s%s%s', BASE_URL, resvchatcmd, AddSID()),
			function( status, data){
				if ( onSuccess ) onSuccess(status, data);
			},
			function(error){
				if ( onFail ) onFail(error);	
			}, false
		);
	}
	exports.UploadIcon = function(image, onSuccess, onFail){
				
		comm.Post(
			String.format('%s%s%s', BASE_URL, iconuploadcmd, SetSID()),
			{iconfile:image},
			function( status, data){
				if ( onSuccess ) onSuccess(status, data);
			},
			function(error){
				if ( onFail ) onFail(error);	
			},
			true
		);
	}
	exports.UploadIconTest = function(image, onSuccess, onFail){
				
		comm.Post(
			String.format('%s%s%s', BASE_URL, iconuploadtestcmd, SetSID()),
			{iconfile:image},
			function( status, data){
				if ( onSuccess ) onSuccess(status, data);
			},
			function(error){
				if ( onFail ) onFail(error);	
			},
			true
		);
	}

	/*
	 * ユーザ情報設定		
	 * iam.php		
	 * 	postDataは連想配列で渡す。このメソッドの中でJSONエンコードされる。	
	 * 値	内容	
	 * {		
	 * 	AID	アバターID
	 * 	NAME	名前
	 * 	FIRST	名
	 * 	LAST	姓
	 * 	ZIPCODE	郵便番号
	 * 	ADDRESS	住所
	 * 	MAIL	メールアドレス
	 * 	URL	ホームページ
	 * 	BIRTH	生年月日
	 * }		
	 * 
	 */
	exports.UpdateProf = function(postData, onSuccess, onFail){
		
		comm.Post(
			String.format('%s%s%s', BASE_URL, profcmd, SetSID() ),
			JSON.stringify(postData),
			function( status, data){
				if ( onSuccess ) onSuccess(status, data);
			},
			function(error){
				if ( onFail ) onFail(error);	
			}
		);		
	}
	exports.UploadFile = function( fileUrl, onSuccess, onFail){
				
		comm.Post(
			String.format('%s%s%s', BASE_URL, uploadfilecmd, SetSID()),
			{mediafile:fileUrl},
			function( status, data){
				try{
					if ( onSuccess ) onSuccess(status, data);					
				}catch(e){
					if ( onFail ) onFail("error");						
				}
			},
			function(error){
				if ( onFail ) onFail(error);	
			},
			true
		);
	}
	/**
	 * 指定イベントへ投票
	 * @param {Object} eventId
	 * @param {Object} onSuccess
	 * @param {Object} onFail
	 */
	exports.Vote = function(eventId, id, onSuccess, onFail){
		
		comm.Get(
			String.format('%s%s&event=%s&id=%s%s', BASE_URL, votecmd, eventId, id, AddSID()),
			
			function( status, data ){
				
				if ( onSuccess ) onSuccess(status, data);
			},
			function(error){
				if ( onFail ) onFail(error);	
			}
		);		
	}
	/**
	 * 投票イベント列挙
	 * @param {Object} onSuccess
	 * @param {Object} onFail
	 */
	exports.GetVoteList = function(onSuccess, onFail){
		comm.Get( 
			String.format('%s%s%s', BASE_URL, getvotelistcmd, AddSID()),
			
			function( status, data ){
				
				if ( onSuccess ) onSuccess(status, data);
			},
			function(error){
				if ( onFail ) onFail(error);	
			}
		);				
	}
	/**
	 * 投票ランキング取得
	 * @param {Object} eventId
	 * @param {Object} onSuccess
 	 * @param {Object} onFail
	 */
	exports.GetVoteRanking = function(eventId, onSuccess, onFail){
		comm.Get(
			String.format('%s%s&event=%s%s', BASE_URL, getvoterankingcmd, eventId, AddSID()),
			
			function( status, data ){				
				if ( onSuccess ) onSuccess(status, data);
			},function(error){
				if ( onFail ) onFail(error);	
			}
		);		
	}
