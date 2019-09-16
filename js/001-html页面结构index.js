(function($){
	//加载数据共同部分
	function loadHtmlOnce($parent,$elem,callback){
		var url = $elem.data('load');
		if(!url) return;
		if(!$elem.data('loadlist')){
			setTimeout(function(){
				$.getJSON(url,function(data){
					typeof callback == "function" && callback($parent,$elem,data);
				})
			},1000);
		}
	}

	//加载图片
	function loadImage(imgUrl,success,error){
		var image = new Image();
		image.onload = function(imgUrl){
			// $img.attr('src',imgUrl);
			typeof success == "function" && success(imgUrl);
		};
		image.onerror = function(imgUrl){
			// $img.attr('src',"images/focus-carousel/placeholder.png");
			typeof success == "function" && error(imgUrl);
		}
		image.src = imgUrl;
	}

	/*头部区域开始*/
	var $done = $('.top .done');
	$done.done({
		js:true,
		mode:"slide"
	})
	$done.on('done-show done-shown done-hide done-hidden',function(ev){
		if(ev.type == "done-show"){
			/*
			var $elem = $(this);
			var index = $done.index($elem);
			var $donelist = $elem.find('.donelist');
			var url = $elem.data('load');
			if(!url) return;
			if(!$elem.data('loadlist')){
				setTimeout(function(){
					$.getJSON(url,function(data){
						console.log(data);
						var html = '';
						for(var i=0;i<data[index].length;i++){
							html += '<li><a href="' + data[index][i].url + '">' + data[index][i].name + '</a></li>'
						}
						$donelist.html(html);
						$elem.data('loadlist',true);
					})
				},1000);
			}
			*/
			loadHtmlOnce($done,$(this),bulidTopList);
		}
	});

	//头部下拉层
	function bulidTopList($parent,$elem,data){
		var $donelist = $elem.find('.donelist');
		var index = $parent.index($elem);
		var html = '';
		for(var i=0;i<data[index].length;i++){
			html += '<li><a href="' + data[index][i].url + '">' + data[index][i].name + '</a></li>'
		}
		$donelist.html(html);
		$elem.data('loadlist',true);
	}
	/*头部区域结束*/

	/*头部搜索开始*/
	var $search = $('.search');
	$search.search({});
	/*头部搜索结束*/

	/*分类区域开始*/
	var $categoryDone = $('.focus .done');
	$categoryDone.done({
		js:true,
		mode:"fade"
	});
	$categoryDone.on('done-show done-shown done-hide done-hidden',function(ev){
		if(ev.type == "done-show"){
			/*
			var $elem = $(this);
			var index = $categoryDone.index($elem);
			var $donelist = $elem.find('.donelist');
			var url = $elem.data('load');
			if(!url) return;
			if(!$elem.data('loadlist')){
				setTimeout(function(){
					$.getJSON(url,function(data){
						console.log(data);
						var html = '';
						for(var i=0;i<data[index].length;i++){
							html += '<dl class="category-details">';
							html += 	'<dt class="category-details-title fl">';
							html += 		'<a href="#" class="category-details-title-link">'+ data[index][i].title +'</a>';
							html += 	'</dt>';
							html += 	'<dd class="category-details-item fl">';
							for(var j=0;j<data[index][i].items.length;j++){
								html += 		'<a href="#" class="link">'+ data[index][i].items[j] +'</a>';
							}
							html += 	'</dd>';
							html += '</dl>';
						}
						$donelist.html(html);
						$elem.data('loadlist',true);
					})
				},1000);
			}
			*/
			loadHtmlOnce($categoryDone,$(this),bulidCategoryList);
		}
	});

	//分类列表
	function bulidCategoryList($parent,$elem,data){
		var $donelist = $elem.find('.donelist');
		var index = $parent.index($elem);
		var html = '';
		for(var i=0;i<data[index].length;i++){
			html += '<dl class="category-details">';
			html += 	'<dt class="category-details-title fl">';
			html += 		'<a href="#" class="category-details-title-link">'+ data[index][i].title +'</a>';
			html += 	'</dt>';
			html += 	'<dd class="category-details-item fl">';
			for(var j=0;j<data[index][i].items.length;j++){
				html += 		'<a href="#" class="link">'+ data[index][i].items[j] +'</a>';
			}
			html += 	'</dd>';
			html += '</dl>';
		}
		$donelist.html(html);
		$elem.data('loadlist',true);
	}
	/*分类区域结束*/

	/*轮播图部分开始*/
	//懒加载共同函数
	function loadLazy($elem){
		var item = {};
		var totalLoadNum = 0;
		var totalNum = $elem.find('.carousel-img').length-1;
		var loadFn = null;
		//开始加载
		$elem.on('carousel-show',loadFn = function(ev,index,elem){
			//判断是否被加载过
			if(!item[index]){
				$elem.trigger('carousel-load',[index,elem]);
			}
		});
		//执行加载
		$elem.on('carousel-load',function(ev,index,elem){
			var timer = null;
			timer = setTimeout(function(){
				var $elem = $(elem);
				var $imgs = $elem.find('.carousel-img');
				$imgs.each(function(){
					var $img = $(this);
					var imgUrl = $img.data('src');
					loadImage(imgUrl,function(){
						$img.attr('src',imgUrl);
					},function(){
						$img.attr('src',"images/focus-carousel/placeholder.png");
					});
				})
				
				item[index] = "isLoading";
				totalLoadNum++;
				//所有图片都被加载后则移除事件
				if(totalLoadNum > totalNum){
					$elem.trigger('carousel-loaded');
				}
			},500)
			
		});
		//完成加载 删除函数
		$elem.on('carousel-loaded',function(){
			$elem.off('carousel-show',loadFn);
		})
	}
	var $carousel = $('.carousel .carousel-wrap');
	/*
	$carousel.item = {};
	$carousel.totalLoadNum = 0;
	$carousel.totalNum = $carousel.find('.carousel-img').length-1;
	$carousel.loadFn = null;
	//开始加载
	$carousel.on('carousel-show',$carousel.loadFn = function(ev,index,elem){
		//判断是否被加载过
		if(!$carousel.item[index]){
			$carousel.trigger('carousel-load',[index,elem]);
		}
	});
	//执行加载
	$carousel.on('carousel-load',function(ev,index,elem){
		var $elem = $(elem);
		var $img = $elem.find('.carousel-img');
		var imgUrl = $img.data('src');
		loadImage(imgUrl,function(){
			$img.attr('src',imgUrl);
		},function(){
			$img.attr('src',"images/focus-carousel/placeholder.png");
		});
		$carousel.item[index] = "isLoading";
		$carousel.totalLoadNum++;
		//所有图片都被加载后则移除事件
		if($carousel.totalLoadNum > $carousel.totalNum){
			$carousel.trigger('carousel-loaded');
		}
	});
	//完成加载
	$carousel.on('carousel-loaded',function(){
		$carousel.off('carousel-show',$carousel.loadFn);
	})
	*/
	loadLazy($carousel);
	$carousel.coursel({autoplay:1000});
	/*轮播图部分结束*/

	/*今日热销部分开始*/
	var $todaysCarousel = $('.todays .carousel-wrap');
	/*
	$todaysCarousel.item = {};
	$todaysCarousel.totalLoadNum = 0;
	$todaysCarousel.totalNum = $todaysCarousel.find('.carousel-img').length-1;
	$todaysCarousel.loadFn = null;
	//开始加载
	$todaysCarousel.on('carousel-show',$todaysCarousel.loadFn = function(ev,index,elem){
		//判断是否被加载过
		if(!$todaysCarousel.item[index]){
			$todaysCarousel.trigger('carousel-load',[index,elem]);
		}
	});
	//执行加载
	$todaysCarousel.on('carousel-load',function(ev,index,elem){
		var $elem = $(elem);
		var $imgs = $elem.find('.carousel-img');
		$imgs.each(function(){
			var $img = $(this);
			var imgUrl = $img.data('src');
			loadImage(imgUrl,function(){
				$img.attr('src',imgUrl);
			},function(){
				$img.attr('src',"images/focus-carousel/placeholder.png");
			});
		})
		
		$todaysCarousel.item[index] = "isLoading";
		$todaysCarousel.totalLoadNum++;
		//所有图片都被加载后则移除事件
		if($todaysCarousel.totalLoadNum > $todaysCarousel.totalNum){
			$todaysCarousel.trigger('carousel-loaded');
		}
	});
	//完成加载
	$todaysCarousel.on('carousel-loaded',function(){
		$todaysCarousel.off('carousel-show',$todaysCarousel.loadFn);
	})
	*/
	loadLazy($todaysCarousel);
	$todaysCarousel.coursel({});
	/*今日热销部分结束*/

	/*楼层部分开始*/
	//懒加载部分
	var $floor = $('.floor');
	function tabLazy($elem){
		var item = {};
		var totalLoadNum = 0;
		var totalNum = $elem.find('.floor-img').length-1;
		var loadFn = null;
		//开始加载
		$elem.on('tab-show',loadFn = function(ev,index,elem){
			//判断是否被加载过
			if(!item[index]){
				$elem.trigger('tab-load',[index,elem]);
			}
		});
		//执行加载
		$elem.on('tab-load',function(ev,index,elem){
			var timer = null;
			timer = setTimeout(function(){
				var $elem = $(elem);
				var $imgs = $elem.find('.floor-img');
				$imgs.each(function(){
					var $img = $(this);
					var imgUrl = $img.data('src');
					loadImage(imgUrl,function(){
						$img.attr('src',imgUrl);
					},function(){
						$img.attr('src',"images/focus-carousel/placeholder.png");
					});
				})
				
				item[index] = "isLoading";
				totalLoadNum++;
				//所有图片都被加载后则移除事件
				if(totalLoadNum > totalNum){
					$elem.trigger('tab-loaded');
				}
			},500)
			
		});
		//完成加载 删除函数
		$elem.on('tab-loaded',function(){
			$elem.off('tab-show',loadFn);
		})
	}
	/*
	$floor.on('tab-show',function(ev,index,elem){
		console.log(index,elem)
	})
	*/
	$floor.each(function(){
		tabLazy($floor);
	})
	$floor.floor({});
	/*楼层部分结束*/

})(jQuery);

