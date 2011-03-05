/*!
 * Emotify - v0.5 - 8/17/2009
 * http://benalman.com/code/javascript/ba-emotify.js
 * 
 * Copyright (c) 2009 "Cowboy" Ben Alman
 * Licensed under the MIT license
 * http://benalman.com/about/license/
 */

// Turn text into emotified html. You know, like, with smileys.
// 
// var html = emotify( text, callback );
// 
// callback (Function) - default: undefined - if defined, this will be called
//  for each emoticon with four arguments, img, title, smiley and text.
// 
// emotify.add( obj, replace_all );
// 
// obj (Object) - all the smileys you want to add.
// replace_all (Boolean) - by default, added smileys only overwrite existing
//   smileys with the same key, leaving the rest. Set this to true to first
//   remove all existing smileys before adding the new smileys.
// 
// emotify.add({
//   // 'smiley': [ image_path, title_text, alt_smiley ... ]
//   ':-)': [ 'smiley/happy.gif', 'happy' ],
//   ':-(': [ 'smiley/sad.gif', 'sad', ':(', '=(', '=-(' ]
// });
// 
// In the above example, the happy.gif image would be used to replace all
// occurrences of :-) in the input text. The callback would be called with the
// arguments 'smiley/happy.gif', 'happy', ':-)', ':-)' and would generate this
// html by default: <img src="smiley/happy.gif" title="happy, :-)"/>
// 
// The sad.gif image would be used to replace not just :-( in the input text,
// but also :( and :^(. If the text =( was matched, the callback would be called
// with the arguments 'smiley/sad.gif', 'sad', ':-(', '=(' and would generate
// this html by default: <img src="smiley/sad.gif" title="sad, :-("/>

window.emotify = (function(){
  var emotify,
    EMOTICON_RE,
    emoticons = {},
    lookup = [];
  
  emotify = function( txt, callback ) {
    callback = callback || function( img, title, smiley, text ) {
      return '<img src="' + img + '" title="' + title + ', ' + smiley + '" class="smiley"/>';
    };
    
    return txt.replace( EMOTICON_RE, function( a, b, text ) {
      var i = 0,
        smiley = text,
        e = emoticons[ text ];
      
      // If smiley matches on manual regexp, reverse-lookup the smiley.
      if ( !e ) {
        while ( i < lookup.length && !lookup[ i ].regexp.test( text ) ) { i++ };
        smiley = lookup[ i ].name;
        e = emoticons[ smiley ];
      }
      
      // If the smiley was found, return HTML, otherwise the original search string
      return e ? ( b + callback( e[ 0 ], e[ 1 ], smiley, text ) ) : a;
    });
  };
  
  emotify.add = function( add_emoticons, replace_all ) {
    var e,
      arr = [],
      alts,
      i,
      regexp_str;
    
    if ( replace_all ) {
      emoticons = {};
      lookup = [];
    }
    
    for ( e in add_emoticons ) {
      emoticons[ e ] = add_emoticons[ e ];
    }
    
    // Generate smiley-match regexp.
    for ( e in emoticons ) {
      
      if ( emoticons[ e ].length > 2 ) {
        // Generate regexp from smiley and alternates.
        alts = emoticons[ e ].slice( 2 ).concat( e );
        
        i = alts.length
        while ( i-- ) {
          alts[i] = alts[i].replace( /(\W)/g, '\\$1' );
        }
        
        regexp_str = alts.join( '|' );
        
        // Manual regexp, map regexp back to smiley so we can reverse-match.
        lookup.push({ name: e, regexp: new RegExp( '^' + regexp_str + '$' ) });
        
      } else {
        // Generate regexp from smiley.
        regexp_str = e.replace( /(\W)/g, '\\$1' );
      }
      
      arr.push( regexp_str );
    }
    
    EMOTICON_RE = new RegExp( '(^|\\s)(' + arr.join('|') + ')(?=(?:$|\\s))', 'g' );
  };
  
  return emotify;
  
})();