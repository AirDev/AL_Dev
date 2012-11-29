
//var resv	= require('app/talk/resvmsg');
var multi	= require('app/ui/multiselect');
//var wrk		= require('app/main/work');

var masterWin = Ti.UI.currentWindow;
	masterWin.backgroundColor = '#2E8B57';
var app = masterWin.app;

//var scale = app.wrk.GetScale();
	
// var masterWin = Ti.UI.createWindow({
	// backgroundColor: '#2E8B57'
// });

// var btn = Ti.UI.createButton({
// //	bottom:		1,
	// font:		{fontSize:32*scale, fontWeight:'bold'},
	// title:		'チャットに招待する'
// });

//btn.addEventListener('click', function(e){
//	
//	var users = app.wrk.GetRobbyUsers();
//	
//	multi.createWindow(users, null, app);	
//});

var users = app.wrk.GetRobbyUsers();

multi.createWindow(users, null, app);	

masterWin.open();
