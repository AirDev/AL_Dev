/*
 * 
 */
Ti.include("/app/main/version.js");

if (isIPhone3_2_Plus())
{
	Ti.Geolocation.purpose = "GPSを利用します";
}

var geolocationEnabled = function(){
	
	if( !Ti.Geolocation.locationServicesEnabled){
		return false;
	}
	
	if ( Ti.Platform.osname != 'android'){
		switch(Ti.Geolocation.locationServicesAuthorization){
			case Ti.Geolocation.AUTHORIZATION_DENIED:
			case Ti.Geolocation.AUTHORIZATION_RESTRICTED:
			return false;
		}
	}
	
	return true;
};

/*
 * 減殺値の取得
 * 
 * return trueリクエスト成功
 * 			false GPSが起動していない
 */
exports.GetCurrentPosition = function(onSuccess, onFail){
	
	var coords = [];
	var retryCount = 0;
	
	if ( !geolocationEnabled() ){
		
		Ti.API.info('GPS no Enable.');
		
		return false;
	}
		
	Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
	
	var getGeo = function(){
		Ti.Geolocation.getCurrentPosition(function(e){
			if ( !e.success || e.error ){
				
				// 一定回数はリトライする
				if ( retryCount < 3 ){
					
					retryCount++;
					
					Ti.API.info('GPS Error retry '+retryCount);
					
					getGeo();
				}else{
					if(onFail) onFail();					
				}
			}else{
				retryCount = 0;
				
				coords.push(e.coords);
				
				Ti.API.info('GPS Success '+coords.length+"/3");
				
				// 三回採取する
				if ( coords.length < 3){
					getGeo();			
				}else{
					var lat = 0;
					var lon = 0;
					
					coords.forEach(function(pos){
						lat += pos.latitude;
						lon += pos.longitude;
					});
					
					lat = lat/coords.length;
					lon	= lon/coords.length;
					
					Ti.API.info( "位置 "+lat +' '+lon );
					
					if(onSuccess) onSuccess({latitude:lat, longitude:lon});					
				}
			}
		});
	}			
	
	getGeo();
	
	return true;
};
