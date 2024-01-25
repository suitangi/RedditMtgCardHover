//loads css file
function loadCSS(file) {
  var link = document.createElement("link");
  link.href = chrome.runtime.getURL(file + '.css');
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

//helper
function getChildElementIndex(node) {
  return Array.prototype.indexOf.call(node.parentNode.children, node);
}

//function to add card hovers
function addCardHover() {
  let imgsNode = document.getElementById("MTGHoverImages");
  if (imgsNode == null) {
    imgsNode = document.createElement("div");
    targetNode.appendChild(imgsNode);
    imgsNode.id = "MTGHoverImages";
  }
  let alist = document.getElementsByTagName('a');
  for (var i = 0; i < alist.length; i++) {
    if (!alist[i].classList.contains("cardHoverChecked")) {
      if (alist[i].getAttribute("href") != null &&
        (alist[i].getAttribute("href").includes("cards.scryfall.io") ||
          alist[i].getAttribute("href").includes("c1.scryfall.com/file/") ||
          alist[i].getAttribute("href").includes("gatherer.wizards.com/Handlers/Image"))) {
        let linkNode = alist[i];
        let cardName = linkNode.innerHTML;
        let chNode = document.createElement("div");
        linkNode.setAttribute('data-card', cardName);
        chNode.classList.add("cardHover");
        chNode.style = (window.mtgCardAni ? "opacity: 0;" : "") + "display:none;";
        chNode.id = cardName;
        linkNode.addEventListener("mouseenter", function(e) {
          //console.log("Entered: " + this.getAttribute('data-card'));
          window.RedditMTG.linkEntered = true;
          let outOfWin = (window.RedditMTG.cardSize * 1.4 + e.clientY) > window.innerHeight;
          document.getElementById(this.getAttribute('data-card')).style =
            "top:" + e.clientY + "px;" +
            "left: " + e.clientX + "px;" +
            "width: " + window.RedditMTG.cardSize + "px;" +
            (outOfWin ? "transform: translateY(-100%);" : "");

        });
        linkNode.addEventListener("mouseleave", function(e) {
          // console.log("Left: " + this.getAttribute('data-card'));
          window.RedditMTG.linkEntered = false;
          document.getElementById(this.getAttribute('data-card')).style = "display: none;";
        });
        chNode.addEventListener("mouseenter", function(e) {
          if (window.RedditMTG.dragging)
            return;
          let outOfWin = (window.RedditMTG.cardSize * 1.4 + e.clientY) > window.innerHeight;
          this.style =
            "top:" + e.clientY + "px;" +
            "left: " + e.clientX + "px;" +
            "width: " + window.RedditMTG.cardSize + "px;" +
            (outOfWin ? "transform: translateY(-100%);" : "");
          window.RedditMTG.imgEntered = true;
        });
        chNode.addEventListener("mouseleave", function(e) {
          // console.log("Card Left");
          if (window.RedditMTG.dragging)
            return;
          if (!window.RedditMTG.linkEntered) {
            this.style = "display: none;";
          }
          window.RedditMTG.imgEntered = true;
        });
        let imgNode = document.createElement("img");
        imgNode.setAttribute("src", linkNode.getAttribute("href"));
        imgNode.setAttribute('SF-link', linkNode.parentElement.children[getChildElementIndex(linkNode) + 2].getAttribute("href"));
        let dragNode = document.createElement('div');
        dragNode.classList.add('dragger');
        dragNode.addEventListener('mousedown', function(e) {
          document.body.style = 'user-select: none;cursor: nwse-resize;';
          window.RedditMTG.dragging = true;
          window.RedditMTG.dragger = this;
          window.RedditMTG.dragX = e.clientX + 10;
          window.RedditMTG.dragInterval = setInterval(function() {
            if (!window.RedditMTG.dragging) {
              clearInterval(window.RedditMTG.dragInterval);
              document.body.style = '';
              return;
            }
            let sizeVal = window.RedditMTG.dragX - window.RedditMTG.dragger.parentElement.getBoundingClientRect().x;
            // console.log(sizeVal);
            if (sizeVal > 450)
              sizeVal = 450;
            if (sizeVal < 100)
              sizeVal = 100;
            chrome.storage.local.set({
              size: sizeVal
            }, function() {});
            window.RedditMTG.cardSize = sizeVal;
            window.RedditMTG.dragger.parentElement.style.width = `${sizeVal}px`;
          }, 50);
        });
        imgNode.addEventListener("dblclick", (e) => {
          window.open(e.target.getAttribute('SF-link'), '_blank').focus();
        });
        chNode.appendChild(imgNode);
        chNode.appendChild(dragNode);
        imgsNode.appendChild(chNode);

        console.log(cardName + ": Hover Added");
      }
      alist[i].classList.add("cardHoverChecked");
    }
  }
}

//function at specified links
function atLinks() {

  let linklist = ["239MTG", "affinityforartifacts", "alliesmtg", "AllStandards", "Alphabetter", "Amonkhet", "architectMTG", "ArclightPhoenixMTG", "aristocratsMTG", "BadMTGCombos", "basementboardgames", "BaSE_MtG", "BudgetBrews", "budgetdecks", "BulkMagic", "cardsphere", "casualmtg", "CatsPlayingMTG", "CircuitContest", "cocomtg", "CompetitiveEDH", "custommagic", "DeckbuildingPrompts", "edh", "EDHug", "EggsMTG", "ElvesMTG", "enchantress", "EsperMagic", "findmycard", "fishmtg", "FlickerMTG", "freemagic", "goblinsMTG", "HamiltonMTG", "HardenedScales", "humansmtg", "infect", "johnnys", "kikichord", "lanternmtg", "lavaspike", "locketstorm", "lrcast", "magicarena", "Magicdeckbuilding", "MagicDuels", "magicTCG", "magicTCG101", "MakingMagic", "marchesatheblackrose", "marduMTG", "MentalMentalMagic", "millMTG", "ModernLoam", "modernmagic", "ModernRecMTG", "modernspikes", "ModernZombies", "monobluemagic", "mtg", "MTGAngels", "mtgbattlebox", "mtgbracket", "mtgbrawl", "mtgbudgetmodern", "mtgcardfetcher", "mtgcube", "MTGDredge", "mtgfinalfrontier", "mtgfinance", "mtgfrontier", "mtglegacy", "MTGManalessDredge", "MTGMaverick", "mtgmel", "mtgrules", "mtgspirits", "mtgtreefolk", "mtgvorthos", "neobrand", "nicfitmtg", "oathbreaker_mtg", "oldschoolmtg", "pauper", "PauperArena", "PauperEDH", "peasantcube", "PennyDreadfulMTG", "PioneerMTG", "planeshiftmtg", "ponzamtg", "RatsMTG", "RealLifeMTG", "RecklessBrewery", "rpg_brasil", "scapeshift", "shittyjudgequestions", "sistersmtg", "skredred", "Sligh", "spikes", "stoneblade", "StrangeBrewEDH", "SuperUltraBudgetEDH", "therandomclub", "Thoptersword", "threecardblind", "TinyLeaders", "TronMTG", "UBFaeries", "uwcontrol", "xmage", "reddit.com/message", "reddit.com/user/MTGCardFetcher"]

  let here = location.href.toLowerCase();

  for (j = 0; j < linklist.length; j++) {
    if (here.includes(linklist[j].toLowerCase()))
      return true;
  }
  return false;
}

function handleMouseMove(event) {
  if (!window.RedditMTG.dragging)
    return;
  window.RedditMTG.dragX = event.pageX;
}



///////////////////////////////////Start the script///////////////////////////////////
//to load at the start of the DOM after it has been dynamically built
window.startRMTG = setInterval(function() {
  console.log("Reddit MTGCardFetcher Hovers Loading...");

  //only continue if document body has been built
  if (document.getElementsByTagName("body").length > 0) {
    window.RedditMTG = {};
    window.RedditMTG.dragging = false;
    window.RedditMTG.dragX = 0;

    //inject css
    loadCSS('cardHover');

    //load chrome storage data for preferences/does adding hovers in callback
    //hoverPref [top (%), left (%), size (100 - 500 px)]
    chrome.storage.local.get({
      size: 300,
      hover: 'on'
    }, function(data) {
      window.RedditMTG.cardSize = data.size;

      // initializing anchor tag list length
      window.alength = 0;

      // implement mutation observer for the DOM as many content on reddit are loaded dynamically
      const targetNode = document.getElementsByTagName("body")[0];
      const config = {
        attributes: true,
        childList: true,
        subtree: true
      };
      let imgsNode = document.createElement("div");
      targetNode.appendChild(imgsNode);
      imgsNode.id = "MTGHoverImages";
      const observerCallback = function(mutationsList, observer) {
        if (atLinks() && window.alength != document.getElementsByTagName('a').length) {
          addCardHover();
          window.alength = document.getElementsByTagName('a').length;
        }
      };
      const observer = new MutationObserver(observerCallback);
      observer.observe(targetNode, config);

      //mouse events for dragging
      document.onmousemove = handleMouseMove;
      window.addEventListener('mouseup', function(event) {
        window.RedditMTG.dragging = false;
      })

      // checks if we're on specified subreddits/parts of reddit
      if (atLinks()) {
        addCardHover();
        console.log("Initial card hovers added (RedditMTGCardHover) " + chrome.runtime.getManifest().version);
      }
    });

    //clears the start loop after successfully starting
    clearInterval(window.startRMTG);
    console.log(window.startRMTG)
  }

}, 1000);
