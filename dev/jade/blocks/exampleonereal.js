$.plug('advanced',{
  switcher: function () {
    // changing the boolean
    this.opts.bool = !this.opts.bool

    // putting together the data attribute name
    data = 'data-' + this.opts.name + '-' + this.opts.option;
    
    // apply it to the data attribute
    this.$el.attr( data , this.opts.bool );

    logger( ''+this.opts.bool )
  }
});

$.plug('toggleStuff',{
  defaults: {
    open: true
  },
  init: function () {
    this.$el.advanced('switcher',{
      bool:this.opts.open,
      name:this.proto.name,
      option: 'open'
    })
  }
});

$('body').toggleStuff()
