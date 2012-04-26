var twitter = require('ntwitter');
var config = require('../config.js');

var add_chunk_r = function(stream, twit, users){
  if (!users.length) return;
  var user_id = users.splice(0, 100).join(',');
  twit.addUserToStream('https://sitestream.twitter.com'+stream.control_uri+'/add_user.json', {user_id:user_id}, null, function(data){
    setTimeout(function(){
      add_chunk_r(stream, twit, users);
    }, 100);
  });
};

module.exports = function(stream, users){
  if (!users.length) return;
  var twit = new twitter(config.twitter);
  twit.verifyCredentials(function(err, data){
    add_chunk_r(stream, twit, users);
  });
};
