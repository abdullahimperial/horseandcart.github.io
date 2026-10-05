/* Lessons adapted from Personal Finance Story by Abdullah Mohiuddin.
   Pages refer to the supplied 109-page manuscript. Illustrations are conceptual. */
window.COURSE = [
  {
    "id": 1,
    "stage": "Understand",
    "title": "Your financial life",
    "summary": "Explore the choices you make and the circumstances you inherit. Start with curiosity, then play.",
    "page": 20,
    "slides": [
      {
        "title": "Your life. Some chance. Some choice.",
        "body": "The book opens with a game because a financial journey is easier to understand when you can see decisions unfold.",
        "points": [
          "Start at age 18. Each space represents a year.",
          "Roll a die for circumstances outside your control.",
          "Choose deliberately when the game asks you to decide."
        ],
        "visual": {
          "kind": "path",
          "labels": [
            "18 · Start",
            "23 · Work",
            "32 · Family",
            "37 · Home"
          ]
        },
        "page": 20,
        "note": "",
        "heading": "Your life. Some chance. Some choice."
      },
      {
        "title": "A roll is not a decision",
        "body": "Education support, scholarships, and job opportunities are represented by chance. Your response still matters.",
        "points": [
          "Acknowledge your starting resources and constraints.",
          "Compare the choices that are genuinely available to you.",
          "Avoid confusing a lucky outcome with a repeatable strategy."
        ],
        "visual": {
          "kind": "split",
          "labels": [
            "Chance|Funding, job market, timing",
            "Choice|Transport, spending, planning"
          ]
        },
        "page": 20,
        "note": "",
        "heading": "How the game works"
      },
      {
        "title": "At 18: choose your starting path",
        "body": "The game introduces RESP support, scholarships, part-time work, loans, trades, and employment.",
        "points": [
          "Education can create opportunity; its funding changes the starting position.",
          "Compare debt, time, earnings, and fit—not prestige alone.",
          "Trades and other routes deserve a place in the comparison."
        ],
        "visual": {
          "kind": "steps",
          "labels": [
            "Funding",
            "Training",
            "Starting position"
          ]
        },
        "page": 21,
        "note": "The game simplifies real career pathways and their costs.",
        "heading": "When You Turn 18"
      },
      {
        "title": "At 23: income meets lifestyle",
        "body": "Your job outcome affects what you can save. Your transport decision affects how much of that income you keep.",
        "points": [
          "The game offers a used car, financed new car, upfront new car, or transit.",
          "A one-time purchase and a recurring payment behave differently.",
          "A realistic choice must also work for your job and location."
        ],
        "visual": {
          "kind": "bars",
          "labels": [
            "Used car|10000",
            "New car upfront|40000",
            "Financed: 7 × $8k|56000"
          ]
        },
        "page": 22,
        "note": "Illustrative game amounts only; fuel, insurance, resale, and other costs are not fully modeled.",
        "heading": "When You Turn 23 and Graduate"
      },
      {
        "title": "At 27 and 30: money becomes shared",
        "body": "The relationship and wedding stages show how shared habits can affect a financial plan.",
        "points": [
          "Talk about spending, debt, expectations, and goals.",
          "A wedding is a decision with an immediate financial effect.",
          "Use the game to start a conversation rather than label people."
        ],
        "visual": {
          "kind": "split",
          "labels": [
            "Shared habits|Regular financial impact",
            "Wedding choice|One-time financial impact"
          ]
        },
        "page": 22,
        "note": "",
        "heading": "At 27 / At 30"
      },
      {
        "title": "At 32 and 33: plan for children",
        "body": "The game adds ongoing child-related costs, then asks whether you will contribute to an RESP.",
        "points": [
          "Family decisions bring care, time, and financial responsibilities.",
          "Education contributions belong in the household plan.",
          "In real life, RESP savings remain an asset; the game uses simplified cash-flow deductions."
        ],
        "visual": {
          "kind": "steps",
          "labels": [
            "Family needs",
            "Education savings",
            "Household plan"
          ]
        },
        "page": 23,
        "note": "",
        "heading": "At 32 / At 33"
      },
      {
        "title": "At 37: a housing decision",
        "body": "The game compares down-payment choices, mortgage outflows, and renting. It invites you to think about long-term commitments.",
        "points": [
          "Upfront savings and monthly obligations both matter.",
          "Buying involves equity, financing, and ownership costs.",
          "Renting can be an appropriate choice for your circumstances."
        ],
        "visual": {
          "kind": "house",
          "labels": [
            "Upfront savings",
            "Monthly obligations",
            "Long-term flexibility"
          ]
        },
        "page": 23,
        "note": "This is a teaching game, not a rent-versus-buy model or a net-worth forecast.",
        "heading": "At 37 You Decide"
      },
      {
        "title": "Snakes, ladders, and financial habits",
        "body": "The second game turns financial events into ladders that help and snakes that hold you back.",
        "points": [
          "Discuss why a label appears on a snake or ladder.",
          "Ask whether circumstances could change that judgment.",
          "Teach the reasoning, rather than memorize the labels."
        ],
        "visual": {
          "kind": "ladder",
          "labels": [
            "Learn a skill",
            "Avoid expensive debt",
            "Build consistent habits"
          ]
        },
        "page": 26,
        "note": "",
        "heading": "Snake and Ladders Game With Financial Touch"
      },
      {
        "title": "Play, learn, then play again",
        "body": "The author suggests playing before reading and again afterward. The useful result is a change in how you think.",
        "points": [
          "Record one choice and the reason behind it.",
          "Revisit it after later modules.",
          "Notice what changed in your reasoning, even if chance changes the score."
        ],
        "visual": {
          "kind": "cycle",
          "labels": [
            "Play",
            "Reflect",
            "Learn",
            "Replay"
          ]
        },
        "page": 8,
        "note": "A higher score alone does not prove a better real-world financial plan.",
        "heading": "How To Best Use This Book"
      }
    ],
    "activities": [
      {
        "type": "tool",
        "title": "Play the Financial Life game",
        "prompt": "Play once now. Record a decision you found difficult, then revisit it after the course. The digital game uses the manuscript’s fixed amounts and choices. Its rules panel explains the annual timing conventions.",
        "href": "../games/financial-life.html",
        "label": "Open Financial Life",
        "origin": "From the book"
      },
      {
        "type": "tool",
        "title": "Try financial Snakes & Ladders",
        "prompt": "Identify one snake and one ladder relevant to your life. Think about whether their labels fit your circumstances.",
        "href": "../games/snakes-and-ladders.html",
        "label": "Open Snakes & Ladders",
        "origin": "From the book"
      },
      {
        "type": "reflection",
        "title": "Your before-and-after decision",
        "prompts": [
          "Which decision did you make, and why?",
          "What was outside your control?",
          "After the course, what would you do differently?"
        ],
        "origin": "From the book",
        "tip": ""
      },
      {
        "type": "quiz",
        "title": "Chance or choice?",
        "prompt": "You cannot choose the job market, but you can compare affordable transport. What does this illustrate?",
        "options": [
          "Every outcome is entirely your responsibility.",
          "Circumstances and responses both influence the journey.",
          "A high game score guarantees wealth."
        ],
        "answer": 1,
        "feedback": "The game separates chance from decisions. You can make intentional choices while recognizing real constraints.",
        "origin": "Additional practice"
      },
      {
        "type": "reflection",
        "title": "A conversation worth having",
        "prompts": [
          "Choose a financial habit to discuss with a partner, friend, or family member.",
          "What question could you ask without blaming or judging?"
        ],
        "origin": "Additional practice",
        "tip": ""
      }
    ],
    "action": "Record one decision to revisit after you finish the course.",
    "resources": []
  },
  {
    "id": 2,
    "stage": "Understand",
    "title": "Put the horse before the cart",
    "summary": "Change the sequence of spending. See the full cost, then find your financial direction.",
    "page": 29,
    "slides": [
      {
        "title": "The order changes the journey",
        "body": "In the opening story, the horse struggles behind the cart. Moving it in front makes progress easier.",
        "points": [
          "Financial effort can be undermined by the order of decisions.",
          "Earning and saving before spending can reduce financing costs.",
          "Changing the sequence takes work—but it can change what follows."
        ],
        "visual": {
          "kind": "horse",
          "labels": [
            "Earn",
            "Save",
            "Buy"
          ]
        },
        "page": 29,
        "note": "",
        "heading": "Horse and Cart Story"
      },
      {
        "title": "Pay yourself before you buy",
        "body": "The car example replaces repeated financing with a used car and a savings account for future purchases.",
        "points": [
          "Start with a workable, affordable alternative.",
          "Make regular virtual car payments to yourself.",
          "Buy upfront when you have the savings, then keep saving for replacement."
        ],
        "visual": {
          "kind": "split",
          "labels": [
            "Finance first|Buy → Payments → Replace",
            "Prepare first|Used car → Save → Buy upfront"
          ]
        },
        "page": 30,
        "note": "A used car must still be safe and suitable; upfront buying is not immediately possible for everyone.",
        "heading": "Pay yourself before you buy"
      },
      {
        "title": "Poverty charges interest",
        "body": "When cash is scarce, installments and delayed repairs can make essentials more expensive. This is a constraint, not a character flaw.",
        "points": [
          "An annual insurance payment may cost less than installments.",
          "Delaying a small repair can create a larger expense.",
          "Small financial buffers can make lower-cost choices possible."
        ],
        "visual": {
          "kind": "cycle",
          "labels": [
            "Cash pressure",
            "Extra costs",
            "Less flexibility",
            "More pressure"
          ]
        },
        "page": 31,
        "note": "",
        "heading": "Poverty Charges Interest"
      },
      {
        "title": "Home sweet home—with the whole picture",
        "body": "The book connects homeownership with building equity and reducing financing costs through permitted prepayments.",
        "points": [
          "Principal repaid can increase equity; financing costs do not.",
          "Include taxes, insurance, upkeep, and transaction costs.",
          "Property values can fall, and flexibility has value."
        ],
        "visual": {
          "kind": "house",
          "labels": [
            "Principal → Equity",
            "Financing → Cost",
            "Upkeep → Cost"
          ]
        },
        "page": 32,
        "note": "Homeownership is not automatically better than renting.",
        "heading": "Home Sweet Home"
      },
      {
        "title": "Put your finances in a workable order",
        "body": "If buying upfront is not yet possible, begin by creating breathing room rather than forcing a major purchase.",
        "points": [
          "Know your essential obligations.",
          "Reduce avoidable costs where practical.",
          "Build savings before taking on new commitments."
        ],
        "visual": {
          "kind": "steps",
          "labels": [
            "Understand obligations",
            "Create surplus",
            "Build options"
          ]
        },
        "page": 32,
        "note": "",
        "heading": "How To Put The Cart behind the Horse"
      },
      {
        "title": "The price tag is only one view",
        "body": "A purchase also uses working time and money that has already passed through taxes and payroll deductions.",
        "points": [
          "Compare the price with your take-home hourly earnings.",
          "Estimate gross earnings needed using an explicit deduction assumption.",
          "Ask whether the value is worth the time exchanged."
        ],
        "visual": {
          "kind": "equation",
          "labels": [
            "Spend $100",
            "Keep 75% of gross",
            "Earn about $133"
          ]
        },
        "page": 33,
        "note": "Illustration uses a flat 25% deduction assumption, not a Canadian tax calculation.",
        "heading": "Understanding Actual Costs"
      },
      {
        "title": "Find your financial direction",
        "body": "The book uses a spiral to describe how regular surpluses or shortfalls can reinforce themselves.",
        "points": [
          "Monthly income − monthly expenses = monthly cash-flow surplus.",
          "A surplus creates room to save, repay debt, or invest.",
          "A shortfall signals a need to examine income, obligations, or support."
        ],
        "visual": {
          "kind": "spiral",
          "labels": [
            "Income",
            "− Expenses",
            "= Direction"
          ]
        },
        "page": 33,
        "note": "Positive cash flow is useful, but does not alone measure changes in net worth.",
        "heading": "Upward Vs Downward Spiral"
      },
      {
        "title": "Cash flow and net worth are different",
        "body": "A household can have positive cash flow and still hold debt. A large asset balance does not necessarily pay this month’s bills.",
        "points": [
          "Net worth = assets − debts.",
          "Cash flow measures money coming in and going out over a period.",
          "Use both views when making a decision."
        ],
        "visual": {
          "kind": "split",
          "labels": [
            "Cash flow|Income − expenses",
            "Net worth|Assets − debt"
          ]
        },
        "page": 33,
        "note": "",
        "heading": "Cash flow and net worth are different"
      },
      {
        "title": "Your first milestone: a consistent surplus",
        "body": "The chapter’s first milestone is spending less than you earn and sustaining it.",
        "points": [
          "Begin with an actual month, not a guessed budget.",
          "Choose a change you can repeat.",
          "Review the result and adjust."
        ],
        "visual": {
          "kind": "steps",
          "labels": [
            "Measure a month",
            "Make one change",
            "Repeat and review"
          ]
        },
        "page": 35,
        "note": "",
        "heading": "Milestone #1"
      }
    ],
    "activities": [
      {
        "type": "calculator",
        "title": "Which direction are you moving?",
        "kind": "cashflow",
        "prompt": "Enter monthly take-home income and monthly cash outflows. Use the same month for both.",
        "origin": "From the book"
      },
      {
        "type": "tool",
        "title": "Explore the Money Spiral",
        "prompt": "Try the book’s income-minus-expenses activity, then identify what could change the result.",
        "href": "../activities/money-spiral.html",
        "label": "Open Money Spiral",
        "origin": "From the book"
      },
      {
        "type": "quiz",
        "title": "Put the sequence in order",
        "prompt": "Which sequence matches the horse-and-cart lesson?",
        "options": [
          "Buy now → borrow more → hope income rises",
          "Earn → save → buy upfront when practical",
          "Ignore essential bills → buy upfront immediately"
        ],
        "answer": 1,
        "feedback": "The lesson is preparation before discretionary spending. Essential needs and real constraints still matter.",
        "origin": "From the book"
      },
      {
        "type": "calculator",
        "title": "What does a purchase cost in working time?",
        "kind": "cost",
        "prompt": "Use an all-in purchase price, a flat deduction estimate, and your gross hourly wage. This is a simplified planning exercise.",
        "origin": "Additional practice"
      },
      {
        "type": "reflection",
        "title": "Change one sequence",
        "prompts": [
          "Which recurring purchase could you save for before replacing it?",
          "What affordable alternative would work while you save?",
          "How much could you set aside, and how will you review progress?"
        ],
        "origin": "Additional practice",
        "tip": ""
      }
    ],
    "action": "Choose one spending sequence to change, and set a review date.",
    "resources": []
  },
  {
    "id": 3,
    "stage": "Save",
    "title": "Find and fix the leakages",
    "summary": "Work through the book’s four saving pillars, from statement audits to practical everyday habits.",
    "page": 38,
    "slides": [
      {
        "title": "You cannot fill a leaky bucket",
        "body": "More income helps. Keeping more of what you earn also changes how much stability you can build.",
        "points": [
          "Audit before making assumptions.",
          "Look for recurring costs as well as small daily habits.",
          "Lower essential expenses can reduce the reserve needed for emergencies."
        ],
        "visual": {
          "kind": "bucket",
          "labels": [
            "Income in",
            "Leaks out",
            "Savings retained"
          ]
        },
        "page": 38,
        "note": "",
        "heading": "You cannot fill a leaky bucket"
      },
      {
        "title": "Four ways to keep more",
        "body": "The author organizes saving into four pillars. Use them as a repeatable review, not a one-time austerity challenge.",
        "points": [
          "Remove leakages and reduce the cost of living.",
          "Use government, employer, and corporate benefits you qualify for.",
          "Develop habits that make affordable choices easier."
        ],
        "visual": {
          "kind": "grid",
          "labels": [
            "Remove leakages",
            "Reduce living costs",
            "Use available support",
            "Change mindset"
          ]
        },
        "page": 39,
        "note": "",
        "heading": "Four ways to keep more"
      },
      {
        "title": "Audit an actual month",
        "body": "Bank tools or a spreadsheet can reveal spending patterns you do not notice day to day.",
        "points": [
          "Download or review a full month of transactions.",
          "Categorize spending and total the categories.",
          "Identify a change that saves money without undermining essential needs."
        ],
        "visual": {
          "kind": "steps",
          "labels": [
            "Collect",
            "Categorize",
            "Compare",
            "Choose"
          ]
        },
        "page": 39,
        "note": "",
        "heading": "Spending Audit"
      },
      {
        "title": "Check what you were actually charged",
        "body": "The book describes unwanted fees, billing mistakes, and charges for services no longer used.",
        "points": [
          "Compare statements with agreements and receipts.",
          "Investigate unfamiliar charges through the provider or bank.",
          "Follow up until a correction or cancellation is confirmed."
        ],
        "visual": {
          "kind": "grid",
          "labels": [
            "Bank fees",
            "Old memberships",
            "Billing errors",
            "Unwanted subscriptions"
          ]
        },
        "page": 40,
        "note": "",
        "heading": "Beware of Incorrect or Unauthorized Charges"
      },
      {
        "title": "Rewards are useful only after costs",
        "body": "Cash back does not cancel interest, annual fees, missed payments, or spending you would not otherwise make.",
        "points": [
          "Pay statements in full when using credit for rewards.",
          "Check category definitions and fees.",
          "Set payment reminders or suitable autopay; keep sufficient funds."
        ],
        "visual": {
          "kind": "split",
          "labels": [
            "Benefit|Cash back on planned spending",
            "Cost|Interest, fees, overspending"
          ]
        },
        "page": 41,
        "note": "",
        "heading": "Credit Cards"
      },
      {
        "title": "Reduce usage—or reduce the rate",
        "body": "A leaking toilet and a costly plan are different problems. One needs a repair; the other needs a price comparison.",
        "points": [
          "Repair when it is safer and cheaper than replacement.",
          "Check for avoidable water, power, or heating waste.",
          "Ask about rates and practical autopayment discounts."
        ],
        "visual": {
          "kind": "split",
          "labels": [
            "Consumption|Repair leaks; reduce waste",
            "Price|Compare plans; ask for discounts"
          ]
        },
        "page": 42,
        "note": "",
        "heading": "Repair / Utility Bills / Autopayment Discounts"
      },
      {
        "title": "Price-match and buy new only when needed",
        "body": "The author compares ride-share prices, phone plans, banking fees, and suitable second-hand goods.",
        "points": [
          "Compare the total price and terms, not the headline discount.",
          "Used goods should still be safe, useful, and fit for purpose.",
          "A bargain you do not need is still spending."
        ],
        "visual": {
          "kind": "steps",
          "labels": [
            "Need",
            "Compare",
            "Check quality",
            "Buy deliberately"
          ]
        },
        "page": 43,
        "note": "",
        "heading": "Price Matching / Buy New Only When Necessary"
      },
      {
        "title": "No car, no cry? Compare your reality",
        "body": "The author’s transit-based lifestyle worked for his circumstances. Transport must also work for employment, care, weather, and accessibility.",
        "points": [
          "Include purchase or financing, fuel, insurance, parking, and maintenance.",
          "Recognize depreciation, time, and alternative uses of money.",
          "Compare a realistic transit or ride-share alternative."
        ],
        "visual": {
          "kind": "grid",
          "labels": [
            "Vehicle & financing",
            "Running costs",
            "Time & depreciation",
            "Practical alternatives"
          ]
        },
        "page": 44,
        "note": "Do not add both full purchase price and depreciation in the same economic-cost estimate.",
        "heading": "No Car, No Cry / Actual Vs Perceived Cost Of Owning A Vehicle"
      },
      {
        "title": "Know your grocery baseline",
        "body": "Online comparison, the right store, and familiar unit prices help distinguish a real saving from a promotion.",
        "points": [
          "Compare delivery fees and markups as well as shelf prices.",
          "Buy non-perishables in bulk only when useful and cheaper per unit.",
          "Shop deliberately; avoid hunger-driven or promotional impulse buys."
        ],
        "visual": {
          "kind": "steps",
          "labels": [
            "Unit price",
            "Total basket",
            "Fees",
            "Actual need"
          ]
        },
        "page": 46,
        "note": "",
        "heading": "Ordering Grocery Online / Right Produce and Shopping Chain"
      },
      {
        "title": "Use benefits you are entitled to",
        "body": "The author describes newcomer offers, disability support, children’s vision programs, recyclables, and professional memberships.",
        "points": [
          "Check eligibility and current terms with the program provider.",
          "Ask employers and associations about available benefits.",
          "Use legitimate referral or welcome offers without unnecessary purchases."
        ],
        "visual": {
          "kind": "grid",
          "labels": [
            "Public programs",
            "Employer benefits",
            "Membership discounts",
            "Refunds & offers"
          ]
        },
        "page": 47,
        "note": "",
        "heading": "Recyclables / Referral Bonuses / Newbie Benefits / Disability Benefits / Free Glasses / Corporate Rewards"
      },
      {
        "title": "Your task is to ask",
        "body": "An entitlement, correction, or lower rate may require a request. The book includes missed pay and negotiated discounts.",
        "points": [
          "Check pay statements and agreements.",
          "Ask a specific question with supporting information.",
          "Keep a record and follow up politely."
        ],
        "visual": {
          "kind": "steps",
          "labels": [
            "Check evidence",
            "Ask clearly",
            "Follow up"
          ]
        },
        "page": 50,
        "note": "",
        "heading": "Your Task Is To Ask"
      },
      {
        "title": "Tax timing can change cash flow",
        "body": "The author explored having less tax withheld when eligible deductions or credits were expected.",
        "points": [
          "This changes when money arrives, not necessarily the total tax due.",
          "Use the proper employer forms or CRA authorization where required.",
          "Organize eligible medical, donation, moving, and professional-fee records."
        ],
        "visual": {
          "kind": "split",
          "labels": [
            "During the year|Appropriate withholding",
            "At filing time|Reconcile actual tax"
          ]
        },
        "page": 51,
        "note": "Eligibility and documentation matter. Seek qualified help for your own situation.",
        "heading": "Less Tax Deduction At Paycheque"
      },
      {
        "title": "Find support and use what you already have",
        "body": "Municipal transit and recreation programs, employer health benefits, and cheaper internet can make essentials more accessible.",
        "points": [
          "Check local low-income programs without shame.",
          "Review insurance and health spending accounts before benefits expire.",
          "Ask whether a visit can be upgraded economically to an annual membership."
        ],
        "visual": {
          "kind": "grid",
          "labels": [
            "Transit & recreation",
            "Internet programs",
            "Health benefits",
            "Membership value"
          ]
        },
        "page": 52,
        "note": "",
        "heading": "Low-Income Benefits / Health Spending Account / Convert A Visit To A Yearly Membership"
      },
      {
        "title": "Keep promotions in their place",
        "body": "Coupons, rewards, off-season purchases, and stacked offers can help with things you already intended to buy.",
        "points": [
          "Track expiry dates and redemption conditions.",
          "Compare net cost, including fees and minimum spending.",
          "Avoid buying extra just to earn points."
        ],
        "visual": {
          "kind": "cycle",
          "labels": [
            "Planned need",
            "Compare offers",
            "Check conditions",
            "Use before expiry"
          ]
        },
        "page": 53,
        "note": "",
        "heading": "Hunting For Promotions / Coupon Books and Reward Cards"
      },
      {
        "title": "Make frugality easier to practice",
        "body": "Supportive communities, self-confidence, and minimalism can reduce the pressure to look wealthy.",
        "points": [
          "Choose useful, comfortable things over status spending.",
          "Follow information that supports your goals.",
          "Set maximum prices and be willing to wait or choose an alternative."
        ],
        "visual": {
          "kind": "grid",
          "labels": [
            "Useful over flashy",
            "Supportive information",
            "Price limits",
            "Patient decisions"
          ]
        },
        "page": 54,
        "note": "The book’s “digital twin” pricing idea is a hypothesis; a frugal habit does not guarantee an algorithmic discount.",
        "heading": "Like-Minded People / Spirituality and Minimalism / Frugal Digital Twin"
      },
      {
        "title": "Think annually",
        "body": "A small daily or monthly amount can become a substantial yearly obligation.",
        "points": [
          "Daily amount × days used = annual spending.",
          "Monthly amount × 12 = annual spending.",
          "Compare the annual benefit of a realistic replacement habit."
        ],
        "visual": {
          "kind": "bars",
          "labels": [
            "$5 / day|5",
            "$150 / 30 days|150",
            "$1,825 / 365 days|1825"
          ]
        },
        "page": 55,
        "note": "Illustration assumes a $5 purchase every day for 365 days.",
        "heading": "Think Annually"
      }
    ],
    "activities": [
      {
        "type": "reflection",
        "title": "Your biggest expense",
        "prompts": [
          "What is your largest monthly expense?",
          "Which of the four pillars could help you reduce it?",
          "What is an easy saving you can realistically keep?"
        ],
        "origin": "From the book",
        "tip": ""
      },
      {
        "type": "calculator",
        "title": "Turn a habit into a yearly number",
        "kind": "annualize",
        "prompt": "Compare a recurring cost with an affordable replacement. Use the same frequency for both.",
        "origin": "From the book"
      },
      {
        "type": "calculator",
        "title": "Measure your new savings",
        "kind": "savings",
        "prompt": "Estimate the monthly changes you identified. Avoid counting the same saving in more than one category.",
        "origin": "From the book"
      },
      {
        "type": "reflection",
        "title": "One-month leakage audit",
        "prompts": [
          "List one charge to investigate and one subscription to review.",
          "Name one benefit or discount to check, including its provider.",
          "What evidence will tell you the saving really happened?"
        ],
        "origin": "Additional practice",
        "tip": ""
      },
      {
        "type": "quiz",
        "title": "A reward or an expensive detour?",
        "prompt": "You buy $200 of things you do not need to receive $20 in rewards. What is the clearest conclusion?",
        "options": [
          "You made $20.",
          "The reward does not make the unnecessary purchase a saving.",
          "More points always means a better financial decision."
        ],
        "answer": 1,
        "feedback": "A discount improves a purchase you already need. It does not convert unnecessary spending into savings.",
        "origin": "Additional practice"
      },
      {
        "type": "checklist",
        "title": "Put the closing checklist to work",
        "origin": "From the book · Closing checklist",
        "prompt": "Tick what you have actually reviewed. Leave unfinished items as your next steps; this is a personal checklist, not a score.",
        "items": [
          "Review a full month of bank and credit-card transactions.",
          "Categorize spending and identify the biggest expenses.",
          "Check incorrect charges and unwanted subscriptions.",
          "Review credit-card repayment and automatic-payment arrangements.",
          "Compare banking, phone, utility, and insurance costs.",
          "Check avoidable utility waste and repair opportunities.",
          "Compare the total cost of transport alternatives.",
          "Check unit prices and useful bulk or second-hand purchases.",
          "Check government, disability, newcomer, or local support eligibility.",
          "Review employer insurance and health spending benefits.",
          "Organize relevant tax records and receipts.",
          "Use planned-purchase promotions, coupons, and rewards deliberately.",
          "Convert a daily or monthly habit into an annual cost.",
          "Choose utility and comfort over status spending.",
          "Measure actual savings after making a change.",
          "Write three specific actions and a review date."
        ]
      },
      {
        "type": "reflection",
        "title": "Your top three actions",
        "prompts": [
          "Action 1: one specific change and a date.",
          "Action 2: one specific change and a date.",
          "Action 3: one specific change and a date."
        ],
        "origin": "From the book · Closing checklist",
        "tip": ""
      }
    ],
    "action": "Implement one audited saving and check the actual result next month.",
    "resources": [
      {
        "label": "Edmonton Leisure Access Program",
        "href": "https://www.edmonton.ca/programs_services/leisure-access-program"
      },
      {
        "label": "CRA: reducing tax deductions at source (T1213)",
        "href": "https://www.canada.ca/en/revenue-agency/services/forms-publications/forms/t1213.html"
      }
    ]
  },
  {
    "id": 4,
    "stage": "Build resilience",
    "title": "Build an emergency system",
    "summary": "Prepare both accessible savings and a wider system that can absorb a financial shock.",
    "page": 59,
    "slides": [
      {
        "title": "Prepare a system that can absorb a shock",
        "body": "A job loss or major repair affects more than one account. The book broadens emergency planning beyond a cash balance.",
        "points": [
          "Reduce exposure before a shock arrives.",
          "Know what resources are accessible and dependable.",
          "Keep liquid savings as part of the system."
        ],
        "visual": {
          "kind": "shield",
          "labels": [
            "Lower obligations",
            "Accessible savings",
            "Contingent support"
          ]
        },
        "page": 59,
        "note": "",
        "heading": "Emergency System"
      },
      {
        "title": "Five pillars, different levels of certainty",
        "body": "The pillars are complementary. They are not interchangeable pots of cash.",
        "points": [
          "Lower recurring obligations; identify alternative cash flows.",
          "Keep a modest highly liquid reserve; build social support.",
          "Understand credit or interest-free resources cautiously."
        ],
        "visual": {
          "kind": "grid",
          "labels": [
            "Reduce obligations",
            "Alternative cash flow",
            "Liquid reserve",
            "Social equity",
            "Careful credit use"
          ]
        },
        "page": 60,
        "note": "",
        "heading": "Five pillars, different levels of certainty"
      },
      {
        "title": "Reduce dependency on the reserve",
        "body": "The author pays selected bills annually and keeps useful non-perishables to reduce future obligations.",
        "points": [
          "Compare annual and installment costs.",
          "Protect liquidity before locking money into prepayments.",
          "Remember that property taxes, upkeep, and food needs continue."
        ],
        "visual": {
          "kind": "split",
          "labels": [
            "Prepaid obligations|Fewer future bills",
            "Liquid cash|Money available for a new shock"
          ]
        },
        "page": 60,
        "note": "A prepaid bill is not cash you can withdraw for an unrelated emergency.",
        "heading": "Reducing Dependency On Emergency Fund"
      },
      {
        "title": "Know your alternative cash flow",
        "body": "Employment Insurance and income-tested benefits can help eligible households, but amount and timing depend on rules.",
        "points": [
          "Check EI eligibility, waiting periods, and application steps.",
          "Estimate confirmed benefits separately from hoped-for benefits.",
          "Do not assume benefit increases arrive immediately after an income change."
        ],
        "visual": {
          "kind": "steps",
          "labels": [
            "Eligibility",
            "Amount",
            "Timing",
            "Application"
          ]
        },
        "page": 61,
        "note": "",
        "heading": "Ensuring Alternative Cash Flow"
      },
      {
        "title": "Liquid means you can use it",
        "body": "The author retains a modest liquid reserve alongside other defenses. A falling or locked investment may not be available when needed.",
        "points": [
          "Base planning on essential spending and your circumstances.",
          "Choose accessibility and reliability for emergency money.",
          "Revisit the target when obligations or dependants change."
        ],
        "visual": {
          "kind": "bars",
          "labels": [
            "1 month|1",
            "3 months|3",
            "6 months|6"
          ]
        },
        "page": 62,
        "note": "The author discusses three to six months in his case; this is not a universal target.",
        "heading": "Modest Highly Liquid Emergency Fund"
      },
      {
        "title": "Social equity has value—and limits",
        "body": "Friends, family, and community can offer a ride, a place to stay, practical help, or sometimes money.",
        "points": [
          "Nurture relationships through mutual care.",
          "Ask what support is realistically available.",
          "Treat unconfirmed help as uncertain, not guaranteed funding."
        ],
        "visual": {
          "kind": "network",
          "labels": [
            "Family",
            "Friends",
            "Community",
            "You"
          ]
        },
        "page": 62,
        "note": "",
        "heading": "Social Equity"
      },
      {
        "title": "A grace period is not free emergency money",
        "body": "The author describes timing purchases around statement cycles. This depends on card terms and disciplined full repayment.",
        "points": [
          "Know the statement date, due date, and grace-period rules.",
          "Carrying a balance can remove advantages and add expensive interest.",
          "Credit availability does not replace a liquid reserve."
        ],
        "visual": {
          "kind": "path",
          "labels": [
            "Purchase",
            "Statement",
            "Due date",
            "Repay in full"
          ]
        },
        "page": 63,
        "note": "No fixed number of interest-free days is promised for every card or purchase.",
        "heading": "Credit Cards As A Buffer"
      },
      {
        "title": "Read the promotion’s fine print",
        "body": "An interest-free purchase can become expensive if a deferred-interest condition is missed.",
        "points": [
          "Check whether interest is waived or merely deferred.",
          "Confirm the exact balance and repayment deadline.",
          "Have a funded repayment plan; avoid relying on uncertain future income."
        ],
        "visual": {
          "kind": "steps",
          "labels": [
            "Terms",
            "Deadline",
            "Funds",
            "Full repayment"
          ]
        },
        "page": 63,
        "note": "",
        "heading": "Identify Interest-Free Resources"
      },
      {
        "title": "Rehearse a job-loss month",
        "body": "A plan becomes more useful when you walk through what you would actually pay, receive, and do.",
        "points": [
          "Separate accessible savings from prepaid bills and credit.",
          "Map application steps and expected delays.",
          "Choose a weak point to strengthen now."
        ],
        "visual": {
          "kind": "split",
          "labels": [
            "Available now|Liquid cash and confirmed support",
            "Conditional later|Eligibility, timing, credit access"
          ]
        },
        "page": 64,
        "note": "",
        "heading": "Activity: Your Emergency Plan"
      }
    ],
    "activities": [
      {
        "type": "calculator",
        "title": "Estimate a liquid reserve",
        "kind": "emergency",
        "prompt": "Enter remaining essential monthly expenses after any prepaid obligations, and a planning duration. This is an estimate, not a personal recommendation.",
        "origin": "From the book"
      },
      {
        "type": "reflection",
        "title": "Build your five-pillar map",
        "prompts": [
          "Which recurring bill could be reduced or paid annually more cheaply?",
          "Which cash flows are confirmed, and which need eligibility checks?",
          "What liquid savings and practical social support are available?",
          "For any credit resource, what are the risks and the repayment plan?"
        ],
        "origin": "From the book",
        "tip": ""
      },
      {
        "type": "quiz",
        "title": "Cash or contingent resource?",
        "prompt": "You have $2,000 of accessible savings, a prepaid phone plan, and a $5,000 credit limit. How much of this is liquid savings?",
        "options": [
          "$7,000 plus the phone plan",
          "$2,000",
          "$5,000"
        ],
        "answer": 1,
        "feedback": "The prepaid plan reduces a future obligation. Credit is borrowing. Neither is liquid savings.",
        "origin": "Additional practice"
      },
      {
        "type": "reflection",
        "title": "Rehearse the first 30 days",
        "prompts": [
          "If your income stopped today, which bills would still arrive?",
          "What could you pay immediately without borrowing?",
          "Which applications or conversations would you start this week?"
        ],
        "origin": "Additional practice",
        "tip": ""
      },
      {
        "type": "quiz",
        "title": "Spot deferred interest",
        "prompt": "An offer says 0% for six months, but interest from purchase date applies if the balance is not fully paid. What should you check?",
        "options": [
          "Only the monthly minimum",
          "The full-payoff deadline, deferred-interest terms, and available repayment funds",
          "Whether the purchase earns reward points"
        ],
        "answer": 1,
        "feedback": "Minimum payments may leave a balance at the deadline. A safe plan accounts for the full terms, timing, and repayment funds.",
        "origin": "Additional practice"
      }
    ],
    "action": "Strengthen one dependable part of your emergency system this week.",
    "resources": [
      {
        "label": "Government of Canada: EI regular benefits",
        "href": "https://www.canada.ca/en/services/benefits/ei/ei-regular-benefit.html"
      }
    ]
  },
  {
    "id": 5,
    "stage": "Preserve",
    "title": "Protect what you build",
    "summary": "Recognize wealth-eroding risks and use the Sink vs. Tap lens without losing sight of human value.",
    "page": 66,
    "slides": [
      {
        "title": "Saving is only part of the job",
        "body": "Once you create a surplus, protect it from forces that can gradually—or suddenly—undo progress.",
        "points": [
          "Watch inflation, depreciation, and recurring financial drains.",
          "Recognize scams, lifestyle creep, and speculative temptation.",
          "Choose purchases with a clear purpose."
        ],
        "visual": {
          "kind": "shield",
          "labels": [
            "Inflation",
            "Scams",
            "Lifestyle creep",
            "Speculation"
          ]
        },
        "page": 66,
        "note": "",
        "heading": "Wealth Preservation"
      },
      {
        "title": "Inflation and depreciation are different",
        "body": "Inflation reduces purchasing power. Depreciation reduces an asset’s value. Either can matter even when the dollar balance looks unchanged.",
        "points": [
          "Cash buys less when prices rise.",
          "A vehicle may lose resale value while also providing useful transport.",
          "Consider purpose, liquidity, and risk—not one label alone."
        ],
        "visual": {
          "kind": "split",
          "labels": [
            "Inflation|Same dollars, less purchasing power",
            "Depreciation|Asset resale value may fall"
          ]
        },
        "page": 66,
        "note": "",
        "heading": "Inflation And Asset Depreciation"
      },
      {
        "title": "Scams borrow the appearance of trust",
        "body": "The book describes fake endorsements, AI-generated videos, and promises of unusually high returns.",
        "points": [
          "Pause when urgency or guaranteed high returns appear.",
          "Verify a provider through independent official channels.",
          "Never use a video endorsement as proof that an investment is legitimate."
        ],
        "visual": {
          "kind": "steps",
          "labels": [
            "Pause",
            "Verify independently",
            "Protect access",
            "Get help"
          ]
        },
        "page": 66,
        "note": "",
        "heading": "Scams, Ponzi Schemes"
      },
      {
        "title": "Let income grow faster than lifestyle",
        "body": "A pay rise can improve life while still preserving room to save. Decide on the saving habit before spending expands.",
        "points": [
          "Set a deliberate allocation for extra income.",
          "Compare savings in dollars and as a share of income.",
          "Review recurring commitments before adding new ones."
        ],
        "visual": {
          "kind": "bars",
          "labels": [
            "$50k income: save $10k|10000",
            "$100k income: save $20k|20000"
          ]
        },
        "page": 67,
        "note": "Book illustration: both examples retain a 20% savings rate.",
        "heading": "Lifestyle Creep"
      },
      {
        "title": "Slow progress can be durable progress",
        "body": "The author favors skills and consistency over gambling, greed, or the promise of a sudden fortune.",
        "points": [
          "Distinguish a plan from a bet on a lucky outcome.",
          "Question returns that appear too good to be true.",
          "Protect the habits that helped you build the money."
        ],
        "visual": {
          "kind": "ladder",
          "labels": [
            "Financial skills",
            "Consistent saving",
            "Deliberate growth"
          ]
        },
        "page": 67,
        "note": "",
        "heading": "Gambling / Speculation / Greed"
      },
      {
        "title": "Location changes what money can do",
        "body": "A salary, living cost, and currency are meaningful together. The author reflects on Turkish earnings and Canadian life.",
        "points": [
          "Compare take-home earnings with local living costs.",
          "Consider currency exposure and purchasing power.",
          "Include family, career, and quality of life in a move."
        ],
        "visual": {
          "kind": "grid",
          "labels": [
            "Income",
            "Living costs",
            "Currency",
            "Quality of life"
          ]
        },
        "page": 68,
        "note": "",
        "heading": "Location Location Location"
      },
      {
        "title": "A home can hold wealth—and concentrate risk",
        "body": "The author views home equity as a saving discipline and is personally cautious about borrowing against it.",
        "points": [
          "Equity can be difficult to access quickly.",
          "Property values and ownership costs can change.",
          "A HELOC creates debt; it does not turn equity into free income."
        ],
        "visual": {
          "kind": "house",
          "labels": [
            "Equity",
            "Ongoing costs",
            "Limited liquidity"
          ]
        },
        "page": 68,
        "note": "This is the author’s perspective, not a universal housing or borrowing rule.",
        "heading": "House As A Wealth Preservation Tool"
      },
      {
        "title": "Sink vs. Tap: examine the outcomes",
        "body": "The book suggests two columns: outcomes that take money out and outcomes that bring money back.",
        "points": [
          "A single purchase can have both types of outcome.",
          "List ongoing costs and potential financial benefits.",
          "Investigate amounts, timing, and uncertainty before drawing a conclusion."
        ],
        "visual": {
          "kind": "split",
          "labels": [
            "Sink|Costs, fees, upkeep",
            "Tap|Income or financial benefit"
          ]
        },
        "page": 68,
        "note": "Counting labels does not measure the financial size of each outcome.",
        "heading": "Sink vs. Tap"
      },
      {
        "title": "Financial productivity is not all value",
        "body": "The book explicitly makes space for spending that creates a greater good even when it is not financially productive.",
        "points": [
          "Health, care, art, family, and community can create value.",
          "Separate a financial assessment from a judgment of human worth.",
          "Choose consciously rather than expecting every purchase to earn money."
        ],
        "visual": {
          "kind": "grid",
          "labels": [
            "Financial effects",
            "Personal usefulness",
            "Care & wellbeing",
            "Social contribution"
          ]
        },
        "page": 69,
        "note": "",
        "heading": "Financial productivity is not all value"
      },
      {
        "title": "Three cases, better questions",
        "body": "The chapter asks about a specialist degree, a luxury car, and buying versus renting. Context makes the exercise useful.",
        "points": [
          "A degree: what opportunities, costs, and personal purpose?",
          "A car: what practical value versus financing and running costs?",
          "A home: what total costs, risks, equity, and flexibility?"
        ],
        "visual": {
          "kind": "steps",
          "labels": [
            "List outcomes",
            "Estimate scale",
            "Examine context"
          ]
        },
        "page": 70,
        "note": "",
        "heading": "Activity: Sink or Tap"
      }
    ],
    "activities": [
      {
        "type": "tool",
        "title": "Try the book’s three cases",
        "prompt": "Use the Sink vs. Tap activity to list financial outcomes. Also record a non-financial benefit where relevant.",
        "href": "../activities/sink-vs-tap.html",
        "label": "Open Sink vs. Tap",
        "origin": "From the book"
      },
      {
        "type": "reflection",
        "title": "Analyze a purchase in your life",
        "prompts": [
          "What are the money-taking outcomes, including ongoing costs?",
          "What are the potential money-producing outcomes, and how certain are they?",
          "What personal or social value falls outside the money columns?",
          "What would you need to know before deciding?"
        ],
        "origin": "From the book",
        "tip": ""
      },
      {
        "type": "quiz",
        "title": "Too good to be true?",
        "prompt": "A video of a famous person promises guaranteed 30% monthly returns if you transfer money today. What is the strongest first response?",
        "options": [
          "Transfer a small amount to test it.",
          "Pause and verify independently; urgency and guaranteed returns are warning signs.",
          "Trust it because the face looks real."
        ],
        "answer": 1,
        "feedback": "A familiar face can be fabricated. Independently verify the provider and seek qualified help before moving money.",
        "origin": "Additional practice"
      },
      {
        "type": "reflection",
        "title": "Plan a pay rise",
        "prompts": [
          "If income rises, what essential need would you improve?",
          "What share or amount of the increase would you direct toward a financial goal?",
          "What recurring commitment would you avoid taking on automatically?"
        ],
        "origin": "Additional practice",
        "tip": ""
      },
      {
        "type": "quiz",
        "title": "Count or compare?",
        "prompt": "A purchase has three small benefits and one very large recurring cost. What can you conclude from the count alone?",
        "options": [
          "It is a tap because three is more than one.",
          "Nothing reliable about the total financial balance without amounts and timing.",
          "Every recurring cost makes it a bad purchase."
        ],
        "answer": 1,
        "feedback": "The columns prompt investigation. Size, timing, risk, usefulness, and social value matter more than a simple count.",
        "origin": "Additional practice"
      }
    ],
    "action": "Choose one purchase or financial offer to examine more carefully.",
    "resources": []
  },
  {
    "id": 6,
    "stage": "Grow",
    "title": "Build a deliberate growth plan",
    "summary": "Connect grants, tax planning, employer contributions, registered accounts, and regular action.",
    "page": 72,
    "slides": [
      {
        "title": "Start with the system, not a hot tip",
        "body": "The author shares a personal investment-planning framework after saving, resilience, and preservation.",
        "points": [
          "Match the plan to household obligations and goals.",
          "Know the account rules before moving money.",
          "The chapter is about planning opportunities, not picking stocks."
        ],
        "visual": {
          "kind": "steps",
          "labels": [
            "Foundation",
            "Opportunities",
            "Plan",
            "Automation"
          ]
        },
        "page": 72,
        "note": "",
        "heading": "Wealth Growth"
      },
      {
        "title": "Five pillars of the author’s plan",
        "body": "Government support, tax planning, and employer contributions influence how the author allocates available savings.",
        "points": [
          "Investigate grants and optimize eligible tax deductions and benefits.",
          "Understand employer matches.",
          "Create an annual plan, then automate manageable contributions."
        ],
        "visual": {
          "kind": "grid",
          "labels": [
            "Government grants",
            "Tax & benefit planning",
            "Employer matches",
            "Annual plan",
            "Automation"
          ]
        },
        "page": 72,
        "note": "",
        "heading": "Five pillars of the author’s plan"
      },
      {
        "title": "A grant is not an investment return",
        "body": "RESP and RDSP programs may add grants or bonds under specific eligibility and contribution rules.",
        "points": [
          "Matching grants usually require eligible contributions.",
          "Eligible bonds can be available without a contribution.",
          "Unused entitlements may have catch-up rules and age limits."
        ],
        "visual": {
          "kind": "split",
          "labels": [
            "Your contribution|Money you save",
            "Eligible support|Program money under specific rules"
          ]
        },
        "page": 73,
        "note": "Matching percentages are not repeatable market returns. Verify current program rules.",
        "heading": "Maximize Available Government Grants In Investment Accounts"
      },
      {
        "title": "RESP: a contribution and a grant",
        "body": "The book illustrates the basic CESG with a $2,500 eligible contribution and a $500 grant.",
        "points": [
          "That is program support equal to 20% of the eligible contribution.",
          "Income, unused room, beneficiary age, and other eligibility rules can change what is available.",
          "A grant is separate from gains or losses in the investments inside the account."
        ],
        "visual": {
          "kind": "bars",
          "labels": [
            "Your eligible contribution|2500",
            "Illustrative basic grant|500"
          ]
        },
        "page": 73,
        "note": "Manuscript example, not a verified personal entitlement. Check current CESG limits and eligibility.",
        "heading": "RESP: a contribution and a grant"
      },
      {
        "title": "RDSP: understand the matching opportunity",
        "body": "The manuscript describes how an eligible $1,500 contribution may attract up to $3,500 in disability savings grants under applicable matching rules.",
        "points": [
          "Matching amounts depend on family income, eligibility, and entitlements.",
          "Bonds and carry-forward grants have separate rules.",
          "Understand withdrawal repayment rules before treating this money as accessible."
        ],
        "visual": {
          "kind": "bars",
          "labels": [
            "Illustrative contribution|1500",
            "Possible matching grants|3500"
          ]
        },
        "page": 74,
        "note": "A conditional book example, not a promised grant or recurring investment return.",
        "heading": "RDSP: understand the matching opportunity"
      },
      {
        "title": "Tax planning can affect benefits too",
        "body": "RRSP deductions may reduce the income used for some income-tested benefits as well as taxable income.",
        "points": [
          "Effects depend on family circumstances and contribution room.",
          "A tax refund and a later benefit increase have different timing.",
          "Use current official calculators or qualified advice."
        ],
        "visual": {
          "kind": "steps",
          "labels": [
            "Deduction",
            "Tax effect",
            "Benefit calculation",
            "Timing"
          ]
        },
        "page": 75,
        "note": "",
        "heading": "Optimize Tax Deductions And Government Benefits"
      },
      {
        "title": "Plan before the deadline rush",
        "body": "An annual plan makes room for contributions, donation records, and benefit-related decisions throughout the year.",
        "points": [
          "Check room and deadlines for each account.",
          "Organize documents and review the plan periodically.",
          "Where eligible, investigate CRA authorization to reduce tax withheld at source."
        ],
        "visual": {
          "kind": "path",
          "labels": [
            "Check rules",
            "Plan yearly",
            "Contribute regularly",
            "Review"
          ]
        },
        "page": 75,
        "note": "Form T1213 requires eligibility and documentation; it is not automatic tax relief.",
        "heading": "Tax Planning"
      },
      {
        "title": "Understand your employer’s match",
        "body": "The author values employer RRSP top-ups and payroll-based contributions.",
        "points": [
          "Ask what contribution earns the available match.",
          "Read eligibility, vesting, fees, and plan terms.",
          "Include the contribution in your overall cash-flow plan."
        ],
        "visual": {
          "kind": "split",
          "labels": [
            "You contribute|Under the workplace plan",
            "Employer adds|According to its matching terms"
          ]
        },
        "page": 76,
        "note": "",
        "heading": "Maximize Employer Top-Ups In RRSP"
      },
      {
        "title": "One annual plan, several purposes",
        "body": "Education, disability support, retirement, flexible savings, and housing are different goals.",
        "points": [
          "List each goal, account, deadline, and verified room.",
          "Plan contributions you can sustain.",
          "Do not assume the author’s allocation order fits every household."
        ],
        "visual": {
          "kind": "grid",
          "labels": [
            "Education",
            "Disability support",
            "Retirement",
            "Flexible savings",
            "First home"
          ]
        },
        "page": 76,
        "note": "",
        "heading": "Investment Plan For Above"
      },
      {
        "title": "Make regular contributions manageable",
        "body": "The author translates annual targets into weekly deposits and keeps a cash buffer.",
        "points": [
          "Annual target ÷ number of deposits = planned deposit.",
          "Align timing with income and required bills.",
          "Check transactions and adjust after a change in circumstances."
        ],
        "visual": {
          "kind": "cycle",
          "labels": [
            "Income arrives",
            "Bills covered",
            "Deposit made",
            "Buffer reviewed"
          ]
        },
        "page": 76,
        "note": "",
        "heading": "Automate The Investments"
      },
      {
        "title": "Account treatment is not investment safety",
        "body": "Tax-sheltered or tax-deferred growth can help, but the account is a container for investments with their own risks.",
        "points": [
          "Tax treatment and investment return are separate questions.",
          "Fees, diversification, liquidity, and time horizon still matter.",
          "Compounding illustrations are assumptions, not forecasts."
        ],
        "visual": {
          "kind": "split",
          "labels": [
            "Account rules|Taxes, eligibility, withdrawals",
            "Investments inside|Risk, fees, potential returns"
          ]
        },
        "page": 77,
        "note": "",
        "heading": "Tax Sheltered Growth"
      },
      {
        "title": "RESP: prepare for education",
        "body": "The author emphasizes opening an account, checking learning-bond eligibility, and using eligible grants without missing age-related opportunities.",
        "points": [
          "Check contributions, beneficiary details, and grant entitlements.",
          "Investigate catch-up limits rather than assuming all missed grants can be recovered at once.",
          "Approved studies can include eligible institutions outside Canada."
        ],
        "visual": {
          "kind": "steps",
          "labels": [
            "Open & verify",
            "Check grants",
            "Plan contributions",
            "Education use"
          ]
        },
        "page": 78,
        "note": "Scholarships and RESP planning can complement each other.",
        "heading": "RESP"
      },
      {
        "title": "RDSP: plan for long-term support",
        "body": "For eligible disability tax credit beneficiaries, RDSP grants and bonds can be substantial. Withdrawal rules deserve special care.",
        "points": [
          "Verify beneficiary eligibility and entitlements.",
          "Ask the provider about carry-forward rules and age limits.",
          "Withdrawals can trigger repayment of grants and bonds."
        ],
        "visual": {
          "kind": "shield",
          "labels": [
            "Eligibility",
            "Entitlements",
            "Long-term purpose",
            "Withdrawal rules"
          ]
        },
        "page": 79,
        "note": "Do not treat an RDSP as a readily accessible emergency account.",
        "heading": "RDSP"
      },
      {
        "title": "RRSP: deduction now, rules later",
        "body": "RRSP contributions can create a deduction, while withdrawals generally have tax consequences. Workplace and spousal plans have additional considerations.",
        "points": [
          "Check your own contribution room.",
          "Understand the Home Buyers’ Plan eligibility and repayment obligations.",
          "Spousal withdrawal attribution rules may apply."
        ],
        "visual": {
          "kind": "path",
          "labels": [
            "Eligible contribution",
            "Deduction",
            "Growth",
            "Withdrawal rules"
          ]
        },
        "page": 80,
        "note": "The book’s couple’s down-payment example uses their own savings, not a government cash gift.",
        "heading": "RRSP"
      },
      {
        "title": "TFSA: flexible tax-free treatment",
        "body": "The book highlights that contributions do not create an income-tax deduction, while eligible growth and withdrawals are generally tax-free.",
        "points": [
          "Verify actual contribution room before depositing.",
          "A withdrawal restores room in the following calendar year.",
          "Federal and provincial benefit treatment can differ."
        ],
        "visual": {
          "kind": "cycle",
          "labels": [
            "Verify room",
            "Contribute",
            "Withdraw if needed",
            "Room returns next year"
          ]
        },
        "page": 81,
        "note": "",
        "heading": "TFSA"
      },
      {
        "title": "FHSA: opening starts the room",
        "body": "The author did not personally use an FHSA but highlights the importance of understanding it early if eligible.",
        "points": [
          "Participation room begins after opening the first account.",
          "Eligibility, annual and lifetime limits, and carry-forward rules apply.",
          "Qualifying withdrawals and other withdrawals have different treatment."
        ],
        "visual": {
          "kind": "house",
          "labels": [
            "Eligibility",
            "Open account",
            "Track room",
            "Qualifying purchase"
          ]
        },
        "page": 82,
        "note": "",
        "heading": "FHSA"
      },
      {
        "title": "Rules change. Build verification into the plan.",
        "body": "The book repeatedly asks readers to verify limits, thresholds, grants, and benefits with current official sources.",
        "points": [
          "Use CRA and Government of Canada sources for rules.",
          "Record which year your assumptions apply to.",
          "Ask a qualified professional about decisions involving your own situation."
        ],
        "visual": {
          "kind": "steps",
          "labels": [
            "Official source",
            "Applicable year",
            "Your eligibility",
            "Documented plan"
          ]
        },
        "page": 83,
        "note": "",
        "heading": "A Note On Changing Rules"
      }
    ],
    "activities": [
      {
        "type": "reflection",
        "title": "Check grant opportunities",
        "prompts": [
          "For an RESP or RDSP relevant to your family, what entitlements need checking?",
          "Is there an age or deadline issue to investigate?",
          "What question will you ask the provider or an advisor?"
        ],
        "origin": "From the book",
        "tip": ""
      },
      {
        "type": "calculator",
        "title": "Translate an annual plan into weekly steps",
        "kind": "weekly",
        "prompt": "Enter your own planned annual contributions after verifying room and eligibility. This tool only divides your plan into 52 equal deposits.",
        "origin": "Additional practice"
      },
      {
        "type": "reflection",
        "title": "Investigate RRSP and benefit effects",
        "prompts": [
          "What contribution room and employer match have you verified?",
          "Which tax or benefit effects need an official calculator or qualified advice?",
          "When would any refund or benefit change actually arrive?"
        ],
        "origin": "From the book",
        "tip": ""
      },
      {
        "type": "quiz",
        "title": "What does a grant mean?",
        "prompt": "An eligible program adds money to a contribution under its matching rules. Is that a guaranteed recurring investment return?",
        "options": [
          "Yes, the same percentage will compound every year.",
          "No. It is program support with conditions, separate from investment performance.",
          "Yes, every investment in that account is risk-free."
        ],
        "answer": 1,
        "feedback": "Grant eligibility and investment returns are distinct. Investment losses, program limits, and withdrawal rules still matter.",
        "origin": "Additional practice"
      },
      {
        "type": "quiz",
        "title": "TFSA room after a withdrawal",
        "prompt": "You withdraw money from a TFSA this year. When is that withdrawn amount generally added back to contribution room?",
        "options": [
          "Immediately after withdrawal",
          "January 1 of the following calendar year",
          "It never returns"
        ],
        "answer": 1,
        "feedback": "A withdrawal generally restores that amount next calendar year. Existing unused room is separate; verify your own room before recontributing.",
        "origin": "Additional practice"
      },
      {
        "type": "reflection",
        "title": "Build a verification checklist",
        "prompts": [
          "Name the account and official rule page you will consult.",
          "Record the applicable year, eligibility, room, and deadline.",
          "What cash buffer will you retain before automating contributions?"
        ],
        "origin": "Additional practice",
        "tip": ""
      }
    ],
    "action": "Verify one account opportunity and write a sustainable contribution plan.",
    "resources": [
      {
        "label": "Government of Canada: registered education savings plans",
        "href": "https://www.canada.ca/en/services/benefits/education/education-savings.html"
      },
      {
        "label": "CRA: registered disability savings plans",
        "href": "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/registered-disability-savings-plan-rdsp.html"
      },
      {
        "label": "CRA: RRSPs and related plans",
        "href": "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/rrsps-related-plans.html"
      },
      {
        "label": "CRA: tax-free savings account",
        "href": "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account.html"
      },
      {
        "label": "CRA: first home savings account",
        "href": "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/first-home-savings-account.html"
      },
      {
        "label": "CRA: child and family benefits calculator",
        "href": "https://www.canada.ca/en/revenue-agency/services/child-family-benefits/child-family-benefits-calculator.html"
      }
    ]
  },
  {
    "id": 7,
    "stage": "Transfer",
    "title": "Give the next generation a head start",
    "summary": "Think beyond inheritance: knowledge, support, opportunities, and a safety net can all carry forward.",
    "page": 85,
    "slides": [
      {
        "title": "Some advantages cannot be handed down",
        "body": "A job title or academic tenure cannot simply pass to a child. Assets, knowledge, support, and some businesses can.",
        "points": [
          "Think about what your income is building.",
          "Financial stability can create options for children.",
          "A head start can take more forms than a cash inheritance."
        ],
        "visual": {
          "kind": "network",
          "labels": [
            "Knowledge",
            "Support",
            "Opportunities",
            "Assets"
          ]
        },
        "page": 85,
        "note": "",
        "heading": "Generational Wealth Transfer and Sustainability"
      },
      {
        "title": "Four pillars across a lifetime",
        "body": "The author sees generational wealth as a continuing process, with inheritance as its final pillar.",
        "points": [
          "Plan for family and future responsibilities.",
          "Teach money habits and support formative years.",
          "Consider eventual asset transfer alongside knowledge and values."
        ],
        "visual": {
          "kind": "steps",
          "labels": [
            "Family planning",
            "Money education",
            "Formative support",
            "Inheritance"
          ]
        },
        "page": 86,
        "note": "",
        "heading": "Pillars Of Generational Wealth Transfer"
      },
      {
        "title": "Family planning includes financial timing",
        "body": "The book reflects on parents’ working years, children’s education, and the overlap of major obligations.",
        "points": [
          "Map likely responsibilities against available time and resources.",
          "Consider care, health, and personal circumstances alongside money.",
          "Use planning to explore options, not impose an ideal family timeline."
        ],
        "visual": {
          "kind": "path",
          "labels": [
            "Care needs",
            "School years",
            "Early career",
            "Later-life support"
          ]
        },
        "page": 87,
        "note": "The author’s family-timing preferences are personal examples, not universal advice.",
        "heading": "Planning A Family For The Future"
      },
      {
        "title": "Teach habits, not just balances",
        "body": "Children benefit from understanding debt, saving, taxes, and lifestyle choices before making large commitments.",
        "points": [
          "Use the chapter-one games to start age-appropriate conversations.",
          "Explain trade-offs with everyday examples.",
          "Model the habits you want to pass on."
        ],
        "visual": {
          "kind": "ladder",
          "labels": [
            "Understand costs",
            "Practice choices",
            "Build habits"
          ]
        },
        "page": 87,
        "note": "",
        "heading": "Upbringing And Money Education"
      },
      {
        "title": "Help education start without unnecessary debt",
        "body": "The author combines RESP planning, scholarship preparation, and support during studies.",
        "points": [
          "Investigate funded education and legitimate scholarships.",
          "Compare institutions, programs, costs, and fit.",
          "Teach application skills alongside providing financial support."
        ],
        "visual": {
          "kind": "grid",
          "labels": [
            "Scholarships",
            "RESP planning",
            "Application skills",
            "Affordable pathways"
          ]
        },
        "page": 88,
        "note": "",
        "heading": "Help education start without unnecessary debt"
      },
      {
        "title": "Support during the years that shape options",
        "body": "Affordable housing and help during college or an early career can make a long-term difference.",
        "points": [
          "Consider what you can provide sustainably.",
          "Agree on expectations, duration, and responsibilities.",
          "Support can enable saving and training rather than only consumption."
        ],
        "visual": {
          "kind": "house",
          "labels": [
            "A place to stay",
            "Time to learn",
            "Room to save"
          ]
        },
        "page": 88,
        "note": "",
        "heading": "Support During Formative Years"
      },
      {
        "title": "A safety net can create room to try",
        "body": "The author describes how family support may help children make career moves or take measured opportunities.",
        "points": [
          "Be clear about what support is truly available.",
          "Distinguish a backup plan from unlimited funding.",
          "Help children build their own resilience and judgment."
        ],
        "visual": {
          "kind": "shield",
          "labels": [
            "Career transition",
            "Practical support",
            "Clear boundaries"
          ]
        },
        "page": 88,
        "note": "Family support can be uncertain and does not automatically eliminate the need for personal savings.",
        "heading": "Reduce Emergency-Fund Need / Safety Net"
      },
      {
        "title": "Inheritance is the final pillar",
        "body": "Assets, a home, or a business may be transferred later. Good stewardship starts before that moment.",
        "points": [
          "Learn about wills, beneficiaries, and estate planning.",
          "Get qualified legal and tax advice for actual arrangements.",
          "Discuss values and knowledge as well as assets."
        ],
        "visual": {
          "kind": "steps",
          "labels": [
            "Prepare knowledge",
            "Clarify intentions",
            "Seek advice",
            "Review arrangements"
          ]
        },
        "page": 89,
        "note": "The author is still learning about wills and trusts; the book does not provide a legal blueprint.",
        "heading": "Inheritance"
      },
      {
        "title": "A lifelong transfer of capability",
        "body": "Generational wealth includes the ability to handle opportunities, not just the opportunity itself.",
        "points": [
          "Education and habits can outlast a single gift.",
          "Support should respect both generations’ financial needs.",
          "Revisit the plan as the family changes."
        ],
        "visual": {
          "kind": "cycle",
          "labels": [
            "Teach",
            "Support",
            "Build independence",
            "Pass forward"
          ]
        },
        "page": 89,
        "note": "",
        "heading": "Conclusion"
      }
    ],
    "activities": [
      {
        "type": "reflection",
        "title": "Map your four pillars",
        "prompts": [
          "What future family responsibility needs planning?",
          "What money skill would you like to teach?",
          "What formative-years support could you sustainably offer?",
          "What inheritance or estate-planning question needs professional help?"
        ],
        "origin": "Additional practice",
        "tip": ""
      },
      {
        "type": "reflection",
        "title": "Plan a money conversation",
        "prompts": [
          "Choose an age-appropriate purchase or saving goal to discuss.",
          "What question will invite the child to compare choices?",
          "How will you let them practice rather than only listen?"
        ],
        "origin": "Additional practice",
        "tip": ""
      },
      {
        "type": "quiz",
        "title": "What counts as generational wealth?",
        "prompt": "Which best reflects the chapter?",
        "options": [
          "Only assets distributed after death",
          "Knowledge, habits, support, opportunity, and eventual inheritance",
          "A promise that parents will cover every future expense"
        ],
        "answer": 1,
        "feedback": "The four pillars operate throughout life. Inheritance is one part of a broader transfer.",
        "origin": "Additional practice"
      },
      {
        "type": "reflection",
        "title": "Define a sustainable safety net",
        "prompts": [
          "What support could you offer without weakening your own essential needs?",
          "What limits or expectations would you discuss beforehand?",
          "How could that support strengthen the other person’s independence?"
        ],
        "origin": "Additional practice",
        "tip": ""
      },
      {
        "type": "reflection",
        "title": "Education without unnecessary debt",
        "prompts": [
          "List one scholarship, funded pathway, or lower-cost institution to investigate.",
          "What application skill or information is missing?",
          "What date will you check eligibility and requirements?"
        ],
        "origin": "Additional practice",
        "tip": ""
      }
    ],
    "action": "Start one conversation about money skills or sustainable family support.",
    "resources": []
  },
  {
    "id": 8,
    "stage": "Give",
    "title": "Use wealth for good",
    "summary": "Turn financial capacity into care, opportunity, and community contribution.",
    "page": 91,
    "slides": [
      {
        "title": "Wealth is a tool with a purpose",
        "body": "The author reminds us that our lives depend on the work of many people. Financial strength can expand what we do for others.",
        "points": [
          "Recognize the support and systems that helped you.",
          "Consider who could benefit from your time, skills, or resources.",
          "Giving can begin before you feel wealthy."
        ],
        "visual": {
          "kind": "network",
          "labels": [
            "Family",
            "Community",
            "Opportunity",
            "Contribution"
          ]
        },
        "page": 91,
        "note": "",
        "heading": "What To Do When You Are Wealthy"
      },
      {
        "title": "Make giving a repeatable habit",
        "body": "The author describes starting an automated $1-per-day donation.",
        "points": [
          "Choose a sustainable amount and a cause you understand.",
          "Check recurring terms and review periodically.",
          "Keep eligible receipts where relevant."
        ],
        "visual": {
          "kind": "cycle",
          "labels": [
            "Choose a cause",
            "Set an amount",
            "Give regularly",
            "Review impact"
          ]
        },
        "page": 91,
        "note": "The $1-per-day example is the author’s experience, not a required target.",
        "heading": "Automate Charity"
      },
      {
        "title": "Look for a lasting difference",
        "body": "Helping with tuition or an essential opportunity may change someone’s future.",
        "points": [
          "Ask what the recipient or community actually needs.",
          "Understand how an organization uses contributions.",
          "Measure impact carefully rather than assuming the biggest gift is best."
        ],
        "visual": {
          "kind": "steps",
          "labels": [
            "Understand need",
            "Choose support",
            "Follow the outcome"
          ]
        },
        "page": 91,
        "note": "",
        "heading": "Impactful Charity"
      },
      {
        "title": "Invest in line with your values",
        "body": "The author considers both financial outcomes and the wider effects of the industries he supports.",
        "points": [
          "Identify activities you want to support or avoid.",
          "Investigate actual holdings and business practices.",
          "Evaluate fees, risk, and suitability as well as ethical alignment."
        ],
        "visual": {
          "kind": "split",
          "labels": [
            "Financial questions|Risk, fees, diversification",
            "Values questions|People, communities, environment"
          ]
        },
        "page": 91,
        "note": "",
        "heading": "Invest Ethically"
      },
      {
        "title": "Creating good jobs is contribution",
        "body": "The book connects empowerment with useful work and businesses that create worthwhile employment.",
        "points": [
          "Build something people find useful.",
          "Consider fair conditions and sustainable operations.",
          "Financial return and social contribution can coexist."
        ],
        "visual": {
          "kind": "steps",
          "labels": [
            "Useful work",
            "Fair opportunity",
            "Sustainable value"
          ]
        },
        "page": 92,
        "note": "",
        "heading": "Create Jobs"
      },
      {
        "title": "Lift family and friends in practical ways",
        "body": "Help does not have to mean handing over money. Advice, introductions, and information can open doors.",
        "points": [
          "Ask what would actually help.",
          "Share resources or knowledge without imposing choices.",
          "Keep boundaries that protect relationships and your own stability."
        ],
        "visual": {
          "kind": "network",
          "labels": [
            "Knowledge",
            "Introductions",
            "Practical help",
            "Encouragement"
          ]
        },
        "page": 92,
        "note": "",
        "heading": "Lift Up Family And Friends"
      },
      {
        "title": "Create opportunities for children",
        "body": "Education, experiences, and exposure can help children grow into capable adults.",
        "points": [
          "Consider experiences that develop skills and confidence.",
          "Include responsibility and appreciation alongside support.",
          "Use resources to broaden opportunity rather than only consumption."
        ],
        "visual": {
          "kind": "ladder",
          "labels": [
            "Exposure",
            "Skills",
            "Confidence"
          ]
        },
        "page": 92,
        "note": "",
        "heading": "Create Better Opportunities For Your Children"
      },
      {
        "title": "Giving can strengthen connection",
        "body": "The author describes psychological, spiritual, and social value in being helpful.",
        "points": [
          "Sharing job information can also deepen your own network.",
          "Personal meaning is distinct from a financial return.",
          "Do not expect donations to generate guaranteed money back."
        ],
        "visual": {
          "kind": "cycle",
          "labels": [
            "Share",
            "Connect",
            "Learn",
            "Support"
          ]
        },
        "page": 93,
        "note": "",
        "heading": "Giving Is Receiving"
      },
      {
        "title": "Time and voice count too",
        "body": "Volunteering, community causes, advocacy, and practical service are part of the book’s giving framework.",
        "points": [
          "Match an organization’s needs with your skills and availability.",
          "Make a commitment you can keep.",
          "Listen to people closest to the issue."
        ],
        "visual": {
          "kind": "grid",
          "labels": [
            "Time",
            "Skills",
            "Service",
            "Advocacy"
          ]
        },
        "page": 93,
        "note": "",
        "heading": "Volunteerism And Activism"
      },
      {
        "title": "Support the businesses around you",
        "body": "The book encourages choosing local small businesses where practical.",
        "points": [
          "Buy something you value and can afford.",
          "Recommend good service or leave an honest review.",
          "Consider how your spending supports your community."
        ],
        "visual": {
          "kind": "house",
          "labels": [
            "Useful purchase",
            "Local livelihood",
            "Community connection"
          ]
        },
        "page": 93,
        "note": "",
        "heading": "Support Small Businesses"
      },
      {
        "title": "Plan a year of contribution",
        "body": "A giving plan makes intention more consistent. Financial giving is only one part.",
        "points": [
          "Choose a cause, contribution, frequency, and review date.",
          "Check charity registration and receipt rules where relevant.",
          "Verify current donation-credit and carry-forward rules before tax planning."
        ],
        "visual": {
          "kind": "steps",
          "labels": [
            "Purpose",
            "Contribution",
            "Schedule",
            "Review"
          ]
        },
        "page": 93,
        "note": "",
        "heading": "Conclusion"
      }
    ],
    "activities": [
      {
        "type": "calculator",
        "title": "Turn an intention into a giving habit",
        "kind": "giving",
        "prompt": "Estimate a sustainable financial contribution. This does not calculate donation tax credits.",
        "origin": "Additional practice"
      },
      {
        "type": "reflection",
        "title": "Choose impact",
        "prompts": [
          "What cause or person would you like to support?",
          "What evidence would help you understand the need and likely impact?",
          "What could you give besides money?"
        ],
        "origin": "Additional practice",
        "tip": ""
      },
      {
        "type": "reflection",
        "title": "Your values and investments",
        "prompts": [
          "Which activities do you want your money to support or avoid?",
          "How would you check what an investment actually holds?",
          "What financial risks or fees would still need review?"
        ],
        "origin": "Additional practice",
        "tip": ""
      },
      {
        "type": "quiz",
        "title": "Must giving wait until you are wealthy?",
        "prompt": "Which example best matches the chapter’s broader view of giving?",
        "options": [
          "Only a large donation counts.",
          "Useful advice, volunteering, ethical choices, and sustainable donations can all contribute.",
          "Giving guarantees a financial reward."
        ],
        "answer": 1,
        "feedback": "The chapter includes money, time, opportunity, community action, and everyday support. Its spiritual perspective is not a promise of financial returns.",
        "origin": "Additional practice"
      },
      {
        "type": "reflection",
        "title": "A 30-day contribution experiment",
        "prompts": [
          "Choose one act of service, one useful connection, or one sustainable donation.",
          "When will you do it, and who needs to be consulted?",
          "How will you reflect on what helped?"
        ],
        "origin": "Additional practice",
        "tip": ""
      }
    ],
    "action": "Commit to one sustainable act of contribution and a review date.",
    "resources": [
      {
        "label": "CRA: charities listings and registration",
        "href": "https://www.canada.ca/en/revenue-agency/services/charities-giving/charities-listings.html"
      }
    ]
  },
  {
    "id": 9,
    "stage": "Bring it together",
    "title": "Your story, your milestones",
    "summary": "Learn from the author’s education, career, housing, and mortgage journey—then write your own next chapter.",
    "page": 96,
    "slides": [
      {
        "title": "A lived journey, not a universal formula",
        "body": "The final chapter connects the framework to the author’s real decisions and circumstances.",
        "points": [
          "Notice the constraints and values behind the choices.",
          "Separate transferable principles from personal details.",
          "Adapt deliberately instead of copying every step."
        ],
        "visual": {
          "kind": "path",
          "labels": [
            "Education",
            "Career",
            "Housing",
            "Next chapter"
          ]
        },
        "page": 96,
        "note": "",
        "heading": "My Financial Story"
      },
      {
        "title": "Education funded through opportunity",
        "body": "The author describes scholarships, teaching work, and funded graduate education rather than education loans.",
        "points": [
          "Look for need-based and merit-based funding where available.",
          "Understand application requirements and deadlines.",
          "A funded path still involves effort, time, and choices."
        ],
        "visual": {
          "kind": "steps",
          "labels": [
            "Research funding",
            "Prepare applications",
            "Study & work",
            "Build capability"
          ]
        },
        "page": 96,
        "note": "",
        "heading": "My Education"
      },
      {
        "title": "Career and location were connected",
        "body": "After arriving in Canada, the author worked in security, moved to Vancouver for robotics work, then returned to Edmonton.",
        "points": [
          "A job decision interacts with housing and family costs.",
          "Compare quality of life and net financial position.",
          "A career path can involve temporary work and course corrections."
        ],
        "visual": {
          "kind": "path",
          "labels": [
            "Edmonton arrival",
            "Vancouver robotics",
            "Housing comparison",
            "Edmonton home"
          ]
        },
        "page": 96,
        "note": "",
        "heading": "My Career"
      },
      {
        "title": "The housing choice reflected his values",
        "body": "The author used halal financing and valued the penalty-free prepayments permitted by his agreement.",
        "points": [
          "His financing rate and terms shaped the decision.",
          "He built an amortization spreadsheet to compare scenarios.",
          "Your contract may have different limits, penalties, or calculation methods."
        ],
        "visual": {
          "kind": "house",
          "labels": [
            "Values",
            "Contract terms",
            "Cash-flow plan"
          ]
        },
        "page": 97,
        "note": "Halal and conventional products vary. Verify your agreement rather than generalizing from this example.",
        "heading": "My Housing Story"
      },
      {
        "title": "His principles for buying a home",
        "body": "The author prioritized a large down payment, a stable job, an emergency buffer, and manageable non-principal ownership costs.",
        "points": [
          "He preferred cash if possible, while recognizing that it usually is not.",
          "A down payment of at least 20% generally avoids borrower-paid default insurance on many conventional mortgages.",
          "He tracked principal and used the prepayment flexibility in his own contract."
        ],
        "visual": {
          "kind": "grid",
          "labels": [
            "Down payment",
            "Stable income",
            "Emergency buffer",
            "Contract flexibility"
          ]
        },
        "page": 98,
        "note": "These are the author’s priorities. Product rules and personal circumstances vary; verify actual terms.",
        "heading": "My Housing Story · Home-buying principles"
      },
      {
        "title": "Principal and financing costs do different jobs",
        "body": "Part of a payment reduces the outstanding loan. Another part pays financing costs. Ownership has other costs too.",
        "points": [
          "A permitted prepayment reduces principal.",
          "Depending on the contract, it may reduce future costs or payoff time.",
          "Retain an appropriate emergency buffer when considering prepayments."
        ],
        "visual": {
          "kind": "split",
          "labels": [
            "Principal|Reduces loan balance",
            "Financing & ownership|Costs of borrowing and owning"
          ]
        },
        "page": 97,
        "note": "",
        "heading": "Principal and financing costs do different jobs"
      },
      {
        "title": "Compare the right housing costs",
        "body": "The author compared non-principal housing expenses with previous rent as one milestone.",
        "points": [
          "Separate principal from financing costs.",
          "Include taxes, insurance, maintenance, and other ownership costs.",
          "Also compare full cash outflows; equity does not pay an immediate bill."
        ],
        "visual": {
          "kind": "grid",
          "labels": [
            "Financing cost",
            "Property taxes",
            "Insurance & upkeep",
            "Principal / cash flow"
          ]
        },
        "page": 98,
        "note": "A favorable cost comparison does not by itself settle a rent-versus-buy decision.",
        "heading": "Home Mortgage Milestones · Cost comparison"
      },
      {
        "title": "When more of the payment builds equity",
        "body": "The chapter celebrates the point when the principal portion exceeds the financing portion.",
        "points": [
          "Check the split in your actual amortization schedule.",
          "A prepayment may change when that point arrives.",
          "Rate changes and contract terms can change the projection."
        ],
        "visual": {
          "kind": "bars",
          "labels": [
            "Earlier: principal|30",
            "Earlier: financing|70",
            "Later: principal|70",
            "Later: financing|30"
          ]
        },
        "page": 98,
        "note": "Conceptual payment shares, not a calculation for a specific loan.",
        "heading": "Home Mortgage Milestones · Principal crossover"
      },
      {
        "title": "Watch both time and total cost",
        "body": "Shorter remaining amortization and lower projected financing costs can make a long journey feel tangible.",
        "points": [
          "Compare a baseline with the same scenario plus a permitted prepayment.",
          "Keep rate and timing assumptions visible.",
          "Celebrate progress toward 20, 15, 10, or 5 years remaining when relevant."
        ],
        "visual": {
          "kind": "steps",
          "labels": [
            "Baseline",
            "Prepayment",
            "Compare costs",
            "Compare time"
          ]
        },
        "page": 98,
        "note": "",
        "heading": "Home Mortgage Milestones · Financing costs and amortization"
      },
      {
        "title": "Two halfway points that are not the same",
        "body": "Half of a home’s estimated value in equity is different from repaying half of the original loan.",
        "points": [
          "Equity = estimated home value − outstanding loan.",
          "Loan repaid = original principal − outstanding principal.",
          "Changes in home value affect equity but not the amount of principal you repaid."
        ],
        "visual": {
          "kind": "split",
          "labels": [
            "50% home equity|Relative to current estimated value",
            "50% loan repaid|Relative to original loan"
          ]
        },
        "page": 99,
        "note": "",
        "heading": "Home Mortgage Milestones · Equity and original principal"
      },
      {
        "title": "Consider established plans in context",
        "body": "The author discusses Ramsey’s seven steps while considering Canadian programs and his own priorities.",
        "points": [
          "Debt reduction and discipline resonate with his values.",
          "EI eligibility and public retirement programs have limits.",
          "Grant opportunities, employer matches, and contract terms can influence sequencing."
        ],
        "visual": {
          "kind": "steps",
          "labels": [
            "Learn a framework",
            "Examine your context",
            "Check trade-offs",
            "Adapt the plan"
          ]
        },
        "page": 99,
        "note": "CPP is one retirement-income component; EI is conditional. Neither guarantees all future needs are covered.",
        "heading": "My Take on Dave Ramsey’s Seven Baby Steps"
      },
      {
        "title": "Bring the full journey into one plan",
        "body": "The closing checklist asks readers to measure savings and identify their top three actions.",
        "points": [
          "Start with a specific action, not a vague ambition.",
          "Name the evidence of progress and the next review date.",
          "Use the framework again when life changes."
        ],
        "visual": {
          "kind": "cycle",
          "labels": [
            "Understand",
            "Act",
            "Measure",
            "Review"
          ]
        },
        "page": 104,
        "note": "",
        "heading": "Checklist / My Top Three Actions"
      }
    ],
    "activities": [
      {
        "type": "tool",
        "title": "Explore a mortgage prepayment",
        "prompt": "Compare a baseline and a one-time prepayment. Then try the book’s question: what changes when $1 is prepaid in year one? Read the calculator assumptions and your actual lender terms.",
        "href": "../calculators/mortgage-prepayment.html",
        "label": "Open Mortgage Calculator",
        "origin": "From the book"
      },
      {
        "type": "reflection",
        "title": "Read your comparison",
        "prompts": [
          "What assumptions and permitted prepayments did you use?",
          "What happened to projected total financing costs and payoff time?",
          "Which mortgage milestone would be meaningful to you?"
        ],
        "origin": "From the book · Chapter 9 activity",
        "tip": ""
      },
      {
        "type": "quiz",
        "title": "Which halfway milestone?",
        "prompt": "A home is estimated at $500,000 and its loan balance is $200,000. The original loan was $400,000. Which is true?",
        "options": [
          "Home equity is 60%, while 50% of the original loan has been repaid.",
          "Both figures must be 50%.",
          "Home equity is 40%, while 60% of the original loan has been repaid."
        ],
        "answer": 0,
        "feedback": "Equity is $300,000 ÷ $500,000 = 60%. Principal repaid is $200,000 ÷ $400,000 = 50%. These use different denominators.",
        "origin": "Additional practice"
      },
      {
        "type": "reflection",
        "title": "Your top three actions",
        "prompts": [
          "Understand or save: what will you do, and by when?",
          "Build resilience or preserve: what will you do, and by when?",
          "Grow, transfer, or give: what will you do, and by when?"
        ],
        "origin": "From the book · Closing checklist",
        "tip": ""
      },
      {
        "type": "reflection",
        "title": "Write your next chapter",
        "prompts": [
          "Which idea changed how you think about money?",
          "What evidence would show meaningful progress in 30 days?",
          "What decision from the first game would you now reconsider?"
        ],
        "origin": "Additional practice",
        "tip": ""
      }
    ],
    "action": "Choose a milestone, a first step, and a date to review your progress.",
    "resources": []
  }
];
