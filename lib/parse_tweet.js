/*
 * This should return job JSON if possible
 * and false for non-tweets and badly formed tweets
 */

var parseTweet = function(tweet){
  if (!(
  tweet.message &&
  tweet.message.entities && 
  tweet.message.entities.urls && 
  tweet.message.entities.urls.length)) {
    //console.error('.');
    //process.send({put:false});
    return false;
  }
  return {
    message : tweet.message,
    url : tweet.message.entities.urls[0],
    user : tweet.for_user
  };
};

var getJobJson = function(tweet){
  return {
     twitter_status_update : tweet.message,
     url:tweet.url.expanded_url ? tweet.url.expanded_url : tweet.url.url,
     provider_type : 'twitter',
     provider_user_id : tweet.user
  };
};

module.exports = function(tweet){
  var _tweet = parseTweet(tweet);
  if (!_tweet) return false;
  var job = getJobJson(_tweet);
  return job;
};
