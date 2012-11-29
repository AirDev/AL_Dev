/*
 * ユーザー一覧（フレンドリストや、特定条件のリスト表示など内容は色々
 */

	Ti.UI.orientation = Ti.UI.PORTRAIT;

	/******************************************************
	 * Require定義
	 * 		Androidでは重複読み込みはスキップされるがiOSでは毎回読み込まれるので挙動が違う(ver2.1.2).
	 * 		なのでワークの初期化などは注意。
	 *****************************************************/	
	var subWin 	= require('app/ui/contact');
	var reload = require('app/ui/filterwin');

	/******************************************************
	 * 固定定義
	 *****************************************************/	
	/******************************************************
	 * ローカル変数定義
	 *****************************************************/
//	var robbyUsers;

	var subStat = false;
	var updateLocateEnable = true;
	
	var mainWin = Ti.UI.currentWindow;
	var app = mainWin.app;
		
	var tv = Ti.UI.createTableView({
	
//			borderColor:	'#0000ff',
//			backgroundImage:	'/images/tableview/brown_bg_482.png',
			backgroundColor:	'transparent',
//			data:data,
//			separatorStyle:Ti.UI.iPhone.TableViewSeparatorStyle.NONE,
			editable: 		true,
			top:			0,
			bottom:			0
	});

	mainWin.add(tv);
	
	/******************************************************
	 * ローカルメソッド定義
	 *****************************************************/		
	var makeRow = function(d, touch){

		// タッチの可不可が指定されていなければデフォルトは可
		if ( touch == undefined ) touch = true;

		var scale = app.wrk.GetScale();
		
		var iv = Ti.UI.createImageView({
			left:	1,
			width:	100*scale,
			height:	100*scale,
			image:	'http://'+d.ICON + "?" + new Date().getTime(),						
		});
							
		var label = Ti.UI.createLabel({
			left:	102*scale,
			font:{fontSize:36*scale, fontWeight:'bold'},
			text:	d.NAME,
			color:	'#000000'
		});
										
		var row = Ti.UI.createTableViewRow({
	        className: 		'row',
//	        objName: 		'row',
	        objName: 		''+d.ID,
	   		touchEnabled: 	touch
		});
							
		row.add(label);
		row.add(iv);
		
		return row;	
	}
	/*
	 * 自身の位置情報を渡してロビーに表示するメンバーを取得、テーブルビューを更新
	 */
	var updateUsers = function(lati,longi, onSuccess, onFail){
		
		var uid = app.wrk.GetUID();
		
		app.ind.setText("リスト更新中……");
		
		// ユーザー自身のデータ取得
		app.connect.WhoIs(
			uid,
			function(status, data){
				if ( data.RESPONSE ){
					Ti.App.Properties.setString('MYDATA', JSON.stringify(data.RESPONSE));
					
					app.wrk.SetMyData(data.RESPONSE);
				}
				// リストを取得
				app.connect.updateUsersRobby(
					{ LALTITUDE:lati, LONGITUDE:longi },
					function(status, data){
						var scale = app.wrk.GetScale();
						var raws = [];
						var row;
						var users;
						
						users = data.RESPONSE.USERS;
						
						app.wrk.SetRobbyUsers(users);
						
						// 自分用の見出しをセット
						row = Ti.UI.createTableViewRow({
							backgroundColor:	'#3333cc',
							text:				"自分",
					   		touchEnabled: 		false
						});						
						raws.push( row );
						
						// 自分の情報をセット
						raws.push(makeRow(app.wrk.GetMyData(), false));
						
						// 検索結果の見出し
						row = Ti.UI.createTableViewRow({
							backgroundColor:	'#3333cc',
							text:				"検索結果",
					   		touchEnabled: 		false
						});						
						raws.push( row );
						
//						app.wrk.SetRobbyUsers(users);
						
						// 検索結果を全て登録			
						if ( users && users.length > 0 ){
							users.forEach(function(u){
								
								// 検索対象なら登録
								if ( IsMatch(u) ){
									raws.push(makeRow(u));									
								}
							});
						}
						tv.setData(raws);
	
						// 項目をタッチしたときのイベント登録
						tv.addEventListener('click', function(e){
							
							if ( !subWin.isActive() ){
								
								// ユーザー自身（０と２は見出し）
								if ( e.index == 0){
									
									subWin.setActive(true);						
									reload.createWindow(
										1,
										app,
										updateLocate,
										"",
										function(){
											subWin.setActive(false);
										},
										function(){
											subWin.setActive(false);
										}
									);
								}else if ( e.index == 1){
									subWin.setActive(true);						
									
//									var prof = require('app/main/prof');
									app.prof.createWindow(app);
									app.prof.addEventListener('close',function(){
										subWin.setActive(false);
									});
								}else if ( e.index == 2){
									
									subWin.setActive(true);						
									reload.createWindow(
										0,
										app,
										updateLocate,
										"",
										function(){
											subWin.setActive(false);
										},
										function(){
											subWin.setActive(false);
										}
									);
								}else if ( e.index >= 3){
									
//									Ti.API.info("選択 "+e.rowData.objName );
									
//									var users = app.wrk.GetRobbyUsers();
							
									subWin.setActive(true);						
									subWin.createWindow( app.wrk.GetRobbyUser(e.rowData.objName), app );	// 自分とインデックス分差し引く
									
									subWin.addEvent('close', function(){
										subWin.setActive(false);
									});									
								}
							}
						});
						app.ind.hide();
						if (onSuccess) onSuccess();
						
						UpdateLocateEnable(true);				
					},function(error){
						app.ind.hide();
						alert('Robby list error '+JSON.stringify(error)	);
						
						if (onFail) onFail();					
						UpdateLocateEnable(true);				
					},
					app.wrk.GetRobbyMatchData()
				);
			},function(error){
				
				app.ind.hide();
				
				alert('ユーザーデータを取得できませんでした '+uid );
				
				if (onFail) onFail();
				
				UpdateLocateEnable(true);				
			},
			app.wrk.GetRobbyMatchData()
		);
	};
	var updateLocate = function(onSuccess, onFail){
				
		if ( !app.geo.GetCurrentPosition(
			function(data){
				updateUsers( data.latitude, data.longitude, onSuccess, onFail );
			},
			function(error){
				Ti.API.info('GPS not working. '+error);
				updateUsers(0,0, onSuccess, onFail);
			}
		)){
			updateUsers(0,0, onSuccess, onFail);		
		}		
	};
	var UpdateLocateEnable = function(b){
		updateLocateEnable = b;
	}
	var IsUpdateLocateEnable = function(){
		return updateLocateEnable;
	}
	/**
	 * 検索条件に合っているかチェック
	 */
	var IsMatch = function(user){
		
		var age = app.common.GetAgeFromBirth(user.BIRTH);
		var range = app.wrk.GetAgeRange();
		
//		Ti.API.info("age "+age + " range "+JSON.stringify(range));
		
		if ( age >= range.LOW && age <= range.HIGH ){
			
			return true;
		}
		return false;
	}
	/******************************************************
	 * 読み込まれたときに実行される処理
	 *****************************************************/		
	updateLocate();
	 
	// ロビーに入るとき、座標が更新できるならやる
	// シェイクのイベント設定
	
	Ti.Gesture.addEventListener('shake',function(e)
	{
		if ( IsUpdateLocateEnable() ){
			UpdateLocateEnable(false);
			Ti.API.info("shake!!");
		
			updateLocate();			
		}
	});
