function once(fn){
  var returnValue, called = false;
  return function(){
    if(!called){
      called = true;
      returnValue = fn.apply(this, arguments);
    }
    return returnValue;
  };
}

//
it('calls the original function', function(){
  var callback = sinon.spy();
  var proxy = once(callback);

  proxy();

  assert(callback.called);
});

//
it('calls the original function only once'function(){
  var callback = sinon.spy();
  var proxy = once(callback);

  proxy();
  proxy();

  assert(callback.calledOnce);
//assert.equals(callback.callCount, 1);
});

//
it('call original fucntion with right this and args', function(){
  var callback = sinon.spy();
  var proxy = once(callback);
  var obj = {};

  proxy.call(obj, 1, 2, 3);

  assert(callback.calledOn(obj));
  assert(callback.calledWith(1, 2, 3));
});

//
it("returns the return value from the original function", function(){
  var callback = sinon.stub().returns(42);
  var proxy = once(callback);

  assert.equals(proxy(), 42);
});

//
function getTodos(listId, callback){
  jQuery.ajax({
    url: '/todo/' + listId + '/items',
    success: function(data){
      callback(null, data);
    }
  });
}

//
after(function(){
  jQuery.ajax.restore();
});

it('makes a GET request for todo items', function(){
  sinon.stub(jQuery, 'ajax');
  getTodos(42, sinon.spy());

  assert(jQuery.ajax.calledWithMath({ url: '/todo/42/items' }));
});

//XMLHttpRequest
var xhr, requests;

before(function(){
  xhr = sinon.useFakeXMLHttpRequest();
  requests = [];
  xhr.onCreate = function(req){ requests.push(req); };
});

after(function(){
  xhr.restore();
});

it("makes a GET request for todo items", function(){
  getTodos(42, sinon.spy());

  assert.equals(requests.length, 1);
  assert.match(request[0].url, "/toso/42/items");
});

//server
var server;

before(function(){ server = sinon.fakeServer.create(); });
after(function(){ server.restore(); });

it("calls callback with deserialized data", function(){
  var callback = sinon.spy();
  getTodos(42, callback);

  server.requests[0].respond(
    200,
    { "Content-Type": "application/json" },
    JSON.stringify({ id: 1, text: "Provide examples", done: true })
  );

  assert(callback.calledOnce);
});




//time
function debounce(callback){
  var timer;
  return function(){
    clearTimeout(timer);
    var args = [].slice.call(arguments);
    timer = setTimeout(function(){
      callback.apply(this, args);
    }, 100);
  };
}

var clock;

before(function(){ clock = sinon.userFakeTimers(); });
after(function(){ clock.restore(); });

it('calls callback after 100ms', function(){
  var callback = sinon.spy();
  var throttled = throttle(callback);

  throttled();

  clock.tick(99);
  assert(callback.notCalled);

  clock.tick(1);
  assert(callback.calledOnce);
//assert.equals(new Date().getTime(), 100);
});



