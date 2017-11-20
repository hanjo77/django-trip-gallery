!function(e){function __webpack_require__(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,__webpack_require__),o.l=!0,o.exports}var t={};__webpack_require__.m=e,__webpack_require__.c=t,__webpack_require__.d=function(e,t,r){__webpack_require__.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:r})},__webpack_require__.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return __webpack_require__.d(t,"a",t),t},__webpack_require__.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},__webpack_require__.p="",__webpack_require__(__webpack_require__.s=0)}([function(e,t,r){e.exports=r(1)},function(e,t,r){"use strict";var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},n=void 0,s=[],i=void 0,a=void 0,l=void 0,u=[],c=r(2),d=null,p=void 0,h=void 0,g=void 0,_=void 0,y=r(4);y.KEY="AIzaSyD_C6GDv2SAhTGc2ijeomtQThYpS761PvU";var m=function(e,t){var r=new XMLHttpRequest,o=window.location.hash.substr(1);r.onload=function(){for(var t=JSON.parse(r.responseText),n=document.querySelector(".gallery__select--"+e),s=void 0,i=0;i<t.length;i++)s=t[i],n.insertAdjacentHTML("beforeend",'<option data-id="'+s.pk+'" value="'+JSON.stringify(s).split('"').join("'")+'">'+s.name+"</option>"),s.name===o&&(n.selectedIndex=i+1,n.dispatchEvent(new Event("change")))},r.onerror=function(){console.log("Error while getting "+t+".")},r.open("GET",t),r.responseType="text",r.send()},f=function(){var e=document.querySelector(".gallery__window"),t=document.querySelector(".gallery__content"),r=parseFloat(getComputedStyle(t).fontSize);e.style.width="auto",e.style.height="auto",t.style.width="auto",t.style.height="auto",e.style.width=e.offsetWidth+"px",e.style.height=e.offsetHeight+"px",t.style.width=t.offsetWidth-2*r+"px",t.style.height=t.offsetHeight-2*r+"px"},v=function localizeData(e){e||(e=navigator.language||navigator.userLanguage);for(var t=document.querySelector(".gallery__select--language"),r="media/locale-"+e+".json",o=new XMLHttpRequest,n=0;n<t.options.length;n++)t.options[n].value===e&&(t.selectedIndex=n);o.onload=function(){if(404===o.status)localizeData("en");else{var t=JSON.parse(o.responseText);for(var r in t){var n=document.querySelector('[data-locale="'+r+'"]');n&&(n.innerHTML=t[r])}_=e,f()}},o.onerror=function(){localizeData("en")},o.open("GET",r),o.responseType="text",o.send()},k=function(e,t){var r=new XMLHttpRequest;r.onload=function(){var o=JSON.parse(r.responseText);e.insertAdjacentHTML("beforeend",'<option value="'+t+'">'+o.meta.title+"</option>")},r.onerror=function(){console.log("Error while getting "+t+" translation.")},r.open("GET","media/locale-"+t+".json"),r.responseType="text",r.send()},C=function(){for(var e=["de","en"],t=document.querySelector(".gallery__select--language"),r=0;r<e.length;r++)k(t,e[r]);t.addEventListener("change",function(e){v(e.target.options[e.target.selectedIndex].value)}),v()},M=function(){i=new c(n,s,{gridSize:66,styles:[{textColor:"white",url:"media/img/cluster-small.png",height:42,width:42},{textColor:"white",url:"media/img/cluster-medium.png",height:54,width:54},{textColor:"white",url:"media/img/cluster-large.png",height:66,width:66}],maxZoom:19})},w=function(e){"object"===(void 0===e?"undefined":o(e))&&(e=e.currentTarget.dataset.button);var t=parseInt(document.querySelector(".gallery__image").dataset.id,10),r=t;"prev"===e?r=t>0?t-1:s.length-1:"next"===e&&(r=t<s.length-1?t+1:0),t!==r&&d.maps.event.trigger(s[r],"click")},L=function(e){var t=e.timeStamp;e.changedTouches.length>0&&(e=e.changedTouches[0]),u=[e.pageX,e.pageY,t]},S=function(e){if(3===u.length){var t=e.timeStamp;e.changedTouches.length>0&&(e=e.changedTouches[0]);var r=e.pageX-u[0],o=t-u[2];o<1e3&&(r<-100?w("next"):r>100&&w("prev"))}u=[]},x=function(){var e=document.querySelector(".gallery__window"),t=document.querySelector(".gallery__image"),r=document.querySelector(".gallery__content"),o=e.classList.contains("gallery--fullscreen")?100:80,n=void 0,s=void 0;if(t&&e){r.querySelector(".wait-icon").classList.add("gallery--fadeout"),"video"===t.tagName.toLowerCase()?(n=t.videoHeight,s=t.videoWidth):(n=t.naturalHeight,s=t.naturalWidth,t.classList.remove("gallery--fadeout"));var i=window.innerHeight*o/100,a=i*s/n;a>window.innerWidth*o/100&&(a=window.innerWidth*o/100,i=a*n/s),e.style.width=a+"px",e.style.height=i+"px",r.style.width=a+"px",r.style.height=i+"px",t.style.width=a+"px",t.style.height=i+"px"}},b=function(e,t){var r=document.querySelector(".gallery__content"),o=document.querySelector(".gallery__window"),n=o.querySelectorAll(".gallery__control:not(.gallery__share)"),s=document.querySelector(".gallery__button--delete"),i=document.querySelector(".gallery__button--close"),a=document.querySelector("img.gallery__image"),u=document.querySelector(".gallery__navigation");i.classList.remove("gallery--hidden"),u.classList.add("gallery--fadeout"),o.classList.contains("gallery--fadeout")&&(o.classList.remove("gallery--fadeout"),r.classList.remove("gallery--fadeout"),r.style.backgroundImage="none",r.innerHTML=""),r.style.backgroundImage=a?"url("+a.src+")":"none",r.innerHTML=e;var c=document.querySelector(".gallery__image");if(c){window.location.hash=l,q(),r.classList.add("gallery__image-container"),r.querySelector(".wait-icon")||r.insertAdjacentHTML("beforeend",'<div class="wait-icon gallery--fadeout"></div>'),c.complete||r.querySelector(".wait-icon").classList.remove("gallery--fadeout"),c.addEventListener("touchstart",L),c.addEventListener("touchend",S),c.addEventListener("load",x),c.addEventListener("loadedmetadata",x);for(var d in n){var p=n[d];p.classList&&p.classList.remove("gallery--hidden")}window.location.href.indexOf(":8000")>-1?s.classList.remove("gallery--hidden"):s.classList.add("gallery--hidden")}t&&f()},E=function(e,t){e.addListener("click",function(){document.querySelector(".gallery__image-caption-text").innerHTML=e.description,a=e,l=e.index,b("photo"===e.contentType?'<img class="gallery__image gallery--fadeout" data-pk="'+t.pk+'" data-id="'+e.index+'" src="'+e.url+'" />':'<video controls autoplay class="gallery__image gallery__video" data-pk="'+t.pk+'" data-id="'+e.index+'" src="'+e.url+'" />'),n.panTo(e.position),n.setOptions({keyboardShortcuts:!1})})},I=function(){window.clearTimeout(p);var e=document.querySelectorAll(".gallery__window .gallery__control");for(var t in e){var r=e[t];r.classList&&r.classList.remove("gallery--fadeout")}p=window.setTimeout(function(){for(var t in e){var r=e[t];r.classList&&r.classList.add("gallery--fadeout")}},3e3)},T=function(){var e=new XMLHttpRequest;e.onload=function(){var t=e.responseXML.documentElement.getElementsByTagName("Placemark");[].forEach.call(t,function(e){var t=e.getElementsByTagName("name")[0].textContent,r=e.getElementsByTagName("description")[0].textContent,o=JSON.parse(r),i=new d.maps.LatLng(o.latitude,o.longitude),a=o.title;o.address!==o.title&&(a+=(""!==a?", ":"")+o.address),a+=(""!==a?"<br />":"")+o.city+", "+o.state;var l=t.indexOf(".jpg")>-1?"photo":"video",u=new d.maps.Marker({index:s.length,position:i,contentType:l,description:a,map:n,url:t,title:o.title,icon:"media/img/marker-"+l+".png"});E(u,o),s.push(u)}),M();var r=parseInt(window.location.hash.substr(1),10);!isNaN(r)&&s[r]&&d.maps.event.trigger(s[r],"click")},e.onerror=function(){console.log("Error while getting media/locations.kml.")},e.open("GET","media/locations.kml"),e.responseType="document",e.send()},q=function(){var e=escape("http://hanjo.synology.me/usa-2017"+window.location.hash),t=document.querySelector(".gallery__button--twitter");t.href="https://twitter.com/intent/tweet?text="+e,t.target="blank";var r=document.querySelector(".gallery__button--google-plus");r.href="https://plus.google.com/share?url="+e,r.target="blank";var o=document.querySelector(".gallery__button--facebook");o.href="https://www.facebook.com/sharer/sharer.php?u="+e,o.target="blank";var n=document.querySelector(".gallery__button--mail");n.href="mailto:?subject=USA%20by%20rail&body="+e,n.target="blank"},A=function(){var e=new d.maps.LatLng(38.9284715,-97.5515638),t={zoom:4,center:e,mapTypeId:d.maps.MapTypeId.SATELLITE};n=new d.maps.Map(document.getElementById("gallery__map"),t),m("state","media/states.json"),m("city","media/cities.json"),T(),C(),q("http://hanjo.synology.me/usa-2017")},z=function(e){e.requestFullscreen?e.requestFullscreen():e.mozRequestFullScreen?e.mozRequestFullScreen():e.webkitRequestFullscreen?e.webkitRequestFullscreen():e.msRequestFullscreen&&e.msRequestFullscreen()},N=function(){document.exitFullscreen?document.exitFullscreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.webkitExitFullscreen&&document.webkitExitFullscreen()},R=function(e){var t=null;if(document.cookie&&""!==document.cookie)for(var r=document.cookie.split(";"),o=0;o<r.length;o++){var n=r[o].trim();if(n.substring(0,e.length+1)===e+"="){t=decodeURIComponent(n.substring(e.length+1));break}}return t},B=function(e){e&&(e.pause(),e.currentTime=0)},O=function(e,t){var r=new XMLHttpRequest;r.onload=function(){for(var o=JSON.parse(r.responseText),n=0;n<o.length;n++){var s=o[n];s[e].pk===t&&s.language===_&&b("<h1>"+s[e].name+"</h1><p>"+s.description+"</p>",!0)}},r.onerror=function(){console.log("Error while getting "+e+"_descriptions.json.")},r.open("GET","media/"+e+"_descriptions.json"),r.responseType="text",r.send()},P=function(e){try{var t=JSON.parse(e.currentTarget.options[e.currentTarget.selectedIndex].value.split("'").join('"'));if(t.state)O("city",t.pk),window.location.hash=e.currentTarget.options[e.currentTarget.selectedIndex].text,g=t.pk,h=t.state.pk,document.querySelector('.gallery__select--state [data-id="'+t.state.pk+'"]').selected=!0,document.querySelector(".gallery__select--state").dataset.background=!0,document.querySelector(".gallery__select--state").dispatchEvent(new Event("change"));else{document.querySelector(".gallery__select--state").dataset.background||(O("state",t.pk),window.location.hash=e.currentTarget.options[e.currentTarget.selectedIndex].text),delete document.querySelector(".gallery__select--state").dataset.background;for(var r=document.querySelectorAll(".gallery__select--city [data-id]"),o=0;o<r.length;o++){var s=r[o];if(s&&s.value){JSON.parse(s.value.split("'").join('"')).state.pk===t.pk?s.style.display="block":s.style.display="none"}}h!==t.pk&&(document.querySelector(".gallery__select--city").selectedIndex=0,h=t.pk)}var i=new d.maps.LatLng(t.max_latitude,t.max_longitude),a=new d.maps.LatLng(t.min_latitude,t.min_longitude);new d.maps.LatLngBounds;var l=new d.maps.LatLngBounds;l.extend(i),l.extend(a),n.fitBounds(l)}catch(t){if(e.currentTarget.classList.contains("gallery__select--state")){for(var u=document.querySelectorAll(".gallery__select--city [data-id]"),c=0;c<u.length;c++){var p=u[c];p.style.display="block"}document.querySelector(".gallery__select--city").selectedIndex=0,n.setCenter(new d.maps.LatLng(38.9284715,-97.5515638)),n.setZoom(4),h=-1}else document.querySelector(".gallery__select--state").dispatchEvent(new Event("change"))}},G=function(){if(window.confirm("Willst du dieses Bild wirklich löschen?")){var e=R("csrftoken"),t=document.querySelector(".gallery__window .gallery__image").dataset.pk;if(isNaN(parseInt(t,10)))window.alert("Bild "+t+" konnte nicht gelöscht werden: ID nicht lesbar.");else{var r=new XMLHttpRequest;r.onload=function(){window.alert("Bild "+t+" wurde gelöscht, wechsle zum nächsten..."),s[l].setMap(null),s.splice(l,1);for(var e=l;e<s.length;e++)s[e].index=e;l-=1,document.querySelector(".gallery__image").dataset.id=l,w("next")},r.onerror=function(){window.alert("Bild "+t+" konnte nicht gelöscht werden: ID nicht lesbar.")},r.open("DELETE","/api/images/"+t+"/"),r.responseType="text",r.setRequestHeader("X-CSRFToken",e),r.send()}}};document.querySelector('[data-button="fullscreen"]').addEventListener("click",function(e){e.currentTarget.classList.contains("gallery__button--fullscreen")?z(document.querySelector(".gallery__window")):N()}),document.querySelector('[data-button="close"]').addEventListener("click",function(){var e=document.querySelector(".gallery__window"),t=e.querySelectorAll(".gallery__control"),r=document.querySelector(".gallery__content"),o=document.querySelector(".gallery__navigation"),s=document.querySelector(".gallery__button--cleanup"),i=document.getElementById("gallery__map"),a=document.getElementById("gallery__image"),l=document.querySelector("video");N();for(var u in t){var c=t[u];c.classList&&c.classList.add("gallery--hidden")}e.classList.add("gallery--fadeout"),e.style.width="0px",e.style.height="0px",r.style.width="0px",r.style.height="0px",a&&(a.style.width="0px",a.style.height="0px"),o.classList.remove("gallery--fadeout"),r.classList.contains("gallery__image-container")?(r.classList.remove("gallery__image-container"),r.innerHTML="&nbsp",r.style.backgroundImage="none"):r.classList.add("gallery--fadeout"),window.location.href.indexOf(":8000")>-1&&s.classList.remove("gallery--hidden"),n.setOptions({keyboardShortcuts:!0}),i.focus(),B(l)});var H=document.querySelectorAll(".gallery__image-caption .gallery__button");for(var j in H){var D=H[j];D.addEventListener&&D.addEventListener("click",w)}document.querySelector('[data-button="delete"]').addEventListener("click",G),document.querySelector(".gallery__button--cleanup").addEventListener("click",function(){var e=new XMLHttpRequest,t=document.querySelector(".gallery__button--cleanup");e.onload=function(){window.alert("Daten bereinigt."),t.removeAttribute("disabled"),t.innerHTML="Daten bereinigen"},e.onerror=function(){window.alert("Fehler beim Bereinigen der Bilder."),t.removeAttribute("disabled"),t.innerHTML="Daten bereinigen"},e.open("GET","/cleanup_images"),e.responseType="text",e.send(),t.setAttribute("disabled","disabled"),t.innerHTML='<span class="wait-icon"></span> bitte warten'});for(var F=document.querySelectorAll(".gallery__select"),W=0;W<F.length;W++){var Z=F[W];Z.addEventListener("mousedown",function(e){e.currentTarget.selectedIndex=-1}),Z.addEventListener("change",P)}document.addEventListener("keyup",function(e){document.querySelectorAll(".gallery__window.gallery--fadeout").length<=0&&document.querySelectorAll(".gallery__image").length>0&&(37===e.keyCode?w("prev"):39===e.keyCode&&w("next")),27===e.keyCode&&(document.querySelector(".gallery__window").classList.contains("gallery--fullscreen")||document.querySelector('[data-button="close"]').dispatchEvent(new Event("click")))}),window.addEventListener("resize",x);var K=function(){document.querySelector(".gallery__window").classList.contains("gallery--fullscreen")?(document.querySelector(".gallery__window").classList.remove("gallery--fullscreen"),document.querySelector('[data-button="fullscreen"]').classList.remove("gallery__button--windowed"),document.querySelector('[data-button="fullscreen"]').classList.add("gallery__button--fullscreen")):(document.querySelector(".gallery__window").classList.add("gallery--fullscreen"),document.querySelector('[data-button="fullscreen"]').classList.remove("gallery__button--fullscreen"),document.querySelector('[data-button="fullscreen"]').classList.add("gallery__button--windowed")),x()};document.addEventListener("fullscreenchange",K),document.addEventListener("mozfullscreenchange",K),document.addEventListener("webkitfullscreenchange",K),document.addEventListener("MSFullscreenChange",K),document.addEventListener("mousemove",I),document.addEventListener("keyup",I),document.addEventListener("click",I),y.load(function(e){d=e,A()})},function(e,t,r){(function(t){function MarkerClusterer(e,t,r){this.extend(MarkerClusterer,google.maps.OverlayView),this.map_=e,this.markers_=[],this.clusters_=[],this.sizes=[53,56,66,78,90],this.styles_=[],this.ready_=!1;var o=r||{};this.gridSize_=o.gridSize||60,this.minClusterSize_=o.minimumClusterSize||2,this.maxZoom_=o.maxZoom||null,this.styles_=o.styles||[],this.imagePath_=o.imagePath||this.MARKER_CLUSTER_IMAGE_PATH_,this.imageExtension_=o.imageExtension||this.MARKER_CLUSTER_IMAGE_EXTENSION_,this.zoomOnClick_=!0,void 0!=o.zoomOnClick&&(this.zoomOnClick_=o.zoomOnClick),this.averageCenter_=!1,void 0!=o.averageCenter&&(this.averageCenter_=o.averageCenter),this.setupStyles_(),this.setMap(e),this.prevZoom_=this.map_.getZoom();var n=this;google.maps.event.addListener(this.map_,"zoom_changed",function(){var e=n.map_.getZoom();n.prevZoom_!=e&&(n.prevZoom_=e,n.resetViewport())}),google.maps.event.addListener(this.map_,"idle",function(){n.redraw()}),t&&t.length&&this.addMarkers(t,!1)}function Cluster(e){this.markerClusterer_=e,this.map_=e.getMap(),this.gridSize_=e.getGridSize(),this.minClusterSize_=e.getMinClusterSize(),this.averageCenter_=e.isAverageCenter(),this.center_=null,this.markers_=[],this.bounds_=null,this.clusterIcon_=new ClusterIcon(this,e.getStyles(),e.getGridSize())}function ClusterIcon(e,t,r){e.getMarkerClusterer().extend(ClusterIcon,google.maps.OverlayView),this.styles_=t,this.padding_=r||0,this.cluster_=e,this.center_=null,this.map_=e.getMap(),this.div_=null,this.sums_=null,this.visible_=!1,this.setMap(this.map_)}MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_PATH_="http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m",MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_EXTENSION_="png",MarkerClusterer.prototype.extend=function(e,t){return function(e){for(var t in e.prototype)this.prototype[t]=e.prototype[t];return this}.apply(e,[t])},MarkerClusterer.prototype.onAdd=function(){this.setReady_(!0)},MarkerClusterer.prototype.draw=function(){},MarkerClusterer.prototype.setupStyles_=function(){if(!this.styles_.length)for(var e,t=0;e=this.sizes[t];t++)this.styles_.push({url:this.imagePath_+(t+1)+"."+this.imageExtension_,height:e,width:e})},MarkerClusterer.prototype.fitMapToMarkers=function(){for(var e,t=this.getMarkers(),r=new google.maps.LatLngBounds,o=0;e=t[o];o++)r.extend(e.getPosition());this.map_.fitBounds(r)},MarkerClusterer.prototype.setStyles=function(e){this.styles_=e},MarkerClusterer.prototype.getStyles=function(){return this.styles_},MarkerClusterer.prototype.isZoomOnClick=function(){return this.zoomOnClick_},MarkerClusterer.prototype.isAverageCenter=function(){return this.averageCenter_},MarkerClusterer.prototype.getMarkers=function(){return this.markers_},MarkerClusterer.prototype.getTotalMarkers=function(){return this.markers_.length},MarkerClusterer.prototype.setMaxZoom=function(e){this.maxZoom_=e},MarkerClusterer.prototype.getMaxZoom=function(){return this.maxZoom_},MarkerClusterer.prototype.calculator_=function(e,t){for(var r=0,o=e.length,n=o;0!==n;)n=parseInt(n/10,10),r++;return r=Math.min(r,t),{text:o,index:r}},MarkerClusterer.prototype.setCalculator=function(e){this.calculator_=e},MarkerClusterer.prototype.getCalculator=function(){return this.calculator_},MarkerClusterer.prototype.addMarkers=function(e,t){for(var r,o=0;r=e[o];o++)this.pushMarkerTo_(r);t||this.redraw()},MarkerClusterer.prototype.pushMarkerTo_=function(e){if(e.isAdded=!1,e.draggable){var t=this;google.maps.event.addListener(e,"dragend",function(){e.isAdded=!1,t.repaint()})}this.markers_.push(e)},MarkerClusterer.prototype.addMarker=function(e,t){this.pushMarkerTo_(e),t||this.redraw()},MarkerClusterer.prototype.removeMarker_=function(e){var t=-1;if(this.markers_.indexOf)t=this.markers_.indexOf(e);else for(var r,o=0;r=this.markers_[o];o++)if(r==e){t=o;break}return-1!=t&&(e.setMap(null),this.markers_.splice(t,1),!0)},MarkerClusterer.prototype.removeMarker=function(e,t){var r=this.removeMarker_(e);return!(t||!r)&&(this.resetViewport(),this.redraw(),!0)},MarkerClusterer.prototype.removeMarkers=function(e,t){for(var r,o=!1,n=0;r=e[n];n++){var s=this.removeMarker_(r);o=o||s}if(!t&&o)return this.resetViewport(),this.redraw(),!0},MarkerClusterer.prototype.setReady_=function(e){this.ready_||(this.ready_=e,this.createClusters_())},MarkerClusterer.prototype.getTotalClusters=function(){return this.clusters_.length},MarkerClusterer.prototype.getMap=function(){return this.map_},MarkerClusterer.prototype.setMap=function(e){this.map_=e},MarkerClusterer.prototype.getGridSize=function(){return this.gridSize_},MarkerClusterer.prototype.setGridSize=function(e){this.gridSize_=e},MarkerClusterer.prototype.getMinClusterSize=function(){return this.minClusterSize_},MarkerClusterer.prototype.setMinClusterSize=function(e){this.minClusterSize_=e},MarkerClusterer.prototype.getExtendedBounds=function(e){var t=this.getProjection(),r=new google.maps.LatLng(e.getNorthEast().lat(),e.getNorthEast().lng()),o=new google.maps.LatLng(e.getSouthWest().lat(),e.getSouthWest().lng()),n=t.fromLatLngToDivPixel(r);n.x+=this.gridSize_,n.y-=this.gridSize_;var s=t.fromLatLngToDivPixel(o);s.x-=this.gridSize_,s.y+=this.gridSize_;var i=t.fromDivPixelToLatLng(n),a=t.fromDivPixelToLatLng(s);return e.extend(i),e.extend(a),e},MarkerClusterer.prototype.isMarkerInBounds_=function(e,t){return t.contains(e.getPosition())},MarkerClusterer.prototype.clearMarkers=function(){this.resetViewport(!0),this.markers_=[]},MarkerClusterer.prototype.resetViewport=function(e){for(var t,r=0;t=this.clusters_[r];r++)t.remove();for(var o,r=0;o=this.markers_[r];r++)o.isAdded=!1,e&&o.setMap(null);this.clusters_=[]},MarkerClusterer.prototype.repaint=function(){var e=this.clusters_.slice();this.clusters_.length=0,this.resetViewport(),this.redraw(),window.setTimeout(function(){for(var t,r=0;t=e[r];r++)t.remove()},0)},MarkerClusterer.prototype.redraw=function(){this.createClusters_()},MarkerClusterer.prototype.distanceBetweenPoints_=function(e,t){if(!e||!t)return 0;var r=(t.lat()-e.lat())*Math.PI/180,o=(t.lng()-e.lng())*Math.PI/180,n=Math.sin(r/2)*Math.sin(r/2)+Math.cos(e.lat()*Math.PI/180)*Math.cos(t.lat()*Math.PI/180)*Math.sin(o/2)*Math.sin(o/2);return 2*Math.atan2(Math.sqrt(n),Math.sqrt(1-n))*6371},MarkerClusterer.prototype.addToClosestCluster_=function(e){for(var t,r=4e4,o=null,n=(e.getPosition(),0);t=this.clusters_[n];n++){var s=t.getCenter();if(s){var i=this.distanceBetweenPoints_(s,e.getPosition());i<r&&(r=i,o=t)}}if(o&&o.isMarkerInClusterBounds(e))o.addMarker(e);else{var t=new Cluster(this);t.addMarker(e),this.clusters_.push(t)}},MarkerClusterer.prototype.createClusters_=function(){if(this.ready_)for(var e,t=new google.maps.LatLngBounds(this.map_.getBounds().getSouthWest(),this.map_.getBounds().getNorthEast()),r=this.getExtendedBounds(t),o=0;e=this.markers_[o];o++)!e.isAdded&&this.isMarkerInBounds_(e,r)&&this.addToClosestCluster_(e)},Cluster.prototype.isMarkerAlreadyAdded=function(e){if(this.markers_.indexOf)return-1!=this.markers_.indexOf(e);for(var t,r=0;t=this.markers_[r];r++)if(t==e)return!0;return!1},Cluster.prototype.addMarker=function(e){if(this.isMarkerAlreadyAdded(e))return!1;if(this.center_){if(this.averageCenter_){var t=this.markers_.length+1,r=(this.center_.lat()*(t-1)+e.getPosition().lat())/t,o=(this.center_.lng()*(t-1)+e.getPosition().lng())/t;this.center_=new google.maps.LatLng(r,o),this.calculateBounds_()}}else this.center_=e.getPosition(),this.calculateBounds_();e.isAdded=!0,this.markers_.push(e);var n=this.markers_.length;if(n<this.minClusterSize_&&e.getMap()!=this.map_&&e.setMap(this.map_),n==this.minClusterSize_)for(var s=0;s<n;s++)this.markers_[s].setMap(null);return n>=this.minClusterSize_&&e.setMap(null),this.updateIcon(),!0},Cluster.prototype.getMarkerClusterer=function(){return this.markerClusterer_},Cluster.prototype.getBounds=function(){for(var e,t=new google.maps.LatLngBounds(this.center_,this.center_),r=this.getMarkers(),o=0;e=r[o];o++)t.extend(e.getPosition());return t},Cluster.prototype.remove=function(){this.clusterIcon_.remove(),this.markers_.length=0,delete this.markers_},Cluster.prototype.getSize=function(){return this.markers_.length},Cluster.prototype.getMarkers=function(){return this.markers_},Cluster.prototype.getCenter=function(){return this.center_},Cluster.prototype.calculateBounds_=function(){var e=new google.maps.LatLngBounds(this.center_,this.center_);this.bounds_=this.markerClusterer_.getExtendedBounds(e)},Cluster.prototype.isMarkerInClusterBounds=function(e){return this.bounds_.contains(e.getPosition())},Cluster.prototype.getMap=function(){return this.map_},Cluster.prototype.updateIcon=function(){var e=this.map_.getZoom(),t=this.markerClusterer_.getMaxZoom();if(t&&e>t)for(var r,o=0;r=this.markers_[o];o++)r.setMap(this.map_);else{if(this.markers_.length<this.minClusterSize_)return void this.clusterIcon_.hide();var n=this.markerClusterer_.getStyles().length,s=this.markerClusterer_.getCalculator()(this.markers_,n);this.clusterIcon_.setCenter(this.center_),this.clusterIcon_.setSums(s),this.clusterIcon_.show()}},ClusterIcon.prototype.triggerClusterClick=function(){var e=this.cluster_.getMarkerClusterer();google.maps.event.trigger(e,"clusterclick",this.cluster_),e.isZoomOnClick()&&this.map_.fitBounds(this.cluster_.getBounds())},ClusterIcon.prototype.onAdd=function(){if(this.div_=document.createElement("DIV"),this.visible_){var e=this.getPosFromLatLng_(this.center_);this.div_.style.cssText=this.createCss(e),this.div_.innerHTML=this.sums_.text}this.getPanes().overlayMouseTarget.appendChild(this.div_);var t=this;google.maps.event.addDomListener(this.div_,"click",function(){t.triggerClusterClick()})},ClusterIcon.prototype.getPosFromLatLng_=function(e){var t=this.getProjection().fromLatLngToDivPixel(e);return t.x-=parseInt(this.width_/2,10),t.y-=parseInt(this.height_/2,10),t},ClusterIcon.prototype.draw=function(){if(this.visible_){var e=this.getPosFromLatLng_(this.center_);this.div_.style.top=e.y+"px",this.div_.style.left=e.x+"px"}},ClusterIcon.prototype.hide=function(){this.div_&&(this.div_.style.display="none"),this.visible_=!1},ClusterIcon.prototype.show=function(){if(this.div_){var e=this.getPosFromLatLng_(this.center_);this.div_.style.cssText=this.createCss(e),this.div_.style.display=""}this.visible_=!0},ClusterIcon.prototype.remove=function(){this.setMap(null)},ClusterIcon.prototype.onRemove=function(){this.div_&&this.div_.parentNode&&(this.hide(),this.div_.parentNode.removeChild(this.div_),this.div_=null)},ClusterIcon.prototype.setSums=function(e){this.sums_=e,this.text_=e.text,this.index_=e.index,this.div_&&(this.div_.innerHTML=e.text),this.useStyle()},ClusterIcon.prototype.useStyle=function(){var e=Math.max(0,this.sums_.index-1);e=Math.min(this.styles_.length-1,e);var t=this.styles_[e];this.url_=t.url,this.height_=t.height,this.width_=t.width,this.textColor_=t.textColor,this.anchor_=t.anchor,this.textSize_=t.textSize,this.backgroundPosition_=t.backgroundPosition},ClusterIcon.prototype.setCenter=function(e){this.center_=e},ClusterIcon.prototype.createCss=function(e){var t=[];t.push("background-image:url("+this.url_+");");var r=this.backgroundPosition_?this.backgroundPosition_:"0 0";t.push("background-position:"+r+";"),"object"==typeof this.anchor_?("number"==typeof this.anchor_[0]&&this.anchor_[0]>0&&this.anchor_[0]<this.height_?t.push("height:"+(this.height_-this.anchor_[0])+"px; padding-top:"+this.anchor_[0]+"px;"):t.push("height:"+this.height_+"px; line-height:"+this.height_+"px;"),"number"==typeof this.anchor_[1]&&this.anchor_[1]>0&&this.anchor_[1]<this.width_?t.push("width:"+(this.width_-this.anchor_[1])+"px; padding-left:"+this.anchor_[1]+"px;"):t.push("width:"+this.width_+"px; text-align:center;")):t.push("height:"+this.height_+"px; line-height:"+this.height_+"px; width:"+this.width_+"px; text-align:center;");var o=this.textColor_?this.textColor_:"black",n=this.textSize_?this.textSize_:11;return t.push("cursor:pointer; top:"+e.y+"px; left:"+e.x+"px; color:"+o+"; position:absolute; font-size:"+n+"px; font-family:Arial,sans-serif; font-weight:bold"),t.join("")},t.MarkerClusterer=MarkerClusterer,MarkerClusterer.prototype.addMarker=MarkerClusterer.prototype.addMarker,MarkerClusterer.prototype.addMarkers=MarkerClusterer.prototype.addMarkers,MarkerClusterer.prototype.clearMarkers=MarkerClusterer.prototype.clearMarkers,MarkerClusterer.prototype.fitMapToMarkers=MarkerClusterer.prototype.fitMapToMarkers,MarkerClusterer.prototype.getCalculator=MarkerClusterer.prototype.getCalculator,MarkerClusterer.prototype.getGridSize=MarkerClusterer.prototype.getGridSize,MarkerClusterer.prototype.getExtendedBounds=MarkerClusterer.prototype.getExtendedBounds,MarkerClusterer.prototype.getMap=MarkerClusterer.prototype.getMap,MarkerClusterer.prototype.getMarkers=MarkerClusterer.prototype.getMarkers,MarkerClusterer.prototype.getMaxZoom=MarkerClusterer.prototype.getMaxZoom,MarkerClusterer.prototype.getStyles=MarkerClusterer.prototype.getStyles,MarkerClusterer.prototype.getTotalClusters=MarkerClusterer.prototype.getTotalClusters,MarkerClusterer.prototype.getTotalMarkers=MarkerClusterer.prototype.getTotalMarkers,MarkerClusterer.prototype.redraw=MarkerClusterer.prototype.redraw,MarkerClusterer.prototype.removeMarker=MarkerClusterer.prototype.removeMarker,MarkerClusterer.prototype.removeMarkers=MarkerClusterer.prototype.removeMarkers,MarkerClusterer.prototype.resetViewport=MarkerClusterer.prototype.resetViewport,MarkerClusterer.prototype.repaint=MarkerClusterer.prototype.repaint,MarkerClusterer.prototype.setCalculator=MarkerClusterer.prototype.setCalculator,MarkerClusterer.prototype.setGridSize=MarkerClusterer.prototype.setGridSize,MarkerClusterer.prototype.setMaxZoom=MarkerClusterer.prototype.setMaxZoom,MarkerClusterer.prototype.onAdd=MarkerClusterer.prototype.onAdd,MarkerClusterer.prototype.draw=MarkerClusterer.prototype.draw,Cluster.prototype.getCenter=Cluster.prototype.getCenter,Cluster.prototype.getSize=Cluster.prototype.getSize,Cluster.prototype.getMarkers=Cluster.prototype.getMarkers,ClusterIcon.prototype.onAdd=ClusterIcon.prototype.onAdd,ClusterIcon.prototype.draw=ClusterIcon.prototype.draw,ClusterIcon.prototype.onRemove=ClusterIcon.prototype.onRemove,e.exports=MarkerClusterer}).call(t,r(3))},function(e,t){var r;r=function(){return this}();try{r=r||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(r=window)}e.exports=r},function(e,t,r){var o,n;!function(s,i){if(null===s)throw new Error("Google-maps package can be used only in browser");o=i,void 0!==(n="function"==typeof o?o.call(t,r,t,e):o)&&(e.exports=n)}("undefined"!=typeof window?window:null,function(){"use strict";var e=null,t=null,r=!1,o=[],n=[],s=null,i={};i.URL="https://maps.googleapis.com/maps/api/js",i.KEY=null,i.LIBRARIES=[],i.CLIENT=null,i.CHANNEL=null,i.LANGUAGE=null,i.REGION=null,i.VERSION="3.18",i.WINDOW_CALLBACK_NAME="__google_maps_api_provider_initializator__",i._googleMockApiObject={},i.load=function(e){null===t?!0===r?e&&o.push(e):(r=!0,window[i.WINDOW_CALLBACK_NAME]=function(){a(e)},i.createLoader()):e&&e(t)},i.createLoader=function(){e=document.createElement("script"),e.type="text/javascript",e.src=i.createUrl(),document.body.appendChild(e)},i.isLoaded=function(){return null!==t},i.createUrl=function(){var e=i.URL;return e+="?callback="+i.WINDOW_CALLBACK_NAME,i.KEY&&(e+="&key="+i.KEY),i.LIBRARIES.length>0&&(e+="&libraries="+i.LIBRARIES.join(",")),i.CLIENT&&(e+="&client="+i.CLIENT+"&v="+i.VERSION),i.CHANNEL&&(e+="&channel="+i.CHANNEL),i.LANGUAGE&&(e+="&language="+i.LANGUAGE),i.REGION&&(e+="&region="+i.REGION),e},i.release=function(a){var l=function(){i.KEY=null,i.LIBRARIES=[],i.CLIENT=null,i.CHANNEL=null,i.LANGUAGE=null,i.REGION=null,i.VERSION="3.18",t=null,r=!1,o=[],n=[],void 0!==window.google&&delete window.google,void 0!==window[i.WINDOW_CALLBACK_NAME]&&delete window[i.WINDOW_CALLBACK_NAME],null!==s&&(i.createLoader=s,s=null),null!==e&&(e.parentElement.removeChild(e),e=null),a&&a()};r?i.load(function(){l()}):l()},i.onLoad=function(e){n.push(e)},i.makeMock=function(){s=i.createLoader,i.createLoader=function(){window.google=i._googleMockApiObject,window[i.WINDOW_CALLBACK_NAME]()}};var a=function(e){var s;for(r=!1,null===t&&(t=window.google),s=0;s<n.length;s++)n[s](t);for(e&&e(t),s=0;s<o.length;s++)o[s](t);o=[]};return i})}]);