
//var remote = require("./remote");
//var URLEncoder = require("./urlencode");
var request = require("request");

var SERVER = "http://zi.artx.cn";

// 各个汉字的读音独立存储。
// 同音字合并存储。

function getPinyinDict(han){
  request(SERVER + "/zi/search/?dsearch_kind=1&dsearch_kind2=on&dsearch_main="+
      encodeURIComponent(han), "GET", function(error, response, html){
        if(error || response.statusCode !== 200){
          console.error("404, Not Found. 0", han);
          return;
        }

        var re_zi = /<div class="search_bushou"><div class="title">总笔划 \d+ 画：<\/div><a href="([^"]+)" target="_blank">.+<\/a><\/div>/;
        var m = html.match(re_zi);
        if(m && m[1]){
          var url = m[1];

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
        }else{
          console.error("404, Not Found. 3", han);
        }
      }
  );
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


// @param {Array} hans 汉字集合。
exports.dict = function(hans){
  chunk(hans, getPinyinDict);
};


// 从快典网查询，带注音的 GBK 编码拼音，Iconv 无法正常转换编码，
// 而其注音格式参数无效，未完成。
// @deprecated
function getKDDPinyinDict(han){
  remote("http://py.kdd.cc/index.asp?zy=1&u=3&dy=red&ps=gray&zs=blue&kd=55&wz="+
      URLEncoder.encode(han), "POST", function(html){
        var py_start = "<font color=gray>";
        var py_end = "</font>";
        var idx = html.indexOf(py_start);
        var idx2 = html.indexOf(py_end, idx);
        if(idx < 0){
          console.log(han, "No Found.")
    return;
        }
        console.log(han, ":", html.substring(idx+py_start.length, idx2));
        //console.log(html);
      }, function(response){
      });
}
