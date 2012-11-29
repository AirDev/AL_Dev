// (function(){
// 	
	// app.comm = {};

//	var ERROR_MESSAGE = 'There was an error. Please try again.';
	
	exports.Get = function(address, onSuccess, onFail, flg ){
	
//		Ti.API.info("get flg "+flg);
			
		if (flg == undefined ) flg = true;
			
		var xhr = Titanium.Network.createHTTPClient();
			
		xhr.open('GET', address);
			
		if(flg) Ti.API.info("GET URI:"+address );
					
		// 読み込みが正常終了した場合
		xhr.onload = function() {
			if(flg) Ti.API.debug( "Get Success. status:"+ this.status+ " responseText:"+this.responseText );
  	  		var json = JSON.parse(this.responseText);
  	  		
		    if ( onSuccess ) onSuccess( this.status, json );
		    
		    clearHttp(xhr);
		    xhr = null;
		};
			
		// エラー終了した場合
		xhr.onerror = function(e) {
			
			Ti.API.info(e.error);
			
		    if ( onFail ) onFail( e.error );
		    
		    clearHttp(xhr);
		    xhr = null;
		};
		
		xhr.send();
	}
	/*
	 * address : URI
	 * callback	終了時に呼ばれるコールバック
	 * param	POSTするデータ（JSONでエンコード済みのデータ）
	 * 
	 * 
	 * サンプルコード(モバイル側）
	 *	ポイントはJSON.stringify()を使って
	 * 	JSON文字列にしてから、サーバへリクエスト
	 * 		var xhr = Titanium.Network.createHTTPClient();
	 * 
	 * 		var param = {
	 * 			'fooname': "hoge",
	 * 			'id': 1,
	 * 			'imagename': JSON.stringify(new Array("hogeimg1","hogeimg2"))
	 * 		};
	 * 		xhr.open('POST',"http:// ");
	 * 		xhr.send(param);
	 */
	exports.Post = function(address, param, onSuccess, onFail, binFlg ){
						
		var xhr = Titanium.Network.createHTTPClient();

		if (binFlg == undefined ) binFlg = false;
									
//			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.open("POST", address);
			
			if ( !binFlg ){
				Ti.API.info("text post");
				xhr.setRequestHeader("Content-Type", "application/json-rpc");
			}else{
				Ti.API.info("binaly post");
//				xhr.setRequestHeader("Content-Type", "multipart/form-data");
//				xhr.setRequestHeader("enctype", "multipart/form-data");
			}
			
			Ti.API.info("POST URI:"+address+" param "+param);
			
			// 読み込みが正常終了した場合
			xhr.onload = function() {
				Ti.API.info("status:"+this.status+" response:"+this.responseText);
				
				try{
		  	  		var json = JSON.parse(this.responseText);
	 	    
				    if (onSuccess) onSuccess( this.status, json );					
				}catch(e){
					Ti.API.info(JSON.stringify(e));
					if (onFail) onFail("Json Decode error");					
				}
			    
			    clearHttp(xhr);
			    xhr = null;
			};
			
			// エラー終了した場合
			xhr.onerror = function(e) {
				Ti.API.info(e.error);
//				alert(ERROR_MESSAGE);
				if (onFail) onFail(e.error);
				
			    clearHttp(xhr);
			    xhr = null;
			};
			
			xhr.send(param);
		}
		
		/*
		 * メモリリーク対応
		 */
		var clearHttp = function(xhr){
			xhr.onload 				= null;
			xhr.onreadystatechange 	= null;
			xhr.ondatastream 		= null;
			xhr.onerror 			= null;
//			xhr = null;
		}
		
//})();

