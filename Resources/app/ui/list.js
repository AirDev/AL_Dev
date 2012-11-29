/*
 * リスト表示
 * 
 */
//	var win = Titanium.UI.currentWindow;
//	var data =[];

	exports.createList = function(win){
		
		var mainView;
//		var win = Titanium.UI.currentWindow;
		
		//win.backgroundImage = '../images/tableview/brown_bg_482.png';

		mainView = Ti.UI.createTableView({
	
//			borderColor:	'#0000ff',
//			backgroundImage:	'/images/tableview/brown_bg_482.png',
			backgroundColor:	'transparent',
//			data:data,
//			separatorStyle:Ti.UI.iPhone.TableViewSeparatorStyle.NONE,
			editable: true,
			top:10,
			bottom:70
		});
		
		win.add(mainView);
		
		return mainView;
	}
/*
 * tablerawデータを外部で作成し、追加する
 */
exports.setData = function(list, data){
	
//	Ti.API.info("list size"+data.length +" "+JSON.stringify(data));
	
	list.setData(data);
}

exports.addEventListener = function(list, func){
	list.addEventListener('click', func);
}

