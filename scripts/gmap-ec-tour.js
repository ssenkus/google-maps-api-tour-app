
$(document).ready(function(){

		// -- Map --
		// -- -- build Map --
		var coords = new google.maps.LatLng('45.09', '-122.77');
		var mapOptions = {
			zoom: 7,
			center: coords,
			mapTypeControl: true,
			navigationControlOptions: {
				style: google.maps.NavigationControlStyle.SMALL
			},	
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
		
		
		var markersActive = [];
		var tourStopsCoordinates = [];
		var tourPath;
		
		// -- -- Map functions --
		
		
		// Marker Data functions
		function addToLocationList (geocodeAddress) {
				$("#location-list").append('<li>'+ geocodeAddress + " </li>");
		}
		
		// -- Click functions --
		
		function addMarker(latitude, longitude) {
			var markerCoords = new google.maps.LatLng(latitude, longitude);
			// get title from 
			$.ajax({
				type:		"GET",
				url: 		"http://maps.googleapis.com/maps/api/geocode/json?latlng="+latitude+","+longitude+"&sensor=true",
				dataType:	"json",
				success:    function(data) {
								
								var currentAddress = data.results[1]['formatted_address'];
								
								var marker = new google.maps.Marker({
									position: markerCoords,
									map: map,
									title: currentAddress,
									animation: google.maps.Animation.DROP
								});
								addToLocationList(currentAddress);
								markersActive.push(marker);
								tourStopsCoordinates.push(markerCoords);
							},
				error: 		function(xhr, ajaxOptions, thrownError) {  
								alert("xhr status: " + xhr.statusText +"\nError thrown: " + thrownError);    
							}
			});
		}
		
		// -- -- 'Geolocate' button -> place marker at IP address geolocation
		$('#geolocate').click(function() {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position){
					var latitude = position.coords.latitude;
					var longitude = position.coords.longitude;
					addMarker(latitude, longitude);
				});
			}
		});
		
		
		// -- -- 'Add Tour Point' with input field Coordinates -> 
		$('#addTourPoint').click(function(){
				// get input field values
				var inputLat = $('#addTPLat').val();
				var inputLng = $('#addTPLng').val();
				addMarker(inputLat, inputLng);
		});
		
		
		
		//		Add 4 dummy markers
		$('#addDummyMarkers').click(function() {
		
			// Dummy data for markers that will be returieved from the db later on...
			var storedMarkers = {
					0: {
						lat:	"45.08",
						lng:	"-122.77"
					},
					1: {
						lat:	"45.18",
						lng:	"-122.67"
					},
					2: {
						lat:	"45.28",
						lng:	"-122.47"
					},
					3: {
						lat:	"45.34",
						lng:	"-122.17"
					}
			};
			
			//var storedMarkersCount = Object.keys(storedMarkers).length
			for (var location in storedMarkers) {
				
				var markerLat = storedMarkers[location].lat;
				var markerLng = storedMarkers[location].lng;
				
				addMarker(markerLat, markerLng);
			}
			/*for (var i = 0; i < storedMarkersCount; i++) {
				var markerLat = storedMarkers[i].lat;
				var markerLng = storedMarkers[i].lng;
				addMarker(markerLat, markerLng);
			}*/
			
		});

		//		Draw tour path button
		$('#drawTourPath').click(function () {

			tourPath = new google.maps.Polyline({
				path: tourStopsCoordinates,
				strokeColor: "#F00",
				strokeOpacity: 1.0,
				strokeWeight: 3
			});

			tourPath.setMap(map);
		
		});
		
		
		google.maps.event.addListener(map, 'click', function(event) {
		//		click on map -> place marker
			var clickLat = event.latLng['jb'];
			var clickLng = event.latLng['kb'];
			addMarker(clickLat, clickLng);
		});

		//		clear markers and routes
		$('#clearMapMarkers').click(function(){
			markersActive = [];
			tourStopsCoordinates = [];
			console.log(tourPath);
			tourPath.setMap(null);
			markersActive = [];

		});
	

/*
  var weatherLayer = new google.maps.weather.WeatherLayer({
    temperatureUnits: google.maps.weather.TemperatureUnit.FAHRENHEIT
  });
  weatherLayer.setMap(map);

  var cloudLayer = new google.maps.weather.CloudLayer();
  cloudLayer.setMap(map);
*/
//  var transitLayer = new google.maps.TransitLayer();
//  transitLayer.setMap(map);


});