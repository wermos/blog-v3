const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/mermaid.core.CmMEVzi4.js","_astro/_commonjsHelpers.Cpj98o6Y.js"])))=>i.map(i=>d[i]);
const k="modulepreload",v=function(o){return"/"+o},g={},y=function(m,s,u){let c=Promise.resolve();if(s&&s.length>0){let t=function(r){return Promise.all(r.map(a=>Promise.resolve(a).then(d=>({status:"fulfilled",value:d}),d=>({status:"rejected",reason:d}))))};document.getElementsByTagName("link");const e=document.querySelector("meta[property=csp-nonce]"),l=e?.nonce||e?.getAttribute("nonce");c=t(s.map(r=>{if(r=v(r),r in g)return;g[r]=!0;const a=r.endsWith(".css"),d=a?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${r}"]${d}`))return;const i=document.createElement("link");if(i.rel=a?"stylesheet":k,a||(i.as="script"),i.crossOrigin="",i.href=r,l&&i.setAttribute("nonce",l),document.head.appendChild(i),a)return new Promise((f,b)=>{i.addEventListener("load",f),i.addEventListener("error",()=>b(new Error(`Unable to preload CSS for ${r}`)))})}))}function n(t){const e=new Event("vite:preloadError",{cancelable:!0});if(e.payload=t,window.dispatchEvent(e),!e.defaultPrevented)throw t}return c.then(t=>{for(const e of t||[])e.status==="rejected"&&n(e.reason);return m().catch(n)})},h=()=>document.querySelectorAll("pre.mermaid").length>0;h()?(console.log("[astro-mermaid] Mermaid diagrams detected, loading mermaid.js..."),y(()=>import("./mermaid.core.CmMEVzi4.js").then(o=>o.b6),__vite__mapDeps([0,1])).then(async({default:o})=>{const m=[];if(m&&m.length>0){console.log("[astro-mermaid] Registering",m.length,"icon packs");const n=m.map(t=>({name:t.name,loader:new Function("return "+t.loader)()}));await o.registerIconPacks(n)}const s={startOnLoad:!1,theme:"default"},u={light:"default",dark:"dark"};async function c(){console.log("[astro-mermaid] Initializing mermaid diagrams...");const n=document.querySelectorAll("pre.mermaid");if(console.log("[astro-mermaid] Found",n.length,"mermaid diagrams"),n.length===0)return;let t=s.theme;{const e=document.documentElement.getAttribute("data-theme");t=u[e]||s.theme,console.log("[astro-mermaid] Using theme:",t)}o.initialize({...s,theme:t,gitGraph:{mainBranchName:"main",showCommitLabel:!0,showBranches:!0,rotateCommitLabel:!0}});for(const e of n){if(e.hasAttribute("data-processed"))continue;e.hasAttribute("data-diagram")||e.setAttribute("data-diagram",e.textContent||"");const l=e.getAttribute("data-diagram")||"",r="mermaid-"+Math.random().toString(36).slice(2,11);console.log("[astro-mermaid] Rendering diagram:",r);try{const a=document.getElementById(r);a&&a.remove();const{svg:d}=await o.render(r,l);e.innerHTML=d,e.setAttribute("data-processed","true"),console.log("[astro-mermaid] Successfully rendered diagram:",r)}catch(a){console.error("[astro-mermaid] Mermaid rendering error for diagram:",r,a),e.innerHTML=`<div style="color: red; padding: 1rem; border: 1px solid red; border-radius: 0.5rem;">
            <strong>Error rendering diagram:</strong><br/>
            ${a.message||"Unknown error"}
          </div>`,e.setAttribute("data-processed","true")}}}c(),new MutationObserver(t=>{for(const e of t)e.type==="attributes"&&e.attributeName==="data-theme"&&(document.querySelectorAll("pre.mermaid[data-processed]").forEach(l=>{l.removeAttribute("data-processed")}),c())}).observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]}),document.addEventListener("astro:after-swap",()=>{h()&&c()})}).catch(o=>{console.error("[astro-mermaid] Failed to load mermaid:",o)})):console.log("[astro-mermaid] No mermaid diagrams found on this page, skipping mermaid.js load");const p=document.createElement("style");p.textContent=`
            /* Prevent layout shifts by setting minimum height */
            pre.mermaid {
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 2rem 0;
              padding: 1rem;
              background-color: transparent;
              border: none;
              overflow: auto;
              min-height: 200px; /* Prevent layout shift */
              position: relative;
            }
            
            /* Loading state with skeleton loader */
            pre.mermaid:not([data-processed]) {
              background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
              background-size: 200% 100%;
              animation: shimmer 1.5s infinite;
            }
            
            /* Dark mode skeleton loader */
            [data-theme="dark"] pre.mermaid:not([data-processed]) {
              background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
              background-size: 200% 100%;
            }
            
            @keyframes shimmer {
              0% {
                background-position: -200% 0;
              }
              100% {
                background-position: 200% 0;
              }
            }
            
            /* Show processed diagrams with smooth transition */
            pre.mermaid[data-processed] {
              animation: none;
              background: transparent;
              min-height: auto; /* Allow natural height after render */
            }
            
            /* Ensure responsive sizing for mermaid SVGs */
            pre.mermaid svg {
              max-width: 100%;
              height: auto;
            }
            
            /* Optional: Add subtle background for better visibility */
            @media (prefers-color-scheme: dark) {
              pre.mermaid[data-processed] {
                background-color: rgba(255, 255, 255, 0.02);
                border-radius: 0.5rem;
              }
            }
            
            @media (prefers-color-scheme: light) {
              pre.mermaid[data-processed] {
                background-color: rgba(0, 0, 0, 0.02);
                border-radius: 0.5rem;
              }
            }
            
            /* Respect user's color scheme preference */
            [data-theme="dark"] pre.mermaid[data-processed] {
              background-color: rgba(255, 255, 255, 0.02);
              border-radius: 0.5rem;
            }
            
            [data-theme="light"] pre.mermaid[data-processed] {
              background-color: rgba(0, 0, 0, 0.02);
              border-radius: 0.5rem;
            }
          `;document.head.appendChild(p);export{y as _};
