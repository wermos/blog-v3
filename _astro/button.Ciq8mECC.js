import{a as c}from"./index.DnFo47G-.js";import{d as C,j as w,S as j,c as A}from"./index.iQDO0C3W.js";/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V=r=>r.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),N=r=>r.replace(/^([A-Z])|[\s-_]+(\w)/g,(t,e,n)=>n?n.toUpperCase():e.toLowerCase()),f=r=>{const t=N(r);return t.charAt(0).toUpperCase()+t.slice(1)},y=(...r)=>r.filter((t,e,n)=>!!t&&t.trim()!==""&&n.indexOf(t)===e).join(" ").trim(),_=r=>{for(const t in r)if(t.startsWith("aria-")||t==="role"||t==="title")return!0};/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var E={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=c.forwardRef(({color:r="currentColor",size:t=24,strokeWidth:e=2,absoluteStrokeWidth:n,className:i="",children:a,iconNode:v,...l},m)=>c.createElement("svg",{ref:m,...E,width:t,height:t,stroke:r,strokeWidth:n?Number(e)*24/Number(t):e,className:y("lucide",i),...!a&&!_(l)&&{"aria-hidden":"true"},...l},[...v.map(([s,o])=>c.createElement(s,o)),...Array.isArray(a)?a:[a]]));/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P=(r,t)=>{const e=c.forwardRef(({className:n,...i},a)=>c.createElement(L,{ref:a,iconNode:t,className:y(`lucide-${V(f(r))}`,`lucide-${r}`,n),...i}));return e.displayName=f(r),e},h=r=>typeof r=="boolean"?`${r}`:r===0?"0":r,x=C,O=(r,t)=>e=>{var n;if(t?.variants==null)return x(r,e?.class,e?.className);const{variants:i,defaultVariants:a}=t,v=Object.keys(i).map(s=>{const o=e?.[s],u=a?.[s];if(o===null)return null;const d=h(o)||h(u);return i[s][d]}),l=e&&Object.entries(e).reduce((s,o)=>{let[u,d]=o;return d===void 0||(s[u]=d),s},{}),m=t==null||(n=t.compoundVariants)===null||n===void 0?void 0:n.reduce((s,o)=>{let{class:u,className:d,...p}=o;return Object.entries(p).every(k=>{let[b,g]=k;return Array.isArray(g)?g.includes({...a,...l}[b]):{...a,...l}[b]===g})?[...s,u,d]:s},[]);return x(r,v,m,e?.class,e?.className)},$=O("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",{variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/90",destructive:"bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",outline:"border bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-9 px-4 py-2 has-[>svg]:px-3",sm:"h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",lg:"h-10 rounded-md px-6 has-[>svg]:px-4",icon:"size-9"}},defaultVariants:{variant:"default",size:"default"}});function R({className:r,variant:t,size:e,asChild:n=!1,...i}){const a=n?j:"button";return w.jsx(a,{"data-slot":"button",className:A($({variant:t,size:e,className:r})),...i})}export{R as B,$ as b,P as c};
