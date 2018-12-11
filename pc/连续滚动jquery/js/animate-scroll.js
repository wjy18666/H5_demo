function GentleRolling (opt) {
	this.def = {
		model: 'horizontal',     //	滚动方向    vertical--纵向  horizontal--横向
		container: '.gentle-rilling',	//	滚动根元素
		slideWidth: 100,
		slideHeight: 100,
		slideMargin: 0,
		slideLength: 4,			//	一屏滚显示多少个
		speed: 1
	};
	this.cfg = $.extend({}, this.def, opt);
	this.init();
}

GentleRolling.prototype = {
	
	init: function () {
		this.timer = null;
		this.scrllTop = 0;

		this.loadStyle();
		this.renderUI();
		this.animateScrolling();
		this.bindEvt();
	},

	renderUI: function (cfg) {
		for (var i = 0; i < this.cfg.slideLength; i ++) {
			var li = $(this.cfg.container).find('li').eq(i).clone();
			$(this.cfg.container).find('ul').append(li);
		}
	},

	loadStyle: function (cfg) {
		if (this.cfg.model === 'horizontal') {
			var w = (this.cfg.slideWidth + this.cfg.slideMargin) * this.cfg.slideLength - this.cfg.slideMargin;
			var  style = [
				'<style>',
					this.cfg.container + '{',
						'width:' + w + 'px;',
						'height:' + this.cfg.slideHeight + 'px;',
						'overflow: hidden;',
						'position: relative;',
					'}',
					this.cfg.container + ' ul:after{',
						'display: block;',
						'content: "";',
						'height: 0;',
						'clear: both;',
						'visibility: hidden;',
					'}',
					this.cfg.container + ' ul{',
						'clear: both;',
						'zoom: 1;',
						'width: 9999px;',
						'height:' + this.cfg.slideHeight + 'px;', 
						'position: absolute;',
						'top: 0;',
						'left: 0;',
					'}',
					this.cfg.container + ' li{',
						'width:' + this.cfg.slideWidth + 'px;',
						'height:' + this.cfg.slideHeight + 'px;',
						'margin-right:' + this.cfg.slideMargin + 'px;',
						'float: left;',
					'}'
			].join('')
		}
		else {
			var h = (this.cfg.slideHeight + this.cfg.slideMargin) * this.cfg.slideLength - this.cfg.slideMargin;
			var  style = [
				'<style>',
					this.cfg.container + '{',
						'height:' + h + 'px;',
						'width:' + this.cfg.slideWidth + 'px;',
						'overflow: hidden;',
						'position: relative;',
					'}',
					this.cfg.container + ' ul{',
						'width:' + this.cfg.slideWidth + 'px;',
						'position: absolute;',
						'top: 0;',
						'left: 0;',
					'}',
					this.cfg.container + ' li{',
						'width:' + this.cfg.slideWidth + 'px;',
						'height:' + this.cfg.slideHeight + 'px;',
						'margin-bottom:' + this.cfg.slideMargin + 'px;',
					'}'
			].join('')
		}
		$('head').append(style);
	},

	animateScrolling: function (cfg) {
		var self = this;
		var len = $(this.cfg.container).find('li').length - this.cfg.slideLength;

		this.timer = setInterval(function () {
			self.scrllTop += self.cfg.speed

			if (self.cfg.model === 'horizontal') {
				if (self.scrllTop > (self.cfg.slideWidth + self.cfg.slideMargin) * len) {
					self.scrllTop = 0
				}
				$(self.cfg.container).find('ul').css({
					left: -self.scrllTop + 'px'
				})
			}
			else {
				if (self.scrllTop > (self.cfg.slideHeight + self.cfg.slideMargin) * len) {
					self.scrllTop = 0
				}
				$(self.cfg.container).find('ul').css({
					top: -self.scrllTop + 'px'
				})
			}
		}, 30)
	},

	bindEvt: function (cfg) {
		var self = this;
		$(this.cfg.container).on('mouseover', function () {
			console.log('mouseover');
			if (self.timer) {
				clearInterval(self.timer);
			}
		})
		.on('mouseleave', function () {
			console.log('mouseleave');
			self.animateScrolling(self.cfg);
		})
	},

	destory: function () {
		//	事件解绑
		$(this.cfg.container).off('mouseover mouseleave');

		//	清楚定时器
		if (this.timer) {
			clearInterval(this.timer);
		}
	}
}