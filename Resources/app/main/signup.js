/*
 * 
 */
	var connect = require('/app/comm/connect');
	var geo 	= require('/app/main/gps');
	var ind		= require('app/main/indicator');
 	var wrk		= require('app/main/work');
 	
	if(Ti.Platform.osname == 'android'){
		var sipclient 	= require('jp.co.aircast.module');
	}else{
		var sipclient 	= require('me.takus.ti.voip');		
	}		
		
	var onSuccess;
	var onFail;
		
	exports.Open = function(){
		
		var scale = wrk.GetScale();
		var phoneNumber = sipclient.getPhoneNumber();

		var signUpWindow = Ti.UI.createWindow({
			borderRadius:		10,
			borderColor:		'#000000',
			borderWidth:		2,
			top:				5*scale,
			bottom:				5*scale,
//			height:				500*scale,
//			width:				400*scale,
			width:				'90%',
 			backgroundColor: 	'#ffff99',
 		});
		var titleText = Ti.UI.createLabel({
			color:		'#000000',
			top:				10,			
			text:	'以下の情報で登録します。\nよろしければ”送信”を押して下さい。'
		});
		var textPhone = Ti.UI.createTextField({
				top:            2+80*scale,
//				left:           10,
//				right:         0,
//				height:        80,
				width:			280*scale,
//				color:         '#336699',
				hintText:      "電話番号",
				keyboardType:  Titanium.UI.KEYBOARD_DEFAULT,
				returnKeyType: Titanium.UI.RETURNKEY_DEFAULT,
				borderStyle:   Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
		});
		if ( phoneNumber != null ) textPhone.editable = false;
		
	    //電話番号がなければNULL、あれば文字列で返ってきます
		textPhone.value  = phoneNumber;
		
		// var textFamilyName = Ti.UI.createTextField({
				// top:            2+160*scale,
// //				left:           10,
// //				right:         0,
// //				height:        80,
				// width:			280*scale,
// //				color:         '#336699',
				// hintText:      "名字",
				// keyboardType:  Titanium.UI.KEYBOARD_DEFAULT,
				// returnKeyType: Titanium.UI.RETURNKEY_DEFAULT,
				// borderStyle:   Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
		// });		
		// var textFirstName = Ti.UI.createTextField({
				// top:            2+(80*3)*scale,
// //				left:           10,
// //				right:         0,
// //				height:        80,
				// width:			280*scale,
// //				color:         '#336699',
				// hintText:      "名前",
				// keyboardType:  Titanium.UI.KEYBOARD_DEFAULT,
				// returnKeyType: Titanium.UI.RETURNKEY_DEFAULT,
				// bordelrStyle:   Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
// 
		// });		
		var sendButton = Ti.UI.createButton({
			width:		'60%',
			height:		80*scale,
			bottom:		(80*0)*scale,
			title:		'送信'
		});
		var mapText = Ti.UI.createLabel({
			color:		'#000000',
			left:		'10%',
			bottom:		80*2*scale,			
			text:	'マップに表示'
		});
		var mapCheck = Ti.UI.createSwitch({
			value:		true,
			titleOn:	'ON',
			titleOff:	'ON',
//			width:		'50%',
//			height:		80*scale,
			right:		'30%',
			bottom:		(80*2)*scale			
		});
		var mapCheckOff = Ti.UI.createSwitch({
			value:		false,
			titleOn:	'OFF',
			titleOff:	'OFF',
//			width:		'50%',
//			height:		80*scale,
			right:		'10%',
			bottom:		(80*2)*scale			
		});
		
		var deaiText = Ti.UI.createLabel({
			color:		'#000000',
			left:		'10%',
			bottom:		80*3*scale,			
			text:		'マッチング対象'
		});
		var deaiCheck = Ti.UI.createSwitch({
			value:		true,
			titleOn:	'ON',
			titleOff:	'ON',
			right:		'30%',
//			width:		'50%',
//			height:		80*scale,
			bottom:		(80*3)*scale			
		});
		var deaiCheckOff = Ti.UI.createSwitch({
			value:		false,
			titleOn:	'OFF',
			titleOff:	'OFF',
			right:		'10%',
//			width:		'50%',
//			height:		80*scale,
			bottom:		(80*3)*scale			
		});
				
		mapCheck.addEventListener('click', function(){
			mapCheckOff.value = !mapCheck.value;		
		});
		mapCheckOff.addEventListener('click', function(){
			mapCheck.value = !mapCheckOff.value;					
		});
		deaiCheck.addEventListener('click', function(){
			deaiCheckOff.value = !deaiCheck.value;		
		});
		deaiCheckOff.addEventListener('click', function(){
			deaiCheck.value = !deaiCheckOff.value;					
		});
		
		sendButton.addEventListener('click',function(){
			
			if ( !textPhone.value ) return;

			ind.setText('サインアップ中‥‥')
			var data = {
					TELEPHONE:textPhone.value,
//					FIRST:textFirstName.value,
//					LAST:textFamilyName.value,
					pos_flg:		(mapCheck.value)? 1:0,
					rnd_flg:		(deaiCheck.value)? 1:0,
					LALTITUDE:0,
					LONGITUDE:0
			};
			textPhone.blur();

			if ( !geo.GetCurrentPosition(
			function(coords){
				data.LALTITUDE = ''+coords.latitude;
				data.LONGITUDE = ''+coords.longitude;
				signup(data);
			},
			function(){
				signup(data);
			}) ){
				signup(data);
			}
						
			signUpWindow.close();
		});
		signUpWindow.add(titleText);
		signUpWindow.add(textPhone);
//		signUpWindow.add(textFamilyName);
//		signUpWindow.add(textFirstName);
		signUpWindow.add(sendButton);
		signUpWindow.add(deaiCheck);
		signUpWindow.add(mapCheck);
		signUpWindow.add(deaiCheckOff);
		signUpWindow.add(mapCheckOff);
		signUpWindow.add(deaiText);
		signUpWindow.add(mapText);
		
		signUpWindow.open();
		
		var signup = function(data){
			connect.SignUp(data,
				function(status, data){
					Ti.App.Properties.setString('myprof.txt',JSON.stringify({number:textPhone.value, dummy0:'dummy'}) );
					Ti.API.info("saved myprof File.");
			
					if(onSuccess) onSuccess(status, data);						
				},
				function(error){
					Ti.API.info("signin fail."+error);
					if (onFail) onFail(error);										
				}
			)
		}	
	}	
		
	exports.addSuccess = function(cb){
		onSuccess = cb;
	}
	exports.addFail = function(cb){
		onFail = cb;
	}
