var bspool = require('beanstalk-node');

var opts = {
  resTube : 'tw_stream_add',
  putTube : 'link_processing',
  putTubeNew : 'link_processing_gt',
  pool_size : '100'
};

bspool.init(opts, function(){
  bspool.put({action:'add_user', twitter_id:'12345'}, function(){
    console.log('put');
  }, 'tw_stream_add');

});
