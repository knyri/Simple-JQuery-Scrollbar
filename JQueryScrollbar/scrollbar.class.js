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
	t.$vscrollbar=$('<div class="scrollbar" style="cursor:default"/>');
	t.$vhandle=$('<button type="button" class="scrollbar-handle"/>');
	t.$vtrack=$('<div class="scrollbar-track vertical"/>');
	t.$up=$('<div class="scrollbar-up"><button type="button"></button></div>');
	t.$down=$('<div class="scrollbar-down"><button type="button"></button></div>');
	
	t.scrollDownTimer=null;
	t.scrollUpTimer=null;
	t.handleHeightRatio=0;
	t.vScrollArea=0;
	t.vScrollLimit=0;
//timed scroll events
	t.scrollDown=function() {
		if(t.handleHeightRatio==1) return;
		var top=t.$scrollarea.scrollTop()+t.options.scrollAmount;
		if(top>t.vScrollArea) top=t.vScrollArea;
		t.$scrollarea.scrollTop(top);
		t.$vhandle.css('top',(top/t.vScrollArea)*t.vScrollLimit+'px');
	};
	t.scrollUp=function() {
		if(t.handleHeightRatio==1) return;
		var top=t.$scrollarea.scrollTop()-t.options.scrollAmount;
		if(top<0) top=0;
		t.$scrollarea.scrollTop(top);
		t.$vhandle.css('top',(top/t.vScrollArea)*t.vScrollLimit+'px');
	};
	t.scrollLeft=function(){
		//TODO: this
	};
	t.scrollRight=function(){
		//TODO: this
	};
	t.scrollListener=function(e) {
		if(t.handleHeightRatio!=1) {
			var top=e.pageY-t.$vtrack.offset().top-t.$vhandle.height()/2;
			if(top<0) top=0;
			else if(top>t.vScrollLimit) top=t.vScrollLimit;
			var scrollPos=(top/t.vScrollLimit)*t.vScrollArea;
			t.$scrollarea.scrollTop(scrollPos);
			t.$vhandle.css('top',top+'px');
		}
		return false;
	};
	t.calculateLayout=function(){
		if(item.css('position')=='static')
			item.css('position','relative');
		t.$scrollarea.css('overflow','hidden');
		t.$vscrollbar.css({'cursor':'default','position':'absolute','top':'0','right':'0'});
		t.$vhandle.css({'position':'relative','top':'0'});
		t.$scrollcontent.css('width',(t.$scrollarea.width()-t.$vscrollbar.outerWidth(true))+'px');

		t.$scrollarea.css('height',item.innerHeight()-(t.$scrollarea.outerHeight(true)-t.$scrollarea.innerHeight())+'px');

		var scrollbarHeight=t.$scrollarea.innerHeight()-t.$vscrollbar.outerHeight()+t.$vscrollbar.height();
		t.$vscrollbar.css('height',scrollbarHeight+'px');

		t.$vtrack.css('height',(t.$scrollarea.height()-t.$up.outerHeight(true)-t.$down.outerHeight(true)-(t.$vtrack.outerHeight(true)-t.$vtrack.height()))+'px');

		t.handleHeightRatio=t.$scrollarea.height()/t.$scrollcontent.height();//ratio
		if(t.handleHeightRatio>1) t.handleHeightRatio=1;
		if(t.options.autoSizeHandle) {//has the height been set in the css?
			t.$vhandle.css('height',t.$vtrack.height()*t.handleHeightRatio+'px');
		}
		t.vScrollArea=(t.$scrollcontent.height()-t.$scrollarea.height());
		t.vScrollLimit=t.$vtrack.height()-t.$vhandle.outerHeight(true);
	};
	t.scrollTo=function(x){
		t.$scrollarea.scrollTop(x);
	};
	/* ********************************
	 * finish building the layout(the scrollbar)
	 */
	item.append(
		t.$vscrollbar
			.append(t.$up)
			.append(t.$vtrack.append(t.$vhandle))
			.append(t.$down)
	);


	/* *********************************
	 * Attach the events
	 */
	t.$down.children().bind('mousedown',function(e) {
		t.scrollDownTimer=setInterval(t.scrollDown,t.options.scrollDelay);
		return false;
	});
	t.$down.children().click(t.scrollDown);//iPad fix
	t.$up.children().bind('mousedown',function(e) {
		t.scrollUpTimer=setInterval(t.scrollUp,t.options.scrollDelay);
		return false;
	});
	t.$up.children().click(t.scrollUp);//iPad fix
	t.$vtrack.bind('mousedown',function(e) {
		$(document).bind('mousemove',t.scrollListener);
		t.scrollListener(e);
		return false;
	});
	//clear timers
	$(document).bind('mouseup',function(e) {
		clearInterval(t.scrollUpTimer);
		clearInterval(t.scrollDownTimer);
		$(document).unbind('mousemove',t.scrollListener);
	});


	/* Had some strange cases where not everything had rendered yet.
	 * So, doing all the computational stuff on a delay.
	 */
	setTimeout(t.calculateLayout,t.options.drawDelay);
};