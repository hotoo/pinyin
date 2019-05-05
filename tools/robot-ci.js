 /**
 * @overview
 *
 * @author 闲耘™ (hotoo.cn[AT]gmail.com)
 * @version 2013/01/27
 */

var remote = require("./remote");
var URLEncoder = require("./urlencode");
// 分词程序的词库。
var WORDS = require("./data-phrases");
var PINYIN_DICT = require("../src/pinyin-dict.js");

var dict = [];
checkWords:
for(var i=0 ,word,l=WORDS.length; i<l; i++){
  word = WORDS[i];
  for(var j=0,zi,m=word.length; j<m; j++){
    zi = word[j];
    // 是多音字
    if(PINYIN_DICT.hasOwnProperty(zi) &&
      PINYIN_DICT[zi].indexOf(",") > 0){
        dict.push(word);
        break;
        //continue checkWords;
    }
  }
}
console.log(dict.length);


// 从快典网查询，带注音的 GBK 编码拼音，Iconv 无法正常转换编码，
// 而其注音格式参数无效，未完成。
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

function trim(str){
  return str.replace(/^\s+/, '').replace(/\s+$/, '');
}

// 各个汉字的读音独立存储。
var PINYIN_DATA = {};
// 同音字合并存储。
var PINYIN_DATA_MIXED = {};
var counts = 0;
function getPinyinDict(han){
  remote("http://zi.artx.cn/ci/search/?dsearch_kind=1&dsearch_main="+
    encodeURIComponent(han)+"&x=0&y=0", "POST", function(html){
      var py_start = '<div class="ci_title">';
      var py_middle = '<br>'
      var py_end = '</div>';
      var idx = html.indexOf(py_start);
      var idx1 = html.indexOf(py_middle, idx);
      var idx2 = html.indexOf(py_end, idx);
      if(idx < 0){
        return;
      }else{
        var s_py = html.substring(idx1+py_middle.length, idx2);
        s_py = trim(s_py);
        if(s_py===""){return;}
        s_py = s_py.replace(/\s{2,}/g, " ");
        var a_py = s_py.split(" ");
        PINYIN_DATA[han] = a_py;
        console.log('"'+han+'": ["'+a_py.join('", "')+'"],');
      }

      counts++;
      // finished.
      // XXX: 前面有 return, 这里可能无法得到执行。
      if(WORDS.length === counts){
        //console.log(JSON.stringify(PINYIN_DATA));
      }
    },
    function(response){
    }
  );
}

function chunk(array, process, context){
    var items = array.concat();   //clone the array
    var delay = 15;
    setTimeout(function(){
        var item = items.shift();
        process.call(context, item);

        if (items.length > 0){
            setTimeout(arguments.callee, delay);
        }
    }, delay);
}

chunk(dict, getPinyinDict);

//for(var i=0,l=dict.length; i<l; i++){
  //getPinyinDict(dict[i]);
//}
