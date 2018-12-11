function SlideOpacity (opt) {
	var def = {
		'class': '.slide_opacity',
		'slideSpeed': 2000,
		'opacitySpeed': 400,
		'slideTimer': null,
		'slideIndex': 0
	}

	this.cfg = $.extend(def, opt);

	this.init(this.cfg)
}

SlideOpacity.prototype = {
	init: function (opt) {
		this.rootEle = $(opt['class']);
		this.slide = this.rootEle.find('.slide_ele')

		this.renderUI()

		this.bindEvt()
	},

	renderUI: function () {
		this.renderPagination()

		this.setStyle(this.cfg.slideIndex, this.cfg.slideIndex + 1)

		this.slideAnimate()
	},

	bindEvt: function () {
		var self = this;

		//	后退
		this.rootEle.on('click', '.to_prev', function () {
			self.toPrev()
			self.setPaginationActive(self.cfg.slideIndex)
		})

		//	前进
		this.rootEle.on('click', '.to_next', function () {
			self.toNext()

			self.setPaginationActive(self.cfg.slideIndex)
		})

		//	暂停
		this.rootEle.on('mouseover', function () {
			clearInterval(self.cfg.slideTimer)
		})
		.on('mouseleave', function () {
			self.slideAnimate();
		})

		//	分页按钮点击
		this.paginationClick()
	},

	//	初始化样式
	setStyle: function (current, next) {
		this.slide.eq(current).css({
			zIndex: 2
		})
		this.slide.eq(next).css({
			zIndex: 1
		})
	},

	//	生成分页按钮
	renderPagination: function () {
		console.log(55)
		var slide = this.slide;
		var html = '';

		for (var i = 0; i < slide.length; i ++) {
			html += '<a href="javascript:;" class="'+ (i === this.cfg.slideIndex ? 'active' : '') +'"></a>';
		}

		this.rootEle.find('.pagation').html(html)
	},

	// 过渡动画
	slideAnimate: function () {
		var self = this
		this.cfg.slideTimer = setInterval(function () {
			self.toNext()
			self.setPaginationActive(self.cfg.slideIndex)
		}, this.cfg.slideSpeed)
	},

	//	下一张
	toNext: function () {
		var self = this
		var i = this.cfg.slideIndex + 1

		if (i >= this.slide.length) {
			i = 0
		}

		this.slide.eq(i).css({
			zIndex: 1
		})

		this.slide.eq(this.cfg.slideIndex).stop().animate({
			opacity: 0
		}, this.cfg.opacitySpeed, function () {
			self.slide.eq(i).css({
				'z-index': 2
			})
			$(this).css({
				opacity: 1,
				zIndex: 0
			})
						
		})

		this.cfg.slideIndex = i
	},

	//	设置pagination active
	setPaginationActive: function (current) {
		this.rootEle.find('.pagation a').removeClass('active');
		this.rootEle.find('.pagation a').eq(current).addClass('active');
	},

	// 前一张
	toPrev: function () {
		var i = this.cfg.slideIndex - 1;
		var self = this;

		if (i < 0) {
			i = this.slide.length - 1
		}

		this.slide.eq(i).css({
			zIndex: 1
		})

		this.slide.eq(this.cfg.slideIndex).stop().animate({
			opacity: 0
		}, this.cfg.opacitySpeed, function () {
			self.slide.eq(i).css({
				zIndex: 2
			})

			$(this).css({
				opacity: 1,
				zIndex: 0
			})
		})

		this.cfg.slideIndex = i
	},

	paginationClick: function () {
		var self = this
		this.rootEle.on('click', '.pagation a', function () {
			var index = $(this).index()
			//console.log(self.cfg.slideIndex)
			self.slide.eq(index).css({
				zIndex: 1
			})


			self.slide.eq(self.cfg.slideIndex).stop().animate({
				opacity: 0
			}, self.cfg.opacitySpeed, function () {
				self.slide.eq(index).css({
					zIndex: 2
				})

				$(this).css({
					zIndex: 0,
					opacity: 1
				})
			})
			self.cfg.slideIndex = index
			self.setPaginationActive(index)
		})
	}
}