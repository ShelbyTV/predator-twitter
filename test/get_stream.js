var get_stream = require('../lib/get_stream.js');

var stream_params = {
  follow : '31385501,35272200,14306034,53188727,21997161,42620688,534792898,233160242,13769832',
  with : 'followings'
};

get_stream(stream_params, function(stream){
  stream.on('data', function(){
    console.log(arguments);
  });
});
