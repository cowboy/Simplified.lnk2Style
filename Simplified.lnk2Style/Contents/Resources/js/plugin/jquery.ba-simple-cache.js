/*!
 * $imple Cache - v0.2 - 6/29/2009
 * http://benalman.com/code/javascript/jquery/jquery.ba-simple-cache.js
 * 
 * Copyright (c) 2009 "Cowboy" Ben Alman
 * Licensed under the MIT license
 * http://benalman.com/about/license/
 */

(function($){
  '$:nomunge'; // Used by YUI compressor.
  
  var cache = {};
  
  // Very simple caching of commonly-used jQuery objects for performance.
  // 
  // Don't do this: $('body'), do this instead: $.$('body')
  // Don't do this: $(window), do this instead: $.$(window, 'window')
  // 
  // $.$ will fetch the resulting jQuery object from its internal cache if it
  // exists, otherwise it will get + set + return it. Note that if selector is
  // an object (like window or document), a key must be specified or the cache
  // will be bypassed. 
  // 
  // Obviously, this only makes sense for selectors whose resulting jQuery
  // object isn't going to change, like window, document, 'html', 'head', 'body'
  // and '#someid' (assuming you know that id selector won't return a different
  // jQuery object). If you know that the selector will select a different set
  // of elements, just set update_cache to true, and it will force a re-get +
  // set + return.
  
  $.$ = function( selector, key, bypass_cache ) {
    if ( typeof key !== 'string' ) {
      bypass_cache = key;
      key = selector;
    }
    
    if ( typeof key !== 'string' ) {
      return $( selector )
      
    } else {
      var elems = !bypass_cache && cache[ key ] || $( selector );
      
      if ( elems.length ) {
        cache[ key ] = elems;
      }
      
      return elems;
    }
  };
  
})(jQuery);

/*
// Speed testing
// 
// Firefox 3: http://skitch.com/cowboy/bwne5/ben-alman
// Safari 4: http://skitch.com/cowboy/bwnjm/web-inspector-http-benalman.com

function test( selector, key ) {
  var i, a, reps = 10000;
  
  console.log([ selector, $.$( selector, key ), $.$( selector, key ) ]);
  
  console.time(1);
  for ( i = 0; i < reps; i++ ) { a = $( selector ); }
  console.timeEnd(1);
  
  console.time(1);
  for ( i = 0; i < reps; i++ ) { a = $.$( selector, key ); }
  console.timeEnd(1);
};

test( window, 'window' );
test( document, 'document' );
test( 'html' );
test( 'head' );
test( 'body' );
*/