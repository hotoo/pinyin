// 汉典网字典抓取工具。

var request = require("request");

var SERVER = "http://www.zdic.net";
var DETAIL_URL = "http://www.zdic.net/z/${FOLDER}/js/${UNICODE}.htm";

// 汉典网字典分目录存储，一个目录存储 1000个字库。
function getFolder(number){
  return Math.ceil(number / 1000).toString(16);
}

// 各个汉字的读音独立存储。
// 同音字合并存储。

// @param {Number} hanCode 汉字编码。
//        hanCode = encodeURIComponent(han)
//        han = String.fromCharCode(hanCode)
function getPinyin(hanCode){
  var han = String.fromCharCode(hanCode);
  var folder = getFolder(hanCode);
  var haxCode = hanCode.toString(16);
  var url = SERVER + "/z/" + folder + "/js/" + haxCode + ".htm";

  haxCode = "0x" + haxCode;

  request(url, function(error, response, html){
    if(error || response.statusCode !== 200){
      console.error("404, Not Found.", haxCode, han, url);
      return;
    }

    var re_py = /<span class="dicpy"><a href="\/z\/pyjs\/\?py=[^"]+" target="_blank">([^<]+)<\/a>/g;
    var m;
    var py = [];
    while(m = re_py.exec(html)){
      py.push(m[1]);
    }
    if(py.length === 0){
      console.error("404, Not Matched.", haxCode, han, url);
    }else{
      console.log('dict[' + haxCode + '] = "' + py.join(",") + '"; /* ' + han + ' */');
    }
  });
}


var START = 0x3400;
var END = 0x2A599;

for(var i=START; i<=END; i++){
  getPinyin(i);
}




// 分时处理数组的每一项数据。
// @param {Array} array, 待处理的数值数据。
// @param {Function} process, 处理过程。
// @param {Object} 处理过程和回调函数中 this 指向的上下文。
// @param {Function} 分时处理完成的回调函数。
function chunk(array, process, context, callback){
  var items = array.concat();   //clone the array
  var delay = 25;

  setTimeout(function(){
    var item = items.shift();
    process.call(context, item);

    if(items.length > 0){
      setTimeout(arguments.callee, delay);
    }else{
      callback && callback.call(context);
    }
  }, delay);
}

function getPinyinDict(han){
  request.post(SERVER + "/sousuo/?lb_a=hp&lb_b=mh&lb_c=mh&tp=tp1&q=" + encodeURIComponent(han), function(error, response, html){
        if(error || response.statusCode !== 302){
          console.error("404, Not Found. 0", han);
          return;
        }

        var url = response.headers.location;

        request(SERVER + url, function(err, res, body){

          if(error || response.statusCode !== 200){
            console.error("404, Not Found 1.", han);
            return;
          }

          var re_py = /<div><span>拼音：([^<]+)<\/span>/;
          var m_py = body.match(re_py);
          if(m_py && m_py[1]){

            var py = m_py[1];
            console.log('"' + han + '": "' + py + '",');

          }else{
            console.error("404, Not Found. 2", han);
          }

        });
      }
  );
}
