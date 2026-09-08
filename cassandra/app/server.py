from http.server import SimpleHTTPRequestHandler, HTTPServer
import urllib.request
import json

PORT = 8090
HA_API = "http://supervisor/core/api"


class CassandraHandler(SimpleHTTPRequestHandler):

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        SimpleHTTPRequestHandler.end_headers(self)

    def get_home_assistant_state(self, entity_id):

        try:
            request = urllib.request.Request(
                HA_API + "/states/" + entity_id
            )

            request.add_header(
                "Authorization",
                "Bearer " + __import__("os").environ["SUPERVISOR_TOKEN"]
            )

            response = urllib.request.urlopen(request, timeout=5)

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

    def get_cassandra_state(self):

        weather = self.get_home_assistant_state(
            "weather.forecast_maison"
        )

        result = {
            "temperature": "----",
            "weather": "----",
            "house": "----",
            "rer": "----"
        }

        if weather:

            attributes = weather.get("attributes", {})

            temperature = attributes.get("temperature")

            if temperature is not None:

                result["temperature"] = str(
                    temperature
                ) + "°"

            weather_state = weather.get("state")

            if weather_state:

                result["weather"] = self.translate_weather(
                    weather_state
                )

        return result

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

            self.wfile.write(response)

            return

        SimpleHTTPRequestHandler.do_GET(self)


server = HTTPServer(
    ("0.0.0.0", PORT),
    CassandraHandler
)

print(
    "Cassandra server started on port "
    + str(PORT)
)

server.serve_forever()