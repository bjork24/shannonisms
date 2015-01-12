(function(doc){

  'use strict';

  // options
  var opts = {
    cache     : {},
    quotes    : [],
    title     : 'Shannonisms',
    yield     : doc.querySelectorAll('#js-yield')[0],
    quoteLink : doc.querySelectorAll('#js-quote-link')[0]
  };

  // public router method
  var router = function() {
    // grab all quotes and cache them
    get('quotes', function(data) {
      opts.quotes = data.quotes;
      // now that data is cached, execute routing
      page('/', controller.index);
      page('/submit', controller.page);
      page('/disclaimer', controller.page);
      page('/thanks', controller.page);
      page('/quotes', controller.quotes.index);
      page('/quote/:id', controller.quotes.entry);
      page('*', controller.page);
      page({ hashbang: true });
    });
  };

  // private controller method
  var controller = {
    index : function() {
      opts.yield.innerHTML = getQuote();
    },
    page : function(ctx) {
      ctx.path = ( ['/submit', '/disclaimer', '/thanks'].indexOf(ctx.path) >= 0 ) ? ctx.path : '/404' ;
      get('partials' + ctx.path, function(html) {
        opts.yield.innerHTML = html;
        setQuoteLink();
      });
    },
    quotes : {
      index : function() {
        get('partials/quotes', function(html) {
          opts.yield.innerHTML = html;
          console.log(opts);
        });
      },
      entry : function(ctx) {
        opts.yield.innerHTML = getQuote(ctx.params.id);
      }
    }
  };

  // return random or id quote
  var getQuote = function(id) {
    if ( isUndef(id) ) {
      opts.qId = Math.floor(Math.random()*opts.quotes.length);
      setQuoteLink(opts.qId);
    } else {
      opts.qId = parseInt(id);
      setQuoteLink();
    }
    return opts.quotes[opts.qId];
  };

  // set the quote link
  var setQuoteLink = function(id) {
    if ( isUndef(id) ) {
      opts.quoteLink.innerHTML = 'New quote';
      opts.quoteLink.setAttribute('href', '/');
    } else {
      opts.quoteLink.innerHTML = 'Quote #' + id;
      opts.quoteLink.setAttribute('href', '/quote/' + id);
    }
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

  // return the only public methodaaaa
  return {
    router : router
  };

}(document)).router();