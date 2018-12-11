function LazyLoad (opt) {
	this.init(opt);
}

LazyLoad.prototype = {
	def: {
		container: '.lazy-load-box'
	},
	init: function (opt) {
		this.cfg = $.extend({}, this.def, opt);
		this.cfg.timer = null;

		this.setImgSrc();
		this.bindEvt();
	},

	setImgSrc: function () {
		$('.lazyload').each(function () {
			if ($(this).isLoad) {
				return true;
			}

			var _this = $(this);
			
			var imgH = $(this).height(),
					winH = $(window).height(),
					offsetTop = $(this).offset().top,
					scrollTop = $(document).scrollTop();

			if (scrollTop - offsetTop <= imgH / 2  && scrollTop + winH - offsetTop >= imgH / 2) {
				var src = $(this).data('img');
				var img = $(this).find('img');
				if (!img.length) {
					img = document.createElement('img');
					img.src = src;
					$(this).append(img);
				}
				
				img.onload = function () {
					_this.isLoad = true;
					_this.removeClass('lazyload');
					_this.addClass('loaded');
				}
			}
		})
	},

	bindEvt: function () {
		var self = this
		$(window).on('scroll', function () {
			if (self.cfg.timer) {
				clearTimeout(self.cfg.timer)
			}

			self.cfg.timer = setTimeout(function () {
				self.setImgSrc();
			}, 300)
		})
	}
}