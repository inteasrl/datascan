import{a as c}from"./ProgramTemplate-DOCrwH8D.js";import{E as g,e as y,o as j,b as F}from"./ProgramTemplate-DOCrwH8D.js";import{R as A,s as O}from"./FramebufferObject-BPt4uYla.js";import{dA as w}from"./dati-om3ji9ZD.js";import{t as p}from"./NestedMap-BwbkO4RU.js";import"./memoryEstimations-B2ASMU-5.js";import"./style-BAjNHWjv.js";class x{constructor(e){this._rctx=e,this._store=new p}dispose(){this._store.forAll(e=>e.dispose()),this._store.clear()}acquire(e,t,o,n){const r=this._store.get(e,t);if(r!=null)return r.ref(),r;const s=new c(this._rctx,e,t,o,n);return s.ref(),this._store.set(e,t,s),s}get test(){}}function l(i){const{options:e,value:t}=i;return typeof e[t]=="number"}function b(i){let e="";for(const t in i){const o=i[t];if(typeof o=="boolean")o&&(e+=`#define ${t}
`);else if(typeof o=="number")e+=`#define ${t} ${o.toFixed()}
`;else if(typeof o=="object")if(l(o)){const{value:n,options:r,namespace:s}=o,f=s?`${s}_`:"";for(const a in r)e+=`#define ${f}${a} ${r[a].toFixed()}
`;e+=`#define ${t} ${f}${n}
`}else{const n=o.options;let r=0;for(const s in n)e+=`#define ${n[s]} ${(r++).toFixed()}
`;e+=`#define ${t} ${n[o.value]}
`}}return e}export{g as BufferObject,A as FramebufferObject,c as Program,x as ProgramCache,O as Renderbuffer,y as ShaderCompiler,w as Texture,j as VertexArrayObject,F as createProgram,b as glslifyDefineMap};
