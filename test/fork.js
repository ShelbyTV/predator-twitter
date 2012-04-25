var redis = require('redis-daos').build('twitter-stream')
, cp = require('child_process')
, chunkize = require('../lib/chunkize.js')
, KIDS = []
, RESTART_INTERVAL = 20 * 60 * 1000; //20 minutes

var fork = function(users, child_id){
  var kid = cp.fork(__dirname + '/../daemons/stream.js'
  , [users.join(',')] 
  , {encodeing:'utf8'
  , env:process.env});

  KIDS.push(kid);

  kid.on('exit', function(m){
    console.log(child_id, ':exited');
    fork(users, child_id);
  });

  kid.on('message', function(m){
    console.log(child_id, m);
  });
};

var kill_KIDS = function(){
  while(KIDS.length){
    KIDS.shift().kill();
  }
};

var init = function(){
  if (KIDS.length){
    kill_KIDS();
  }
  redis.getUserSet(function(e, set){
    chunkize(set).forEach(function(chunk, child_id){
      fork(chunk, child_id);
    });
  });
  setTimeout(init, RESTART_INTERVAL);
};

init();
