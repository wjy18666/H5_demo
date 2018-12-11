function Prize (opt) {
	this.init(opt);
}

Prize.prototype = {
	def: {
		prizeList: [0, 1, 2, 3, 4, 5, 6],		//	奖品数量，中奖码
		class: '.prize-box',								//	转盘class
		startBtn: '.start',									//	抽奖开始按钮
		circle: 15,													//	抽奖转动圈数
		isRotate: false,										//	抽奖限流开关
		lastRotate: 0,												//	上次抽奖转动角度
		prizeTimes: 0 											//	抽奖次数
	},
	init: function (opt) {
		this.cfg = this.merge(this.def, opt);

		var len = this.cfg.prizeList.length;
		this.cfg.rotateUnit = 360 / len;
		this.cfg.rotate = -(this.cfg.rotateUnit / 2);

		this.initStyle(this.cfg.rotate)
		this.bindEvt()
	},
	merge: function (def, opt) {
		if (typeof opt !== 'object') {
			return {}
		}

		for (var key in opt) {
			if (opt.hasOwnProperty(key)) {
				def[key] = opt[key]
			}
		}

		return def
	},

	//	初始化转盘角度
	initStyle: function (rotate) {
		var ele = document.querySelector(this.cfg.class);
		ele.style['transition'] = '';
		ele.style['transform'] = 'rotate('+ rotate +'deg)';
		ele.style['-webkit-transition'] = '';
		ele.style['-webkit-transform'] = 'rotate('+ rotate +'deg)'; 
	},

	bindEvt: function () {
		var ele = document.querySelector(this.cfg.class);
		var startBtn = document.querySelector(this.cfg.startBtn);
		var len = this.cfg.prizeList.length;
		var me = this;
		var prize = '';
		
		//	抽奖
		startBtn.addEventListener('click', function () {
			//	me.initStyle();
			if (me.cfg.isRotate) {
				return
			}

			me.cfg.prizeTimes++;
			me.cfg.isRotate = true;

			if (me.cfg.prizeTimes !== 1) {
				console.log(44)
				me.initStyle(me.cfg.lastRotate);
			}
			
			var prizeNum = Math.floor(Math.random() * len);
			prize = prizeNum;
			console.log(prizeNum)

			me.rotateAnimation(prizeNum, 5)

		}, false)

		//	抽奖结束
		ele.addEventListener('WebkitTransitionEnd', transitionEnd, false)
		ele.addEventListener('transitionend', transitionEnd, false)

		function transitionEnd () {
			console.log('end')
			alert('您抽到的奖品为：' + prize);
			me.cfg.isRotate = false
		}
	},

	//	抽奖动画
	rotateAnimation: function (prizeNum, delay) {
		var ele = document.querySelector(this.cfg.class);
		var len = this.cfg.prizeList.length;
		var rotateUnit = this.cfg.rotateUnit;
		var nowRotate = prizeNum * rotateUnit + this.cfg.rotate;
		var rotate = nowRotate + this.cfg.circle * 360;

		this.cfg.lastRotate = nowRotate;

		setTimeout(function () {
			ele.style['transition'] = 'transform ' + delay + 's ease-in-out';
			ele.style['transform'] = 'rotate(' + rotate + 'deg)';
			ele.style['-webkit-transition'] = 'transform ' + delay + 's ease-in-out';
			ele.style['-webkit-transform'] = 'rotate(' + rotate + 'deg)';
		}, 0)
	}
}