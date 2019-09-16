(function($){
	//懒加载共同函数
	/*
	{
		totalNum:$elem.find('.carousel-img').length-1,
		$elem:$elem,
		eventName:'carousel-show',
		eventPrifix:'carousel'
	}
	*/
	function loadLazy(options){
		var item = {},
			totalLoadNum = 0,
			loadFn = null,
			totalNum = options.totalNum,
			$elem = options.$elem,
			eventName = options.eventName,
			eventPrifix = options.eventPrifix;
		//开始加载
		$elem.on(eventName,loadFn = function(ev,index,elem){
			//判断是否被加载过
			if(!item[index]){
				$elem.trigger(eventPrifix+'-load',[index,elem,function(){
					item[index] = "isLoading";
					totalLoadNum++;
					//所有图片都被加载后则移除事件
					if(totalLoadNum > totalNum){
						$elem.trigger(eventPrifix+'-loaded');
					}
				}]);
			}
		});
		/*
		//执行加载
		$elem.on(eventPrifix+'-load',function(ev,index,elem,success){
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
				success();
			},500)
		});
		*/
		//完成加载 删除函数
		$elem.on(eventPrifix+'-loaded',function(){
			$elem.off(eventPrifix+'-show',loadFn);
		})
	}

	//加载数据共同部分
	function loadDataOnce($parent,$elem,callback){
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
	//加载页面html结构
	function getHtmlOnce($elem,url,callback){
		var data = $elem.data('data');
		if(!data){
			$.getJSON(url,function(resData){
				// console.log(resData)
				callback(resData);
				$elem.data('data',resData);
			})
		}else{
			callback(data);
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
			loadDataOnce($done,$(this),bulidTopList);
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
			loadDataOnce($categoryDone,$(this),bulidCategoryList);
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
	/*
	function loadImgsLazy($elem){
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
	*/
	var $carousel = $('.carousel .carousel-wrap');
	
	// loadImgsLazy($carousel);
	loadLazy({
		totalNum:$carousel.find('.carousel-img').length-1,
		$elem:$carousel,
		eventName:'carousel-show',
		eventPrifix:'carousel'
	});
	//执行加载
	$carousel.on('carousel-load',function(ev,index,elem,success){
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
			success();
		},500)
	});
	$carousel.coursel({autoplay:0});
	/*轮播图部分结束*/

	/*今日热销部分开始*/
	var $todaysCarousel = $('.todays .carousel-wrap');
	// loadImgsLazy($todaysCarousel);
	loadLazy({
		totalNum:$carousel.find('.carousel-img').length-1,
		$elem:$todaysCarousel,
		eventName:'carousel-show',
		eventPrifix:'carousel'
	});
	//执行加载
	$todaysCarousel.on('carousel-load',function(ev,index,elem,success){
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
			success();
		},500)
	});
	$todaysCarousel.coursel({});
	/*今日热销部分结束*/

	/*楼层部分开始*/
	//懒加载部分
	/*
	function tabImgLazy($elem){
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
	*/

	function bulidFloorHtml(data){
		var html = '';
		html += '<div class="container">';
		html += bulidFloorHeaderHtml(data);
		html += bulidFloorBodyHtml(data);
		html += '</div>';
		return html;
	}
	function bulidFloorHeaderHtml(data){
		var html = '';
		html += '<div class="floor-hd">';
		html +=		'<h2 class="floor-title fl">';
		html +=			'<span class="floor-title-num">'+data.num+'F</span>';
		html +=			'<span class="floor-title-text">'+data.text+'</span>';
		html +=		'</h2>';
		html +=		'<ul class="tab-item-wrap fr">';
		for(var i=0;i<data.tabs.length;i++){
			html +=			'<li class="fl">';
			html +=				'<a class="tab-item" href="javascript:;">'+data.tabs[i]+'</a>';
			html +=			'</li>';
			if(i < data.tabs.length-1){
				html +=			'<li class="fl tab-divider"></li>';
			}
		}
		html +=		'</ul>';
		html +=	'</div>';
		return html;
	}
	function bulidFloorBodyHtml(data){
		var html = '';
		html += '<div class="floor-bd">';
		for(var i=0;i<data.items.length;i++){
			html +=		'<ul class="tab-panel clearfix">';
			for(var j=0;j<data.items[i].length;j++){
				html +=			'<li class="floor-item fl">';
				html +=				'<p class="floor-item-pic">';
				html +=					'<a href="#">';
				html +=						'<img class="floor-img" src="images/floor/loading.gif" data-src="images/floor/'+data.num+'/'+(i+1)+'/'+(j+1)+'.png" alt="">';
				html +=					'</a>';
				html +=				'</p>';
				html +=				'<p class="floor-item-name">';
				html +=					'<a class="link" href="#">'+data.items[i][j].name+'</a>';
				html +=				'</p>';
				html +=				'<p class="floor-item-price">￥'+data.items[i][j].price+' </p>';
				html +=			'</li>';
			}
			html +=		'</ul>';
		}
		html +=	'</div>';
		return html;
	}

	// 楼层页面懒加载部分
	/*
	function tabHtmlLazy(){
		var item = {};
		var totalLoadNum = 0;
		var totalNum = $floor.length-1;
		var loadFn = null;
		//开始加载
		$doc.on('floor-show',loadFn = function(ev,index,elem){

			//判断是否被加载过
			if(!item[index]){
				$doc.trigger('floor-load',[index,elem]);
			}
		});
		//执行加载
		$doc.on('floor-load',function(ev,index,elem){
			var timer = null;
			timer = setTimeout(function(){
				//生成html结构
				getHtmlOnce($doc,"data/floor/floorData.json",function(data){
					// console.log(data[index]);
					var html = bulidFloorHtml(data[index]);
					//加载html
					$(elem).html(html);
					//懒加载图片
					// tabImgLazy($(elem));
					loadLazy({
						totalNum:$(elem).find('.floor-img').length-1,
						$elem:$(elem),
						eventName:'tab-show',
						eventPrifix:'tab'
					});
					//执行加载
					$(elem).on('tab-load',function(ev,index,elem,success){
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
								success();
							})
						},500)
					});
					//激活选项卡
					$(elem).floor({});
				})
				
				item[index] = "isLoading";
				totalLoadNum++;
				//所有图片都被加载后则移除事件
				if(totalLoadNum > totalNum){
					$doc.trigger('floor-loaded');
				}
			},500)
			
		});
		//完成加载 删除函数
		$doc.on('floor-loaded',function(){
			$doc.off('floor-show',loadFn);
		})
	}
	*/
	var $floor = $('.floor');
	var $win = $(window);
	var $doc = $(document);
	// tabHtmlLazy();
	loadLazy({
		totalNum:$floor.length-1,
		$elem:$doc,
		eventName:'floor-show',
		eventPrifix:'floor'
	});
	//执行加载
	$doc.on('floor-load',function(ev,index,elem,success){
		var timer = null;
		timer = setTimeout(function(){
			//生成html结构
			getHtmlOnce($doc,"data/floor/floorData.json",function(data){
				// console.log(data[index]);
				var html = bulidFloorHtml(data[index]);
				//加载html
				$(elem).html(html);
				//懒加载图片
				loadLazy({
					totalNum:$(elem).find('.floor-img').length-1,
					$elem:$(elem),
					eventName:'tab-show',
					eventPrifix:'tab'
				});
				//执行加载
				$(elem).on('tab-load',function(ev,index,elem,success){
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
							success();
						})
					},500)
				});
				//激活选项卡
				$(elem).floor({});
				success();
			})
		},500)
		
	});
	
	function isVisible($elem){
		return ($win.height() + $win.scrollTop() > $elem.offset().top && $elem.offset().top + parseFloat($elem.css('height')) > $win.scrollTop()) ? true : false;
	}
	function timeToShow(){
		$floor.each(function(index,elem){
			if(isVisible($(elem))){
				$doc.trigger('floor-show',[index,elem]);
			}
		})
	}
	
	$win.on('load scroll resize',function(){
		clearTimeout($floor.showTimer);
		$floor.showTimer = setTimeout(timeToShow,200)
	})
	// $floor.floor({});
	/*楼层部分结束*/

	/*电梯部分逻辑开始*/
	var $elevator = $('.elevator');
	var $elevatorItem = $('.elevator-item');
	function getFloorNum(){
		var num = -1;
		$floor.each(function(index,elem){
			// console.log(index,elem)
			num = index;
			if($(elem).offset().top > $win.height()/2 + $win.scrollTop()){
				num = index - 1;
				return false
			}
		})
		return num;
	}
	function setElevator(){
		var num = getFloorNum();
		if(num == -1){
			$elevator.fadeOut();
		}else{
			$elevator.fadeIn();
			//清除样式
			$elevatorItem.removeClass('elevator-active');
			//添加样式
			$elevatorItem.eq(num).addClass('elevator-active');
		}
	}
	$win.on('load scroll resize',function(){
		clearTimeout($elevator.showElevatorTimer);
		$elevator.showElevatorTimer = setTimeout(setElevator,200)
	})
	//点击电梯号到达指定楼层
	$elevator.on('click','.elevator-item',function(){
		// console.log($elevatorItem.index(this))
		var num = $elevatorItem.index(this);
		$('html,body').animate({
			scrollTop:$floor.eq(num).offset().top
		})
	})
	/*电梯部分逻辑结束*/

	/*工具栏部分开始*/
	var $backToTop = $('#backToTop');
	$backToTop.on('click',function(){
		$('html,body').animate({
			scrollTop:0
		})
	})
	/*工具栏部分结束*/
})(jQuery);

