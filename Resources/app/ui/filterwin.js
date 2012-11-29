/*
 * 検索条件入力ウィンドウ
 */
var app;
var scale;
var myWin;
var switch0;
var switch1;
var switch2;
var switchMale;
var switchFemale;
var switch5;
var switch6;
var switch7;
var switch8;
var switch9;
var mode;
var updateLocate;

var ageLow;
var ageHigh;
var agePicker;
var agePicker2;

// 年齢幅選択用固定データ
var age 		= [1,18,20,30,40,50,60,70];
var fromAges 	= ['１８歳未満', '１８歳以上', '２０歳以上', '３０歳以上', '４０歳以上', '５０歳以上', '６０歳以上', '７０歳以上'];
var endAges 	= ['１８歳未満', '１８歳以下', '２０歳以下', '３０歳以下', '４０歳以下', '５０歳以下', '６０歳以下', '７０歳以下'];
var midAges 	= ['〜'];

/*
 * 項目の作成（Android専用？）
 * 		kitchensink spinner_text2.jsより
 */
function makeAgeRows(list) {
	
	var rows = [];
	
	list.forEach(function(e){
		rows.push(Ti.UI.createPickerRow({
			font:	{fontSize:26*scale, fontWeight:'bold'},
			title: 	e
			}));		
	});
	
	return rows;
}
function makeAgeColumn(list) {
	return Ti.UI.createPickerColumn({rows: makeAgeRows(list)});
}
/**
 *   	m 		0: ロビー検索用（検索更新ボタンがある）
 * 				1: ユーザーデータ更新用（送信ボタンがある）
 * 	apps		requireで登録した諸々
 * 	flags		検索条件
 * 	onUpdate	更新時のコールバック
 *	onCancel	キャンセルしたときのコールバック
 */
exports.createWindow = function( m, apps, updateLocateFunc, flags, onUpdate, onCancel ){
	
	app = apps;
	updateLocate = updateLocateFunc;
	mode = m;
	
	// デフォルトの年齢幅は１８歳未満
	ageLow 	= 1;
	ageHigh = 99;
	
	scale = app.wrk.GetScale();
		
	myWin = Ti.UI.createWindow({
		borderRadius:		10,
		borderColor:		'#000000',
		borderWidth:		2,
		height:				700*scale,
//		width:				320,
 		backgroundColor: 	'#FAFAD2',
	});
	// var sv = Ti.UI.createScrollView({
    			// layout: 'vertical', // これが指定されていないと、文字が重なる。指定してあると、縦に並ぶ。
// //				top:0,
// //				left:0,
// //  			width: 400*scale,
// //  			height: 600*scale
			   	// contentWidth:	'auto',
			    // contentHeight:	'auto',
// //    			top:			0,
// //    			bottom: 		80,
				// showVerticalScrollIndicator:true
	// });

	var title = Ti.UI.createLabel({
		top:	1,
		font:	{fontSize:32*scale, fontWeight:'bold'},
//		text:	"検索条件を設定してください",
		color:	'#000000'
	});
	if ( mode == 0 )	title.text = "検索条件を設定してください";
	else				title.text = "自分の検索条件";

	// 絞り込み用ボタン類定義
	switch0 = Ti.UI.createSwitch({
		width:			100*scale,
		titleOn:		'条件0 ON',
		titleOff:		'条件0 OFF',
//		value:			true			
	});

	switch1 = Ti.UI.createSwitch({
		width:			100*scale,
		titleOn:		'趣味1 ON',
		titleOff:		'趣味1 OFF',
//		value:			true			
	});
		
	switch2 = Ti.UI.createSwitch({
		width:			100*scale,
		titleOn:		'趣味2 ON',
		titleOff:		'趣味2 OFF',
//		value:			true			
	});

	switchMale = Ti.UI.createSwitch({
		width:			100*scale,
		titleOn:		'男性 ON',
		titleOff:		'男性 OFF',
//		value:			true			
	});
		
	switchFemale = Ti.UI.createSwitch({
		width:			100*scale,
		titleOn:		'女性 ON',
		titleOff:		'女性 OFF',
//		value:			true			
	});
	switch5 = Ti.UI.createSwitch({
		width:			100*scale,
		titleOn:		'飲み会 ON',
		titleOff:		'飲み会 OFF',
//		value:			true			
	});
		
	switch6 = Ti.UI.createSwitch({
		width:			100*scale,
		titleOn:		'旅行 ON',
		titleOff:		'旅行 OFF',
//		value:			true			
	});

	switch7 = Ti.UI.createSwitch({
		width:			100*scale,
		titleOn:		'スポーツ ON',
		titleOff:		'スポーツ OFF',
//		value:			true			
	});
		
	switch8 = Ti.UI.createSwitch({
		width:			100*scale,
		titleOn:		'ドライブ ON',
		titleOff:		'ドライブ OFF',
	//	value:			true			
	});

	switch9 = Ti.UI.createSwitch({
		width:			100*scale,
		titleOn:		'学生 ON',
		titleOff:		'学生 OFF',
//		value:			true			
	});
	switch10 = Ti.UI.createSwitch({
		width:			100*scale,
		titleOn:		'映画 ON',
		titleOff:		'映画 OFF',
//		value:			true			
	});
	switch11 = Ti.UI.createSwitch({
		width:			100*scale,
		titleOn:		'演劇 ON',
		titleOff:		'演劇 OFF',
//		value:			true			
	});
	if(Ti.Platform.osname == 'android'){
		switchAge = Ti.UI.createSwitch({
			width:			120*scale,
			titleOn:		'全年齢',
			titleOff:		'年齢指定',
			value:			true		
		});
		// 年齢ON/OFFでピッカーの入力を切り替え（できる？）
		switchAge.addEventListener('click', function(e){
			if (switchAge.value){
				line1.remove(agePicker);
//				line1.remove(agePicker_m);
//				line1.remove(agePicker2);
			}else{
				line1.add(agePicker);				
//				line1.add(agePicker_m);				
//				line1.add(agePicker2);				
			}
		});
		var ageColumn1 = makeAgeColumn(fromAges);
		ageColumn1.width = 130*scale;
		
		var ageColumn2 = makeAgeColumn(endAges);
		ageColumn2.width = 130*scale;
		
		var ageColumn_m = makeAgeColumn(midAges);
		ageColumn_m.width = 50*scale;

		agePicker = Ti.UI.createPicker({
			top:				-100*scale,
			left:				130*scale,
			useSpinner: 		true,
			columns: 			[ageColumn1, ageColumn_m, ageColumn2],
			visibleItems: 		3,
			selectionIndicator: false
		});
		// agePicker2 = Ti.UI.createPicker({
			// top:				-100*scale,
			// left:				150*scale,
			// useSpinner: 		true,
			// columns: 			[ageColumn2],
			// visibleItems: 		3,
			// selectionIndicator: false
		// });
		// ageMid = Ti.UI.createLabel({
		// });
		
		agePicker.addEventListener('change', function(e){
			
			// 全年齢がONなら固定値セット
			if (switchAge.value){
				ageLow 	= 1;
				ageHigh = 99;				
			}
			// １８歳未満なら固定値セット
			else if ( e.rowIndex == 0) {
				ageLow 	= 1;
				ageHigh = 17;
			}else{
				if ( e.column == 0) ageLow = age[e.rowIndex];
				if ( e.column == 1) ageHigh = age[e.rowIndex];				
			}			
		});		
	}

	if ( mode == 0 ) 
		setMatchData(app.wrk.GetRobbyMatchData());
	else
		setMatchData(app.wrk.GetMatchData());

//	var switchTmp = Get	
	
	var line0 = Ti.UI.createView({
		top:	70*scale,
	 	right:	0,
		height:	Ti.UI.SIZE,
		layout: 'horizontal'
	});
	var line1 = Ti.UI.createView({
		top:	180*scale,
	 	right:	0,
	 	height:	Ti.UI.SIZE,
		layout: 'horizontal'
	});
	var line2 = Ti.UI.createView({
		top:	280*scale,
	 	right:	0,
	 	height:	200*scale,
		layout: 'horizontal'
	});
	var line3 = Ti.UI.createView({
		top:	380*scale,
	 	right:	0,
	 	height:	Ti.UI.SIZE,
		layout: 'horizontal'
	});
	var line4 = Ti.UI.createView({
		top:	480*scale,
	 	right:	0,
	 	height:	Ti.UI.SIZE,
		layout: 'horizontal'
	});

	if ( mode == 0 ){
		var btnSearch = Ti.UI.createButton({
			font:{fontSize:32*scale, fontWeight:'bold'},			
			left:	0,
			bottom:	1,
			height:	'auto',
			width:	'auto',
			title:	'検索'
		});
		btnSearch.addEventListener('click', function(e){
			
			// 検索条件を更新
			app.wrk.SetRobbyMatchData(makeMatchData());
			
			// 年齢範囲設定
			var range = GetAgeRange();
			app.wrk.SetAgeRange(range.LOW, range.HIGH);
			
			Ti.API.info("スイッチ状態保存完了 "+ app.wrk.GetRobbyMatchData() );

			sendDataRobby(onUpdate);
		})
	}else{
		var btnUpdate = Ti.UI.createButton({
			font:{fontSize:32*scale, fontWeight:'bold'},			
			left:	0,
			bottom:	1,
			height:	'auto',
			width:	'auto',
			title:	'更新'
		});
		btnUpdate.addEventListener('click', function(e){
			
			app.wrk.SetMatchData(makeMatchData());
			
			app.ind.setText('更新中……');
			// 自分のユーザーデータの更新
			app.connect.UpdateProf(app.wrk.GetMyData(), function(status, data){
				app.ind.hide();
			
				if(onUpdate) onUpdate();
				myWin.close();						
			},function(error){
				app.ind.hide();
				
				alert("更新エラー");
				
				myWin.close();										
			});			
		})
	}
		var btnClose = Ti.UI.createButton({
			font:{fontSize:32*scale, fontWeight:'bold'},
			
			right:	0,
			bottom:	1,
			height:	'auto',
			width:	'auto',
			title:	'もどる'
		});
		btnClose.addEventListener('click', function(e){
			
			if (onCancel) onCancel();
			
			myWin.close();
			myWin = null;				
		});

	if ( mode == 0 ){
		line0.add(switchMale);
		line0.add(switchFemale);		
	}	
	line1.add(switchAge);
	
	if (!switchAge.value){
		line1.add(agePicker);
	}
	
	line2.add(switch0);
	line2.add(switch1);
	line2.add(switch2);
	line2.add(switch5);
	
	line3.add(switch6);
	line3.add(switch7);
	line3.add(switch8);
	line3.add(switch9);
	
	line4.add(switch10);
	line4.add(switch11);
	
	// myWin.addEventListener('close', function(){
// 		
// //		var matchdata = makeMatchData();
// 
		// // if ( mode == 0 )
			// // app.wrk.SetRobbyMatchData(matchdata);
		// // else
			// // app.wrk.SetMatchData(matchdata);
// 		
	// });

	myWin.add(title);	
	myWin.add(line0);
	myWin.add(line1);
	myWin.add(line2);
	myWin.add(line3);
	myWin.add(line4);
	if ( mode == 0 )	myWin.add(btnSearch);
	else				myWin.add(btnUpdate);	
	myWin.add(btnClose);	
	myWin.open();
}

	/*
	 * 検索リスト更新（汎用）
	 */
	var sendData = function(){
		
		var matchData = makeMatchData();

		app.ind.setText('検索中……');
		
		// ユーザーリスト取得
		app.connect.updateUsers(data,
			function(){
			},
			function(){
			}
		);

		// ユーザーリスト更新
		
		app.ind.hide();
		
		myWin.close();			
	}	
	/*
	 * 検索リスト更新（ロビー用）
	 */
	var sendDataRobby = function(onUpdate){
		
		var matchData = makeMatchData();

		app.ind.setText('検索中……');
		
		// ユーザーリスト取得
		updateLocate(
			function(){
				app.ind.hide();
				myWin.close();	
						
				if (onUpdate) onUpdate();
			},
			function(){
				app.ind.hide();				
				myWin.close();			
				
				if (onUpdate) onUpdate();
			}
		);

	}	
	var setMatchData = function(str){
		
		Ti.API.info("initial switch "+str );
		
		try{
			switch0.value = (str[0]=='0')? false:true;
			switch1.value = (str[1]=='0')? false:true;
			switch2.value = (str[2]=='0')? false:true;
			if (mode == 0){
				switchMale.value 	= (str[3]=='0')? false:true;
				switchFemale.value 	= (str[4]=='0')? false:true;				
			}else{
				switchMale.value 	= (str[3]=='0')? false:true;
				switchFemale.value 	= (str[4]=='0')? false:true;								
			}
			switch5.value 	= (str[5]=='0')? false:true;
			switch6.value 	= (str[6]=='0')? false:true;
			switch7.value 	= (str[7]=='0')? false:true;
			switch8.value 	= (str[8]=='0')? false:true;
			switch9.value 	= (str[9]=='0')? false:true;
			switch10.value 	= (str[10]=='0')? false:true;
			switch11.value 	= (str[11]=='0')? false:true;
		}catch(e){
			
		}	
	}
	var makeMatchData = function(){
	
		var str ='';
		
		str += (switch0.value)? '1':'0';
		str += (switch1.value)? '1':'0';
		str += (switch2.value)? '1':'0';
		str += (switchMale.value)? '1':'0';
		str += (switchFemale.value)? '1':'0';
		str += (switch5.value)? '1':'0';
		str += (switch6.value)? '1':'0';
		str += (switch7.value)? '1':'0';
		str += (switch8.value)? '1':'0';
		str += (switch9.value)? '1':'0';
		str += (switch10.value)? '1':'0';
		str += (switch11.value)? '1':'0';
		
		return str;
	};

/*
 * 年齢対象取得
 */
	var GetAgeRange = function (){
		
		if ( switchAge.value){
			return {LOW:1, HIGH:99};
		}
		
		return {LOW:ageLow, HIGH:ageHigh};
	}
