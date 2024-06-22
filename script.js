// Initialisation de la carte
var map = L.map('map').setView([20, 0], 2);

// Ajouter les tuiles de base de la carte
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var markers = {}; // Afficher les pins grace à leur marque Icao24

// Fonction pour mettre à jour la carte avec les nouvelles données
function updateMap() {
    axios.get('https://opensky-network.org/api/states/all')
        .then(response => {
            var data = response.data.states;

            data.forEach(function (state) {
                var icao24 = state[0];
                var callsign = state[1] || 'N/A';
                var origin_country = state[2];
                var longitude = state[5];
                var latitude = state[6];
                var baro_altitude = state[7];
                var velocity = state[9];
                var heading = state[10];
                var vertical_rate = state[11];
                var squawk = state[14] || 'N/A';

                if (latitude && longitude) {
                    // Si le marqueur existe déjà, mettre à jour sa position
                    if (markers[icao24]) {
                        markers[icao24].setLatLng([latitude, longitude]);
                    } else {
                        // Sinon, créer un nouveau marqueur
                        var popupText = `
                            <b>Indicatif d'appel :</b> ${callsign}<br>
                            <b>Pays d'origine :</b> ${origin_country}<br>
                            <b>Longitude :</b> ${longitude}<br>
                            <b>Latitude :</b> ${latitude}<br>
                            <b>Altitude barométrique :</b> ${baro_altitude} m<br>
                            <b>Vitesse :</b> ${velocity} m/s<br>
                            <b>Cap :</b> ${heading}°<br>
                            <b>Taux vertical :</b> ${vertical_rate} m/s<br>
                            <b>Code Squawk :</b> ${squawk}<br>
                        `;

                        var marker = L.marker([latitude, longitude]).addTo(map)
                            .bindPopup(popupText);

                        // Ajouter le marqueur au dictionnaire des marqueurs
                        markers[icao24] = marker;
                    }
                }
            });
        })
        .catch(error => console.error('Erreur lors de la récupération des données:', error));
}

// Mettre à jour la carte toutes les 30 secondes
setInterval(updateMap, 30000);

// Mettre à jour la carte dès le chargement de la page
updateMap();
