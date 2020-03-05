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
        let inHtml = "<div class='cardHover'><img src='" + linkNode.getAttribute("href") + "'></div>";
        linkNode.innerHTML = cardName + inHtml;
        console.log(cardName + ": Hover Added");
      }
      alist[i].classList.add("cardHoverChecked");
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
  if (document.getElementsByTagName("body").length > 0) {

    //inject css
    loadCSS('cardHover');

    // the sublist
    window.subRList

    // Select the node that will be observed for mutations
    const targetNode = document.getElementsByTagName("body")[0];
    window.alength = document.getElementsByTagName('a').length;

    // Options for the observer (which mutations to observe)
    const config = {
      attributes: true,
      childList: true,
      subtree: true
    };

    // Callback function to execute when mutations are observed
    const observerCallback = function(mutationsList, observer) {
      if (atLinks() && window.alength != document.getElementsByTagName('a').length) {
        addCardHover();
        window.alength = document.getElementsByTagName('a').length;
      }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(observerCallback);
    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);


    if (atLinks()) {
      addCardHover();
      console.log("Initial card hovers added.")
    }

    //clears the start loop after successfully starting
    clearInterval(start);
  }

}, 1000);
