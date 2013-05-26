
$(document).ready(function(){

		// Load map
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
		
		var tourPath = new google.maps.Polyline({
		});
		
		
		// Click functions		
		//		click on map -> place marker
		function placeMarker(location) {
			var clickMarker = new google.maps.Marker({
				position: location,
				map: map
			});
			markersActive.push(clickMarker);
			tourStopsCoordinates.push(location);
		}
		
		//		Geolocate button -> place marker at IP address geolocation
		$('#geolocate').click(function() {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position){
					var latitude = position.coords.latitude;
					var longitude = position.coords.longitude;
					var coords = new google.maps.LatLng(latitude, longitude);
					
					$.ajax({
						type:		"GET",
						url: 		"http://maps.googleapis.com/maps/api/geocode/json?latlng="+latitude+","+longitude+"&sensor=true",
						dataType:	"json",
						success:    function(data) {
										
										var currentAddress = data.results[1]['formatted_address'];
										$("#location-list").append('<li>'+ currentAddress + " </li>");
										var marker = new google.maps.Marker({
											position: coords,
											map: map,
											title: "Placeholder for address returned by Google AJAX call!"
										});
										markersActive.push(marker);
										tourStopsCoordinates.push(coords);
									},
						error: 		function(xhr, ajaxOptions, thrownError) {  
										alert("xhr status: " + xhr.statusText +"\nError thrown: " + thrownError);    
									}
					});
				});
			}
		});
		
		
		//		Add Tour Point with Coordinates -> 
		$('#addTourPoint').click(function(){
				var markerLat = $('#addTPLat').val();;
				var markerLng = $('#addTPLng').val();
				var myLatLng = new google.maps.LatLng(markerLat, markerLng);
						var marker = new google.maps.Marker({
						position: myLatLng,
						map: map,
				//		icon: ecIcon,
						animation: google.maps.Animation.DROP,
						title: 'Added point' 
				});
				
				$.ajax({
					type:		"GET",
					url: 		"http://maps.googleapis.com/maps/api/geocode/json?latlng="+markerLat+","+markerLng+"&sensor=false",
					dataType:	"json",
					async: false,
					success:    function(data) {

									var currentAddress = data.results[1]['formatted_address'];
									$("#location-list").append('<li>'+ currentAddress + " </li>");
									marker.title = currentAddress;
								},
					error: 		function(xhr, ajaxOptions, thrownError) {  
									alert("xhr status: " + xhr.statusText +"\nError thrown: " + thrownError);    
								}
				});			
			
				markersActive.push(marker);
				tourStopsCoordinates.push(myLatLng);
				
				
		});
			var tourStopsCoordinates = [];		
		
		
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
			
			var storedMarkersCount = Object.keys(storedMarkers).length

			for (var x = 0; x < storedMarkersCount; x++) {
			
				var markerLat = storedMarkers[x].lat;
				var markerLng = storedMarkers[x].lng;
				var myLatLng = new google.maps.LatLng(markerLat, markerLng);

				tourStopsCoordinates.push(myLatLng);

				var ecIcon = "images/ecIcon.png";
				var marker = new google.maps.Marker({
						position: myLatLng,
						map: map,
						icon: ecIcon,
						animation: google.maps.Animation.DROP,
						title: 'title' + x
				});
				markersActive.push(marker);

				$.ajax({
					type:		"GET",
					url: 		"http://maps.googleapis.com/maps/api/geocode/json?latlng="+markerLat+","+markerLng+"&sensor=false",
					dataType:	"json",
					ajaxI: x, 
					async: false,
					success:    function(data) {
									var i = this.ajaxI
									var ecIcon = "images/ecIcon.png";
									var currentAddress = data.results[1]['formatted_address'];
									$("#location-list").append('<li><img src="' + ecIcon + '" />'+ currentAddress + " </li>");
									markersActive[i].title = currentAddress;
									
								},
					error: 		function(xhr, ajaxOptions, thrownError) {  
									alert("xhr status: " + xhr.statusText +"\nError thrown: " + thrownError);    
								}
				});			
			
			}
			
		});

		//		Draw tour path button
		$('#drawTourPath').click(function () {
			console.log(tourStopsCoordinates);
			tourPath = new google.maps.Polyline({
				path: tourStopsCoordinates,
				strokeColor: "#F00",
				strokeOpacity: 1.0,
				strokeWeight: 3
			});

			tourPath.setMap(map);
		
		});
		
		
		google.maps.event.addListener(map, 'click', function(event) {
			placeMarker(event.latLng);
		});

		//		clear markers and routes
		$('#clearMapMarkers').click(function(){
			markersActive = [];
			tourStopsCoordinates = [];
			console.log(tourPath);
			tourPath.setMap(null);
			markersActive = [];
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