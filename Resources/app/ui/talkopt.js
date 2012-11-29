var stamps = [
		'/images/icon/char_denpen.png',
		'/images/icon/char_onatsu.png',
		'/images/icon/char_oyaji.png',
		'/images/icon/char_punio.png',
		'/images/icon/char_riku.png',
		'/images/icon/char_saki.png',
		'/images/icon/char_suzuki.png',
		'/images/icon/char_tsuru_1.png',
		'/images/icon/char_yankee.png',
		'/images/icon/char_yen.png'
];

var stampsList =[stamps];

/*
 * 会話ウィンドウオプション
 * 発生するイベント
 * 
 */
//	var connect 	= require('/app/comm/connect');
//	var wrk			= require('/app/main/work');
	var talklist	= require('/app/ui/talkaddlist');
	var stamp		= require('/app/ui/stampselect');
//	var sipclient 	= require('jp.co.aircast.module');
//	var ind			= require('app/main/indicator');
	var subWin		= require('/app/ui/sendwin');
	
	var app;	
	var roomId;
	var myId;
	var myWin = null;
	var active = false;
	
	var scale;
	
	exports.setActive = function(b){
		active = b;
	}	
	exports.isActive = function(){
		return active;
	}	
	exports.createWindow = function(id, apps, mems){
		
		if ( myWin != null ){
			myWin.close();
			myWin = null;
		}
		app = apps;
		roomId = id;
		members = mems;
		
		scale = app.wrk.GetScale();

//		Ti.API.info(JSON.stringify(onStampSelect));
	
		// スタンプ選択のコールバック			
		var onSelect = function(e){
//			onStampSelect( {URL:stampsList[e.PAGE][e.INDEX]} );
			
   			app.connect.SendChatStamp(
				roomId,
				stampsList[e.PAGE][e.INDEX],
				function(status, data){
					
                   	//チャット相手全員にメッセージング処理
                   	members.forEach( function(d){
						app.wrk.sipclient.sendMessage(d.USERNAME, 'chatupdate');
                   	});
				},
				function(error){
				}
			);
		}
		// 画像送信のコールバック。画像の送信は完了しているのでURLとTHUMBをチャットに流す
		var onPicSelect = function(event){
			
//			Ti.API.info("onPicSelect "+JSON.stringify(event));
			
   			app.connect.SendChatFile(
				roomId,
				event,
				function(status, data){
   	        	   	//チャット相手全員にメッセージング処理
   	        	   	members.forEach( function(d){
						app.wrk.sipclient.sendMessage(d.USERNAME, 'chatupdate');
					
						Ti.API.info( d.USERNAME );
	        		});
				},
				function(error){
				}
			);
		}
		var onMovieSelect = function(event){
			
			Ti.API.info("onMovieSelect "+JSON.stringify(event));
			
   			app.connect.SendChatFile(
				roomId,
				event,
				function(status, data){
                   	//チャット相手全員にメッセージング処理
                   	members.forEach( function(d){
						app.wrk.sipclient.sendMessage(d.USERNAME, 'chatupdate');
                   	});
				},
				function(error){
				},
				10
			);			
		}
		var onAudioSelect = function(event){
			Ti.API.info("onAudioSelect "+JSON.stringify(event));
			
   			app.connect.SendChatFile(
				roomId,
				event,
				function(status, data){
                   	//チャット相手全員にメッセージング処理
                   	members.forEach( function(d){
						app.wrk.sipclient.sendMessage(d.USERNAME, 'chatupdate');
                   	});
				},
				function(error){
				},
				11
			);			
		}
		myWin = Ti.UI.createWindow({
			borderRadius:		10,
			borderColor:		'#000000',
			borderWidth:		2,
			top:				0,
			right:				0,
			height:				350*scale,
			width:				320*scale,
 			backgroundColor: 	'#FAFAD2'
// 			navBarHidden: false
		});

		var addButton = Ti.UI.createButton({
			bottom:		80*scale,
			right:		0,
//			width:100,
			title:		"メンバー追加"			
		});		
		var closeButton = Ti.UI.createButton({
			bottom:		2,
			right:		2,
//			width:100,
			title:		"閉じる"
		});
		var stampButton = Ti.UI.createButton({
			bottom:		1*80*scale,
			left:		2,
//			width:100,
			title:"スタンプ"
		});
		var endButton = Ti.UI.createButton({
			bottom:		0,
			right:		100,
//			width:100,
			title:"会話終了"
		});
		var voiceButton = Ti.UI.createButton({
			font:		{fontSize:18*scale, fontWeight:'bold'},
//			hight:		20*scale,
			top:		0*80*scale,
			left:		1,
//			width:100,
	
			title:"音声ファイル"
		});
		var	movieButton = Ti.UI.createButton({
			font:		{fontSize:18*scale, fontWeight:'bold'},
//			hight:		20*scale,
			top:		1*80*scale,
			left:		1,
//			width:100,
			title:"動画ファイル"
		});
		var picButton = Ti.UI.createButton({
			font:		{fontSize:18*scale, fontWeight:'bold'},
//			hight:		18*scale,
			top:		0*80*scale,
			left:		1*120*scale,
//			width:100,
			title:"画像ファイル送信"
		});
		/*
		 * 音声ファイル選択、送信
		 */
		voiceButton.addEventListener('click',function(e){
			
			myWin.close();
			myWin = null;

//			var recwin = require('/app/ui/recwin');
			
			app.recwin.create(app,
				function(filePath){
					
//					recwin = null;
	  				var postMedia = Ti.Filesystem.getFile('file://'+filePath);
	  				
//					Ti.API.info( "音楽ファイル "+JSON.stringify(postMedia) );
					
					app.connect.UploadFile(
						postMedia,
						function(status, data){

							// チャット上でURL送信
							onAudioSelect(JSON.stringify({
								'URL':'http://'+data.RESPONSE.URL,
//								'THUMB':'http://'+data.RESPONSE.THUMB
								'THUMB':'http://www.material-land.com/material/128/1508.png'
							}));
							
							postMedia = null;
						},
						function(error){
							app.ind.hide();
							alert("アップロードできませんでした");
							
							postMedia = null;
						}
					);  				
				},
				function(){
//					recwin = null;										
				}
			);
			
/*
 			// 音声の選択＆送信
			selectAudio(
				//Success
				function(data){
					
					// チャット上でURL送信
					onAudioSelect(JSON.stringify({
						'URL':'http://'+data.RESPONSE.URL,
//						'THUMB':'http://'+data.RESPONSE.THUMB
						'THUMB':'http://www.material-land.com/material/128/1508.png'
					}));
					
				// Cancel
				},function(){
				
				// Error	
				},function(){
					
				}
			);									
*/
		});
		
		/*
		 * 動画ファイル選択送信
		 */
		movieButton.addEventListener('click', function(e){
			
			myWin.close();
			myWin = null;

			// 画像の選択＆送信
			selectMovie(
				//Success
				function(data){
					myWin.close();
					
					// チャット上でURL送信
//					onMovieSelect('http://'+data.RESPONSE.URL);
					onMovieSelect(JSON.stringify({
						'URL':'http://'+data.RESPONSE.URL,
						'THUMB':'http://'+data.RESPONSE.THUMB						
					}));
					
				// Cancel
				},function(){
				
				// Error	
				},function(){
					
				});						
		});
		/*
		 * 画像ファイル送信
		 */
		picButton.addEventListener('click', function(e){
			
			myWin.close();
			myWin = null;
			
			// 画像の選択＆送信
			selectPicture(
				//Success
				function(data){
//					myWin.close();
					
					// チャット上でURL送信
					onPicSelect('http://'+data.RESPONSE.URL);
					
				// Cancel
				},function(){
				
				// Error	
				},function(){
					
				});			
		});		
		stampButton.addEventListener('click', function(e){
			myWin.close();
			stamp.createWindow([stamps], onSelect);
		});
		
		endButton.addEventListener('click', function(e){
			myWin.close();
			
			Ti.App.fireEvent('chat_close');
		
		});
		addButton.addEventListener('click', function(e){
						
			myWin.close();
			talklist.createWindow(roomId);
			
			// ロビーのリストを表示。一人選択。（受け渡しは最初から複数対応に）
		});
		
		closeButton.addEventListener('click', function(){
			myWin.close();
		});
		
		myWin.add(endButton);
		myWin.add(addButton);
		myWin.add(closeButton);
		myWin.add(stampButton);
		myWin.add(voiceButton);
		myWin.add(picButton);
		myWin.add(movieButton);
		myWin.open();			
	}
	
	exports.addEvent = function(status, func){
		myWin.addEventListener(status, func);
	}
	

	var selectPicture = function(onSuccess, onCancel, onError){
		
		Titanium.Media.openPhotoGallery({

			success:function(event){
		
				if( event.media.mimeType == 'image/jpeg' )
				{			
					// var baseImage = Titanium.UI.createImageView({
// //    					width:	event.cropRect.width,
// //   					height:	event.cropRect.height,
					    // image:	event.media
					// });
											
					subWin.createWindow(app, event.media, 'この画像を送信しますか？',
						function(e){
							if ( e.RESULT == 'ok' ){
								
								Ti.API.info( "画像ファイル "+JSON.stringify(event.media) );
								
								app.connect.UploadFile(
									event.media,
									function(status, data){
										if (onSuccess) onSuccess(data);						
									},
									function(error){
										app.ind.hide();
										alert("アップロードできませんでした");
									}
								);
							}
						}
					);

				}
				else
				{
					Ti.API.info("no image");
					if (onFail) onFail();
				}
			},
			cancel:function(){
				if (onCancel) onCancel();
			},
			error:function(error){
				
				Ti.API.info(error);
				
				if (onFail) onFail();
			},
//			allowEditing:false,
//			popoverView:popoverView,
//			arrowDirection:arrowDirection,
			mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]
		});
	}
	/*
	 * 動画選択
	 */
	var selectMovie = function(onSuccess, onCancel, onError){
		
		Ti.API.info("動画選択");
		
		// for Android
		if(Ti.Platform.osname == 'android'){
			selectMovieAndroid2(onSuccess, onCancel, onError);

		// for iOS
		}else{
			Titanium.Media.openPhotoGallery({
	
				success:function(event){
			
//					var baseImage = Titanium.UI.createImageView({
//  	 					width:	event.cropRect.width,
//  						height:	event.cropRect.height,
//					    image:	event.media
//					});
						
					app.connect.UploadFile(
						event.media,
						function(status, data){
							if (onSuccess) onSuccess(data);						
						},
						function(error){
							app.ind.hide();
							alert("アップロードできませんでした");
						}
					);
				},
				cancel:function(){
					if (onCancel) onCancel();
				},
				error:function(error){
					
					Ti.API.info(error);
					
					if (onFail) onFail();
				},
//				allowEditing:false,
//				popoverView:popoverView,
//				arrowDirection:arrowDirection,
			
				mediaTypes:[Ti.Media.MEDIA_TYPE_VIDEO]
			});					
		}
	}
	// /*
	 // * 音声選択
	 // */
	// var selectAudio = function(onSuccess, onCancel, onError){
// 		
		// Ti.API.info("音声選択");
// 		
		// if(Ti.Platform.osname == 'android'){
			// selectAudioAndroid2(onSuccess, onCancel, onError);
		// }else{
			// Titanium.Media.openPhotoGallery({
// 	
				// success:function(event){
// 			
// //					var baseImage = Titanium.UI.createImageView({
// //  	 					width:	event.cropRect.width,
// //  						height:	event.cropRect.height,
// //					    image:	event.media
// //					});
// 						
					// app.connect.UploadFile(
						// event.media,
						// function(status, data){
							// if (onSuccess) onSuccess(data);						
						// },
						// function(error){
							// app.ind.hide();
							// alert("アップロードできませんでした");
						// }
					// );
				// },
				// cancel:function(){
					// if (onCancel) onCancel();
				// },
				// error:function(error){
// 					
					// Ti.API.info(error);
// 					
					// if (onFail) onFail();
				// },
// //				allowEditing:false,
// //				popoverView:popoverView,
// //				arrowDirection:arrowDirection,
// 			
				// mediaTypes:[Ti.Media.MEDIA_TYPE_VIDEO]
			// });					
		// }
	// }


// var intentTest = function(){
// 	
// var picture = Ti.Filesystem.getFile(Ti.Filesystem.getTempDirectory(), 'picture.jpg');
// if (picture.exists()) {
        // picture.deleteFile();
// }
// var intent = Ti.Android.createIntent({
        // action: 'android.media.action.IMAGE_CAPTURE'
// });
// intent.putExtraUri('output', picture.resolve());
// Ti.Android.currentActivity.startActivityForResult(intent, function(e){
       	// alert("back");
       	// Ti.API.info("いんてんとからもどってきた");
//        	
        // if (e.resultCode === Ti.Android.RESULT_OK
         // && picture.exists()) {
                // // picture.read(),
        // } else {
                // // error
        // }
// });
// }

	var selectMovieAndroid2 = function(onSuccess, onCancel, onError){
		
	    var test = app.sipclient.createMakeIntent();
	    var callback = function (e) {
	    	
	    	var cancel = e.voice_canceled;
	    	var enable = e.voice_enabled;
	    	var result = e.voice_results;
	    	
   		 	// Titanium.API.info("v1 = " + v1);
  	 		// Titanium.API.info("v2 = " + v2);
   	 		// Titanium.API.info("v3 = " + v3);
  
  			if ( enable && !cancel ){
  				var image = Ti.Filesystem.getFile(result);

				subWin.createWindow(app, '/images/mapIconMale/document.png', '動画を送信しますか？',
					function(e){
						if ( e.RESULT == 'ok' ){
			  				app.ind.setText("動画送信中……");
			  				
							Ti.API.info( "送信動画ファイル "+JSON.stringify(image) );

							app.connect.UploadFile(
								//event.media,
								image,
								function(status, data){
									app.ind.hide();
									if (onSuccess) onSuccess(data);						
								},
								function(error){
									app.ind.hide();
									alert("アップロードできませんでした");
								}
							);  				
						}
					}
				);  				
  			} 	 		
	    };
    	test.start({
           //typeの指定なしはvideo/*
//         "type":"*/*", //すべてのファイル
//                          "type":"image/*", //写真や画像
//                          "type":"audio/*", //音声
                          "type":"video/*", //動画
    	       "callback":callback
	    });
	}
	// var selectAudioAndroid2 = function(onSuccess, onCancel, onError){
// 		
	    // var test = app.sipclient.createMakeIntent();
	    // var callback = function (e) {
// 	    	
	    	// var cancel = e.voice_canceled;
	    	// var enable = e.voice_enabled;
	    	// var result = e.voice_results;
// 
   		 	// // Titanium.API.info("v1 = " + v1);
  	 		// // Titanium.API.info("v2 = " + v2);
//   
  			// if ( enable && !cancel ){
	   	 		// Titanium.API.info("result = " + result);
  				// var audio = Ti.Filesystem.getFile(result);
//   				
// //  				Ti.API.info(JSON.stringify(audio));
//   				
				// app.connect.UploadFile(
	// //				event.media,
					// audio,
					// function(status, data){
						// if (onSuccess) onSuccess(data);						
					// },
					// function(error){
						// app.ind.hide();
						// alert("アップロードできませんでした");
					// }
				// );  				
  			// } 	 		
// 
	    // };
    	// test.start({
           // //typeの指定なしはvideo/*
// //         "type":"*/*", //すべてのファイル
// //                          "type":"image/*", //写真や画像
                          // "type":"audio/mp4", //音声
// //                          "type":"video/*", //動画
    	       // "callback":callback
	    // });
	// }

	// var selectMovieAndroid = function(){
// 			
			// var intent = Titanium.Android.createIntent({ 
                // action: Ti.Android.ACTION_PICK,
            	// type: "video/*"
            // }); //android.media.action.VIDEO_CAPTURE
//  
            // intent.addCategory(Ti.Android.CATEGORY_DEFAULT);
//  
		    // Ti.Android.currentActivity.startActivityForResult(intent, function(e) 
// //            window.activity.startActivityForResult(intent, function(e)
            // {
               	// Ti.API.info("video data "+JSON.stringify(e));
//                	
            	// if (e.error) 
                // {
                	// Ti.UI.createNotification({
                    	// duration: Ti.UI.NOTIFICATION_DURATION_SHORT,
                        // message: 'Error: ' + e.error
                    // }).show();
                // }else{
                	// if (e.resultCode === Titanium.Android.RESULT_OK) 
                    // {
                    	// videoFile = e.intent.data;
//  
                        // var source = Ti.Filesystem.getFile(videoFile);
                        // movieFile = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, 'mymovie.3gp');
                        // source.copy(movieFile.nativePath);
//  
                        // videoFile = movieFile.nativePath;
//  
                        // r.onload = function() {
                        	// var callback = JSON.parse(this.responseText);
//  
                            // if (callback.status == 'ok'){}
                   		// };
//  
                        // xhr.onerror = function(e){};
//  
                        // xhr.onsendstream = function(e){
                        	// Ti.API.info('ControladorTelas - ON SEND STREAM - PROGRESS: ' + e.progress);
                        // };
//  
                        // if(movieFile.exists())
                        // {
                        	// xhr.send({
                            	// video: source,
                            // });
                            // movieFile.deleteFile();
                        // }
                        // else
                        // {}
                  	// } 
                    // else 
                    // {
                    	// Ti.UI.createNotification({
                        	// duration: Ti.UI.NOTIFICATION_DURATION_SHORT,
                            // message: 'Canceled!'
                        // }).show();
//  
                     // }
                 // }
           // });
        // }
