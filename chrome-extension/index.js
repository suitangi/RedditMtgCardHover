//loads css file
function loadCSS(file) {
  var link = document.createElement("link");
  link.href = chrome.extension.getURL(file + '.css');
  link.id = file;
  link.type = "text/css";
  link.rel = "stylesheet";
  document.getElementsByTagName("head")[0].appendChild(link);
}

//unloads css file
function unloadCSS(file) {
  var cssNode = document.getElementById(file);
  cssNode && cssNode.parentNode.removeChild(cssNode);
}

//for the pop up example card
function updateExample(topVal, leftVal, sizeVal) {
  let hoverList = document.getElementById("exampleHover");
  exampleHover.style =
    "display: initial;" +
    "top: " + topVal + "%;" +
    "left: " + leftVal + "%;" +
    "transform: translate(-" + leftVal + "%, -" + topVal + "%);"
  exampleHover.firstElementChild.style =
    "width: " + sizeVal + "px;";
}

//function to add card hovers
function addCardHover() {
  let alist = document.getElementsByTagName('a');
  for (var i = 0; i < alist.length; i++) {
    if (!alist[i].classList.contains("cardHoverChecked")) {
      if (alist[i].getAttribute("href") != null &&
        (alist[i].getAttribute("href").includes("img.scryfall.com/cards") ||
          alist[i].getAttribute("href").includes("gatherer.wizards.com/Handlers/Image"))) {
        let linkNode = alist[i];
        let cardName = linkNode.innerHTML;
        let chNode = document.createElement("div");
        chNode.classList.add("cardHover");
        chNode.style =
          "display: none; " +
          "top: " + window.pref[0] + "%;" +
          "left: " + window.pref[1] + "%;" +
          "transform: translate(-" + window.pref[1] + "%, -" + window.pref[0] + "%);" +
          "width: " + window.pref[2] + "px;";
        let imgNode = document.createElement("img");
        imgNode.setAttribute("src", linkNode.getAttribute("href"));
        imgNode.style =
          "width: " + window.pref[2] + "px;";
        chNode.appendChild(imgNode);
        linkNode.appendChild(chNode);

        console.log(cardName + ": Hover Added");
      }
      alist[i].classList.add("cardHoverChecked");
    }
  }
}

//function to set the hover on/off
function toggleHover(hoverOn) {
  hoverList = document.getElementsByClassName('cardHover');
  if (hoverOn) {
    for (i = 0; i < hoverList.length; i++) {
      hoverList[i].classList.remove("hoverDisabled");
    }
  } else {
    for(i = 0; i < hoverList.length; i++) {
      hoverList[i].classList.add("hoverDisabled");
    }
  }
}

//function at specified links
function atLinks() {
  linklist = ["239MTG", "affinityforartifacts", "alliesmtg", "AllStandards", "Alphabetter", "Amonkhet", "architectMTG", "ArclightPhoenixMTG", "aristocratsMTG", "BadMTGCombos", "basementboardgames", "BaSE_MtG", "BudgetBrews", "budgetdecks", "BulkMagic", "cardsphere", "casualmtg", "CatsPlayingMTG", "CircuitContest", "cocomtg", "CompetitiveEDH", "custommagic", "DeckbuildingPrompts", "edh", "EDHug", "EggsMTG", "ElvesMTG", "enchantress", "EsperMagic", "findmycard", "fishmtg", "FlickerMTG", "freemagic", "goblinsMTG", "HamiltonMTG", "HardenedScales", "humansmtg", "infect", "johnnys", "kikichord", "lanternmtg", "lavaspike", "locketstorm", "lrcast", "magicarena", "Magicdeckbuilding", "MagicDuels", "magicTCG", "magicTCG101", "MakingMagic", "marchesatheblackrose", "marduMTG", "MentalMentalMagic", "millMTG", "ModernLoam", "modernmagic", "ModernRecMTG", "modernspikes", "ModernZombies", "monobluemagic", "mtg", "MTGAngels", "mtgbattlebox", "mtgbracket", "mtgbrawl", "mtgbudgetmodern", "mtgcardfetcher", "mtgcube", "MTGDredge", "mtgfinalfrontier", "mtgfinance", "mtgfrontier", "mtglegacy", "MTGManalessDredge", "MTGMaverick", "mtgmel", "mtgrules", "mtgspirits", "mtgtreefolk", "mtgvorthos", "neobrand", "nicfitmtg", "oathbreaker_mtg", "oldschoolmtg", "pauper", "PauperArena", "PauperEDH", "peasantcube", "PennyDreadfulMTG", "PioneerMTG", "planeshiftmtg", "ponzamtg", "RatsMTG", "RealLifeMTG", "RecklessBrewery", "rpg_brasil", "scapeshift", "shittyjudgequestions", "sistersmtg", "skredred", "Sligh", "spikes", "stoneblade", "StrangeBrewEDH", "SuperUltraBudgetEDH", "therandomclub", "Thoptersword", "threecardblind", "TinyLeaders", "TronMTG", "UBFaeries", "uwcontrol", "xmage", "reddit.com/message", "reddit.com/user/MTGCardFetcher"]

  for (j = 0; j < linklist.length; j++) {
    if (location.href.toLowerCase().includes(linklist[j].toLowerCase()))
      return true;
  }
  return false;
}

///////////////////////////////////Start the scripts///////////////////////////////////
//load the storage variables

//to load at the start of the DOM after it has been dynamically built
var start = setInterval(function() {
  console.log("Reddit MTGCardFetcher Hovers Loading...");
  //only continue if document body has been built
  if (document.getElementsByTagName("body").length > 0) {

    // listen for changes from popup and options
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        //style update message from options
        if (request.style !== undefined) {
          let hoverList = document.getElementsByClassName("cardHover");
          for (i = 0; i < hoverList.length; i++) {
            hoverList[i].style =
              "top: " + request.style[0] + "%;" +
              "left: " + request.style[1] + "%;" +
              "transform: translate(-" + request.style[1] + "%, -" + request.style[0] + "%);" +
              "width: " + request.style[2] + "px;";
            hoverList[i].firstElementChild.style =
              "width: " + request.style[2] + "px;";
          }
        }
        //style update message from popup
        if (request.popupStyle !== undefined) {
          let hoverList = document.getElementsByClassName("cardHover");
          for (i = 0; i < hoverList.length; i++) {
            hoverList[i].style =
              "top: " + request.popupStyle[0] + "%;" +
              "left: " + request.popupStyle[1] + "%;" +
              "transform: translate(-" + request.popupStyle[1] + "%, -" + request.popupStyle[0] + "%);" +
              "width: " + request.popupStyle[2] + "px;";
            hoverList[i].firstElementChild.style =
              "width: " + request.popupStyle[2] + "px;";
          }
          updateExample(request.popupStyle[0], request.popupStyle[1], request.popupStyle[2]);
          if (window.clearExample != null) {
            clearTimeout(window.clearExample);
          }
          window.clearExample = setTimeout(function() {
            document.getElementById("exampleHover").style = "display: none;";
          }, 1500);
        }
        if (request.hover !== undefined) {
          console.log(request.hover);
          toggleHover(request.hover);
        }
      }
    );

    //inject css
    loadCSS('cardHover');

    //load chrome storage data for preferences/does adding hovers in callback
    //hoverPref [top (%), left (%), size (100 - 500 px)]
    chrome.storage.local.get({
      hoverPref: [100, 100, 300],
      hover: 'on'
    }, function(data) {
      window.pref = data.hoverPref;

      // initializing anchor tag list length
      window.alength = 0;

      // implement mutation observer for the DOM as many content on reddit are loaded dynamically
      const targetNode = document.getElementsByTagName("body")[0];
      const config = {
        attributes: true,
        childList: true,
        subtree: true
      };
      const observerCallback = function(mutationsList, observer) {
        if (atLinks() && window.alength != document.getElementsByTagName('a').length) {
          addCardHover();
          window.alength = document.getElementsByTagName('a').length;
        }
      };
      const observer = new MutationObserver(observerCallback);
      observer.observe(targetNode, config);

      // checks if we're on specified subreddits/parts of reddit
      if (atLinks()) {
        addCardHover();
        console.log("Initial card hovers added.")
        if (data.hover == 'off') {
          toggleHover(false);
        }
      }

      //adds the example card for the pop up preview
      let chNode = document.createElement("div");
      chNode.setAttribute("id", "exampleHover");
      chNode.style =
        "display: none; "
      let imgNode = document.createElement("img");
      imgNode.setAttribute("src", "https://i.imgur.com/o1tdCzi.png");
      chNode.appendChild(imgNode);
      targetNode.appendChild(chNode);

    });

    //clears the start loop after successfully starting
    clearInterval(start);
  }

}, 1000);
