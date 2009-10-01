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
// SPOTLIGHT
// ========================================================================== //

window.spotlight = (function(){
  var self = {},
    hover,
    last_userhost;
  
  // Enable or disable.
  
  self.enableHover = function( state ) {
    hover = state === false ? false : true;
    $.$('html')[ state ? 'addClass' : 'removeClass' ]( 'state-spotlight_hover' );
  };
  
  // Get enabled status.
  
  self.isEnabledHover = function() {
    return hover;
  };
  
  // Is this userhost the one currently spotlighted?
  
  self.isCurrent = function( userhost ) {
    return userhost === last_userhost;
  };
  
  // Spotlight messages (by userhost) on nickname hover or click.
  
  $.fn.spotlight = function( state ) {
    return this.each(function(){
      var userhost = $(this).attr( 'data-userhost' ),
        last = last_userhost;
      
      debug.log( 'spotlight', state, userhost, last_userhost );
      
      $('p.spotlight').removeClass( 'spotlight' );
      last_userhost = '';
      
      if ( state || state === undefined && userhost && userhost !== last ) {
        $('.userhost[data-userhost="' + userhost + '"]')
          .closest( 'p' )
            .addClass( 'spotlight' );
        
        last_userhost = userhost;
      }
    });
  };
  
  $('.userhost .userhost')
    .live( 'click', function() {
      hover || $(this).spotlight();
    })
    .live( 'mouseover', function() {
      var that = $(this);
      hover && $.doTimeout( 'spotlight', 100, function(){
        that.spotlight( true );
      });
    })
    .live( 'mouseout', function() {
      var that = $(this);
      hover && $.doTimeout( 'spotlight', 500, function(){
        that.spotlight( false );
      });
    });
  
  return self;
})();
