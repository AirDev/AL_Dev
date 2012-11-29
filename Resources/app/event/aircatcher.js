
	if(Ti.Platform.osname == 'android'){
		
		var wrk = require('/app/main/work');
		
		var data = JSON.stringify({
			SID:	wrk.GetSID(),
			UID:	wrk.GetUID(),
			TEXT:	'dummy text data'
		});
		
		var intent = Ti.Android.createIntent({ 
						flags: 			Ti.Android.FLAG_ACTIVITY_NEW_TASK | Ti.Android.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED,
						className:		"jp.co.aircast.ac.AircatcherActivity",
						packageName:	"jp.co.aircast.ac",
						action: 		"android.intent.action.MAIN",
						type:			'text/plain',
						data:			data,
	 				});
	 				
		intent.addCategory(Ti.Android.CATEGORY_LAUNCHER);
//	 	intent.putExtra("SID",'00112233445566778899');
//	 	intent.putExtra("UID",'9876');
//		intent.putExtra("XXX","test text.");
			 	
        Ti.Android.currentActivity.startActivityForResult(
            intent,
            function(e){
            	Ti.API.info("back from aircatcher");
            }
        );
	}else{
		
	}
