/**!
 * Scrollbar
 * 
 * Options:
 *  scrollDelay: time in milliseconds between scroll increments if one of the scroll buttons is held down
 *  scrollAmount: number of pixels to scroll when a scroll button has been pressed
 *  autoSizeHandle: set to false if the handle size is set in the CSS
 *  drawDelay: amount of time in milliseconds to wait before laying out the components
 * 
 * @author Kenneth Pierce
 */
var SimpleScrollbar=function(item,options){
	var t=this;
	t.options=$.extend({scrollDelay:200,scrollAmount:12,autoSizeHandle:true,drawDelay:1000},options);
	item=$(item).addClass('scroll-wrapper')
		.wrapInner($('<div class="scroll-content"/>'))
		.wrapInner($('<div class="scroll-area"/>'));
	t.$scrollarea=$(item.find('.scroll-area').get(0));
	t.$scrollcontent=$(item.find('.scroll-content').get(0));
	t.$scrollbar=$('<div class="scrollbar" style="cursor:default"/>');
	t.$handle=$('<button type="button" class="scrollbar-handle"/>');
	t.$track=$('<div class="scrollbar-track"/>');
	t.$up=$('<div class="scrollbar-up"><button type="button"></button></div>');
	t.$down=$('<div class="scrollbar-down"><button type="button"></button></div>');
	
	t.scrollDownTimer=null;
	t.scrollUpTimer=null;
	t.handleHeightRatio=0;
	t.windowScrollArea=0;
	t.trackScrollArea=0;
//timed scroll events
	t.downScrollFun=function() {
		if(t.handleHeightRatio==1) return;
		var top=t.$scrollarea.scrollTop()+t.options.scrollAmount;//parseInt(scrollcontent.css('top'))-12;
		if(top>t.windowScrollArea) top=t.windowScrollArea;
		t.$scrollarea.scrollTop(top);//scrollcontent.css('top',top+'px');
		t.$handle.css('top',(top/t.windowScrollArea)*t.trackScrollArea+'px');
	};
	t.upScrollFun=function() {
		if(t.handleHeightRatio==1) return;
		var top=t.$scrollarea.scrollTop()-t.options.scrollAmount;//parseInt(scrollcontent.css('top'))+12;
		if(top<0) top=0;
		t.$scrollarea.scrollTop(top);//scrollcontent.css('top',top+'px');
		t.$handle.css('top',(top/t.windowScrollArea)*t.trackScrollArea+'px');
	};
	t.scrollListener=function(e) {
		if(t.handleHeightRatio!=1) {
			var top=e.pageY-t.$track.offset().top-t.$handle.height()/2;
			if(top<0) top=0;
			else if(top>t.trackScrollArea) top=t.trackScrollArea;
			var scrollPos=(top/t.trackScrollArea)*t.windowScrollArea;
			t.$scrollarea.scrollTop(scrollPos);//scrollcontent.css('top',scrollPos+'px');
			t.$handle.css('top',top+'px');
		}
		return false;
	};
	t.calculateLayout=function(){
		t.$scrollcontent.css('width',(t.$scrollarea.width()-t.$scrollbar.outerWidth(true))+'px');

		t.$scrollarea.css('height',item.innerHeight()-(t.$scrollarea.outerHeight(true)-t.$scrollarea.innerHeight())+'px');

		var scrollbarHeight=t.$scrollarea.innerHeight()-t.$scrollbar.outerHeight()+t.$scrollbar.height();
		t.$scrollbar.css('height',scrollbarHeight+'px');

		t.$track.css('height',(t.$scrollarea.height()-t.$up.height()-t.$down.height()-(t.$track.outerHeight()-t.$track.height()))+'px');

		t.handleHeightRatio=t.$scrollarea.height()/t.$scrollcontent.height();//ratio
		if(t.handleHeightRatio>1) t.handleHeightRatio=1;
		if(t.options.autoSizeHandle) {//has the height been set in the css?
			t.$handle.css('height',t.$track.height()*t.handleHeightRatio+'px');
		}
		t.windowScrollArea=(t.$scrollcontent.height()-t.$scrollarea.height());
		t.trackScrollArea=t.$track.innerHeight()-t.$handle.height();
	};
	t.scrollTo=function(x){
		t.$scrollarea.scrollTop(x);
	};
	/* ********************************
	 * finish building the layout(the scrollbar)
	 */
	t.$track.append(t.$handle);
	t.$scrollbar.append(t.$up);
	t.$scrollbar.append(t.$track);
	t.$scrollbar.append(t.$down);
	item.append(t.$scrollbar);


	/* *********************************
	 * Attach the events
	 */
	t.$down.children().bind('mousedown',function(e) {
		t.scrollDownTimer=setInterval(t.downScrollFun,t.options.scrollDelay);
		return false;
	});
	t.$down.children().click(t.downScrollFun);//iPad fix
	//scroll if held down
	t.$up.children().bind('mousedown',function(e) {
		t.scrollUpTimer=setInterval(t.upScrollFun,t.options.scrollDelay);
		return false;
	});
	t.$up.children().click(t.upScrollFun);//iPad fix
	t.$handle.bind('mousedown',function(e) {
		//mouseDown=true;
		$(document).bind('mousemove',t.scrollListener);
		return false;
	});//set 'drag' flag
	//clear timers and 'drag' flag
	$(document).bind('mouseup',function(e) {
		//mouseDown=false;
		clearInterval(t.scrollUpTimer);
		clearInterval(t.scrollDownTimer);
		$(document).unbind('mousemove',t.scrollListener);
	});
	//scrollcontent.css('position','absolute');
	//scrollcontent.css('top','0');
	//scrollcontent.css('left','0');

	if(item.css('position')=='static')
		item.css('position','relative');
	t.$scrollarea.css('overflow','hidden');
	
	t.$scrollbar.css('cursor','default');
	t.$scrollbar.css('position','absolute');
	t.$scrollbar.css('top','0');
	t.$scrollbar.css('right','0');

	t.$handle.css('position','relative');
	t.$handle.css('top','0');
	/* Had some strange cases where not everything had rendered yet.
	 * So, doing all the computational stuff on a delay.
	 */
	setTimeout(t.calculateLayout,t.options.drawDelay);
};