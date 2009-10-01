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
// MODAL OVERLAY
// ========================================================================== //

window.overlay = (function(){
  var self = {},
    in_focus = true;
  
  // Show the modal overlay.
  
  self.show = function( html ) { 
    debug.log( 'overlay.show', html );
    
    $.$('#overlay')
      .fadeIn( 'fast' )
      .find( 'span' )
        [ html ? 'show' : 'hide' ]()
        .html( html );
    
    $.$('html').addClass( 'overlay' );
  };
  
  // Hide the modal overlay.
  
  self.hide = function( no_fade ) { 
    debug.log( 'overlay.hide', no_fade );
    
    var elem = $.$('#overlay');
    
    no_fade ? elem.hide() : elem.fadeOut( 'fast' );
    
    $.$('html').removeClass( 'overlay' );
  };
    
  // Called when Linkinus is done sending initial chat messages.
  
  self.setReady = function() {
    debug.log( 'overlay.setReady' );
    
    // Hide overlay if channel is in focus.
    in_focus && self.hide();
    
    $.$('html').addClass( 'state-overlay_ready' );
  };
  
  // Called when chat becomes focused or unfocused.
  
  self.setFocus = function( state ) {
    debug.log( 'overlay.setFocus', state );
    
    // Show or hide overlay based on channel focus.
    in_focus = state;
    state ? self.hide() : self.show( '' );
  };
  
  return self;
})();
