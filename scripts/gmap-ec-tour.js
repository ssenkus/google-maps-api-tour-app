/* function initialize() {
  var mapOptions = {
    zoom: 4,
    center: new google.maps.LatLng(-25.363882, 131.044922),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  var marker = new google.maps.Marker({
    position: map.getCenter(),
    map: map,
    title: 'Click to zoom'
  });

  google.maps.event.addListener(map, 'center_changed', function() {
    // 3 seconds after the center of the map has changed, pan back to the
    // marker.
    window.setTimeout(function() {
      map.panTo(marker.getPosition());
    }, 3000);
  });

  google.maps.event.addListener(marker, 'click', function() {
    map.setZoom(8);
    map.setCenter(marker.getPosition());
  });
}

google.maps.event.addDomListener(window, 'load', initialize);
*/

$(document).ready(function(){
					var coords = new google.maps.LatLng('45.09', '-122.77');
					var mapOptions = {
						zoom: 8,
						center: coords,
						mapTypeControl: true,
						navigationControlOptions: {
							style: google.maps.NavigationControlStyle.SMALL
						},	
						mapTypeId: google.maps.MapTypeId.ROADMAP
					};
					var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);


		$('#geolocate').click(function() {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position){
					var latitude = position.coords.latitude;
					var longitude = position.coords.longitude;
					var coords = new google.maps.LatLng(latitude, longitude);


					
					$.ajax({
						type:		"GET",
						url: 		"http://maps.googleapis.com/maps/api/geocode/json?latlng="+latitude+","+longitude+"&sensor=false",
						dataType:	"json",
						success:    function(data) {
										
										var currentAddress = data.results[1]['formatted_address'];
										$("#location-list").append('<li>'+ currentAddress + " </li>");
										var marker = new google.maps.Marker({
											position: coords,
											map: map,
											title: "Placeholder for address returned by Google AJAX call!"
										});
									},
						error: 		function(xhr, ajaxOptions, thrownError) {  
										alert("xhr status: " + xhr.statusText +"\nError thrown: " + thrownError);    
									}
					});
				});
			}
		});
		
		$('#addDummyMarkers').click(function() {
		
			// Dummy data for markers that will be returieved from the db later on...
			var storedMarkers = {
					0: {
						lat:	"45.09",
						lng:	"-122.77"
					},
					1: {
						lat:	"45.19",
						lng:	"-122.67"
					},
					2: {
						lat:	"45.29",
						lng:	"-122.47"
					},
					3: {
						lat:	"45.35",
						lng:	"-122.17"
					}
			};
			
			
			var tourStopsCoordinates = [];
			
			for (var x = 0; x < 4; x++) {
				var myLatLng = new google.maps.LatLng(storedMarkers[x].lat,storedMarkers[x].lng);
				var beachMarker = new google.maps.Marker({
					position: myLatLng,
					map: map,
					title: "Position" + x
				});
				tourStopsCoordinates.push(new google.maps.LatLng(storedMarkers[x].lat,storedMarkers[x].lng));
			}

			var tourPath = new google.maps.Polyline({
				path: tourStopsCoordinates,
				strokeColor: "#F00",
				strokeOpacity: 1.0,
				strokeWeight: 3
			});

			tourPath.setMap(map);

		});

	
	/* Geolocation code
		if(navigator.geolocation) {
			alert("Great..Geolocation API is supported.");
		} else {
			alert("Geolocation API is not supported in your browser.");
		}
		navigator.geolocation.getCurrentPosition(function(position) {
			console.log(position);
			var latitude = position.coords.latitude;
			var longitude = position.coords.longitude;
			alert('latitude:' + latitude + '\n' + 'longitude:' + longitude);
		});
		
*/
});