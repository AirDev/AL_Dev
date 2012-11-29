/*
 * グローバルワーク管理
 * 
 */	 	
 	var masterData = require('app/main/masterData');

 	exports.dummyIcon = [
 		'char_denpen.png',
 		'char_onatsu.png',
 		'char_oyaji.png',
 		'char_punio.png',
 		'char_riku.png',
 		'char_saki.png',
 		'char_suzuki.png',
 		'char_tsuru_1.png',
 		'char_yankee.png',
 		'char_yen.png'
 	];
 	
// 	exports.userName;
// 	exports.password;
// 	exports.domain;
// 	exports.sipEnable = false;

 	exports.sipclient = null;
 	
//	var matchdata = "";					// プレイヤーマッチングフィルタ情報
	var robbyMatchdata = "";			// ロビー検索用マッチングフィルタ
	
	var ageLow = 1;
	var ageHigh = 99;
	
	var robbyUsers;						// ロビーのユーザー情報（フィルタを掛けたもの）
		
	var SID;							// サーバーから与えられたセッションＩＤ
	var UID;							// サーバーから取得したユーザーＩＤ
	
	var myData;				// whoisで取得した自分のデータ
	var rooms = [];
	
	// 画面のサイズ（基本縦持ち）
	var stageWidth 	= Ti.Platform.displayCaps.platformWidth;
	var stageHeight = Ti.Platform.displayCaps.platformHeight;
	var	scaleWidth	= stageWidth/480;
	
	// 保存してあるSID,UIDから読み込む（なかったらNULLのまま）
	SID	= Ti.App.Properties.getString('SID');
	UID	= Ti.App.Properties.getString('UID');
	myData = JSON.parse(Ti.App.Properties.getString('MYDATA'));
		
//	exports.userName 	= Ti.App.Properties.getString('userName');
//	exports.password 	= Ti.App.Properties.getString('password');
//	exports.domain		= Ti.App.Properties.getString('domain');
			
	Ti.API.info('screen size '+stageWidth + ' / '+stageHeight + " scale:"+scaleWidth );
	
	/**
	 * 画面のサイズ取得
	 */
	exports.GetScreenSize = function(){
		return{width:stageWidth,height:stageHeight};
	}
	exports.GetIconImageView = function(image){
		// 未作成（不要？）	
	}
	exports.GetScale = function(){
		return scaleWidth;
	}

 	/*
 	 * ロビーのユーザー一覧
 	 */
	exports.SetRobbyUsers = function(users){
		robbyUsers = users;
	}
	exports.GetRobbyUsers = function(){
		return robbyUsers;	
	}
	exports.GetRobbyUser = function(id){
		
		for(var i=0;i<robbyUsers.length; i++ ){
			if ( robbyUsers[i].ID == id) return robbyUsers[i];	
		}
		
		return null;	
	}
			
	exports.SetMyData = function(data){
		myData = data;
		
		// 性別が未設定の場合、判断情報があれば設定する。
		if (myData.GENDER == 0 ){
			if ( myData.FLAGS !== undefined ){
				if ( myData.FLAGS[3] == '1') 	myData.GENDER = 1;
				else							myData.GENDER = 2;
			}
		}	
	};
	exports.GetMyData = function(){
		return myData;
	}
	exports.GetUID = function(){
		return UID;
	}
	exports.GetSID = function(){
		return SID;
	}
	exports.SetSID = function(id){
		SID = id;
	}
	exports.SetUID = function(id){
		UID = id;
	}
	/**
	 * ROOMリスト。
	 * 	他のユーザーと会話する為の部屋
	 * 	チャットルーム関係はルームリストなどが必要か。
	 */

	exports.SetRooms = function(data){
		rooms = data;
	}
	exports.GetRooms = function(){
		return rooms;		
	}
	exports.SaveRooms = function(){
		Ti.App.Properties.setString('rooms.txt', JSON.stringify(rooms));	
	}

	exports.LoadRooms = function(){
		var file = Ti.App.Properties.getString('rooms.txt');
		
		if ( file ){
			rooms = JSON.parse(file);
			Ti.API.info('Talk Room Data読み込み完了。部屋数 '+rooms.length);			
		}else{
			Ti.API.info('Talk Room Data読み込みエラー');			
			
			alert('Talk Room Data 読み込みエラー');
		}
	}
	/**
	 * ROOMの追加
	 * @param {Object} id
	 * @param {Object} data
	 */
	exports.AddRoom = function(roomId, data ){
		
		var members = JSON.stringify( data );
		
		rooms.push({'id':roomId,'members':members});
	}
	/**
	 * ROOMの削除
	 * @param {Object} roomId
	 */
	exports.RemoveRoom = function(roomId){
		// 未作成	
	}
	
	exports.SetMatchData = function(str){
		myData.FLAGS = str;
	}
	exports.GetMatchData = function(){
		return (myData.FLAGS === undefined)? '1111111111':myData.FLAGS;
	}
	exports.SetRobbyMatchData = function(str){
		robbyMatchdata = str;
	}
	exports.GetRobbyMatchData = function(){
		return (robbyMatchdata == '' )? '1111111111':robbyMatchdata;
	}
	
	exports.SetAgeRange = function(l, h){
		ageLow 	= l;
		ageHigh = h;
		
		// 年齢幅に矛盾がある場合は補正
		if ( ageLow > ageHigh ) ageLow = ageHigh;
	}
	exports.GetAgeRange = function(){
		
		return {LOW:ageLow, HIGH:ageHigh};
	}
	