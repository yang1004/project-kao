(function($){
	function Floor($elem,options){
		this.$elem = $elem;
		this.options = options;
		this.$tabItems = this.$elem.find('.tab-item');
		this.$tabPanels = this.$elem.find('.tab-panel');
		
		this.itemLength = this.$tabItems.length;
		this.now = this._getControlsIndex(this.options.activeIndex);

		this.init();
	}

	Floor.prototype = {
		constructor:Floor,
		init:function(){
			//初始化页面
			var _this = this;
			this.$tabItems.eq(this.now).addClass('tab-item-active');
			this.$tabPanels.eq(this.now).show();
			//初始化显示隐藏插件
			this.$tabPanels.showHide(this.options);
			//监听事件
			this.$elem.trigger('tab-show',[this.now,this.$tabPanels.eq(this.now)])
			this.$tabPanels.on('show',function(ev){
				// console.log(ev.type);
				_this.$elem.trigger('tab-show',[_this.$tabPanels.index(this),this])
			})
			//判断点击或者移入事件
			var itemEvent = "";
			if(this.options.eventName == "click"){
				itemEvent = "click";
			}else{
				itemEvent = "mouseenter";
			}
			//绑定事件
			this.$elem.on(itemEvent,'.tab-item',function(){
				var index = _this.$tabItems.index(this);
				_this._toggle(index);
			});
			//是否自动轮播
			if(this.options.autoplay){
				this._autoplay();
				this.$elem.hover($.proxy(this._paused,this),$.proxy(this._autoplay,this))
			}
		},
		_toggle:function(index){
			//index代表将要显示的图片
			//隐藏当前
			this.$tabItems.eq(this.now).removeClass('tab-item-active');
			this.$tabPanels.eq(this.now).showHide('hide');
			//显示将要显示的
			this.$tabItems.eq(index).addClass('tab-item-active');
			this.$tabPanels.eq(index).showHide('show');
			//更新索引
			this.now = index;
		},
		_getControlsIndex:function(num){
			if(num >= this.itemLength){
				num = 0;
			}else if(num < 0){
				num = this.itemLength;
			}
			return num;
		},
		_autoplay:function(){
			clearInterval(this.timer);
			this.timer = setInterval(function(){
				this._toggle(this._getControlsIndex(this.now+1))
			}.bind(this),this.options.autoplay);
		},
		_paused:function(){
			clearInterval(this.timer);
		}
	}

	Floor.DEFAULT = {
		js:true,
		activeIndex:0,
		mode:"fade",
		eventName:"click",
		autoplay:0
	}

	$.fn.extend({
		floor:function(options){
			this.each(function(){
				var $elem = $(this);
				var floor = $elem.data('floor');
				if(!floor){
					options = $.extend({},Floor.DEFAULT,options);
					floor = new Floor($elem,options);
					$elem.data('floor',floor);
				}
				if(typeof floor[options] == 'function'){
					floor[options]();
				}
			})
		}
	});
})(jQuery);