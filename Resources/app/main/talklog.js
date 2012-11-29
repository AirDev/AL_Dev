
	var talk = require('app/main/talk');
	var connect = require('app/comm/connect');

//	var win = Ti.UI.currentWindow;
	
	/** メイン ウィンドウ。 */
	var mainWindow = Titanium.UI.createWindow({  
	    backgroundColor: '#98FB98'
	});

	mainWindow.orientationModes = [Titanium.UI.PORTRAIT];


	var reloadButton = Ti.UI.createButton({
		
		top:2,
		right:2,
		width:80,
		title:"リロード"
	});
	
	reloadButton.addEventListener('click', function(){
		talk.updateWindow(connect.GetMyID());
	});

// シェイクのイベント設定
Ti.Gesture.addEventListener('shake',function(e)
{
	talk.updateWindow(connect.GetMyID());
});

mainWindow.addEventListener('focus', function(e)
{
	talk.updateWindow(connect.GetMyID());
        // win.toolbar = [flexSpace,nativespinner,flexSpace];
// 
        // var s = setInterval(function(){
                // Ti.API.debug(win.title + ' timer :' +  data.length);
                // //|rec_count| にはレコード数"rows.getRowCount()"が入っている前提で。
                // if(data.length >= rec_count){
                        // Ti.API.debug(win.title + ' timer stop:' + data.length);
                        // win.toolbar = [flexSpace];
                        // clearInterval(s);
                        // //これは必要かどうかわかりません。
                        // s = null;
                // }
        // }, 100);
});

	talk.createWindow( mainWindow, null );

	mainWindow.add(reloadButton);

	mainWindow.open();
