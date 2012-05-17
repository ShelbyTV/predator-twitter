var redis = require('redis-daos').build('twitter-stream')
, cp = require('child_process')
, chunkize = require('../lib/chunkize.js')
, fs = require('fs')
, KIDS = []
, RESTART_INTERVAL = 20 * 60 * 1000 //20 minutes
, MANUAL_RESTART = false
, STATS = {};

var init = function(){
  redis.getUserSet(function(e, set){
    if (set) {
      fs.writeFileSync('/data/users.json', JSON.stringify(set), 'utf8');
      console.log('done');
    }
  });
};

init();
