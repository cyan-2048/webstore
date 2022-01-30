last_check=null!=localStorage.versions?last_check=JSON.parse(localStorage.versions):last_check={non_existed:1},proxy=null!=localStorage.proxy?proxy=JSON.parse(localStorage.proxy):proxy="https://api.allorigins.win/raw?url=",ratings=null!=localStorage.ratings?ratings=JSON.parse(localStorage.ratings):ratings="https://bhackers.uber.space/srs/v1",database=null!=localStorage.database?database=JSON.parse(localStorage.database):database="https://banana-hackers.gitlab.io/store-db/data.json",new_versions={},(()=>{index=0;var e=!1;function t(){if(index+=1,index==data.apps.length||e)return index=0,e||(localStorage.versions=JSON.stringify(last_check)),void(e=!1);update()}cancel_update=()=>{e=!0},update=()=>{let e=data.apps[index];function a(a){last_check[e.slug]&&last_check[e.slug]!=a.version&&(new_versions[e.slug]={from:last_check[e.slug],to:a.version}),last_check[e.slug]=a.version,t()}fetch(e.download.manifest).then((e=>e.json())).then((e=>a(e))).catch((n=>{console.error(n),fetch(proxy+e.download.manifest).then((e=>e.json())).then((e=>a(e))).catch((e=>t()))}))}})();fetch(database).then((e=>e.json())).catch((e=>{console.error(e),alert("can't download database please reload the page")})).then((t=>{data=t,"complete"===document.readyState||"interactive"===document.readyState?e():window.addEventListener("DOMContentLoaded",(()=>{let t;e(t)})),fetch(ratings+"/download_counter/").then((e=>e.json())).then((e=>{data.dl=e;let t=document.getElementById("sort");var a;"SEL"==t.tagName?((a=document.createElement("opt")).innerHTML='<i class="fas fa-fire-alt"></i>Popularity',a.setAttribute("value","pop"),t.querySelector("drop").appendChild(a)):((a=document.createElement("option")).innerText="Popularity",a.value="pop",t.add(a))})).catch((e=>{console.error(e),alert("can't download download counts, store will not have download count functionality")})).then((()=>{fetch(ratings+"/ratings").then((e=>e.json())).then((e=>{data.ratings=e;let t=document.getElementById("sort");var a;"SEL"==t.tagName?((a=document.createElement("opt")).innerHTML='<i class="fas fa-star"></i>Ratings',a.setAttribute("value","ra"),t.querySelector("drop").appendChild(a)):((a=document.createElement("option")).innerText="Ratings",a.value="ra",t.add(a))})).catch((e=>{console.error(e),alert("can't download download ratings, store will not have ratings functionality")}))}))}));const e=e=>{var a=null==e?"app":document.querySelector("#category .selected").dataset.name;document.getElementById("category").innerHTML="<style></style>";var r=[];r.push("app");for(let e in data.categories)r.push(data.categories[e].name);var c="";r.forEach(((e,t)=>{var n=document.getElementById("category"),l=document.createElement("button"),o=e.toLocaleLowerCase(),s="fas fa-store";try{s=data.categories[o].icon}catch(e){}"app"==e?l.innerText=" All Apps":(l.innerText=" "+e,null!=data.categories[o].description&&(l.title=data.categories[o].description));var d=document.createElement("i");d.className=s,l.insertBefore(d,l.childNodes[0]),l.dataset.name=o,c+=`[data-sel="${o}"] + #apps div.${o}`,t==r.length-1?c+="{ display: flex !important}":c+=",",n.parentElement.dataset.sel=a,n.appendChild(l)})),document.querySelector(`#category [data-name='${a}']`).className="selected",document.getElementById("category").querySelector("style").innerHTML=c,t(),document.getElementById("apps").children[0].innerHTML="";for(let e of data.apps){var s=document.createElement("div"),d=document.createElement("div");d.className="header";var i=document.createElement("img");i.src=e.icon,i.alt=" ",d.appendChild(i);var u=document.createElement("div");u.className="cat",u.innerText=e.meta.categories.map((e=>l(e))).join(", ");var p=document.createElement("div");p.className="na",p.innerText=e.name;var m=document.createElement("div");m.className="au",m.innerText=e.author[0].split("<")[0];var g=document.createElement("div");g.className="teco",g.appendChild(u),g.appendChild(p),g.appendChild(m),d.appendChild(g),s.appendChild(d),s.appendChild(document.createTextNode(o(e.description,206)));var h=document.createElement("div");h.className="spacer",s.appendChild(h);var y=document.createElement("a");y.className="info",y.innerHTML='<i class="fas fa-info-circle"></i> Info',y.href=`#${e.slug}`;var f=document.createElement("a");f.href=e.download.url,f.innerHTML='<i class="fas fa-file-download"></i> Download';var v=null;navigator.userAgent.toLocaleLowerCase().includes("kaios")||((v=document.createElement("button")).className="share",v.innerHTML='<i class="far fa-clipboard"></i> Share');var E=document.createElement("div");E.className="bucon",E.appendChild(y),E.appendChild(f),null!=v&&E.appendChild(v),s.appendChild(E),s.className="app",s.dataset.slug=e.slug;for(let t of e.meta.categories)s.classList.add(t);document.getElementById("apps").children[0].appendChild(s)}null!=e?location.hash="":(document.querySelector("#splash #image").className="loaded",document.getElementById("splash").style="opacity: 0; visibility: hidden"),""!=location.hash&&n(void 0),document.getElementById("le").innerText=document.querySelectorAll('[data-sel="app"] + #apps .app').length};function t(t){switch(data.apps.sort(((e,t)=>e.name.localeCompare(t.name))),document.getElementById("sort").selectedOptions?document.getElementById("sort").selectedOptions[0].value:document.querySelector("#sort cho").getAttribute("value")){case"cab":data.apps.sort(((e,t)=>e.meta.categories[0].localeCompare(t.meta.categories[0])));break;case"ra":data.apps.sort(((e,t)=>{var a=0;return!data.ratings[e.slug]||(data.ratings[t.slug]&&(a=data.ratings[t.slug].average_rating),data.ratings[e.slug].average_rating<a)}));break;case"pop":data.apps.sort(((e,t)=>{var a=0;return!data.dl[e.slug]||(data.dl[t.slug]&&(a=data.dl[t.slug]),data.dl[e.slug]<a)}))}null!=t&&t.target&&e(t)}window.addEventListener("DOMContentLoaded",(()=>{if((navigator.userAgent.toLocaleLowerCase().includes("kaios")?document.querySelector("sel"):document.querySelector("select")).remove(),"SELECT"==document.getElementById("sort").tagName&&(document.getElementById("sort").onchange=t),document.getElementById("category").onclick=e=>{let t=e.target;if("BUTTON"==t.tagName){t.parentElement.parentElement.dataset.sel=t.dataset.name;for(let e of t.parentElement.children)e.removeAttribute("class");t.className="selected",document.getElementById("le").innerText=document.querySelectorAll(`[data-sel="${t.dataset.name}"] + #apps .${t.dataset.name}`).length}},!navigator.userAgent.toLocaleLowerCase().includes("kaios")){var e=document.createElement("button");e.id="scrollup";var a=document.createElement("i");a.className="fas fa-chevron-up",e.appendChild(a),document.body.appendChild(e),/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())?e.style.transform="none":document.getElementById("apps").addEventListener("wheel",(function(t){if(0!=document.body.scrollTop)if(t.deltaY<0&&"translateY(70px)"==e.style.transform)e.style.transform="none";else{if(!(t.deltaY>0&&"none"==e.style.transform))return;e.style.transform="translateY(70px)"}else e.style.transform="translateY(70px)"}))}})),document.onclick=e=>{if("OPT"==e.target.tagName){document.activeElement.blur();let a=e.target.parentElement.parentElement.children[0];a.innerHTML="";for(let t of e.target.childNodes){let e=t.cloneNode(!0);a.appendChild(e)}a.setAttribute("value",e.target.getAttribute("value")),t(e)}else"share"==e.target.className?function(e){if(navigator.clipboard)navigator.clipboard.writeText(e).then((function(){console.log("Async: Copying to clipboard was successful!")}),(function(e){console.error("Async: Could not copy text: ",e)}));else{var t=document.createElement("textarea");t.value=e,t.style.top="0",t.style.left="0",t.style.position="fixed",document.body.appendChild(t),t.focus(),t.select();try{var a=document.execCommand("copy")?"successful":"unsuccessful";console.log("Fallback: Copying text command was "+a)}catch(e){console.error("Fallback: Oops, unable to copy",e)}document.body.removeChild(t)}}(location.origin+"/#"+e.target.parentElement.parentElement.dataset.slug):"scrollup"==e.target.id?document.body.scrollTo({top:0,behavior:"smooth"}):"cards"==e.target.id&&document.querySelector("#appcard .close").click()},window.onhashchange=n;var a=!1;function n(e){let t=location.hash.split("#")[1],n=document.querySelector(`.app[data-slug="${t}"]`);var r=200;if("app"==document.querySelector("#category").dataset.sel&&(r=0),null!=n&&""!=location.hash&&(null==e&&document.querySelector("button[data-name=app]").click(),setTimeout((()=>{const e=n.getBoundingClientRect(),t=e.top-document.body.getBoundingClientRect().top+e.height/2;document.body.scrollBy({left:0,top:t-window.innerHeight/2,behavior:"smooth"})}),r)),a&&""==location.hash)return void document.querySelector("#appcard .close").click();let c=data.apps.find((e=>e.slug==t));if(null==c)return;document.body.style.overflow="hidden";let s=document.getElementById("appcard");s.querySelector("#head img").src="",s.querySelector("#head img").src=c.icon,s.querySelector("#head img").alt="e",s.querySelector("#boxue #na").innerText=c.name,s.querySelector("#boxue #ca").innerText=c.meta.categories.map((e=>l(e))).join(", "),s.querySelector("#boxue #de").innerText=c.author[0].split("<")[0];for(let e of s.querySelectorAll("#ave #to, #appcard > #de"))for(let t of e.childNodes)null!=t.id&&null!=t.className||t.remove();for(let e of s.querySelectorAll("#scr #img,#bucon,#spe ul,#chat"))e.innerHTML="";s.querySelector("#appcard > #de").appendChild(document.createTextNode(c.description));var d=document.createElement("a");if(d.href=c.download.url,d.innerText="Download",s.querySelector("#bucon").appendChild(d),0==c.screenshots.length)s.querySelector("#scr").style.display="none";else{s.querySelector("#scr").style="display: block";for(let e of c.screenshots){var i=document.createElement("img");i.src=e,i.onerror=e=>{e.target.remove()},s.querySelector("#scr #img").appendChild(i)}}function u(e,t){var a=document.createElement("li"),n=document.createElement("div");n.className="a",n.innerText=e,a.appendChild(n);var l=document.createElement("div");if(l.className="b","string"==typeof t)l.innerText=t;else if(Array.isArray(t))for(let e of t)l.appendChild(e);else l.appendChild(t);return a.appendChild(l),a}var p,m,g=s.querySelector("#spe ul");for(let e of["author","maintainer"])if(c[e]){if(c[e][0].includes("<")&&1==c[e].length){var h=document.createElement("a");let t=c[e][0].split("<")[1].split(">")[0];c[e][0].includes("@")?h.href="mailto:"+t:h.href=t,h.target="_blank",h.innerText=c[e][0].split("<")[0],v=h}else 1!=c[e].length?(v=[],c[e].forEach(((t,a)=>{if(t.includes("<")){var n=document.createElement("a");let e=t.split("<")[1].split(">")[0];t.includes("@")?n.href="mailto:"+e:n.href=e,n.innerText=t.split("<")[0],n.target="_blank",v.push(n)}else v.push(document.createTextNode(t));a!=c[e].length-1&&v.push(document.createTextNode(", "))}))):c[e][0].includes("<")||1!=c[e].length||(v=c[e][0]);var y="author"==e?"Developers":"Maintainers";g.appendChild(u(y,v))}for(let e of["website","git_repo","donation"])if(c[e]){var f=document.createElement("a");f.innerText=c[e],f.target="_blank",f.href=c[e];y="Repository";switch(e){case"website":case"donation":y=l(e)}g.appendChild(u(y,f))}if(last_check[c.slug]&&g.appendChild(u("Version",last_check[c.slug])),g.appendChild(u("Type",l(c.type))),c.locales&&g.appendChild(u("Languages",c.locales.join(", "))),g.appendChild(u("Anti-features",`Ads: ${c.has_ads}\n Tracking: ${c.has_tracking}`)),c.license){var v;if(c.license.includes("<")){h=document.createElement("a");let e=c.license.split("<")[1].split(">")[0];h.href=e,h.innerText=c.license.split("<")[0],h.target="_blank",v=h}else v=c.license;g.appendChild(u("License",v))}if(data.dl&&data.dl[c.slug]&&g.appendChild(u("Downloads",data.dl[c.slug].toString())),data.ratings&&data.ratings[c.slug]){let e=data.ratings[c.slug];s.querySelector("#ra").style.display="block",s.querySelector("#ave #sco").innerText=e.average_rating.toFixed("1"),s.querySelector("#ave #stars").style=`--stars:${e.average_rating/5*100}%`,s.querySelector("#ave #to").appendChild(document.createTextNode(`${e.rating_count} total`));for(let e of s.querySelectorAll("#cha *"))e.style="--to:0%";p=c.slug,m=(t,a)=>{if(location.hash=="#"+c.slug&&"eroor404"!=t){[1,2,3,4,5].forEach((a=>{let n=t.ratings.filter((e=>e.points==a)).length;s.querySelector(`#appcard [data-r="${a}"]`).style=`--to:${n/e.rating_count*100}%`}));let a=s.querySelector("#chat");for(let e of t.ratings){var n=document.createElement("div"),l=document.createElement("div");l.className="tie",l.appendChild(document.createTextNode(`@${o(e.username,14)}`));var r=document.createElement("div");r.id="stars",r.style=`--stars:${e.points/5*100}%`,l.appendChild(r),l.appendChild(document.createTextNode(new Date(1e3*e.creationtime).toLocaleDateString(void 0,{year:"numeric",month:"long",day:"numeric"}))),n.appendChild(l),n.appendChild(document.createTextNode(e.description)),a.appendChild(n)}}},fetch(`${ratings}/ratings/${p}`).then((e=>e.json())).then((e=>m(e))).catch((e=>m("eroor404",e)))}else s.querySelector("#ra").style.display="none";document.getElementById("cards").style="opacity:1;visibility:visible",document.getElementById("appcard").style="transform:translate(50%, -50%)",a=!0,document.querySelector("#appcard .close").addEventListener("click",(function e(){document.querySelector("#appcard .close").removeEventListener("click",e),a=!1,location.hash="",document.getElementById("cards").removeAttribute("style"),document.getElementById("appcard").removeAttribute("style"),document.body.style.overflow="auto"}))}const l=([e,...t],a=navigator.language)=>e.toLocaleUpperCase(a)+t.join(""),o=(e,t)=>e.length>t?e.substr(0,t-1)+"…":e;