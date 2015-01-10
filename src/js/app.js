(function(doc, win){

  'use strict';

  // options
  var opts = {
    cache     : {},
    title     : 'The Moxie Blog',
    yield     : doc.querySelectorAll('#js-yield')[0],
    navToggle : doc.querySelectorAll('#js-nav-toggle')[0],
    openNav   : 'open-nav',
    dateField : 'created_at'
  };

  // public router method
  var router = function() {
    page('/', controller.index);
    page('/about', controller.about);
    page('/guestbook', controller.guestbook);
    page('/moxietv', controller.moxietv.index);
    page('/moxietv/:id', controller.moxietv.entry);
    page('/phlog', controller.phlog.index);
    page('/phlog/:id', controller.phlog.entry);
    page('/archive', controller.blog.archive);
    page('/archive/:year', controller.blog.archive);
    page('/author/:id', controller.blog.author);
    page('/category/:id', controller.blog.category);
    page('/post/:id', controller.blog.entry);
    page('*', controller.notFound);
    page({ hashbang: true });
  };

  // private controller method
  var controller = {
    index : function() {
      render({ partial : 'partials/index' });
    },
    guestbook : function() {
      render({ partial : 'partials/guestbook', json : 'data/guestbook', title : 'Guestbook' });
    },
    about : function() {
      render({ partial : 'partials/about', title : 'About the Moxie Blog' });
    },
    phlog : {
      index : function() {
        render({
          partial    : 'partials/phlog/index',
          json       : 'data/phlogs/index',
          title      : 'Phlog'
        });
      },
      entry : function(ctx) {
        render({
          partial    : 'partials/phlog/entry',
          json       : 'data/phlogs/' + ctx.params.id,
          title      : 'Phlog',
          titleJson  : 'title'
        });
      }
    },
    moxietv : {
      index : function() {
        render({
          partial    : 'partials/moxietv/index',
          json       : 'data/moxietv/index',
          title      : 'Moxie TV',
          dateFormat : 'mdy'
        });
      },
      entry : function(ctx) {
        render({
          partial    : 'partials/moxietv/entry',
          json       : 'data/moxietv/' + ctx.params.id,
          title      : 'Moxie TV',
          dateFormat : 'mdy',
          titleJson  : 'title'
        });
      }
    },
    blog : {
      archive : function(ctx) {
        var year = parseInt(ctx.params.year) || 2004;
        title(['Archive']);
        archive.byYear(year);
      },
      author : function(ctx) {
        archive.byId(ctx.params.id, 'author');
      },
      category : function(ctx) {
        archive.byId(ctx.params.id, 'category');
      },
      entry : function(ctx) {
        render({
          partial    : 'partials/blog/entry',
          json       : 'data/posts/' + ctx.params.id,
          titleJson  : 'title'
        });
      }
    },
    notFound : function() {
      render({ partial : 'partials/404', title : 'Not found' });
    }
  };

  // build archive page by year
  var archive = {
    byYear : function(year) {
      var archiveData = { 'year' : year, 'months' : [] };
      get('data/archive/year/' + year, function(data) {
        for ( var month in data ) {
          var monthInt = parseInt(month) - 1;
          if ( data[month].length ) {
            var d = new Date(year, monthInt);
            var comments = 0;
            for ( var i = 0, len = data[month].length; i < len; i++ ) {
              comments += data[month][i].comments;
            }
            var collection = {
              date : time(d, 'my'),
              count : data[month].length,
              comments : comments,
              posts : data[month] 
            };
            archiveData.months.push(collection);
          }
        }
        get('partials/blog/archive', function(html) {
          opts.yield.innerHTML = Mustache.render(html, archiveData);
          win.scrollTo(0,0);
        });
      });
    },
    byId : function(id, type) {
      var archiveData = { 'months' : [] };
      get('data/archive/' + type + '/' + id, function(data) {
        for ( var month in data ) {
          if ( month === 'name' || month === 'desc' ) { continue; }
          var comments = 0;
          for ( var i = 0, len = data[month].length; i < len; i++ ) {
            comments += data[month][i].comments;
          }
          var collection = {
            date : month,
            count : data[month].length,
            comments : comments,
            posts : data[month] 
          };
          archiveData.months.push(collection);
        }
        if ( type === 'author' ) {
          title(['Posts by ' + data.name]);
          archiveData.name = data.name;
        } else if ( type === 'category' ) {
          title(['Posts about ' + data.name]);
          archiveData.name = data.name;
          archiveData.desc = data.desc;
        }
        get('partials/blog/' + type, function(html) {
          opts.yield.innerHTML = Mustache.render(html, archiveData);
          win.scrollTo(0,0);
        });
      });
}
};

  // get method for partials and data
  function get(file, cb) {
    var ext = ( file.indexOf('data') !== -1 ) ? 'json' : 'html' ;
    var hash = file.replace('/','').replace('.','');
    if ( !isUndef(opts.cache[hash]) ) {
      cb(opts.cache[hash]);
    } else {
      file = file + '.' + ext;
      var rq = new XMLHttpRequest();
      rq.open('GET', file, true);
      rq.onload = function() {
        if ( rq.status >= 200 && rq.status < 400 ) {
          var data = ( ext === 'json' ) ? JSON.parse(rq.responseText) : rq.responseText ;
          opts.cache[hash] = data;
          cb(data);
        } else {
          throw 'Server error!';
        }
      };
      rq.onerror = function() { throw 'Connection error!'; };
      rq.send();
    }
  }

  // render templates
  function render(o) {
    var titleArr = [];
    titleArr.push(o.title);
    if ( isUndef(o.json) ) {
      get(o.partial, function(html) { opts.yield.innerHTML = html; });
    } else {
      get(o.partial, function(template) {
        get(o.json, function(json) {
          json.time = function() {
            var format = o.dateFormat || '' ;
            return time(this[opts.dateField], format);
          };
          json.cleanBody = function() {
            return this.body.replace(/\r\n/g,'<br/>');
          };
          opts.yield.innerHTML = Mustache.render(template, json);
          if ( !isUndef(o.titleJson) ) {
            titleArr.push(json[o.titleJson]);
            title(titleArr);
          }
          if ( !isUndef(o.success) ) { o.success(json); }
        });
      });
    }
    title(titleArr);
    win.scrollTo(0,0);
  }

  // switch page title
  function title(arr) {
    arr = arr.filter(function(n) { return n !== undefined; });
    if ( arr.length && arr[0] !== opts.title ) { arr.unshift(opts.title); }
    doc.title = ( arr.length ) ? arr.join(' | ') : opts.title ;
  }

  // simple undefined check
  function isUndef(o) { return typeof o === 'undefined'; }

  // convert timestamp
  function time(stamp, format) {
    var d = new Date(stamp);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var month = months[d.getMonth()];
    var day = d.getDate();
    var year = d.getFullYear();
    var hours = d.getHours() + 1;
    var hour = ( hours > 12 ) ? hours - 12 : hours ;
    var mins = d.getMinutes() + 1;
    mins = ( mins < 10 ) ? '0' + mins : mins ;
    var am = ( hours >= 12 ) ? 'p' : 'a' ;
    if ( format === 'my' ) { return month + ' ' + year; }
    else if ( format === 'mdy' ) { return month + ' ' + day + ', ' + year; }
    else { return month + ' ' + day + ', ' + year + ' @ ' + hour + ':' + mins + am; }
  }

  // events 
  function events() {
    opts.navToggle.addEventListener('click', function() {
      this.parentNode.classList.toggle(opts.openNav);
    });
    var navLinks = doc.querySelectorAll('.m-nav li a');
    var closeNav = function(){
      var el = opts.navToggle;
      var nav = el.parentNode;
      if ( el.onclick && nav.classList.contains(opts.openNav) ) {
        el.onclick();
      } else if ( el.click && nav.classList.contains(opts.openNav) ) {
        el.click();
      }
    };
    for(var i = 0, len = navLinks.length; i < len; i++) {
      navLinks[i].addEventListener('click', closeNav);
    }
  }

  // bind events on doc ready
  doc.addEventListener('DOMContentLoaded', function(){
    events();
  });

  // return public api
  return {
    router : router
  };

}(document, window)).router();