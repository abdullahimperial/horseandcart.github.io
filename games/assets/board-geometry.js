(function(root){'use strict';
const uniform=n=>Array.from({length:n+1},(_,i)=>100*i/n);
const book={x:[4,166,328,479,644,806,963,1116,1277,1441,1601,1764].map(n=>n/1767*100),y:[4,122,236,347,458,567,670,773,888].map(n=>n/890*100)};
function cell(n){if(!Number.isInteger(n)||n<1||n>88)throw Error('Square must be 1–88');const row=Math.floor((n-1)/11),offset=(n-1)%11;return{row:7-row,col:row%2?10-offset:offset};}
function center(n,g){const c=cell(n);return{x:(g.x[c.col]+g.x[c.col+1])/2,y:(g.y[c.row]+g.y[c.row+1])/2};}
function valid(g){return g&&['x','y'].every(k=>Array.isArray(g[k])&&g[k].length===(k==='x'?12:9)&&g[k].every((n,i,a)=>Number.isFinite(n)&&n>=0&&n<=100&&(i===0||n-a[i-1]>=0.1)));}
root.BoardGeometry={uniform,book,cell,center,valid};})(typeof window!=='undefined'?window:globalThis);
