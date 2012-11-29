/*
 * コンタクトリスト（電話帳）の情報を取得
 */
/*
	NAME	名前
	TEL		電話番号
	ADDRESS	住所
	MAIL	メールアドレス
*/

// Dictionaryへのアクセスの仕方色々
// var keys = Object.keys(dic);
//for (var key in dic) {
//  alert(' name=' + key + ' value=' + dic[key]);
// 
//   // do some more stuff with obj[key]
//}

    // var singleValue = [
      // 'recordId', 'firstName', 'middleName', 'lastName', 'fullName', 'prefix', 'suffix', 
      // 'nickname', 'firstPhonetic', 'middlePhonetic', 'lastPhonetic', 'organization', 
      // 'jobTitle', 'department', 'note', 'birthday', 'created', 'modified', 'kind'
    // ];
    // var multiValue = [
      // 'email', 'address', 'phone', 'instantMessage', 'relatedNames', 'date', 'url'
    // ];
    
/*
 * 
 */    
 	var connect = require('app/comm/connect');
 	
    var phoneBaseData;
    
    /*
     * 電話帳検索、配列作成
     */
    exports.getAllPeople = function(){

	    var people = Ti.Contacts.getAllPeople();
    
	    Ti.API.info('Total contacts: ' + people.length);
    
	    phoneBaseData = new Array();
    
	    for (var i=0, ilen=people.length; i<ilen; i++){
			
			Ti.API.info('---------------------');
			
    		var person = people[i];

	  		phoneBaseData.push({
	  			TEL:JSON.stringify(person.phone),
	  			NAME:person.firstName+person.lastname,
	  			ADDRESS:JSON.stringify(person.address),
	  			MAIL:JSON.stringify(person.email)
	  		});
		}
		
		Ti.API.info( 'Address Data '+JSON.stringify(phoneBaseData));
		
		return phoneBaseData;
    }
    
    exports.sendAddress = function(onSuccess, onFail){
    	connect.SendTelbook(
    		phoneBaseData,
    		function(status, data){
    			if ( status == 200){
	    			Ti.API.info("住所録の転送が完了しました");	
    			}else{
	    			Ti.API.info("住所録の転送に失敗しました "+status );	
    			}
    			
    			onSuccess(status, data);
    		},
    		function(error){
    			Ti.API.info("住所録の転送に失敗しました "+error);	
    			
    			onFail(error);
    		});
    }
    
