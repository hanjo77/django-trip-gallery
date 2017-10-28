var map,
	nav = [],
	markers = [];

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

			var pos = new google.maps.LatLng(c[1], c[0]);
			var marker = new google.maps.Marker({
				index: markers.length,
				position: pos,
				map: map,
				title: place
			});

			marker.addListener('click', function() {
				$('.gallery__content').html('<img class="gallery__image" data-id="' + this.index + '" src="' + this.title + '"></div>');
				// infowindow.open(map, marker);
				this.map.panTo(this.position);
			});

			markers.push(marker);
		});

		//output as a navigation
		$('.navigation').append(html);

		//bind clicks on your navigation to scroll to a placemark

		$('.navigation li').bind('click', function(){
			panToPoint = new google.maps.LatLng(nav[$(this).index()].lng, nav[$(this).index()].lat);
			map.panTo(panToPoint);
		})

	});

	$(document).on('keyup', function(event) {
		var index = $('.gallery__image').data('id'),
			newIndex = index;
		if (event.keyCode === 37) { // left
			if (index > 0) {
				newIndex = index - 1;
			}
			else {
				newIndex = markers.length-1;
			}
		} else if (event.keyCode === 39) { // right
			if (index < markers.length - 1) {
				newIndex = index + 1;
			}
			else {
				newIndex = 0;
			}
		}
		if (index !== newIndex) {
			google.maps.event.trigger(markers[newIndex], 'click');
			console.log($(markers[newIndex]));
		}
	});

	function init(){
		var latlng = new google.maps.LatLng(38.9284715,-97.5515638);
		var myOptions = {
			zoom: 4,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.SATELLITE
		};
		map = new google.maps.Map(document.getElementById('gallery__map'), myOptions);
	}
})
