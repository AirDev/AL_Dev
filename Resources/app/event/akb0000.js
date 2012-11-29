	/******************************************************
	 * 投票システムサンプル
	 *****************************************************/	



	/******************************************************
	 * Require定義
	 * 		Androidでは重複読み込みはスキップされるがiOSでは毎回読み込まれるので挙動が違う(ver2.1.2).
	 * 		なのでワークの初期化などは注意。
	 *****************************************************/	
	var list 		= require('app/ui/list');
	var wrk			= require('app/main/work');
	var akbProf		= require('app/event/akb0000prof');
	var masterData 	= require('app/main/masterData');
	var connect		= require('app/comm/connect');
	
	Ti.UI.orientation = Ti.UI.PORTRAIT;

	var profs = masterData.masterProfs;
		
	var selectEnable = true;

	 var mainWin = Ti.UI.createWindow({
		backgroundImage:	'/images/corkboard.jpg',
		navBarHidden: 		false
	 });
	// 変更可能な向き
	mainWin.orientationModes = [
        Titanium.UI.PORTRAIT,
//      Titanium.UI.UPSIDE_PORTRAIT,
//      Titanium.UI.LANDSCAPE_LEFT,
//      Titanium.UI.LANDSCAPE_RIGHT,
//      Titanium.UI.FACE_UP,
//      Titanium.UI.FACE_DOWN
	];

	// var mainWin = Ti.UI.currentWindow;	
	// mainWin.setBackgroundImage('/images/corkboard.jpg');
	
	var mainList = list.createList(mainWin);
	
	var scale = wrk.GetScale();
	
	var rows = [];
//	var rankingId;
	
	connect.GetVoteList(
		function(statis, data){
			if ( data.RESULT == 'OK' && data.RESPONSE.length > 0){
				
				// とりあえず一番前の投票データを使う
				var rnk = data.RESPONSE[0];
//				rankingId = rnk.ID;
								
				connect.GetVoteRanking(
					rnk.ID,
					function(status,data){
						setList(data.RESPONSE, rnk.ID );						
					},function(error){
						alert("通信エラー ");
						mainWin.close();										
					});
			}else{
				alert("通信エラー ");
				mainWin.close();				
			}			
		},function(error){
			Ti.API.info("投票一覧取得エラー "+error);
			alert("通信エラー ");
			mainWin.close();
		}
	)
	/*
	 * リストの作成
	 */
	var setList = function(rnk, rId){
	
		profs.forEach(function(prof){
		
//			Ti.API.info(JSON.stringify(prof));
		
			var face = Ti.UI.createImageView({
			
				left:	2,
				width:	100*scale,
				height:	100*scale,
				image:	prof.ICON
			});
				
			var label = Ti.UI.createLabel({
				left:	2+face.width,
				font:	{fontSize:36*scale, fontWeight:'bold'},
				text:	prof.NAME,		
				color:	'#000000'
			});
			var row = Ti.UI.createTableViewRow({
//	    	    className: 		'row',
//	       		 objName: 		'row',
       			touchEnabled: 	true
			});
			row.add(label);
			row.add(face);
			rows.push(row);
		});
		list.setData(mainList, rows);
	
		list.addEventListener(
			mainList,
			function(e){
				if ( selectEnable ){
					
					selectEnable = false;
				
					akbProf.createInformationWindow(profs[e.index], profs, rnk, rId );
					Ti.App.addEventListener('prof_close', function(){
						selectEnable = true;
					});
				}
			}
		);
	}
	
	var backBtn = Ti.UI.createButton({
		font:	{fontSize:40*scale, fontWeight:'bold'},
		bottom:		2,
		right:		1,
		height:		80*scale,
		title:		'もどる'			
	});
	backBtn.addEventListener('click', function(e){
		mainWin.close();
		
		if ( Ti.Platform.osname === "android" ){
			Ti.Android.currentActivity.finish();
		}
//		Ti.App.fireEvent('prof_close');
	})

	mainWin.add(backBtn);
	Ti.UI.currentTab.open(mainWin); //ここを変更
