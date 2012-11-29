/*
 * ローカルファイルアクセス関係
 * 
 */
	/*
	 * アイコン用画像ファイルの拡張子チェック
	 * 	PNGとJPEG以外はnullを返す。（サーバーがその２つのみ現状対応なので）
	 */
	exports.getExt = function(name){
//		Ti.API.info( "check png "+name.search('.png'));
		
		if ( name.search('.png') > 0) 	return '.png';
		if ( name.search('.jpg') >0 ) 	return '.jpg';
		if ( name.search('.jpeg') > 0)	return '.jpeg';
		
		return null;
	}
	exports.makeDir = function(dirName){
		
		var newDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,dirName );
		newDir.createDirectory();
	}
	/**
	 * アイコン画像ファイルの読み込み
	 */
	exports.readIcon = function(uid){
		
		var image;
		
		var file  = Ti.Filesystem.getFile(
		    Ti.Filesystem.applicationDataDirectory + '/icon/i' + uid+'.png'
		);
			
		if ( !file ) {
		    Ti.API.debug("no icon file. ");
			return null;
		}else{
		    Ti.API.debug("exist icon file. " );
			image = file.read();
//		    Ti.API.debug("ファイルの中身. "+JSON.stringify(image) );
			return image;
		}
	}
	exports.saveIcon = function(uid, image){
		
//		Ti.API.info("in saveIcon "+JSON.stringify(image));
		
		var iconDir  = Ti.Filesystem.getFile( Ti.Filesystem.applicationDataDirectory+'/icon' );
		var iconFile;
		
		// アイコンディレクトリが無ければ作る
		if ( !iconDir.exists() ){
						
			iconDir.createDirectory();
			
			Ti.API.info("make icon dir");
		}else{
			Ti.API.info("exist icon dir");			
		}
		iconFile = Ti.Filesystem.getFile( iconDir.nativePath+'/i'+uid+'.png' );
		
		if ( iconFile){
			iconFile.write(image);
			Ti.API.info('file write done.'+iconFile.name);
			return iconFile.name;			
		}else{
			Ti.API.info('file write error.');
			return null;						
		}
	}
	/**
	 * デフォルトのアイコンファイルのURL取得
	 */
	exports.getDefaultIcon = function(){
		var image = '/images/icon/user.png';
		
		return image;
	}
	/*
	 * ファイル読み込み
	 * 	JSONで保存されているのを展開して返す。多重にJSONエンコードされている場合は取得先でデコードして下さい。
	 */
	exports.ReadText = function (fileName){

		var file  = Ti.Filesystem.getFile(
		    Ti.Filesystem.applicationDataDirectory + '/' + fileName
		);
	
		var json = file.read();
		
		if ( !json || json.length <= 0) {
		    Ti.API.debug("no json data. ");
			return null;
		}else{
		    Ti.API.debug("read json data. "+json);
		    var data = JSON.parse(json);

			Ti.API.debug("read url "+data.url);
					    
//		    data.forEach(function(arg){Ti.API.debug("項目単位："+arg.toString())});
			return data;
		}
	}

	/*
	 * 	ファイルセーブ
	 * 		データは内部でJSONエンコードされて保存される
	 * 
	 * 	データ形式の例
	 *     sampleData = [
     *  	 {name:"あああああ"},
     *  	 {hp:10},
     *  	 {comment:"ううううう"},
     *  	 {money:9999},
     *		];
	 *
	 */
	exports.SaveText = function( fileName, data ){
	
//	    Ti.API.debug("saving "+data.url);
	    
		var json = JSON.stringify( data );
	    var file  = Ti.Filesystem.getFile(
	        Ti.Filesystem.applicationDataDirectory + '/' + fileName
	    );
	    file.write(json);
	    
	    Ti.API.debug("saved "+json);
	}

	/*
	 * ファイル削除
	 */
	exports.Delete = function(fileName){
	
	    var file  = Ti.Filesystem.getFile(
	        Ti.Filesystem.applicationDataDirectory + '/' + fileName
	    );
	
		file.deleteFile();
	}

// if ( !json || json.length <= 0) {
    // // 保存データが無かった場合、初期値をセット。
    // rowData = [
        // {title:"あああああ"},
        // {title:"いいいいい"},
        // {title:"ううううう"},
        // {title:"えええええ"},
        // {title:"おおおおお"}
    // ];
    // SaveRows(rowData);
//     
// } else {
    // // 保存データがあった場合
    // Ti.API.debug("load data "+file.getNativePath() );
    // var rowData = JSON.parse(json);
// }
	exports.saveImage = function(url, image){
		
		var save_file_name = url.substring(url.lastIndexOf("/")+1,url.length);
      			
		var dir =  Ti.Filesystem.externalStorageDirectory + '/downloadImage';
		if(!Ti.Filesystem.getFile(dir).exists()){
			Ti.Filesystem.getFile(dir).createDirectory();
		}
		var f = Ti.Filesystem.getFile(dir, save_file_name);
		f.write(image);
		
		Ti.API.info("done");

		Ti.Media.Android.scanMediaFiles([f.nativePath], null,function(e){
		    if (e.uri) {
				Ti.API.info(e.uri);
    		} else {
    			Ti.API.info('no uri');
    		}
		});			
	}
