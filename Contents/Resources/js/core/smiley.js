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
// SMILEY
// ========================================================================== //

window.smiley = (function(){
  var self = {},
    enabled;
  
  // Enable or disable.
  
  self.enable = function( state ) {
    enabled = !!state;
  };
  
  // Get enabled status.
  
  self.isEnabled = function() {
    return enabled;
  };
  
  // Parse text and return emotified html.
  
  self.parseText = function( text ) {
    return !enabled ? text
      : emotify( text, function( img, title, smiley, text ) {
          title = 'A &quot;' + title + '&quot; smiley ' + smiley + ' &lt;i&gt;(click to explode)&lt;/i&gt;';
          
          return '<span class="smiley">' + text + '</span>'
            + '<img src="' + img + '" title="' + title + '" class="smiley"/>';
        });
  };
  
  // Load Adium emoticon set (only if it exists), from
  // ~/Library/Application Support/Linkinus 2/Emoticons/
  
  self.loadAdiumEmoticonset = function( emoticon_set ) {
    emoticon_set = emoticon_set || SETTINGS.emoticon_set;
    
    var emoticons_base = '../../../../Emoticons/' + emoticon_set + '/',
      obj = {};
    
    $.ajax({
      async: false,
      dataType: 'xml',
      url: emoticons_base + 'Emoticons.plist',
      success: function( data, textStatus ){
        $(data).find( 'plist > dict > dict > key' ).each(function(){
          var that = $(this),
            image = that.text(),
            equivalents = that.next().children( 'key:contains("Equivalents")' ).next().children(),
            name = that.next().children( 'key:contains("Name")' ).next().text(),
            text,
            arr = [];
          
          equivalents.each(function(){
            text = $(this).text();
            text && arr.push( text.replace( '&', '&amp;' ).replace( '<', '&lt;' ).replace( '>', '&gt;' ) );
          });
          
          obj[ arr.shift() ] = [ emoticons_base + image, name ].concat( arr );
        });
        
        debug.log( 'AdiumEmoticonset', obj );
        emotify.add( obj, true );
      }
    });
    
    // Let's override the "cowboy" smiley with something better, regardless :D
    emotify.add({
      "&lt;):)": [ "images/cowboy.png", "cowboy" ]
    });
  };
  
  // Smiley explode-on-click. I believe this was Drudge's idea, and it's
  // brilliant. It's like a mini-game inside of IRC called "Kill all smileys."
  // Maybe the style should keep score.. hmmn..
  
  $('img.smiley')
    .live( 'click', function() {
      var that = $(this),
        parent = that.closest( 'p '),
        offset = that.position(),
        span = that.prev( 'span.smiley' ),
        shim = $('<span class="smiley shim"/>'),
        explode,
        explode_max = 0,
        explode_bg_offset = 0,
        explode_width = 64,
        explode_height = 64;
      
      // Center the 64x64 explosion animation over the smiley.
      offset.left -= ( explode_width - that.width() ) / 2;
      offset.top  -= ( explode_height - that.height() ) / 2;
      offset.top  += parseInt( that.css( 'margin-top' ) );
      
      // Don't let the smiley go off the right or bottom edge, because extra
      // scrollbars suck!
      function get_explode_width() {
        var over_width = offset.left + explode_width - parent.outerWidth();
        return explode_width - ( over_width > 0 ? over_width : 0 );
      };
      
      function get_explode_height() {
        var over_height = parent.position().top + offset.top + explode_height - $.$('body').attr( 'scrollHeight' );
        return explode_height - ( over_height > 0 ? over_height : 0 );
      };
      
      explode = $('<div class="explode"/>')
        .width( get_explode_width() )
        .height( get_explode_height() )
        .css({ left: offset.left, top: offset.top })
        .insertBefore( that );
      
      // Display one frame every 50ms, then remove.
      (function loopy(){
        explode.doTimeout( 50, function(){
          explode_max++;
          
          // At the halfway point, remove the smiley and show the original
          // text. A placeholder shim keeps text from shifting vertically.
          if ( explode_max === 8 ) {
            that.replaceWith( shim.height( that.height() ) );
            span.replaceWith( span.html() );
          }
          
          if ( explode_max === 16 ) {
            explode.remove();
          } else {
            explode_bg_offset -= 64;
            
            explode
              .width( get_explode_width() )
              .height( get_explode_height() )
              .css( 'background-position', explode_bg_offset + 'px 0' );
            
            loopy();
          }
        });
      })();
      
      info.show();
    });
  
  return self;
})();

// Load an Adium Emoticonset if it exists.

smiley.loadAdiumEmoticonset();
