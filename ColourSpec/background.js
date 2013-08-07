// creep on users' tabs as they're updated
// use updateStyle to determine if style mod needed. 

chrome.tabs.onUpdated.addListener(updateHandler);

function updateStyle(changeInfo, tab, result){
	// start updating the style of the tab while the
	// content is still loading or has completed loading
	if((changeInfo.status == 'complete' || changeInfo.status=='loading') && result.specs){
		// loop through the specs stored
		for(var i in result.specs){
			var spec = result.specs[i];
			var p = new RegExp(spec.domain); // <--- super naive regex patter for domain matching xD

			// if tab url matches a ColourSpec domain, set the colour
			if(tab.url.match(p)){
				chrome.tabs.executeScript(null,
	               {code:"document.body.style.backgroundColor='"+spec.colour+"'"});
				break;
			}
		}
	}
}

// called whenever a tab is updated
function updateHandler(id, changeInfo, tab){
	// first get the ColourSpecs stored
	chrome.storage.local.get('specs', function(result){
		updateStyle(changeInfo, tab, result)
	});
}