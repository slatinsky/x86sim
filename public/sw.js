if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let s=Promise.resolve();return r[e]||(s=new Promise((async s=>{if("document"in self){const r=document.createElement("script");r.src=e,document.head.appendChild(r),r.onload=s}else importScripts(e),s()}))),s.then((()=>{if(!r[e])throw new Error(`Module ${e} didn’t register its module`);return r[e]}))},s=(s,r)=>{Promise.all(s.map(e)).then((e=>r(1===e.length?e[0]:e)))},r={require:Promise.resolve(s)};self.define=(s,i,n)=>{r[s]||(r[s]=Promise.resolve().then((()=>{let r={};const c={uri:location.origin+s.slice(1)};return Promise.all(i.map((s=>{switch(s){case"exports":return r;case"module":return c;default:return e(s)}}))).then((e=>{const s=n(...e);return r.default||(r.default=s),r}))})))}}define("./sw.js",["./workbox-cf684d81"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/128.png",revision:"04d54e742fb103b5dd618c2842124913"},{url:"assets/192.png",revision:"3678dc75ec0c9e2fe4569d3feb9bdc20"},{url:"assets/512.png",revision:"9eb47f270ad4b3cc1ba7458a94856003"},{url:"assets/keyboard.png",revision:"67066f0231ad7ae427707b371f2d5c17"},{url:"build/bundle.css",revision:"494ffab68b5be0f37907dcca0f82bbcb"},{url:"build/bundle.js",revision:"d7ec196b7e78027953bd5559854c36cb"},{url:"favicon.png",revision:"20316ee777424ccaa6046966f96c545e"},{url:"global.css",revision:"ab1f210436bd9ab8f7b734f9334c1fa3"},{url:"index.html",revision:"cb358f28e061e4c7fac249ffabbe5128"},{url:"manifest.json",revision:"b0e7d9850abc6532af0ffea183378865"}],{})}));
//# sourceMappingURL=sw.js.map
