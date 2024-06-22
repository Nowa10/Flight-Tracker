#############################################################
###                       NE SERT PLUS                    ###
#############################################################

# Import des bibliothèques nécessaires
import requests
import pandas as pd
import folium

# URL de l'API OpenSky pour récupérer tous les états
url = "https://opensky-network.org/api/states/all"

# Requête HTTP GET pour récupérer les données
response = requests.get(url)
data = response.json()

# Définition des colonnes
columns = [
    "icao24",
    "callsign",
    "origin_country",
    "time_position",
    "last_contact",
    "longitude",
    "latitude",
    "baro_altitude",
    "on_ground",
    "velocity",
    "heading",
    "vertical_rate",
    "sensors",
    "geo_altitude",
    "squawk",
    "spi",
    "position_source",
]

# Conversion des données JSON en DataFrame
df = pd.DataFrame(data["states"], columns=columns)

# Créer une carte centrée sur une position approximative
m = folium.Map(location=[20, 0], zoom_start=2)

# Ajouter des marqueurs pour chaque avion avec des popups pour les détails
for index, row in df.iterrows():
    if pd.notna(row["latitude"]) and pd.notna(row["longitude"]):
        # Construire le contenu du popup avec les détails de l'avion
        popup_text = f"""
        <b>Indicatif d'appel :</b> {row['callsign'] or 'Non disponible'}<br>
        <b>Pays d'origine :</b> {row['origin_country']}<br>
        <b>Longitude :</b> {row['longitude']}<br>
        <b>Latitude :</b> {row['latitude']}<br>
        <b>Altitude barométrique :</b> {row['baro_altitude']} m<br>
        <b>Vitesse :</b> {row['velocity']} m/s<br>
        <b>Cap :</b> {row['heading']}°<br>
        <b>Taux vertical :</b> {row['vertical_rate']} m/s<br>
        <b>Code ICAO24 :</b> {row['icao24']}<br>
        <b>Code Squawk :</b> {row['squawk'] or 'Non disponible'}<br>
        """
        # Ajouter le marqueur avec le popup à la carte
        folium.Marker(
            [row["latitude"], row["longitude"]],
            tooltip=row["callsign"] or "Non disponible",
            popup=folium.Popup(popup_text, max_width=300),
        ).add_to(m)

# Enregistrer la carte en HTML
m.save("flights_map.html")

print("La carte des vols a été enregistrée dans 'flights_map.html'.")
