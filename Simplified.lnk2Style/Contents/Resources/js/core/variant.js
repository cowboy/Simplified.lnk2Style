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
// VARIANT
// ========================================================================== //

window.variant = (function(){
  var self = {};
  
  // Set or change the style variant.
  
  self.setVariant = function( name ) {
    var variant = name || 'Default',
      href = 'css/variants/' + variant + '.css',
      html = '<link id="variant" rel="stylesheet" href="' + href
        + '" type="text/css" media="screen" charset="utf-8" />',
      elem;
    
    debug.log( 'variant.setVariant', variant );
    
    if ( $.isReady ) {
      elem = $('#variant');
      elem.length ? elem.attr( 'href', href ) : $.$('head').append( html );
    } else {
      document.write( html );
    }
  };
  
  return self;
})();
