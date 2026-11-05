/* Book-based planning prompts. Benefits and tax examples require individual verification. */
window.SavingsPlannerData={
 pillars:['Remove leakages','Reduce living costs','Benefits & free resources','Mindset & strategies'],
 categories:[
 {id:'c0',name:'Housing',caution:'Check contracts, moving costs, safety and household needs before changing housing.',cells:[
  [['Review unexplained charges','Compare your latest rent or housing statement with the agreement.'],['Remove duplicated housing services','List services included in your rent, building fees or insurance.']],
  [['Review your renewal options','Record the renewal date and compare suitable alternatives.'],['Compare total housing costs','Include transport, utilities, fees and moving costs in the comparison.']],
  [['Check housing assistance','Find official housing-support programs for your location and household.'],['Ask about local efficiency support','Check official rebates before committing to an upgrade.']],
  [['Set a housing-cost limit','Choose a realistic monthly limit that protects other essentials.'],['Plan ahead for renewal','Set a reminder well before your lease or financing renewal.']]
 ]},
 {id:'c1',name:'Utilities',cells:[
  [['Remove unused add-ons','Check phone, internet and utility bills for services you do not use.'],['Investigate household waste','Check for water leaks and avoidable heating or electricity use.']],
  [['Compare equivalent plans','Write down your usage and request comparable all-in quotes.'],['Compare annual or autopay pricing','Ask about genuine discounts, renewal terms and upfront cash needs.']],
  [['Check utility assistance','Review official income-based utility relief or connectivity programs.'],['Use available energy advice','Check whether your utility or community offers a free home assessment.']],
  [['Set a renewal reminder','Record when each promotional rate or contract ends.'],['Choose a realistic usage target','Pick one change and compare the next bill with similar usage.']]
 ]},
 {id:'c2',name:'Groceries',cells:[
  [['Reduce food waste','Check your fridge and pantry before making the next shopping list.'],['Review delivery and service fees','Compare the total cost of your usual grocery-ordering method.']],
  [['Track normal unit prices','Record the unit prices of five items you buy regularly.'],['Compare useful bulk purchases','Compare unit prices and buy only what you can store and use.']],
  [['Explore community food resources','Check suitable community kitchens, gardens or food-support services.'],['Use relevant store offers','Review coupons for items already on your list and check their expiry.']],
  [['Plan meals before shopping','Choose a few meals using food you already have.'],['Set a grocery spending guide','Make a list and choose limits for frequently purchased items.']]
 ]},
 {id:'c3',name:'Transport',caution:'Compare safety, accessibility and time as well as money.',cells:[
  [['Review avoidable fees','Check parking, toll, late-payment and booking charges.'],['Remove unused transport subscriptions','Review passes or memberships against your recent actual use.']],
  [['Compare full vehicle ownership costs','List financing, insurance, fuel, maintenance, parking and depreciation.'],['Compare practical alternatives','Price a realistic week using transit, sharing, cycling or carpooling.']],
  [['Check discounted transit','Review local income-based, student or senior fare programs.'],['Ask about employer transport support','Check your benefits booklet or ask HR about relevant assistance.']],
  [['Set a vehicle-upgrade rule','Write down what would justify replacing your current vehicle.'],['Plan routine maintenance','Check the service schedule and budget for predictable work.']]
 ]},
 {id:'c4',name:'Insurance',caution:'Compare equivalent coverage, exclusions and deductibles. Confirm replacement coverage before cancelling.',cells:[
  [['Check duplicated coverage','Compare your policies with employer and household coverage.'],['Review unexplained premiums','Compare the renewal notice with last year’s policy and changes.']],
  [['Request comparable quotes','Use the same coverage, limits and deductibles for each quote.'],['Compare payment schedules','Ask whether annual payment removes installment fees without weakening your reserve.']],
  [['Review employer coverage','Find your benefits booklet and confirm who is covered.'],['Check public coverage','Verify relevant services through official local or government sources.']],
  [['Review changing protection needs','List changes in dependants, housing, work or major obligations.'],['Set an annual policy review','Record renewal dates and questions for your insurer.']]
 ]},
 {id:'c5',name:'Subscriptions',cells:[
  [['Cancel an unused membership','Check recent usage, cancellation terms and the next billing date.'],['Check duplicate subscriptions','List similar services paid by you and other household members.']],
  [['Choose a suitable plan','Compare features you actually use with a lower-cost tier.'],['Check genuine annual savings','Request the annual total and compare cancellation and refund terms.']],
  [['Try a library alternative','Check your local library’s digital, learning and entertainment services.'],['Check included memberships','Review employer, community or existing-package benefits.']],
  [['Set a subscription limit','Choose a total monthly amount and review which services fit.'],['Add renewal reminders','Record trial expiry and renewal dates before the next charge.']]
 ]},
 {id:'c6',name:'Banking fees',cells:[
  [['Review account charges','Mark monthly, ATM, overdraft and transaction fees on your statement.'],['Question an incorrect fee','Gather the statement and account terms before contacting the bank.']],
  [['Compare lower-cost accounts','Compare fees against the transactions and features you need.'],['Review minimum-balance conditions','Compare fee savings with the cash you would need to keep unavailable.']],
  [['Check fee-waiver eligibility','Ask about applicable student, senior, newcomer or other account options.'],['Use available account alerts','Enable suitable low-balance and payment notifications.']],
  [['Plan payment timing','Map bill dates against expected deposits and your cash buffer.'],['Schedule an account review','Check whether your account still suits your actual usage.']]
 ]},
 {id:'c7',name:'Debt',caution:'Verify balances, APRs, minimums and penalties. Protect essentials and cash needs; promotional rates may expire.',cells:[
  [['Check interest and late charges','Compare your statement with payment dates and credit terms.'],['Review full-balance payments','Check whether credit-card statement balances are paid in full when affordable.']],
  [['Compare repayment costs','List each debt’s verified rate, fees and required minimum payment.'],['Review a lower-cost option','Compare total costs, transfer fees, penalties and promotional expiry.']],
  [['Check repayment assistance','Use official sources to review support relevant to your debt.'],['Explore nonprofit counselling','Find a reputable service and verify its fees and scope.']],
  [['Choose a manageable repayment step','Set an amount that preserves essentials and required payments.'],['Review payment reminders or autopay','Confirm the payment amount, due date and available account balance.']]
 ]},
 {id:'c8',name:'Health & care',caution:'Preserve necessary care. Canadian medical tax-credit examples require eligibility checks; reimbursements cannot be claimed twice.',cells:[
  [['Review billing and reimbursements','Match receipts with insurance statements and amounts already repaid.'],['Check unused recurring services','Review optional memberships without interrupting necessary treatment.']],
  [['Ask about covered alternatives','Discuss suitable lower-cost or covered options with the provider.'],['Compare appropriate service costs','Request all-in quotes while considering quality, access and continuity.']],
  [['Review insurance and spending accounts','Check available coverage, remaining balances and claim deadlines.'],['Organize possible tax-credit records','Collect itemized receipts and unreimbursed-expense records for an eligibility review.']],
  [['Create a receipt routine','Choose one place to keep receipts and reimbursement records.'],['Plan recurring care costs','List predictable appointments, prescriptions and other necessary care.']]
 ]},
 {id:'c9',name:'Childcare',caution:'Care quality and safety come first. Subsidies and Canadian childcare deductions depend on household circumstances and current rules.',cells:[
  [['Review childcare invoices','Check attendance, fees, deposits and subsidies already applied.'],['Check overlapping charges','Compare payment records with the provider’s statement.']],
  [['Compare suitable care arrangements','Compare total cost, hours, location and quality of appropriate options.'],['Review schedule-related costs','Check whether predictable scheduling can reduce optional extra charges.']],
  [['Check childcare subsidies','Review official eligibility and application requirements.'],['Collect provider receipts','Request records needed for reimbursement or a possible childcare-expense deduction.']],
  [['Plan care around reliable schedules','Map work hours, travel time and realistic backup support.'],['Budget for changing care needs','Note school breaks, new schedules and upcoming family changes.']]
 ]},
 {id:'c10',name:'Education',caution:'Check program quality, eligibility and total cost; a grant or credential does not guarantee a financial return.',cells:[
  [['Review unused learning subscriptions','Check usage, renewal dates and cancellation terms.'],['Check course fees and materials','Compare invoices with the program’s published requirements.']],
  [['Compare total program costs','Include tuition, materials, transport and time away from paid work.'],['Compare suitable used materials','Check whether used books or equipment meet current course requirements.']],
  [['Check scholarships and grants','List official applications, eligibility requirements and deadlines.'],['Ask about employer training support','Confirm approved courses, reimbursement conditions and any repayment clause.']],
  [['Set a clear learning goal','Write what capability or opportunity the spending is intended to support.'],['Plan before enrollment','Check completion requirements, workload and realistic employment relevance.']]
 ]},
 {id:'c11',name:'Dining',cells:[
  [['Review delivery and convenience fees','Compare the food price with the final delivered total.'],['Identify a frequent small expense','Count a repeated purchase and calculate its annual cost.']],
  [['Try one lower-cost replacement','Plan a realistic alternative for one regular meal or drink.'],['Compare menu and pickup options','Check the all-in cost before ordering something you already want.']],
  [['Use relevant dining offers','Check valid promotions without increasing the planned order.'],['Check existing rewards','Review expiry and redemption value before spending extra to earn points.']],
  [['Set a dining spending guide','Choose a limit that leaves room for food needs and valued social occasions.'],['Plan convenient meals','Prepare one easy option for a day when you usually order food.']]
 ]},
 {id:'c12',name:'Shopping',cells:[
  [['Check returns and duplicate orders','Review recent purchases, refund status and return deadlines.'],['Review unwanted recurring orders','Check automatic replenishment schedules and cancellation terms.']],
  [['Compare repair with replacement','Get a repair quote and compare useful life and total replacement cost.'],['Compare suitable second-hand options','Check condition, safety, warranty and seller reliability.']],
  [['Check offers before a planned purchase','Compare legitimate coupons, rewards and promotions against the final price.'],['Try a free or shared alternative','Check borrowing, rental, community sharing or library options.']],
  [['Set a maximum price','Choose a price limit and decide what to do if the item exceeds it.'],['Use a waiting period','Write why you want the item and choose a date to reconsider.']]
 ]},
 {id:'c13',name:'Giving',caution:'Giving has social value. Keep it affordable; Canadian donation tax credits require qualifying organizations and receipts.',cells:[
  [['Review recurring commitments','Check donation amounts, timing and organizations against your intentions.'],['Check missing donation receipts','Match contributions with receipts already received.']],
  [['Choose an affordable giving amount','Review giving alongside essentials, debt obligations and resilience.'],['Compare ways to contribute','Consider useful in-kind support or skills as well as money.']],
  [['Check employer donation matching','Verify eligible organizations, limits and submission deadlines.'],['Organize qualifying donation records','Confirm organization status and receipt requirements before assuming tax relief.']],
  [['Plan giving around your values','Choose the causes and forms of support that matter to you.'],['Set a contribution review date','Review affordability and impact without treating generosity only as a cost.']]
 ]},
 {id:'c14',name:'Other',cells:[
  [['Identify unexplained spending','Find the merchant, receipt or household purpose before judging the charge.'],['Check repeated or duplicate charges','Compare dates and receipts before excluding or disputing a transaction.']],
  [['Compare the total cost','List upfront, recurring, financing and exit costs for this expense.'],['Explore a suitable alternative','Compare a lower-cost option against the same practical need.']],
  [['Check relevant support','Identify the expense first, then look for legitimate official assistance.'],['Check available free resources','Explore community, employer or library services that meet the same need.']],
  [['Define the value you expect','Write what this expense contributes to your life.'],['Set a practical next step','Choose one question to answer and a date to review it.']]
 ]}
 ]
};
