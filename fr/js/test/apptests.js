module('View Tests: Profile');

asyncTest("asynchronous view tests", function(){
  this.clock.restore();
  expect(2);

  var profileView = new com.apress.view.ProfileView({user: 'sugrue'});
  this.spy(profileView, 'render');
  profileView.render();

  ok(profileView.render.calledOnce,
    'Profile view render function executed once');

  setTimeout(function(){
    equal(profileView.$('h3').text(), "...",
          "Profile view rendered with correct name");
    start();
  }, 1000);
});


//
module('Sinon Stubs', {
  setup:function(){
    this.tweetModel = new com.apress.model.Tweet({user: {name: 'tk'},
      text: 'text'});
    sinon.stub(this.tweetModel, 'save', function(cb){
      console.log('stubbed!');
    });
  }
});

test('Use a stubbed save function', function(){
  expect(0);
  this.tweetModel.save();
});

//
module('Sinon Stubs', {
});

text('Use a mock collection', function(){
  expect( 1 );

  var collection = new com.apress.collection.Timeline();
  var mock = sinon.mock(collection);
  mock.expects('organizeCollection').atLeast(1);

  collection.organizeCollection();

  mock.verify();
});

//
module('Fake server');

test('Use fake server', function(){
  expect(2);
  var server = this.sanbox.useFakeServer();
  var timeline = new com.apress.collection.Timeline();
  var timelineResponse = '[{"created.at": "...",
                            "text": "..."},
                           {"created.at": "...",
			    "text": "..."}]';
  server.respondWith("GET", "/test",
    [200, {"Content-Type": "application/json"}, timelineResponse]);

  timeline.url = '/test';

  timeline.fetch({reset: true});
  server.respond();

  console.log('Timeline has ' + timeline.length);

  ok(timeline.length === 2, 'Correct size of collection');
  ok(timeline.at(0).get('text') === 'a simulated tweet',
    'Correct text in tweet');
});


