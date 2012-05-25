/*!
 * Scrollbar
 * @author Kenneth Pierce
 */
var SimpleScroller={
	wrapInScroller: function(item,options) {
		options=options?options:{};
		var $=jQuery;
		item=$(item);
		var scrollwrapper=$('<div class="scroll-wrapper"/>'),
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

		track.append(handle);
		scroll.append(up);
		scroll.append(track);
		scroll.append(down);
		scrollcontent=item.wrap(scrollcontent).parent();
		scrollwrapper=scrollcontent.wrap(scrollwrapper).parent();
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


		//do all this stuff AFTER everything has been rendered(just in case)
		setTimeout(function(){
			scrollcontent.css('position','absolute');
			scrollcontent.css('top','0');
			scrollcontent.css('left','0');
			scrollcontent.css('width',(scrollwrapper.width()-scroll.width()-2)+'px');
			scrollcontent.css('height',scrollcontent.children().height()+'px');
	
			scrollwrapper.css('position','relative');
			scrollwrapper.css('height','100%');
			scrollwrapper.css('width','100%');
	
			scroll.css('cursor','default');
			scroll.css('position','absolute');
			scroll.css('top','0');
			scroll.css('right','0');
	
			var scrollbarHeight=scrollwrapper.innerHeight()-scroll.outerHeight()+scroll.height();
			scroll.css('height',scrollbarHeight+'px');

			track.css('height',(scrollwrapper.height()-up.height()-down.height()-(track.outerHeight()-track.height()))+'px');

			handleHeightRatio=scrollwrapper.height()/scrollcontent.height();//ratio
			if(handleHeightRatio>1) handleHeightRatio=1;
			if(!options.handleHeightFixed) {//has the height been set in the css?
				handle.css('height',track.height()*handleHeightRatio+'px');
			}
			handle.css('position','relative');
			handle.css('top','0');
			windowScrollArea=(scrollcontent.height()-scrollwrapper.height());
			trackScrollArea=track.innerHeight()-handle.height();
		},1000);
	}
};