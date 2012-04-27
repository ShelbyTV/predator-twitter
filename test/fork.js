var redis = require('redis-daos').build('twitter-stream')
, cp = require('child_process')
, chunkize = require('../lib/chunkize.js')
, KIDS = []
, RESTART_INTERVAL = 20 * 60 * 1000 //20 minutes
, MANUAL_RESTART = false
, STATS = {};

var parseReport = function(child_id, report){
  if (!STATS[child_id]) STATS[child_id] = {};
  ['jobs','users','streams'].forEach(function(stat){
    STATS[child_id][stat] = report[stat] ? report[stat] : STATS[child_id][stat];
  });
};

var showStats = function(){
  var stats = {jobs:0, users:0, streams:0};
  Object.keys(STATS).forEach(function(k){
    ['jobs','users','streams'].forEach(function(stat){
      stats[stat]+=STATS[k][stat];
    });
  });
  console.log(stats);
  setTimeout(showStats, 4000);
};

var fork = function(users, child_id){
  var kid = cp.fork(__dirname + '/../daemons/stream.js'
  , [users.join(',')] 
  , {encodeing:'utf8'
  , env:process.env});

  KIDS.push(kid);

  kid.on('exit', function(m){
    console.log(child_id, ':exited');
    //!MANUAL_RESTART && fork(users, child_id);
  });

  kid.on('message', function(m){
    m.added && console.log(m);
    parseReport(child_id, m);
  });
};

var kill_KIDS = function(){
  while(KIDS.length){
    KIDS.shift().kill();
  }
};

var init = function(){
  if (KIDS.length){
    MANUAL_RESTART = true;
    kill_KIDS(); //async?
  }
  redis.getUserSet(function(e, set){
    chunkize(set).forEach(function(chunk, child_id){
      fork(chunk, child_id);
    });
    MANUAL_RESTART = false;
  });
  setTimeout(init, RESTART_INTERVAL);
};

init();
showStats();
