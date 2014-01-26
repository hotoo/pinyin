seajs.use(['$'], function($) {

  $(function(){
    $('.highlight').on('click', '.code-toggle', function() {
      var pre = $(this).parents('.highlight')
      if (pre.hasClass('collapse')) {
        pre.removeClass('collapse')
        $(this).text('收起')
      } else {
        pre.addClass('collapse')
        $(this).text('展开')
      }
      return false
    });

    $('h4 em, h3 em, h3 code, h4 code').parent().addClass('doc-api');
    // 给 iframe 加链接
    $('.nico-iframe').each(function(i, item) {
      var src = $(item).find('iframe').attr('src')
      var html = '<a class="new-window" target="_blank" href="' + src + '">新窗口打开</a>'
      $(item).append(html)
    });
    // 给 code 加收起和展开
    $('.highlight').each(function(i, item) {
      var $item = $(item)
      if ($item.height() > 400) {
        $item.append('<a class="code-toggle" href="#">展开</a>')
        $item.addClass('collapse')
      }
    });
  });

});

seajs.use(['$', 'arale/popup/1.1.3/popup', 'gallery/underscore/1.4.4/underscore'], function($, Popup, _) {

  if ($('#sidebar-wrapper').length === 0) {
    return;
  }

  var family = $('#sidebar-wrapper h1 sup a').html();
  var name = $('#sidebar-wrapper h1 > a').html();
  name = (name || '').toLowerCase();
  var version = $('#sidebar-wrapper .version a').html();
  version = (version || '').toLowerCase();

  new Popup({
    trigger: '#maintainers',
    template: '<div class="popup-install">强烈建议提交 issue 交流（点击上方[讨论]），您会得到更高质量的反馈。</div>',
    effect: 'fade',
    width: 210,
    align: {
      baseXY: [0, '100%+5']
    }
  });

  // output card
  if ($('#module-output')[0] && Popup) {
    new Popup({
      trigger: '#module-output li a',
      element: '#output-card',
      effect: 'fade',
      beforeShow: function() {
        var file = this.activeTrigger.data('file');
        file = file.replace('./', '').replace('.js', '');
        this.element.find('#output-file').html(file)
        .attr('href', this.activeTrigger.attr('href'));
      }
    });
  }

  // 本地调试时直接返回
  if (location.port) {
    return;
  }

  // version document link
  var versionJsonLink,
    versionDocLink, lastestLink;
  if (family === 'arale') {
    versionJsonLink = 'https://spmjs.org/repository/' + family + '/' + name + '/?define';
    versionDocLink = 'http://aralejs.org/+/' + name + '/';
    lastestLink = 'http://aralejs.org/' + name + '/';
  } else {
    versionJsonLink = 'http://yuan.alipay.im/repository/'+family+'/'+name+'/?define';
    versionDocLink = 'http://arale.alipay.im/+/' + family +'/' + name + '/';
    lastestLink = 'http://arale.alipay.im/' + family +'/' + name + '/';
  }

  seajs.use(versionJsonLink, function(package) {
    if (!(package && package.packages)) return;

    var versions = _.keys(package.packages);
    versions = _.without(versions, version);

    if (versions.length > 0) { 
      var template = '<ul class="other-versions">';
      template += '<li class="other-versions-title"><a href="'+lastestLink+'">最新版本</a></li>';
      for (var i=0; i<versions.length; i++) {
        template += '<li><a href="' + versionDocLink + versions[i] +'/">'
          + versions[i] + '</a></li>';
      }
      template += '</ul>';

      new Popup({
        trigger: '.version a',
        template: template,
        effect: 'fade',      
        align: {
          baseXY: [0, '100%']
        }
      });
    };
  });

  // google analytics
  var project = $('#sidebar-wrapper h1 > a').text();  
  $('#footer-wrapper a').click(function() {
    _gaq.push(['_trackEvent', 'Link', 'Footer', $(this).text()]);
  });
  $('.source').click(function() {
    _gaq.push(['_trackEvent', 'Link', 'Button', project]);
  });
  $('a[href^="https://travis-ci.org/aralejs/"]').click(function() {
    _gaq.push(['_trackEvent', 'Link', 'Travis', project]);
  });
  $('.test-link').click(function() {
    _gaq.push(['_trackEvent', 'Link', 'Test', project]);
  });
  $('.issue-link').click(function() {
    _gaq.push(['_trackEvent', 'Link', 'Issue', project]);
  });
});
