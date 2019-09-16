(function($){

	var cache = {
		data:{},
		count:0,
		addData:function(key,val){
			console.log(this)
			this.data[key] = val;
			this.count++
		},
		getData:function(key){
			return this.data[key];
		}
	}

	function Search($elem,options){
		this.$elem = $elem;
		this.options = options;
		this.$searchForm = this.$elem.find('.search-form');
		this.$searchInput = this.$elem.find('.search-input');
		this.$searchBtn = this.$elem.find('.search-btn');
		this.$searchList = this.$elem.find('.search-list');

		this.timer = null;
		this.jqXHR = null;

		this.init();

		//判断是否显示下拉层
		if(this.options.autocomplete){
			this.autocomplete();
		}
	}

	Search.prototype = {
		constructor:Search,
		init:function(){
			this.$searchBtn.on('click',$.proxy(this.submit,this));
		},
		submit:function(){
			// console.log(this.getInputVal())
			if(!this.getInputVal()){
				return false;
			}
			this.$searchForm.trigger('submit');
		},
		getInputVal:function(){
			return $.trim(this.$searchInput.val());
		},
		autocomplete:function(){
			this.showList();
			//输入框监听input事件
			if(this.options.delayData){
				this.$searchInput.on('input',function(){
					clearTimeout(this.timer)
					this.timer = setTimeout(function(){
						this.getData();
					}.bind(this),this.options.delayData)
				}.bind(this));
			}else{
				this.$searchInput.on('input',$.proxy(this.getData,this));
			}
			
			//点击外部收起下拉层
			$(document).on('click',function(){
				this.hideList();
			}.bind(this));
			//获取焦点时打开下拉层
			this.$searchInput.on('focus',function(){
				if(!this.getInputVal()) return;
				this.showList();
			}.bind(this))
			//阻止事件冒泡
			this.$searchInput.on('click',function(ev){
				ev.stopPropagation();
			});
			//点击下拉层列表提交表单
			var _this = this;
			this.$elem.on('click','.search-li',function(ev){
				// console.log($(this).html())
				var val = $(this).html();
				_this.setInputVal(val);
				_this.submit();
			})
		},
		getData:function(){
			//当值为空时不请求数据
			if(!this.getInputVal()){
				this.hideList();
				return ;
			}

			//发送最新数据
			if(this.jqXHR){
				this.jqXHR.abort();
			}

			if(cache.getData(this.getInputVal())){
				var cacheData = cache.getData(this.getInputVal());
				var html = '';
				for(var i=0;i<cacheData.result.length;i++){
					html += '<li class="search-li">' + cacheData.result[i][0] + '</li>'
				}
				this.appendHTML(html);
				if(!html == ''){
					this.showList();
				}else{
					this.hideList();
				}
				console.log(cache.data)

				return ;
			}

			this.jqXHR = $.ajax({
				url:this.options.url + this.getInputVal(),
				dataType:'jsonp',
				jsonp:'callback'
			}).done(function(data){
				cache.addData(this.getInputVal(),data);
				console.log(111)
				var html = '';
				for(var i=0;i<data.result.length;i++){
					html += '<li class="search-li">' + data.result[i][0] + '</li>'
				}
				this.appendHTML(html);
				if(!html == ''){
					this.showList();
				}else{
					this.hideList();
				}
				
			}.bind(this)).fail(function(err){
				console.log(err);
			}).always(function(){
				this.jqXHR = null;
			}.bind(this));
		},
		appendHTML:function(html){
			this.$searchList.html(html);
		},
		showList:function(){
			this.$searchList.showHide('show');
		},
		hideList:function(){
			this.$searchList.showHide('hide');
		},
		setInputVal:function(val){
			this.$searchInput.val(val);
			// console.log(val)
		}
	}

	Search.DEFAULT = {
		autocomplete:true,
		url:"https://suggest.taobao.com/sug?q=",
		js:true,
		mode:'slide',
		delayData:300
	};

	$.fn.extend({
		search:function(options){
			this.each(function(){
				var $elem = $(this);
				var search = $elem.data('search');
				if(!search){
					options = $.extend({},Search.DEFAULT,options);
					search = new Search($elem,options);
					$elem.data('search',search);
				}
				if(typeof search[options] == 'function'){
					search[options]();
				}
			})
		}
	});
})(jQuery);