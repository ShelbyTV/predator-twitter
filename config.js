var conf = {
  development : {
    twitter : {
      consumer_key: '5DNrVZpdIwhQthCJJXCfnQ',
      consumer_secret: 'Tlb35nblFFTZRidpu36Uo3z9mfcvSVv1MuZZ19SHaU',
      access_token_key: '250202787-MvZk6aGMDlNvAZPUtQBjexjcZ0HRxDAVmrraPGGP',
      access_token_secret: 'xG8jShVGQIcdF6rNJ21DtH40w08tCXIcK7AJBrFZdM'
    }
  },
  production : {
    twitter : {
      consumer_key: '5DNrVZpdIwhQthCJJXCfnQ',
      consumer_secret: 'Tlb35nblFFTZRidpu36Uo3z9mfcvSVv1MuZZ19SHaU',
      access_token_key: '250202787-MvZk6aGMDlNvAZPUtQBjexjcZ0HRxDAVmrraPGGP',
      access_token_secret: 'xG8jShVGQIcdF6rNJ21DtH40w08tCXIcK7AJBrFZdM'
    }
  }
}
module.exports = conf[process.env.NODE_ENV || 'production'];
