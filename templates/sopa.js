(function(){
   var add_the_sopa_div = function($){
       var state = '{{ state }}';
       var info = [];
       info = info.concat(supporters.politics);
       // Need to pull some in from media
       if (info.length < 3){
           for (; info.length < 3;){
               var idx = Math.floor(Math.random()*supporters.media.length);
               info.push(supporters.media.splice(idx,1)[0]);
           }
       }

       $('body').prepend('<style type="text/css">\
       .sopa-header-holder{width: 940px; margin: 0 auto;}\
       .sopa-header-block{display: inline; width: 20%; float: left; text-align: center; font-size: 14px;}\
       .sopa-header-block-title {font-weight: bold;}\
       .sopa-header-block-title {}\
       \
       </style>');
       // Put a spacer at the top of the page
       $('body').prepend('<div class="sopa-header-shim" style="height:40px;background-color: {{bg_color}};"></div>');
       // Put a fixed div at the top of the page
       $('body').prepend('<div style="z-index:1000;height:40px;background-color: {{bg_color}}; position: fixed; top:0;width:100%;border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 5px;"" class="sopa-header"></div>');
       $('.sopa-header').append('<div class="sopa-header-holder"></div>');
       $('.sopa-header-holder').append('<div class="sopa-header-block">' +
           '<div class="sopa-header-block-title">SOPA Supporters</div>' +
           '<div class="sopa-header-block-body"> <a href="http://sopajs.org">What\'s this?</a></div>' +
           '</div>');
       $('.sopa-header-holder').append('<div class="sopa-header-block">' + format_info(info[0]) + '</div>');
       $('.sopa-header-holder').append('<div class="sopa-header-block">' + format_info(info[1]) + '</div>');
       $('.sopa-header-holder').append('<div class="sopa-header-block">' + format_info(info[2]) + '</div>');
       $('.sopa-header-holder').append('<div style="clear:both"><div>');
   };
   var format_info = function(info) {
       return ' \
        <div class="sopa-header-block-title"> \
        <a href="' + info[1].link + '">' + info[0] + '</a></div> \
        <div class="sopa-header-block-body"> \
        <a href="' + info[1].info_link + '">information</a></div> \
       '
   };
   // From http://css-tricks.com/snippets/jquery/load-jquery-only-if-not-present/
   // Only do anything if jQuery isn't defined
   if (typeof jQuery == 'undefined') {
            if (typeof $ == 'function') { console.log('Warning: $ is already defined, but not by jQuery.')}
            function getScript(url, success) {
                    var script     = document.createElement('script');
                        script.src = url;
                    var head = document.getElementsByTagName('head')[0],
                    done = false;
                    // Attach handlers for all browsers
                    script.onload = script.onreadystatechange = function() {
                            if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
                            done = true;
                                    // callback function provided as param
                                    success();
                                    script.onload = script.onreadystatechange = null;
                                    head.removeChild(script);
                            };
                    };
                    head.appendChild(script);
            };
            getScript('//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js', function() {
                    if (typeof jQuery=='undefined') {
                            // Super failsafe - still somehow failed...
                    } else {
                            // jQuery loaded! Make sure to use .noConflict just in case
                            sopa_jq = jQuery.noConflict(true);
                            add_the_sopa_div(sopa_jq);
                    }
            });
   } else { // jQuery was already loaded
       sopa_jq = jQuery.noConflict(true);
       add_the_sopa_div(sopa_jq);
   };

   var supporters = {
    {% if type=="politics" and state %}
       politics: [
           {% if state=="CA" %}
               ['Sen. Diane Feinstein (D)', {
                   supports: true,
                   link: 'http://feinstein.senate.gov',
                   info_link:'http://sopaopera.org/F000062'
               }],
               ['Sen. Barbara Boxer (D)', {
                   supports: true,
                   link: 'http://boxer.senate.gov',
                   info_link:'http://sopaopera.org/B000711/'
               }],
           {% endif %}
       ],
       media: [
           ['ABC [US]', {
               link: 'http://abc.com',
               info_link: 'http://mediamatters.org/blog/201201050008'
           }],
           ['CBS [US]', {
               link: 'http://cbs.com',
               info_link: 'http://mediamatters.org/blog/201201050008'
           }],
           ['NBC [US]', {
               link: 'http://nbc.com',
               info_link: 'http://mediamatters.org/blog/201201050008'
           }],
       ]
    {% endif %}
   }
})();

