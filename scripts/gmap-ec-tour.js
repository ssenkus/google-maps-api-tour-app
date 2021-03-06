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
	
		// data storage
		var markersActive = [];  
		var tourStopsCoordinates = [];
		var tourPaths = [];
		var infoBoxes = [];
		// -- -- Map functions --
		
		
		// Marker Data functions
		function addToLocationList(geocodeAddress) {
			$("#location-list").append('<li></li>');
			
			var result = '';
				for (var i = 0; i < geocodeAddress.length; i++) {
					result += '<option value="'+ i + '">' +geocodeAddress[i]+ '</option>';
				}
			$("#location-list > li").last().append('<select>' + result + '</select>');

		}
		
		function clearLocationsList() {
			$("#location-list li").remove();
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
								var currentAddress = [];
								var i;
								
								for (i = 0; i < data.results.length; i++) {
									currentAddress.push(data.results[i]['formatted_address']);
								}
								var marker = new google.maps.Marker({
									position: markerCoords,
									map: map,
									title: currentAddress[1],
									animation: google.maps.Animation.DROP
								});
								
								google.maps.event.addListener(marker, 'click', function() {
									var boxText = document.createElement("div");
									boxText.style.cssText = "border: 1px solid black; margin-top: 8px; background: #fafafa; padding: 5px; border-radius: 25px;";
									boxText.innerHTML = currentAddress[1];
									var myOptions = {
										content: boxText,
										disableAutoPan: false,
										maxWidth: 0,
										pixelOffset: new google.maps.Size(-140, 0),
										zIndex: null,
										boxStyle: { 
											background: "url('tipbox.gif') no-repeat",
											opacity: 0.75,
											width: "280px"
										},
										closeBoxMargin: "10px 2px 2px 2px",
										closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
										infoBoxClearance: new google.maps.Size(1, 1),
										isHidden: false,
										pane: "floatPane",
										enableEventPropagation: false,
									};
									var markerInfoBox = new InfoBox(myOptions);
									infoBoxes.push(markerInfoBox);
									markerInfoBox.open(map, marker);
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
						lng:	"-123.77"
					},
					1: {
						lat:	"45.18",
						lng:	"-123.17"
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
			
			for (var location in storedMarkers) {
				var markerLat = storedMarkers[location].lat;
				var markerLng = storedMarkers[location].lng;
				addMarker(markerLat, markerLng);
			}
			
		});

		//		Draw tour path button
		$('#drawTourPath').click(function () {
			tourPaths.push(new google.maps.Polyline({
				path: tourStopsCoordinates,
				strokeColor: "#F00",
				strokeOpacity: 1.0,
				strokeWeight: 3
			}));
			
			
			for (i=0; i<tourPaths.length; i++) {                           
				tourPaths[i].setMap(map);
			}
			
		});

		//		Delete last point and update
		$('#deleteLastPoint').click(function() {
			$("#location-list li:last").remove();
			markersActive[markersActive.length-1].setMap(null);
			markersActive.pop();
			tourStopsCoordinates[tourStopsCoordinates.length-1].setMap(null);
			tourStopsCoordinates.pop();
			tourPaths[tourPaths.length-1].pop();
		});
		
		//		clear markers and routes
		$('#resetMap').click(function(){
			// remove markers
			clearLocationsList();
			for (var i = 0; i < markersActive.length; i++ ) {
				markersActive[i].setMap(null);
			}
			markersActive = [];
			
			// remove path
			tourStopsCoordinates = [];
			for (i=0; i<tourPaths.length; i++) {                           
				tourPaths[i].setMap(null);
			}
			tourPaths = [];

			// remove infoboxes
			for (i=0; i<infoBoxes.length; i++) {                           
				infoBoxes[i].setMap(null);
			}
			infoBoxes = []

		});
		
		//		click on map -> place marker
		google.maps.event.addListener(map, 'click', function(event) {
			var clickLat = event.latLng['jb'];
			var clickLng = event.latLng['kb'];
			addMarker(clickLat, clickLng);
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