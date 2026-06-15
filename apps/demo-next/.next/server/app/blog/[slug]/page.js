(()=>{var e={};e.id=308,e.ids=[308],e.modules={2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},4153:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>a.a,__next_app__:()=>p,originalPathname:()=>c,pages:()=>d,routeModule:()=>f,tree:()=>l}),r(9912),r(9800),r(8714);var n=r(3653),o=r(4966),i=r(6070),a=r.n(i),s=r(2555),u={};for(let e in s)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(u[e]=()=>s[e]);r.d(t,u);let l=["",{children:["blog",{children:["[slug]",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,9912)),"/Users/ryusei/Mywork/site-map/apps/demo-next/src/app/blog/[slug]/page.tsx"]}]},{}]},{}]},{layout:[()=>Promise.resolve().then(r.bind(r,9800)),"/Users/ryusei/Mywork/site-map/apps/demo-next/src/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,8714,23)),"next/dist/client/components/not-found-error"]}],d=["/Users/ryusei/Mywork/site-map/apps/demo-next/src/app/blog/[slug]/page.tsx"],c="/blog/[slug]/page",p={require:r,loadChunk:()=>Promise.resolve()},f=new n.AppPageRouteModule({definition:{kind:o.x.APP_PAGE,page:"/blog/[slug]/page",pathname:"/blog/[slug]",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:l}})},4460:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,307,23))},9912:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>l,generateMetadata:()=>u,generateStaticParams:()=>s});var n=r(9222),o=r(3023),i=r(4050);let a={"post-1":{title:"Getting Started with site-map",date:"2026-06-01",content:`
## インストール

\`\`\`bash
npm install @site-map/react @site-map/core
\`\`\`

## 基本的な使い方

\`\`\`tsx
import { SiteMap } from '@site-map/react'

export default function Layout({ children }) {
  return (
    <>
      {children}
      <SiteMap config={{ baseUrl: 'https://your-site.com' }} />
    </>
  )
}
\`\`\`

## strategy の選択

- \`auto\`（デフォルト）: sitemap.xml を取得、失敗時は crawl へフォールバック
- \`sitemap\`: sitemap.xml のみ使用
- \`crawl\`: BFS でリンクをクロール
- \`static\`: URL リストを直接指定
    `},"post-2":{title:"Vue 3 Integration Guide",date:"2026-06-10",content:`
## インストール

\`\`\`bash
npm install @site-map/vue @site-map/core
\`\`\`

## style.css の読み込み

\`\`\`ts
import '@site-map/vue/dist/style.css'
\`\`\`

## コンポーネントの使用

\`\`\`vue
<script setup>
import { SiteMap } from '@site-map/vue'
const config = { baseUrl: 'https://your-site.com' }
</script>

<template>
  <SiteMap :config="config" />
</template>
\`\`\`
    `}};function s(){return Object.keys(a).map(e=>({slug:e}))}async function u({params:e}){let{slug:t}=await e;return{title:a[t]?.title??"Post"}}async function l({params:e}){let{slug:t}=await e,r=a[t];return r||(0,i.notFound)(),(0,n.jsxs)("main",{className:"page",children:[n.jsx(o.default,{href:"/blog",style:{fontSize:"0.875rem",color:"var(--muted)"},children:"← Blog 一覧へ"}),(0,n.jsxs)("div",{className:"page-header",style:{marginTop:"20px"},children:[n.jsx("p",{style:{fontSize:"0.75rem",color:"var(--muted)",marginBottom:"8px"},children:r.date}),n.jsx("h1",{children:r.title})]}),n.jsx("div",{className:"card",children:n.jsx("pre",{style:{whiteSpace:"pre-wrap",fontFamily:"inherit",fontSize:"0.9rem",background:"none",padding:0,color:"var(--text)"},children:r.content.trim()})})]})}},4050:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{ReadonlyURLSearchParams:function(){return a},RedirectType:function(){return n.RedirectType},notFound:function(){return o.notFound},permanentRedirect:function(){return n.permanentRedirect},redirect:function(){return n.redirect}});let n=r(9018),o=r(2516);class i extends Error{constructor(){super("Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams")}}class a extends URLSearchParams{append(){throw new i}delete(){throw new i}set(){throw new i}sort(){throw new i}}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},2516:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{isNotFoundError:function(){return o},notFound:function(){return n}});let r="NEXT_NOT_FOUND";function n(){let e=Error(r);throw e.digest=r,e}function o(e){return"object"==typeof e&&null!==e&&"digest"in e&&e.digest===r}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},502:(e,t)=>{"use strict";var r;Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"RedirectStatusCode",{enumerable:!0,get:function(){return r}}),function(e){e[e.SeeOther=303]="SeeOther",e[e.TemporaryRedirect=307]="TemporaryRedirect",e[e.PermanentRedirect=308]="PermanentRedirect"}(r||(r={})),("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},9018:(e,t,r)=>{"use strict";var n;Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{RedirectType:function(){return n},getRedirectError:function(){return u},getRedirectStatusCodeFromError:function(){return m},getRedirectTypeFromError:function(){return f},getURLFromRedirectError:function(){return p},isRedirectError:function(){return c},permanentRedirect:function(){return d},redirect:function(){return l}});let o=r(4580),i=r(2934),a=r(502),s="NEXT_REDIRECT";function u(e,t,r){void 0===r&&(r=a.RedirectStatusCode.TemporaryRedirect);let n=Error(s);n.digest=s+";"+t+";"+e+";"+r+";";let i=o.requestAsyncStorage.getStore();return i&&(n.mutableCookies=i.mutableCookies),n}function l(e,t){void 0===t&&(t="replace");let r=i.actionAsyncStorage.getStore();throw u(e,t,(null==r?void 0:r.isAction)?a.RedirectStatusCode.SeeOther:a.RedirectStatusCode.TemporaryRedirect)}function d(e,t){void 0===t&&(t="replace");let r=i.actionAsyncStorage.getStore();throw u(e,t,(null==r?void 0:r.isAction)?a.RedirectStatusCode.SeeOther:a.RedirectStatusCode.PermanentRedirect)}function c(e){if("object"!=typeof e||null===e||!("digest"in e)||"string"!=typeof e.digest)return!1;let[t,r,n,o]=e.digest.split(";",4),i=Number(o);return t===s&&("replace"===r||"push"===r)&&"string"==typeof n&&!isNaN(i)&&i in a.RedirectStatusCode}function p(e){return c(e)?e.digest.split(";",3)[2]:null}function f(e){if(!c(e))throw Error("Not a redirect error");return e.digest.split(";",2)[1]}function m(e){if(!c(e))throw Error("Not a redirect error");return Number(e.digest.split(";",4)[3])}(function(e){e.push="push",e.replace="replace"})(n||(n={})),("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),n=t.X(0,[557,206],()=>r(4153));module.exports=n})();