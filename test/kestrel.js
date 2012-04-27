
var Kestrel = require('memcached');

var k = new Kestrel('127.0.0.1:22133');

k.set("hello", 'foo', 10000, function( err, result ){
  console.log('set', arguments);
  k.get("hello", function( err, result ){
    console.log('get', arguments);
    k.end();
  });
});
