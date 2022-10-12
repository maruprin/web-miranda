import hotels from "../data/hotelsUbication.js";
import comunidadesEspana from "../data/comunidadesEspana.js";
import comunidadesAutonomas from "../data/comunidadesAutonomas.js";
let address;
function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: { lat: 41.372232, lng: 2.071841 },
  });
  const icon = {
    url: "../assets/maps/hotelMirandaUbicationIcon3.png",
    scaledSize: new google.maps.Size(25, 40),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(25, 40),
  };
  const infoWindow = new google.maps.InfoWindow({
    content: "",
    disableAutoPan: true,
  });
  const markers = hotels.map((position, i) => {
    const marker = new google.maps.Marker({
      position: { lat: position.lat, lng: position.lng },
      name: position.name,
      map: map,
      icon: icon,
    });

    marker.addListener("click", () => {
      infoWindow.setContent(marker.name);
      infoWindow.open(map, marker);
    });
    return marker;
  });
  const markerCluster = new markerClusterer.MarkerClusterer({ map, markers });

  //geolocalizacion
  const currentPosition = [];
  const locationButton = document.getElementById("location");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          currentPosition.push(pos);
          infoWindow.setPosition(pos);
          infoWindow.setContent("You are here");
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
  }

  // encontrar ubicacion introducida en input
  const geocoder = new google.maps.Geocoder();
  const input = document.getElementById("input-adress");
  const button = document.getElementById("search-location");
  button.addEventListener("click", () => {
    address = input.value;
    geocoder.geocode({ address: address }, function (results, status) {
      const pos = results[0].geometry.location;
      infoWindow.setPosition(pos);
      infoWindow.setContent("You are here!");
      infoWindow.open(map);
      map.setCenter(pos);
    });
  });

  //locaciones cercanas

  const nearestButton = document.getElementById("nearest");
  const wrap = document.getElementById("results-wrap");
  const results = document.getElementById("results");

  nearestButton.addEventListener("click", () => {
    console.log("me aprieto");
    console.log(currentPosition);
    wrap.classList.add("map__results-active");
    const destinations = hotels.map((hotel) => ({
      lat: hotel.lat,
      lng: hotel.lng,
    }));
    if (currentPosition.length) {
      if (address) {
        results.innerHTML = "";
        calculateDistance(address, destinations);
      } else {
        const origin = new google.maps.LatLng(
          currentPosition[0].lat,
          currentPosition[0].lng
        );
        results.innerHTML = "";
        calculateDistance(origin, destinations);
      }
    } else if (address) {
      results.innerHTML = "";
      calculateDistance(address, destinations);
    } else {
      alert("Define your position");
    }
  });

  function calculateDistance(origin, destinations) {
    var service = new google.maps.DistanceMatrixService();
    service
      .getDistanceMatrix({
        origins: [origin],
        destinations: destinations,
        travelMode: "DRIVING",
      })
      .then((response) => {
        const hotels = response.destinationAddresses.map((hotel) => ({
          name: hotel,
        }));
        const distances = response.rows[0].elements.map((dist) => ({
          distance: dist.distance,
        }));
        const sortedHotels = [];
        for (let i = 0; i < hotels.length; i++) {
          sortedHotels.push({ ...hotels[i], ...distances[i] });
        }
        sortedHotels.sort((a, b) => a.distance.value - b.distance.value);
        for (let hotel of sortedHotels) {
          const distance = document.createElement("li");
          console.log(hotel);
          distance.innerText = `${hotel.name} - ${hotel.distance.text}`;
          document.getElementById("results").appendChild(distance);
        }
      });
  }

  // formas de comunidades autonomas
  console.log(comunidadesAutonomas);
  console.log(comunidadesEspana);

  const selectCommunity = document.getElementById("comunidades-select");
  comunidadesAutonomas.forEach((element, index) => {
    let option = document.createElement("option");
    option.value = index;
    option.text = element;
    selectCommunity.appendChild(option);
  });

  selectCommunity.addEventListener("change", (e) => {
    let communityShape;
    // Construct the polygon.
    communityShape = new google.maps.Polygon({
      paths: comunidadesEspana[e.target.selectedIndex],
      strokeColor: "#329da8",
      strokeOpacity: 1,
      strokeWeight: 2,
      fillColor: "#66b2ba",
      fillOpacity: 0.8,
    });
console.log(google.maps)
 communityShape.setMap(null)
 communityShape.setMap(map);
  });
}

window.initMap = initMap;
