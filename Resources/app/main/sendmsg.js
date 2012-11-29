
var connect = require('app/comm/connect');

exports.createWindow = function(id){
	
	Ti.API.info("send to "+id);
	
	var win = Ti.UI.createWindow({
			height:350,
//			width:320,
 			backgroundColor: '#fff',
			borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
		});

	var messageText = Ti.UI.createTextField({
		height:100,
		top:5,
		left:5,
		width:400,
		color:         '#336699',
		keyboardType:  Titanium.UI.KEYBOARD_DEFAULT,
		returnKeyType: Titanium.UI.RETURNKEY_DEFAULT,
		borderStyle:   Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	
	var closeButton = Ti.UI.createButton({
		top:280,
		right:2,
		width:100,
		title:"閉じる"
	});
	closeButton.addEventListener('click', function(){
		messageText.blur();
		win.close();
	});
	var sendButton = Ti.UI.createButton({
		top:280,
		right:2+120,
		width:100,
		title:"送信"
	});
	sendButton.addEventListener('click', function(){
		messageText.blur();
		win.close();
		
		connect.SendMessage(
			id,
			messageText.value,
			function(status, data){
				alert("送信完了");				
			},function(error){
				alert("送信エラー");
			}
		);
	});

	win.add(messageText);
	win.add(sendButton);
	win.add(closeButton);
	
	win.open();			
}
