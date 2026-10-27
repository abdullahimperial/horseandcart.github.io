(function(root){'use strict';
const uniform=n=>Array.from({length:n+1},(_,i)=>100*i/n);
const book={x:[17,159,285,410,535,660,784,911,1040,1168,1298].map(n=>n/1312*100),y:[150,251,346,432,522,618,705,793,877,967,1077].map(n=>n/1199*100)};
function cell(n){if(!Number.isInteger(n)||n<1||n>100)throw Error('Square must be 1–100');const row=Math.floor((n-1)/10),offset=(n-1)%10;return{row:9-row,col:row%2?9-offset:offset};}
function center(n,g){const c=cell(n);return{x:(g.x[c.col]+g.x[c.col+1])/2,y:(g.y[c.row]+g.y[c.row+1])/2};}
function valid(g){return g&&['x','y'].every(k=>Array.isArray(g[k])&&g[k].length===11&&g[k].every((n,i,a)=>Number.isFinite(n)&&n>=0&&n<=100&&(i===0||n-a[i-1]>=0.1)));}
const snakes={18:4,48:12,67:46,83:59},ladders={5:16,25:36,44:57,52:69,64:77,85:96};
const labels={5:'Emergency Fund (Stay Prepared)',7:'Unexpected Expense (Setback)',10:'Invest in Yourself (Education)',18:'Lifestyle Creep (Spend More)',25:'Start a Side Business (Extra Income)',44:'RESP/RDSP (Tax-Free Growth)',48:'High-Interest Debt (Setback)',49:'Generational Wealth',52:'Government Grants & Benefits',64:'Employer Top-up / Raise',67:'Job Loss (Income Drop)',83:'Market Crash (Big Losses)',85:'Smart Investing',90:'Paid-off Home'};
root.BoardGeometry={uniform,book,cell,center,valid,snakes,ladders,labels};})(typeof window!=='undefined'?window:globalThis);
