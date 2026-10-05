(function(root){'use strict';
function create(kind='recovery'){
 const growth=kind==='growth'||kind==='family',deficit=kind==='deficit',card=['Date,Description,Amount'],cheque=['Date,Description,Debit,Credit,Balance'];let balance=10000;
 for(const month of ['07','08','09']){const dt=d=>`2026-${month}-${String(d).padStart(2,'0')}`;const out=(d,name,n)=>{balance-=n;cheque.push(`${dt(d)},${name},${n},,${balance}`);},income=(d,n)=>{balance+=n;cheque.push(`${dt(d)},PAYROLL,,${n},${balance}`);};income(1,deficit?1500:2600);out(2,'RENT',1600);out(3,'EPCOR UTILITY',150);out(4,'PHONE PLAN',70);out(5,'TRANSIT PASS',100);income(15,deficit?1500:2600);if(kind==='family'){balance+=350;cheque.push(`${dt(20)},CANADA CCB,,350,${balance}`);out(26,'RRSP CONTRIBUTION',200);}out(17,'VISA PAYMENT',900);if(!growth)out(19,'LOAN PAYMENT',180);out(21,'CHARITY DONATION',40);if(!growth)out(25,'MONTHLY ACCOUNT FEE',16);out(28,'SAVINGS TRANSFER',200);
 for(const [d,name,n] of [[3,'GROCERY MARKET',240],[12,'GROCERY MARKET',160],[5,'PHARMACY PRESCRIPTION',85],[7,'DENTAL CLINIC',220],[8,'TRAINING FEE',60],[10,'DAYCARE',180],[14,'LIFE INSURANCE',35],[9,'NETFLIX SUBSCRIPTION',18],[11,'COFFEE SHOP',45],[13,'RESTAURANT',120],[20,'ONLINE SHOPPING',deficit?900:180],[17,'PAYMENT THANK YOU',-900]])card.push(`${dt(d)},${name},${n}`);
 if(!growth)card.push(`${dt(23)},PURCHASE INTEREST,65`);
 }
 if(!growth){card.push('2026-09-20,ONLINE SHOPPING,'+(deficit?900:180));card.push('2026-09-29,UNFAMILIAR MERCHANT,45');}
 return {card:card.join('\n'),chequing:cheque.join('\n'),context:{reserve:growth?'18000':'1200',essentials:'3000',months:'3',confirmedSurplus:growth?'1200':'',stability:'stable',debtStatus:growth?'none':'listed'},debts:growth?[]:[{name:'Fictional credit card',balance:'3200',rate:'21.99'}],kind};
}root.ResetDemo={create};})(typeof window!=='undefined'?window:globalThis);
