var redis = require('redis-daos').build('twitter-stream')
, cp = require('child_process')
, chunkize = require('../lib/chunkize.js')
, KIDS = []
, RESTART_INTERVAL = 20 * 60 * 1000 //20 minutes
, MANUAL_RESTART = false
, STATS = {};

var parseReport = function(child_id, report){
  if (!STATS[child_id]) STATS[child_id] = {};
  STATS[child_id].jobs = report.jobs ? report.jobs : STATS[child_id].jobs;
  STATS[child_id].users = report.users ? report.users : STATS[child_id].users;
  STATS[child_id].streams = report.streams ? report.streams : STATS[child_id].streams;
};

var showStats = function(){
  var stats = {jobs:0, users:0, streams:0};
  Object.keys(STATS).forEach(function(k){
    stats.jobs+=STATS[k].jobs;
    stats.users+=STATS[k].users;
    stats.streams+=STATS[k].streams;
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
