$(document).ready(setup);

function setup(){

	$('form').on('submit', function(e){
		e.preventDefault();
		var domain = $('[name=domain]').val();
		var colour = $('[name=colour]').val();

		addRule(domain, colour);

		// clear form input values
		$('form input[type=text]').each(function(){
			$(this).val('');
		})
	});

	// do initial load of pre-stored colourSpecs
	loadSettings();
}

function addRule(domain, colour){
	var spec = {domain: domain, colour: colour};

	// get current settings, if any
	chrome.storage.local.get('specs', function(result){
		// if settings dont exist, create array
		// otherwise add to existing array
		console.log(result);
		if(typeof result.specs == 'undefined')
			result.specs = [spec];
		else
			result.specs.push(spec);

		// store new values
		chrome.storage.local.set({specs: result.specs}, loadSettings);
	})
}

function renderSettings(result){

	// check if the 'specs' key is not defined and is not an empty
	// meaning no specs are stored
	if(Object.keys(result).length != 0 && result.specs.length != 0){
		// get template to be displayed with underscore
		// to show pre-stored ColourSpecs
		var templ = $('.spec-templ').html();
		templ = _.template(templ, result);
		$('.settings ul').html(templ);
		addDeleteEvents();
	} else {
		$('.settings ul').html('Add your first ColourSpec!');
	}
}

function addDeleteEvents(){
	// set event for clickin on 'delete spec' link
	$('.settings .delete').on('click', deleteSetting);
}

function loadSettings(){
	// querying for 'specs' key in localStorage
	chrome.storage.local.get('specs', renderSettings);
}

function deleteSetting(e){
	e.preventDefault();

	// grabbing the index of the spec being deleted
	// to use as the index to delete from the localStorage
	// array.
	var i = $(this).data('i');

	chrome.storage.local.get('specs', function(result){
		delete result.specs[i];
		// set 'specs' key with the new specs array that
		// has had its spec removed
		chrome.storage.local.set({specs:result.specs}, loadSettings);
	})
}
