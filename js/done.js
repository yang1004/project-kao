(function($){
	function Done($elem,options){
		this.$elem = $elem;
		this.options = options;
		this.$donelist = this.$elem.find('.donelist');
		this.doneClass = $('.done').data("done") + "-done";

		this.timer = null;

		this.init(this.$elem);
	}

	Done.prototype = {
		init:function($elem){
			//初始化显示隐藏插件
			this.$donelist.showHide(this.options);
			//监听显示隐藏事件
			this.$donelist.on('show shown hide hidden',function(ev){
				this.$elem.trigger('done-' + ev.type);
			}.bind(this));
			//绑定事件
			if(this.options.eventName == "click"){
				this.$elem.on('click',function(ev){
					ev.stopPropagation();
					this.show();
				}.bind(this));

				$(document).on('click',function(){
					this.hide();
				}.bind(this))
			}else{
				this.$elem.hover($.proxy(this.show,this),$.proxy(this.hide,this));
			}
			
		},
		show:function($elem){
			if(this.options.delay){
				this.timer = setTimeout(function(){
					this.$donelist.showHide('show');
					//添加class
					this.$elem.addClass(this.doneClass);
				}.bind(this),this.options.delay);
			}else{
				this.$donelist.showHide('show');
				//添加class
				this.$elem.addClass(this.doneClass);
			}
		},
		hide:function($elem){
			clearTimeout(this.timer)
			this.$donelist.showHide('hide');
			this.$elem.removeClass(this.doneClass);
		}
	}

	Done.DEFAULT = {
		js:true,
		mode:"slide",
		delay:300,
		eventName:""
	}

	$.fn.extend({
		done:function(options){
			this.each(function(){
				var $elem = $(this);
				options = $.extend({},Done.DEFAULT,options);
				new Done($elem,options)
			})
		}
	})
})(jQuery);