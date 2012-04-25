/*
 * Chunkize ids into config.twitter_stream_limit sized arrays
 * @param ids : array : Array of ids to chunkize
 */

var STREAM_SIZE_LIMIT = 1000;

module.exports = function(ids){
  if (ids.length===0) return false;
  var id_arrays = [];
  while (ids.length>STREAM_SIZE_LIMIT){
    id_arrays.push(ids.splice(0,STREAM_SIZE_LIMIT));
  }
  id_arrays.push(ids); //the remainder 
  return id_arrays;
};
