
/*
 * ボイスレコード
 * 
 * 	onRecord(filePath)
 * 		filePath	文字列	保存した音声ファイル。フルパス。
 * 
 * 	onCancel()
 * 
 */
	var mainWin;
	var mic;
	var app;
	var scale;
	var recStat;
	var isRec;
	var defAudio;
		
	exports.create = function( apps, onRecord, onCancel, defaultAudio ){
		
		app = apps;
		
		defAudio = defaultAudio;
		
		recStat = false;
		isRec = false;
		
		scale 	= app.wrk.GetScale();	
		
		var size = app.wrk.GetScreenSize();
		
		if( IsAndroid() ){
			
//			Ti.API.info("path " +app.mic.GetTestString("saito"));
				
			mic	= app.mic.createRecord();
			mic.createAudioRecorder();
		}else{
			
		}
		
		var SetSendReady = function(){
		
			isRec = true;
			btnSend.enabled = true;					
			btnPlay.enabled = true;
		}
	
		mainWin = Ti.UI.createWindow({
			borderRadius:		10,
			borderColor:		'#000000',
			borderWidth:		2,
	 		backgroundColor: 	'#FAFAD2',
	 		height:				100*scale,
	 		bottom:				0*scale		
		});

		var btnRecStop = Ti.UI.createButton({
			width:		size.width/4,
			left:		0*(size.width/4)*scale,
			title:		"録音"
		});
		var btnPlay = Ti.UI.createButton({
			width:		size.width/4,
			left:		1*(size.width/4)*scale,
			enabled:	false,
			title:		"再生"
		});
		var btnCancel = Ti.UI.createButton({
			width:		size.width/4,
			left:		2*(size.width/4)*scale,
			title:		"キャンセル"			
		});
		var btnSend = Ti.UI.createButton({
			width:		size.width/4,
			left:		3*(size.width/4)*scale,
			enabled:	false,
			title:		"送信"
		});
		
		btnRecStop.addEventListener('click', function(e){
			
			recStat = !recStat;
			
			btnRecStop.title = (recStat)? "停止":"録音";
			
			if ( recStat ){
				
				// 録音開始
				if( IsAndroid() ){
					mic.start();
					
					SetSendReady();
				}else{
					
				}
			}else{
				if( IsAndroid() ){
					mic.stop();
				}else{
					
				}				
			}
		});
		btnPlay.addEventListener('click', function(e){
			
			if( IsAndroid() ){
				if ( !defAudio ){
					mic.play();
				}else{
					mic.playFile(defAudio);					
				}
			}else{
				
			}	
		});
		btnCancel.addEventListener('click', function(e){
			
			close();
			
			if( IsAndroid() ){
				mic.stop();
			}else{
			}			
		});
		
		btnSend.addEventListener('click', function(e){
			
			close();				
			
			if ( isRec ){
				var filePath = mic.getAudioFilePath();
				if (onRecord) onRecord(filePath);
			}
		});
		
		if ( !defAudio ){
			mainWin.add(btnRecStop);
			mainWin.add(btnPlay);
			mainWin.add(btnCancel);
			mainWin.add(btnSend);		
		}else{
			mainWin.add(btnPlay);
			mainWin.add(btnCancel);
			
			isRec = true;
			btnPlay.enabled = true;			
		}		
		
		mainWin.open();

		// 初期音声ファイルが指定されていたら自動再生		
		AutoPlay(defAudio);
	}
	var AutoPlay = function(url){
		
		if ( url !== undefined && url != '' ){
			
			if( IsAndroid() ){
				
				Ti.API.info("再生ファイル名 "+url );
				
				mic.playFile( url );
			}else{
				
			}
		}	
	}
	var close = function (){
		
		if ( mainWin == null ) return;
		
		mainWin.close();
		mainWin = null;							
	}
	
	exports.getFilePath = function(){
		
		if ( mic == null ) return null;	
		
		return mic.getAudioFilePath();
	}
	
	var IsAndroid = function(){
		
		return (Ti.Platform.osname == 'android')? true:false;
	}
	exports.isActive = function(){
		
		return (mainWin != null )? true:false;
	}
