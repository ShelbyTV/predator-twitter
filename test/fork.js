var redis = require('redis-daos').build('twitter-stream');
var cp = require('child_process');
var chunkize = require('../lib/chunkize_users.js');
var kids = [];

var fork = function(users, child_id){
  var kid = cp.fork(__dirname + '/../daemons/stream.js'
  , [users.join(',')] 
  , {encodeing:'utf8'
  , env:process.env});

  kids.push(kid);

  kid.on('exit', function(m){
    console.log(child_id, ':exited');
    fork(users, child_id);
  });

  kid.on('message', function(m){
    console.log(child_id, m);
  });
};

var kill_kids = function(){
  while(kids.length){
    kids.shift().kill();
  }
};

var init = function(){
  if (kids.length){
    kill_kids();
  }
  redis.getUserSet(function(e, set){
    chunkize(set).forEach(function(chunk, child_id){
      fork(chunk, child_id);
    });
  });
  setTimeout(init, 10000);
};

init();
