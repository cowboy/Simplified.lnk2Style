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
// Misc
// ========================================================================== //

$(function(){
  
  // Focus the channel on window click.
  
  $.$(window,'window').click(function(){
    window.linkinus && window.linkinus.focus();
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
  $('body').css( 'font-size', size + 'px' );
};

// When all initial chat messages and unfocus has been called, this is called.

function setReady() {
  scroller.setReady();
  overlay.setReady();
}

// Update the topic. (Not in the app - yet?).

function setTopic( text ) {
  info.setTopic( text );
}

// Change style variant.

function setVariant( name ) {
  variant.setVariant( name );
}

// Change emoticonSet. (Not in the app - yet?).

function setEmoticonSet( name ) {
  smiley.loadAdiumEmoticonset( name );
}

// ========================================================================== //
// Messages
// ========================================================================== //

// Called every time a new chat message is added.

function appendMessage( arr ) {
  
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
