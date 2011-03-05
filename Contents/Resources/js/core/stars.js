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
// STARS
// ========================================================================== //

window.stars = (function(){
  var self = {};
  
  // Unstar a message.
  
  self.unstar = function( id ) {
    $( '#' + id ).removeClass( 'starred' );
  };
  
  // Starring messages.
  
  $('span.star .hit')
    .live( 'click', function() {
      var p = $(this).closest( 'p' ),
        id = p.attr( 'id' ),
        starred = p.hasClass( 'starred' );
      
      window.linkinus && linkinus[ starred ? 'unstarPosts_' : 'starPosts_' ]( id );
      p.toggleClass( 'starred' ); // TODO: Make contingent on previous line success?
    })
    .live( 'dblclick', function() {
      getSelection().removeAllRanges();
    })
    .live( 'mouseover', function() {
      $(this).closest( 'p' ).addClass( 'star-hover' );
    })
    .live( 'mouseout', function() {
      $(this).closest( 'p' ).removeClass( 'star-hover' );
    });
  
  // Highlights & Stars window context buttons.
  
  if ( /^(?:highlights|stars)$/.test( CHATMODE ) ) {
    
    $('span.context')
      .live( 'click', function() {
        var id = $(this).closest( 'p' ).attr( 'id' );
        window.linkinus && linkinus.clickPost_( id );
      })
      .live('dblclick', function() {
        getSelection().removeAllRanges();
      });
    
  }
  
  return self;
})();
