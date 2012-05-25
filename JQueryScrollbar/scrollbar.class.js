/**!
 * Scrollbar
 * @author Kenneth Pierce
 */
var SimpleScrollbar={
	wrapInScroller: function(item,options) {
		options=options?options:{};
		var $=jQuery;
		var scrollwrapper=$(item),
			scrollcontent=$('<div class="scroll-content"/>'),
			scroll=$('<div class="scrollbar" style="cursor:default"/>'),
			handle=$('<button type="button" class="scrollbar-handle"/>'),
			track=$('<div class="scrollbar-track"/>'),
			up=$('<div class="scrollbar-up"><button type="button"></button></div>'),
			down=$('<div class="scrollbar-down"><button type="button"></button></div>'),
			mouseDown=false,
			scrollDownTimer=null,
			scrollUpTimer=null,
			handleHeightRatio=0,
			windowScrollArea=0,
			trackScrollArea=0,
		//timed scroll events
			downScrollFun=function() {
				if(handleHeightRatio==1) return;
				var top=parseInt(scrollcontent.css('top'))-12;
				if(top<(-windowScrollArea)) top=(-windowScrollArea);
				scrollcontent.css('top',top+'px');
				handle.css('top',(0-top/windowScrollArea*trackScrollArea)+'px');
			},
			upScrollFun=function() {
				if(handleHeightRatio==1) return;
				var top=parseInt(scrollcontent.css('top'))+12;
				if(top>0) top=0;scrollcontent.css('top',top+'px');
				handle.css('top',(0-top/windowScrollArea*trackScrollArea)+'px');
			},
			scrollListener=function(e) {
				if(mouseDown&&handleHeightRatio!=1) {
					var top=e.pageY-track.offset().top-handle.height()/2;
					if(top<0) top=0;
					else if(top>trackScrollArea) top=trackScrollArea;
					var scrollPos=0-(top/trackScrollArea)*windowScrollArea;
					scrollcontent.css('top',scrollPos+'px');
					handle.css('top',top+'px');
				}
				return false;
			};

		scrollwrapper.addClass('scroll-wrapper');
		track.append(handle);
		scroll.append(up);
		scroll.append(track);
		scroll.append(down);
		scrollcontent=$(scrollwrapper.wrapInner(scrollcontent).find('.scroll-content').get(0));
		scrollwrapper.append(scroll);

		//scroll button events
		//scroll if held down
		down.children().bind('mousedown',function(e) { scrollDownTimer=setInterval(downScrollFun,500);return false; });
		down.children().click(downScrollFun);//iPad fix
		//scroll if held down
		up.children().bind('mousedown',function(e) { scrollUpTimer=setInterval(upScrollFun,500);return false; });
		up.children().click(upScrollFun);//iPad fix
		handle.bind('mousedown',function(e) { mouseDown=true;return false; });//set 'drag' flag
		//clear timers and 'drag' flag
		$(document).bind('mouseup',function(e) { mouseDown=false;clearInterval(scrollUpTimer);clearInterval(scrollDownTimer); });
		//do 'drag' operation
		handle.bind('mousemove',scrollListener);
		track.bind('mousemove',scrollListener);

		scrollcontent.css('position','absolute');
		scrollcontent.css('top','0');
		scrollcontent.css('left','0');

		scrollwrapper.css('position','relative');
		
		scroll.css('cursor','default');
		scroll.css('position','absolute');
		scroll.css('top','0');
		scroll.css('right','0');

		handle.css('position','relative');
		handle.css('top','0');
		/* Had some strange cases where not everything had rendered yet.
		 * So, doing all the computational stuff on a delay.
		 */
		setTimeout(function(){
			scrollcontent.css('width',(scrollwrapper.width()-scroll.outerWidth(true))+'px');
			//scrollcontent.css('height',scrollcontent.children().height()+'px');

			var scrollbarHeight=scrollwrapper.innerHeight()-scroll.outerHeight()+scroll.height();
			scroll.css('height',scrollbarHeight+'px');

			track.css('height',(scrollwrapper.height()-up.height()-down.height()-(track.outerHeight()-track.height()))+'px');

			handleHeightRatio=scrollwrapper.height()/scrollcontent.height();//ratio
			if(handleHeightRatio>1) handleHeightRatio=1;
			if(!options.handleheightfixed) {//has the height been set in the css?
				handle.css('height',track.height()*handleHeightRatio+'px');
			}
			windowScrollArea=(scrollcontent.height()-scrollwrapper.height());
			trackScrollArea=track.innerHeight()-handle.height();
		},1000);
	}
};