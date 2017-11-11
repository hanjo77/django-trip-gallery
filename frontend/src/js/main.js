'use strict';

let map,
	markers = [],
	markerclusterer,
	activeMarker,
	lastTouch = [],
	MarkerClusterer = require('node-js-marker-clusterer'),
	google = null,
	timeoutControlFade;

let GoogleMapsLoader = require('google-maps');
GoogleMapsLoader.KEY = 'AIzaSyD_C6GDv2SAhTGc2ijeomtQThYpS761PvU';

const fillSelect = (type, url) => {
	let xhr = new XMLHttpRequest();
	xhr.onload = () => {
		let data = JSON.parse(xhr.responseText);
		let select = document.querySelector('.gallery__select--' + type),
			option;
		for (let i = 0; i < data.length; i++) {
			option = data[i];
			select.insertAdjacentHTML('beforeend', '<option value="' + JSON.stringify(option).split('\"').join('\'') + '">' + option.name + '</option>');
		}
	};
	xhr.onerror = () => {
	  console.log('Error while getting ' + url + '.');
	};
	xhr.open("GET", url);
	xhr.responseType = 'text';
	xhr.send();
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

const addMarkerClick = (marker, data) => {
	marker.addListener('click', () => {
		document.querySelector('.gallery__content').classList.add('gallery__image-container');
		document.querySelector('.gallery__window').classList.remove('gallery__window--hidden');
		document.querySelectorAll('.gallery__control').forEach((ctrl) => {
			ctrl.classList.remove('gallery--hidden');
		});

		if (window.location.href.indexOf(':8000') > -1) {
			document.querySelector('.gallery__button--delete').classList.remove('gallery--hidden');
		}
		else {
			document.querySelector('.gallery__button--delete').classList.add('gallery--hidden');
		}

		if (marker.contentType === 'photo') {
			document.querySelector('.gallery__content').innerHTML = '<img class="gallery__image" data-pk="' + data.pk + '" data-id="' + marker.index + '" src="' + marker.url + '" />';
		}
		else {
			document.querySelector('.gallery__content').innerHTML = '<video controls autoplay class="gallery__image gallery__video" data-pk="' + data.pk + '" data-id="' + marker.index + '" src="' + marker.url + '" />';
		}

		let galleryImage = document.querySelector('.gallery__image');
		galleryImage.addEventListener('touchstart', imageTouchStart);
		galleryImage.addEventListener('touchend', imageTouchEnd);

		document.querySelector('.gallery__image-caption-text').innerHTML = marker.description;

		activeMarker = marker;
		map.panTo(marker.position);
		document.querySelector('.gallery__navigation').classList.add('gallery--hidden');

		map.setOptions({ keyboardShortcuts: false });
	});
};

const fadeControls = () => {
	window.clearTimeout(timeoutControlFade);
	document.querySelectorAll('.gallery__control').forEach((control) => {
		control.classList.remove('gallery__control--fadeout');
	});
	timeoutControlFade = window.setTimeout(() => {
		document.querySelectorAll('.gallery__control').forEach((control) => {
			control.classList.add('gallery__control--fadeout');
		});
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

			if (data.address && data.address.name !== data.title) {
				title += (title !== '' ? ', ' : '') + data.address.name;
			}
			title += (title !== '' ? '<br />' : '') + data.city.name + ", " + data.state.name;

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
	document.querySelector('.gallery__button--delete').classList.add('gallery--hidden');
	document.querySelector('.gallery__navigation').classList.add('gallery--hidden');

	let latlng = new google.maps.LatLng(38.9284715,-97.5515638),
		myOptions = {
			zoom: 4,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.SATELLITE // HYBRID
		};

	map = new google.maps.Map(document.getElementById('gallery__map'), myOptions);

	fillSelect('state', 'media/states.json');
	fillSelect('city', 'media/cities.json');
	addMarkers();
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

//bind events for close button
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
	exitFullscreen();
	document.querySelector('.gallery__control').classList.add('gallery--hidden');
	document.querySelector('.gallery__window').classList.add('gallery__window--hidden');
	document.querySelector('.gallery__content').classList.remove('gallery__image-container');
	document.querySelector('.gallery__navigation').classList.remove('gallery--hidden');

	map.setOptions({ keyboardShortcuts: true });
	document.getElementById('gallery__map').focus();
});

//bind events for prev / next buttons
document.querySelectorAll('.gallery__image-caption .gallery__button').forEach((button) => {
	button.addEventListener('click', (event) => {
		changeImage(event.currentTarget.dataset.button);
	});
});

//bind events for delete buttons
document.querySelector('[data-button="delete"]').addEventListener('click', () => {
	if (window.confirm('Willst du dieses Bild wirklich löschen?')) {
		let csrftoken = getCookie('csrftoken'),
			id = document.querySelector('.gallery__window .gallery__image').dataset.pk;

		if (!isNaN(parseInt(id, 10))) {
			let xhr = new XMLHttpRequest();
			xhr.onload = () => {
				window.alert('Bild ' + id + ' wurde gelöscht, wechsle zum nächsten...');
				changeImage('next');
			};
			xhr.onerror = () => {
				window.alert('Bild konnte nicht gelöscht werden: ID nicht lesbar.');
			};
			xhr.open('DELETE', '/api/images/' + id + '/');
			xhr.responseType = "text";
			xhr.setRequestHeader("X-CSRFToken", csrftoken);
			xhr.send();
		}
		else {
		}
	}
});

document.querySelectorAll('.gallery__select').forEach((select) => {
	select.addEventListener('change', (event) => {
		let data = JSON.parse(event.currentTarget.options[event.currentTarget.selectedIndex].value.split('\'').join('\"'));
		let sw = new google.maps.LatLng(data.max_latitude, data.max_longitude);
		let ne = new google.maps.LatLng(data.min_latitude, data.min_longitude);
		new google.maps.LatLngBounds();
		let bounds = new google.maps.LatLngBounds();
		bounds.extend(sw);
		bounds.extend(ne);
		map.fitBounds(bounds);
		event.currentTarget.selectedIndex = 0;
	});
});

document.addEventListener('keyup', (event) => {
	if (document.querySelectorAll('.gallery__window--hidden').length <= 0 && document.querySelectorAll('.gallery__image').length > 0 ) {
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

const fullScreenChange = (event) => {
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


