$.plug('dimensions',{
  defaults:{
    getposition: function (el) {
      return el.$el.offset();
    },
    getwidth: function (el) {
      return el.$el.width();
    },
    getheight: function (el) {
      return el.$el.height();
    },
    direction: 'auto'
  },
  init: function () {
    this.direction()
  },
  direction:function () {
    if (this.opts.direction == 'auto'){
      direction = this.estimateDirection()
    } else {
      this.opts.direction;
    }
  },
  estimateDirection: function () {
    console.log(this.opts.getposition(this));
    console.log(this.opts.getwidth(this));
    console.log(this.opts.getheight(this));
  }
});

$('#myElement').dimensions()

