(this["webpackJsonpopen-react-template"]=this["webpackJsonpopen-react-template"]||[]).push([[0],{24:function(e,t,a){e.exports=a(45)},34:function(e,t,a){e.exports=a.p+"static/media/logo.af02ded3.png"},35:function(e,t,a){e.exports=a.p+"static/media/fist-raised-solid.79b0c06d.svg"},36:function(e,t,a){e.exports=a.p+"static/media/bolt-solid.f0d56404.svg"},37:function(e,t,a){e.exports=a.p+"static/media/creative-commons-brands.0eebeda8.svg"},38:function(e,t,a){e.exports=a.p+"static/media/compact-disc-solid.97d836c6.svg"},39:function(e,t,a){e.exports=a.p+"static/media/chart-bar-solid.f3e11aba.svg"},40:function(e,t,a){e.exports=a.p+"static/media/viruses-solid.a7bb6e76.svg"},41:function(e,t,a){e.exports=a.p+"static/media/features-split-image-01.b6fd77a5.png"},42:function(e,t,a){e.exports=a.p+"static/media/features-split-image-02.939b3131.png"},43:function(e,t,a){e.exports=a.p+"static/media/features-split-image-03.b13034e0.png"},44:function(e,t,a){},45:function(e,t,a){"use strict";a.r(t);var i=a(0),r=a.n(i),n=a(21),l=a.n(n),s=a(11),o=a(6),c=a(2),m=function(e){var t=e.component,a=e.layout,i=Object(c.a)(e,["component","layout"]);return a=void 0===a?function(e){return r.a.createElement(r.a.Fragment,null,e.children)}:a,r.a.createElement(s.a,Object.assign({},i,{render:function(e){return r.a.createElement(a,null,r.a.createElement(t,e))}}))},d=a(10),u=a(3),v=a.n(u),h=a(17),f=r.a.forwardRef((function(e,t){var a=Object(i.useState)(window.innerHeight),n=Object(d.a)(a,2),l=n[0],s=n[1],o=Object(i.useState)([]),c=Object(d.a)(o,2),m=c[0],u=c[1],v=function(){return m.length<=document.querySelectorAll("[class*=reveal-].is-revealed").length},f=function(){if(!v())for(var e=function(e){var t=m[e],a=t.getAttribute("data-reveal-delay"),i=t.getAttribute("data-reveal-offset")?t.getAttribute("data-reveal-offset"):"200";(function(e,t){return e.getBoundingClientRect().top<=l-t})(t.getAttribute("data-reveal-container")?t.closest(t.getAttribute("data-reveal-container")):t,i)&&!t.classList.contains("is-revealed")&&(a&&0!==a?setTimeout((function(){t.classList.add("is-revealed")}),a):t.classList.add("is-revealed"))},t=0;t<m.length;t++)e(t)};Object(i.useImperativeHandle)(t,(function(){return{init:function(){u(document.querySelectorAll("[class*=reveal-]"))}}})),Object(i.useEffect)((function(){"undefined"!==typeof m&&m.length>0&&(v()||(window.addEventListener("scroll",p),window.addEventListener("resize",E)),f())}),[m]);var b=function(){v()&&(window.removeEventListener("scroll",p),window.removeEventListener("resize",E))},p=Object(h.throttle)((function(){b(),f()}),30),E=Object(h.throttle)((function(){s(window.innerHeight)}),30);return Object(i.useEffect)((function(){b(),f()}),[l]),r.a.createElement(r.a.Fragment,null,e.children())}));f.propTypes={children:v.a.func.isRequired};var b=f,p=a(13),E=a(1),g=a.n(E),N=a(7),w=function(e){var t=e.className,a=e.src,n=e.width,l=e.height,s=e.alt,o=Object(c.a)(e,["className","src","width","height","alt"]),m=Object(i.useState)(!1),u=Object(d.a)(m,2),v=u[0],h=u[1],f=Object(i.useRef)(null);Object(i.useEffect)((function(){b(f.current)}),[]);var b=function(e){var t,a,i=document.createElement("img");v||(e.style.display="none",e.before(i),i.src=(t=e.getAttribute("width")||0,a=e.getAttribute("height")||0,'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '.concat(t," ").concat(a,'"%3E%3C/svg%3E')),i.width=e.getAttribute("width"),i.height=e.getAttribute("height"),i.style.opacity="0",e.className&&i.classList.add(e.className),i.remove(),e.style.display="")};return r.a.createElement("img",Object.assign({},o,{ref:f,className:t,src:a,width:n,height:l,alt:s,onLoad:function(){h(!0)}}))};w.defaultProps={src:void 0,width:void 0,height:void 0,alt:void 0};var O=w,y=function(e){var t=e.className,i=Object(c.a)(e,["className"]),n=g()("brand",t);return r.a.createElement("div",Object.assign({},i,{className:n}),r.a.createElement("h1",{className:"m-0"},r.a.createElement(N.a,{to:"/"},r.a.createElement(O,{src:a(34),alt:"Open",width:72,height:72}))))},j=function(e){var t=e.className,a=e.navPosition,n=e.hideNav,l=e.hideSignin,s=e.bottomOuterDivider,o=e.bottomDivider,m=Object(c.a)(e,["className","navPosition","hideNav","hideSignin","bottomOuterDivider","bottomDivider"]),u=Object(i.useState)(!1),v=Object(d.a)(u,2),h=v[0],f=v[1],b=Object(i.useRef)(null),p=Object(i.useRef)(null);Object(i.useEffect)((function(){return h&&E(),document.addEventListener("keydown",O),document.addEventListener("click",j),function(){document.removeEventListener("keydown",O),document.removeEventListener("click",j),w()}}));var E=function(){document.body.classList.add("off-nav-is-active"),b.current.style.maxHeight=b.current.scrollHeight+"px",f(!0)},w=function(){document.body.classList.remove("off-nav-is-active"),b.current&&(b.current.style.maxHeight=null),f(!1)},O=function(e){h&&27===e.keyCode&&w()},j=function(e){b.current&&h&&!b.current.contains(e.target)&&e.target!==p.current&&w()},D=g()("site-header",s&&"has-bottom-divider",t);return r.a.createElement("header",Object.assign({},m,{className:D}),r.a.createElement("div",{className:"container"},r.a.createElement("div",{className:g()("site-header-inner",o&&"has-bottom-divider")},r.a.createElement(y,null),!n&&r.a.createElement(r.a.Fragment,null,r.a.createElement("button",{ref:p,className:"header-nav-toggle",onClick:h?w:E},r.a.createElement("span",{className:"screen-reader"},"Menu"),r.a.createElement("span",{className:"hamburger"},r.a.createElement("span",{className:"hamburger-inner"}))),r.a.createElement("nav",{ref:b,className:g()("header-nav",h&&"is-active")},r.a.createElement("div",{className:"header-nav-inner"},r.a.createElement("ul",{className:g()("list-reset text-xs",a&&"header-nav-".concat(a))},r.a.createElement("li",null,r.a.createElement(N.a,{to:"#0",onClick:w},"Documentation"))),!l&&r.a.createElement("ul",{className:"list-reset header-nav-right"},r.a.createElement("li",null,r.a.createElement(N.a,{to:"#0",className:"button button-primary button-wide-mobile button-sm",onClick:w},"Sign up")))))))))};j.defaultProps={navPosition:"",hideNav:!1,hideSignin:!1,bottomOuterDivider:!1,bottomDivider:!1};var D=j,C=function(e){var t=e.className,a=Object(c.a)(e,["className"]),i=g()("footer-nav",t);return r.a.createElement("nav",Object.assign({},a,{className:i}),r.a.createElement("ul",{className:"list-reset"},r.a.createElement("li",null,r.a.createElement(N.a,{to:"mailto:benjamin@riff.cc"},"Contact")),r.a.createElement("li",null,r.a.createElement(N.a,{to:"https://docs.riff.cc/about"},"About us")),r.a.createElement("li",null,r.a.createElement(N.a,{to:"https://docs.riff.cc/faq"},"FAQs")),r.a.createElement("li",null,r.a.createElement(N.a,{to:"https://docs.riff.cc/help"},"Support"))))},x=function(e){var t=e.className,a=Object(c.a)(e,["className"]),i=g()("footer-social",t);return r.a.createElement("div",Object.assign({},a,{className:i}),r.a.createElement("ul",{className:"list-reset"},r.a.createElement("li",null,r.a.createElement("a",{href:"https://fb.me/riffdotcc"},r.a.createElement("svg",{width:"16",height:"16",viewBox:"0 0 16 16",xmlns:"http://www.w3.org/2000/svg"},r.a.createElement("title",null,"Facebook"),r.a.createElement("path",{d:"M6.023 16L6 9H3V6h3V4c0-2.7 1.672-4 4.08-4 1.153 0 2.144.086 2.433.124v2.821h-1.67c-1.31 0-1.563.623-1.563 1.536V6H13l-1 3H9.28v7H6.023z"})))),r.a.createElement("li",null,r.a.createElement("a",{href:"https://twitter.com/riffdotcc"},r.a.createElement("svg",{width:"16",height:"16",viewBox:"0 0 16 16",xmlns:"http://www.w3.org/2000/svg"},r.a.createElement("title",null,"Twitter"),r.a.createElement("path",{d:"M16 3c-.6.3-1.2.4-1.9.5.7-.4 1.2-1 1.4-1.8-.6.4-1.3.6-2.1.8-.6-.6-1.5-1-2.4-1-1.7 0-3.2 1.5-3.2 3.3 0 .3 0 .5.1.7-2.7-.1-5.2-1.4-6.8-3.4-.3.5-.4 1-.4 1.7 0 1.1.6 2.1 1.5 2.7-.5 0-1-.2-1.5-.4C.7 7.7 1.8 9 3.3 9.3c-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.3 3.1 2.3-1.1.9-2.5 1.4-4.1 1.4H0c1.5.9 3.2 1.5 5 1.5 6 0 9.3-5 9.3-9.3v-.4C15 4.3 15.6 3.7 16 3z"}))))))},k=function(e){var t=e.className,a=e.topOuterDivider,i=e.topDivider,n=Object(c.a)(e,["className","topOuterDivider","topDivider"]),l=g()("site-footer center-content-mobile",a&&"has-top-divider",t);return r.a.createElement("footer",Object.assign({},n,{className:l}),r.a.createElement("div",{className:"container"},r.a.createElement("div",{className:g()("site-footer-inner",i&&"has-top-divider")},r.a.createElement("div",{className:"footer-top space-between text-xxs"},r.a.createElement(y,null),r.a.createElement(x,null)),r.a.createElement("div",{className:"footer-bottom space-between text-xxs invert-order-desktop"},r.a.createElement(C,null),r.a.createElement("div",{className:"footer-copyright"},"Made by Riff.CC and Cruip. ",r.a.createElement("a",{href:"https://github.com/riffcc/open-react-template"},"Open source")," via GPLv3.")))))};k.defaultProps={topOuterDivider:!1,topDivider:!1};var L=k,F=function(e){var t=e.children;return r.a.createElement(r.a.Fragment,null,r.a.createElement(D,{navPosition:"right",className:"reveal-from-bottom"}),r.a.createElement("main",{className:"site-content"},t),r.a.createElement(L,null))},P=a(5),T={types:{topOuterDivider:v.a.bool,bottomOuterDivider:v.a.bool,topDivider:v.a.bool,bottomDivider:v.a.bool,hasBgColor:v.a.bool,invertColor:v.a.bool},defaults:{topOuterDivider:!1,bottomOuterDivider:!1,topDivider:!1,bottomDivider:!1,hasBgColor:!1,invertColor:!1}},A={types:Object(P.a)({},T.types),defaults:Object(P.a)({},T.defaults)},H={types:Object(P.a)({},T.types,{invertMobile:v.a.bool,invertDesktop:v.a.bool,alignTop:v.a.bool,imageFill:v.a.bool}),defaults:Object(P.a)({},T.defaults,{invertMobile:!1,invertDesktop:!1,alignTop:!1,imageFill:!1})},R={types:Object(P.a)({},T.types,{pushLeft:v.a.bool}),defaults:Object(P.a)({},T.defaults,{pushLeft:!1})},S=function(e){var t=e.className,a=Object(c.a)(e,["className"]),i=g()("button-group",t);return r.a.createElement("div",Object.assign({},a,{className:i}))},B=function(e){var t=e.className,a=e.tag,i=e.color,n=e.size,l=e.loading,s=e.wide,o=e.wideMobile,m=e.disabled,d=Object(c.a)(e,["className","tag","color","size","loading","wide","wideMobile","disabled"]),u=g()("button",i&&"button-".concat(i),n&&"button-".concat(n),l&&"is-loading",s&&"button-block",o&&"button-wide-mobile",t),v=a;return r.a.createElement(v,Object.assign({},d,{className:u,disabled:m}))};B.defaultProps={tag:"button",color:"",size:"",loading:!1,wide:!1,wideMobile:!1,disabled:!1};var M=B,W=function(e){var t=e.className,a=e.children,n=e.handleClose,l=e.show,s=e.closeHidden,o=e.video,m=e.videoTag,d=Object(c.a)(e,["className","children","handleClose","show","closeHidden","video","videoTag"]);Object(i.useEffect)((function(){return document.addEventListener("keydown",v),document.addEventListener("click",h),function(){document.removeEventListener("keydown",v),document.removeEventListener("click",h)}})),Object(i.useEffect)((function(){u()}),[d.show]);var u=function(){document.querySelectorAll(".modal.is-active").length?document.body.classList.add("modal-is-active"):document.body.classList.remove("modal-is-active")},v=function(e){27===e.keyCode&&n(e)},h=function(e){e.stopPropagation()},f=g()("modal",l&&"is-active",o&&"modal-video",t);return r.a.createElement(r.a.Fragment,null,l&&r.a.createElement("div",Object.assign({},d,{className:f,onClick:n}),r.a.createElement("div",{className:"modal-inner",onClick:h},o?r.a.createElement("div",{className:"responsive-video"},"iframe"===m?r.a.createElement("iframe",{title:"video",src:o,frameBorder:"0",allowFullScreen:!0}):r.a.createElement("video",{"v-else":!0,controls:!0,src:o})):r.a.createElement(r.a.Fragment,null,!s&&r.a.createElement("button",{className:"modal-close","aria-label":"close",onClick:n}),r.a.createElement("div",{className:"modal-content"},a)))))};W.defaultProps={children:null,show:!1,closeHidden:!1,video:"",videoTag:"iframe"};var z=Object(P.a)({},A.defaults),I=function(e){var t=e.className,a=e.topOuterDivider,n=e.bottomOuterDivider,l=e.topDivider,s=e.bottomDivider,o=e.hasBgColor,m=e.invertColor,u=Object(c.a)(e,["className","topOuterDivider","bottomOuterDivider","topDivider","bottomDivider","hasBgColor","invertColor"]),v=Object(i.useState)(!1),h=Object(d.a)(v,2),f=(h[0],h[1],g()("hero section center-content",a&&"has-top-divider",n&&"has-bottom-divider",o&&"has-bg-color",m&&"invert-color",t)),b=g()("hero-inner section-inner",l&&"has-top-divider",s&&"has-bottom-divider");return r.a.createElement("section",Object.assign({},u,{className:f}),r.a.createElement("div",{className:"container-sm"},r.a.createElement("div",{className:b},r.a.createElement("div",{className:"hero-content"},r.a.createElement("h1",{className:"mt-0 mb-16 reveal-from-bottom","data-reveal-delay":"200"},"Welcome to ",r.a.createElement("span",{className:"text-color-primary",style:{color:"#5658dd"}},"Riff.CC")),r.a.createElement("div",{className:"container-xs"},r.a.createElement("p",{className:"m-0 mb-32 reveal-from-bottom","data-reveal-delay":"400"},"Riff.CC lets you download and share music, games, movies and more - legally. There's 332 things on the site, and even views from the International Space Station! And more on the way all the time."),r.a.createElement("div",{className:"reveal-from-bottom","data-reveal-delay":"600"},r.a.createElement(S,null,r.a.createElement(M,{tag:"a",color:"primary",wideMobile:!0,href:"https://u.riff.cc/"},"Get started"),r.a.createElement(M,{tag:"a",color:"dark",wideMobile:!0,href:"https://github.com/riffcc"},"View on Github"))))))))};I.defaultProps=z;var _=I,G=function(e){var t=e.className,a=e.data,i=e.children,n=e.tag,l=Object(c.a)(e,["className","data","children","tag"]),s=g()("section-header",t),o=n;return r.a.createElement(r.a.Fragment,null,(a.title||a.paragraph)&&r.a.createElement("div",Object.assign({},l,{className:s}),r.a.createElement("div",{className:"container-xs"},i,a.title&&r.a.createElement(o,{className:g()("mt-0",a.paragraph?"mb-16":"mb-0")},a.title),a.paragraph&&r.a.createElement("p",{className:"m-0"},a.paragraph))))};G.defaultProps={children:null,tag:"h2"};var V=G,q=Object(P.a)({},R.defaults),K=function(e){var t=e.className,i=e.topOuterDivider,n=e.bottomOuterDivider,l=e.topDivider,s=e.bottomDivider,o=e.hasBgColor,m=e.invertColor,d=e.pushLeft,u=Object(c.a)(e,["className","topOuterDivider","bottomOuterDivider","topDivider","bottomDivider","hasBgColor","invertColor","pushLeft"]),v=g()("features-tiles section",i&&"has-top-divider",n&&"has-bottom-divider",o&&"has-bg-color",m&&"invert-color",t),h=g()("features-tiles-inner section-inner pt-0",l&&"has-top-divider",s&&"has-bottom-divider"),f=g()("tiles-wrap center-content",d&&"push-left");return r.a.createElement("section",Object.assign({},u,{className:v}),r.a.createElement("div",{className:"container"},r.a.createElement("div",{className:h},r.a.createElement(V,{data:{title:"Media for the world",paragraph:"Everything on the site is legally free, either Creative Commons or public domain. Earn bonus points by uploading content or simply by downloading things and leaving your downloader open. The bonus points can then be spent on perks, including eventually physical merchandise from your favourite artists."},className:"center-content"}),r.a.createElement("div",{className:f},r.a.createElement("div",{className:"tiles-item reveal-from-bottom"},r.a.createElement("div",{className:"tiles-item-inner"},r.a.createElement("div",{className:"features-tiles-item-header"},r.a.createElement("div",{className:"features-tiles-item-image mb-16"},r.a.createElement(O,{src:a(35),alt:"Raised fist",width:128,height:128}))),r.a.createElement("div",{className:"features-tiles-item-content"},r.a.createElement("h4",{className:"mt-0 mb-8"},"Free the world's culture"),r.a.createElement("p",{className:"m-0 text-sm"},"Our mission is to spread the world's culture. Anything interesting and legally free to distribute. That's what we're about.")))),r.a.createElement("div",{className:"tiles-item reveal-from-bottom","data-reveal-delay":"200"},r.a.createElement("div",{className:"tiles-item-inner"},r.a.createElement("div",{className:"features-tiles-item-header"},r.a.createElement("div",{className:"features-tiles-item-image mb-16"},r.a.createElement(O,{src:a(36),alt:"Lightning bolt",width:128,height:128}))),r.a.createElement("div",{className:"features-tiles-item-content"},r.a.createElement("h4",{className:"mt-0 mb-8"},"Lightning fast"),r.a.createElement("p",{className:"m-0 text-sm"},"Everything on Riff is distributed on our network at speeds of at least 1gbps. Popular uploads are seeded at 10gbps, with plans to go to 100gbps as needed.")))),r.a.createElement("div",{className:"tiles-item reveal-from-bottom","data-reveal-delay":"400"},r.a.createElement("div",{className:"tiles-item-inner"},r.a.createElement("div",{className:"features-tiles-item-header"},r.a.createElement("div",{className:"features-tiles-item-image mb-16"},r.a.createElement(O,{src:a(37),alt:"Creative Commons logo",width:128,height:128}))),r.a.createElement("div",{className:"features-tiles-item-content"},r.a.createElement("h4",{className:"mt-0 mb-8"},"The Global Commons"),r.a.createElement("p",{className:"m-0 text-sm"},"Everything on the site is either Creative Commons or public domain, which means you're free to download it and share it with your friends. Or contribute back, and give back to the global commons.")))),r.a.createElement("div",{className:"tiles-item reveal-from-bottom"},r.a.createElement("div",{className:"tiles-item-inner"},r.a.createElement("div",{className:"features-tiles-item-header"},r.a.createElement("div",{className:"features-tiles-item-image mb-16"},r.a.createElement(O,{src:a(38),alt:"Remix CD",width:128,height:128}))),r.a.createElement("div",{className:"features-tiles-item-content"},r.a.createElement("h4",{className:"mt-0 mb-8"},"Remix the world"),r.a.createElement("p",{className:"m-0 text-sm"},"With a world of free culture at your fingertips, you can feel free to remix and share everything on the site.")))),r.a.createElement("div",{className:"tiles-item reveal-from-bottom","data-reveal-delay":"200"},r.a.createElement("div",{className:"tiles-item-inner"},r.a.createElement("div",{className:"features-tiles-item-header"},r.a.createElement("div",{className:"features-tiles-item-image mb-16"},r.a.createElement(O,{src:a(39),alt:"Bar chart",width:128,height:128}))),r.a.createElement("div",{className:"features-tiles-item-content"},r.a.createElement("h4",{className:"mt-0 mb-8"},"Earn bonus points"),r.a.createElement("p",{className:"m-0 text-sm"},"Earn points for keeping your download client open and contributing to the global network. And soon, you'll be able to spend those points on physical merchandise from your favourite artists.")))),r.a.createElement("div",{className:"tiles-item reveal-from-bottom","data-reveal-delay":"400"},r.a.createElement("div",{className:"tiles-item-inner"},r.a.createElement("div",{className:"features-tiles-item-header"},r.a.createElement("div",{className:"features-tiles-item-image mb-16"},r.a.createElement(O,{src:a(40),alt:"Features tile icon 06",width:128,height:128}))),r.a.createElement("div",{className:"features-tiles-item-content"},r.a.createElement("h4",{className:"mt-0 mb-8"},"Fight diseases"),r.a.createElement("p",{className:"m-0 text-sm"},"We distribute very large datasets that are normally difficult for scientists to access, helping fight global diseases like cancer and COVID-19."))))))))};K.defaultProps=q;var J=K,U=Object(P.a)({},H.defaults),Q=function(e){var t=e.className,i=e.topOuterDivider,n=e.bottomOuterDivider,l=e.topDivider,s=e.bottomDivider,o=e.hasBgColor,m=e.invertColor,d=e.invertMobile,u=e.invertDesktop,v=e.alignTop,h=e.imageFill,f=Object(c.a)(e,["className","topOuterDivider","bottomOuterDivider","topDivider","bottomDivider","hasBgColor","invertColor","invertMobile","invertDesktop","alignTop","imageFill"]),b=g()("features-split section",i&&"has-top-divider",n&&"has-bottom-divider",o&&"has-bg-color",m&&"invert-color",t),p=g()("features-split-inner section-inner",l&&"has-top-divider",s&&"has-bottom-divider"),E=g()("split-wrap",d&&"invert-mobile",u&&"invert-desktop",v&&"align-top");return r.a.createElement("section",Object.assign({},f,{className:b}),r.a.createElement("div",{className:"container"},r.a.createElement("div",{className:p},r.a.createElement(V,{data:{title:"a pattern or melody... that forms the basis or accompaniment of a musical composition",paragraph:"Riff is designed to amplify the world's culture, taking a small piece and turning it into an orchestral wonder. We enable you to make a recording and publish it for the world to hear. We unlock culture that may never have surfaced otherwise."},className:"center-content"}),r.a.createElement("div",{className:E},r.a.createElement("div",{className:"split-item"},r.a.createElement("div",{className:"split-item-content center-content-mobile reveal-from-left","data-reveal-container":".split-item"},r.a.createElement("div",{className:"text-xxs text-color-primary fw-600 tt-u mb-8",style:{color:"#5658dd"}},"MEDIA REINVENTED"),r.a.createElement("h3",{className:"mt-0 mb-12"},"Content with a bow on top"),r.a.createElement("p",{className:"m-0"},"We take content and present it with the best view we can give you. Movie posters, links to IMDB\u2122, a list of actors - everything is in front of you. All delivered at 1gbps.")),r.a.createElement("div",{className:g()("split-item-image center-content-mobile reveal-from-bottom",h&&"split-item-image-fill"),"data-reveal-container":".split-item"},r.a.createElement(O,{src:a(41),alt:"Features split 01",width:528,height:396}))),r.a.createElement("div",{className:"split-item"},r.a.createElement("div",{className:"split-item-content center-content-mobile reveal-from-right","data-reveal-container":".split-item"},r.a.createElement("div",{className:"text-xxs text-color-primary fw-600 tt-u mb-8",style:{color:"#5658dd"}},"Welcome to the feed"),r.a.createElement("h3",{className:"mt-0 mb-12"},"The view from 30,000 feet"),r.a.createElement("p",{className:"m-0"},"Everything interesting going on across Riff.CC - all the time. The feed gives you a view of every release uploaded, every user that joins, and every message that someone leaves.")),r.a.createElement("div",{className:g()("split-item-image center-content-mobile reveal-from-bottom",h&&"split-item-image-fill"),"data-reveal-container":".split-item"},r.a.createElement(O,{src:a(42),alt:"Features split 02",width:528,height:396}))),r.a.createElement("div",{className:"split-item"},r.a.createElement("div",{className:"split-item-content center-content-mobile reveal-from-left","data-reveal-container":".split-item"},r.a.createElement("div",{className:"text-xxs text-color-primary fw-600 tt-u mb-8",style:{color:"#5658dd"}},"Front and centre"),r.a.createElement("h3",{className:"mt-0 mb-12"},"Featured Torrents"),r.a.createElement("p",{className:"m-0"},"We take the best of Riff.CC and highlight it, right on the front page. That could be you!")),r.a.createElement("div",{className:g()("split-item-image center-content-mobile reveal-from-bottom",h&&"split-item-image-fill"),"data-reveal-container":".split-item"},r.a.createElement(O,{src:a(43),alt:"Features split 03",width:528,height:396})))))))};Q.defaultProps=U;var $=Q,X=Object(P.a)({},R.defaults),Y=function(e){var t=e.className,a=e.topOuterDivider,i=e.bottomOuterDivider,n=e.topDivider,l=e.bottomDivider,s=e.hasBgColor,o=e.invertColor,m=e.pushLeft,d=Object(c.a)(e,["className","topOuterDivider","bottomOuterDivider","topDivider","bottomDivider","hasBgColor","invertColor","pushLeft"]),u=g()("testimonial section",a&&"has-top-divider",i&&"has-bottom-divider",s&&"has-bg-color",o&&"invert-color",t),v=g()("testimonial-inner section-inner",n&&"has-top-divider",l&&"has-bottom-divider"),h=g()("tiles-wrap",m&&"push-left");return r.a.createElement("section",Object.assign({},d,{className:u}),r.a.createElement("div",{className:"container"},r.a.createElement("div",{className:v},r.a.createElement(V,{data:{title:"What people are saying",paragraph:"We're still young, but here are a few kind words people have had to say about us..."},className:"center-content"}),r.a.createElement("div",{className:h},r.a.createElement("div",{className:"tiles-item reveal-from-right","data-reveal-delay":"200"},r.a.createElement("div",{className:"tiles-item-inner"},r.a.createElement("div",{className:"testimonial-item-content"},r.a.createElement("p",{className:"text-sm mb-0"},'\u2014 Riff is the culmination of 11 years of effort. It began with an album that got millions of downloads, and the simple thought - "what if everyone could do this?". Slowly that grew to become a more important question - what if ',r.a.createElement("i",null,"anyone")," could do this?")),r.a.createElement("div",{className:"testimonial-item-footer text-xs mt-32 mb-0 has-top-divider"},r.a.createElement("span",{className:"testimonial-item-name text-color-high"},"Benjamin Arntzen"),r.a.createElement("span",{className:"text-color-low"}," / "),r.a.createElement("span",{className:"testimonial-item-link"},r.a.createElement("a",{href:"#0"},"Founder, Riff.CC")))))))))};Y.defaultProps=X;var Z=Y,ee=function(e){var t=e.className,a=e.children,i=e.labelHidden,n=e.id,l=Object(c.a)(e,["className","children","labelHidden","id"]),s=g()("form-label",i&&"screen-reader",t);return r.a.createElement("label",Object.assign({},l,{className:s,htmlFor:n}),a)};ee.defaultProps={children:null,labelHidden:!1,id:null};var te=ee,ae=function(e){var t=e.children,a=e.className,i=e.status,n=Object(c.a)(e,["children","className","status"]),l=g()("form-hint",i&&"text-color-".concat(i),a);return r.a.createElement("div",Object.assign({},n,{className:l}),t)};ae.defaultProps={children:null,status:!1};var ie=ae,re=function(e){var t=e.className,a=e.children,i=e.label,n=e.labelHidden,l=e.type,s=e.name,o=e.status,m=e.disabled,d=e.value,u=e.formGroup,v=e.hasIcon,h=e.size,f=e.placeholder,b=e.rows,p=e.hint,E=Object(c.a)(e,["className","children","label","labelHidden","type","name","status","disabled","value","formGroup","hasIcon","size","placeholder","rows","hint"]),N=g()(u&&""!==u&&("desktop"===u?"form-group-desktop":"form-group"),v&&""!==v&&"has-icon-"+v),w=g()("form-input",h&&"form-input-".concat(h),o&&"form-".concat(o),t),O="textarea"===l?"textarea":"input";return r.a.createElement(r.a.Fragment,null,i&&r.a.createElement(te,{labelHidden:n,id:E.id},i),r.a.createElement("div",{className:N},r.a.createElement(O,Object.assign({},E,{type:"textarea"!==l?l:null,className:w,name:s,disabled:m,value:d,placeholder:f,rows:"textarea"===l?b:null})),a),p&&r.a.createElement(ie,{status:o},p))};re.defaultProps={children:null,label:"",labelHidden:!1,type:"text",name:void 0,status:"",disabled:!1,value:void 0,formGroup:null,hasIcon:null,size:"",placeholder:"",rows:3,hint:null};var ne=Object(P.a)({},A.defaults,{split:!1}),le=function(e){var t=e.className,a=e.topOuterDivider,i=e.bottomOuterDivider,n=e.topDivider,l=e.bottomDivider,s=e.hasBgColor,o=e.invertColor,m=e.split,d=Object(c.a)(e,["className","topOuterDivider","bottomOuterDivider","topDivider","bottomDivider","hasBgColor","invertColor","split"]),u=g()("cta section center-content-mobile reveal-from-bottom",a&&"has-top-divider",i&&"has-bottom-divider",s&&"has-bg-color",o&&"invert-color",t),v=g()("cta-inner section-inner",n&&"has-top-divider",l&&"has-bottom-divider",m&&"cta-split");return r.a.createElement("section",Object.assign({},d,{className:u}),r.a.createElement("div",{className:"container"},r.a.createElement("div",{className:v},r.a.createElement("div",{className:"cta-slogan"},r.a.createElement("h3",{className:"m-0"},"Ready to join?"),r.a.createElement("h3",{className:"m-0"},r.a.createElement("a",{href:"mailto:benjamin@riff.cc"},r.a.createElement("svg",{width:"16",height:"12",xmlns:"http://www.w3.org/2000/svg"},r.a.createElement("path",{d:"M9 5H1c-.6 0-1 .4-1 1s.4 1 1 1h8v5l7-6-7-6v5z",fill:"#376DF9"})),"Click me."))))))};le.defaultProps=ne;var se=le,oe=function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement(_,{className:"illustration-section-01"}),r.a.createElement(J,null),r.a.createElement($,{invertMobile:!0,topDivider:!0,imageFill:!0,className:"illustration-section-02"}),r.a.createElement(Z,{topDivider:!0}),r.a.createElement(se,{split:!0}))};p.a.initialize(Object({NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0}).REACT_APP_GA_CODE);var ce=function(){var e=Object(i.useRef)(),t=Object(s.f)();return Object(i.useEffect)((function(){var a=t.pathname;document.body.classList.add("is-loaded"),e.current.init(),function(e){p.a.set({page:e}),p.a.pageview(e)}(a)}),[t]),r.a.createElement(b,{ref:e,children:function(){return r.a.createElement(s.c,null,r.a.createElement(m,{exact:!0,path:"/",component:oe,layout:F}))}})};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));a(44);var me=Object(o.a)();l.a.render(r.a.createElement(s.b,{history:me},r.a.createElement(ce,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[24,1,2]]]);
//# sourceMappingURL=main.fa837730.chunk.js.map