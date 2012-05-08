//dependencies
var redis = require('redis-daos').build('twitter-stream')
, get_stream = require('../lib/get_stream.js')
, get_bs_client = require('../lib/get_bs_client.js')
, parse_tweet = require('../lib/parse_tweet.js')
, parse_control_uri = require('../lib/parse_control_uri.js')
, add_users = require('../lib/add_users.js');

//globals
var USERS = process.argv[2].split(',')
, STREAMS = []
, STATS = {
  jobs : 0,
  users : USERS.length
};

var report = function(){
  STATS.streams = STREAMS.length;
  process.send(STATS);
};

var put_job = function(job, client){
  client.put(job, function(e, res){
    STATS.jobs += e ? 0 : 1;
  }, 'link_processing_gt');

  /*client.put(job, function(e, res){
    STATS.jobs += e ? 0 : 1;
  }, 'uri_test_tube', true);*/
};

var init_add_handler = function(client){
  client.emitter.on('newjob', function(job, del){
    process.send({added:job.twitter_id});
    redis.addUserToSet(job.twitter_id);
    init_stream_r([job.twitter_id], client);
    del();
  });
};

var init_stream_r = function(users, client){
  if (!users.length) return;
  get_stream({follow:users.splice(0,100), with:'followings'}, function(stream){
    
    process.send({stream:true});

    STREAMS.push(stream);

    //FIXME: this is never fired afaik
    stream.on('end', function(){
      console.log('STREAM DIED', arguments);
    });

    //on stream data
    stream.on('data', function(tweet){

      //establish control_uri
      if(!stream.control_uri) {
        parse_control_uri(tweet, stream) && add_users(stream, USERS.slice(100, 1000));
      };

      //parse tweet
      var _tweet = parse_tweet(tweet);

      //put job
      _tweet && put_job(_tweet, client);

    });

  });
};

//get beanstalk client
get_bs_client(function(e, client){
  //report to the parent proc
  setInterval(report, 3000);

  //initialize streams recursively
  init_stream_r(USERS, client);

  //initialize bs client for add_user jobs
  init_add_handler(client);
});
