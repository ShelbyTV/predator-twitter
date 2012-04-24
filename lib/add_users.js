var twitter = require('ntwitter');
var config = require('../config.js');

var add_chunk_r = function(stream, twit, users){
  if (!users.length) return;
  twit.addUserToStream(stream.control_uri+'/add_user.json', {user_id:users.splice(0, 100).join(',')}, null, function(data){
    console.log(data);
    setTimeout(function(){
      add_chunk_r(stream, twit, users);
    }, 100);
  });
};

module.exports = function(stream, users){
  if (!users.length) return;
  var twit = new twitter(config.twitter);
  twit.verifyCredentials(function(err, data){
    !err & console.log('credentials verified');
    add_chunk_r(stream, twit, users);
  });
};
