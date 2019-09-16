(function($){
	function init($elem){
		this.$elem = $elem;
		this.$elem.removeClass('transition');
		this.courrentX = parseFloat(this.$elem.css('left'));
		this.courrentY = parseFloat(this.$elem.css('top'));
	}
	function to(x,y,callback){
		x = (typeof x == "number") ? x : this.courrentX;
		y = (typeof y == "number") ? y : this.courrentY;
		if(this.courrentX == x && this.courrentY == y) return;
		this.$elem.trigger('move');
		if(typeof callback == "function"){
			callback();
		} 
		// console.log(x,y);
		this.courrentX = x;
		this.courrentY = y;
	}


	function Slient($elem){
		init.call(this,$elem);
	}
	Slient.prototype = {
		constructor:Slient,
		to:function(x,y){
			to.call(this,x,y,function(){
				this.$elem.css({
					left:x,
					top:y
				});
				this.$elem.trigger('moved');
			}.bind(this));
		},
		x:function(x){
			this.to(x);
		},
		y:function(y){
			this.to(null,y);
		}
	}
	function Js($elem){
		init.call(this,$elem);
	}
	Js.prototype = {
		constructor:Js,
		to:function(x,y){
			to.call(this,x,y,function(){
				this.$elem.stop()
				.animate({
					left:x,
					top:y
				},function(){
					this.$elem.trigger('moved');
				}.bind(this))
				
			}.bind(this));
		},
		x:function(x){
			this.to(x);
		},
		y:function(y){
			this.to(null,y);
		}
	}

	function getmove($elem,options){
		var move = null;
		if(options.js){
			move = new Js($elem);
		}else{
			move = new Slient($elem);
		}


		return move;
	}

	var DEFAULT = {
		js:true
	}

	$.fn.extend({
		move:function(options,x,y){
			return this.each(function(){
				var $elem = $(this);
				// console.log($elem);
				var moveData = $elem.data("moveData");
				if(!moveData){
					options = $.extend({},DEFAULT,options);
					moveData = getmove($elem,options);
					$elem.data("moveData",moveData);
					// console.log(moveData)
				}
				if(typeof moveData[options] == "function"){
					moveData[options](x,y);
					// console.log(moveData[options])
				}

			})
		}
	})
})(jQuery)