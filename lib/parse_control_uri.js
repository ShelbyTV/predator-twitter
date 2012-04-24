module.exports = function(tweet, stream){
  try {
    if (!tweet.control) return false;
    return stream.control_uri = tweet.control.control_uri;
  } catch(e){
    console.error(e);
  }
}
