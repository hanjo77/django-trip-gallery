'use strict';

let map,
	nav = [],
	markers = [],
	markerclusterer,
	activeMarker,
	lastTouch = [],
	$ = require('jquery'),
	MarkerClusterer = require('node-js-marker-clusterer');

let GoogleMapsLoader = require('google-maps');
GoogleMapsLoader.KEY = 'AIzaSyD_C6GDv2SAhTGc2ijeomtQThYpS761PvU';

//initialise a map

GoogleMapsLoader.load((google) => {
	const changeImage = (direction) => {
		let index = $('.gallery__image').data('id'),
			newIndex = index;

		if (direction === 'prev') {
			if (index > 0) {
				newIndex = index - 1;
			}
			else {
				newIndex = markers.length-1;
			}
		}
		else if (direction === 'next') {
			if (index < markers.length - 1) {
				newIndex = index + 1;
			}
			else {
				newIndex = 0;
			}
		}
		if (index !== newIndex) {
			google.maps.event.trigger(markers[newIndex], 'click');
		}
	};

	const resizeToImage = () => {
		let $container = $('.gallery__image-container'),
			isFullScreen = $container.closest('.gallery--fullscreen').length,
			$image = $container.find('img'),
			$win = $(window),
			winWidth = $win.width(),
			winHeight = $win.height(),
			percentageWidth = (isFullScreen ? 100 : 80),
			percentageHeight = (isFullScreen ? 100 : 80),
			maxWidth = winWidth * percentageWidth / 100,
			maxHeight = winHeight * percentageHeight / 100,
			imageWidth = $image.length ? $image.width() : 1280,
			imageHeight = $image.length ? $image.height() : 720,
			newWidth = (maxHeight * imageWidth) / imageHeight;

		if (newWidth > maxWidth) {
			newWidth = maxWidth;
		}

		if (!isFullScreen) {
			$('.gallery__window').css({
				width: newWidth,
				height: 'auto'
			});
		}
		else {
			$('.gallery__window').css({
				width: 'auto',
				height: '100%'
			});
		}
	};

	const resizeMap = () => {
		$('#gallery__map').css({
			height: $(window).innerHeight()
		});
		if (activeMarker) {
			map.panTo(activeMarker.position);
		}
	};

	const resizeApp = () => {
		resizeMap();
		resizeToImage();
	};

	const init = () => {
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

		$.getJSON( "media/states.json", function( data ) {
			let $stateSelect = $('.gallery__select--state'),
				state;
			for (let i = 0; i < data.length; i++) {
				state = data[i];
				$stateSelect.append('<option value="' + JSON.stringify(state).split('\"').join('\'') + '">' + state.name + '</option>');
			}
		});

		$.getJSON( "media/cities.json", function( data ) {
			let $citySelect = $('.gallery__select--city'),
				city;
			for (let i = 0; i < data.length; i++) {
				city = data[i];
				$citySelect.append('<option value="' + JSON.stringify(city).split('\"').join('\'') + '">' + city.name + '</option>');
			}
		});
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

	init();

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
				if (title !== '') {
					title += ', ';
				}
				title += data.address.name;
			}
			if (title !== '') {
				title += '<br />';
			}
			title += data.city.name + ", " + data.state.name;

			// title += '<span class="debug--small">' + decodeURIComponent(url) + '</span>';

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
				if (marker.contentType === 'photo') {
					$('.gallery__content').html('<img class="gallery__image" data-id="' + marker.index + '" src="' + marker.url + '" />');
				}
				else {
					$('.gallery__content').html('<video controls autoplay class="gallery__image gallery__video" data-id="' + marker.index + '" src="' + marker.url + '" />');
				}
				$('.gallery__caption-text').html(marker.description);
				$('.gallery__image-container img').on('load', resizeToImage);
				activeMarker = marker;
				map.panTo(marker.position);
				$('.gallery__navigation').hide();
			});

			markers.push(marker);
		});

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
});
