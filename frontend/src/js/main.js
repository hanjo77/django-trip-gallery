'use strict';

let map,
	nav = [],
	markers = [],
	markerclusterer,
	activeMarker,
	lastTouch = [],
	$ = require('jquery'),
	MarkerClusterer = require('node-js-marker-clusterer'),
	google = null,
	timeoutControlFade;

let GoogleMapsLoader = require('google-maps');
GoogleMapsLoader.KEY = 'AIzaSyD_C6GDv2SAhTGc2ijeomtQThYpS761PvU';

const resizeMap = () => {
	$('#gallery__map').css({
		height: $(window).innerHeight()
	});
	if (activeMarker) {
		map.panTo(activeMarker.position);
	}
};

const resizeToImage = () => {
	let $container = $('.gallery__image-container'),
		isFullScreen = $container.closest('.gallery--fullscreen').length,
		$image = $container.find('img'),
		$win = $(window),
		winWidth = $win.width(),
		winHeight = $win.height(),
		scalePercentage = 90,
		maxWidth = winWidth * scalePercentage / 100,
		maxHeight = winHeight * scalePercentage / 100,
		imageWidth = ($image.length > 0 ? $image.width() : 1280), // for videos, have fixed width
		imageHeight = ($image.length > 0 ? $image.height() : 720), // for videos, have fixed height
		newWidth = maxWidth,
		newHeight = (newWidth * imageHeight) / imageWidth;

	if (newHeight > winHeight) {
		newHeight = maxHeight;
		newWidth = (newHeight * imageWidth) / imageHeight;
	}

	if (isFullScreen) {
		$('.gallery__window').css({
			width: '100%',
			height: '100%'
		});
	}
	else {
		$('.gallery__window').css({
			width: newWidth + 'px',
			height: newHeight + 'px'
		});
	}
};

const resizeApp = () => {
	resizeMap();
	resizeToImage();
};

const fillSelect = (type, url) => {
	$.getJSON(url, function(data) {
		let $select = $('.gallery__select--' + type),
			option;
		for (let i = 0; i < data.length; i++) {
			option = data[i];
			$select.append('<option value="' + JSON.stringify(option).split('\"').join('\'') + '">' + option.name + '</option>');
		}
	});
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

const addMarkers = () => {
	$.get('media/locations.kml', (rawData) => {
		//loop through placemarks tags
		$(rawData).find('Placemark').each((index, element) =>{
			//get coordinates and place name
			let url = $(element).find('name').text(),
				desc = $(element).find('description').text(),
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

			marker.addListener('click', () => {
				$('.gallery__content').addClass('gallery__image-container');
				$('.gallery__window').removeClass('gallery__window--hidden');
				$('.gallery__control').removeClass('gallery--hidden');

				if (window.location.href.indexOf(':8000') > -1) {
					$('.gallery__button--delete').removeClass('gallery--hidden');
				}
				else {
					$('.gallery__button--delete').addClass('gallery--hidden');
				}

				if (marker.contentType === 'photo') {
					$('.gallery__content').html('<img class="gallery__image" data-pk="' + data.pk + '" data-id="' + marker.index + '" src="' + marker.url + '" />');
				}
				else {
					$('.gallery__content').html('<video controls autoplay class="gallery__image gallery__video" data-pk="' + data.pk + '" data-id="' + marker.index + '" src="' + marker.url + '" />');
					resizeToImage();
				}

				$('.gallery__caption-text').html(marker.description);
				$('.gallery__image-container img').on('load', resizeToImage);
				activeMarker = marker;
				map.panTo(marker.position);
				$('.gallery__navigation').hide();
			});

			markers.push(marker);
		});
		addMarkerCluster();
	});
};

//initialise a map
const init = () => {
	$('.gallery__button--delete').addClass('gallery--hidden');
	$('.gallery__navigation').hide();

	let latlng = new google.maps.LatLng(38.9284715,-97.5515638),
		myOptions = {
			zoom: 4,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.SATELLITE // HYBRID
		};

	resizeMap();
	$(window).on('resize', resizeApp);

	map = new google.maps.Map(document.getElementById('gallery__map'), myOptions);

	fillSelect('state', 'media/states.json');
	fillSelect('city', 'media/cities.json');
	addMarkers();
};

GoogleMapsLoader.load((g) => {
	google = g;
	init();
});

const changeImage = (direction) => {
	let index = $('.gallery__image').data('id'),
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

const enterFullscreen = (element) => {
	if (!$('.gallery__window').hasClass('gallery--fullscreen')) {
		$('.gallery__window').addClass('gallery--fullscreen');
		$('[data-button="fullscreen"]').removeClass('gallery__button--fullscreen');
		$('[data-button="fullscreen"]').addClass('gallery__button--windowed');
	}
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
	if ($('.gallery__window').hasClass('gallery--fullscreen')) {
		$('.gallery__window').removeClass('gallery--fullscreen');
		$('[data-button="fullscreen"]').removeClass('gallery__button--windowed');
		$('[data-button="fullscreen"]').addClass('gallery__button--fullscreen');
	}
	resizeToImage();
};

const getCookie = (name) => {
	let cookieValue = null;
	if (document.cookie && document.cookie !== '') {
		let cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			let cookie = $.trim(cookies[i]);
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
$('[data-button="fullscreen"]').on('click', (event) => {
	if ($(event.currentTarget).hasClass('gallery__button--fullscreen')) {
		enterFullscreen($('.gallery__window')[0]);
	}
	else {
		exitFullscreen();
	}
});

//bind events for close button
$('[data-button="close"]').on('click', () =>{
	exitFullscreen();
	$('.gallery__control').addClass('gallery--hidden');
	$('.gallery__window').addClass('gallery__window--hidden');
	$('.gallery__content').removeClass('gallery__image-container');
	$('.gallery__navigation').show();
});

//bind events for prev / next buttons
$('.gallery__image-caption .gallery__button').on('click', (event) => {
	changeImage($(event.currentTarget).data('button'));
});

//bind clicks on your navigation to scroll to a placemark
$('.navigation li').on('click', (event) => {
	let panToPoint = new google.maps.LatLng(nav[$(event.currentTarget).index()].lng, nav[$(event.currentTarget).index()].lat);
	map.panTo(panToPoint);
});

//bind events for delete buttons
$('[data-button="delete"]').on('click', (event) => {
	if (window.confirm('Willst du dieses Bild wirklich löschen?')) {
		let csrftoken = getCookie('csrftoken'),
			id = $(event.currentTarget).closest('.gallery__window').find('.gallery__image').data('pk');

		if (!isNaN(parseInt(id, 10))) {
			$.ajaxSetup({
				beforeSend: function(xhr) {
					xhr.setRequestHeader("X-CSRFToken", csrftoken);
				}
			});

			$.ajax({
				url: '/api/images/' + id + '/',
				type: 'DELETE',
				success: function() {
					window.alert('Bild ' + id + ' wurde gelöscht, wechsle zum nächsten...');
					changeImage('next');
				},
				error: function(result) {
					window.alert('Bild konnte nicht gelöscht werden: ' + result.message);
				}
			});
		}
		else {
			window.alert('Bild konnte nicht gelöscht werden: ID nicht lesbar.');
		}
	}
});

$('.gallery__select').on('change', (event) => {
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

$('.gallery__content').on('touchstart mousedown', (event) => {
	if (event.originalEvent) {
		event = event.originalEvent;
	}

	lastTouch = [event.pageX, event.pageY, event.timeStamp];
});

$('.gallery__content').on('touchend mouseup dragend', (event) => {
	if (lastTouch.length === 3) {
		if (event.originalEvent) {
			event = event.originalEvent;
		}

		let distX = event.pageX - lastTouch[0],
			timeDiff = event.timeStamp - lastTouch[2],
			minSwipe = 100;

		if (timeDiff < 1000) {
			if (distX < -1 * minSwipe) {
				$('.gallery__button--next').trigger('click');
			}
			else if (distX > minSwipe) {
				$('.gallery__button--prev').trigger('click');
			}
		}
	}
	lastTouch = [];
});

$(document).on('keyup', (event) => {
	if (event.keyCode === 37) { // left
		changeImage('prev');
	} else if (event.keyCode === 39) { // right
		changeImage('next');
	} else if (event.keyCode === 27) { // escape
		$('[data-button="close"]').trigger('click');
		exitFullscreen();
	}
});

$(document).on('mousemove keyup click', () => {
	window.clearTimeout(timeoutControlFade);
	$('.gallery__control').removeClass('gallery__control--fadeout');
	timeoutControlFade = window.setTimeout(() => {
		$('.gallery__control').addClass('gallery__control--fadeout');
	}, 3000);
});
