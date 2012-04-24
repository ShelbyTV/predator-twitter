var chunkize_users = require('../lib/chunkize_users.js');
var users = [];
var num_users = 20042;

for (var i=0; i<num_users; i++){
  users.push(i);
}

var chunks = chunkize_users(users);
console.log('chunking', num_users, 'users');
console.log('got', chunks.length, 'chunks');
console.log('last chunk is', chunks[chunks.length-1].length, 'long');
