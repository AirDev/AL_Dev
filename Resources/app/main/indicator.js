
var actInd;


	exports.createIndicator = function(text){
		
		if ( !actInd ){
			actInd = Titanium.UI.createActivityIndicator({
				message:	text,
				bottom: 	2, 
				height: 	50,
				width: 		10,
				style:Titanium.UI.iPhone.ActivityIndicatorStyle.BIG
			});
			
		}else{
			actInd.message = text;
		}
		
		actInd.show();
	}
	
	exports.setText = function(text){
		if(actInd){
			actInd.show();
			actInd.message = text;
		}
	}
	exports.hide = function(){
		
		if ( actInd ){
			actInd.hide();			
		}
	}
