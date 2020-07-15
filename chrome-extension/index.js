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
        linkNode.addEventListener("mouseenter", function(e) {
          this.firstElementChild.style =
          "position: absolute;" +
          "top:" + e.pageY + "px;" +
          "left: " + e.pageX + "px;" +
          "width: " + window.mtgCardSize + "px;";
        });
        let imgNode = document.createElement("img");
        imgNode.setAttribute("src", linkNode.getAttribute("href"));
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
    for (i = 0; i < hoverList.length; i++) {
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
          window.mtgCardSize = request.style;
        }
        //style update message from popup
        if (request.popupStyle !== undefined) {
          window.mtgCardSize = request.popupStyle;
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
      size: 300,
      hover: 'on'
    }, function(data) {
      window.mtgCardSize = data.size;

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
    });

    //clears the start loop after successfully starting
    clearInterval(start);
  }

}, 1000);
