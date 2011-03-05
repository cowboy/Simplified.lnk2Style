/*
 * Simplified: Linkinus 2.0 Style
 * http://benalman.com/projects/simplified-style/projects/simplified-style/
 * 
 * Copyright (c) 2011 "Cowboy" Ben Alman
 * Licensed under the MIT license
 * http://benalman.com/about/license/
 * 
 * If you like this theme, please consider donating!
 * http://benalman.com/donate
 */

// ========================================================================== //
// SCROLLER
// ========================================================================== //

window.scroller = (function(){
  var self = {},
    ready,
    is_scrolling,
    scroll,
    scroll_to_elem;
    
    // Disable if you don't like smooth scrolling.
    smooth_scrolling = SETTINGS.smooth_scrolling;
  
  // Initialize.
  
  self.setReady = function() {
    debug.log( 'scroller.setReady' );
    ready = true;
    
    // Force scroll to the bottom, just in case!
    self.scrollToBottom( true );
  };
  
  // Scroll chat to the bottom, if it hasn't been manually scrolled away past a
  // certain point, or if forced.
  
  self.scrollToBottom = function( force ) {
    var body = $.$('body'),
      height = $.$(window,'window').height(),
      y = body.attr( 'scrollHeight' ) - height,
      threshold = 100; //height * 0.25;
    
    if ( force ) {
      // Forced.
      debug.log( 'scroller.scrollToBottom: forced' );
      body.stop( true ).scrollTop( y );
      
    } else if ( is_scrolling || scroll <= 1 && ready ) {
      // Not forced, so only scroll to bottom if not manually scrolled up.
      debug.log( 'scroller.scrollToBottom: not forced', y );
      
      if ( smooth_scrolling ) {
        body.stop( true, true );
        
        is_scrolling = true;
        body.animate( { scrollTop: y }, {
          duration: smooth_scrolling,
          step: function( s, p ) {
            if ( p.now - body.scrollTop() > threshold ) {
                body.stop( true );
                is_scrolling = false;
            }
          },
          complete: function(){
            is_scrolling = false;
          }
        });
        
      } else {
        body.stop( true ).scrollTop( y );
      }
      
    } else {
      debug.log( 'scroller.scrollToBottom: no scroll' );
    }
  };
  
  // Keep track of the scroll information so it can be used as-needed to assist
  // calculation of scrollToBottom, in the case of very large messages.
  
  self.update = function() {
    var body = $.$('body');
    scroll = body.attr( 'scrollHeight' ) - body.scrollTop() - $.$(window,'window').height();
    //debug.log( 'scroller.update', scroll );
  };
  
  // Center the chat on a y position or element via id or reference. Return the
  // current scrollTop if no parameters are passed.
  
  self.scrollTo = function( y, no_center, no_animate ) {
    var elem = scroll_to_elem || $([]),
      body = $.$('body'),
      bh,
      wh,
      h;
    
    debug.log( 'scroller.scrollTo', y, no_center, no_animate );
    
    if ( y === undefined ) {
      return body.attr( 'scrollTop' );
      
    } else {
      elem.doTimeout( 'scrollto', true );
      
      if ( typeof y !== 'number' ) {
        elem = $( typeof y === 'string' ? '#' + y : y );
        if ( !elem.length ) { return; }
        y = elem.offset().top;
      }
      
      if ( !no_center ) {
        bh = body.attr( 'scrollHeight' );
        wh = $.$(window,'window').height();
        h = elem.outerHeight();
        y -= ( wh - h ) / 2;
        y = Math.max( 0, Math.min( y, bh ) );
      }
      
      if ( no_animate ) {
        body.attr( 'scrollTop', y );
      } else {
        body.animate( { scrollTop: y }, 'fast' );
      }
      
      scroll_to_elem = elem;
      elem.addClass( 'scrollto' );
      
      elem.doTimeout( 'scrollto', 3000, function(){
        this.removeClass( 'scrollto' );
      });
    }
    
  };
  
  $(function(){
    self.update();
    
    $.$(window,'window').scroll( self.update );
  });
  
  return self;
})();
