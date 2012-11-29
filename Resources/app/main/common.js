
/**
 * 1, 2 など 1桁の数値を 01, 02 などの文字列に変換（2桁以上の数字は単純に文字列型に変換）
 */
function affixZero(int) {
	if (int < 10) int = "0" + int;
	return "" + int;
}
	
/**
 * yyyy-mm-dd 形式の誕生日から年齢を計算
 */
function calculateAge(birthday) {
	var  birth = birthday.split('-'); // birth[0]: year, birth[1]: month, birth[2]: day
	var _birth = parseInt("" + birth[0] + birth[1] + birth[2]);// 文字列型に明示変換後にparseInt
	var  today = new Date();
	var _today = parseInt("" + today.getFullYear() + affixZero(today.getMonth() + 1) + affixZero(today.getDate()));// 文字列型に明示変換後にparseInt
	return parseInt((_today - _birth) / 10000);
}

/**
 * 年月文字列から年齢を取得
 * @param {Object} str
 */
	exports.GetAgeFromBirth = function(str){

		try{
			var age = calculateAge(str);
			
			if ( age < 1) age = 1;
				
			return age;			
		}catch(e){
			Ti.API.info( e+" date error "+str );
			return 1;
		}
	}
