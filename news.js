let request = require('request');
let FeedParser = require('feedparser');
let conf = require('./config');
let Query = require('rql/js-array').query;

let News = [];


function GetNews() {
	console.log('Refreshing News from RSS Feed');
	let news = [];
	let req = request(conf.get('newsFeedRSS'));
	feedparser = new FeedParser([]);

	req.on('error', function(error) {
	  // handle any request errors
	});
	req.on('response', function(res) {
		let stream = this;

		if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
  		stream.pipe(feedparser);
	});


	feedparser.on('error', function(error) {
	  // always handle errors
	});

	feedparser.on('readable', function() {
		// This is where the action is!
		let stream = this,
			 meta = this.meta, // **NOTE** the "meta" is always available in the context of the feedparser instance
			 item;

		while (item = stream.read()) {
			news.push(item);
		}
	});

	News = news;
}

GetNews();

setInterval(function() {
	GetNews();
}, 60 * 1000 * 60);

module.exports = function(query) {
	console.log('query: ', query);
	return Query(query, {}, News);
};

