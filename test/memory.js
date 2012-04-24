console.error(__dirname, __filename)
var	util = require('util'),
	twitter = require('ntwitter');

var	count = 0,
	lastc = 0;

function tweet(data) {
	count++;
	if ( typeof data === 'string' )
		util.puts(data);
	else if ( data.text && data.user && data.user.screen_name )
		util.puts('"' + data.text + '" -- ' + data.user.screen_name);
	else if ( data.message )
		util.puts('MESSAGE: ' + util.inspect(data));
	else
		util.puts(util.inspect(data));
}

function memrep() {
	var rep = process.memoryUsage();
	rep.tweets = count - lastc;
	lastc = count;
	console.log(JSON.stringify(rep));
	// next report in 60 seconds
	setTimeout(memrep, 60000);
}

var stream_params = {
  follow : '31385501,35272200,14306034,53188727,21997161,42620688,534792898,233160242,13769832',
  with : 'followings'
};

var twit = new twitter({
	consumer_key: '5DNrVZpdIwhQthCJJXCfnQ',
	consumer_secret: 'Tlb35nblFFTZRidpu36Uo3z9mfcvSVv1MuZZ19SHaU',
	access_token_key: '250202787-MvZk6aGMDlNvAZPUtQBjexjcZ0HRxDAVmrraPGGP',
	access_token_secret: 'xG8jShVGQIcdF6rNJ21DtH40w08tCXIcK7AJBrFZdM'
})
.stream('site', stream_params, function(stream) {
	stream.on('data', tweet);
	// first report in 15 seconds
	setTimeout(memrep, 15000);
})
