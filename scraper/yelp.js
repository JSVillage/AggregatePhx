var cities = [
	'Phoenix'
	// 'Glendale',
	// 'Suprise',
	// 'Mesa',
	// 'Tempe',
	// 'Scottsdale'
],
cheerio = require("cheerio"),
request = require("request");

function urlParse(City,Start){
	return "https://www.yelp.com/search?find_desc=Restaurants&find_loc="+ City +",+AZ&start=" + Start
};

for(var i in cities){
	for (var incrementPage = 0; incrementPage < 10; incrementPage = incrementPage + 10) {
		//console.log(urlParse(cities[i], incrementPage))
		var url = urlParse(cities[i], incrementPage);
		request(url, function(error, response, body){
			if(!error){
				var $ = cheerio.load(body),
					results = $(".regular-search-result");
				$(results).each(function(i, result){
					var title = $(result).find('.biz-name > span').html(),
						tags = getTags($, $(result).find('.category-str-list')),
						address = getAddress($, $(result).find('address'));


					var data = {
						'title':title,
						'tags':tags,
						'address' : address.Address,
						'city' : address.City,
						'state' : address.State,
						'zip' : address.Zip,
						'expires' : null,
						'time' : null,
						
					};

					console.log(data);
				})

				console.log(url);
			}
		});
	}
};

function getTags($, tags){
	var tagList = [];
	$(tags).find('a').each(function(i, tag){
		tagList.push($(tag).html())
	});

	tagList.push('Restaurant');

	return tagList;
}

function getAddress($, address){
	var data = $(address).html(),
		arr = data.split('<br>'),
		ret = {'Address' : '', 'City':'', 'State':'AZ', 'Zip':''},
		test = arr[1].split(', AZ ');

		ret.Address = arr[0].replace('\\n', '').trim();
		ret.City = test[0];
		ret.Zip = test[1];

		return ret;
}
