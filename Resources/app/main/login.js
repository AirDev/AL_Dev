/*
 * ログイン
 */

//	var connect 	= require('app/comm/connect');
// 	var wrk			= require('app/main/work');
//	var ind			= require('app/main/indicator');
// 	
//	if(Ti.Platform.osname == 'android'){
//		var sipclient 	= require('jp.co.aircast.module');
//	}else{
//		var sipclient 	= require('me.takus.ti.voip');		
//	}		
	
 	var myProf;
 	var isFirstTime = true;
	var app;
	
 	// ローカルにユーザデータがあるか確認
//	Ti.App.Properties.removeProperty('myprof.txt');
	exports.createLogin = function(apps, onSuccess, onFail){
	
		app = apps;
			
		var json = Ti.App.Properties.getString('myprof.txt');
	
		// ローカルにデータが無い場合はサインアップ
		if ( !json ){
			
			app.ind.hide();
			
			Ti.API.info("ローカルにユーザーファイル無し.");
		
			// サインアップ処理	
			var signup = require('app/main/signup');
		
			// サインアップ成功時の処理登録
			signup.addSuccess(function(){
				
				app.ind.setText('ログイン中‥‥');
//				alert('SignIn Success');
				Ti.API.info("Signup complete.");
					
				json = Ti.App.Properties.getString('myprof.txt');
				exec(json, onSuccess, onFail);		
			});
			// サインアップ失敗時の処理登録
			signup.addFail(function(error){
				
				app.ind.hide();
				
				alert('SignIn Fail. ' +error);	
			});
			signup.Open();
							
			// すでにサーバー上にあったらログインへ	
		
			// サインアップが正常に完了したらログインへ
		}else{
			Ti.API.info("ユーザーファイル有り." + json);
			exec(json, onSuccess, onFail);
		}
		
	}
		/*
		 * ログイン処理本体
		 */
		var exec = function(_json, onSuccess, onFail){
			
			myProf = JSON.parse(_json);
			
			// ログイン処理
			app.connect.Login(
				
				myProf.number,
				function(status, data){
					
					switch(data.RESULT){
					case 'OK':
					case 'COLLISION':	// 使用中のID
						Ti.API.info('ログイン成功');

						Ti.App.Properties.setString('SID', data.RESPONSE.SID);
						Ti.App.Properties.setString('UID', data.RESPONSE.UID);
						
						app.wrk.SetSID(data.RESPONSE.SID);
						app.wrk.SetUID(data.RESPONSE.UID);
						
						//ログインが正常終了したらトップ画面へ
						if(onSuccess) onSuccess(status, data);
						
						// SIPのレジスト実行					
						whois(data.RESPONSE.UID);
						break;
						
					case 'IGNORED':		// 無効化されたID
					case 'NONE':		// 存在しないID
						Ti.API.info('IDが存在しないか無効だったのでファイルを削除');
						Ti.App.Properties.removeProperty('myprof.txt');
						if(onFail) onFail(data);
						break;
					}
				},
				function(error){
					app.ind.hide();
					alert("ログインに失敗しました "+error );
					
					//ログインがエラーならトップ画面へ
					if(onFail) onFail(error);
				}
			);
		}
		
	exports.GetMyProf = function(){
		return myProf;
	}

	var whois = function(uid){
		
		app.connect.WhoIs(
			uid,
			function(status, data){
				if ( data.RESULT == 'OK' && data.RESPONSE ){

//					var sip;					
					var userName 	= data.RESPONSE.USERNAME;
					var password	= data.RESPONSE.PASSWORD;
					var domain		= data.RESPONSE.DOMAIN;
//					if(domain == null) domain = '54.248.91.191';
					if(domain == null) domain = app.connect.GetServer();
					
//					Ti.App.Properties.setString('userName', userName);
//					Ti.App.Properties.setString('userName', password);
//					Ti.App.Properties.setString('userName', domain);
					
					if ((userName === null || password === null || domain === null) || 
						(userName.length <= 0 || password.length <= 0 || domain.length <= 0))
					{
						Titanium.API.info("enter password or userName");
						return;
					}
					
					Ti.App.Properties.setString('MYDATA', JSON.stringify(data.RESPONSE));
					app.wrk.SetMyData(data.RESPONSE);

					if(Ti.Platform.osname == 'android'){
						try{
//							wrk.sipClient = sipclient.createSipdroid({
		    				app.wrk.sipclient = app.sipclient.createALModule({
	   	 						password:		password,
					    		username:		userName,
					    		server:			domain,
						    	TextReceived:	onTextReceivedFunc,
		    				});
						    app.wrk.sipclient.regist();
						    
//						    wrk.sipClient = sip;
	    					Titanium.API.info("register success");						    
					    }catch(e){
	    					Titanium.API.info("register error " + e);
	  				 	}
	  				 }else{
	  				 	// iphoneの場合
	  				 }
				}
			},
			function(error){
			}
		);
	}
	
	//メッセージ受信時のコールバック
	function onTextReceivedFunc(e)
	{
		app.connect.ResvChat(
			function(status, data){
					
				// メッセージが受信されたか？
				if ( data.RESULT && data.RESULT == 'OK' ){
					
					// メッセージがあれば該当ログへ追記（複数の可能性有り）
					Ti.API.info("新着チャットメッセージ有り");
					
					// イベントも発行しておく
					Ti.App.fireEvent('chat_receive', { data:data.RESPONSE });
				}
			},
			function(error){
			}
		);
	
//		alert(" from = " + e["from"] + "¥n message = " + e["message"]);
	}
