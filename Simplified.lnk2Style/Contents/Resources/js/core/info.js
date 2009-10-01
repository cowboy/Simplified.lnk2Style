/*
 * Simplified: Linkinus 2.0 Style
 * http://benalman.com/projects/simplified-style/
 * 
 * Copyright (c) 2009 "Cowboy" Ben Alman
 * Licensed under the MIT license
 * http://benalman.com/about/license/
 * 
 * If you like this theme, please consider donating!
 */

// ========================================================================== //
// INFO BAR
// ========================================================================== //

window.info = (function(){
  var self = {},
    no_topic = 'No topic set',
    topic,
    
    // Enable if you want the topic bar to be always visible.
    pin_topic = SETTINGS.pin_topic;
  
  // Is the info bar currently being hovered over?
  
  self.isHover = function() {
    return $.$('#info').hasClass( 'hover' );
  };
  
  // Is the info bar currently visible?
  
  self.isVisible = function() {
    return $.$('#info').hasClass( 'show' );
  };
  
  // Set the topic.
  
  self.setTopic = function( text ) {
    if ( CHATMODE !== 'channel' ) { return; }
    
    debug.log( 'info.setTopic', text );
    
    topic = text || no_topic;
    
    self.isHover() && self.show( !pin_topic && text );
  };
  
  self.setTopic();
  
  // Show or hide the Info bar.
  
  self.show = function( text, no_linkify ) {
    var elem = $.$('#info');
    
    debug.log( 'info.show', text );
    
    function do_show(){
      var children = elem.children(),
        body = children.filter( '.body' ),
        hit = children.filter( '.hit' ),
        h;
      
      if ( pin_topic ) {
        elem[ text ? 'removeClass' : 'addClass' ]( 'hover' );
        text = text || topic;
      }
      
      if ( text !== true ) {
        children.css({ height: 'auto' });
        
        body
          .html( text ? ( !no_linkify ? linkify( text ) : text ) : '' )
          .find('a')
            .longUrl();
        
        if ( text ) {
          body.height( h = body.height() );
          hit.height( h - parseInt( hit.css( 'padding-top' ) ) );
          
        } else {
          children.removeAttr( 'style' );
          elem.removeClass( 'hover' );
        }
      }
      
      elem[ text ? 'addClass' : 'removeClass' ]( 'show' );
    }
    
    if ( self.isVisible() && text ) {
      elem.doTimeout( 'show' );
      do_show();
    } else {
      elem.doTimeout( 'show', text ? 100 : 500, do_show );
    }
  };
  
  $(function(){
    pin_topic && $.$('html').addClass( 'state-pin_topic' );
    
    var elem = $.$('#info');
    
    elem
      .dblclick(function() {
        window.linkinus && window.linkinus.showInspector();
        window.getSelection().removeAllRanges();
      })
      .mouseenter(function() {
        if ( pin_topic ) { return; }
        
        if( !self.isVisible() ) {
          elem.addClass( 'hover' );
          self.show( topic );
        } else {
          self.show( true );
        }
      })
      .mouseleave(function() {
        if ( pin_topic ) { return; }
        
        self.show();
      });
    
    self.show();
    
    // If topic is pinned, resize it when necessary.
    
    $.$(window,'window').resize(function(){
      if ( !pin_topic ) { return; }
      
      $(this).doTimeout( 'info-resize', 100, function(){
        self.show();
      });
    });
  });
  
  return self;
})();
