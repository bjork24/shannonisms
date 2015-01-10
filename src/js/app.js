(function(doc, win){

  'use strict';

  // options
  var opts = {
    cache  : {},
    quotes : [],
    title  : 'Shannonisms',
    yield  : doc.querySelectorAll('#js-yield')[0]
  };

  // public router method
  var router = function() {
    // grab all quotes and cache them
    get('quotes', function(data) {
      opts.quotes = data.quotes;
      // now that data is cached, execute routing
      page('/', controller.index);
      page('/submit', controller.submit);
      page('/disclaimer', controller.disclaimer);
      page('/quotes', controller.quotes.index);
      page('/quote/:id', controller.quotes.entry);
      page('*', controller.notFound);
      page({ hashbang: true });
    });
  };

  // private controller method
  var controller = {
    index : function() {
      get('partials/index', function(html) {
        opts.yield.innerHTML = html;
      });
    },
    submit : function() {
      console.log('submit');
    },
    disclaimer : function() {
      console.log('disclaimer');
    },
    notFound : function() {
      console.log('404');
    },
    quotes : {
      index : function() {
        console.log('quote index');
      },
      entry : function(ctx) {
        console.log('quote entry');
      }
    }
  };

  // return random or id quote
  var getQuote = function(id) {
    
  };

  // get method for partials and data
  var get = function(file, cb) {
    var ext = ( file.indexOf('partials') !== -1 ) ? 'html' : 'json' ;
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
  };

  // simple undefined check
  function isUndef(o) { return typeof o === 'undefined'; }

  return {
    router : router
  };

}(document, window)).router();