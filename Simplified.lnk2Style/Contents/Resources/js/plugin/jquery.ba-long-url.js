/*!
 * longUrl - v0.1 - 6/16/2009
 * http://benalman.com/code/test/jquery-long-url/
 * 
 * Copyright (c) 2009 "Cowboy" Ben Alman
 * Licensed under the MIT license
 * http://benalman.com/about/license/
 * 
 * Utilizes the http://www.longurlplease.com/ API
 */

// Change the title and href of shortened URLs into their original long URL.
// 
// options:
//  
//  lengthen (Function) - called for each URL when the ajax return completes.
//    arguments are the fetched long url and the request short url.
//  
//  fetch (Function) - called to make the actual request. If you want to use a
//    different URL lengthening service, override this function. Just be sure to
//    call 'callback' once for each link returned, passing it the href and 
//    long_url params.
//  
//  strip_www (Boolean) - default: true - change any leading http://www. to
//    http:// before fetching long URLs.
//  
//  max (Number) - default: 10 - maximum number of long url params the service
//    will accept.
//  
//  delay (Number) - default: 100 - if links are processed slowly, this will
//    help to combine multiple long url requests into one (assuming max > 1)

(function($){
  '$:nomunge'; // Used by YUI compressor.
  
  var elems = {},
    cache = {},
    queue = [],
    timeout_id,
    
    default_options = {
      
      lengthen: function( long_url, short_url ) {
        long_url && this.attr({ title: long_url, href: long_url });
      },
      
      fetch: function( queue, callback ) {
        var params = { q: queue },
          url = 'http://www.longurlplease.com/api/v1.1?callback=?';
        
        $.getJSON( url, params, function( data ) {
          for ( var key in data ) {
            callback( data[ key ], key );
          }
        });
      },
      
      strip_www: true,
      max: 10,
      delay: 100
    };
  
  $.fn.longUrl = function( options ) {
    options = $.extend( {}, default_options, options );
    
    return this.each(function(){
      var that = $(this),
        href = that.attr( 'href' );
      
      if ( !href || !/^http:\/\//i.test( href ) ) { return; }
      
      if ( options.strip_www ) {
        href = href.replace( /^http:\/\/www\./i, 'http://' );
      }
      
      if ( cache[ href ] ) {
        options.lengthen.call( that, cache[ href ], href );
        that.attr( 'title', cache[ href ] );
      } else {
        queue.indexOf( href ) === -1 && queue.push( href );
        elems[ href ] = elems[ href ] ? elems[ href ].concat( this ) : [ this ];
      }
      
      if ( queue.length ) {
        timeout_id && clearTimeout( timeout_id );
        if ( queue.length === options.max ) {
          fetch( options );
        } else {
          timeout_id = setTimeout( fetch, options.delay, options );
        }
      }
    });
  };
  
  function fetch( options ){
    options.fetch( queue, function( long_url, href ){
      options.lengthen.call( $( elems[ href ] ), long_url, href );
      
      delete elems[ href ];
    });
    
    queue = [];
  };
  
})(jQuery);