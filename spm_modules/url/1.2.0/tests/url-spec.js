
var Url = require('../url');
var expect = require("expect.js");

describe('url', function() {

  var tests_constructor = [
    ["http://www.example.com", {
      protocol: "http:",
      host: "www.example.com",
      hostname: "www.example.com",
      port: "",
      path: "/",
      search: "",
      hash: ""
    }],
    ["http://www.example.com/", {
      protocol: "http:",
      host: "www.example.com",
      hostname: "www.example.com",
      port: "",
      path: "/",
      search: "",
      hash: ""
    }],
    ["https://www.example.com/path/to/page.html", {
      protocol: "https:",
      host: "www.example.com",
      hostname: "www.example.com",
      port: "",
      path: "/path/to/page.html",
      search: "",
      hash: ""
    }],
    ["http://www.example.com:8080/path/to/page.html?abc=A1&abc=A2", {
      protocol: "http:",
      host: "www.example.com:8080",
      hostname: "www.example.com",
      port: "8080",
      path: "/path/to/page.html",
      search: "?abc=A1&abc=A2",
      hash: ""
    }],
    ["http://user@www.example.com:8080/path/to/page.html?abc=A1&abc=A2#hash", {
      protocol: "http:",
      username: "user",
      password: undefined,
      host: "www.example.com:8080",
      hostname: "www.example.com",
      port: "8080",
      path: "/path/to/page.html",
      search: "?abc=A1&abc=A2",
      hash: "#hash"
    }],
    ["http://user:pass@www.example.com:8080/path/to/page.html?abc=A1&abc=A2#hash", {
      protocol: "http:",
      username: "user",
      password: "pass",
      host: "www.example.com:8080",
      hostname: "www.example.com",
      port: "8080",
      path: "/path/to/page.html",
      search: "?abc=A1&abc=A2",
      hash: "#hash"
    }],
  ];

  tests_constructor.forEach(function(item, index){

    var u = item[0];
    var r = item[1];
    it('constructor: '+u, function() {

      var url = new Url(u);
      expect(url.protocol).to.equal(r.protocol);
      expect(url.username).to.equal(r.username);
      expect(url.password).to.equal(r.password);
      expect(url.host).to.equal(r.host);
      expect(url.hostname).to.equal(r.hostname);
      expect(url.port).to.equal(r.port);
      expect(url.path).to.equal(r.path);
      expect(url.search).to.equal(r.search);
      expect(url.hash).to.equal(r.hash);

    });

  });

  it('get origin', function() {

    var url = new Url("http://www.example.com/path/to/index.html?q=a&u=b&q=c#hash");
    url.protocol = "https:";
    url.hostname = "abc.com";
    url.port = "8080";
    expect(url.getOrigin()).to.equal("https://abc.com:8080");
    expect(url.toString()).to.equal("https://abc.com:8080/path/to/index.html?q=a&q=c&u=b#hash");

  });

  it('get host', function() {

    var url = new Url("http://www.example.com/path/to/index.html?q=a&u=b&q=c#hash");
    url.hostname = "abc.com";
    url.port = "8080";
    expect(url.getHost()).to.equal("abc.com:8080");
    expect(url.toString()).to.equal("http://abc.com:8080/path/to/index.html?q=a&q=c&u=b#hash");

  });

  it('get param', function() {

    var url = new Url("http://www.example.com/path/to/index.html?q=a&u=b&q=c#hash");
    expect(url.getParam("q")).to.equal("a");
    expect(url.getParam("u")).to.equal("b");

  });

  it('get params', function() {

    var url = new Url("http://www.example.com/path/to/index.html?q=a&u=b&q=c#hash");
    var params_q = url.getParams("q");
    expect(params_q.length).to.equal(2);
    expect(params_q[0]).to.equal("a");
    expect(params_q[1]).to.equal("c");

    var params_u = url.getParams("u");
    expect(params_u.length).to.equal(1);
    expect(params_u[0]).to.equal("b");

    var params_x = url.getParams("x");
    expect(params_x.length).to.equal(0);
    expect(params_x[0]).to.equal(undefined);

  });

  it('delete param', function() {

    var url = new Url("http://www.example.com/path/to/index.html?q=a&u=b&q=c#hash");
    expect(url.getParam("q")).to.equal("a");
    url.delParam("q");
    expect(url.getParam("q")).to.equal(null);
    expect(url.toString()).to.equal("http://www.example.com/path/to/index.html?u=b#hash");

  });

  it('set param (add or replace param).', function() {

    var url = new Url("http://www.example.com/path/to/index.html?q=a&u=b&q=c#hash");
    expect(url.getParam("q")).to.equal("a");
    url.setParam("q", "QQQ");
    expect(url.getParam("q")).to.equal("QQQ");
    expect(url.toString()).to.equal("http://www.example.com/path/to/index.html?q=QQQ&u=b#hash");

    expect(url.getParam("x")).to.equal(null);
    url.setParam("x", "XXX");
    expect(url.getParam("x")).to.equal("XXX");
    expect(url.toString()).to.equal("http://www.example.com/path/to/index.html?q=QQQ&u=b&x=XXX#hash");

  });

  it('add param', function() {

    var url = new Url("http://www.example.com/path/to/index.html?q=a&u=b&q=c#hash");
    var params_q = url.getParams("q");
    expect(params_q.length).to.equal(2);
    expect(params_q[0]).to.equal("a");
    expect(params_q[1]).to.equal("c");
    expect(url.toString()).to.equal("http://www.example.com/path/to/index.html?q=a&q=c&u=b#hash");

    url.addParam("q", "QQQ");
    var params_Q = url.getParams("q");
    expect(params_Q.length).to.equal(3);
    expect(params_Q[0]).to.equal("a");
    expect(params_Q[1]).to.equal("c");
    expect(params_Q[2]).to.equal("QQQ");
    expect(url.toString()).to.equal("http://www.example.com/path/to/index.html?q=a&q=c&q=QQQ&u=b#hash");

    url.addParam("q", ["XXX", "YYY", "ZZZ"]);
    var params_z = url.getParams("q");
    expect(params_z.length).to.equal(6);
    expect(params_z[0]).to.equal("a");
    expect(params_z[1]).to.equal("c");
    expect(params_z[2]).to.equal("QQQ");
    expect(params_z[3]).to.equal("XXX");
    expect(params_z[4]).to.equal("YYY");
    expect(params_z[5]).to.equal("ZZZ");
    expect(url.toString()).to.equal("http://www.example.com/path/to/index.html?q=a&q=c&q=QQQ&q=XXX&q=YYY&q=ZZZ&u=b#hash");

  });

  it('clear param', function() {
    var url = new Url("http://www.example.com/path/to/index.html?q=a&u=b&q=c#hash");
    expect(url.getParams("q").length).to.equal(2);
    expect(url.getParams("u").length).to.equal(1);
    expect(url.toString()).to.equal("http://www.example.com/path/to/index.html?q=a&q=c&u=b#hash");
    url.clearParams();
    expect(url.getParams("q").length).to.equal(0);
    expect(url.getParams("u").length).to.equal(0);
    expect(url.toString()).to.equal("http://www.example.com/path/to/index.html#hash");
  });

  it('Url.verify', function() {
    expect(Url.verify("http://www.example.com/path/to/index.html?q=a&u=b&q=c#hash")).to.equal(true);
  });

  it('中文编码', function() {
    var cn = "中文编码";
    var url = new Url("http://www.example.com/path/to/index.html?cn="+encodeURIComponent(cn));
    expect(url.getParam("cn")).to.equal(cn);
    expect(url.toString()).to.equal("http://www.example.com/path/to/index.html?cn="+encodeURIComponent(cn));

    url.addParam("cn2", cn);
    expect(url.getParam("cn2")).to.equal(cn);
    expect(url.toString()).to.equal("http://www.example.com/path/to/index.html?cn="+encodeURIComponent(cn)+"&cn2="+encodeURIComponent(cn));

    url.setParam("cn", cn);
    expect(url.getParam("cn")).to.equal(cn);
    expect(url.toString()).to.equal("http://www.example.com/path/to/index.html?cn="+encodeURIComponent(cn)+
      "&cn2="+encodeURIComponent(cn));

    url.setParam("cn3", cn);
    expect(url.getParam("cn3")).to.equal(cn);
    expect(url.toString()).to.equal("http://www.example.com/path/to/index.html?cn="+encodeURIComponent(cn)+
      "&cn2="+encodeURIComponent(cn) +
      "&cn3="+encodeURIComponent(cn));

    url.delParam("cn3");
    expect(url.getParam("cn3")).to.equal(null);
    expect(url.toString()).to.equal("http://www.example.com/path/to/index.html?cn="+encodeURIComponent(cn)+
      "&cn2="+encodeURIComponent(cn));
  });

});
