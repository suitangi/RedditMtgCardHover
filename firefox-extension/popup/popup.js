//updates the preferences; called when rangeSliders are accessed
function updateCardHover() {
  let sizeVal = document.getElementById("sizeSlider").value;

  browser.tabs.query({
    url: ['*://www.reddit.com/*']
  }, function(tabs) {
    for (i = 0; i < tabs.length; i++) browser.tabs.sendMessage(tabs[i].id, {
      "popupStyle": sizeVal
    });
  });
  browser.storage.local.set({
    size: sizeVal
  }, function() {});
}

//toggle function for the hover switch
function updateHover() {
  if (document.getElementById("onoffSwitch").checked) {
    document.getElementById("onoffSwitch").checked = false;
    browser.storage.local.set({
      hover: "off"
    }, function() {});
  } else {
    document.getElementById("onoffSwitch").checked = true;
    browser.storage.local.set({
      hover: "on"
    }, function() {});
  }
  browser.tabs.query({
    url: ['*://www.reddit.com/*', "*://old.reddit.com/*"]
  }, function(tabs) {
    for (i = 0; i < tabs.length; i++) browser.tabs.sendMessage(tabs[i].id, {
      "hover": document.getElementById("onoffSwitch").checked
    });
  });
}


//get the data for on off
browser.storage.local.get({
  hover: 'on'
}, function(data) {

  if (data.hover == 'off') {
    document.getElementById("onoffSwitch").checked = false;
  } else {
    document.getElementById("onoffSwitch").checked = true;
  }
});

// listener for onoffswitch
document.getElementById("onoffSwitch").parentElement.addEventListener('click', function() {
  updateHover();
});

//Listener for the rangeSliders
document.getElementById("sizeSlider").addEventListener("input", function() {
  updateCardHover();
});
document.getElementById("optionsLink").addEventListener("click", function() {
  browser.runtime.openOptionsPage();
});

//display different content based on active tab (if it's on reddit or not)
document.getElementById("warning").style = "display:none;";
document.getElementById("options").style = "display:none;";

browser.tabs.query({
  'active': true,
  'lastFocusedWindow': true
}, function(tabs) {
  var url = tabs[0].url;

  //if we are on reddit.com
  if (url != undefined && url.includes("reddit.com")) {
    document.getElementById("options").style = "";

    //load preference data and set the rangesliders accordingly
    browser.storage.local.get({
      size: 300
    }, function(data) {
      document.getElementById("sizeSlider").value = data.size;
    });

  } else {
    document.getElementById("warning").style = "";
  }
});
