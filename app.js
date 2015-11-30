var Parser = require("htmlparser2").WritableStream,
    Cornet = require("cornet"),
    minreq = require("minreq"),
    $ = require("cheerio");

var ITUNES_URL = 'https://itunes.apple.com';

console.log();
console.log("*******************************************************");
console.log();
console.log("To find the ratings for an iTunes application, use the following:");
console.log("   node app.js <URL>")
console.log();
console.log("For example: ");
console.log("   node app.js 'https://itunes.apple.com/us/app/facebook/id284882215?mt=8&v0=' ");
console.log();
console.log("*******************************************************");
console.log("");

var url = process.argv[2];
if(typeof(url) === 'undefined'){
	
	console.error("No url to fetch, please check the example above.");
	process.exit();
}

console.log("The url to be fetched is: '"+url+"'");
if(url.length < ITUNES_URL.length || url.slice(0, ITUNES_URL.length) !== ITUNES_URL){
    console.error('Sorry, only itunes supported...');
    process.exit();
}

console.log("");

var cornet = new Cornet();

var count = 0;

cornet.select("#left-stack > div.extra-list.customer-ratings > div:nth-child(5)", function(elem){
    var allVersionRating = $(elem).attr('aria-label');
    var regexpUntilStars = new RegExp("(.*)stars,","g");
    var untilStars = allVersionRating.match(regexpUntilStars)[0];
    var rating = allVersionRating.charAt(0);
    if( untilStars.length > 'stars'.length + 1){
        rating += '.5';
    }
    console.log('star rating: '+ rating);
    
    stopParsingIfPossible();
});

cornet.select("#left-stack > div.extra-list.customer-ratings > div:nth-child(5) > span", function(elem){
    var allVersionCount = $(elem).text().trim();

    var regexpOnlyNumbers = new RegExp("[0-9]+","g");
    var resultCount = allVersionCount.match(regexpOnlyNumbers)[0];
    console.log('star rating count: '+resultCount);
    
    stopParsingIfPossible();
});

minreq.get(url).pipe(new Parser(cornet));

function stopParsingIfPossible(){
    count++;
    if(count === 2){
        // stop streaming
        process.exit();
    }
}





