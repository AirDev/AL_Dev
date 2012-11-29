	var list 	= require('app/ui/list');
	var connect = require('app/comm/connect');
	var wrk		= require('app/main/work');
//	var resv	= require('app/talk/resvmsg');
	
	var masterWin = Ti.UI.currentWindow;
	
	var app = masterWin.app;
	
	var createRow = function(icon, text){
		var row;
		var scale = wrk.GetScale();
//		var scale = 100;
			
		row = Ti.UI.createTableViewRow({
	        className: 		'row',
	        objName: 		'row',
   			touchEnabled: 	true,	
			hasChild:		true
		});
		
		var iv = Ti.UI.createImageView({
			left:	1,
			width:	100*scale,
			height:	100*scale,
			image:	icon,						
		});
							
		var label = Ti.UI.createLabel({
			left:	2+100*scale,
			font:	{fontSize:36*scale, fontWeight:'bold'},
			text:	text,
			color:	'#000000'
		});
		
		row.add(iv);
		row.add(label);
		
		return row;
	}

	// var masterWin = Ti.UI.createWindow({	
		// backgroundColor:	'#00cc99'
	// });
	masterWin.setBackgroundColor('#00cc99');

	var myList = list.createList(masterWin);

	var rows = [];
	var urls = [];
			
	rows.push( createRow('http://blog-imgs-45-origin.fc2.com/a/k/b/akb48dougazou/2010y06m05d_114105265.jpg','ＡＫＢ４８投票') );
	urls.push('/app/event/akb0000.js');
	
//	myList.add(row);
	
	rows.push( createRow('http://img01.hamazo.tv/usr/rank/coindozer_icon.110805.jpg','ゲームリスト(仮)') );
	urls.push('/app/event/aircatcher.js');
	
	myList.setData(rows);
	
//	Ti.API.info("push "+JSON.stringify(rows));
	
	myList.addEventListener('click', function(e){
		
//		masterWin.close();
		var win = Ti.UI.createWindow({
			url:		urls[e.index]
		});
		
//		win.open();
		Titanium.UI.currentTab.open(win,{animated:true});
	});	
