var get_stream = require('../lib/get_stream.js');
var get_bs_client = require('../lib/get_bs_client.js');
var parse_tweet = require('../lib/parse_tweet.js');
var _rep = {
  rss:0,
  heapTotal:0,
  heapUsed:0
};

var memrep = function() {
	var rep = process.memoryUsage();
  console.log('RSS', (rep.rss-_rep.rss)/1048576, 'mb',  'delta:', (rep.rss-_rep.rss)/1048576, 'mb');
  _rep = rep;
	// next report in 60 seconds
	setTimeout(memrep, 3000);
}

var stream_params = {
  follow : '31385501,35272200,14306034,53188727,21997161,42620688,534792898,233160242,13769832',
  with : 'followings'
};

memrep();
get_bs_client(function(e, client){
  get_stream(stream_params, function(stream){
    stream.on('data', function(tweet){
      var _tweet = parse_tweet(tweet);
      if (_tweet){
        client.put(_tweet, function(){
          console.log('put job', arguments);
        }, 'link_processing_high');
      }
    });
  });
});
