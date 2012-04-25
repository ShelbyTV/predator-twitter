module.exports = function(tweet, stream){
  if (!tweet.control) return false;
  return stream.control_uri = tweet.control.control_uri;
}
