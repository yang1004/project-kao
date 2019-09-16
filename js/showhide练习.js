(function($){
	function init($elem,callback){
		if($elem.is(':hidden')){
			$elem.data('active',"hidden");
			if(typeof callback == "function"){
				callback();
			}
		}else{
			$elem.data('active',"shown");
		}
	}
	function show($elem,callback){
		if($elem.data('active') == "show") return;
		if($elem.data('active') == "shown") return;
		$elem.trigger('show').data("active","show");
		callback();
	}
	function hide($elem,callback){
		if($elem.data('active') == "hide") return;
		if($elem.data('active') == "hidden") return;
		$elem.trigger('hide').data("active","hide");
		callback();
	}

	var slient = {
		init:function($elem){
			$elem.removeClass('transition');
			init($elem);
		},
		show:function($elem){
			show($elem,function(){
				$elem.show();
				$elem.trigger('shown').data("active",'shown');
			})
		},
		hide:function($elem){
			hide($elem,function(){
				$elem.hide();
				$elem.trigger('hidden').data("active",'hidden');
			})
		}
	}

	var js = {
		fade:{
			init:function($elem){
				js._init($elem);
			},
			show:function($elem){
				js._show($elem,"fadeIn");
			},
			hide:function($elem){
				js._hide($elem,"fadeOut");
			}
		},
		slide:{
			init:function($elem){
				js._init($elem);
			},
			show:function($elem){
				js._show($elem,"slideDown");
			},
			hide:function($elem){
				js._hide($elem,"slideUp");
			}
		},
		slideLeftRight:{
			init:function($elem){
				js._customInit($elem,{
					width:0,
					paddingLeft:0,
					paddingRight:0,
					borderLeftWidth:0,
					borderRightWidth:0
				})
			},
			show:function($elem){
				js._customShow($elem);
			},
			hide:function($elem){
				js._customHide($elem,{
					width:0,
					paddingLeft:0,
					paddingRight:0,
					borderLeftWidth:0,
					borderRightWidth:0
				})
			}
		},
		fadeSlideLeftRight:{
			init:function($elem){
				js._customInit($elem,{
					width:0,
					paddingLeft:0,
					paddingRight:0,
					borderLeftWidth:0,
					borderRightWidth:0,
					opacity:0
				})
			},
			show:function($elem){
				js._customShow($elem);
			},
			hide:function($elem){
				js._customHide($elem,{
					width:0,
					paddingLeft:0,
					paddingRight:0,
					borderLeftWidth:0,
					borderRightWidth:0,
					opacity:0
				})
			}
		}
	}
	js._init = function($elem){
		$elem.removeClass('transition');
		init($elem);
	}
	js._show = function($elem,mode){
		show($elem,function(){
			$elem.stop()[mode](function(){
				$elem.trigger('shown').data("active",'shown');
			})
		})
	}
	js._hide = function($elem,mode){
		hide($elem,function(){
			$elem.stop()[mode](function(){
				$elem.trigger('hidden').data("active",'hidden');
			})
		})
	}
	js._customInit = function($elem,options){
		$elem.removeClass('transition');
		var styles = {};
		for(var key in options){
			styles[key] = $elem.css(key);
		}
		$elem.data('styles',styles);
		$elem.css(options)
	}
	js._customShow = function($elem){
		$elem.show();
		show($elem,function(){
			$elem.stop().
			animate($elem.data('styles'),function(){
				$elem.trigger('shown').data("active",'shown');
			})
		})
	}
	js._customHide = function($elem,options){
		hide($elem,function(){
			$elem.stop().
			animate(options,function(){
				$elem.trigger('hidden').data("active",'hidden');
			})
		})
	}

	function getShowhide($elem,options){
		var showhideFn = slient;
		if(options.js){
			showhideFn = js[options.mode];
		}
		showhideFn.init($elem);

		return {
			show:showhideFn.show,
			hide:showhideFn.hide
		}
	}

	var DEFAULT = {
		js:true,
		mode:"slideLeftRight"
	}

	$.fn.extend({
		showHide:function(options){
			return this.each(function(){
				var $elem = $(this);
				var showhideData = $elem.data('showhideData');
				if(!showhideData){
					options = $.extend({},DEFAULT,options);
					var showhideData = getShowhide($elem,options);
					$elem.data('showhideData',showhideData);
				}

				if(typeof showhideData[options] == "function"){
					// console.log(showhideData[options])
					showhideData[options]($elem);
				}
			})
		}
	})
})(jQuery)