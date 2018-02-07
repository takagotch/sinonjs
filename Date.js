module('datetime', {
  setup: function(){
    this.clock = sinon.useFakeTimers();
  },
  teardown: function(){
    this.clock.restore();
  }
});

test('test should create fake time', function(){
  var now = new Date();
  equal(0, now.getTime());
});

test('test should pass time', function(){
  this.clock.tick(10);
  var now = new Date();
  equal(10, now.getTime());
});

