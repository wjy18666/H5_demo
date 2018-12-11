function PullUpRefresh (opt) {
	document.addEventListener('DOMContentLoaded', function () {
		this.init(opt)
	}.bind(this), false)
}

PullUpRefresh.prototype = {
	def: {
		class: '.pull-up-container',
		pullUpFun: function (res) {
			console.log('刷新回调')
		},
		touchMoveStr: '释放刷新',
		touchEndStr: 'loading',
		refreshSuccessStr: '刷新成功',
		isCanDo: false,					//	触摸开始时scrollTop必须 <= 0
		isDoneRefresh: true,		//	是否完成刷新
		timer: null,						//	节流
		loadingStyle: {
			width: '100%',
			height: '.8rem',
			'line-height': '.8rem',
			'text-align': 'center',
			color: '#333',
			'font-size': '.28rem',
			background: '#ccc'
		}
	},
	init: function () {
		this.cfg = this.merge(this.def, opt);
		this.cfg.container = document.querySelector(this.cfg.class);
		this.cfg.parentEl = this.cfg.container.parentNode;
		//this.cfg.scrollTop = this.cfg.parentEl.scrollTop 

		this.renderUI()

		this.bindEvt()
	},
	merge: function (def, opt) {
		if (typeof opt !== 'object') {
			opt = {}
		}
		var obj = def;

		for (var key in opt) {
			if (opt.hasOwnProperty(key)) {
				obj[key] = opt[key]
			}
		}

		return obj
	},
	renderUI: function () {
		this.cfg.loading = document.createElement('div');
		this.cfg.loading.className = 'loading-tips';
		var htmlFontSize = document.documentElement.style.fontSize.replace('px', '');

		var style = this.cfg.loadingStyle;

		for (var key in style) {
			this.cfg.loading.style[key] = style[key]
		}
		var ul = this.cfg.container.childNodes[1]
		ul.parentNode.insertBefore(this.cfg.loading, ul);
		this.cfg.offsetHeight = this.cfg.loading.style.height.replace('rem', '') * htmlFontSize;
		this.translate(-this.cfg.offsetHeight)
	},

	//	移动距离方法
	translate: function (y) {
		this.cfg.container.style.transform = 'translate3d(0, '+ y +'px, 0)';
		this.cfg.container.style.webkitTransform = 'translate3d(0, '+ y +'px, 0)';
	},

	//	移动距离动画设置
	setTransition: function (time) {
		this.cfg.container.style.transition = 'transform '+ time +'s ease';
		this.cfg.container.style.webkitTransition = 'transform '+ time +'s ease';
	},

	bindEvt: function () {
		var self = this
		
		this.cfg.container.addEventListener('touchstart', this.touchStart.bind(self), false)
		this.cfg.container.addEventListener('touchmove', this.touchMove.bind(self), false)
		this.cfg.container.addEventListener('touchend', this.touchEnd.bind(self), false)
	},

	touchStart: function (e) {
		var scrollTop = this.cfg.parentEl.scrollTop;

		if (scrollTop <= 0 && this.cfg.isDoneRefresh) {
			var touch = e.touches[0]
			this.cfg._startY = touch.pageY
			this.cfg.isCanDo = true
			this.cfg.isDoneRefresh = false
		}
	},
	touchMove: function (e) {
		var touch = e.touches[0]
		this.cfg._moveY = touch.pageY
		this.cfg.actualY = this.cfg._moveY - this.cfg._startY
		this.scrollTopTranslate(this.cfg.actualY, e)
	},
	touchEnd: function () {
		var scrollTop = this.cfg.parentEl.scrollTop
		var rootEl = this.cfg.container;

		if (this.cfg.isCanDo) {
			this.cfg.isCanDo = false
			if (this.cfg.actualY > this.cfg.offsetHeight) {
				this.setTransition(1);
				this.translate(0);
				
				this.cfg.loading.innerHTML = this.cfg.touchEndStr

				setTimeout(function () {
					this.cfg.loading.innerHTML = this.cfg.refreshSuccessStr;
					this.isRefreshDoneReset()
					//	刷新成功回调

				}.bind(this), 3000)
			}
			else {
				this.isRefreshDoneReset()
			}
		}
	},

	//	刷新成功恢复初始状态
	isRefreshDoneReset: function () {
		this.translate(-this.cfg.offsetHeight);
		this.cfg.isDoneRefresh = true
	},

	//	手势移动  刷新块跟着移动距离
	scrollTopTranslate: function (actualY, e) {
		var scrollTop = this.cfg.parentEl.scrollTop

		//	移动距离大于0
		if (scrollTop <= 0 && this.cfg.isCanDo && actualY >= 0) {
			e.preventDefault();
			this.setTransition(0);
			this.translate(this.cfg.actualY * 0.5);
			this.cfg.loading.innerHTML = this.cfg.touchMoveStr
		}

		//	移动距离小于0
		if (scrollTop <= 0 && this.cfg.isCanDo && actualY < 0) {
			this.translate(this.cfg.actualY);
			if (actualY <=  -this.cfg.offsetHeight * 0.75) {
				this.isRefreshDoneReset();
				return
			}
			
		}

	}
}