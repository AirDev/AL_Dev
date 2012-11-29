/*
 * プロフィール表示＆編集
 */

//	var connect 	= require('app/comm/connect');
// 	var wrk			= require('app/main/work');
//	var ind			= require('app/main/indicator');

	var masterWin;
	var app;
	
	exports.createWindow = function(apps){

		app = apps;
		
		var myData = app.wrk.GetMyData();
		var scale = app.wrk.GetScale();

		// もしマッチング用フラグデータが無ければ追加
		if ( myData.FLAGS === undefined ){
			myData.FLAGS = "1111111111";
		}
		// pickerの初期値(value)はクリエイト後に設定しても反映されない(Android)ので事前に設定する。		
		var minDate = new Date();
		minDate.setFullYear(1900);
		minDate.setMonth(0);
		minDate.setDate(1);

		var maxDate = new Date();
		maxDate.setFullYear(2099);
		maxDate.setMonth(11);
		maxDate.setDate(31);

		var valueDate = new Date();
		 valueDate.setFullYear(2012);
		 valueDate.setMonth(0);
		 valueDate.setDate(1);
		 
		 var sw1 = Ti.UI.createView({
		 	right:	0,
   			height:	Ti.UI.SIZE,
   			layout: 'horizontal'
		 });
		 var sw2 = Ti.UI.createView({
		 	right:	0,
		 	height:	Ti.UI.SIZE,
   			layout: 'horizontal'
		 });
		/**
		 * DATEオブジェクトから保存用文字列を取得
		 * @param {Object} date
		 */
		var getBirthString = function(date){
			
			var birth = date.getFullYear() +"-"+(date.getMonth()+1)+"-"+date.getDate();			
			
			return birth;
		}
		/*
		 * ローカルの情報を更新
		 */
		var updateMyData = function(){
			
			var matchData = app.wrk.GetMatchData();

			var data = app.wrk.GetMyData();
						
			data.NAME 		= nickName.value;
			data.FIRST 		= firstName.value;
			data.LAST 		= lastName.value;
			data.ZIPCODE 	= zip.value;
			data.ADDRESS 	= address.value;
			data.MAIL		= mail.value;
			data.URL 		= url.value;
			data.BIRTH 		= getBirthString(valueDate);
			data.pos_flg	= mapSwitch.value;
			data.rnd_flg	= deaiSwitch.value;
			data.FLAGS		= matchData;
			// 性別だけ変更を反映させる
			if ( seibetuSwitch.value ){
				data.FLAGS[3] 	= '1';
				data.FLAGS[4] 	= '0';
				data.GENDER		= 1;
			}else{
				data.FLAGS[3] 	= '0';
				data.FLAGS[4] 	= '1';
				data.GENDER		= 2;				
			}
		}
		var loadMyData = function(data){
			if ( data.NAME )	nickName.value 		= data.NAME;
			if ( data.FIRST )	firstName.value		= data.FIRST;
			if ( data.LAST )	lastName.value		= data.LAST;
			if ( data.ZIPCODE )	zip.value			= data.ZIPCODE;
			if ( data.ADDRESS )	address.value		= data.ADDRESS;
			if ( data.MAIL )	mail.value			= data.MAIL;
			if ( data.URL )		url.value			= data.URL;
			if ( data.pos_flg)	mapSwitch.value		= data.pos_flg;
			if ( data.rnd_flg)	deaiSwitch.value	= data.deai_flg;
			
			seibetuSwitch.value = (data.FLAGS[3]=='1')? true:false;
			
			if ( data.BIRTH ){
				var d = [];
				
				d = data.BIRTH.split("-", 3);
				
//				Ti.API.info("date "+JSON.stringify(d)+" "+JSON.stringify(data.BIRTH));
//				Ti.API.info("valuedate "+JSON.stringify(valueDate));
				
				valueDate.setFullYear(d[0]);
				valueDate.setMonth(d[1]-1);
				valueDate.setDate(d[2]);
			}
		}
		/*
		 * 更新されたプロフィールをサーバーに送信
		 */
		var sendData = function(){
			
			app.ind.setText('登録情報更新……');
			
			var flags = myData.FLAGS;
			// 性別だけ変更を反映させる
			if ( seibetuSwitch.value ){
				flags[3] = '1';
				flags[4] = '0';
			}else{
				flags[3] = '0';
				flags[4] = '1';				
			}
						
			app.connect.UpdateProf(
				{
					AID:0,
					NAME:		nickName.value,
					FIRST:		firstName.value,
					LAST:		lastName.value,
					ZIPCODE:	zip.value,
					ADDRESS:	address.value,
					MAIL:		mail.value,
					URL:		url.value,
					BIRTH:		getBirthString(valueDate),
					pos_flg:	(mapSwitch.value)? 1:0,
					rnd_flg:	(deaiSwitch.value)? 1:0,
					FLAGS:		flags,
					GENDER:		(seibetuSwitch.value)? 1:2
				},
				function(status, data){
					app.ind.hide();
					if ( data.RESULT == 'OK' ){
						updateMyData();
						alert('更新完了');											
					}else{
						alert('更新エラー');																
					}
				},
				function(error){
					app.ind.hide();
					alert('更新エラー');										
				}
			)
		}
				
		masterWin = Ti.UI.createWindow({
			borderRadius:		10,
			borderColor:		'#000000',
			borderWidth:		2,
			
 			backgroundColor: 	'#ffff99',

		    width: 	'100%',
		    height: '100%',
//    		fullscreen: true, //ステータスバーを隠す
//   		navBarHidden: true //タイトルバーを隠す			width:				'100%',
		});

		// プロフィール画面本体（数が多そうなのでスクロールビューで）
		var view = Ti.UI.createScrollView({
    			layout: 'vertical', // これが指定されていないと、文字が重なる。指定してあると、縦に並ぶ。
//				top:0,
//				left:0,
//  			width: 400*scale,
//  			height: 600*scale
			   	contentWidth:	'auto',
			    contentHeight:	'auto',
    			top:			0,
    			bottom: 		80,
				showVerticalScrollIndicator:true
		});
		
		var nickTitle = Ti.UI.createLabel({
			font:{fontSize:24*scale, fontWeight:'bold'},
			top:			0,
			left:			0,
			text:			'ニックネーム',
			color:			'#665500'
		});
		var nickName = Ti.UI.createTextField({
			top:			0,
//			left:			0,
			hintText:		'ニックネーム',
//			width:			Ti.UI.FILL,
			width:			'95%',
			height:			50*scale,
			font:			{fontSize:18*scale, fontWeight:'bold'},
			keyboardType:  	Titanium.UI.KEYBOARD_DEFAULT,
			returnKeyType: 	Titanium.UI.RETURNKEY_DEFAULT,
			borderStyle:   	Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
		});
		var firstTitle = Ti.UI.createLabel({
			font:{fontSize:24*scale, fontWeight:'bold'},
			top:			0,
			left:			0,
			text:			'名',
			color:			'#665500'
		});
		var firstName = Ti.UI.createTextField({
			top:			0,
//			left:			0,
			hintText:		'名',
//			width:			Ti.UI.FILL,
			width:			'95%',
			height:			50*scale,
			font:			{fontSize:18*scale, fontWeight:'bold'},
			keyboardType:  	Titanium.UI.KEYBOARD_DEFAULT,
			returnKeyType: 	Titanium.UI.RETURNKEY_DEFAULT,
			borderStyle:   	Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
		});
		var lastTitle = Ti.UI.createLabel({
			font:{fontSize:24*scale, fontWeight:'bold'},
			top:			0,
			left:			0,
			text:			'姓',
			color:			'#665500'
		});
		var lastName = Ti.UI.createTextField({
			top:			0,
//			left:			0,
			hintText:		'姓',
//			width:			Ti.UI.FILL,
			width:			'95%',
			height:			50*scale,
			font:			{fontSize:18*scale, fontWeight:'bold'},
			keyboardType:  	Titanium.UI.KEYBOARD_DEFAULT,
			returnKeyType: 	Titanium.UI.RETURNKEY_DEFAULT,
			borderStyle:   	Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
		});
		var zipTitle = Ti.UI.createLabel({
			font:{fontSize:24*scale, fontWeight:'bold'},
			top:			0,
			left:			0,
			text:			'郵便番号',
			color:			'#665500'
		});
		var zip = Ti.UI.createTextField({
			top:			0,
//			left:			0,
			hintText:		'郵便番号',
//			width:			Ti.UI.FILL,
			width:			'95%',
			height:			50*scale,
			font:			{fontSize:18*scale, fontWeight:'bold'},
			keyboardType:  	Titanium.UI.KEYBOARD_DEFAULT,
			returnKeyType: 	Titanium.UI.RETURNKEY_DEFAULT,
			borderStyle:   	Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
		});
		var addressTitle = Ti.UI.createLabel({
			font:{fontSize:24*scale, fontWeight:'bold'},
			top:			0,
			left:			0,
			text:			'住所',
			color:			'#665500'
		});
		var address = Ti.UI.createTextField({
			top:			0,
//			left:			0,
			hintText:		'住所',
//			width:			Ti.UI.FILL,
			width:			'95%',
			height:			50*scale,
			font:			{fontSize:18*scale, fontWeight:'bold'},
			keyboardType:  	Titanium.UI.KEYBOARD_DEFAULT,
			returnKeyType: 	Titanium.UI.RETURNKEY_DEFAULT,
			borderStyle:   	Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
		});
		var mailTitle = Ti.UI.createLabel({
			font:{fontSize:24*scale, fontWeight:'bold'},
			top:			0,
			left:			0,
			text:			'メールアドレス',
			color:			'#665500'
		});
		var mail = Ti.UI.createTextField({
			top:			0,
//			left:			0,
			hintText:		'メールアドレス',
//			width:			Ti.UI.FILL,
			width:			'95%',
			height:			50*scale,
			font:			{fontSize:18*scale, fontWeight:'bold'},
			keyboardType:  	Titanium.UI.KEYBOARD_DEFAULT,
			returnKeyType: 	Titanium.UI.RETURNKEY_DEFAULT,
			borderStyle:   	Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
		});
		var urlTitle = Ti.UI.createLabel({
			font:{fontSize:24*scale, fontWeight:'bold'},
			top:			0,
			left:			0,
			text:			'URL',
			color:			'#665500'
		});
		var url = Ti.UI.createTextField({
			top:			0,
//			left:			0,
			hintText:		'URL',
//			width:			Ti.UI.FILL,
			width:			'95%',
			height:			50*scale,
			font:			{fontSize:18*scale, fontWeight:'bold'},
			keyboardType:  	Titanium.UI.KEYBOARD_DEFAULT,
			returnKeyType: 	Titanium.UI.RETURNKEY_DEFAULT,
			borderStyle:   	Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
		});
		var topTitle = Ti.UI.createLabel({
			font:{fontSize:32*scale, fontWeight:'bold'},
			top:			0,
			left:			0,
			text:			'プロフィール',
			color:			'#000000'
		});
		var birthTitle = Ti.UI.createLabel({
			font:{fontSize:32*scale, fontWeight:'bold'},
			top:			0,
			left:			0,
			text:			'誕生日',
			color:			'#665500'
		});
		var deaiTitle = Ti.UI.createLabel({
			font:{fontSize:32*scale, fontWeight:'bold'},
			top:			0,
			left:			0,
			text:			'マッチング対象',
			color:			'#665500'			
		});
		var deaiSwitch = Ti.UI.createSwitch({
			touchEnabled:	false,
			titleOn:		'ON',
			titleOff:		'ON',
			value:			true			
		});
		var deaiSwitch2 = Ti.UI.createSwitch({
			touchEnabled:	false,
			titleOn:		'OFF',
			titleOff:		'OFF',
			value:			false			
		});
		sw1.add(deaiSwitch);
		sw1.add(deaiSwitch2);
		
		var seibetuTitle = Ti.UI.createLabel({
			font:{fontSize:32*scale, fontWeight:'bold'},
			top:			0,
			left:			0,
			text:			'性別',
			color:			'#665500'			
		});
		var seibetuSwitch = Ti.UI.createSwitch({
			left:			0,
			touchEnabled:	true,
			titleOn:		'男性',
			titleOff:		'女性',
			value:			true			
		});
		var mapTitle = Ti.UI.createLabel({
			font:{fontSize:32*scale, fontWeight:'bold'},
			top:			0,
			left:			0,
			text:			'マップに表示',
			color:			'#665500'			
		});
		var mapSwitch = Ti.UI.createSwitch({
			touchEnabled:	false,
			titleOn:		'ON',
			titleOff:		'ON',
			value:			true
		});
		var mapSwitch2 = Ti.UI.createSwitch({
			touchEnabled:	false,
			titleOn:		'OFF',
			titleOff:		'OFF',
			value:			false
		});
		sw2.add(mapSwitch);
		sw2.add(mapSwitch2);
		
		sw1.addEventListener('click', function(e){
			if ( deaiSwitch.value){
				deaiSwitch.value = false;
				deaiSwitch2.value = true;				
			}else{
				deaiSwitch.value = true;
				deaiSwitch2.value = false;								
			}
		});
		sw2.addEventListener('click', function(e){
			if ( mapSwitch.value){
				mapSwitch.value = false;
				mapSwitch2.value = true;				
			}else{
				mapSwitch.value = true;
				mapSwitch2.value = false;								
			}
		});
			var slider = Titanium.UI.createSlider({
//    top: 50,
    min: 0,
    max: 100,
    width: '50%',
    value: 0
    });
    	slider.addEventListener('touchend',function(e){
	   		Ti.API.info(JSON.stringify(e));
    		if ( e.source.value < 50) 	slider.setValue(0);
    		else						slider.setValue(100);
    	});
    				
		var setBtn = Ti.UI.createButton({
			font:{fontSize:32*scale, fontWeight:'bold'},			
			left:	0,
			bottom:	1,
			height:	'auto',
			width:	'auto',
			title:	'登録'
		});
		setBtn.addEventListener('click', function(e){
			sendData();
		})
		var backBtn = Ti.UI.createButton({
			font:{fontSize:32*scale, fontWeight:'bold'},
			
			right:	0,
			bottom:	1,
			height:	'auto',
			width:	'auto',
			title:	'もどる'
		});
		backBtn.addEventListener('click', function(e){
			if(masterWin){
				masterWin.close();
				masterWin = null;				
			}
		})
		
		loadMyData(myData);

		var birthPicker = Ti.UI.createPicker({
			type:		Ti.UI.PICKER_TYPE_DATE,
			minDate:	minDate,
			maxDate:	maxDate,
			value:		valueDate
		});
		// 外からpickerの変化した値を執る手段はなさそうなのでイベントで更新
		birthPicker.addEventListener('change', function(e){
			
//			Ti.API.info("picker event "+JSON.stringify(e));
			
			valueDate.setFullYear(e.value.getFullYear() );
			valueDate.setMonth(e.value.getMonth() );
			valueDate.setDate(e.value.getDate() );
		});
		
		
		view.add(topTitle);
		view.add(nickTitle);
		view.add(nickName);
		view.add(firstTitle);
		view.add(firstName);
		view.add(lastTitle);
		view.add(lastName);
		view.add(zipTitle);
		view.add(zip);
		view.add(addressTitle);
		view.add(address);
		view.add(mailTitle);
		view.add(mail);
		view.add(urlTitle);
		view.add(url);
		view.add(birthTitle);
		view.add(birthPicker);
		view.add(seibetuTitle);
		view.add(seibetuSwitch);
		view.add(deaiTitle);
//		view.add(deaiSwitch);
		view.add(sw1);
		view.add(mapTitle);
//		view.add(mapSwitch);
		view.add(sw2);
//		view.add(slider);
		masterWin.add(setBtn);
		masterWin.add(backBtn);
			
		masterWin.add(view);				
		masterWin.open();

				
//		connect.UpdateProf( postData, onSuccess, onFail );
	};

	exports.close = function(){
		if (masterWin){
			masterWin.close();
			masterWin = null;
		}
	}
	exports.addEventListener = function(evt,func){
		if(masterWin){
			masterWin.addEventListener(evt, func);
		}
	}
