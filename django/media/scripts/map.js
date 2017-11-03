var map,
	nav = [],
	markers = [],
	markerCluster,
	activeMarker;

$(document).ready(function(){
	//initialise a map
	init();

	$.get('locations.kml', function(data){
		html = '';

		//loop through placemarks tags
		$(data).find('Placemark').each(function(index, value){
			//get coordinates and place name
			coords = $(this).find('coordinates').text();
			place = $(this).find('name').text();
			//store as JSON
			c = coords.split(',')
			nav.push({
				'place': place,
				'lat': c[0],
				'lng': c[1]
			});

			//output as a navigation
			html += '<li>' + place + '</li>';

			var pos = new google.maps.LatLng(c[1], c[0]),
				title = place.split('/');

			title = decodeURIComponent(title[title.length-2])
				.split(', ')[0]
				.split(' - ')
				.join('<br />');
			var marker = new google.maps.Marker({
				index: markers.length,
				position: pos,
				map: map,
				url: place,
				title: title,
				icon: '/media/img/marker.png'
			});

			marker.addListener('click', function() {
				$('.gallery__content').addClass('gallery__image-container');
				$('.gallery__window').removeClass('gallery__window--hidden');
				$('.gallery__control').css({
					display: 'flex'
				});
				$('.gallery__content').html('<img class="gallery__image" data-id="' + this.index + '" src="' + this.url + '" />');
				$('.gallery__caption-text').html(this.title);
				$('.gallery__image-container img').on('load', resizeToImage);
				activeMarker = this;
				map.panTo(this.position);
			});

			markers.push(marker);
		});

		markerCluster = new MarkerClusterer(map, markers, {
			imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
		});

		//output as a navigation
		$('.navigation').append(html);

		//bind events for close button
		$('[data-button="close"]').on('click', function(){
			$('.gallery__control').hide();
			$('.gallery__window').addClass('gallery__window--hidden');
			$('.gallery__content').removeClass('gallery__image-container');
		});

		//bind events for prev / next buttons
		$('.gallery__image-caption .gallery__button').on('click', function(){
			console.log($(this).data('button'));
			changeImage($(this).data('button'));
		});

		//bind clicks on your navigation to scroll to a placemark
		$('.navigation li').on('click', function(){
			panToPoint = new google.maps.LatLng(nav[$(this).index()].lng, nav[$(this).index()].lat);
			map.panTo(panToPoint);
		});
	});

	$(document).on('keyup', function(event) {
		if (event.keyCode === 37) { // left
			changeImage('prev');
		} else if (event.keyCode === 39) { // right
			changeImage('next');
		} else if (event.keyCode === 27) { // escape
			$('[data-button="close"]').trigger('click');
		}
	});

	function changeImage(direction) {
		var index = $('.gallery__image').data('id'),
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
	}

	function init() {
		var latlng = new google.maps.LatLng(38.9284715,-97.5515638),
			myOptions = {
				zoom: 4,
				center: latlng,
				mapTypeId: google.maps.MapTypeId.SATELLITE
			};
		
		resizeMap();
		$(window).on('resize', resizeApp);

		map = new google.maps.Map(document.getElementById('gallery__map'), myOptions);
	}

	function resizeApp() {
		resizeMap();
		resizeToImage();
	}

	function resizeMap() {
		$('#gallery__map').css({
			height: $(window).innerHeight()
		});
		if (activeMarker) {
			map.panTo(activeMarker.position);
		}
	}

	function resizeToImage() {

		var $container = $('.gallery__image-container')
			$image = $container.find('img'),
			$win = $(window),
			winWidth = $win.width(),
			winHeight = $win.height(),
			percentageWidth = 80,
			percentageHeight = 80,
			maxWidth = $win.width() * percentageWidth / 100,
			maxHeight = $win.height() * percentageHeight / 100,
			imageWidth = $image.width(),
			imageHeight = $image.height(),
			newWidth = (maxHeight * imageWidth) / imageHeight;

		if (newWidth > maxWidth) {
			newWidth = maxWidth;
		}

		$('.gallery__window').css({
			width: newWidth
		})
	}
})
