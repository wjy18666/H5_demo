function Swiper (opt) {
	this.init(opt);
}

Swiper.prototype = {
	def: {
		class: '.swiper-container',
		pagination: true,
		slideIndex: 0,
		swiperTimer: null,
		switchSpeed: 3000,			//	轮播切换时间
		translateSpeed: 300,		//	图片过度动画时间
		w: document.documentElement.clientWidth,
		pagination: '.pagination',
		isSwitch: false,					//	是否是动画切换 下一张
		isToPrev: false,
		isTouch: false,						//	是否开始触摸
		distance: 0,								//	轮播父元素移动css距离
		lastTime: new Date().getTime(),								//	切换时间戳节流
	},
	merge: function (def, opt) {
		for (var key in opt) {
			if (opt.hasOwnProperty(key)) {
				def[key] = opt[key]
			}
		}

		return def;
	},
	init: function (opt) {
		//	小于一张不轮播
		var list = document.querySelectorAll('.swiper-slide');
		if (list.length < 2) {
			return
		}

		this.cfg = this.merge(this.def, opt);
		this.initStyle();
		this.bindEvt();
	},
	//	生成分页圆点以及图片布局样式
	initStyle: function () {
		var root = this.cfg.root = document.querySelector(this.cfg.class);
		var wrapper = this.cfg.wrapper = root.querySelector('.swiper-wrapper');
		var list = this.cfg.list = wrapper.querySelectorAll('.swiper-slide');
		var first = list[0].cloneNode(true);
		var last = list[list.length - 1].cloneNode(true);
		var pagination = root.querySelector('.pagination');
		
		wrapper.insertBefore(last, wrapper.childNodes[0]);
		wrapper.appendChild(first);
		
		this.translateSwitch(this.cfg.w, '0s', this.cfg.slideIndex + 1);
		var len = list.length + 2;
		wrapper.style.width = 100 * len + '%';
		var listArr = this.cfg.cloneList = wrapper.querySelectorAll('.swiper-slide');
		var pagiContainer = document.createElement('div');
		var html = '';

		for (var i = 0; i < len; i ++) {
			listArr[i].style.width = (100 / len) + '%';
			if (i != len - 1 && i !== len - 2) {
				html += '<span></span>';
			}
		}

		pagiContainer.innerHTML = html;
		pagination.appendChild(pagiContainer);
		var circle = pagination.querySelectorAll('span');
		circle[0].classList.add('active');
	},

	bindEvt: function () {
		this.autoPlay();
		this.docHiddenOrShow();
		this.touchSwitch();
	},
	//	下一张
	toNext: function (index) {
		var pageIndex = index;
		if (index >= this.cfg.list.length) {
			this.cfg.isSwitch = true;
			pageIndex = 0;
		}
		//	console.log(index)
		this.setPaginationCiecle(pageIndex);
		this.translateSwitch(this.cfg.w, this.cfg.translateSpeed + 'ms', index + 1);
	},
	//	自动轮播
	autoPlay: function () {
		var self = this;
		wrapper = this.cfg.wrapper;

		this.cfg.swiperTimer = setInterval(function () {
			self.cfg.slideIndex ++;
			self.toNext(self.cfg.slideIndex);
		}, self.cfg.switchSpeed)

		wrapper.addEventListener('webkitTransitionEnd', function () {
			//	最后一张动画结束
			if (self.cfg.isSwitch) {
				self.cfg.slideIndex = 0;
				//	debugger;
				self.transitionEndTranslate(self.cfg.slideIndex);
				console.log('transition toNext end')
				self.cfg.isSwitch = false;
			}

			//	第一张动画结束
			if (self.cfg.isToPrev) {
				self.cfg.slideIndex = self.cfg.list.length - 1;
				//	debugger;
				self.transitionEndTranslate(self.cfg.slideIndex);
				console.log('transition toPrev end')
				self.cfg.isToPrev = false;
			}
			
		}, false)
	},

	//	监听动画结束(第一张或最后一张) 调整样式 
	transitionEndTranslate: function (index) {
		var wrapper = this.cfg.wrapper;
		
		wrapper.style['transition'] = '';
		this.cfg.distance = this.cfg.w * (index + 1);
		wrapper.style['transform'] = 'translate3d(-'+ this.cfg.distance +'px, 0, 0)';
		//	console.log(this.cfg.distance)
	},

	//	translate 正常轮播动画（不是第一张 也不是最后一张）
	translateSwitch: function (w, delay, index) {
		var self = this;
		var wrapper = this.cfg.wrapper;
		//	setTimeout(function () {
			self.cfg.distance = w * index;
			//	console.log(self.cfg.distance)
			wrapper.style['transform'] = 'translate3d(-'+ self.cfg.distance +'px, 0, 0)';
			wrapper.style['transition'] = 'transform '+ delay +' ease';
		//	}, 0)
	},
	//	设置分页小圆点
	setPaginationCiecle: function (index) {
		var circle = this.cfg.root.querySelectorAll('.pagination span');
		var active = this.cfg.root.querySelector('.pagination .active');
		active.classList.remove('active');
		circle[index].classList.add('active');
	},
	//	上一张touch
	toPrev: function (index) {
		var pageIndex = index;
		if (index < 0) {
			this.cfg.isToPrev = true;
			pageIndex = this.cfg.list.length - 1;
		}
		//	console.log(pageIndex)
		this.setPaginationCiecle(pageIndex);
		this.translateSwitch(this.cfg.w, this.cfg.translateSpeed + 'ms', index + 1);
	},

	toPrevFunc: function () {
		var self = this;
		this.cfg.slideIndex --;

		var pageIndex = self.cfg.slideIndex;
		if (self.cfg.slideIndex < 0) {
			self.cfg.isToPrev = true;
			pageIndex = this.cfg.list.length - 1;
		}
		//	console.log(pageIndex)
		this.setPaginationCiecle(pageIndex);
		this.translateSwitch(this.cfg.w, this.cfg.translateSpeed + 'ms', self.cfg.slideIndex + 1);
	},

	//	touch事件
	touchSwitch: function () {
		var root = this.cfg.root;
		var self = this;

		//	手指触摸
		root.addEventListener('touchstart', function (e) {
			e.stopPropagation();
			e.preventDefault();
			console.log('touchstart')
			if (self.cfg.swiperTimer) {
				clearInterval(self.cfg.swiperTimer);
			}

			var now = new Date().getTime();
			var time = now - self.cfg.lastTime;

			if (time < 300) {
				return
			}

			self.cfg.isTouch = true;
			var touch = e.touches[0];
			//	console.log(touch)
			self.start_x = touch.pageX;
			//	console.log(self.start_x)
		}, false)

		//	手指移动
		root.addEventListener('touchmove', function (e) {
			if (self.cfg.isTouch) {
				var touch = e.touches[0];
				self.move_x = touch.pageX;
				var x = self.move_x - self.start_x;

				var wrapper = self.cfg.wrapper;
				wrapper.style['transition'] = '';
				wrapper.style['transform'] = 'translate3d('+ (-self.cfg.distance + x) +'px, 0, 0)';
			}
		}, false)

		//	手指离开
		root.addEventListener('touchend', function () {
			self.cfg.lastTime = new Date().getTime();

			if (!self.cfg.isTouch) {
				return
			}
			
			var x = self.move_x - self.start_x;
			//	下一张 toNext
			if (x < 0) {
				if (Math.abs(x) >= self.cfg.w / 6) {
					self.cfg.slideIndex ++;
					self.toNext(self.cfg.slideIndex);
				}
				else {
					self.translateSwitch(self.cfg.w, self.cfg.translateSpeed + 'ms', self.cfg.slideIndex + 1);
				}
			}

			//	上一张
			if (x > 0) {
				if (x >= self.cfg.w / 6) {
					self.cfg.slideIndex --;
					self.toPrev(self.cfg.slideIndex);
				}
				else {
					self.translateSwitch(self.cfg.w, self.cfg.translateSpeed + 'ms', self.cfg.slideIndex + 1);
				}
			}
			self.cfg.isTouch = false;
			self.autoPlay();
		}, false)
	},
	//	监听页面显示与隐藏
	docHiddenOrShow: function () {
		var self = this;

		document.addEventListener('visibilitychange', function () {
			if (document.hidden) {
				clearInterval(self.cfg.swiperTimer)
			}
			else {
				self.autoPlay();
			}
		}, false)
	}
}