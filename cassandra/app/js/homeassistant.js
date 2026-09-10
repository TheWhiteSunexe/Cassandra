/* =========================================
   HOME ASSISTANT
   ========================================= */


var homeAssistantState = null;


/* =========================================
   RÉCUPÉRATION
   ========================================= */

function updateHomeAssistant() {

    var xhr = new XMLHttpRequest();


    xhr.open(
        "GET",
        "/api/state",
        true
    );


    xhr.timeout = 5000;


    xhr.onload = function() {

        if (
            xhr.status < 200 ||
            xhr.status >= 300
        ) {

            console.log(
                "Erreur Cassandra API : "
                + xhr.status
            );

            return;
        }


        try {

            var data =
                JSON.parse(
                    xhr.responseText
                );


            homeAssistantState =
                data;


            processHomeAssistantState(
                data
            );


        } catch (error) {

            console.log(
                "Erreur JSON Home Assistant : ",
                error
            );
        }
    };


    xhr.onerror = function() {

        console.log(
            "Impossible de contacter Cassandra API."
        );
    };


    xhr.ontimeout = function() {

        console.log(
            "Timeout Cassandra API."
        );
    };


    xhr.send();
}


/* =========================================
   AFFICHAGE D'UNE VALEUR
   ========================================= */

function displayValue(
    elementId,
    value,
    suffix
) {

    var element =
        document.getElementById(
            elementId
        );


    if (!element) {
        return;
    }


    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        element.textContent =
            "----";

        return;
    }


    element.textContent =
        value +
        (suffix || "");
}


/* =========================================
   TRAITEMENT
   ========================================= */

function processHomeAssistantState(data) {

    if (!data) {
        return;
    }


    /* ---------------------------------------
       TEMPÉRATURE
    --------------------------------------- */

    displayValue(
        "temperature",
        data.environment
            ? data.environment.temperature
            : null,
        "°"
    );


    /* ---------------------------------------
       HUMIDITÉ
    --------------------------------------- */

    displayValue(
        "humidity",
        data.environment
            ? data.environment.humidity
            : null,
        "%"
    );


    /* ---------------------------------------
       CO2
    --------------------------------------- */

    displayValue(
        "co2",
        data.environment
            ? data.environment.co2
            : null,
        " PPM"
    );


    /* ---------------------------------------
       QUALITÉ DE L'AIR
    --------------------------------------- */

    var airQuality =
        data.environment
            ? data.environment.airQuality
            : null;


    if (
        airQuality !== null &&
        airQuality !== undefined &&
        airQuality !== ""
    ) {

        displayValue(
            "airQuality",
            airQuality.toUpperCase()
        );

    } else {

        displayValue(
            "airQuality",
            null
        );
    }


    /* ---------------------------------------
       LUMINOSITÉ
    --------------------------------------- */

    displayValue(
        "brightness",
        data.environment
            ? data.environment.brightness
            : null,
        " LX"
    );


    /* ---------------------------------------
       MÉTÉO
    --------------------------------------- */

    displayValue(
        "weather",
        data.weather
            ? data.weather.description
            : null
    );


    /* ---------------------------------------
       PORTE
    --------------------------------------- */

    var door =
        data.room
            ? data.room.door
            : null;


    if (door) {

        displayValue(
            "door",
            door.toUpperCase()
        );

    } else {

        displayValue(
            "door",
            null
        );
    }


    /* ---------------------------------------
       MUSIQUE
    --------------------------------------- */

    if (
        data.media &&
        data.media.playing
    ) {

        var artist =
            data.media.artist ||
            "----";

        var title =
            data.media.title ||
            "----";


        displayValue(
            "music",
            artist + " — " + title
        );

    } else {

        displayValue(
            "music",
            null
        );
    }
}


/* =========================================
   ACCÈS AUX DONNÉES
   ========================================= */

function getHomeAssistantState() {

    return homeAssistantState;
}


/* =========================================
   MISE À JOUR
   ========================================= */

setInterval(
    updateHomeAssistant,
    10000
);


/* =========================================
   PREMIÈRE RÉCUPÉRATION
   ========================================= */

updateHomeAssistant();