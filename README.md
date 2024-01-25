# ![icon](https://raw.githubusercontent.com/suitangi/RedditMtgCardHover/master/docs/img/icon.png) RedditMtgCardHover
A lightweight browser extension that adds a hover option for Reddit's u/MtgCardFetcher bot.

![Screengif](https://raw.githubusercontent.com/suitangi/RedditMtgCardHover/master/docs/img/reddithover.gif)

This extension works with both New Reddit and Old Reddit.

## Using this extension

Clone this repository
```
git clone https://github.com/suitangi/RedditMtgCardHover.git
```

or download the latest release [here](https://github.com/suitangi/RedditMtgCardHover/releases).


Then you can load the unpacked extension in either `firefox-extension` or the `chrome-extension` directory (depending on your browser type).
See more instructions here:
- [Chrome](https://webkul.com/blog/how-to-install-the-unpacked-extension-in-chrome/)
- [Firefox](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/)


## Options
- Double click on a card to go to its Scryfall page
- Drag the bottom right corner of a card to resize
  - This card size is saved as a preference and used across all cards
  
![Draggif](https://raw.githubusercontent.com/suitangi/RedditMtgCardHover/master/docs/img/drag.gif)

## List of Subreddits
This is the list of subreddits that this extension works on:
```
"239MTG", "affinityforartifacts", "alliesmtg", "AllStandards", "Alphabetter", "Amonkhet", "architectMTG", "ArclightPhoenixMTG", "aristocratsMTG", "BadMTGCombos", "basementboardgames", "BaSE_MtG", "BudgetBrews", "budgetdecks", "BulkMagic", "cardsphere", "casualmtg", "CatsPlayingMTG", "CircuitContest", "cocomtg", "CompetitiveEDH", "custommagic", "DeckbuildingPrompts", "edh", "EDHug", "EggsMTG", "ElvesMTG", "enchantress", "EsperMagic", "findmycard", "fishmtg", "FlickerMTG", "freemagic", "goblinsMTG", "HamiltonMTG", "HardenedScales", "humansmtg", "infect", "johnnys", "kikichord", "lanternmtg", "lavaspike", "locketstorm", "lrcast", "magicarena", "Magicdeckbuilding", "MagicDuels", "magicTCG", "magicTCG101", "MakingMagic", "marchesatheblackrose", "marduMTG", "MentalMentalMagic", "millMTG", "ModernLoam", "modernmagic", "ModernRecMTG", "modernspikes", "ModernZombies", "monobluemagic", "mtg", "MTGAngels", "mtgbattlebox", "mtgbracket", "mtgbrawl", "mtgbudgetmodern", "mtgcardfetcher", "mtgcube", "MTGDredge", "mtgfinalfrontier", "mtgfinance", "mtgfrontier", "mtglegacy", "MTGManalessDredge", "MTGMaverick", "mtgmel", "mtgrules", "mtgspirits", "mtgtreefolk", "mtgvorthos", "neobrand", "nicfitmtg", "oathbreaker_mtg", "oldschoolmtg", "pauper", "PauperArena", "PauperEDH", "peasantcube", "PennyDreadfulMTG", "PioneerMTG", "planeshiftmtg", "ponzamtg", "RatsMTG", "RealLifeMTG", "RecklessBrewery", "rpg_brasil", "scapeshift", "shittyjudgequestions", "sistersmtg", "skredred", "Sligh", "spikes", "stoneblade", "StrangeBrewEDH", "SuperUltraBudgetEDH", "therandomclub", "Thoptersword", "threecardblind", "TinyLeaders", "TronMTG", "UBFaeries", "uwcontrol", "xmage"
```
Contact me if there's another subreddit that should be added!

## Contributing
If you like this extension, feel free to contribute code or suggest possible functionalities and options!

Special thanks to my beta tester:
- [G-Jayakar](https://github.com/G-Jayakar)

## Disclaimer
This extension is a third-party project and has no affiliation with Reddit nor Wizards of the Coast.
This project is also free and does not collect any user data.

**Permissions required**:
- `storage` for user preferences

## Change Log
```
v2.0.0 Updated to manifest 3, removed popup and options, added double click to Scryfall and bottom right corner resizing
v1.2.3 Icon update and major fixes for new Reddit layout.
v1.2.2 More bug fixes.
v1.2.1 Bug fixes with options and hovering.
v1.2.0 Major adjustments and hover is over mouse position now.
v1.1.0 First stable release with hover fixed on screen.
```
