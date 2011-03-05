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
// CONSOLE LOGGING
// ========================================================================== //

window.debug = (function(){
  var self = {},
    debug_level = SETTINGS.debug_level;
  
  // Get enabled level.
  
  self.getLevel = function() {
    return debug_level;
  };
  
  // Actually log to the console.
  
  self.log = function() {
    debug_level && console.log( Array.prototype.slice.call(arguments) );
  };
  
  return self;
})();
