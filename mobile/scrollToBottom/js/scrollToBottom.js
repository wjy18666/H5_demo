function ScrollToBottom (opt) {
  this.def = {
    class: '.scroll-to-load-more',
    distance: 20,
    delay: 300,
    callBack: function () {}
  };
  this.def = util.merge(this.def, opt);
  this.init();
}

ScrollToBottom.prototype = {
  init: function () {
    this.body = document.querySelector(this.def.class) || document.body || document.documentElement;
    this.winHeight = this.def.height || document.documentElement.clientHeight;
    this.bodyHeight = this.body.scrollHeight;
    //  console.log(this.bodyHeight)
    this.bindEvt();
  },

  bindEvt: function () {
    var self = this;
    var scrollEle = document.querySelector(this.def.class) || document;

    scrollEle.addEventListener('scroll', function () {
      var scrollTop = this.scrollTop || document.body.scrollTop || document.documentElement.scrollTop;
      //  console.log(this)
      if (self.timer) {
        clearTimeout(self.timer);
      }

      self.timer = setTimeout(function () {
        if (self.bodyHeight - self.winHeight - scrollTop < self.def.distance) {
          self.def.callBack();
        }
      }, self.def.delay)
    }, false)
  }
}