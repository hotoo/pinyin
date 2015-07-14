# 演示文档

---

<style>
textarea{width:90%; height:100px;}
</style>

### 输入[汉字](?han=简体中文汉字)

<div>
  <textarea id="input"></textarea>
</div>

### 输出

<div>
  <input type="radio" name="style" id="style-normal" value="STYLE_NORMAL" />
  <label for="style-normal">普通风格</label>
  <input type="radio" name="style" id="style-tone" value="STYLE_TONE" checked />
  <label for="style-tone">声调风格</label>
  <input type="radio" name="style" id="style-tone2" value="STYLE_TONE2" />
  <label for="style-tone2">音标风格</label>
  <input type="radio" name="style" id="style-initials" value="STYLE_INITIALS" />
  <label for="style-initials">声母风格</label>
  <input type="radio" name="style" id="style-first-letter" value="STYLE_FIRST_LETTER" />
  <label for="style-first-letter">首字母风格</label>
</div>
<div>
  <textarea readonly id="output"></textarea>
</div>


<script type="text/spm">
var pinyin = require('pinyin');
var Url = require('url');

var $ = function(id){return document.getElementById(id);}
var styles = document.getElementsByName("style");
var han = new Url(location.href).getParam("han");

function build(){
  var han = $("input").value;
  var style = "STYLE_TONE";
  for(var i=0,l=styles.length; i<l; i++){
    if(styles[i].checked){
      style = styles[i].value;
    }
  }
  $("output").value = pinyin(han, {
    style: pinyin[style]
  }).join(" ");
};

$("input").onkeyup = build;
for(var i=0,l=styles.length; i<l; i++){
  styles[i].onclick = build;
}

$("input").value = han;
build();
</script>
