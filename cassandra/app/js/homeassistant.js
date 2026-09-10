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
   TRAITEMENT
   ========================================= */

function processHomeAssistantState(data) {

    if (!data) {
        return;
    }


    /* ---------------------------------------
       TEMPÉRATURE
    --------------------------------------- */

    if (
        data.environment &&
        data.environment.temperature !== null
    ) {

        document.getElementById(
            "temperature"
        ).textContent =
            data.environment.temperature
            + "°";
    }


    /* ---------------------------------------
       MÉTÉO
    --------------------------------------- */

    if (
        data.weather &&
        data.weather.description
    ) {

        document.getElementById(
            "weather"
        ).textContent =
            data.weather.description;
    }


    /*
        Les autres données sont volontairement
        seulement stockées pour le moment.

        Elles seront utilisées par le Behavior
        Engine plus tard.
    */
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