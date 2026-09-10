from http.server import SimpleHTTPRequestHandler, HTTPServer
import urllib.request
import json
import os


# =========================================
# CONFIGURATION
# =========================================

PORT = 8090
HA_API = "http://supervisor/core/api"


# =========================================
# HANDLER
# =========================================

class CassandraHandler(SimpleHTTPRequestHandler):

    # -----------------------------------------
    # HEADERS
    # -----------------------------------------

    def end_headers(self):

        self.send_header(
            "Cache-Control",
            "no-cache"
        )

        SimpleHTTPRequestHandler.end_headers(
            self
        )


    # =========================================
    # HOME ASSISTANT
    # =========================================

    def get_home_assistant_state(self, entity_id):

        try:

            request = urllib.request.Request(
                HA_API + "/states/" + entity_id
            )

            request.add_header(
                "Authorization",
                "Bearer " +
                os.environ["SUPERVISOR_TOKEN"]
            )

            response = urllib.request.urlopen(
                request,
                timeout=5
            )

            data = json.loads(
                response.read().decode("utf-8")
            )

            return data

        except Exception as error:

            print(
                "Erreur Home Assistant pour "
                + entity_id
                + ": "
                + str(error)
            )

            return None


    # =========================================
    # OUTIL
    # =========================================

    def get_state(self, entity_id):

        data = self.get_home_assistant_state(
            entity_id
        )

        if not data:
            return None

        return data.get("state")


    # =========================================
    # ÉTAT DE LA MAISON
    # =========================================

    def get_cassandra_state(self):

        # -------------------------------------
        # PRÉSENCE
        # -------------------------------------

        motion = self.get_state(
            "binary_sensor.chambre_detecteur_de_mouvement_occupation"
        )

        person = self.get_state(
            "person.gillet"
        )


        # -------------------------------------
        # ENVIRONNEMENT
        # -------------------------------------

        temperature = self.get_state(
            "sensor.alpstuga_air_quality_monitor_temperature"
        )

        humidity = self.get_state(
            "sensor.alpstuga_air_quality_monitor_humidite"
        )

        co2 = self.get_state(
            "sensor.alpstuga_air_quality_monitor_dioxyde_de_carbone"
        )

        pm25 = self.get_state(
            "sensor.alpstuga_air_quality_monitor_pm2_5"
        )

        air_quality = self.get_state(
            "sensor.alpstuga_air_quality_monitor_qualite_de_l_air"
        )

        brightness = self.get_state(
            "sensor.chambre_detecteur_de_mouvement_eclairement"
        )


        # -------------------------------------
        # PORTE
        # -------------------------------------

        door = self.get_state(
            "binary_sensor.chambre_porte_porte"
        )


        # -------------------------------------
        # MUSIQUE
        # -------------------------------------

        media = self.get_home_assistant_state(
            "media_player.chambre_chambre"
        )


        media_state = None
        media_title = None
        media_artist = None
        media_volume = None
        media_app = None

        if media:

            media_state = media.get(
                "state"
            )

            attributes = media.get(
                "attributes",
                {}
            )

            media_title = attributes.get(
                "media_title"
            )

            media_artist = attributes.get(
                "media_artist"
            )

            media_volume = attributes.get(
                "volume_level"
            )

            media_app = attributes.get(
                "app_name"
            )


        # -------------------------------------
        # MÉTÉO
        # -------------------------------------

        weather = self.get_home_assistant_state(
            "weather.forecast_maison"
        )

        weather_state = None
        weather_temperature = None
        weather_humidity = None
        weather_pressure = None
        weather_wind_speed = None

        if weather:

            weather_state = weather.get(
                "state"
            )

            attributes = weather.get(
                "attributes",
                {}
            )

            weather_temperature = attributes.get(
                "temperature"
            )

            weather_humidity = attributes.get(
                "humidity"
            )

            weather_pressure = attributes.get(
                "pressure"
            )

            weather_wind_speed = attributes.get(
                "wind_speed"
            )


        # =====================================
        # RÉSULTAT
        # =====================================

        result = {

            "presence": {

                "room": (
                    motion == "on"
                    if motion is not None
                    else None
                ),

                "home": (
                    person == "home"
                    if person is not None
                    else None
                )
            },


            "environment": {

                "temperature":
                    self.to_number(
                        temperature
                    ),

                "humidity":
                    self.to_number(
                        humidity
                    ),

                "co2":
                    self.to_number(
                        co2
                    ),

                "pm25":
                    self.to_number(
                        pm25
                    ),

                "airQuality":
                    air_quality,

                "brightness":
                    self.to_number(
                        brightness
                    )
            },


            "room": {

                "door":
                    self.translate_door(
                        door
                    )
            },


            "media": {

                "playing":
                    (
                        media_state == "playing"
                        if media_state is not None
                        else None
                    ),

                "state":
                    media_state,

                "title":
                    media_title,

                "artist":
                    media_artist,

                "volume":
                    media_volume,

                "app":
                    media_app
            },


            "weather": {

                "state":
                    weather_state,

                "description":
                    (
                        self.translate_weather(
                            weather_state
                        )
                        if weather_state
                        else None
                    ),

                "temperature":
                    self.to_number(
                        weather_temperature
                    ),

                "humidity":
                    self.to_number(
                        weather_humidity
                    ),

                "pressure":
                    self.to_number(
                        weather_pressure
                    ),

                "windSpeed":
                    self.to_number(
                        weather_wind_speed
                    )
            }

        }

        return result


    # =========================================
    # CONVERSIONS
    # =========================================

    def to_number(self, value):

        if value is None:
            return None

        try:
            return float(value)

        except:

            return None


    def translate_door(self, state):

        if state == "on":
            return "open"

        if state == "off":
            return "closed"

        return None


    def translate_weather(self, state):

        translations = {

            "clear-night":
                "CIEL DÉGAGÉ",

            "cloudy":
                "NUAGEUX",

            "partlycloudy":
                "PARTIELLEMENT NUAGEUX",

            "fog":
                "BROUILLARD",

            "hail":
                "GRÊLE",

            "lightning":
                "ORAGEUX",

            "lightning-rainy":
                "ORAGEUX",

            "pouring":
                "FORTE PLUIE",

            "rainy":
                "PLUVIEUX",

            "snowy":
                "NEIGE",

            "snowy-rainy":
                "NEIGE ET PLUIE",

            "sunny":
                "ENSOLEILLÉ",

            "windy":
                "VENTEUX",

            "windy-variant":
                "VENTEUX",

            "exceptional":
                "EXCEPTIONNEL"
        }

        return translations.get(
            state,
            "----"
        )


    # =========================================
    # API
    # =========================================

    def do_GET(self):

        if self.path == "/api/state":

            data = self.get_cassandra_state()

            response = json.dumps(
                data,
                ensure_ascii=False
            ).encode("utf-8")


            self.send_response(200)

            self.send_header(
                "Content-Type",
                "application/json; charset=utf-8"
            )

            self.send_header(
                "Content-Length",
                str(len(response))
            )

            self.end_headers()

            self.wfile.write(
                response
            )

            return


        SimpleHTTPRequestHandler.do_GET(
            self
        )


# =========================================
# SERVEUR
# =========================================

server = HTTPServer(
    ("0.0.0.0", PORT),
    CassandraHandler
)

print(
    "Cassandra server started on port "
    + str(PORT)
)

server.serve_forever()