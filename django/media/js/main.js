/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var map = void 0,
    markers = [],
    markerclusterer = void 0,
    activeMarker = void 0,
    activeMarkerIndex = void 0,
    lastTouch = [],
    MarkerClusterer = __webpack_require__(2),
    google = null,
    timeoutControlFade = void 0,
    initialZoom = 4,
    initialLatitude = 38.9284715,
    initialLongitude = -97.5515638,
    currentState = void 0,
    currentCity = void 0,
    currentLanguage = void 0,
    defaultTitle = document.title,
    languages = ['de', 'en'];

var GoogleMapsLoader = __webpack_require__(4);
GoogleMapsLoader.KEY = 'AIzaSyD_C6GDv2SAhTGc2ijeomtQThYpS761PvU';

var fillSelect = function fillSelect(type, url) {
	var xhr = new XMLHttpRequest(),
	    hash = window.location.hash.substr(1);

	xhr.onload = function () {
		var data = JSON.parse(xhr.responseText);
		var select = document.querySelector('.gallery__select--' + type),
		    option = void 0;
		for (var i = 0; i < data.length; i++) {
			option = data[i];
			select.insertAdjacentHTML('beforeend', '<option data-id="' + option.pk + '" value="' + JSON.stringify(option).split('\"').join('\'') + '">' + option.name + '</option>');
			if (option.name === hash) {
				select.selectedIndex = i + 1;
				select.dispatchEvent(new Event('change'));
			}
		}
	};
	xhr.onerror = function () {
		console.log('Error while getting ' + url + '.');
	};
	xhr.open("GET", url);
	xhr.responseType = 'text';
	xhr.send();
};

var resizeContent = function resizeContent() {
	var win = document.querySelector('.gallery__window'),
	    content = document.querySelector('.gallery__content'),
	    emSize = parseFloat(getComputedStyle(content).fontSize);

	win.style.width = 'auto';
	win.style.height = 'auto';
	content.style.width = 'auto';
	content.style.height = 'auto';
	win.style.width = win.offsetWidth + 'px';
	win.style.height = win.offsetHeight + 'px';
	content.style.width = content.offsetWidth - emSize * 2 + 'px';
	content.style.height = content.offsetHeight - emSize * 2 + 'px';
};

var localizeData = function localizeData(lang) {
	if (!lang) {
		lang = navigator.language || navigator.userLanguage;
		var hash = window.location.hash.substr(1);
		if (languages.includes(hash)) {
			lang = hash;
		}
	}

	var select = document.querySelector('.gallery__select--language'),
	    url = 'media/locale-' + lang + '.json',
	    xhr = new XMLHttpRequest();

	for (var i = 0; i < select.options.length; i++) {
		if (select.options[i].value === lang) {
			select.selectedIndex = i;
		}
	}
	xhr.onload = function () {
		if (xhr.status === 404) {
			localizeData('en');
		} else {
			var data = JSON.parse(xhr.responseText);
			for (var key in data) {
				var elem = document.querySelector('[data-locale="' + key + '"]');
				if (elem) {
					elem.innerHTML = data[key];
				}
			}

			currentLanguage = lang;
			resizeContent();
		}
	};
	xhr.onerror = function () {
		localizeData('en');
	};
	xhr.open("GET", url);
	xhr.responseType = 'text';
	xhr.send();
};

var fillLanguage = function fillLanguage(select, language) {
	var xhr = new XMLHttpRequest();

	xhr.onload = function () {
		var data = JSON.parse(xhr.responseText);
		select.insertAdjacentHTML('beforeend', '<option value="' + language + '">' + data.meta.title + '</option>');
	};
	xhr.onerror = function () {
		console.log('Error while getting ' + language + ' translation.');
	};
	xhr.open("GET", 'media/locale-' + language + '.json');
	xhr.responseType = 'text';
	xhr.send();
};

var fillLanguages = function fillLanguages() {
	var languages = ['de', 'en'],
	    select = document.querySelector('.gallery__select--language');

	for (var i = 0; i < languages.length; i++) {
		fillLanguage(select, languages[i]);
	}

	select.addEventListener('change', function (event) {
		localizeData(event.target.options[event.target.selectedIndex].value);
	});

	localizeData();
};

var addMarkerCluster = function addMarkerCluster() {
	var clusterStyles = [{
		textColor: 'white',
		url: 'media/img/cluster-small.png',
		height: 42,
		width: 42
	}, {
		textColor: 'white',
		url: 'media/img/cluster-medium.png',
		height: 54,
		width: 54
	}, {
		textColor: 'white',
		url: 'media/img/cluster-large.png',
		height: 66,
		width: 66
	}];

	var mcOptions = {
		gridSize: 66,
		styles: clusterStyles,
		maxZoom: 19
	};

	markerclusterer = new MarkerClusterer(map, markers, mcOptions);
};

var changeImage = function changeImage(direction) {
	if ((typeof direction === 'undefined' ? 'undefined' : _typeof(direction)) === 'object') {
		direction = direction.currentTarget.dataset.button;
	}
	var index = parseInt(document.querySelector('.gallery__image').dataset.id, 10),
	    newIndex = index;

	if (direction === 'prev') {
		newIndex = index > 0 ? index - 1 : markers.length - 1;
	} else if (direction === 'next') {
		newIndex = index < markers.length - 1 ? index + 1 : 0;
	}

	if (index !== newIndex) {
		google.maps.event.trigger(markers[newIndex], 'click');
	}
};

var imageTouchStart = function imageTouchStart(event) {
	var timeStamp = event.timeStamp;
	if (event.changedTouches.length > 0) {
		event = event.changedTouches[0];
	}

	lastTouch = [event.pageX, event.pageY, timeStamp];
};

var imageTouchEnd = function imageTouchEnd(event) {
	if (lastTouch.length === 3) {
		var timeStamp = event.timeStamp;
		if (event.changedTouches.length > 0) {
			event = event.changedTouches[0];
		}

		var distX = event.pageX - lastTouch[0],
		    timeDiff = timeStamp - lastTouch[2],
		    minSwipe = 100;

		if (timeDiff < 1000) {
			if (distX < -1 * minSwipe) {
				changeImage('next');
			} else if (distX > minSwipe) {
				changeImage('prev');
			}
		}
	}
	lastTouch = [];
};

var resizeImageWindow = function resizeImageWindow() {
	var win = document.querySelector('.gallery__window'),
	    image = document.querySelector('.gallery__image'),
	    container = document.querySelector('.gallery__content'),
	    scalePercentage = win.classList.contains('gallery--fullscreen') ? 100 : 80,
	    mediaHeight = void 0,
	    mediaWidth = void 0;

	if (image && win) {
		window.setTimeout(function () {
			container.style.backgroundImage = 'url(' + image.src + ')';
		}, 1000);

		container.querySelector('.wait-icon').classList.add('gallery--fadeout');

		if (image.tagName.toLowerCase() === 'video') {
			mediaHeight = image.videoHeight;
			mediaWidth = image.videoWidth;
		} else {
			mediaHeight = image.naturalHeight;
			mediaWidth = image.naturalWidth;
			image.classList.remove('gallery--fadeout');
		}

		var imageHeight = window.innerHeight * scalePercentage / 100,
		    imageWidth = imageHeight * mediaWidth / mediaHeight;

		if (imageWidth > window.innerWidth * scalePercentage / 100) {
			imageWidth = window.innerWidth * scalePercentage / 100;
			imageHeight = imageWidth * mediaHeight / mediaWidth;
		}

		win.style.width = imageWidth + 'px';
		win.style.height = imageHeight + 'px';
		container.style.width = imageWidth + 'px';
		container.style.height = imageHeight + 'px';
		image.style.width = imageWidth + 'px';
		image.style.height = imageHeight + 'px';
	}
};

var updateShareIcons = function updateShareIcons() {
	var url = window.location.href,
	    docRoot = url.substr(0, url.lastIndexOf('/')),
	    title = encodeURIComponent(document.title),
	    image = document.querySelector('.gallery__image'),
	    imageUrl = null;

	if (image && image.src) {
		imageUrl = docRoot + image.src.substr(image.src.indexOf('/media'));
	}

	url = encodeURIComponent(url + window.location.hash);

	var twitterIcon = document.querySelector('.gallery__button--twitter');
	twitterIcon.addEventListener('click', function () {
		window.open('https://twitter.com/intent/tweet?text=' + title + ' - ' + url, 'twitter', 'height=400,width=400,resizable=no');
	});

	var googleIcon = document.querySelector('.gallery__button--google-plus');
	googleIcon.addEventListener('click', function () {
		window.open('https://plus.google.com/share?url=' + (imageUrl ? imageUrl : url), 'twitter', 'height=480,width=400,resizable=no');
	});

	var facebookLink = document.querySelector('.gallery__button--facebook');
	facebookLink.addEventListener('click', function () {
		window.open('https://www.facebook.com/sharer/sharer.php?u=' + (imageUrl ? imageUrl : url), 'facebook', 'height=400,width=400,resizable=no');
	});

	var mailLink = document.querySelector('.gallery__button--mail');
	mailLink.href = 'mailto:?subject=USA%20on%20rails&body=' + title + encodeURIComponent('\n\n') + url;
};

var openWindow = function openWindow(winContent, doResize) {
	var content = document.querySelector('.gallery__content'),
	    win = document.querySelector('.gallery__window'),
	    controls = win.querySelectorAll('.gallery__control:not(.gallery__share)'),
	    buttonDelete = document.querySelector('.gallery__button--delete'),
	    buttonMute = document.querySelector('.gallery__button--mute, .gallery__button--unmute'),
	    buttonClose = document.querySelector('.gallery__button--close'),
	    image = document.querySelector('img.gallery__image'),
	    navigation = document.querySelector('.gallery__navigation');

	buttonClose.classList.remove('gallery--hidden');
	navigation.classList.add('gallery--fadeout');

	if (win.classList.contains('gallery--fadeout')) {
		win.classList.remove('gallery--fadeout');
		content.classList.remove('gallery--fadeout');
	}

	content.innerHTML = winContent;

	var media = document.querySelector('.gallery__image');
	if (media) {
		media.classList.add('gallery--visible');
		window.location.hash = activeMarkerIndex;
		updateShareIcons();
		content.classList.add('gallery__image-container');
		if (!content.querySelector('.wait-icon')) {
			content.insertAdjacentHTML('beforeend', '<div class="wait-icon"></div>');
		}
		media.addEventListener('touchstart', imageTouchStart);
		media.addEventListener('touchend', imageTouchEnd);
		media.addEventListener('load', resizeImageWindow);
		media.addEventListener('loadedmetadata', resizeImageWindow);

		for (var i in controls) {
			var control = controls[i];
			if (control.classList) {
				control.classList.remove('gallery--hidden');
			}
		}

		if (window.location.href.indexOf(':8000') > -1) {
			buttonDelete.classList.remove('gallery--hidden');

			if (media.classList.contains('gallery__video')) {
				media = document.querySelector('.gallery__video');

				if (media.hasAttribute('muted')) {
					buttonMute.classList.remove('gallery__button--mute');
					buttonMute.classList.add('gallery__button--unmute');
				}
				buttonMute.classList.remove('gallery--hidden');
			} else {
				buttonMute.classList.add('gallery--hidden');
			}
		} else {
			buttonDelete.classList.add('gallery--hidden');
			buttonMute.classList.add('gallery--hidden');
		}
	}

	if (doResize) {
		resizeContent();
	}
};

var addMarkerClick = function addMarkerClick(marker, data) {
	marker.addListener('click', function () {
		var captionText = document.querySelector('.gallery__image-caption-text');

		document.title = [data.title, data.city, data.state].join(', ');

		captionText.innerHTML = marker.description;

		activeMarker = marker;
		activeMarkerIndex = marker.index;

		if (marker.contentType === 'photo') {
			openWindow('<img class="gallery__image gallery--fadeout" data-pk="' + data.pk + '" data-id="' + marker.index + '" src="' + marker.url + '" />');
		} else {
			openWindow('<video controls ' + (marker.url.indexOf('#muted') > -1 ? 'muted ' : '') + 'autoplay class="gallery__image gallery__video" data-pk="' + data.pk + '" data-id="' + marker.index + '" src="' + marker.url + '" />');
		}

		map.panTo(marker.position);

		map.setOptions({ keyboardShortcuts: false });
	});
};

var fadeControls = function fadeControls() {
	window.clearTimeout(timeoutControlFade);
	var controls = document.querySelectorAll('.gallery__window .gallery__control');
	for (var i in controls) {
		var control = controls[i];
		if (control.classList) {
			control.classList.remove('gallery--fadeout');
		}
	}
	timeoutControlFade = window.setTimeout(function () {
		for (var _i in controls) {
			var _control = controls[_i];
			if (_control.classList) {
				_control.classList.add('gallery--fadeout');
			}
		}
	}, 3000);
};

var addMarkers = function addMarkers() {
	var xhr = new XMLHttpRequest();
	xhr.onload = function () {
		var placemarks = xhr.responseXML.documentElement.getElementsByTagName("Placemark");
		[].forEach.call(placemarks, function (element) {
			//get coordinates and place name
			var url = element.getElementsByTagName('name')[0].textContent,
			    desc = element.getElementsByTagName('description')[0].textContent,
			    data = JSON.parse(desc);

			var pos = new google.maps.LatLng(data.latitude, data.longitude),
			    title = data.title;

			if (data.address !== data.title) {
				title += (title !== '' ? ', ' : '') + data.address;
			}
			title += (title !== '' ? '<br />' : '') + data.city + ", " + data.state;

			var contentType = url.indexOf('.jpg') > -1 ? 'photo' : 'video';

			var marker = new google.maps.Marker({
				index: markers.length,
				position: pos,
				contentType: contentType,
				description: title,
				map: map,
				url: url,
				title: data.title,
				icon: 'media/img/marker-' + contentType + '.png'
			});

			addMarkerClick(marker, data);

			markers.push(marker);
		});
		addMarkerCluster();

		var hashIndex = parseInt(window.location.hash.substr(1), 10);
		if (!isNaN(hashIndex) && markers[hashIndex]) {
			google.maps.event.trigger(markers[hashIndex], 'click');
		}
	};
	xhr.onerror = function () {
		console.log('Error while getting media/locations.kml.');
	};
	xhr.open('GET', 'media/locations.kml');
	xhr.responseType = 'document';
	xhr.send();
};

//initialise a map
var init = function init() {
	var latlng = new google.maps.LatLng(initialLatitude, initialLongitude),
	    myOptions = {
		zoom: initialZoom,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.SATELLITE // HYBRID
	};

	map = new google.maps.Map(document.getElementById('gallery__map'), myOptions);

	fillSelect('state', 'media/states.json');
	fillSelect('city', 'media/cities.json');
	addMarkers();
	fillLanguages();
	updateShareIcons();
};

var enterFullscreen = function enterFullscreen(element) {
	if (element.requestFullscreen) {
		element.requestFullscreen();
	} else if (element.mozRequestFullScreen) {
		element.mozRequestFullScreen();
	} else if (element.webkitRequestFullscreen) {
		element.webkitRequestFullscreen();
	} else if (element.msRequestFullscreen) {
		element.msRequestFullscreen();
	}
};

var exitFullscreen = function exitFullscreen() {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
	} else if (document.webkitExitFullscreen) {
		document.webkitExitFullscreen();
	}
};

var getCookie = function getCookie(name) {
	var cookieValue = null;
	if (document.cookie && document.cookie !== '') {
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
			var cookie = cookies[i].trim();
			// Does this cookie string begin with the name we want?
			if (cookie.substring(0, name.length + 1) === name + '=') {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
};

var stopVideo = function stopVideo(video) {
	if (video) {
		video.pause();
		video.currentTime = 0;
	}
};

var showInfo = function showInfo(type, id) {
	var xhr = new XMLHttpRequest();

	xhr.onload = function () {
		var data = JSON.parse(xhr.responseText);
		for (var i = 0; i < data.length; i++) {
			var item = data[i];
			if (item[type].pk === id && item.language === currentLanguage) {
				openWindow('<h1>' + item[type].name + '</h1><p>' + item.description + '</p>', true);
			}
		}
	};
	xhr.onerror = function () {
		console.log('Error while getting ' + type + '_descriptions.json.');
	};
	xhr.open("GET", 'media/' + type + '_descriptions.json');
	xhr.responseType = 'text';
	xhr.send();
};

var updateSelect = function updateSelect(event) {
	try {
		var data = JSON.parse(event.currentTarget.options[event.currentTarget.selectedIndex].value.split('\'').join('\"'));

		if (data.state) {
			showInfo('city', data.pk);
			window.location.hash = event.currentTarget.options[event.currentTarget.selectedIndex].text;

			currentCity = data.pk;
			currentState = data.state.pk;
			document.querySelector('.gallery__select--state [data-id="' + data.state.pk + '"]').selected = true;
			document.querySelector('.gallery__select--state').dataset.background = true;
			document.querySelector('.gallery__select--state').dispatchEvent(new Event('change'));
		} else {
			if (!document.querySelector('.gallery__select--state').dataset.background) {
				showInfo('state', data.pk);
				window.location.hash = event.currentTarget.options[event.currentTarget.selectedIndex].text;
			}
			delete document.querySelector('.gallery__select--state').dataset.background;
			var cities = document.querySelectorAll('.gallery__select--city [data-id]');
			for (var i = 0; i < cities.length; i++) {
				var city = cities[i];
				if (city && city.value) {
					var cityData = JSON.parse(city.value.split('\'').join('\"'));
					if (cityData.state.pk === data.pk) {
						city.style.display = 'block';
					} else {
						city.style.display = 'none';
					}
				}
			}
			if (currentState !== data.pk) {
				document.querySelector('.gallery__select--city').selectedIndex = 0;
				currentState = data.pk;
			}
		}
		var sw = new google.maps.LatLng(data.max_latitude, data.max_longitude);
		var ne = new google.maps.LatLng(data.min_latitude, data.min_longitude);
		new google.maps.LatLngBounds();
		var bounds = new google.maps.LatLngBounds();
		bounds.extend(sw);
		bounds.extend(ne);
		map.fitBounds(bounds);
	} catch (e) {
		if (event.currentTarget.classList.contains('gallery__select--state')) {
			var _cities = document.querySelectorAll('.gallery__select--city [data-id]');
			for (var _i2 = 0; _i2 < _cities.length; _i2++) {
				var _city = _cities[_i2];
				_city.style.display = 'block';
			}
			document.querySelector('.gallery__select--city').selectedIndex = 0;
			map.setCenter(new google.maps.LatLng(initialLatitude, initialLongitude));
			map.setZoom(initialZoom);
			currentState = -1;
		} else {
			document.querySelector('.gallery__select--state').dispatchEvent(new Event('change'));
		}
	}
};

var muteVideo = function muteVideo() {
	var csrftoken = getCookie('csrftoken'),
	    video = document.querySelector('.gallery__window .gallery__video'),
	    buttonMute = document.querySelector('.gallery__window .gallery__button--mute'),
	    buttonUnmute = document.querySelector('.gallery__window .gallery__button--unmute'),
	    id = video.dataset.pk;

	if (!isNaN(parseInt(id, 10))) {
		var xhr = new XMLHttpRequest();
		xhr.onload = function () {
			if (video.muted) {
				video.muted = false;
				video.volume = 1;
				buttonUnmute.classList.add('gallery__button--mute');
				buttonUnmute.classList.remove('gallery__button--unmute');
			} else {
				video.muted = true;
				buttonMute.classList.remove('gallery__button--mute');
				buttonMute.classList.add('gallery__button--unmute');
			}
		};
		xhr.onerror = function () {
			window.alert('Video ' + id + ' konnte nicht gemuted werden: ID nicht lesbar.');
		};
		var data = JSON.stringify({
			mute: buttonMute ? true : false
		});
		xhr.open('PATCH', '/api/images/' + id + '/');
		xhr.responseType = 'text';
		xhr.setRequestHeader('Content-type', 'application/json');
		xhr.setRequestHeader('X-CSRFToken', csrftoken);
		xhr.send(data);
	} else {
		window.alert('Video ' + id + ' konnte nicht gemuted werden: ID nicht lesbar.');
	}
};

var deletePicture = function deletePicture() {
	if (window.confirm('Willst du dieses Bild wirklich löschen?')) {
		var csrftoken = getCookie('csrftoken'),
		    id = document.querySelector('.gallery__window .gallery__image').dataset.pk;

		if (!isNaN(parseInt(id, 10))) {
			var xhr = new XMLHttpRequest();
			xhr.onload = function () {
				window.alert('Bild ' + id + ' wurde gelöscht, wechsle zum nächsten...');
				// Remove marker from map and from markers array
				markers[activeMarkerIndex].setMap(null);
				markers.splice(activeMarkerIndex, 1);

				// Update marker index for all following markers
				for (var i = activeMarkerIndex; i < markers.length; i++) {
					markers[i].index = i;
				}

				// Set back activeMarkerIndex since we will change to the next image which now has the same index as the deleted one
				activeMarkerIndex -= 1;
				document.querySelector('.gallery__image').dataset.id = activeMarkerIndex;
				changeImage('next');
			};
			xhr.onerror = function () {
				window.alert('Bild ' + id + ' konnte nicht gelöscht werden: ID nicht lesbar.');
			};
			xhr.open('DELETE', '/api/images/' + id + '/');
			xhr.responseType = "text";
			xhr.setRequestHeader("X-CSRFToken", csrftoken);
			xhr.send();
		} else {
			window.alert('Bild ' + id + ' konnte nicht gelöscht werden: ID nicht lesbar.');
		}
	}
};

//bind events for fullscreen button
document.querySelector('[data-button="fullscreen"]').addEventListener('click', function (event) {
	if (event.currentTarget.classList.contains('gallery__button--fullscreen')) {
		enterFullscreen(document.querySelector('.gallery__window'));
	} else {
		exitFullscreen();
	}
});

//bind events for close button
document.querySelector('[data-button="close"]').addEventListener('click', function () {
	var win = document.querySelector('.gallery__window'),
	    controls = win.querySelectorAll('.gallery__control'),
	    content = document.querySelector('.gallery__content'),
	    navigation = document.querySelector('.gallery__navigation'),
	    buttonCleanup = document.querySelector('.gallery__button--cleanup'),
	    mapElem = document.getElementById('gallery__map'),
	    media = document.querySelector('.gallery__image'),
	    video = document.querySelector('video');

	exitFullscreen();

	for (var i in controls) {
		var control = controls[i];
		if (control.classList) {
			control.classList.add('gallery--hidden');
		}
	}

	window.location.hash = '';
	document.title = defaultTitle;

	win.classList.add('gallery--fadeout');
	win.style.width = '0px';
	win.style.height = '0px';
	content.style.width = '0px';
	content.style.height = '0px';
	if (media) {
		media.style.width = '0px';
		media.style.height = '0px';
	}
	navigation.classList.remove('gallery--fadeout');
	if (content.classList.contains('gallery__image-container')) {
		content.classList.remove('gallery__image-container');
	} else {
		content.classList.add('gallery--fadeout');
	}

	if (window.location.href.indexOf(':8000') > -1) {
		buttonCleanup.classList.remove('gallery--hidden');
	}

	map.setOptions({ keyboardShortcuts: true });
	mapElem.focus();

	stopVideo(video);
});

//bind events for prev / next buttons
var buttons = document.querySelectorAll('.gallery__image-caption .gallery__button');
for (var i in buttons) {
	var button = buttons[i];
	if (button.addEventListener) {
		button.addEventListener('click', changeImage);
	}
}

//bind events for delete buttons
document.querySelector('[data-button="delete"]').addEventListener('click', deletePicture);
document.querySelector('[data-button="mute"]').addEventListener('click', muteVideo);

document.querySelector('.gallery__button--cleanup').addEventListener('click', function () {
	var xhr = new XMLHttpRequest(),
	    button = document.querySelector('.gallery__button--cleanup'),
	    defaultText = 'Daten bereinigen';

	xhr.onload = function () {
		button.removeAttribute('disabled');
		button.innerHTML = defaultText;
		window.location.reload(true);
	};
	xhr.onerror = function () {
		window.alert('Fehler beim Bereinigen der Bilder.');
		button.removeAttribute('disabled');
		button.innerHTML = defaultText;
	};
	xhr.open('GET', '/cleanup_images');
	xhr.responseType = "text";
	xhr.send();

	button.setAttribute('disabled', 'disabled');
	button.innerHTML = '<span class="wait-icon"></span> bitte warten';
});

var selects = document.querySelectorAll('.gallery__select');
for (var _i3 = 0; _i3 < selects.length; _i3++) {
	var select = selects[_i3];
	select.addEventListener('mousedown', function (event) {
		event.currentTarget.selectedIndex = -1;
	});
	select.addEventListener('change', updateSelect);
}

document.addEventListener('keyup', function (event) {
	if (document.querySelectorAll('.gallery__window.gallery--fadeout').length <= 0 && document.querySelectorAll('.gallery__image').length > 0) {
		if (event.keyCode === 37) {
			// left
			changeImage('prev');
		} else if (event.keyCode === 39) {
			// right
			changeImage('next');
		}
	}

	if (event.keyCode === 27) {
		// escape
		if (!document.querySelector('.gallery__window').classList.contains('gallery--fullscreen')) {
			document.querySelector('[data-button="close"]').dispatchEvent(new Event('click'));
		}
	}
});

window.addEventListener('resize', resizeImageWindow);

var fullScreenChange = function fullScreenChange() {
	if (!document.querySelector('.gallery__window').classList.contains('gallery--fullscreen')) {
		document.querySelector('.gallery__window').classList.add('gallery--fullscreen');
		document.querySelector('[data-button="fullscreen"]').classList.remove('gallery__button--fullscreen');
		document.querySelector('[data-button="fullscreen"]').classList.add('gallery__button--windowed');
	} else {
		document.querySelector('.gallery__window').classList.remove('gallery--fullscreen');
		document.querySelector('[data-button="fullscreen"]').classList.remove('gallery__button--windowed');
		document.querySelector('[data-button="fullscreen"]').classList.add('gallery__button--fullscreen');
	}
	resizeImageWindow();
};

document.addEventListener('fullscreenchange', fullScreenChange);
document.addEventListener('mozfullscreenchange', fullScreenChange);
document.addEventListener('webkitfullscreenchange', fullScreenChange);
document.addEventListener('MSFullscreenChange', fullScreenChange);

document.addEventListener('mousemove', fadeControls);
document.addEventListener('keyup', fadeControls);
document.addEventListener('click', fadeControls);

GoogleMapsLoader.load(function (g) {
	google = g;
	init();
});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * Npm version of markerClusterer works great with browserify and google maps for commonjs
 * https://www.npmjs.com/package/googlemaps
 * Difference from the original - adds a commonjs format and replaces window with global and some unit test
 * The original functionality it's not modified for docs and original source check
 * https://github.com/googlemaps/js-marker-clusterer
 */

/**
 * @name MarkerClusterer for Google Maps v3
 * @version version 1.0
 * @author Luke Mahe
 * @fileoverview
 * The library creates and manages per-zoom-level clusters for large amounts of
 * markers.
 * <br/>
 * This is a v3 implementation of the
 * <a href="http://gmaps-utility-library-dev.googlecode.com/svn/tags/markerclusterer/"
 * >v2 MarkerClusterer</a>.
 */

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * A Marker Clusterer that clusters markers.
 *
 * @param {google.maps.Map} map The Google map to attach to.
 * @param {Array.<google.maps.Marker>=} opt_markers Optional markers to add to
 *   the cluster.
 * @param {Object=} opt_options support the following options:
 *     'gridSize': (number) The grid size of a cluster in pixels.
 *     'maxZoom': (number) The maximum zoom level that a marker can be part of a
 *                cluster.
 *     'zoomOnClick': (boolean) Whether the default behaviour of clicking on a
 *                    cluster is to zoom into it.
 *     'averageCenter': (boolean) Wether the center of each cluster should be
 *                      the average of all markers in the cluster.
 *     'minimumClusterSize': (number) The minimum number of markers to be in a
 *                           cluster before the markers are hidden and a count
 *                           is shown.
 *     'styles': (object) An object that has style properties:
 *       'url': (string) The image url.
 *       'height': (number) The image height.
 *       'width': (number) The image width.
 *       'anchor': (Array) The anchor position of the label text.
 *       'textColor': (string) The text color.
 *       'textSize': (number) The text size.
 *       'backgroundPosition': (string) The position of the backgound x, y.
 * @constructor
 * @extends google.maps.OverlayView
 */
function MarkerClusterer(map, opt_markers, opt_options) {
  // MarkerClusterer implements google.maps.OverlayView interface. We use the
  // extend function to extend MarkerClusterer with google.maps.OverlayView
  // because it might not always be available when the code is defined so we
  // look for it at the last possible moment. If it doesn't exist now then
  // there is no point going ahead :)
  this.extend(MarkerClusterer, google.maps.OverlayView);
  this.map_ = map;

  /**
   * @type {Array.<google.maps.Marker>}
   * @private
   */
  this.markers_ = [];

  /**
   *  @type {Array.<Cluster>}
   */
  this.clusters_ = [];

  this.sizes = [53, 56, 66, 78, 90];

  /**
   * @private
   */
  this.styles_ = [];

  /**
   * @type {boolean}
   * @private
   */
  this.ready_ = false;

  var options = opt_options || {};

  /**
   * @type {number}
   * @private
   */
  this.gridSize_ = options['gridSize'] || 60;

  /**
   * @private
   */
  this.minClusterSize_ = options['minimumClusterSize'] || 2;


  /**
   * @type {?number}
   * @private
   */
  this.maxZoom_ = options['maxZoom'] || null;

  this.styles_ = options['styles'] || [];

  /**
   * @type {string}
   * @private
   */
  this.imagePath_ = options['imagePath'] ||
      this.MARKER_CLUSTER_IMAGE_PATH_;

  /**
   * @type {string}
   * @private
   */
  this.imageExtension_ = options['imageExtension'] ||
      this.MARKER_CLUSTER_IMAGE_EXTENSION_;

  /**
   * @type {boolean}
   * @private
   */
  this.zoomOnClick_ = true;

  if (options['zoomOnClick'] != undefined) {
    this.zoomOnClick_ = options['zoomOnClick'];
  }

  /**
   * @type {boolean}
   * @private
   */
  this.averageCenter_ = false;

  if (options['averageCenter'] != undefined) {
    this.averageCenter_ = options['averageCenter'];
  }

  this.setupStyles_();

  this.setMap(map);

  /**
   * @type {number}
   * @private
   */
  this.prevZoom_ = this.map_.getZoom();

  // Add the map event listeners
  var that = this;
  google.maps.event.addListener(this.map_, 'zoom_changed', function() {
    var zoom = that.map_.getZoom();

    if (that.prevZoom_ != zoom) {
      that.prevZoom_ = zoom;
      that.resetViewport();
    }
  });

  google.maps.event.addListener(this.map_, 'idle', function() {
    that.redraw();
  });

  // Finally, add the markers
  if (opt_markers && opt_markers.length) {
    this.addMarkers(opt_markers, false);
  }
}


/**
 * The marker cluster image path.
 *
 * @type {string}
 * @private
 */
MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_PATH_ =
    'http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/' +
    'images/m';


/**
 * The marker cluster image path.
 *
 * @type {string}
 * @private
 */
MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_EXTENSION_ = 'png';


/**
 * Extends a objects prototype by anothers.
 *
 * @param {Object} obj1 The object to be extended.
 * @param {Object} obj2 The object to extend with.
 * @return {Object} The new extended object.
 * @ignore
 */
MarkerClusterer.prototype.extend = function(obj1, obj2) {
  return (function(object) {
    for (var property in object.prototype) {
      this.prototype[property] = object.prototype[property];
    }
    return this;
  }).apply(obj1, [obj2]);
};


/**
 * Implementaion of the interface method.
 * @ignore
 */
MarkerClusterer.prototype.onAdd = function() {
  this.setReady_(true);
};

/**
 * Implementaion of the interface method.
 * @ignore
 */
MarkerClusterer.prototype.draw = function() {};

/**
 * Sets up the styles object.
 *
 * @private
 */
MarkerClusterer.prototype.setupStyles_ = function() {
  if (this.styles_.length) {
    return;
  }

  for (var i = 0, size; size = this.sizes[i]; i++) {
    this.styles_.push({
      url: this.imagePath_ + (i + 1) + '.' + this.imageExtension_,
      height: size,
      width: size
    });
  }
};

/**
 *  Fit the map to the bounds of the markers in the clusterer.
 */
MarkerClusterer.prototype.fitMapToMarkers = function() {
  var markers = this.getMarkers();
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0, marker; marker = markers[i]; i++) {
    bounds.extend(marker.getPosition());
  }

  this.map_.fitBounds(bounds);
};


/**
 *  Sets the styles.
 *
 *  @param {Object} styles The style to set.
 */
MarkerClusterer.prototype.setStyles = function(styles) {
  this.styles_ = styles;
};


/**
 *  Gets the styles.
 *
 *  @return {Object} The styles object.
 */
MarkerClusterer.prototype.getStyles = function() {
  return this.styles_;
};


/**
 * Whether zoom on click is set.
 *
 * @return {boolean} True if zoomOnClick_ is set.
 */
MarkerClusterer.prototype.isZoomOnClick = function() {
  return this.zoomOnClick_;
};

/**
 * Whether average center is set.
 *
 * @return {boolean} True if averageCenter_ is set.
 */
MarkerClusterer.prototype.isAverageCenter = function() {
  return this.averageCenter_;
};


/**
 *  Returns the array of markers in the clusterer.
 *
 *  @return {Array.<google.maps.Marker>} The markers.
 */
MarkerClusterer.prototype.getMarkers = function() {
  return this.markers_;
};


/**
 *  Returns the number of markers in the clusterer
 *
 *  @return {Number} The number of markers.
 */
MarkerClusterer.prototype.getTotalMarkers = function() {
  return this.markers_.length;
};


/**
 *  Sets the max zoom for the clusterer.
 *
 *  @param {number} maxZoom The max zoom level.
 */
MarkerClusterer.prototype.setMaxZoom = function(maxZoom) {
  this.maxZoom_ = maxZoom;
};


/**
 *  Gets the max zoom for the clusterer.
 *
 *  @return {number} The max zoom level.
 */
MarkerClusterer.prototype.getMaxZoom = function() {
  return this.maxZoom_;
};


/**
 *  The function for calculating the cluster icon image.
 *
 *  @param {Array.<google.maps.Marker>} markers The markers in the clusterer.
 *  @param {number} numStyles The number of styles available.
 *  @return {Object} A object properties: 'text' (string) and 'index' (number).
 *  @private
 */
MarkerClusterer.prototype.calculator_ = function(markers, numStyles) {
  var index = 0;
  var count = markers.length;
  var dv = count;
  while (dv !== 0) {
    dv = parseInt(dv / 10, 10);
    index++;
  }

  index = Math.min(index, numStyles);
  return {
    text: count,
    index: index
  };
};


/**
 * Set the calculator function.
 *
 * @param {function(Array, number)} calculator The function to set as the
 *     calculator. The function should return a object properties:
 *     'text' (string) and 'index' (number).
 *
 */
MarkerClusterer.prototype.setCalculator = function(calculator) {
  this.calculator_ = calculator;
};


/**
 * Get the calculator function.
 *
 * @return {function(Array, number)} the calculator function.
 */
MarkerClusterer.prototype.getCalculator = function() {
  return this.calculator_;
};


/**
 * Add an array of markers to the clusterer.
 *
 * @param {Array.<google.maps.Marker>} markers The markers to add.
 * @param {boolean=} opt_nodraw Whether to redraw the clusters.
 */
MarkerClusterer.prototype.addMarkers = function(markers, opt_nodraw) {
  for (var i = 0, marker; marker = markers[i]; i++) {
    this.pushMarkerTo_(marker);
  }
  if (!opt_nodraw) {
    this.redraw();
  }
};


/**
 * Pushes a marker to the clusterer.
 *
 * @param {google.maps.Marker} marker The marker to add.
 * @private
 */
MarkerClusterer.prototype.pushMarkerTo_ = function(marker) {
  marker.isAdded = false;
  if (marker['draggable']) {
    // If the marker is draggable add a listener so we update the clusters on
    // the drag end.
    var that = this;
    google.maps.event.addListener(marker, 'dragend', function() {
      marker.isAdded = false;
      that.repaint();
    });
  }
  this.markers_.push(marker);
};


/**
 * Adds a marker to the clusterer and redraws if needed.
 *
 * @param {google.maps.Marker} marker The marker to add.
 * @param {boolean=} opt_nodraw Whether to redraw the clusters.
 */
MarkerClusterer.prototype.addMarker = function(marker, opt_nodraw) {
  this.pushMarkerTo_(marker);
  if (!opt_nodraw) {
    this.redraw();
  }
};


/**
 * Removes a marker and returns true if removed, false if not
 *
 * @param {google.maps.Marker} marker The marker to remove
 * @return {boolean} Whether the marker was removed or not
 * @private
 */
MarkerClusterer.prototype.removeMarker_ = function(marker) {
  var index = -1;
  if (this.markers_.indexOf) {
    index = this.markers_.indexOf(marker);
  } else {
    for (var i = 0, m; m = this.markers_[i]; i++) {
      if (m == marker) {
        index = i;
        break;
      }
    }
  }

  if (index == -1) {
    // Marker is not in our list of markers.
    return false;
  }

  marker.setMap(null);

  this.markers_.splice(index, 1);

  return true;
};


/**
 * Remove a marker from the cluster.
 *
 * @param {google.maps.Marker} marker The marker to remove.
 * @param {boolean=} opt_nodraw Optional boolean to force no redraw.
 * @return {boolean} True if the marker was removed.
 */
MarkerClusterer.prototype.removeMarker = function(marker, opt_nodraw) {
  var removed = this.removeMarker_(marker);

  if (!opt_nodraw && removed) {
    this.resetViewport();
    this.redraw();
    return true;
  } else {
   return false;
  }
};


/**
 * Removes an array of markers from the cluster.
 *
 * @param {Array.<google.maps.Marker>} markers The markers to remove.
 * @param {boolean=} opt_nodraw Optional boolean to force no redraw.
 */
MarkerClusterer.prototype.removeMarkers = function(markers, opt_nodraw) {
  var removed = false;

  for (var i = 0, marker; marker = markers[i]; i++) {
    var r = this.removeMarker_(marker);
    removed = removed || r;
  }

  if (!opt_nodraw && removed) {
    this.resetViewport();
    this.redraw();
    return true;
  }
};


/**
 * Sets the clusterer's ready state.
 *
 * @param {boolean} ready The state.
 * @private
 */
MarkerClusterer.prototype.setReady_ = function(ready) {
  if (!this.ready_) {
    this.ready_ = ready;
    this.createClusters_();
  }
};


/**
 * Returns the number of clusters in the clusterer.
 *
 * @return {number} The number of clusters.
 */
MarkerClusterer.prototype.getTotalClusters = function() {
  return this.clusters_.length;
};


/**
 * Returns the google map that the clusterer is associated with.
 *
 * @return {google.maps.Map} The map.
 */
MarkerClusterer.prototype.getMap = function() {
  return this.map_;
};


/**
 * Sets the google map that the clusterer is associated with.
 *
 * @param {google.maps.Map} map The map.
 */
MarkerClusterer.prototype.setMap = function(map) {
  this.map_ = map;
};


/**
 * Returns the size of the grid.
 *
 * @return {number} The grid size.
 */
MarkerClusterer.prototype.getGridSize = function() {
  return this.gridSize_;
};


/**
 * Sets the size of the grid.
 *
 * @param {number} size The grid size.
 */
MarkerClusterer.prototype.setGridSize = function(size) {
  this.gridSize_ = size;
};


/**
 * Returns the min cluster size.
 *
 * @return {number} The grid size.
 */
MarkerClusterer.prototype.getMinClusterSize = function() {
  return this.minClusterSize_;
};

/**
 * Sets the min cluster size.
 *
 * @param {number} size The grid size.
 */
MarkerClusterer.prototype.setMinClusterSize = function(size) {
  this.minClusterSize_ = size;
};


/**
 * Extends a bounds object by the grid size.
 *
 * @param {google.maps.LatLngBounds} bounds The bounds to extend.
 * @return {google.maps.LatLngBounds} The extended bounds.
 */
MarkerClusterer.prototype.getExtendedBounds = function(bounds) {
  var projection = this.getProjection();

  // Turn the bounds into latlng.
  var tr = new google.maps.LatLng(bounds.getNorthEast().lat(),
      bounds.getNorthEast().lng());
  var bl = new google.maps.LatLng(bounds.getSouthWest().lat(),
      bounds.getSouthWest().lng());

  // Convert the points to pixels and the extend out by the grid size.
  var trPix = projection.fromLatLngToDivPixel(tr);
  trPix.x += this.gridSize_;
  trPix.y -= this.gridSize_;

  var blPix = projection.fromLatLngToDivPixel(bl);
  blPix.x -= this.gridSize_;
  blPix.y += this.gridSize_;

  // Convert the pixel points back to LatLng
  var ne = projection.fromDivPixelToLatLng(trPix);
  var sw = projection.fromDivPixelToLatLng(blPix);

  // Extend the bounds to contain the new bounds.
  bounds.extend(ne);
  bounds.extend(sw);

  return bounds;
};


/**
 * Determins if a marker is contained in a bounds.
 *
 * @param {google.maps.Marker} marker The marker to check.
 * @param {google.maps.LatLngBounds} bounds The bounds to check against.
 * @return {boolean} True if the marker is in the bounds.
 * @private
 */
MarkerClusterer.prototype.isMarkerInBounds_ = function(marker, bounds) {
  return bounds.contains(marker.getPosition());
};


/**
 * Clears all clusters and markers from the clusterer.
 */
MarkerClusterer.prototype.clearMarkers = function() {
  this.resetViewport(true);

  // Set the markers a empty array.
  this.markers_ = [];
};


/**
 * Clears all existing clusters and recreates them.
 * @param {boolean} opt_hide To also hide the marker.
 */
MarkerClusterer.prototype.resetViewport = function(opt_hide) {
  // Remove all the clusters
  for (var i = 0, cluster; cluster = this.clusters_[i]; i++) {
    cluster.remove();
  }

  // Reset the markers to not be added and to be invisible.
  for (var i = 0, marker; marker = this.markers_[i]; i++) {
    marker.isAdded = false;
    if (opt_hide) {
      marker.setMap(null);
    }
  }

  this.clusters_ = [];
};

/**
 *
 */
MarkerClusterer.prototype.repaint = function() {
  var oldClusters = this.clusters_.slice();
  this.clusters_.length = 0;
  this.resetViewport();
  this.redraw();

  // Remove the old clusters.
  // Do it in a timeout so the other clusters have been drawn first.
  window.setTimeout(function() {
    for (var i = 0, cluster; cluster = oldClusters[i]; i++) {
      cluster.remove();
    }
  }, 0);
};


/**
 * Redraws the clusters.
 */
MarkerClusterer.prototype.redraw = function() {
  this.createClusters_();
};


/**
 * Calculates the distance between two latlng locations in km.
 * @see http://www.movable-type.co.uk/scripts/latlong.html
 *
 * @param {google.maps.LatLng} p1 The first lat lng point.
 * @param {google.maps.LatLng} p2 The second lat lng point.
 * @return {number} The distance between the two points in km.
 * @private
*/
MarkerClusterer.prototype.distanceBetweenPoints_ = function(p1, p2) {
  if (!p1 || !p2) {
    return 0;
  }

  var R = 6371; // Radius of the Earth in km
  var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
  var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
};


/**
 * Add a marker to a cluster, or creates a new cluster.
 *
 * @param {google.maps.Marker} marker The marker to add.
 * @private
 */
MarkerClusterer.prototype.addToClosestCluster_ = function(marker) {
  var distance = 40000; // Some large number
  var clusterToAddTo = null;
  var pos = marker.getPosition();
  for (var i = 0, cluster; cluster = this.clusters_[i]; i++) {
    var center = cluster.getCenter();
    if (center) {
      var d = this.distanceBetweenPoints_(center, marker.getPosition());
      if (d < distance) {
        distance = d;
        clusterToAddTo = cluster;
      }
    }
  }

  if (clusterToAddTo && clusterToAddTo.isMarkerInClusterBounds(marker)) {
    clusterToAddTo.addMarker(marker);
  } else {
    var cluster = new Cluster(this);
    cluster.addMarker(marker);
    this.clusters_.push(cluster);
  }
};


/**
 * Creates the clusters.
 *
 * @private
 */
MarkerClusterer.prototype.createClusters_ = function() {
  if (!this.ready_) {
    return;
  }

  // Get our current map view bounds.
  // Create a new bounds object so we don't affect the map.
  var mapBounds = new google.maps.LatLngBounds(this.map_.getBounds().getSouthWest(),
      this.map_.getBounds().getNorthEast());
  var bounds = this.getExtendedBounds(mapBounds);

  for (var i = 0, marker; marker = this.markers_[i]; i++) {
    if (!marker.isAdded && this.isMarkerInBounds_(marker, bounds)) {
      this.addToClosestCluster_(marker);
    }
  }
};


/**
 * A cluster that contains markers.
 *
 * @param {MarkerClusterer} markerClusterer The markerclusterer that this
 *     cluster is associated with.
 * @constructor
 * @ignore
 */
function Cluster(markerClusterer) {
  this.markerClusterer_ = markerClusterer;
  this.map_ = markerClusterer.getMap();
  this.gridSize_ = markerClusterer.getGridSize();
  this.minClusterSize_ = markerClusterer.getMinClusterSize();
  this.averageCenter_ = markerClusterer.isAverageCenter();
  this.center_ = null;
  this.markers_ = [];
  this.bounds_ = null;
  this.clusterIcon_ = new ClusterIcon(this, markerClusterer.getStyles(),
      markerClusterer.getGridSize());
}

/**
 * Determins if a marker is already added to the cluster.
 *
 * @param {google.maps.Marker} marker The marker to check.
 * @return {boolean} True if the marker is already added.
 */
Cluster.prototype.isMarkerAlreadyAdded = function(marker) {
  if (this.markers_.indexOf) {
    return this.markers_.indexOf(marker) != -1;
  } else {
    for (var i = 0, m; m = this.markers_[i]; i++) {
      if (m == marker) {
        return true;
      }
    }
  }
  return false;
};


/**
 * Add a marker the cluster.
 *
 * @param {google.maps.Marker} marker The marker to add.
 * @return {boolean} True if the marker was added.
 */
Cluster.prototype.addMarker = function(marker) {
  if (this.isMarkerAlreadyAdded(marker)) {
    return false;
  }

  if (!this.center_) {
    this.center_ = marker.getPosition();
    this.calculateBounds_();
  } else {
    if (this.averageCenter_) {
      var l = this.markers_.length + 1;
      var lat = (this.center_.lat() * (l-1) + marker.getPosition().lat()) / l;
      var lng = (this.center_.lng() * (l-1) + marker.getPosition().lng()) / l;
      this.center_ = new google.maps.LatLng(lat, lng);
      this.calculateBounds_();
    }
  }

  marker.isAdded = true;
  this.markers_.push(marker);

  var len = this.markers_.length;
  if (len < this.minClusterSize_ && marker.getMap() != this.map_) {
    // Min cluster size not reached so show the marker.
    marker.setMap(this.map_);
  }

  if (len == this.minClusterSize_) {
    // Hide the markers that were showing.
    for (var i = 0; i < len; i++) {
      this.markers_[i].setMap(null);
    }
  }

  if (len >= this.minClusterSize_) {
    marker.setMap(null);
  }

  this.updateIcon();
  return true;
};


/**
 * Returns the marker clusterer that the cluster is associated with.
 *
 * @return {MarkerClusterer} The associated marker clusterer.
 */
Cluster.prototype.getMarkerClusterer = function() {
  return this.markerClusterer_;
};


/**
 * Returns the bounds of the cluster.
 *
 * @return {google.maps.LatLngBounds} the cluster bounds.
 */
Cluster.prototype.getBounds = function() {
  var bounds = new google.maps.LatLngBounds(this.center_, this.center_);
  var markers = this.getMarkers();
  for (var i = 0, marker; marker = markers[i]; i++) {
    bounds.extend(marker.getPosition());
  }
  return bounds;
};


/**
 * Removes the cluster
 */
Cluster.prototype.remove = function() {
  this.clusterIcon_.remove();
  this.markers_.length = 0;
  delete this.markers_;
};


/**
 * Returns the center of the cluster.
 *
 * @return {number} The cluster center.
 */
Cluster.prototype.getSize = function() {
  return this.markers_.length;
};


/**
 * Returns the center of the cluster.
 *
 * @return {Array.<google.maps.Marker>} The cluster center.
 */
Cluster.prototype.getMarkers = function() {
  return this.markers_;
};


/**
 * Returns the center of the cluster.
 *
 * @return {google.maps.LatLng} The cluster center.
 */
Cluster.prototype.getCenter = function() {
  return this.center_;
};


/**
 * Calculated the extended bounds of the cluster with the grid.
 *
 * @private
 */
Cluster.prototype.calculateBounds_ = function() {
  var bounds = new google.maps.LatLngBounds(this.center_, this.center_);
  this.bounds_ = this.markerClusterer_.getExtendedBounds(bounds);
};


/**
 * Determines if a marker lies in the clusters bounds.
 *
 * @param {google.maps.Marker} marker The marker to check.
 * @return {boolean} True if the marker lies in the bounds.
 */
Cluster.prototype.isMarkerInClusterBounds = function(marker) {
  return this.bounds_.contains(marker.getPosition());
};


/**
 * Returns the map that the cluster is associated with.
 *
 * @return {google.maps.Map} The map.
 */
Cluster.prototype.getMap = function() {
  return this.map_;
};


/**
 * Updates the cluster icon
 */
Cluster.prototype.updateIcon = function() {
  var zoom = this.map_.getZoom();
  var mz = this.markerClusterer_.getMaxZoom();

  if (mz && zoom > mz) {
    // The zoom is greater than our max zoom so show all the markers in cluster.
    for (var i = 0, marker; marker = this.markers_[i]; i++) {
      marker.setMap(this.map_);
    }
    return;
  }

  if (this.markers_.length < this.minClusterSize_) {
    // Min cluster size not yet reached.
    this.clusterIcon_.hide();
    return;
  }

  var numStyles = this.markerClusterer_.getStyles().length;
  var sums = this.markerClusterer_.getCalculator()(this.markers_, numStyles);
  this.clusterIcon_.setCenter(this.center_);
  this.clusterIcon_.setSums(sums);
  this.clusterIcon_.show();
};


/**
 * A cluster icon
 *
 * @param {Cluster} cluster The cluster to be associated with.
 * @param {Object} styles An object that has style properties:
 *     'url': (string) The image url.
 *     'height': (number) The image height.
 *     'width': (number) The image width.
 *     'anchor': (Array) The anchor position of the label text.
 *     'textColor': (string) The text color.
 *     'textSize': (number) The text size.
 *     'backgroundPosition: (string) The background postition x, y.
 * @param {number=} opt_padding Optional padding to apply to the cluster icon.
 * @constructor
 * @extends google.maps.OverlayView
 * @ignore
 */
function ClusterIcon(cluster, styles, opt_padding) {
  cluster.getMarkerClusterer().extend(ClusterIcon, google.maps.OverlayView);

  this.styles_ = styles;
  this.padding_ = opt_padding || 0;
  this.cluster_ = cluster;
  this.center_ = null;
  this.map_ = cluster.getMap();
  this.div_ = null;
  this.sums_ = null;
  this.visible_ = false;

  this.setMap(this.map_);
}


/**
 * Triggers the clusterclick event and zoom's if the option is set.
 */
ClusterIcon.prototype.triggerClusterClick = function() {
  var markerClusterer = this.cluster_.getMarkerClusterer();

  // Trigger the clusterclick event.
  google.maps.event.trigger(markerClusterer, 'clusterclick', this.cluster_);

  if (markerClusterer.isZoomOnClick()) {
    // Zoom into the cluster.
    this.map_.fitBounds(this.cluster_.getBounds());
  }
};


/**
 * Adding the cluster icon to the dom.
 * @ignore
 */
ClusterIcon.prototype.onAdd = function() {
  this.div_ = document.createElement('DIV');
  if (this.visible_) {
    var pos = this.getPosFromLatLng_(this.center_);
    this.div_.style.cssText = this.createCss(pos);
    this.div_.innerHTML = this.sums_.text;
  }

  var panes = this.getPanes();
  panes.overlayMouseTarget.appendChild(this.div_);

  var that = this;
  google.maps.event.addDomListener(this.div_, 'click', function() {
    that.triggerClusterClick();
  });
};


/**
 * Returns the position to place the div dending on the latlng.
 *
 * @param {google.maps.LatLng} latlng The position in latlng.
 * @return {google.maps.Point} The position in pixels.
 * @private
 */
ClusterIcon.prototype.getPosFromLatLng_ = function(latlng) {
  var pos = this.getProjection().fromLatLngToDivPixel(latlng);
  pos.x -= parseInt(this.width_ / 2, 10);
  pos.y -= parseInt(this.height_ / 2, 10);
  return pos;
};


/**
 * Draw the icon.
 * @ignore
 */
ClusterIcon.prototype.draw = function() {
  if (this.visible_) {
    var pos = this.getPosFromLatLng_(this.center_);
    this.div_.style.top = pos.y + 'px';
    this.div_.style.left = pos.x + 'px';
  }
};


/**
 * Hide the icon.
 */
ClusterIcon.prototype.hide = function() {
  if (this.div_) {
    this.div_.style.display = 'none';
  }
  this.visible_ = false;
};


/**
 * Position and show the icon.
 */
ClusterIcon.prototype.show = function() {
  if (this.div_) {
    var pos = this.getPosFromLatLng_(this.center_);
    this.div_.style.cssText = this.createCss(pos);
    this.div_.style.display = '';
  }
  this.visible_ = true;
};


/**
 * Remove the icon from the map
 */
ClusterIcon.prototype.remove = function() {
  this.setMap(null);
};


/**
 * Implementation of the onRemove interface.
 * @ignore
 */
ClusterIcon.prototype.onRemove = function() {
  if (this.div_ && this.div_.parentNode) {
    this.hide();
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
  }
};


/**
 * Set the sums of the icon.
 *
 * @param {Object} sums The sums containing:
 *   'text': (string) The text to display in the icon.
 *   'index': (number) The style index of the icon.
 */
ClusterIcon.prototype.setSums = function(sums) {
  this.sums_ = sums;
  this.text_ = sums.text;
  this.index_ = sums.index;
  if (this.div_) {
    this.div_.innerHTML = sums.text;
  }

  this.useStyle();
};


/**
 * Sets the icon to the the styles.
 */
ClusterIcon.prototype.useStyle = function() {
  var index = Math.max(0, this.sums_.index - 1);
  index = Math.min(this.styles_.length - 1, index);
  var style = this.styles_[index];
  this.url_ = style['url'];
  this.height_ = style['height'];
  this.width_ = style['width'];
  this.textColor_ = style['textColor'];
  this.anchor_ = style['anchor'];
  this.textSize_ = style['textSize'];
  this.backgroundPosition_ = style['backgroundPosition'];
};


/**
 * Sets the center of the icon.
 *
 * @param {google.maps.LatLng} center The latlng to set as the center.
 */
ClusterIcon.prototype.setCenter = function(center) {
  this.center_ = center;
};


/**
 * Create the css text based on the position of the icon.
 *
 * @param {google.maps.Point} pos The position.
 * @return {string} The css style text.
 */
ClusterIcon.prototype.createCss = function(pos) {
  var style = [];
  style.push('background-image:url(' + this.url_ + ');');
  var backgroundPosition = this.backgroundPosition_ ? this.backgroundPosition_ : '0 0';
  style.push('background-position:' + backgroundPosition + ';');

  if (typeof this.anchor_ === 'object') {
    if (typeof this.anchor_[0] === 'number' && this.anchor_[0] > 0 &&
        this.anchor_[0] < this.height_) {
      style.push('height:' + (this.height_ - this.anchor_[0]) +
          'px; padding-top:' + this.anchor_[0] + 'px;');
    } else {
      style.push('height:' + this.height_ + 'px; line-height:' + this.height_ +
          'px;');
    }
    if (typeof this.anchor_[1] === 'number' && this.anchor_[1] > 0 &&
        this.anchor_[1] < this.width_) {
      style.push('width:' + (this.width_ - this.anchor_[1]) +
          'px; padding-left:' + this.anchor_[1] + 'px;');
    } else {
      style.push('width:' + this.width_ + 'px; text-align:center;');
    }
  } else {
    style.push('height:' + this.height_ + 'px; line-height:' +
        this.height_ + 'px; width:' + this.width_ + 'px; text-align:center;');
  }

  var txtColor = this.textColor_ ? this.textColor_ : 'black';
  var txtSize = this.textSize_ ? this.textSize_ : 11;

  style.push('cursor:pointer; top:' + pos.y + 'px; left:' +
      pos.x + 'px; color:' + txtColor + '; position:absolute; font-size:' +
      txtSize + 'px; font-family:Arial,sans-serif; font-weight:bold');
  return style.join('');
};


// Export Symbols for Closure
// If you are not going to compile with closure then you can remove the
// code below.
global['MarkerClusterer'] = MarkerClusterer;
MarkerClusterer.prototype['addMarker'] = MarkerClusterer.prototype.addMarker;
MarkerClusterer.prototype['addMarkers'] = MarkerClusterer.prototype.addMarkers;
MarkerClusterer.prototype['clearMarkers'] =
    MarkerClusterer.prototype.clearMarkers;
MarkerClusterer.prototype['fitMapToMarkers'] =
    MarkerClusterer.prototype.fitMapToMarkers;
MarkerClusterer.prototype['getCalculator'] =
    MarkerClusterer.prototype.getCalculator;
MarkerClusterer.prototype['getGridSize'] =
    MarkerClusterer.prototype.getGridSize;
MarkerClusterer.prototype['getExtendedBounds'] =
    MarkerClusterer.prototype.getExtendedBounds;
MarkerClusterer.prototype['getMap'] = MarkerClusterer.prototype.getMap;
MarkerClusterer.prototype['getMarkers'] = MarkerClusterer.prototype.getMarkers;
MarkerClusterer.prototype['getMaxZoom'] = MarkerClusterer.prototype.getMaxZoom;
MarkerClusterer.prototype['getStyles'] = MarkerClusterer.prototype.getStyles;
MarkerClusterer.prototype['getTotalClusters'] =
    MarkerClusterer.prototype.getTotalClusters;
MarkerClusterer.prototype['getTotalMarkers'] =
    MarkerClusterer.prototype.getTotalMarkers;
MarkerClusterer.prototype['redraw'] = MarkerClusterer.prototype.redraw;
MarkerClusterer.prototype['removeMarker'] =
    MarkerClusterer.prototype.removeMarker;
MarkerClusterer.prototype['removeMarkers'] =
    MarkerClusterer.prototype.removeMarkers;
MarkerClusterer.prototype['resetViewport'] =
    MarkerClusterer.prototype.resetViewport;
MarkerClusterer.prototype['repaint'] =
    MarkerClusterer.prototype.repaint;
MarkerClusterer.prototype['setCalculator'] =
    MarkerClusterer.prototype.setCalculator;
MarkerClusterer.prototype['setGridSize'] =
    MarkerClusterer.prototype.setGridSize;
MarkerClusterer.prototype['setMaxZoom'] =
    MarkerClusterer.prototype.setMaxZoom;
MarkerClusterer.prototype['onAdd'] = MarkerClusterer.prototype.onAdd;
MarkerClusterer.prototype['draw'] = MarkerClusterer.prototype.draw;

Cluster.prototype['getCenter'] = Cluster.prototype.getCenter;
Cluster.prototype['getSize'] = Cluster.prototype.getSize;
Cluster.prototype['getMarkers'] = Cluster.prototype.getMarkers;

ClusterIcon.prototype['onAdd'] = ClusterIcon.prototype.onAdd;
ClusterIcon.prototype['draw'] = ClusterIcon.prototype.draw;
ClusterIcon.prototype['onRemove'] = ClusterIcon.prototype.onRemove;


module.exports = MarkerClusterer;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 3 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(root, factory) {

	if (root === null) {
		throw new Error('Google-maps package can be used only in browser');
	}

	if (true) {
		!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.GoogleMapsLoader = factory();
	}

})(typeof window !== 'undefined' ? window : null, function() {


	'use strict';


	var googleVersion = '3.18';

	var script = null;

	var google = null;

	var loading = false;

	var callbacks = [];

	var onLoadEvents = [];

	var originalCreateLoaderMethod = null;


	var GoogleMapsLoader = {};


	GoogleMapsLoader.URL = 'https://maps.googleapis.com/maps/api/js';

	GoogleMapsLoader.KEY = null;

	GoogleMapsLoader.LIBRARIES = [];

	GoogleMapsLoader.CLIENT = null;

	GoogleMapsLoader.CHANNEL = null;

	GoogleMapsLoader.LANGUAGE = null;

	GoogleMapsLoader.REGION = null;

	GoogleMapsLoader.VERSION = googleVersion;

	GoogleMapsLoader.WINDOW_CALLBACK_NAME = '__google_maps_api_provider_initializator__';


	GoogleMapsLoader._googleMockApiObject = {};


	GoogleMapsLoader.load = function(fn) {
		if (google === null) {
			if (loading === true) {
				if (fn) {
					callbacks.push(fn);
				}
			} else {
				loading = true;

				window[GoogleMapsLoader.WINDOW_CALLBACK_NAME] = function() {
					ready(fn);
				};

				GoogleMapsLoader.createLoader();
			}
		} else if (fn) {
			fn(google);
		}
	};


	GoogleMapsLoader.createLoader = function() {
		script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = GoogleMapsLoader.createUrl();

		document.body.appendChild(script);
	};


	GoogleMapsLoader.isLoaded = function() {
		return google !== null;
	};


	GoogleMapsLoader.createUrl = function() {
		var url = GoogleMapsLoader.URL;

		url += '?callback=' + GoogleMapsLoader.WINDOW_CALLBACK_NAME;

		if (GoogleMapsLoader.KEY) {
			url += '&key=' + GoogleMapsLoader.KEY;
		}

		if (GoogleMapsLoader.LIBRARIES.length > 0) {
			url += '&libraries=' + GoogleMapsLoader.LIBRARIES.join(',');
		}

		if (GoogleMapsLoader.CLIENT) {
			url += '&client=' + GoogleMapsLoader.CLIENT + '&v=' + GoogleMapsLoader.VERSION;
		}

		if (GoogleMapsLoader.CHANNEL) {
			url += '&channel=' + GoogleMapsLoader.CHANNEL;
		}

		if (GoogleMapsLoader.LANGUAGE) {
			url += '&language=' + GoogleMapsLoader.LANGUAGE;
		}

		if (GoogleMapsLoader.REGION) {
			url += '&region=' + GoogleMapsLoader.REGION;
		}

		return url;
	};


	GoogleMapsLoader.release = function(fn) {
		var release = function() {
			GoogleMapsLoader.KEY = null;
			GoogleMapsLoader.LIBRARIES = [];
			GoogleMapsLoader.CLIENT = null;
			GoogleMapsLoader.CHANNEL = null;
			GoogleMapsLoader.LANGUAGE = null;
			GoogleMapsLoader.REGION = null;
			GoogleMapsLoader.VERSION = googleVersion;

			google = null;
			loading = false;
			callbacks = [];
			onLoadEvents = [];

			if (typeof window.google !== 'undefined') {
				delete window.google;
			}

			if (typeof window[GoogleMapsLoader.WINDOW_CALLBACK_NAME] !== 'undefined') {
				delete window[GoogleMapsLoader.WINDOW_CALLBACK_NAME];
			}

			if (originalCreateLoaderMethod !== null) {
				GoogleMapsLoader.createLoader = originalCreateLoaderMethod;
				originalCreateLoaderMethod = null;
			}

			if (script !== null) {
				script.parentElement.removeChild(script);
				script = null;
			}

			if (fn) {
				fn();
			}
		};

		if (loading) {
			GoogleMapsLoader.load(function() {
				release();
			});
		} else {
			release();
		}
	};


	GoogleMapsLoader.onLoad = function(fn) {
		onLoadEvents.push(fn);
	};


	GoogleMapsLoader.makeMock = function() {
		originalCreateLoaderMethod = GoogleMapsLoader.createLoader;

		GoogleMapsLoader.createLoader = function() {
			window.google = GoogleMapsLoader._googleMockApiObject;
			window[GoogleMapsLoader.WINDOW_CALLBACK_NAME]();
		};
	};


	var ready = function(fn) {
		var i;

		loading = false;

		if (google === null) {
			google = window.google;
		}

		for (i = 0; i < onLoadEvents.length; i++) {
			onLoadEvents[i](google);
		}

		if (fn) {
			fn(google);
		}

		for (i = 0; i < callbacks.length; i++) {
			callbacks[i](google);
		}

		callbacks = [];
	};


	return GoogleMapsLoader;

});


/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map