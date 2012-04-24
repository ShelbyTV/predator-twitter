var	util = require('util')
, twitter = require('ntwitter')
, config = require('../config.js');

var stream_params = {
  follow : '31385501,35272200,14306034,53188727,21997161,42620688,534792898,233160242,13769832',
  with : 'followings'
};

var twit = new twitter(config.twitter);

module.exports = function(params, cb){
  twit.stream('site', params, function(stream) {
    return cb(stream);
    //stream.on('data', tweet);
  });
};
