/* =========================================================
   CASSANDRA — AFFICHAGE TRANSPORT
   Style panneau SNCF / Aésys
   ========================================================= */

function updateTransportScreen(departures) {

    var container =
        document.getElementById("departures");

    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (
        !departures ||
        !departures.length
    ) {

        container.innerHTML =
            '<div class="noDeparture">' +
            'AUCUN DÉPART DISPONIBLE' +
            '</div>';

        return;
    }


    for (
        var i = 0;
        i < departures.length;
        i++
    ) {

        container.appendChild(
            createDepartureRow(
                departures[i]
            )
        );
    }


    refreshTransportCountdowns();
}


function createDepartureRow(departure) {

    var row =
        document.createElement("div");

    row.className = "departure";


    row.setAttribute(
        "data-departure",
        departure.departure.toISOString()
    );


    /* =========================================
       LOGO RER A
       ========================================= */

    var line =
        document.createElement("div");

    line.className = "lineIcon";

    line.textContent =
        departure.line || "A";


    /* =========================================
       DESTINATION + MISSION + TYPE + STATUT
       ========================================= */

    var destination =
        document.createElement("div");

    destination.className =
        "destination";


    var destinationName =
        document.createElement("div");

    destinationName.className =
        "destinationName";

    destinationName.textContent =
        formatDestination(
            departure.destination
        );


    var trainInfo =
        document.createElement("div");

    trainInfo.className =
        "trainInfo";


    var mission =
        departure.mission ||
        "—";


    var trainType =
        departure.trainType ||
        "Train";


    var status =
        departure.statusLabel ||
        "À L'HEURE";


    trainInfo.textContent =
        mission +
        " · " +
        trainType +
        " · " +
        status;


    destination.appendChild(
        destinationName
    );

    destination.appendChild(
        trainInfo
    );


    /* =========================================
       HEURE
       ========================================= */

    var time =
        document.createElement("div");

    time.className =
        "departureTime";


    time.textContent =
        formatTimeRemaining(
            departure.departure
        );


    /* =========================================
       VOIE
       ========================================= */

    var platform =
        document.createElement("div");

    platform.className =
        "platform";


    platform.textContent =
        departure.platform ||
        "-";


    row.appendChild(line);
    row.appendChild(destination);
    row.appendChild(time);
    row.appendChild(platform);


    return row;
}


/* =========================================================
   DESTINATION
   ========================================================= */

function formatDestination(destination) {

    if (!destination) {
        return "Paris";
    }

    return String(destination)
        .replace(
            /-/g,
            "-"
        )
        .toUpperCase();
}


/* =========================================================
   HEURE
   ========================================================= */

function formatClockTime(date) {

    var hours =
        String(
            date.getHours()
        ).padStart(2, "0");

    var minutes =
        String(
            date.getMinutes()
        ).padStart(2, "0");


    return (
        hours +
        ":" +
        minutes
    );
}


/* =========================================================
   TEMPS RESTANT
   ========================================================= */

function formatTimeRemaining(date) {

    var now =
        Date.now();

    var difference =
        date.getTime() -
        now;


    if (difference <= 60000) {
        return "À L'APPROCHE";
    }


    var minutes =
        Math.floor(
            difference / 60000
        );


    if (minutes < 60) {

        return (
            minutes +
            " min"
        );
    }


    return formatClockTime(
        date
    );
}


/* =========================================================
   RAFRAÎCHISSEMENT DU COMPTE À REBOURS
   ========================================================= */

function refreshTransportCountdowns() {

    var rows =
        document.querySelectorAll(
            ".departure[data-departure]"
        );


    for (
        var i = 0;
        i < rows.length;
        i++
    ) {

        var date =
            new Date(
                rows[i].getAttribute(
                    "data-departure"
                )
            );


        var time =
            rows[i].querySelector(
                ".departureTime"
            );


        if (time) {

            time.textContent =
                formatTimeRemaining(
                    date
                );
        }
    }
}


setInterval(
    refreshTransportCountdowns,
    1000
);


/* =========================================================
   INFORMATION TRAFIC
   ========================================================= */

function updateTransportTraffic(traffic) {

    var message =
        "INFORMATION TRAFIC · TRAFIC NORMAL";

    var state = "normal";

    if (traffic && traffic.length) {

        var first = traffic[0];

        message =
            "INFORMATION TRAFIC · " +
            (first.message || "RER A perturbé");

        state = "incident";
    }

    setTransportTrafficState(
        state,
        message
    );

    /*
       Les perturbations secondaires restent disponibles
       dans la console pour diagnostic, mais Cassandra
       affiche en priorité la plus importante.
    */
    if (traffic && traffic.length > 1) {
        console.info(
            "[TRANSPORT] Autres perturbations :",
            traffic.slice(1)
        );
    }
}


function setTransportTrafficState(
    state,
    message
) {

    var element =
        document.getElementById(
            "transportMessage"
        );

    var icon =
        document.querySelector(
            ".warning"
        );

    if (element) {
        element.textContent = message;
    }

    if (icon) {
        icon.className =
            "warning " +
            state;

        /*
           La rubalise est désormais dessinée en CSS.
           Aucun caractère d'alerte n'est nécessaire ici.
        */
        icon.textContent = "";
    }
}


function updateTransportTrafficError(error) {

    console.error(
        "[TRANSPORT] Informations trafic indisponibles :",
        error
    );

    setTransportTrafficState(
        "unknown",
        "INFORMATION TRAFIC · DONNÉES INDISPONIBLES"
    );
}


/* =========================================================
   ERREURS DÉPARTS
   ========================================================= */

function updateTransportError(error) {

    var message =
        "DONNÉES IDFM INDISPONIBLES";

    if (error === "NO_API_KEY") {
        message =
            "CLÉ API IDFM MANQUANTE";
    }
    else if (
        error === "NETWORK_ERROR"
    ) {
        message =
            "ERREUR RÉSEAU IDFM";
    }
    else if (
        error === "TIMEOUT"
    ) {
        message =
            "DÉLAI D'ATTENTE IDFM";
    }
    else if (
        String(error).indexOf("HTTP_") === 0
    ) {
        message =
            "ERREUR IDFM " +
            String(error).replace(
                "HTTP_",
                ""
            );
    }

    /*
       Une erreur sur les départs ne doit pas écraser
       une information trafic valide déjà affichée.
    */
    console.error(
        "[TRANSPORT]",
        message
    );
}
