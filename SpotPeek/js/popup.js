(function($){

	function start(){
		$('form').on('submit', queryAddress);
	}

	function queryAddress(e){
		// disallow default form submission
		e.preventDefault();

		var query = $('input', this).val();

		// Mapquest API-specific data format
		// request params are key-value pair
		// response params to be json data
		var data = {
			inFormat: 'kvp',
			outFormat: 'json',
			location: query
		}

		$.ajax({
			url:'http://open.mapquestapi.com/geocoding/v1/address',
			data: data,
			success: handleResult,
			error: handleResult
		});
	}

	function handleResult(resp){
		if('results' in resp && (resp.results[0].locations.length > 0)){
			// render the map setting the marker to the
			// first pair of coordinates returned
			renderMap(resp.results[0].locations[0].latLng)
		} else {
			// womp, no results
			$('#map').html('No results returned.').slideDown();
		}
	}

	function renderMap(coords) {
		// For details on this map API, 
		// check out http://www.mapbox.com/
		
		// show the map container
	    $('#map').slideDown(function(){
	    	// render the map in the element with id 'map'
	    	// center the view around the coordinate result
	    	// supplied from mapquest in handleResult
		    map = L.mapbox.map('map', 'examples.map-vyofok3q')
		        .setView([coords.lat, coords.lng], 14);


		    // set the marker to be displayed at said coord values
		    var marker = L.marker([coords.lat, coords.lng]);
		    map.addLayer(marker);
	    });
	}

	$(document).ready(start);
	
})(jQuery)