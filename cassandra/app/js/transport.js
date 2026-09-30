/* =========================================
   ÉCRAN TRANSPORT
   ========================================= */

function updateTransportClock() {

    var element =
        document.getElementById(
            "transportClock"
        );

    if (!element) {
        return;
    }

    var now = new Date();

    element.textContent =
        String(now.getHours()).padStart(2, "0") +
        ":" +
        String(now.getMinutes()).padStart(2, "0") +
        ":" +
        String(now.getSeconds()).padStart(2, "0");
}


function formatDepartureTime(date) {

    if (!(date instanceof Date)) {
        date = new Date(date);
    }

    if (
        isNaN(
            date.getTime()
        )
    ) {
        return "--:--";
    }

    return (
        String(
            date.getHours()
        ).padStart(2, "0") +
        ":" +
        String(
            date.getMinutes()
        ).padStart(2, "0")
    );
}


function departureStatusLabel(item) {

    if (item.vehicleAtStop) {
        return "Train à quai";
    }

    switch (
        item.departureStatus
    ) {

        case "cancelled":
            return "Train supprimé";

        case "delayed":
            return "Train retardé";

        case "early":
            return "Train en avance";

        case "noReport":
            return "Information indisponible";

        default:
            return "RER A · Train";
    }
}


function updateTransportScreen(
    departures
) {

    var container =
        document.getElementById(
            "departures"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (
        !departures ||
        departures.length === 0
    ) {

        var empty =
            document.createElement(
                "div"
            );

        empty.className =
            "transportEmpty";

        empty.textContent =
            "Aucun départ disponible";

        container.appendChild(
            empty
        );

        updateTransportMessage(
            "Données temps réel IDFM — aucun départ disponible"
        );

        return;
    }

    departures.forEach(
        function(departure) {

            var row =
                document.createElement(
                    "div"
                );

            row.className =
                "departure";


            var line =
                document.createElement(
                    "div"
                );

            line.className =
                "lineIcon";

            line.textContent =
                departure.line || "A";


            var destination =
                document.createElement(
                    "div"
                );

            destination.className =
                "destination";


            var destinationName =
                document.createElement(
                    "div"
                );

            destinationName.className =
                "destinationName";

            destinationName.textContent =
                departure.destination ||
                "Paris";


            var trainInfo =
                document.createElement(
                    "div"
                );

            trainInfo.className =
                "trainInfo";

            trainInfo.textContent =
                departureStatusLabel(
                    departure
                );


            destination.appendChild(
                destinationName
            );

            destination.appendChild(
                trainInfo
            );


            var time =
                document.createElement(
                    "div"
                );

            time.className =
                "departureTime";

            time.textContent =
                formatDepartureTime(
                    departure.departure
                );


            var platform =
                document.createElement(
                    "div"
                );

            platform.className =
                "platform";

            platform.textContent =
                departure.platform || "-";


            row.appendChild(line);
            row.appendChild(destination);
            row.appendChild(time);
            row.appendChild(platform);

            container.appendChild(
                row
            );
        }
    );

    updateTransportMessage(
        "Informations trafic — Données temps réel IDFM"
    );
}


function updateTransportMessage(
    message
) {

    var element =
        document.getElementById(
            "transportMessage"
        );

    if (!element) {
        return;
    }

    element.textContent =
        message;
}


function updateTransportError(
    error
) {

    var message =
        "Connexion IDFM indisponible";

    if (
        error === "HTTP_401" ||
        error === "HTTP_403"
    ) {
        message =
            "Accès API IDFM refusé — vérifier la clé PRIM";
    }

    if (error === "HTTP_429") {
        message =
            "Quota API IDFM atteint";
    }

    if (error === "NETWORK_ERROR") {
        message =
            "Réseau / CORS — API IDFM inaccessible";
    }

    updateTransportMessage(
        message
    );

    console.error(
        "[TRANSPORT]",
        error
    );
}
