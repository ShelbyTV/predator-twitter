var bspool = require('beanstalk-node');

var opts = {
  resTube : 'tw_stream_add',
  putTube : 'link_processing',
  putTubeNew : 'link_processing_gt',
  pool_size : '100'
};

module.exports = function(cb){
  bspool.init(opts, function(){
    return cb(null, bspool);
  });
};
