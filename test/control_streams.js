var get_stream = require('../lib/get_stream.js');
var twitter = require('ntwitter');
var config = require('../config.js');
var parse_control_uri = require('../lib/parse_control_uri.js');

var stream_params = {
  follow : '31385501,35272200',
  with : 'followings'
};

var USERS = '14306034,53188727,21997161,42620688,534792898,233160242,13769832';

var add_chunk_r = function(stream, twit, users){
  if (!users.length) return;
  twit.addUserToStream(stream.control_uri+'/add_user.json', {user_id:USERS}, null, function(data){
    console.log(data);
    setTimeout(function(){
      add_chunk_r(stream, twit, users);
    }, 100);
  });
};

get_stream(stream_params, function(stream){
  var twit = new twitter(config.twitter);
  stream.on('data', function(tweet){
    if(!stream.control_uri) {
      parse_control_uri(tweet, stream); 
      if (stream.control_uri){
        twit.verifyCredentials(function(err, data){
          !err & console.log('credentials verified');
          twit.addUserToStream('https://sitestream.twitter.com'+stream.control_uri+'/add_user.json', {user_id:USERS}, null, function(data){
            console.log('post returned', data);
            twit.get('https://sitestream.twitter.com'+stream.control_uri+'/info.json', {user_id:USERS, with:'followings'}, function(e, data){
              console.log('info', data.info.users.length);
            });
          });
        });
      }
    };
  });

});
