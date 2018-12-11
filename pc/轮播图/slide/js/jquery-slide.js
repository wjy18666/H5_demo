function Slide (opt) {
	var def = {
		'class': '.slide',		    //	slide动画父元素
		'model': 'horizontal',    //	方向  horizontal -- 水平方向滚动  vertical -- 垂直方向滚动
		slideIndex: 0,						//	初始化
		slideSpeed: 2000,					//	轮播切换时间
		aniamteSpeed: 800					//	轮播图片过渡动画时间
	}

	opt = $.extend(def, opt)

	this.init(opt)
}

Slide.prototype = {
	init: function (opt) {
		this.rootEle = $(opt['class']);
		this.rootWrapper = this.rootEle.find('.slide_wrapper');
		this.slide = this.rootWrapper.children('.slide_ele');
		this.slideIndex = opt.slideIndex;
		this.slideTimer = null;

		this.renderUI(opt)

		this.slideAnimate(opt)

		this.slideTo(opt)
	},

	renderUI: function (opt) {
		this.setSlideDom(opt)
		this.setPagation()

		this.slideParse(opt)

		this.toPrev(opt)
		this.toNext(opt)
	},

	//	轮播排版
	setSlideDom: function (opt) {
		var rootWrapper = this.rootWrapper;
		var slideClone = this.slide.eq(this.slideIndex).clone();
		rootWrapper.append(slideClone);

		var slide = this.slide;

		if (opt.model === 'horizontal') {
			rootWrapper.css({
				width: (slide.width() * (slide.length + 1)) + 'px',
				height: slide.height() + 'px',
				position: 'absolute',
				top: 0,
				left: 0
			})
		}
		else {
			rootWrapper.css({
				height: (slide.height() * (slide.length + 1)) + 'px',
				width: slide.width() + 'px',
				position: 'absolute',
				top: 0,
				left: 0
			})
		}
	},

	//	生成分页器
	setPagation: function (opt) {
		var slide = this.slide;
		var pagationContainer = this.rootEle.find('.pagation');
		var html = '';

		for (var i = 0; i < slide.length; i ++) {
			html += '<a href="javascript:;" class="'+ (i === this.slideIndex ? 'active' : '') +'"></a>';
		}

		pagationContainer.append(html);
	},

	//	设置分页active
	setPagationActive: function (current) {
		var i = current;
		var pagationContainer = this.rootEle.find('.pagation');
		if (i >= this.slide.length) {
			i = 0
		}

		pagationContainer.find('a').removeClass('active');
		pagationContainer.find('a').eq(i).addClass('active');
	},

	//	动画轮播
	slideAnimate: function (opt) {
		var self = this;
		var rootWrapper = this.rootWrapper;
		var slide = this.slide;

		this.slideTimer = setInterval(function () {
			self.toNextFun(opt)
			
		}, opt.slideSpeed)
	},

	//	过渡动画
	setAnimate: function (opt) {
		this.rootWrapper.stop().animate({
			top: this.setSlideDistance(opt, this.slideIndex).top,
			left: this.setSlideDistance(opt, this.slideIndex).left
		}, this.animateSpeed)
	},

	//	设置轮播box css位置
	setSlideWrapperStyle: function (opt) {
		this.rootWrapper.css({
			top: this.setSlideDistance(opt, this.slideIndex).top,
			left: this.setSlideDistance(opt, this.slideIndex).left
		})
	},

	//轮播暂停
	slideParse: function (opt) {
		var self = this
		this.rootEle.on('mouseover', function () {
			clearInterval(self.slideTimer)
		})
		.on('mouseleave', function () {
			self.slideAnimate(opt)
		})
	},

	//	向前
	toPrev: function (opt) {
		var self = this
		var slide = this.slide;

		this.rootEle.find('.to_prev').on('click', function () {
			self.slideIndex--;
			
			var pagationContainer = self.rootEle.find('.pagation');
			if (self.slideIndex < 0) {
				self.slideIndex = slide.length
				self.setSlideWrapperStyle(opt)
				self.slideIndex = self.slideIndex - 1
			}

			self.setAnimate(opt)

			self.setPagationActive(self.slideIndex)
		})
	},

	//	toNext
	toNext: function (opt) {
		var self = this
		this.rootEle.find('.to_next').on('click', function () {
			self.toNextFun(opt)
		})
	},

	//	toNextFun
	toNextFun: function (opt) {
		this.slideIndex ++;

		if (this.slideIndex > this.slide.length) {
			this.slideIndex = 0
			this.setSlideWrapperStyle(opt)
			this.slideIndex ++
		}

		this.setAnimate(opt)

		this.setPagationActive(this.slideIndex)
	},

	//	根据方向计算距离
	setSlideDistance: function (opt, slideIndex) {
		var slide = this.slide;
		var top = 0;
		var left = 0;

		switch (opt.model) {
			case 'vertical':
				top = -slide.height() * slideIndex + 'px';
				left = 0;
				break;

			default:
				top = 0;
				left = -slide.width() * slideIndex + 'px';
				break;
		}

		return {
			top: top,
			left: left
		}
	},

	//	分页按钮点击
	slideTo: function (opt) {
		var self = this
		this.rootEle.on('click', '.pagation a', function () {
			self.slideIndex = $(this).index();
			self.setAnimate(opt)
			self.setPagationActive(self.slideIndex)
		})
	}
}