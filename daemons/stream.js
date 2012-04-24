try {
var redis = require('redis-daos').build('twitter-stream');
var get_stream = require('../lib/get_stream.js');
var get_bs_client = require('../lib/get_bs_client.js');
var parse_tweet = require('../lib/parse_tweet.js');
var parse_control_uri = require('../lib/parse_control_uri.js');
var add_users = require('../lib/add_users.js');

var USERS = process.argv[2].split(',');
var STREAMS = [];
var STATS = {
  jobs : 0,
  users : USERS.length
};

var report = function(){
  STATS.streams = STREAMS.length;
  process.send(STATS);
};

var put_job = function(job, client){
  try{
    client.put(job, function(e, res){
      STATS.jobs += e ? 0 : 1;
    }, 'link_processing_high');
  } catch (e){
    console.error('put err', e);
  }
};

var init_stream_r = function(users, client){
  if (!users.length) return;
  console.log('init stream r');
  get_stream({follow:users.splice(0,100), with:'followings'}, function(stream){
    STREAMS.push(stream);
    stream.on('disconnect', function(){
      console.log('disconnect', arguments);
    });
    //on stream data
    stream.on('data', function(tweet){

      //establish control_uri
      /*if(!stream.control_uri) {
        parse_control_uri(tweet, stream) && add_users(stream, USERS.slice(100, 1000));
      };*/

      //parse tweet
      var _tweet = parse_tweet(tweet);

      //put job
      _tweet && put_job(_tweet, client);

    });

  });

  setTimeout(function(){
    init_stream_r(users, client);
  }, 100);
};

var init_add_handler = function(client){
  client.emitter.on('newjob', function(job, del){
    process.send({added:job.twitter_id});
    redis.addUserToSet(job.twitter_id);
    init_stream_r([job.twitter_id], client);
    del();
  });
};


//get beanstalk client
console.log('initting with', USERS.length);
get_bs_client(function(e, client){
  setInterval(report, 3000);
  init_stream_r(USERS, client);
  init_add_handler(client);
});

} catch (e) {
  console.error(e);
}
