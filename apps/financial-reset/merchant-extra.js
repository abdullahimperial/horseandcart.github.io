/* Adapted subset of Merchant Studio data, CC BY 4.0, Jonathan Taveras.
 * Snapshot 4f495fbc63a89c9ed8b9faac318d4826e29508d8. Official-source entries and matching changes by this app.
 * See MERCHANT-SOURCES.md and LICENSE-merchant-studio.txt. No remote lookup.
 */
(function(root){'use strict';
const rules=[
 {
  "id": "studio:amazon",
  "name": "Amazon",
  "aliases": [
   "amazon mktpl",
   "amazon marketplace",
   "amzn mktp",
   "amzn mktpl",
   "amzn mkpl",
   "amzn mktplace",
   "amzn.com/bill",
   "amzn com bill",
   "amazon retail",
   "amazon services",
   "amazon prime marketplace",
   "amazon prime now",
   "amazon fresh",
   "amzn digital",
   "amazon",
   "amazon purchase"
  ],
  "negativeAliases": [
   "amazon web services",
   "aws marketplace",
   "audible",
   "kindle unlimited"
  ],
  "category": "Shopping",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "amazon"
 },
 {
  "id": "studio:amazon_prime",
  "name": "Amazon Prime",
  "aliases": [
   "amazon prime",
   "amzn prime",
   "prime video channels",
   "prime video",
   "amzn prime pmt"
  ],
  "negativeAliases": [
   "amazon web services"
  ],
  "category": "Subscriptions",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "amazon_prime"
 },
 {
  "id": "studio:ebay",
  "name": "eBay",
  "aliases": [
   "ebay",
   "ebay commerce",
   "ebay o",
   "ebay marketplace",
   "ebayinc",
   "ebay inc",
   "ebay purchase"
  ],
  "negativeAliases": [],
  "category": "Shopping",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "ebay"
 },
 {
  "id": "studio:etsy",
  "name": "Etsy",
  "aliases": [
   "etsy",
   "etsy.com",
   "etsy inc",
   "etsy payments",
   "etsy purchase"
  ],
  "negativeAliases": [],
  "category": "Shopping",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "etsy"
 },
 {
  "id": "studio:walmart",
  "name": "Walmart",
  "aliases": [
   "wal-mart",
   "walmart",
   "wm supercenter",
   "walmart.com",
   "walmart grocery",
   "walmart plus",
   "walmart store",
   "walmart ecommerce",
   "walmart neighborhood market",
   "walmart purchase"
  ],
  "negativeAliases": [
   "sam club",
   "sams club"
  ],
  "category": "Shopping",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "walmart"
 },
 {
  "id": "studio:costco",
  "name": "Costco",
  "aliases": [
   "costco",
   "costco whse",
   "costco wholesale",
   "costco.com",
   "costco purchase"
  ],
  "negativeAliases": [],
  "category": "Shopping",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "costco"
 },
 {
  "id": "studio:best_buy",
  "name": "Best Buy",
  "aliases": [
   "best buy",
   "bestbuy",
   "bestbuy.com",
   "bbym",
   "best buy mht",
   "best buy purchase"
  ],
  "negativeAliases": [],
  "category": "Shopping",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "best_buy"
 },
 {
  "id": "studio:ikea",
  "name": "IKEA",
  "aliases": [
   "ikea",
   "ikea usa",
   "ikea.com",
   "ikea north america",
   "ikea purchase"
  ],
  "negativeAliases": [],
  "category": "Shopping",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "ikea"
 },
 {
  "id": "studio:staples",
  "name": "Staples",
  "aliases": [
   "staples",
   "staples.com",
   "staples direct",
   "staples purchase"
  ],
  "negativeAliases": [],
  "category": "Shopping",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "staples"
 },
 {
  "id": "studio:sephora",
  "name": "Sephora",
  "aliases": [
   "sephora",
   "sephora.com",
   "sephora usa",
   "sephora purchase"
  ],
  "negativeAliases": [],
  "category": "Shopping",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "sephora"
 },
 {
  "id": "studio:nike",
  "name": "Nike",
  "aliases": [
   "nike",
   "nike.com",
   "nike store",
   "nike digital",
   "snkrs",
   "nike purchase"
  ],
  "negativeAliases": [],
  "category": "Shopping",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "nike"
 },
 {
  "id": "studio:adidas",
  "name": "Adidas",
  "aliases": [
   "adidas",
   "adidas.com",
   "adidas retail",
   "adidas purchase"
  ],
  "negativeAliases": [],
  "category": "Shopping",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "adidas"
 },
 {
  "id": "studio:zara",
  "name": "Zara",
  "aliases": [
   "zara",
   "zara.com",
   "zara usa",
   "zara purchase"
  ],
  "negativeAliases": [],
  "category": "Shopping",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "zara"
 },
 {
  "id": "studio:hm",
  "name": "H&M",
  "aliases": [
   "h&m",
   "h and m",
   "hm.com",
   "hennes mauritz",
   "h m",
   "handm",
   "handm purchase"
  ],
  "negativeAliases": [],
  "category": "Shopping",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "hm"
 },
 {
  "id": "studio:uniqlo",
  "name": "UNIQLO",
  "aliases": [
   "uniqlo",
   "uniqlo.com",
   "uniqlo usa",
   "uniqlo purchase"
  ],
  "negativeAliases": [],
  "category": "Shopping",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "uniqlo"
 },
 {
  "id": "studio:old_navy",
  "name": "Old Navy",
  "aliases": [
   "old navy",
   "oldnavy",
   "oldnavy.com",
   "gap old navy",
   "old navy purchase"
  ],
  "negativeAliases": [],
  "category": "Shopping",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "old_navy"
 },
 {
  "id": "studio:lululemon",
  "name": "lululemon",
  "aliases": [
   "lululemon",
   "lulu lemon",
   "lululemon.com",
   "lululemon purchase"
  ],
  "negativeAliases": [],
  "category": "Shopping",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "lululemon"
 },
 {
  "id": "studio:instacart",
  "name": "Instacart",
  "aliases": [
   "instacart",
   "instacart.com",
   "instacart help",
   "maplebear instacart",
   "instacart grocery"
  ],
  "negativeAliases": [],
  "category": "Groceries",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "instacart"
 },
 {
  "id": "studio:starbucks",
  "name": "Starbucks",
  "aliases": [
   "starbucks",
   "starbucks store",
   "sbux",
   "starbucks card reload",
   "starbucks coffee"
  ],
  "negativeAliases": [],
  "category": "Dining & shopping",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "starbucks"
 },
 {
  "id": "studio:burger_king",
  "name": "Burger King",
  "aliases": [
   "burger king",
   "bk restaurant",
   "burgerking"
  ],
  "negativeAliases": [],
  "category": "Dining & shopping",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "burger_king"
 },
 {
  "id": "studio:wendys",
  "name": "Wendy's",
  "aliases": [
   "wendys",
   "wendy s",
   "wendy's",
   "wendys mobile"
  ],
  "negativeAliases": [],
  "category": "Dining & shopping",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "wendys"
 },
 {
  "id": "studio:taco_bell",
  "name": "Taco Bell",
  "aliases": [
   "taco bell",
   "tacobell",
   "taco bell mobile"
  ],
  "negativeAliases": [],
  "category": "Dining & shopping",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "taco_bell"
 },
 {
  "id": "studio:dominos",
  "name": "Domino's",
  "aliases": [
   "dominos",
   "domino s",
   "domino's",
   "dominos pizza",
   "domino pizza"
  ],
  "negativeAliases": [],
  "category": "Dining & shopping",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "dominos"
 },
 {
  "id": "studio:pizza_hut",
  "name": "Pizza Hut",
  "aliases": [
   "pizza hut",
   "pizzahut",
   "pizza hut online"
  ],
  "negativeAliases": [],
  "category": "Dining & shopping",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "pizza_hut"
 },
 {
  "id": "studio:kfc",
  "name": "KFC",
  "aliases": [
   "kfc",
   "kentucky fried chicken"
  ],
  "negativeAliases": [],
  "category": "Dining & shopping",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "kfc"
 },
 {
  "id": "studio:doordash",
  "name": "DoorDash",
  "aliases": [
   "doordash",
   "door dash",
   "dd doordash"
  ],
  "negativeAliases": [
   "dashpass",
   "dash pass"
  ],
  "category": "Dining & shopping",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "doordash",
  "prefixes": [
   "doordash",
   "dd doordash"
  ],
  "note": "Delivery-platform name; check whether this was food, groceries or another purchase."
 },
 {
  "id": "studio:uber_eats",
  "name": "Uber Eats",
  "aliases": [
   "uber eats",
   "ubereats",
   "uber *eats",
   "help.uber.com eats",
   "postmates"
  ],
  "negativeAliases": [
   "uber trip"
  ],
  "category": "Dining & shopping",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "uber_eats"
 },
 {
  "id": "studio:shell",
  "name": "Shell",
  "aliases": [
   "shell",
   "shell oil",
   "shell service station",
   "shell gasoline",
   "shell gas"
  ],
  "negativeAliases": [],
  "category": "Transport",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "shell"
 },
 {
  "id": "studio:chevron",
  "name": "Chevron",
  "aliases": [
   "chevron",
   "chevron texaco",
   "chevron service",
   "chevron gas"
  ],
  "negativeAliases": [],
  "category": "Transport",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "chevron"
 },
 {
  "id": "studio:seven_eleven",
  "name": "7-Eleven",
  "aliases": [
   "7-eleven",
   "7 eleven",
   "seven eleven",
   "7eleven"
  ],
  "negativeAliases": [
   "wawa"
  ],
  "category": "Shopping",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "seven_eleven"
 },
 {
  "id": "studio:circle_k",
  "name": "Circle K",
  "aliases": [
   "circle k",
   "circlek",
   "circle k stores"
  ],
  "negativeAliases": [],
  "category": "Shopping",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "circle_k",
  "note": "Convenience retailer; use Transport only for a fuel purchase."
 },
 {
  "id": "studio:uber",
  "name": "Uber",
  "aliases": [
   "uber trip",
   "uber *trip",
   "uber help.uber.com",
   "help.uber.com",
   "uber technologies",
   "uber ride",
   "uber bv",
   "uber"
  ],
  "negativeAliases": [
   "uber eats",
   "ubereats",
   "eats",
   "uber one",
   "uberone"
  ],
  "category": "Transport",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "uber"
 },
 {
  "id": "studio:lyft",
  "name": "Lyft",
  "aliases": [
   "lyft",
   "lyft ride",
   "lyft *ride",
   "lyft bikes",
   "lyft scooter"
  ],
  "negativeAliases": [],
  "category": "Transport",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "lyft",
  "evidenceUrl": "https://help.lyft.com/hc/en-us/all/articles/115012926167-Temporary-authorizations"
 },
 {
  "id": "studio:hertz",
  "name": "Hertz",
  "aliases": [
   "hertz",
   "hertz rent-a-car",
   "hertz rental",
   "hertz car rental"
  ],
  "negativeAliases": [],
  "category": "Transport",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "hertz"
 },
 {
  "id": "studio:enterprise",
  "name": "Enterprise Rent-A-Car",
  "aliases": [
   "enterprise rent",
   "enterprise car",
   "enterprise rent-a-car",
   "erac",
   "enterprise car rental"
  ],
  "negativeAliases": [],
  "category": "Transport",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "enterprise"
 },
 {
  "id": "studio:avis",
  "name": "Avis",
  "aliases": [
   "avis",
   "avis rent a car",
   "avis car rental"
  ],
  "negativeAliases": [],
  "category": "Transport",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "avis"
 },
 {
  "id": "studio:netflix",
  "name": "Netflix",
  "aliases": [
   "netflix",
   "netflix.com",
   "netflix 866",
   "netflix subscription"
  ],
  "negativeAliases": [],
  "category": "Subscriptions",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "netflix"
 },
 {
  "id": "studio:spotify",
  "name": "Spotify",
  "aliases": [
   "spotify",
   "spotify usa",
   "spotify p",
   "spotify premium"
  ],
  "negativeAliases": [],
  "category": "Subscriptions",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "spotify"
 },
 {
  "id": "studio:disney_plus",
  "name": "Disney+",
  "aliases": [
   "disney plus",
   "disneyplus",
   "disney streaming",
   "disney bundle"
  ],
  "negativeAliases": [],
  "category": "Subscriptions",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "disney_plus"
 },
 {
  "id": "studio:audible",
  "name": "Audible",
  "aliases": [
   "audible",
   "audible.com",
   "amzn audible",
   "audible membership"
  ],
  "negativeAliases": [],
  "category": "Subscriptions",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "audible"
 },
 {
  "id": "studio:openai",
  "name": "OpenAI",
  "aliases": [
   "openai",
   "openai api",
   "openai subscription"
  ],
  "negativeAliases": [],
  "category": "Other",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "openai",
  "note": "OpenAI service identified. API usage and ChatGPT subscriptions have separate billing; check the service purchased.",
  "evidenceUrl": "https://help.openai.com/en/articles/9039756-managing-billing-for-chatgpt-and-the-api-platform"
 },
 {
  "id": "studio:western_union",
  "name": "Western Union",
  "aliases": [
   "western union",
   "westernunion",
   "wu money transfer",
   "western union transfer"
  ],
  "negativeAliases": [],
  "category": "Other",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "western_union",
  "note": "Money-transfer provider identified. Choose the purpose of this payment; it is not automatically a transfer between your own accounts."
 },
 {
  "id": "studio:remitly",
  "name": "Remitly",
  "aliases": [
   "remitly",
   "remitly transfer",
   "remitly inc"
  ],
  "negativeAliases": [],
  "category": "Other",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "remitly",
  "note": "Money-transfer provider identified. Choose the purpose of this payment; it is not automatically a transfer between your own accounts."
 },
 {
  "id": "studio:moneygram",
  "name": "MoneyGram",
  "aliases": [
   "moneygram",
   "money gram",
   "moneygram online",
   "moneygram transfer"
  ],
  "negativeAliases": [],
  "category": "Other",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "moneygram",
  "note": "Money-transfer provider identified. Choose the purpose of this payment; it is not automatically a transfer between your own accounts.",
  "evidenceUrl": "https://www.moneygram.com/ca/en"
 },
 {
  "id": "studio:dollar_tree",
  "name": "Dollar Tree",
  "aliases": [
   "dollar tree",
   "dollartree",
   "dollar tr",
   "dollar tree stores"
  ],
  "negativeAliases": [],
  "category": "Shopping",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "dollar_tree"
 },
 {
  "id": "studio:tim_hortons",
  "name": "Tim Hortons",
  "aliases": [
   "tim hortons",
   "tim horton s",
   "timhortons",
   "tim hortons us"
  ],
  "negativeAliases": [],
  "category": "Dining & shopping",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "tim_hortons"
 },
 {
  "id": "studio:ticketmaster",
  "name": "Ticketmaster",
  "aliases": [
   "ticketmaster",
   "ticketmaster.com",
   "tm ticketmaster",
   "ticketmaster events",
   "ticketmstr"
  ],
  "negativeAliases": [],
  "category": "Recreation",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "ticketmaster"
 },
 {
  "id": "studio:eventbrite",
  "name": "Eventbrite",
  "aliases": [
   "eventbrite",
   "eventbrite.com",
   "eventbrite inc",
   "eb *eventbrite"
  ],
  "negativeAliases": [],
  "category": "Recreation",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "eventbrite"
 },
 {
  "id": "studio:duolingo",
  "name": "Duolingo",
  "aliases": [
   "duolingo",
   "duolingo.com",
   "duolingo super",
   "duolingo plus"
  ],
  "negativeAliases": [],
  "category": "Education & training",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "duolingo"
 },
 {
  "id": "studio:bmo",
  "name": "BMO",
  "aliases": [
   "bmo harris",
   "bmo harris bank",
   "bmo bank",
   "bmo bank na",
   "bmo financial",
   "bmo harris bk",
   "bmo",
   "bank of montreal"
  ],
  "negativeAliases": [],
  "category": "Other",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "bmo",
  "evidenceUrl": "https://www.bmo.com/en-ca/main/personal/legal/",
  "note": "Bank identified, but this description does not show whether the payment was a card settlement, loan payment or something else. Choose its purpose."
 },
 {
  "id": "studio:walmart_vision_center",
  "name": "Walmart Vision Center",
  "aliases": [
   "walmart vision",
   "walmart vision center",
   "walmart optical",
   "wal-mart vision",
   "walmart vision ctr"
  ],
  "negativeAliases": [],
  "category": "Health & care",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "walmart_vision_center"
 },
 {
  "id": "studio:costco_optical",
  "name": "Costco Optical",
  "aliases": [
   "costco optical",
   "costco vision",
   "costco optical #",
   "costco hearing",
   "costco hearing aid"
  ],
  "negativeAliases": [],
  "category": "Health & care",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "costco_optical"
 },
 {
  "id": "studio:apple_tv_plus",
  "name": "Apple TV+",
  "aliases": [
   "apple tv+",
   "apple tv plus",
   "apple tv subscription",
   "appletv+",
   "apple one"
  ],
  "negativeAliases": [],
  "category": "Subscriptions",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "apple_tv_plus"
 },
 {
  "id": "studio:apple_music",
  "name": "Apple Music",
  "aliases": [
   "apple music",
   "applemusic",
   "apple music subscription",
   "apple music family"
  ],
  "negativeAliases": [],
  "category": "Subscriptions",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "apple_music"
 },
 {
  "id": "studio:amazon_music",
  "name": "Amazon Music Unlimited",
  "aliases": [
   "amazon music",
   "amazon music unlimited",
   "amzn music",
   "amazon music unltd"
  ],
  "negativeAliases": [],
  "category": "Subscriptions",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "amazon_music"
 },
 {
  "id": "studio:impark",
  "name": "Impark",
  "aliases": [
   "impark",
   "imperial parking",
   "impark.com",
   "impark #",
   "impark parking"
  ],
  "negativeAliases": [],
  "category": "Transport",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "impark"
 },
 {
  "id": "studio:diamond_parking",
  "name": "Diamond Parking",
  "aliases": [
   "diamond parking",
   "diamondparking",
   "diamond parking #",
   "diamond parking service"
  ],
  "negativeAliases": [],
  "category": "Transport",
  "sourceName": "Merchant Studio",
  "sourceUrl": "https://github.com/jtvargas/merchant-studio",
  "sourceId": "diamond_parking"
 },
 {
  "id": "official:dashpass",
  "name": "DoorDash DashPass",
  "aliases": [
   "doordash dashpass",
   "doordashdashpass",
   "dashpass",
   "dash pass",
   "doordash dash pass"
  ],
  "category": "Subscriptions",
  "sourceName": "Official merchant or organization website",
  "sourceUrl": "https://help.doordash.com/en-ca/consumers/article/what-is-dashpass",
  "note": "DashPass is a membership charge, separate from individual orders.",
  "negativeAliases": []
 },
 {
  "id": "official:uber_one",
  "name": "Uber One",
  "aliases": [
   "uber one",
   "uberone"
  ],
  "category": "Subscriptions",
  "sourceName": "Official merchant or organization website",
  "sourceUrl": "https://help.uber.com/riders/article/what-is-uber-one?nodeId=301585b0-ff5b-4612-b6e8-07bf4126c833",
  "note": "Uber One is a paid membership, separate from rides and food orders.",
  "negativeAliases": []
 },
 {
  "id": "official:chatgpt",
  "name": "ChatGPT",
  "aliases": [
   "chatgpt",
   "chat gpt"
  ],
  "category": "Subscriptions",
  "sourceName": "Official merchant or organization website",
  "sourceUrl": "https://help.openai.com/en/articles/9039756-managing-billing-for-chatgpt-and-the-api-platform",
  "note": "ChatGPT subscription wording; API usage is billed separately.",
  "negativeAliases": [
   "api"
  ]
 },
 {
  "id": "official:apple_billing",
  "name": "Apple billing",
  "aliases": [
   "apple.com/bill",
   "apple com bill",
   "itunes.com/bill",
   "itunes com bill"
  ],
  "category": "Other",
  "sourceName": "Official merchant or organization website",
  "sourceUrl": "https://support.apple.com/en-ca/120164",
  "note": "Apple billing can cover apps, content and subscriptions. Check purchase history before choosing a category.",
  "negativeAliases": []
 },
 {
  "id": "official:pc_express",
  "name": "PC Express",
  "aliases": [
   "pc express",
   "pcexpress"
  ],
  "category": "Groceries",
  "sourceName": "Official merchant or organization website",
  "sourceUrl": "https://www.pcexpress.ca/social",
  "note": "PC Express grocery service. Check the items purchased.",
  "negativeAliases": [
   "pc express pass",
   "pcexpress pass"
  ]
 },
 {
  "id": "official:pc_express_pass",
  "name": "PC Express Pass",
  "aliases": [
   "pc express pass",
   "pcexpress pass"
  ],
  "category": "Subscriptions",
  "sourceName": "Official merchant or organization website",
  "sourceUrl": "https://www.realcanadiansuperstore.ca/en/pc-express-pass-signup",
  "note": "PC Express Pass is a delivery/pickup subscription, separate from grocery purchases.",
  "negativeAliases": []
 },
 {
  "id": "official:hw_produce",
  "name": "H&W Produce",
  "aliases": [
   "h & w produce",
   "h and w produce",
   "hw produce"
  ],
  "category": "Groceries",
  "sourceName": "Official merchant or organization website",
  "sourceUrl": "https://handwproduce.com/",
  "note": "Produce retailer.",
  "negativeAliases": []
 },
 {
  "id": "official:telus",
  "name": "TELUS",
  "aliases": [
   "telus",
   "telus comm",
   "telus communications",
   "telus mobility"
  ],
  "category": "Utilities",
  "sourceName": "Official merchant or organization website",
  "sourceUrl": "https://www.telus.com/en/support/article/how-to-pay-your-bill",
  "note": "TELUS service payment. Check whether it relates to phone, internet or another service.",
  "negativeAliases": [
   "telus health"
  ]
 },
 {
  "id": "official:ci_investment_services",
  "name": "CI Investment Services",
  "aliases": [
   "ci investment services",
   "ci inv services"
  ],
  "category": "Investments",
  "sourceName": "Official merchant or organization website",
  "sourceUrl": "https://www.cifinancial.com/ci-is/ca/en/about-us.html",
  "note": "Investment-dealer name matched. Confirm the movement; fees and investment income need their own categories.",
  "negativeAliases": []
 },
 {
  "id": "official:td_waterhouse",
  "name": "TD Waterhouse / TD Direct Investing",
  "aliases": [
   "td waterhouse",
   "td direct investing"
  ],
  "category": "Investments",
  "sourceName": "Official merchant or organization website",
  "sourceUrl": "https://www.td.com/ca/en/investing/direct-investing/direct-investing-vs-easytrade",
  "note": "Brokerage name matched. Confirm the movement; fees and investment income need their own categories.",
  "negativeAliases": []
 },
 {
  "id": "official:edmonton_taxes",
  "name": "City of Edmonton property taxes",
  "aliases": [
   "coe edmtaxes",
   "edmonton taxes",
   "city of edmonton taxes"
  ],
  "category": "Taxes",
  "sourceName": "Official merchant or organization website",
  "sourceUrl": "https://www.edmonton.ca/residential_neighbourhoods/property-taxes",
  "note": "Municipal-tax wording. Banks use different payee abbreviations; verify against the tax bill.",
  "negativeAliases": []
 },
 {
  "id": "official:costco_gas",
  "name": "Costco Gasoline",
  "aliases": [
   "costco gas",
   "costco gasoline",
   "costco fuel"
  ],
  "category": "Transport",
  "sourceName": "Official merchant or organization website",
  "sourceUrl": "https://www.costco.ca/w/-/ab/edmonton/154",
  "note": "Costco fuel-station wording, separate from warehouse shopping.",
  "negativeAliases": []
 }
];
root.ResetMerchantExtras={rules,version:'4f495fbc63a89c9ed8b9faac318d4826e29508d8'};
})(typeof window!=='undefined'?window:globalThis);

