
	var list 	= require('app/ui/list');
	var connect = require('app/comm/connect');
	var wrk		= require('app/main/work');
	var ind		= require('app/main/indicator');

	//Ti.UI.orientation = Ti.UI.PORTRAIT;

	var scale = wrk.GetScale();
	var myData = wrk.GetMyData();
	var mainWin;
	var voteEnable = true;
	var myProf;
	var profs;
	var rankingTable;
	var rankData;

	var videoPlayer = Titanium.Media.createVideoPlayer({
	    top : 				2,
	    left:				2,
	    autoplay : 			true,
	    backgroundColor : 	'blue',
	    height : 			300*scale,
	    width : 			300*scale,
	    mediaControlStyle : Titanium.Media.VIDEO_CONTROL_DEFAULT,
	    scalingMode : 		Titanium.Media.VIDEO_SCALING_ASPECT_FIT
	});

/*
 * 	data	自分のデータ
 * 		ID			ID
 * 		NAME		名前
 * 		ICON		顔写真ＵＲＬ
 * 		VIDEOURL	紹介ビデオＵＲＬ
 * 		PROFTEXT	紹介プロフィールテキスト
 *
 * 	datas		全員のデータ
 * 	rankDatas	ランキングデータ
 * 	rankId		 
 */
exports.createInformationWindow = function(data, datas, rankDatas, rankId){

	myProf 		= data;
	profs		= datas;
	rankData	= getRankData(myProf.ID, rankDatas);
	
//	Ti.API.info("自分のランキングデータ "+rankId+" "+JSON.stringify(rankData));

	mainWin = Ti.UI.createWindow({
//		backgroundImage:	'/images/corkboard.jpg',
		backgroundColor:	'#cc9900'
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
	 
	rankingTable = Ti.UI.createTableView({
					headerTitle:	"ランキング",
					top:			(410-80)*scale,
					left:			200*scale,
					right:			2*scale,
					bottom:			80*scale
					
	});
	rows = makeRows(rankDatas, profs);
			
	rankingTable.setData(rows);
	
	var prof = Ti.UI.createScrollView({
		top:			2+(0)*scale,
//		top:			0,
		left:			300*scale,
//		hight:			200*scale,		
		contentWidth:	'auto',
		contentHeight:	'200dp',
		showVerticalScrollIndicator:true
		
	});	
	// var view = Ti.UI.createView({
		// backgroundColor:'#336699',
		// borderRadius:10,
		// width:150,
// //		left:	300*scale,
// //		right:	2,
		// height:200*scale,
// //		top:10
	// });

	var profText = Ti.UI.createLabel({
		font:	{fontSize:18*scale, fontWeight:'bold'},
		backgroundColor:'#336699',
		borderRadius:10,
//		top:	2+(80)*scale,
//		left:	300*scale,
//		hight:	200*scale,
		top:2,
		hight:	'auto',
		color:	'#000000',
		text:	data.PROFTEXT			
	});
//	view.add(profText);
	prof.add(profText);
	
	var face	= Ti.UI.createImageView({
		top:	2+(300+10)*scale,
		left:	2,
		width:	100*scale,
		hight:	100*scale,
		image:	data.ICON
	});	
	var name	= Ti.UI.createLabel({
		top:	2+(300+10+100)*scale,
		left:	2,				
		font:	{fontSize:36*scale, fontWeight:'bold'},
		color:	'#000000',
		text:	data.NAME		
	});
	var alpoint	= Ti.UI.createLabel({
		color:	'#000000',
		bottom:		100,
		left:		2,
		text:		'残りポイント '+myData.POINT
	});
	var voteBtn	= Ti.UI.createButton({
		font:	{fontSize:40*scale, fontWeight:'bold'},
		bottom:		2,
		left:		1,
		height:		80*scale,
		title:		'投票'	
	});
	var backBtn = Ti.UI.createButton({
		font:	{fontSize:40*scale, fontWeight:'bold'},
		bottom:		2,
		right:		1,
		height:		80*scale,
		title:		'もどる'			
	});
	backBtn.addEventListener('click', function(e){
		videoPlayer.stop();
		mainWin.close();
		
		Ti.App.fireEvent('prof_close');
	})
	voteBtn.addEventListener('click', function(e){

		ind.setText("投票処理中……");
				
		if ( voteEnable ){
			connect.Vote(rankId, rankData.ID,
				function(status, data){
					ind.hide();
					switch(data.RESULT){
						case 'OK':
							
							alert("投票完了");
							
							myData.POINT = data.RESPONSE.POINT;
							alpoint.text = "残りポイント "+data.RESPONSE.POINT;
							
							// 最新ランキング取得
							connect.GetVoteRanking(rankId,
								function(status,data){
								
								// ランキングを再表示
								//表示用所持ポイント数更新
								var rows = makeRows(data.RESPONSE, profs);
								rankingTable.setData(rows);
							
								},function(error){
									
								}
							);	
							break;
						case 'CLOSE':
							alert('投票期間は終了しました');
							break;
						case 'POINT':
							alert('ポイントが不足しています');
							break;
					}
				},function(error){
					ind.hide();					
				}
			);	
		}	
	});
	
 	videoPlayer.url = ( data.VIDEOURL != '')? 'http://'+data.VIDEOURL:'http://'+rankData.VIDEO;
	
	mainWin.add(alpoint);
	mainWin.add(name);
	mainWin.add(face);
	mainWin.add(prof);	
	mainWin.add(rankingTable);
	mainWin.add(voteBtn);
	mainWin.add(backBtn);

	mainWin.open();	
	
	mainWin.add(videoPlayer);
}
var closeWindow = function(){
	
}

var makeRows = function(rankDatas, datas){
	var rows = [];
	var ranking = [];
//	var voteList;
	var no = 1;	
	var scale = wrk.GetScale();
		
	ranking = rankDatas;
//	voteList = wrk.GetVoteList();	
//	Ti.API.info(JSON.stringify(voteList));
	
	ranking.forEach(function(r){
				
		try{
			// BREAKが使えないので例外で出す。
			if ( no > 10) throw false;
			
			data = getProf(r.ID, datas);
		
			var rank = Ti.UI.createLabel({
				left:	0,
				color:	'#000000',
				font:	{fontSize:22*scale, fontWeight:'bold'},
				text:	String.format('%2d.',r.RANK)
			});
			var name = Ti.UI.createLabel({
				left:	22*scale*2,
				color:	'#000000',
				font:	{fontSize:28*scale, fontWeight:'bold'},
				text:	data.NAME
			});
			var score = Ti.UI.createLabel({
				right:	5,
				color:	'#000000',
				font:	{fontSize:22*scale, fontWeight:'bold'},
				text:	r.POINT
			});

			var row = Ti.UI.createTableViewRow({
//				color:	'#000000',
//				text:	data.NAME
			});
		
			row.add(rank);
			row.add(name);
			row.add(score);
			rows.push(row);
			
			no++;
			
		}catch(e){
			
		}
	});
	
	return rows;	
}
var getProf = function(id, data){
	
	for ( var i=0; i<data.length; i++){
		if ( data[i].ID == id ) return data[i];
	}
	
	return null;
}
/**
 * 
 * @param {Object} id
 * @param {Object} rankData
 * 
 * 
 * RANK	整数	ランク
POINT	整数	ポイント
ID	整数	投票先ID
NAME	文字列	名前
DESC	文字列	詳細
URL	文字列	メディアURL
 */
var getRankData = function(id, rankDatas){
	
	Ti.API.info("ID "+id+" rank "+rankDatas );
	
	for(var i=0; i < rankDatas.length; i++ ){
		if ( rankDatas[i].ID == id) return rankDatas[i];
	}
	
	return null;
}

	// var SortByVote = function(rankDatas){
// 				
		// rankDatas.sort(function(a,b){
			// if (a.COUNT < b.COUNT) 		return 1;
			// else if (a.COUNT > b.COUNT) return -1;
			// return 0; 
		// });
// 		
// //		Ti.API.info('ソート結果 '+JSON.stringify(r));
		// return r;
	// }

