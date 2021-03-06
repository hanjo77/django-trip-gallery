'use strict';

let map,
	markers = [],
	markerclusterer,
	activeMarker,
	activeMarkerIndex,
	lastTouch = [],
	MarkerClusterer = require('node-js-marker-clusterer'),
	google = null,
	timeoutControlFade,
	initialZoom = 4,
	initialLatitude = 38.9284715,
	initialLongitude = -97.5515638,
	currentState,
	currentCity,
	currentLanguage,
	defaultTitle = document.title,
	languages = ['de', 'en'];

let GoogleMapsLoader = require('google-maps');
GoogleMapsLoader.KEY = 'AIzaSyD_C6GDv2SAhTGc2ijeomtQThYpS761PvU';

const fillSelect = (type, url) => {
	let xhr = new XMLHttpRequest(),
		hash = window.location.hash.substr(1);

	xhr.onload = () => {
		let data = JSON.parse(xhr.responseText);
		let select = document.querySelector('.gallery__select--' + type),
			option;
		for (let i = 0; i < data.length; i++) {
			option = data[i];
			select.insertAdjacentHTML('beforeend', '<option data-id="' + option.pk + '" value="' + JSON.stringify(option).split('\"').join('\'') + '">' + option.name + '</option>');
			if (option.name === hash) {
				select.selectedIndex = i + 1;
				select.dispatchEvent(new Event('change'));
			}
		}
	};
	xhr.onerror = () => {
	  console.log('Error while getting ' + url + '.');
	};
	xhr.open("GET", url);
	xhr.responseType = 'text';
	xhr.send();
};

const resizeContent = () => {
	let win = document.querySelector('.gallery__window'),
		content = document.querySelector('.gallery__content'),
		emSize = parseFloat(getComputedStyle(content).fontSize);

	win.style.width = 'auto';
	win.style.height = 'auto';
	content.style.width = 'auto';
	content.style.height = 'auto';
	win.style.width = win.offsetWidth + 'px';
	win.style.height = win.offsetHeight + 'px';
	content.style.width = (content.offsetWidth - (emSize * 2)) + 'px';
	content.style.height = (content.offsetHeight - (emSize * 2)) + 'px';
};

const localizeData = (lang) => {
	if (!lang) {
		lang = navigator.language || navigator.userLanguage;
		let hash = window.location.hash.substr(1);
		if (languages.includes(hash)) {
			lang = hash;
		}
	}

	let select = document.querySelector('.gallery__select--language'),
		url = 'media/locale-' + lang + '.json',
		xhr = new XMLHttpRequest();

	for (let i = 0; i < select.options.length; i++) {
		if (select.options[i].value === lang) {
			select.selectedIndex = i;
		}
	}
	xhr.onload = () => {
		if(xhr.status === 404) {
			localizeData('en');
		}
		else {
			let data = JSON.parse(xhr.responseText);
			for (let key in data) {
				let elem = document.querySelector('[data-locale="' + key + '"]');
				if (elem) {
					elem.innerHTML = data[key];
				}
			}

			currentLanguage = lang;
			resizeContent();
		}
	};
	xhr.onerror = () => {
		localizeData('en');
	};
	xhr.open("GET", url);
	xhr.responseType = 'text';
	xhr.send();
};

const fillLanguage = (select, language) => {
	let xhr = new XMLHttpRequest();

	xhr.onload = () => {
		let data = JSON.parse(xhr.responseText);
		select.insertAdjacentHTML('beforeend', '<option value="' + language + '">' + data.meta.title + '</option>');
	};
	xhr.onerror = () => {
	  console.log('Error while getting ' + language + ' translation.');
	};
	xhr.open("GET", 'media/locale-' + language + '.json');
	xhr.responseType = 'text';
	xhr.send();
};

const fillLanguages = () => {
	let languages = ['de', 'en'],
		select = document.querySelector('.gallery__select--language');

	for (let i = 0; i < languages.length; i++) {
		fillLanguage(select, languages[i]);
	}

	select.addEventListener('change', (event) => {
		localizeData(event.target.options[event.target.selectedIndex].value);
	});

	localizeData();
};

const addMarkerCluster = () => {
	let clusterStyles = [
		{
			textColor: 'white',
			url: 'media/img/cluster-small.png',
			height: 42,
			width: 42
		},
		{
			textColor: 'white',
			url: 'media/img/cluster-medium.png',
			height: 54,
			width: 54
		},
		{
			textColor: 'white',
			url: 'media/img/cluster-large.png',
			height: 66,
			width: 66
		}
	];

	let mcOptions = {
	    gridSize: 66,
	    styles: clusterStyles,
	    maxZoom: 19
	};

	markerclusterer = new MarkerClusterer(map, markers, mcOptions);
};

const changeImage = (direction) => {
	if (typeof direction === 'object') {
		direction = direction.currentTarget.dataset.button;
	}
	let index = parseInt(document.querySelector('.gallery__image').dataset.id, 10),
		newIndex = index;

	if (direction === 'prev') {
		newIndex = (index > 0 ? index - 1 : markers.length-1);
	}
	else if (direction === 'next') {
		newIndex = (index < markers.length - 1 ? index + 1 : 0);
	}

	if (index !== newIndex) {
		google.maps.event.trigger(markers[newIndex], 'click');
	}
};

const imageTouchStart = (event) => {
	let timeStamp = event.timeStamp;
	if (event.changedTouches.length > 0) {
		event = event.changedTouches[0];
	}

	lastTouch = [event.pageX, event.pageY, timeStamp];
};

const imageTouchEnd = (event) => {
	if (lastTouch.length === 3) {
		let timeStamp = event.timeStamp;
		if (event.changedTouches.length > 0) {
			event = event.changedTouches[0];
		}

		let distX = event.pageX - lastTouch[0],
			timeDiff = timeStamp - lastTouch[2],
			minSwipe = 100;

		if (timeDiff < 1000) {
			if (distX < -1 * minSwipe) {
				changeImage('next');
			}
			else if (distX > minSwipe) {
				changeImage('prev');
			}
		}
	}
	lastTouch = [];
};

const resizeImageWindow = () => {
	let win = document.querySelector('.gallery__window'),
		image = document.querySelector('.gallery__image'),
		container = document.querySelector('.gallery__content'),
		scalePercentage = win.classList.contains('gallery--fullscreen') ? 100 : 80,
		mediaHeight,
		mediaWidth;

	if (image && win) {
		window.setTimeout(function() {
			container.style.backgroundImage = 'url(' + image.src + ')';
		}, 1000);

		container.querySelector('.wait-icon').classList.add('gallery--fadeout');

		if (image.tagName.toLowerCase() === 'video') {
			mediaHeight = image.videoHeight;
			mediaWidth = image.videoWidth;
		}
		else {
			mediaHeight = image.naturalHeight;
			mediaWidth = image.naturalWidth;
			image.classList.remove('gallery--fadeout');
		}

		let imageHeight = window.innerHeight * scalePercentage / 100,
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

const updateShareIcons = () => {
	let url = window.location.href,
		docRoot = url.substr(0, url.lastIndexOf('/')),
		title = encodeURIComponent(document.title),
		image = document.querySelector('.gallery__image'),
		imageUrl = null;

	if (image && image.src) {
		imageUrl = docRoot + image.src.substr(image.src.indexOf('/media'));
	}

	url = encodeURIComponent(url + window.location.hash);

	let twitterIcon = document.querySelector('.gallery__button--twitter');
	twitterIcon.addEventListener('click', () => {
		window.open('https://twitter.com/intent/tweet?text=' + title + ' - ' + url, 'twitter', 'height=400,width=400,resizable=no');
	});

	let googleIcon = document.querySelector('.gallery__button--google-plus');
	googleIcon.addEventListener('click', () => {
		window.open('https://plus.google.com/share?url=' + (imageUrl ? imageUrl : url), 'twitter', 'height=480,width=400,resizable=no');
	});

	let facebookLink = document.querySelector('.gallery__button--facebook');
	facebookLink.addEventListener('click', () => {
		window.open('https://www.facebook.com/sharer/sharer.php?u=' + (imageUrl ? imageUrl : url), 'facebook', 'height=400,width=400,resizable=no');
	});

	let mailLink = document.querySelector('.gallery__button--mail');
	mailLink.href = 'mailto:?subject=USA%20on%20rails&body=' + title + encodeURIComponent('\n\n') + url;
};

const openWindow = (winContent, doResize) => {
	let content = document.querySelector('.gallery__content'),
		win = document.querySelector('.gallery__window'),
		controls = win.querySelectorAll('.gallery__control:not(.gallery__share)'),
		buttonDelete = document.querySelector('.gallery__button--delete'),
		buttonRotate = document.querySelector('.gallery__button--rotate'),
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

	let media = document.querySelector('.gallery__image');
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

		for (let i in controls) {
			let control = controls[i];
			if (control.classList) {
				control.classList.remove('gallery--hidden');
			}
		}

		if (window.location.href.indexOf(':8000') > -1) {
			buttonDelete.classList.remove('gallery--hidden');

			if (media.classList.contains('gallery__video')) {
				buttonRotate.classList.add('gallery--hidden');
				media = document.querySelector('.gallery__video');

				if (media.hasAttribute('muted')) {
					buttonMute.classList.remove('gallery__button--mute');
					buttonMute.classList.add('gallery__button--unmute');
				}
				buttonMute.classList.remove('gallery--hidden');
			}
			else {
				buttonRotate.classList.remove('gallery--hidden');
				buttonMute.classList.add('gallery--hidden');
			}
		}
		else {
			buttonDelete.classList.add('gallery--hidden');
			buttonMute.classList.add('gallery--hidden');
		}
	}

	if (doResize) {
		resizeContent();
	}
};

const addMarkerClick = (marker, data) => {
	marker.addListener('click', () => {
		let captionText = document.querySelector('.gallery__image-caption-text');

		document.title = [data.title, data.city, data.state].join(', ');

		captionText.innerHTML = marker.description;

		activeMarker = marker;
		activeMarkerIndex = marker.index;

		if (marker.contentType === 'photo') {
			openWindow('<img class="gallery__image gallery--fadeout" data-pk="' + data.pk + '" data-id="' + marker.index + '" src="' + marker.url + '" />');
		}
		else {
			openWindow('<video controls ' + (marker.url.indexOf('#muted') > -1 ? 'muted ' : '') + 'autoplay class="gallery__image gallery__video" data-pk="' + data.pk + '" data-id="' + marker.index + '" src="' + marker.url + '" />');
		}

		map.panTo(marker.position);

		map.setOptions({ keyboardShortcuts: false });
	});
};

const fadeControls = () => {
	window.clearTimeout(timeoutControlFade);
	let controls = document.querySelectorAll('.gallery__window .gallery__control');
	for (let i in controls) {
		let control = controls[i];
		if (control.classList) {
			control.classList.remove('gallery--fadeout');
		}
	}
	timeoutControlFade = window.setTimeout(() => {
		for (let i in controls) {
			let control = controls[i];
			if (control.classList) {
				control.classList.add('gallery--fadeout');
			}
		}
	}, 3000);
};

const addMarkers = () => {
	let xhr = new XMLHttpRequest();
	xhr.onload = () => {
		let placemarks = xhr.responseXML.documentElement.getElementsByTagName("Placemark");
		[].forEach.call(placemarks, (element) =>{
			//get coordinates and place name
			let url = element.getElementsByTagName('name')[0].textContent,
				desc = element.getElementsByTagName('description')[0].textContent,
				data = JSON.parse(desc);

			let pos = new google.maps.LatLng(data.latitude, data.longitude),
				title = data.title;

			if (data.address !== data.title) {
				title += (title !== '' ? ', ' : '') + data.address;
			}
			title += (title !== '' ? '<br />' : '') + data.city + ", " + data.state;

			let contentType = (url.indexOf('.jpg') > -1 ? 'photo' : 'video');

			let marker = new google.maps.Marker({
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

		let hashIndex = parseInt(window.location.hash.substr(1), 10);
		if (!isNaN(hashIndex) && markers[hashIndex]) {
			google.maps.event.trigger(markers[hashIndex], 'click');
		}
	};
	xhr.onerror = () => {
	  console.log('Error while getting media/locations.kml.');
	};
	xhr.open('GET', 'media/locations.kml');
	xhr.responseType = 'document';
	xhr.send();
};

//initialise a map
const init = () => {
	let latlng = new google.maps.LatLng(initialLatitude, initialLongitude),
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

const enterFullscreen = (element) => {
	if(element.requestFullscreen) {
		element.requestFullscreen();
	}
	else if(element.mozRequestFullScreen) {
		element.mozRequestFullScreen();
	}
	else if(element.webkitRequestFullscreen) {
		element.webkitRequestFullscreen();
	}
	else if(element.msRequestFullscreen) {
		element.msRequestFullscreen();
	}
};

const exitFullscreen = () => {
	if(document.exitFullscreen) {
		document.exitFullscreen();
	}
	else if(document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
	}
	else if(document.webkitExitFullscreen) {
		document.webkitExitFullscreen();
	}
};

const getCookie = (name) => {
	let cookieValue = null;
	if (document.cookie && document.cookie !== '') {
		let cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			let cookie = cookies[i].trim();
			// Does this cookie string begin with the name we want?
			if (cookie.substring(0, name.length + 1) === (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
};

const stopVideo = (video) => {
	if (video) {
		video.pause();
		video.currentTime = 0;
	}
};

const showInfo = (type, id) => {
	let xhr = new XMLHttpRequest();

	xhr.onload = () => {
		let data = JSON.parse(xhr.responseText);
		for (let i = 0; i < data.length; i++) {
			let item = data[i];
			if (item[type].pk === id && item.language === currentLanguage) {
				openWindow('<h1>' + item[type].name + '</h1><p>' + item.description + '</p>', true);
			}
		}
	};
	xhr.onerror = () => {
		console.log('Error while getting ' + type + '_descriptions.json.');
	};
	xhr.open("GET", 'media/' + type + '_descriptions.json');
	xhr.responseType = 'text';
	xhr.send();
};

const updateSelect = (event) => {
	try {
		let data = JSON.parse(event.currentTarget.options[event.currentTarget.selectedIndex].value.split('\'').join('\"'));

		if (data.state) {
			showInfo('city', data.pk);
			window.location.hash = event.currentTarget.options[event.currentTarget.selectedIndex].text;

			currentCity = data.pk;
			currentState = data.state.pk;
			document.querySelector('.gallery__select--state [data-id="' + data.state.pk + '"]').selected = true;
			document.querySelector('.gallery__select--state').dataset.background = true;
			document.querySelector('.gallery__select--state').dispatchEvent(new Event('change'));
		}
		else {
			if (!document.querySelector('.gallery__select--state').dataset.background) {
				showInfo('state', data.pk);
				window.location.hash = event.currentTarget.options[event.currentTarget.selectedIndex].text;
			}
			delete(document.querySelector('.gallery__select--state').dataset.background);
			let cities = document.querySelectorAll('.gallery__select--city [data-id]');
			for (let i = 0; i < cities.length; i++) {
				let city = cities[i];
				if (city && city.value) {
					let cityData = JSON.parse(city.value.split('\'').join('\"'));
					if (cityData.state.pk === data.pk) {
						city.style.display = 'block';
					}
					else {
						city.style.display = 'none';
					}
				}
			}
			if (currentState !== data.pk) {
				document.querySelector('.gallery__select--city').selectedIndex = 0;
				currentState = data.pk;
			}
		}
		let sw = new google.maps.LatLng(data.max_latitude, data.max_longitude);
		let ne = new google.maps.LatLng(data.min_latitude, data.min_longitude);
		new google.maps.LatLngBounds();
		let bounds = new google.maps.LatLngBounds();
		bounds.extend(sw);
		bounds.extend(ne);
		map.fitBounds(bounds);
	}
	catch (e) {
		if (event.currentTarget.classList.contains('gallery__select--state')) {
			let cities = document.querySelectorAll('.gallery__select--city [data-id]');
			for (let i = 0; i < cities.length; i++) {
				let city = cities[i];
				city.style.display = 'block';
			}
			document.querySelector('.gallery__select--city').selectedIndex = 0;
			map.setCenter(new google.maps.LatLng(initialLatitude, initialLongitude));
			map.setZoom(initialZoom);
			currentState = -1;
		}
		else {
			document.querySelector('.gallery__select--state').dispatchEvent(new Event('change'));
		}
	}
};

const muteVideo = () => {
	let csrftoken = getCookie('csrftoken'),
		video = document.querySelector('.gallery__window .gallery__video'),
		buttonMute = document.querySelector('.gallery__window .gallery__button--mute'),
		buttonUnmute = document.querySelector('.gallery__window .gallery__button--unmute'),
		id = video.dataset.pk;

	if (!isNaN(parseInt(id, 10))) {
		let xhr = new XMLHttpRequest();
		xhr.onload = () => {
			if (video.muted) {
				video.muted = false;
				video.volume = 1;
				buttonUnmute.classList.add('gallery__button--mute');
				buttonUnmute.classList.remove('gallery__button--unmute');
			}
			else {
				video.muted = true;
				buttonMute.classList.remove('gallery__button--mute');
				buttonMute.classList.add('gallery__button--unmute');
			}
		};
		xhr.onerror = () => {
			window.alert('Video ' + id + ' konnte nicht gemuted werden: ID nicht lesbar.');
		};
		let data = JSON.stringify({
			mute: (buttonMute ? true : false)
		});
		xhr.open('PATCH', '/api/images/' + id + '/');
		xhr.responseType = 'text';
		xhr.setRequestHeader('Content-type', 'application/json');
		xhr.setRequestHeader('X-CSRFToken', csrftoken);
		xhr.send(data);
	}
	else {
		window.alert('Video ' + id + ' konnte nicht gemuted werden: ID nicht lesbar.');
	}
};

const rotateImage = (event) => {
	let csrftoken = getCookie('csrftoken'),
		image = document.querySelector('.gallery__image'),
		xhr = new XMLHttpRequest(),
		id = image.dataset.pk;
	xhr.onload = () => {
		let url = image.src;
		if (image.src.indexOf('?') > -1) {
			url = url.substr(0, image.src.indexOf('?'));
		}
		image.src = url + '?' + new Date().getTime();
	};
	xhr.onerror = () => {
		window.alert('Bild ' + id + ' konnte nicht gedreht werden: ID nicht lesbar.');
	};
	xhr.open('GET', '/turn_image/' + id);
	xhr.responseType = "text";
	xhr.setRequestHeader("X-CSRFToken", csrftoken);
	xhr.send();
}

const deletePicture = () => {
	if (window.confirm('Willst du dieses Bild wirklich löschen?')) {
		let csrftoken = getCookie('csrftoken'),
			id = document.querySelector('.gallery__window .gallery__image').dataset.pk;

		if (!isNaN(parseInt(id, 10))) {
			let xhr = new XMLHttpRequest();
			xhr.onload = () => {
				window.alert('Bild ' + id + ' wurde gelöscht, wechsle zum nächsten...');
				// Remove marker from map and from markers array
				markers[activeMarkerIndex].setMap(null);
				markers.splice(activeMarkerIndex, 1);

				// Update marker index for all following markers
				for (let i = activeMarkerIndex; i < markers.length; i++) {
					markers[i].index = i;
				}

				// Set back activeMarkerIndex since we will change to the next image which now has the same index as the deleted one
				activeMarkerIndex -= 1;
				document.querySelector('.gallery__image').dataset.id = activeMarkerIndex;
				changeImage('next');
			};
			xhr.onerror = () => {
				window.alert('Bild ' + id + ' konnte nicht gelöscht werden: ID nicht lesbar.');
			};
			xhr.open('DELETE', '/api/images/' + id + '/');
			xhr.responseType = "text";
			xhr.setRequestHeader("X-CSRFToken", csrftoken);
			xhr.send();
		}
		else {
			window.alert('Bild ' + id + ' konnte nicht gelöscht werden: ID nicht lesbar.');
		}
	}
};

//bind events for fullscreen button
document.querySelector('[data-button="fullscreen"]').addEventListener('click', (event) => {
	if (event.currentTarget.classList.contains('gallery__button--fullscreen')) {
		enterFullscreen(document.querySelector('.gallery__window'));
	}
	else {
		exitFullscreen();
	}
});

//bind events for close button
document.querySelector('[data-button="close"]').addEventListener('click', () =>{
	let win = document.querySelector('.gallery__window'),
		controls = win.querySelectorAll('.gallery__control'),
		content = document.querySelector('.gallery__content'),
		navigation = document.querySelector('.gallery__navigation'),
		buttonCleanup = document.querySelector('.gallery__button--cleanup'),
		mapElem = document.getElementById('gallery__map'),
		media = document.querySelector('.gallery__image'),
		video = document.querySelector('video');

	exitFullscreen();

	for (let i in controls) {
		let control = controls[i];
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
	}
	else {
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
let buttons = document.querySelectorAll('.gallery__image-caption .gallery__button');
for (let i in buttons) {
	let button = buttons[i];
	if (button.addEventListener) {
		button.addEventListener('click', changeImage);
	}
}

//bind events for delete buttons
document.querySelector('[data-button="delete"]').addEventListener('click', deletePicture);
document.querySelector('[data-button="rotate"]').addEventListener('click', rotateImage);
document.querySelector('[data-button="mute"]').addEventListener('click', muteVideo);

document.querySelector('.gallery__button--cleanup').addEventListener('click', () => {
	let xhr = new XMLHttpRequest(),
		button = document.querySelector('.gallery__button--cleanup'),
		defaultText = 'Daten bereinigen';

	xhr.onload = () => {
		button.removeAttribute('disabled');
		button.innerHTML = defaultText;
		window.location.reload(true);
	};
	xhr.onerror = () => {
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

let selects = document.querySelectorAll('.gallery__select');
for (let i = 0; i < selects.length; i++) {
	let select = selects[i];
	select.addEventListener('mousedown', (event) => {
		event.currentTarget.selectedIndex = -1;
	});
	select.addEventListener('change', updateSelect);
}

document.addEventListener('keyup', (event) => {
	if (document.querySelectorAll('.gallery__window.gallery--fadeout').length <= 0 && document.querySelectorAll('.gallery__image').length > 0 ) {
		if (event.keyCode === 37) { // left
			changeImage('prev');
		} else if (event.keyCode === 39) { // right
			changeImage('next');
		}
	}

	if (event.keyCode === 27) { // escape
		if (!document.querySelector('.gallery__window').classList.contains('gallery--fullscreen')) {
			document.querySelector('[data-button="close"]').dispatchEvent(new Event('click'));
		}
	}
});

window.addEventListener('resize', resizeImageWindow);

const fullScreenChange = () => {
	if (!document.querySelector('.gallery__window').classList.contains('gallery--fullscreen')) {
		document.querySelector('.gallery__window').classList.add('gallery--fullscreen');
		document.querySelector('[data-button="fullscreen"]').classList.remove('gallery__button--fullscreen');
		document.querySelector('[data-button="fullscreen"]').classList.add('gallery__button--windowed');
	}
	else {
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

GoogleMapsLoader.load((g) => {
	google = g;
	init();
});
