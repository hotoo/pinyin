/**
 * @overview
 *
 * @author 闲耘™ (hotoo.cn[AT]gmail.com)
 * @version 2011/12/08
 */

var HTTP = require("http"),
    HTTPS = require("https"),
    Buffer = require('buffer').Buffer,
    Iconv = require("iconv").Iconv,
    URL = require("url");

/**
 * 从第三方数据提供商处取数据。
 * @param {String} url, 完整的 URL 地址，包括：协议，主机，端口，路径，参数。必须。
 * @param {Function} callback, 请求回调处理函数，可选但推荐。
 * @param {String} method, 请求方式：GET, POST.
 */
function remote(url, type, callback, errorback){
    var uri = URL.parse(url),
        method = (type || "GET").toUpperCase(),
        options = {
            host: uri.hostname,
            port: uri.port ||("https:"==uri.protocol ? "443" : "80"),
            path: uri.pathname + (uri.search || ""),
            method: method,
            headers: {
              //"Referer": "http://py.kdd.cc/index.asp"
              "Referer": "http://zi.artx.cn/zi/search/",
              "Origin": "http://zi.artx.cn",
              "Content-Type": "application/x-www-form-urlencoded",
              "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.56 Safari/537.17"
            }
        },
        req;

    var re_abs_url = /^https?:\/\//;
    function requestHandler(res){
        var buf=[], size=0;
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            buf.push(chunk);
            size += chunk.length;
        }).on("end", function(){
            //var buffer = new Buffer(size),
                //pos = 0;
            //for(var i=0,l=buf.length; i<l; i++){
                //new Buffer(buf[i]).copy(buffer, pos);
                //pos += buf[i].length;
            //}

            //var gbk2utf8 = new Iconv("GBK", "UTF-8//TRANSLIT//IGNORE");
            //var utf82gbk = new Iconv("UTF-8", "GBK//TRANSLIT//IGNORE");
            //var content = buf.join('');
            //content = gbk2utf8.convert(content).toString();
            //content = utf82gbk.convert(content).toString();
            var content = buf.join("");
            if(200==res.statusCode){
                if("function" == typeof callback){callback(content, res);}
            }else if(301==res.statusCode || 302==res.statusCode){
              var loc = res.headers["location"];
              loc = URL.resolve(url, loc);
              //console.log("redirect:", loc);
              remote(loc, "GET", callback, errorback);
            }else{
                if("function" == typeof errorback){errorback(res);}
                console.error('problem with request: ' + url + ' ' + res.statusCode);
            }
        });
    }
    if("https:" == uri.protocol){
        req = HTTPS.request(options, requestHandler);
    }else if("http:" == uri.protocol){
        req = HTTP.request(options, requestHandler);
    }

    req.on('error', function(e) {
        if("function" == typeof errorback){errorback(e);}
        console.error('problem with request: ' + url + e.message);
    });

    if(options.method === "POST"){
      var data = uri.search.replace(/^\?/, "");
      req.write(data);
    }
    req.end();
};

module.exports = remote;
