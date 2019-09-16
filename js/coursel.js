(function($){
	function Coursel($elem,options){
		this.$elem = $elem;
		this.options = options;
		this.$carouselItems = this.$elem.find('.carousel-item');
		this.$carouselBtns = this.$elem.find('.btn-item');
		this.$courselControls = this.$elem.find('.control');
		
		this.btnLength = this.$carouselBtns.length;
		this.now = this._getControlsIndex(this.options.activeIndex);

		this.timer = null;

		this.init();
	}

	Coursel.prototype = {
		constructor:Coursel,
		init:function(){
			var _this = this;
			this.$elem.trigger('carousel-show',[this.now,this.$carouselItems.eq(this.now)]);
			if(this.options.slide){
				//移走所有图片,显示默认图片
				this.$elem.addClass('slide');
				this.$carouselItems.eq(this.now).css({left:0});
				//记录当前容器的宽度
				this.itemWidth = this.$carouselItems.eq(this.now).width();
				console.log(this.itemWidth)
				
				//初始化移动插件
				this.$carouselItems.move(this.options);

				//监听划入划出事件
				this.$carouselItems.on('move',function(ev){
					var index = _this.$carouselItems.index(this);
					if(_this.now != index){
						_this.$elem.trigger('carousel-show',[index,this]);
					}
				})
				
				this._tab = this._toggle;
			}else{
				//淡入淡出时添加类名fade
				this.$elem.addClass('fade');
				this.$carouselItems.eq(this.now).show();


				this.$carouselItems.showHide(this.options);
				//监听显示隐藏事件
				this.$carouselItems.on('show',function(ev){
					var index = _this.$carouselItems.index(this);
					_this.$elem.trigger('carousel-show',[index,this]);
				})
				this._tab = this._fade;
			}

			this.$carouselBtns.eq(this.now).addClass('active');
			//鼠标放入大盒子中显示左右按钮
			this.$elem.hover(function(){
				this.$courselControls.show();
			}.bind(this),function(){
				this.$courselControls.hide();
			}.bind(this));
			//事件委托点击左右按钮时图片切换
			this.$courselControls.eq(0).on('click',function(ev){
				ev.stopPropagation();
				this._tab(this._getControlsIndex(this.now-1),-1);
			}.bind(this))
			this.$courselControls.eq(1).on('click',function(ev){
				ev.stopPropagation();
				this._tab(this._getControlsIndex(this.now+1),1);
			}.bind(this))
			//是否自动轮播
			if(this.options.autoplay){
				this._autoplay();
				this.$elem.hover($.proxy(this._paused,this),$.proxy(this._autoplay,this))
			}
			//点击底部按钮跳转图片
			
			this.$carouselBtns.on('click',function(){
				// console.log(this);
				btnIndex = $(this).index();
				_this._tab(btnIndex);
			})
		},
		_fade:function(index){
			//如果当前图片和准备显示图片是同一张则不执行
			if(index == this.now) return;
			this.$carouselItems.eq(this.now).showHide('hide');
			this.$carouselItems.eq(index).showHide('show');
			this.$carouselBtns.eq(this.now).removeClass('active');
			this.$carouselBtns.eq(index).addClass('active');

			this.now = index;
		},
		_toggle:function(index,direction){
			//index代表将要显示的图片
			//如果当前显示和即将要显示的是同一张图片则无需执行以下代码
			if(index == this.now) return;
			//direation代表方向1表示正方向-1表示反方向
			if(index > this.now){
				direction = 1;
			}else{
				direction = -1;
			}
			//1.把将要显示的放到指定位置
			this.$carouselItems.eq(index).css({left:direction*this.itemWidth});
			//2.移走当前
			this.$carouselItems.eq(this.now).move('x',-1*direction*this.itemWidth);
			//3.移入将要显示的
			this.$carouselItems.eq(index).move('x',0);
			//4.底部按钮更新
			this.$carouselBtns.eq(this.now).removeClass('active');
			this.$carouselBtns.eq(index).addClass('active');
			//5.更新索引值
			this.now = index;
		},
		_getControlsIndex:function(num){
			if(num >= this.btnLength){
				num = 0;
			}else if(num < 0){
				num = this.btnLength-1;
			}
			return num;
		},
		_autoplay:function(){
			clearInterval(this.timer);
			this.timer = setInterval(function(){
				this.$courselControls.eq(1).trigger('click');
			}.bind(this),this.options.autoplay);
		},
		_paused:function(){
			clearInterval(this.timer);
		}
	}

	Coursel.DEFAULT = {
		js:true,
		activeIndex:0,
		slide:true,
		mode:"fade",
		autoplay:0
	}

	$.fn.extend({
		coursel:function(options){
			this.each(function(){
				var $elem = $(this);
				options = $.extend({},Coursel.DEFAULT,options);
				new Coursel($elem,options)
			})
		}
	})
})(jQuery);