(function(e,s){typeof exports=="object"&&typeof module<"u"?s(exports,require("react")):typeof define=="function"&&define.amd?define(["exports","react"],s):(e=typeof globalThis<"u"?globalThis:e||self,s(e["react-hooks-deep-state"]={},e.React))})(this,function(e,s){"use strict";function p(d){const[y,a]=s.useState(d||{}),c=o=>o!==null&&typeof o=="object"&&!Array.isArray(o),l=s.useCallback((o,i,S=!0)=>{a(b=>{const f=o.split("."),u={...b};let t=u;for(let r=0;r<f.length;r++){const n=f[r];if(typeof n=="symbol")throw new Error("Symbol keys are not supported");r===f.length-1?S||!c(i)?t[n]=i:t[n]={...t[n],...i}:(c(t[n])||(t[n]={}),t=t[n])}return u})},[]);return[y,l]}e.useDeepState=p,Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})});
