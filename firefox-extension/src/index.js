// Reddit MTG Card Hover Extension - Firefox Version
(function() {
  'use strict';
  
  // Use browser API (Firefox standard)
  const extensionAPI = browser;
  
  // Namespace to avoid conflicts with page scripts
  const RMTG = {
    cardSize: 300,
    dragging: false,
    linkEntered: false,
    imgEntered: false,
    dragX: 0,
    dragger: null,
    dragInterval: null,
    hoverEnabled: true
  };
  
  // Listen for messages from popup and options
  extensionAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
    try {
      // Style update from options page
      if (request.style !== undefined) {
        RMTG.cardSize = request.style;
        updateAllCardSizes(request.style);
      }
      
      // Style update from popup
      if (request.popupStyle !== undefined) {
        RMTG.cardSize = request.popupStyle;
        updateAllCardSizes(request.popupStyle);
      }
      
      // Hover toggle from popup/options
      if (request.hover !== undefined) {
        RMTG.hoverEnabled = request.hover;
        toggleHoverFunctionality(request.hover);
      }
    } catch (err) {
      console.error('Error handling message:', err);
    }
  });
  
  // Update all existing card sizes
  function updateAllCardSizes(newSize) {
    const cardElements = document.querySelectorAll('#MTGHoverImages .cardHover');
    cardElements.forEach(card => {
      if (card.style.display !== 'none') {
        card.style.width = `${newSize}px`;
      }
    });
  }
  
  // Toggle hover functionality on/off
  function toggleHoverFunctionality(enabled) {
    const cardElements = document.querySelectorAll('#MTGHoverImages .cardHover');
    if (!enabled) {
      cardElements.forEach(card => {
        card.style.display = 'none';
      });
    }
  }
  
  // Load CSS file
  function loadCSS(file) {
    const link = document.createElement('link');
    link.href = extensionAPI.runtime.getURL(file + '.css');
    link.id = file;
    link.type = 'text/css';
    link.rel = 'stylesheet';
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  
  // Unload CSS file
  function unloadCSS(file) {
    const cssNode = document.getElementById(file);
    cssNode && cssNode.parentNode.removeChild(cssNode);
  }
  
  // Helper function
  function getChildElementIndex(node) {
    return Array.prototype.indexOf.call(node.parentNode.children, node);
  }
  
  // Function to add card hovers
  function addCardHover() {
    let imgsNode = document.getElementById('MTGHoverImages');
    if (!imgsNode) {
      imgsNode = document.createElement('div');
      document.body.appendChild(imgsNode);
      imgsNode.id = 'MTGHoverImages';
    }
    
    const links = document.getElementsByTagName('a');
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      if (link.classList.contains('cardHoverChecked')) continue;
      
      const href = link.getAttribute('href');
      if (!href || !(href.includes('cards.scryfall.io') || 
                    href.includes('c1.scryfall.com/file/') || 
                    href.includes('img.scryfall.com/cards') ||
                    href.includes('gatherer.wizards.com/Handlers/Image'))) {
        link.classList.add('cardHoverChecked');
        continue;
      }
      
      try {
        const cardName = link.innerHTML.replace(/[^a-zA-Z0-9\s]/g, '_');
        const uniqueId = `card_${cardName}_${i}`;
        const chNode = document.createElement('div');
        
        link.setAttribute('data-card', uniqueId);
        chNode.classList.add('cardHover');
        chNode.style.cssText = 'display: none;';
        chNode.id = uniqueId;
        
        link.addEventListener('mouseenter', function(e) {
          if (!RMTG.hoverEnabled) return;
          
          RMTG.linkEntered = true;
          const outOfWin = (RMTG.cardSize * 1.4 + e.clientY) > window.innerHeight;
          const cardElement = document.getElementById(this.getAttribute('data-card'));
          if (cardElement) {
            cardElement.style.cssText = `
              display: block;
              top: ${e.clientY}px;
              left: ${e.clientX}px;
              width: ${RMTG.cardSize}px;
              ${outOfWin ? 'transform: translateY(-100%);' : ''}
            `;
          }
        });
        
        link.addEventListener('mouseleave', function() {
          RMTG.linkEntered = false;
          const cardElement = document.getElementById(this.getAttribute('data-card'));
          if (cardElement) {
            cardElement.style.display = 'none';
          }
        });
        
        chNode.addEventListener('mouseenter', function(e) {
          if (RMTG.dragging || !RMTG.hoverEnabled) return;
          
          const outOfWin = (RMTG.cardSize * 1.4 + e.clientY) > window.innerHeight;
          this.style.cssText = `
            display: block;
            top: ${e.clientY}px;
            left: ${e.clientX}px;
            width: ${RMTG.cardSize}px;
            ${outOfWin ? 'transform: translateY(-100%);' : ''}
          `;
          RMTG.imgEntered = true;
        });
        
        chNode.addEventListener('mouseleave', function() {
          if (RMTG.dragging) return;
          
          if (!RMTG.linkEntered) {
            this.style.display = 'none';
          }
          RMTG.imgEntered = false;
        });
        
        const imgNode = document.createElement('img');
        imgNode.setAttribute('src', link.getAttribute('href'));
        imgNode.setAttribute('alt', 'MTG Card');
        
        // Try to get Scryfall link for double-click functionality
        try {
          const nextElement = link.parentElement.children[getChildElementIndex(link) + 2];
          if (nextElement && nextElement.getAttribute('href')) {
            imgNode.setAttribute('data-scryfall-link', nextElement.getAttribute('href'));
          }
        } catch (err) {
          // Ignore if we can't find the Scryfall link
        }
        
        const dragNode = document.createElement('div');
        dragNode.classList.add('dragger');
        
        dragNode.addEventListener('mousedown', function(e) {
          e.preventDefault();
          document.body.style.cssText = 'user-select: none; cursor: nwse-resize;';
          RMTG.dragging = true;
          RMTG.dragger = this;
          RMTG.dragX = e.clientX + 10;
          
          RMTG.dragInterval = setInterval(function() {
            if (!RMTG.dragging) {
              clearInterval(RMTG.dragInterval);
              document.body.style.cssText = '';
              return;
            }
            
            if (!RMTG.dragger || !RMTG.dragger.parentElement) {
              RMTG.dragging = false;
              return;
            }
            
            let sizeVal = RMTG.dragX - RMTG.dragger.parentElement.getBoundingClientRect().x;
            sizeVal = Math.max(100, Math.min(450, sizeVal));
            
            extensionAPI.storage.local.set({ size: sizeVal }).catch(err => {
              console.error('Error saving card size:', err);
            });
            
            RMTG.cardSize = sizeVal;
            RMTG.dragger.parentElement.style.width = `${sizeVal}px`;
          }, 20);
        });
        
        imgNode.addEventListener('dblclick', (e) => {
          const scryfallLink = e.target.getAttribute('data-scryfall-link');
          if (scryfallLink) {
            window.open(scryfallLink, '_blank');
          }
        });
        
        chNode.appendChild(imgNode);
        chNode.appendChild(dragNode);
        imgsNode.appendChild(chNode);
        
      } catch (err) {
        console.error('Error adding hover for card:', err);
      }
      
      link.classList.add('cardHoverChecked');
    }
  }
  
  // Check if we're on a relevant subreddit or user page
  function isOnTargetPage() {
    const targetSubreddits = [
      '239MTG', 'affinityforartifacts', 'alliesmtg', 'AllStandards', 'Alphabetter', 'Amonkhet', 
      'architectMTG', 'ArclightPhoenixMTG', 'aristocratsMTG', 'BadMTGCombos', 'basementboardgames', 
      'BaSE_MtG', 'BudgetBrews', 'budgetdecks', 'BulkMagic', 'cardsphere', 'casualmtg', 
      'CatsPlayingMTG', 'CircuitContest', 'cocomtg', 'CompetitiveEDH', 'custommagic', 
      'DeckbuildingPrompts', 'edh', 'EDHug', 'EggsMTG', 'ElvesMTG', 'enchantress', 'EsperMagic', 
      'findmycard', 'fishmtg', 'FlickerMTG', 'freemagic', 'goblinsMTG', 'HamiltonMTG', 
      'HardenedScales', 'humansmtg', 'infect', 'johnnys', 'kikichord', 'lanternmtg', 'lavaspike', 
      'locketstorm', 'lrcast', 'magicarena', 'Magicdeckbuilding', 'MagicDuels', 'magicTCG', 
      'magicTCG101', 'MakingMagic', 'marchesatheblackrose', 'marduMTG', 'MentalMentalMagic', 
      'millMTG', 'ModernLoam', 'modernmagic', 'ModernRecMTG', 'modernspikes', 'ModernZombies', 
      'monobluemagic', 'mtg', 'MTGAngels', 'mtgbattlebox', 'mtgbracket', 'mtgbrawl', 
      'mtgbudgetmodern', 'mtgcardfetcher', 'mtgcube', 'MTGDredge', 'mtgfinalfrontier', 
      'mtgfinance', 'mtgfrontier', 'mtglegacy', 'MTGManalessDredge', 'MTGMaverick', 'mtgmel', 
      'mtgrules', 'mtgspirits', 'mtgtreefolk', 'mtgvorthos', 'neobrand', 'nicfitmtg', 
      'oathbreaker_mtg', 'oldschoolmtg', 'pauper', 'PauperArena', 'PauperEDH', 'peasantcube', 
      'PennyDreadfulMTG', 'PioneerMTG', 'planeshiftmtg', 'ponzamtg', 'RatsMTG', 'RealLifeMTG', 
      'RecklessBrewery', 'rpg_brasil', 'scapeshift', 'shittyjudgequestions', 'sistersmtg', 
      'skredred', 'Sligh', 'spikes', 'stoneblade', 'StrangeBrewEDH', 'SuperUltraBudgetEDH', 
      'therandomclub', 'Thoptersword', 'threecardblind', 'TinyLeaders', 'TronMTG', 'UBFaeries', 
      'uwcontrol', 'xmage', 'reddit.com/message', 'reddit.com/user/MTGCardFetcher'
    ];
    
    const currentUrl = location.href.toLowerCase();
    return targetSubreddits.some(subreddit => currentUrl.includes(subreddit.toLowerCase()));
  }
  
  // Handle mouse movement for dragging
  function handleMouseMove(event) {
    if (RMTG.dragging) {
      RMTG.dragX = event.pageX;
    }
  }
  
  // Initialize the extension
  function initializeExtension() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeExtension);
      return;
    }
    
    if (!document.body) {
      setTimeout(initializeExtension, 100);
      return;
    }
    
    // Inject CSS
    try {
      loadCSS('src/cardHover');
    } catch (err) {
      console.error('Error loading CSS:', err);
      return;
    }
    
    // Load storage data and initialize
    extensionAPI.storage.local.get({
      size: 300,
      hover: 'on'
    }).then(data => {
      RMTG.cardSize = data.size;
      RMTG.hoverEnabled = data.hover === 'on';
      
      let linkCount = 0;
      
      // Set up mutation observer for dynamic content
      const observerConfig = {
        attributes: true,
        childList: true,
        subtree: true
      };
      
      const observer = new MutationObserver(function(mutations) {
        if (isOnTargetPage()) {
          const currentLinkCount = document.getElementsByTagName('a').length;
          if (linkCount !== currentLinkCount) {
            addCardHover();
            linkCount = currentLinkCount;
          }
        }
      });
      
      observer.observe(document.body, observerConfig);
      
      // Set up mouse events for dragging
      document.addEventListener('mousemove', handleMouseMove, { passive: true });
      document.addEventListener('mouseup', function() {
        RMTG.dragging = false;
      });
      
      // Initial card hover setup
      if (isOnTargetPage()) {
        addCardHover();
        linkCount = document.getElementsByTagName('a').length;
      }
      
    }).catch(err => {
      console.error('Error loading extension settings:', err);
    });
  }
  
  // Start the extension
  initializeExtension();
  
})(); // End IIFE