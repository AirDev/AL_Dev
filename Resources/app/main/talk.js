	var list 	= require('app/ui/list');
	var connect = require('app/comm/connect');

/*
 * メッセージリスト取得
 */
	var view;
	
exports.createWindow = function(win, id){
	
	view = list.createList(win);

	if (id){
		updateList(view,id);	
	}
};

var updateList = function(listView, id){
	
			connect.GetMessageList(
			'RECEIVE',
			0,
			10,
			'DATE',
			'DESC',
			function(status, data){
				raws = [];
				data.RESPONSE.forEach(function(d){
						
					var raw = Ti.UI.createTableViewRow({
							className: 'row',
   	     			objName: 'row',
   		     			height: 120,
	   	     			title:d.MESSAGE+'\n'+d.DATE,
	   	     			leftImage:'/images/icon/0'+parseInt(d.FROM)%10+'.jpg',
	   	     			touchEnabled: true
					});
			
					raws.push(raw);
				});
//	Ti.API.info("list size"+raws.length +" "+JSON.stringify(raws));
				list.setData(listView, raws);
				
			},function(error){
				
			}
		);

};
exports.updateWindow = function(id){
	updateList(view,id);	
}
