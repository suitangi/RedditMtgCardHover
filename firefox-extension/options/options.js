//updates the preferences; called when rangeSliders are accessed
//the options.js version also updates the preview card
function updateCardHover() {
  let sizeVal = document.getElementById("sizeSlider").value;

  browser.tabs.query({
    url: ['*://www.reddit.com/*']
  }, function(tabs) {
    for (i = 0; i < tabs.length; i++) browser.tabs.sendMessage(tabs[i].id, {
      "style": sizeVal
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
    url: ['*://www.reddit.com/*']
  }, function(tabs) {
    for (i = 0; i < tabs.length; i++) browser.tabs.sendMessage(tabs[i].id, {
      "hover": document.getElementById("onoffSwitch").checked
    });
  });
}

//load preference data and set the rangesliders accordingly
browser.storage.local.get({
  hoverPref: [100, 100, 300]
}, function(data) {
  document.getElementById("sizeSlider").value = data.size;
  updateCardHover();
});

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
