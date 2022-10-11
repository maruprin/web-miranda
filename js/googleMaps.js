import hotels from "../data/hotelsUbication.js";


function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: { lat: 41.372232, lng: 2.071841 },
  });
  const icon = {
    url: "../assets/maps/hotelMirandaUbicationIcon3.png", // url
    scaledSize: new google.maps.Size(25, 40), // scaled size
    origin: new google.maps.Point(0, 0), // origin
    anchor: new google.maps.Point(25, 40), // anchor
  };
  const infoWindow = new google.maps.InfoWindow({
    content: '',
    disableAutoPan: true,

  });

  //geolocalizacion
  // const locationButton = document.createElement("button");
  // locationButton.textContent = "Pan to Current Location";
  // locationButton.classList.add("custom-map-control-button");
  // map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  // locationButton.addEventListener("click", () => {
  //   // Try HTML5 geolocation.
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const pos = {
  //           lat: position.coords.latitude,
  //           lng: position.coords.longitude,
  //         };

  //         infoWindow.setPosition(pos);
  //         infoWindow.setContent("Location found.");
  //         infoWindow.open(map);
  //         map.setCenter(pos);
  //       },
  //       () => {
  //         handleLocationError(true, infoWindow, map.getCenter());
  //       }
  //     );
  //   } else {
  //     // Browser doesn't support Geolocation
  //     handleLocationError(false, infoWindow, map.getCenter());
  //   }
  // });
  // function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  //   infoWindow.setPosition(pos);
  //   infoWindow.setContent(
  //     browserHasGeolocation
  //       ? "Error: The Geolocation service failed."
  //       : "Error: Your browser doesn't support geolocation."
  //   );
  //   infoWindow.open(map);
  // }
  

    const markers = hotels.map((position, i) => {
      const marker = new google.maps.Marker({
        position: { lat: position.lat, lng: position.lng },
        name: position.name,
        map: map,
        icon: icon
      });
  
  marker.addListener("click", () => {
    infoWindow.setContent(marker.name);
    infoWindow.open(map, marker);
  });
  return marker;
});
const markerCluster = new markerClusterer.MarkerClusterer({ map, markers });
}

window.initMap = initMap;
