//updates the preferences; called when rangeSliders are accessed
//the options.js version also updates the preview card
function updateCardHover() {
  let topVal = document.getElementById("topSlider").value;
  let leftVal = document.getElementById("leftSlider").value;
  let sizeVal = document.getElementById("sizeSlider").value;
  let hoverList = document.getElementsByClassName("cardHover");
  for (i = 0; i < hoverList.length; i++) {
    hoverList[i].style =
      "top: " + topVal + "%;" +
      "left: " + leftVal + "%;" +
      "transform: translate(-" + leftVal + "%, -" + topVal + "%);"
    hoverList[i].firstElementChild.style =
      "width: " + sizeVal + "px;";
  }

  chrome.tabs.query({
    url: ['*://www.reddit.com/*']
  }, function(tabs) {
    for (i = 0; i < tabs.length; i++) chrome.tabs.sendMessage(tabs[i].id, {
      "style": [topVal, leftVal, sizeVal]
    });
  });
  let arr = [topVal, leftVal, sizeVal]
  chrome.storage.local.set({
    hoverPref: arr
  }, function() {});
}


//toggle function for the hover switch
function updateHover() {
  if (document.getElementById("onoffSwitch").checked) {
    document.getElementById("onoffSwitch").checked = false;
    chrome.storage.local.set({
      hover: "off"
    }, function() {});
  } else {
    document.getElementById("onoffSwitch").checked = true;
    chrome.storage.local.set({
      hover: "on"
    }, function() {});
  }
  chrome.tabs.query({
    url: ['*://www.reddit.com/*']
  }, function(tabs) {
    for (i = 0; i < tabs.length; i++) chrome.tabs.sendMessage(tabs[i].id, {
      "hover": document.getElementById("onoffSwitch").checked
    });
  });
}

//load preference data and set the rangesliders accordingly
chrome.storage.local.get({
  hoverPref: [100, 100, 300]
}, function(data) {
  document.getElementById("topSlider").value = data.hoverPref[0];
  document.getElementById("leftSlider").value = data.hoverPref[1];
  document.getElementById("sizeSlider").value = data.hoverPref[2];
  updateCardHover();
});

//get the data for on off
chrome.storage.local.get({
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
document.getElementById("leftSlider").addEventListener("input", function() {
  updateCardHover();
});
document.getElementById("topSlider").addEventListener("input", function() {
  updateCardHover();
});
document.getElementById("sizeSlider").addEventListener("input", function() {
  updateCardHover();
});
