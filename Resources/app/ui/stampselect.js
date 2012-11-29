	var wrk		= require('app/main/work');

exports.createWindow = function(stampList, onSelect){
	
	var scale 		= wrk.GetScale();
	
	var page = 0;
	
	var sWin = Ti.UI.createWindow({
		bottom:		200*scale,
		width:		400*scale,
		height:		200*scale
	});
	
	var backBtn = Ti.UI.createButton({
		right:	2,
		top:	2,
		title:	'戻る'
	});
	backBtn.addEventListener('click', function(e){
		sWin.close();
	});
	sWin.add(backBtn);
					
	var scrollView = Titanium.UI.createScrollView({
	    contentWidth:	stampList[page].length*102*scale,
	    contentHeight:	140*scale,
	    top:			60*scale,
	    height:			140*scale,
		width:			400*scale,
		borderRadius:	10,
		backgroundColor:'#13386c'
	});
	sWin.add(scrollView);
	
	for(var i=0; i<stampList[page].length; i++){
		var iv = Ti.UI.createImageView({
			left:	i*102*scale,
			width:	100*scale,
			height:	100*scale,
					
			image:	stampList[page][i]
		});
		
		iv.addEventListener('click', function(e){
//			alert("scroll click "+(e.source.left/(102*scale)));
			sWin.close();
			onSelect({INDEX:e.source.left/(102*scale), PAGE:page});
		});
				
		scrollView.add(iv);					
	}			
	sWin.open();			
};
		
