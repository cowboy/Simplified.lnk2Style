/*
 * Simplified: Linkinus 2.0 Style
 * http://benalman.com/projects/simplified-style/projects/simplified-style/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Licensed under the MIT license
 * http://benalman.com/about/license/
 * 
 * If you like this theme, please consider donating!
 * http://benalman.com/donate
 */

// ========================================================================== //
// MESSAGE
// ========================================================================== //

window.message = (function(){
  var self = {},
    grouped,
    last_nick,
    last_time_length,
    grouped_next_indent,
    has_checked_history,
    
    // Enable to show userhost on Join, Part and Quit.
    userhost_on_jpq = SETTINGS.userhost_on_jpq;
  
  // Should messages be grouped?
  
  self.setGrouped = function( state ) {
    grouped = !!state;
  };
  
  // Check to see if there are any past messages left, in order to change bg
  // color and show or hide the history-content divider.
  
  self.checkHistory = function() {
    $.$('html')[ $.$('#history').children().length ? 'addClass' : 'removeClass' ]( 'state-history' );
  };
  
  // Add a Break.
  
  self.setBreak = function( state ) {
    debug.log( 'message.setBreak', state );
    
    $('#break').remove();
    state && $('<div id="break"/>').appendTo( '#content' );
  };
  
  // Remove a line of chat from the window.
  
  self.remove = function( id ) {
    debug.log( 'message.remove' );
    
    var elem = typeof id === 'number' ? $('p').eq( id )
      : typeof id === 'string' ? $( '#' + id )
      : $( id );
    
    elem.remove();
    
    // Divider will hide if there is no history left.
    self.checkHistory();
    
    // Update scroll info.
    scroller.update();
  };
  
  // Append a new line of chat to the window.
  
  self.append = function( args ) {
    debug.log( 'append', args.type );
    
    var node = document.createElement( 'p' ),
      elem,
      link_elems;
    
    node.id = args.id;
    node.className = [
      args.type,
      'userhost' + args.nick_color,
      args.direction ? 'outgoing' : 'incoming',
      args.highlight ? 'highlight' : 'nohighlight',
      args.starred ? 'starred' : 'nostarred',
      args.embed ? 'embed' : 'noembed',
      args.unencrypted ? 'unencrypted' : '',
      
      smiley.isEnabled() ? 'emoticons' : 'noemoticons',
      !grouped ? 'ungrouped' : 'grouped grouped-' + ( !/^(?:highlights|stars)$/.test( CHATMODE )
          && args.type === 'msgMessage' && args.nick === last_nick ? 'next' : 'first' ),
      
      args.nick_userhost ? 'userhost' : '',
      args.nick_userhost && spotlight.isCurrent( args.nick_userhost ) ? 'spotlight' : '',
      /^msg(?:Message|Action|Notice)$/.test( args.type ) ? 'user' : 'system'
    ].join(' ');
    
    last_nick = args.type === 'msgMessage' ? args.nick : '';
    
    // Some basic debugging: a lame title tooltip with all the args info.
    var title = '', key;
    if ( debug.getLevel() >= 2 ) {
      for ( key in args ) {
        title += key + ': ' + args[key] + "\n";
      }
      title += node.className;
      node.title = title;
    }
    
    node.innerHTML = self.getChatHtml( args );
    
    elem = $(node);
    
    // Append the newly created element.
    $.$( args.current ? '#content' : '#history' ).append( elem );
    //$.$('#history').append( elem.clone() ); // For testing history
    
    if ( !has_checked_history && !args.current ) {
      has_checked_history = true;
      self.checkHistory();
    }
    
    link_elems = elem.find('a');
    
    // Tweak shortened urls.
    link_elems.longUrl({ lengthen: function( long_url, short_url ) {
      long_url && this.attr({ 'data-title': 'Link is ' + long_url, href: long_url });
    }})
    
    // Handle embeds
    args.embed && link_elems.oembed( null, { maxWidth: 300, maxHeight: 200 } ); // TOTALLY FIX THIS
    
    // Fix indents.
    self.fixIndent( args.time, elem );
  };
  
  // Construct and parse the HTML for a line of chat.
  
  self.getChatHtml = function( args ) {
    args = $.extend( {}, args ); // TODO: remove?
    
    // Process args for links, embeds, etc.
    args.description = self.parseDescription( args.description );
    
    var html,
      bullet = '<span class="bullet">&bull;</span> ',
      bullet_join = '<span class="arrow">&rarr;</span> ',
      bullet_part = '<span class="arrow">&larr;</span> ',
      time = args.time ? '<span class="time">[${time}] </span>' : '',
      parens = args.description ? ' (' + args.description + ')' : '',
      nick = '<span class="userhost" data-userhost="${nick_userhost}">${nick}</span>',
      context = args.context ? '<span class="context" title="View this message in its original context">${context}</span>' : '',
      star_title = CHATMODE === 'stars' ? 'Unstar this message' : 'Star or unstar this message',
      star = '<span class="star"><span class="button"></span><span class="hit" title="' + star_title + '"></span></span>',
      unencrypted = args.unencrypted ? '<img src="images/lock-open.png" class="unencrypted" title="Encryption was expected, but this message was sent in plain text."/>' : '',
      userhost = userhost_on_jpq && args.nick_userhost ? ' (${nick_userhost})' : '',
      messages = {
        msgMessage: '<span class="description">' + unencrypted + '<span class="nick">&lt;' + nick + '&gt;</span> ${description}</span>',
        msgAction: '<span class="description">' + unencrypted + '<span class="nick">' + bullet + nick + '</span> ${description}</span>',
        msgRaw: '<span class="description">${description}</span>',
        msgJoin: '<span class="description">' + bullet_join + '<span class="nick">' + nick + '</span>' + userhost + ' joined the channel.</span>',
        msgPart: '<span class="description">' + bullet_part + '<span class="nick">' + nick + '</span>' + userhost + ' left the channel.' + parens + '</span>',
        msgQuit: '<span class="description">' + bullet_part + '<span class="nick">' + nick + '</span>' + userhost + ' left IRC.' + parens + '</span>',
        msgQuitReason: '<span class="description">' + bullet_part + 'You left IRC.' + parens + '</span>',
        msgKick: '<span class="description">' + bullet_part + '<span class="nick">' + nick + '</span> kicked <span class="nick2">${extra}</span> from the channel. ' + parens + '</span>',
        msgModeChange: '<span class="description"><span class="nick">' + nick + '</span> sets mode <span class="mode">${description}</span></span>',
        msgModeReply: '<span class="description">Mode is <span class="mode">${description}</span></span>',
        msgNick: '<span class="description">' + bullet + '<span class="nick2">' + nick + '</span> is now known as <span class="nick">' + nick.replace( '${nick}', '${description}' ) + '</span>.</span>',
        msgTopicChange: '<span class="description"><span class="nick">' + nick + '</span> changed the topic to <span class="topic">${description}</span></span>',
        msgTopicReply: '<span class="description">Topic is <span class="topic">${description}</span></span>',
        msgTopicDetailsReply: '<span class="description"> Set by <span class="nick">' + nick + '</span> on <span class="date">${extra}</span></span>',
        msgNotice: '<span class="description"><span class="nick">-' + nick + '-</span> ${description}</span>',
        msgNoticeAuth: '<span class="description">${description}</span>',
      };
    
    html = star + context + '<div>' + time + messages[ args.type ] + '</div>';
    
    // For each ${foo}, replace with value from args.foo
    html = html.replace( /\${(\w+)}/g, function(a,b){
      return args[ b ] || '';
    });
    
    // Convert lame title tooltips to something a little more exciting!
    html = html.replace( /<([^>]+\s)title=/ig, '<$1data-title=' );
    
    return html;
  };
  
  // Process args for links, embeds, etc.
  
  self.parseDescription = function( text ) {
    
    // Un-escape non-breaking spaces in text.
    text = text.replace( /&nbsp;/g, ' ' );
    
    // Process links in text.
    text = linkify( text, { callback: function( text, href ) {
      
      if ( href ) { // Link.
        // TODO: handle embeds!
        
        if ( href !== text ) {
          text = '<a href="' + href + '" title="Link is ' + href + '">' + text + '</a>';
        } else {
          text = '<a href="' + href + '">' + text + '</a>';
        }
        
      } else { // Non-link.
        
        text = smiley.parseText( text );
        
      }
      
      return text;
    }});
    
    // Re-escape non-breaking spaces in text and return.
    return text.replace( /  /g, ' &nbsp;' );
  };
  
  // Since the width of the timestamp may change based on user settings, in order
  // to indent wrapped chat description text properly, a little JavaScript work
  // must be done.
  // 
  // Here, we measure the width of the timestamp span (if its length has grown
  // since the last line) and adjust the margin and text-indent of the wrapper
  // div accordingly.
  
  self.fixIndent = function( time, parent ) {
    if ( time.length <= ( last_time_length || 0 ) ) { return; }
    last_time_length = time.length;
    
    var elem = parent.find( 'span.time' ),
      test_elem,
      style,
      w = 0,
      css;
    
    if ( !grouped_next_indent ) {
      test_elem = $('<div id="grouped-next-test"/>')
        .hide()
        .appendTo( 'body' );
      
      grouped_next_indent = parseInt( test_elem.css('margin-left') );
      test_elem.remove();
      
      debug.log( 'grouped indent:', w );
    }
    
    if ( elem.length ) {
      w = elem.css( 'width','auto' ).outerWidth();
      debug.log( 'timestamp width', w );
      
      css = ''
        + '.time {'
        + '  width: ' + elem.width() + 'px;'
        + '}'
        
        + 'p > div {'
        + '  text-indent: -' + w + 'px;'
        + '  margin-left: ' + w + 'px;'
        + '}'
        
        + 'p.grouped-next > div {'
        + '  text-indent: -' + ( w + grouped_next_indent ) + 'px;'
        + '  margin-left: ' + ( w + grouped_next_indent ) + 'px;'
        + '}'
        
        + '';
      
      style = document.createElement( 'style' );
      style.type = 'text/css';
      style.id = 'timestamp-css';
      style.innerText = css;
      
      $.$('head').append( style );
      
      elem.removeAttr( 'style' );
    } else {
      $('#timestamp-css').remove();
    }
  }
  
  // Show nickname / userhost (data-userhost attribute) on hover.
  
  $.fn.showUserhost = function( state ) {
    return this.each(function(){
      var that = $(this),
        nick = that.html().replace( /^[@%+!&~ ]/, '' ),
        userhost = that.attr( 'data-userhost' ),
        outgoing = that.closest( 'p' ).hasClass( 'outgoing' ),
        text = ( outgoing ? 'You are' : '<b>' + nick + '</b> is' )
          + ' <b>' + userhost + '</b>';
      
      debug.log( 'userhost', nick, userhost );
      
      if ( !spotlight.isEnabledHover() ) {
        text += ' <i>(click to spotlight)</i>';
      }
      
      if ( nick && userhost ) {
        state ? info.show( text, true )
          : info.show();
      }
    });
  };
  
  $('p [data-userhost]')
    .live( 'mouseover', function() {
      $(this).showUserhost( true );
    })
    .live( 'mouseout', function() {
      $(this).showUserhost( false );
    });
  
  // Show element title (data-title attribute) on hover.
  
  $.fn.showTitle = function( state ) {
    return this.each(function(){
      var that = $(this),
        title = that.attr( 'data-title' );
      
      debug.log( 'title', title );
      
      if ( title ) {
        state ? info.show( title )
          : info.show();
      }
    });
  };
  
  $('p [data-title]')
    .live( 'mouseover', function() {
      $(this).showTitle( true );
    })
    .live( 'mouseout', function() {
      $(this).showTitle( false );
    });
  
  return self;
})();
