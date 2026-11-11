/* Pure arithmetic shared by the lesson experiments and their tests. */
(function(root) {
 'use strict';
 const finite=(n,min=0,max=1e9)=>{n=Number(n);if(!Number.isFinite(n)||n<min||n>max)throw new RangeError('Value outside the example’s range.');return n;};
 const api={
 cashflow:(income,outflows,months=1)=>({monthly:finite(income)-finite(outflows),period:(finite(income)-finite(outflows))*finite(months,0,120)}),
 pillars(selected){const cuts=[80,120,0,50].reduce((n,v,i)=>n+(selected[i]?v:0),0),support=selected[2]?100:0;return{income:3600+support,outflows:3800-cuts,cuts,support,surplus:-200+cuts+support};},
 annual(monthly,upfront,cash){monthly=finite(monthly);upfront=finite(upfront);cash=finite(cash);return{monthlyTotal:monthly*12,upfront,saving:monthly*12-upfront,renewal:upfront/12,cashAfter:cash-upfront,affordable:cash>=upfront};},
 cost(price,tax,deductions,wage){price=finite(price);tax=finite(tax,0,100);deductions=finite(deductions,0,99);wage=finite(wage,0.01);const checkout=price*(1+tax/100),gross=checkout/(1-deductions/100);return{checkout,gross,hours:gross/wage};},
 shock(cash,bills,income,start,months=6){cash=finite(cash);bills=finite(bills);income=finite(income);start=finite(start,1,7);months=finite(months,1,12);let balance=cash;return Array.from({length:months},(_,i)=>{const received=i+1>=start?income:0;balance+=received-bills;return{month:i+1,received,bills,balance,gap:Math.max(0,-balance)};});},
 raise(newPay,newSpending){newPay=finite(newPay);newSpending=finite(newSpending,0,newPay);return{retained:newPay-newSpending,annual:(newPay-newSpending)*12};},
 growth(contribution,addition,change){contribution=finite(contribution);addition=finite(addition);change=finite(change,-100,100);const funded=contribution+addition;return{contribution,addition,funded,market:funded*change/100,total:funded*(1+change/100)};},
 schedule(annual){annual=finite(annual);return{monthly:annual/12,weekly:annual/52};},
 mortgage(payment,principal,other){payment=finite(payment);principal=finite(principal,0,payment);other=finite(other);return{outflow:payment+other,principal,financing:payment-principal,cost:payment-principal+other};},
 audit(includeRepayment){return{spending:120+80+5+15,transfer:200,wrongTotal:includeRepayment?420:220};}
 };
 if(typeof module==='object'&&module.exports)module.exports=api;else root.CourseMath=api;
})(typeof window==='undefined'?globalThis:window);
