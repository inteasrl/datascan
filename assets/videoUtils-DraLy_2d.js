import{f6 as o}from"./dati-CSF_efAI.js";function i(e,r){return new Promise((a,t)=>{e.readyState>=HTMLMediaElement.HAVE_CURRENT_DATA?a():(r(o(e,"canplay",a)),r(o(e,"error",t)))})}export{i as r};
