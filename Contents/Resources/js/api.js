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
// Misc
// ========================================================================== //

$(function(){
  
  // Focus the channel on window click.
  
  $.$(window,'window').click(function(){
    window.linkinus && linkinus.focus();
  });
  
});

// ========================================================================== //
// Style Preferences / States
// ========================================================================== //

// Enable or disable emoticons.

function setEmoticonsEnabled( state ) {
  smiley.enable( state );
};

// Enable or disable "combined messages"

function setCombinedMessagesEnabled( state ) {
  message.setGrouped( state );
};

// Enable or disable "spotlight" link hover mode.

function setSpotlightUserMessagesOnHoverEnabled( state ) {
  spotlight.enableHover( state );
};

// Set font size.

function setFontSize( size ) {
  debug.log( arguments.callee.name );
  $('body').css( 'font-size', size + 'px' );
};

// When all initial chat messages and unfocus has been called, this is called.

function setReady() {
  debug.log( arguments.callee.name );
  // Hacky-hacky for Linkinus 2.2 / iOS.
  location.href = 'linkinus-style://styleDidFinishLoading';
  
  scroller.setReady();
  overlay.setReady();
  
  //spam(); // Uncomment for scroll debugging.
}

// Update the topic. (Not in the app - yet?).

function setTopic( text ) {
  info.setTopic( text );
}

// Change style variant.

function setVariant( name ) {
  debug.log( arguments.callee.name );
  variant.setVariant( name );
}

// Change emoticonSet. (Not in the app - yet?).

function setEmoticonSet( name ) {
  debug.log( arguments.callee.name );
  smiley.loadAdiumEmoticonset( name );
}

// ========================================================================== //
// Messages
// ========================================================================== //

// Called every time a new chat message is added.

function appendMessage( arr ) {
  debug.log( arguments.callee.name );
  // Map array of arguments (from app) into something more useful.
  
  var args = {},
    arg_map = [ 'type', 'id', 'nick', 'description', 'time', 'nick_color',
      'extra', 'current', 'highlight', 'starred', 'embed', 'direction',
      'nick_image', 'context', 'nick_userhost', 'unencrypted' ];
  
  $.each( arg_map, function(i,v){
    args[ v ] = arr[ i ];
  });
  
  // msgTopicReply and msgTopicChange are both used to set the topic, but for
  // some reason, msgTopicReply seems to get spammed on style redraw, so use
  // the "topic" msgRaw in its place for chat messages.
  
  if ( args.type === 'msgTopicChange' ) {
    setTopic( args.description );
    
  } else if ( args.type === 'msgTopicReply' ) {
    setTopic( args.description );
    return;
    
  } else if ( args.type === 'msgRaw' && /^Topic is/.test( args.description ) ) {
    args.description = args.description.replace( /^Topic is "(.*)"$/, '$1' );
    setTopic( args.description );
    args.type = 'msgTopicReply';
  }
  
  message.append( args );
};

// Called when the channel scrollback reaches maximum.

function deleteFirstMessage() {
  var y = scroller.scrollTo(),
    h1 = $.$('body').attr( 'scrollHeight' ),
    h2;
    
  message.remove( 0 );
  
  h2 = $.$('body').attr( 'scrollHeight' );
  
  // Keep scroll position from "drifting" when scrolled back.
  scroller.scrollTo( Math.max( 0, y - h1 + h2 ), true, true );
};

// Called when a message needs to be removed.

function removeMessage( id ) {
  message.remove( id );
};

// Add a visible dividing line if "Insert breaks when losing focus" is enabled.

function addBreak() {
  message.setBreak( true );
};

// Remove the dividing line.

function removeLastBreak() {
  message.setBreak( false );
};

// ========================================================================== //
// User Feedback
// ========================================================================== //

// Called when a visible chat window loses focus.

function unfocus() {
  overlay.setFocus( false );
};

// Called when a visible chat window gains focus.

function focus() {
  overlay.setFocus( true );
};

// Called when a chat message has been un-starred in the H&S window

function markAsUnstarred( id ) {
  stars.unstar( id );
}

// ========================================================================== //
// Chat Navigation
// ========================================================================== //

// Called to scroll chat to the bottom (conditionally or forced).

function scrollToBottom( force ) {
  scroller.scrollToBottom( force );
};

// Called when a specific message should be scrolled to.

function scrollTo( id ) {
  scroller.scrollTo( id );
};

// Called when the last break should be scrolled to.

function scrollToLastBreak() {
  scroller.scrollTo( 'break' );
};

// ========================================================================== //
// Misc
// ========================================================================== //

function showConnectionHintBox( network, server, nickname, realname ) {
  // Not implemented in this style
};

function hideConnectionHintBox() {
  // Not implemented in this style
};

// ========================================================================== //
// Misc Debugging
// ========================================================================== //

var spam = (function(){
  var timeout_id,
    lipsum = [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'Mauris eu velit quis mi rutrum euismod.',
      'Pellentesque vestibulum consequat elit nec congue.',
      'Donec interdum feugiat mi eu tincidunt.',
      'Proin ornare, tellus eget faucibus accumsan, est leo condimentum leo, quis gravida felis quam in purus.',
      'Nam tempor laoreet pharetra.',
      'Nullam vehicula ipsum non libero pellentesque posuere eu lobortis justo. Vivamus aliquet quam a velit egestas sit amet aliquet libero malesuada.',
      'Fusce facilisis fringilla augue, sed suscipit leo cursus commodo.',
      'Morbi vel turpis tellus, eget egestas dui.',
      'Nunc bibendum mi sit amet tellus tempor eleifend.',
      'Proin molestie tempus tristique.',
      'Aliquam quam urna, pretium eget imperdiet sed, tincidunt vel augue.',
      'Nunc in urna elit, a vehicula erat.',
      'In hac habitasse platea dictumst. Cras fringilla, metus a ornare semper, est mi laoreet quam, at ornare tellus magna vitae metus.',
      'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.'
    ],
    users = [
      { name: 'ben_alman', color: '1', direction: 1 }
    ];
  
  $.each('sample_user mr`awesome test123 not|afk'.split(' '),function(i,v){
    users.push({
      name: v,
      color: i + 1,
      direction: 0
    })
  });
  
  return function( delay ){
    if ( timeout_id ) {
      clearTimeout( timeout_id );
      timeout_id = null;
    } else {
      timeout_id = -1;
      
      (function loopy(){
        var user = users[ ~~( Math.random() * users.length ) ],
          message = lipsum[ ~~( Math.random() * lipsum.length ) ],
          d = new Date();
        
        appendMessage([
          [ 'msgMessage', 'msgAction' ][ ~~( Math.random() * 2 ) ],
          'LEB21C6AA-D386-49F0-AA38-66023A98ED60-9610-000007E8A35FA281',
          user.name, message,
          ( '0' + d.getHours() ).slice(-2) + ':' + ( '0' + d.getMinutes() ).slice(-2),
          user.color, '', 1,
          /\bipsum\b/i.test( message ) && user.direction === 0,
          0, false, user.direction, '', '#macosx', '', false
        ]);
        
        scrollToBottom();
        
        if ( timeout_id ) {
          timeout_id = setTimeout( loopy, Math.random() * ( delay || 200 ) );
        }
      })();
    }
  }
})();
