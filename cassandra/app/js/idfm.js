/* =========================================================
   CASSANDRA — IDFM / RER A
   Sucy - Bonneuil → direction Paris
   ========================================================= */

var idfm = {

    enabled: true,

    /*
       IMPORTANT :
       Remplace cette valeur par ta nouvelle clé IDFM.
       La clé précédente a été retirée de ce fichier.
    */
    apiKey: "9P7nGV2f7A4Zfml67EpAnygftXafAaHh",

    baseUrl:
        "https://prim.iledefrance-mobilites.fr/marketplace",

    monitoringRef:
        "STIF:StopArea:SP:58792:",

    lineRef:
        "STIF:Line::C01742:",

    refreshInterval: 15000,

    departuresCount: 5,

    /*
       Informations trafic : on rafraîchit moins souvent
       que les départs pour éviter de multiplier les appels.
    */
    trafficRefreshInterval: 60000,

    /*
       Tags IDFM que Cassandra ne doit pas considérer comme
       une perturbation du trafic RER : équipements / accessibilité.
    */
    ignoredTrafficTags: [
        "ascenseur",
        "escalator",
        "escalier",
        "accessibilite",
        "accessibilité",
        "toilettes",
        "guichet",
        "borne",
        "equipement",
        "équipement"
    ],


    /* =========================================================
       OUTILS
       ========================================================= */

    value: function(value) {

        if (Array.isArray(value) && value.length > 0) {
            return this.value(value[0]);
        }

        if (
            value &&
            typeof value === "object" &&
            value.value !== undefined
        ) {
            return value.value;
        }

        return value;
    },


    text: function(value) {

        value = this.value(value);

        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }

        return String(value).trim();
    },


    /* =========================================================
       RÉCUPÉRATION DES DÉPARTS
       ========================================================= */

    getDepartures: function(callback) {

        if (!this.enabled) {
            callback([], null);
            return;
        }

        if (
            !this.apiKey ||
            this.apiKey === "YOUR_NEW_IDFM_API_KEY"
        ) {
            console.error(
                "[IDFM] Clé API absente."
            );

            callback([], "NO_API_KEY");
            return;
        }

        var url =
            this.baseUrl +
            "/stop-monitoring" +
            "?MonitoringRef=" +
            encodeURIComponent(this.monitoringRef) +
            "&LineRef=" +
            encodeURIComponent(this.lineRef);


        console.info(
            "[IDFM] Requête départs :",
            url
        );


        externalAPI.get(
            url,
            {
                timeout: 8000,

                headers: {
                    "apikey": this.apiKey,
                    "Accept": "application/json"
                }
            },

            function(data, error) {

                if (error) {

                    console.error(
                        "[IDFM] Erreur API départs :",
                        error
                    );

                    callback([], error);
                    return;
                }


                console.info(
                    "[IDFM] Réponse brute reçue :",
                    data
                );


                var departures =
                    idfm.normalizeDepartures(data);


                console.info(
                    "[IDFM] Départs direction Paris retenus :",
                    departures.length
                );


                console.table(
                    departures.map(function(item) {
                        return {
                            destination: item.destination,
                            mission: item.mission,
                            type: item.trainType,
                            departure: item.departure,
                            platform: item.platform,
                            status: item.statusLabel,
                            delayMinutes: item.delayMinutes
                        };
                    })
                );


                callback(
                    departures,
                    null
                );
            }
        );
    },


    /* =========================================================
       RÉCUPÉRATION DES INFORMATIONS TRAFIC
       ========================================================= */

    getTrafficInfo: function(callback) {

        if (typeof callback !== "function") {
            return;
        }

        if (!this.enabled) {
            callback(null, "DISABLED");
            return;
        }

        if (
            !this.apiKey ||
            this.apiKey === "YOUR_NEW_IDFM_API_KEY"
        ) {
            callback(null, "NO_API_KEY");
            return;
        }

        /*
           Endpoint line_reports IDFM / Navitia.
           On interroge directement la ligne RER A.
        */
        var lineUri =
            "line%3AIDFM%3AC01742";

        var url =
            this.baseUrl +
            "/v2/navitia/line_reports/lines/" +
            lineUri +
            "/line_reports?count=100&language=fr-FR";

        console.info(
            "[IDFM] Récupération des informations trafic :",
            url
        );

        externalAPI.get(
            url,
            {
                timeout: 8000,
                headers: {
                    "apikey": this.apiKey,
                    "Accept": "application/json"
                }
            },
            function(data, error) {

                if (error) {
                    console.error(
                        "[IDFM] Erreur informations trafic :",
                        error
                    );

                    callback(null, error);
                    return;
                }

                var traffic =
                    idfm.normalizeTraffic(data);

                console.info(
                    "[IDFM] Perturbations trafic retenues :",
                    traffic.length
                );

                console.table(traffic);

                callback(traffic, null);
            }
        );
    },


    /* =========================================================
       NORMALISATION DES INFORMATIONS TRAFIC
       ========================================================= */

    normalizeTraffic: function(data) {

        var result = [];

        if (
            !data ||
            !Array.isArray(data.disruptions)
        ) {
            return result;
        }

        var now = new Date();

        for (
            var i = 0;
            i < data.disruptions.length;
            i++
        ) {

            var disruption =
                data.disruptions[i];

            if (!disruption) {
                continue;
            }

            /* -----------------------------------------
               UNIQUEMENT LES PERTURBATIONS ACTIVES
               ----------------------------------------- */

            if (
                disruption.status &&
                String(disruption.status).toLowerCase() !== "active"
            ) {
                continue;
            }

            if (!idfm.isTrafficDisruptionCurrentlyActive(disruption, now)) {
                continue;
            }

            /* -----------------------------------------
               EXCLUSION DES PANNES D'ÉQUIPEMENTS
               ----------------------------------------- */

            if (this.isIgnoredTrafficDisruption(disruption)) {
                console.info(
                    "[IDFM] Info gare/équipement ignorée :",
                    this.getTrafficText(disruption)
                );
                continue;
            }

            var message =
                this.getTrafficText(disruption);

            if (!message) {
                message = "Perturbation sur le RER A";
            }

            var severity =
                disruption.severity || {};

            result.push({
                message: message,
                category: this.text(disruption.category),
                cause: this.text(disruption.cause),
                severity: this.text(severity.name),
                effect: this.text(severity.effect),
                priority: Number(severity.priority) || 0,
                updatedAt: this.text(disruption.updated_at),
                id: this.text(disruption.id)
            });
        }

        /*
           Les perturbations les plus importantes passent
           en premier.
        */
        result.sort(function(a, b) {
            return b.priority - a.priority;
        });

        return result;
    },


    /* =========================================================
       VÉRIFICATION DE LA PÉRIODE DE VALIDITÉ
       ========================================================= */

    isTrafficDisruptionCurrentlyActive: function(disruption, now) {

        var periods =
            disruption.application_periods ||
            disruption.applicationPeriods;

        if (!Array.isArray(periods) || !periods.length) {
            return true;
        }

        var nowMs = now.getTime();

        for (
            var i = 0;
            i < periods.length;
            i++
        ) {

            var begin =
                this.parseIDFMDate(periods[i].begin);

            var end =
                this.parseIDFMDate(periods[i].end);

            if (
                (begin === null || nowMs >= begin) &&
                (end === null || nowMs <= end)
            ) {
                return true;
            }
        }

        return false;
    },


    parseIDFMDate: function(value) {

        if (!value) {
            return null;
        }

        var text = String(value).trim();

        /* Format IDFM : YYYYMMDDTHHMMSS */
        var match =
            text.match(/^(\\d{4})(\\d{2})(\\d{2})T(\\d{2})(\\d{2})(\\d{2})$/);

        if (!match) {
            return null;
        }

        var date = new Date(
            Number(match[1]),
            Number(match[2]) - 1,
            Number(match[3]),
            Number(match[4]),
            Number(match[5]),
            Number(match[6])
        );

        return isNaN(date.getTime())
            ? null
            : date.getTime();
    },


    /* =========================================================
       DÉTECTION DES INFOS À IGNORER
       ========================================================= */

    isIgnoredTrafficDisruption: function(disruption) {

        var tags =
            Array.isArray(disruption.tags)
                ? disruption.tags
                : [];

        for (
            var i = 0;
            i < tags.length;
            i++
        ) {

            var tag =
                this.normalizeTrafficText(tags[i]);

            for (
                var j = 0;
                j < this.ignoredTrafficTags.length;
                j++
            ) {

                if (
                    tag ===
                    this.normalizeTrafficText(
                        this.ignoredTrafficTags[j]
                    )
                ) {
                    return true;
                }
            }
        }

        /*
           Sécurité supplémentaire : certains flux peuvent
           ne pas renseigner le tag mais contenir clairement
           une panne d'équipement dans le titre/message.
        */
        var text =
            this.normalizeTrafficText(
                this.getTrafficText(disruption)
            );

        var ignoredWords = [
            "panne de l'ascenseur",
            "panne d'un ascenseur",
            "panne ascenseur",
            "ascenseur en panne",
            "escalator en panne",
            "escalator",
            "escalier mecanique",
            "accessibilite"
        ];

        for (
            var k = 0;
            k < ignoredWords.length;
            k++
        ) {
            if (
                text.indexOf(
                    this.normalizeTrafficText(ignoredWords[k])
                ) !== -1
            ) {
                return true;
            }
        }

        return false;
    },


    normalizeTrafficText: function(value) {

        return String(value || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\\u0300-\\u036f]/g, "")
            .trim();
    },


    /* =========================================================
       TEXTE À AFFICHER
       ========================================================= */

    getTrafficText: function(disruption) {

        var messages =
            Array.isArray(disruption.messages)
                ? disruption.messages
                : [];

        var title = "";
        var webMessage = "";
        var firstMessage = "";

        for (
            var i = 0;
            i < messages.length;
            i++
        ) {

            var message = messages[i];
            var text = this.text(message.text);

            if (!text) {
                continue;
            }

            if (!firstMessage) {
                firstMessage = text;
            }

            var channel =
                message.channel || {};

            var channelTypes =
                Array.isArray(channel.types)
                    ? channel.types
                    : [];

            if (channelTypes.indexOf("title") !== -1) {
                title = text;
            }

            if (channelTypes.indexOf("web") !== -1) {
                webMessage = text;
            }
        }

        var result =
            webMessage ||
            title ||
            firstMessage;

        /*
           Nettoyage léger des espaces insérés par IDFM.
        */
        return result
            .replace(/\\s+/g, " ")
            .trim();
    },


    /* =========================================================
       NORMALISATION DES DÉPARTS
       ========================================================= */

    normalizeDepartures: function(data) {

        var result = [];

        if (!data) {
            return result;
        }


        var siri =
            data.Siri ||
            data.siri ||
            data;


        var serviceDelivery =
            siri.ServiceDelivery ||
            siri.serviceDelivery ||
            siri;


        var deliveries =
            serviceDelivery.StopMonitoringDelivery ||
            serviceDelivery.stopMonitoringDelivery;


        if (!deliveries) {

            console.warn(
                "[IDFM] Aucune donnée StopMonitoringDelivery."
            );

            return result;
        }


        if (!Array.isArray(deliveries)) {
            deliveries = [deliveries];
        }


        for (
            var d = 0;
            d < deliveries.length;
            d++
        ) {

            var visits =
                deliveries[d].MonitoredStopVisit ||
                deliveries[d].monitoredStopVisit;


            if (!visits) {
                continue;
            }


            if (!Array.isArray(visits)) {
                visits = [visits];
            }


            for (
                var i = 0;
                i < visits.length;
                i++
            ) {

                var visit = visits[i];

                if (!visit) {
                    continue;
                }


                var journey =
                    visit.MonitoredVehicleJourney ||
                    visit.monitoredVehicleJourney;


                if (!journey) {
                    continue;
                }


                /* -----------------------------------------
                   RER A uniquement
                   ----------------------------------------- */

                var returnedLine =
                    this.text(journey.LineRef);

                if (
                    returnedLine &&
                    returnedLine !== this.lineRef
                ) {
                    continue;
                }


                var call =
                    journey.MonitoredCall ||
                    journey.monitoredCall;


                if (!call) {
                    continue;
                }


                /* -----------------------------------------
                   HEURE
                   ----------------------------------------- */

                var expectedRaw =
                    call.ExpectedDepartureTime ||
                    call.expectedDepartureTime ||
                    call.DepartureTime ||
                    call.departureTime;

                if (!expectedRaw) {
                    continue;
                }


                var departureDate =
                    new Date(expectedRaw);


                if (
                    isNaN(
                        departureDate.getTime()
                    )
                ) {
                    continue;
                }


                if (
                    departureDate.getTime() <
                    Date.now() - 30000
                ) {
                    continue;
                }


                /* -----------------------------------------
                   DESTINATION
                   ----------------------------------------- */

                var destination =
                    this.text(
                        call.DestinationDisplay
                    );


                if (!destination) {
                    destination =
                        this.text(
                            journey.DestinationName
                        );
                }


                /*
                   À Sucy-Bonneuil, on veut le sens Paris.

                   Les terminus est à exclure :
                   - Boissy-Saint-Léger
                   - Marne-la-Vallée Chessy

                   Les destinations comme Cergy, Poissy
                   ou Saint-Germain-en-Laye correspondent
                   au sens ouest / Paris.
                */

                var destinationUpper =
                    destination.toUpperCase();

                if (
                    destinationUpper.indexOf(
                        "BOISSY-SAINT-LÉGER"
                    ) !== -1 ||
                    destinationUpper.indexOf(
                        "BOISSY-SAINT-LEGER"
                    ) !== -1 ||
                    destinationUpper.indexOf(
                        "MARNE-LA-VALLÉE"
                    ) !== -1 ||
                    destinationUpper.indexOf(
                        "MARNE-LA-VALLEE"
                    ) !== -1
                ) {

                    console.info(
                        "[IDFM] Départ est ignoré :",
                        destination
                    );

                    continue;
                }


                /* -----------------------------------------
                   MISSION
                   ----------------------------------------- */

                var mission =
                    this.text(
                        journey.VehicleJourneyName
                    );


                /*
                   Certains flux peuvent aussi utiliser
                   JourneyNote. On ne l'utilise qu'en
                   secours si VehicleJourneyName est vide.
                */

                if (!mission) {
                    mission =
                        this.text(
                            journey.JourneyNote
                        );
                }


                /* -----------------------------------------
                   TYPE DE TRAIN
                   ----------------------------------------- */

                var features =
                    journey.VehicleFeatureRef;


                if (!Array.isArray(features)) {
                    features = features
                        ? [features]
                        : [];
                }


                var trainType =
                    "Train";


                for (
                    var f = 0;
                    f < features.length;
                    f++
                ) {

                    var feature =
                        this.text(features[f])
                            .toLowerCase();


                    if (
                        feature === "longtrain" ||
                        feature === "long_train"
                    ) {
                        trainType = "Train long";
                        break;
                    }


                    if (
                        feature === "shorttrain" ||
                        feature === "short_train"
                    ) {
                        trainType = "Train court";
                        break;
                    }
                }


                /* -----------------------------------------
                   RETARD
                   ----------------------------------------- */

                var aimedRaw =
                    call.AimedDepartureTime ||
                    call.aimedDepartureTime;


                var expectedMs =
                    departureDate.getTime();


                var aimedMs = null;


                if (aimedRaw) {

                    var aimedDate =
                        new Date(aimedRaw);

                    if (
                        !isNaN(
                            aimedDate.getTime()
                        )
                    ) {
                        aimedMs =
                            aimedDate.getTime();
                    }
                }


                var delayMinutes = 0;


                if (aimedMs !== null) {

                    delayMinutes =
                        Math.round(
                            (
                                expectedMs -
                                aimedMs
                            ) / 60000
                        );
                }


                var rawStatus =
                    this.text(
                        call.DepartureStatus
                    ).toUpperCase();


                var statusLabel =
                    "À L'HEURE";


                if (
                    rawStatus === "CANCELLED" ||
                    rawStatus === "CANCELED"
                ) {
                    statusLabel =
                        "SUPPRIMÉ";
                }
                else if (
                    delayMinutes > 0
                ) {
                    statusLabel =
                        "RETARD " +
                        delayMinutes +
                        " MIN";
                }
                else if (
                    delayMinutes < 0
                ) {
                    statusLabel =
                        "AVANCE " +
                        Math.abs(delayMinutes) +
                        " MIN";
                }
                else if (
                    rawStatus === "DELAYED"
                ) {
                    statusLabel =
                        "RETARD";
                }


                /* -----------------------------------------
                   VOIE
                   -----------------------------------------

                   IMPORTANT :
                   ExpectedQuayRef = identifiant technique
                   du StopPoint.

                   DeparturePlatformName = numéro de voie
                   réellement affichable.
                */

                var platform =
                    this.text(
                        call.DeparturePlatformName
                    );


                if (!platform) {
                    platform = "-";
                }


                /* -----------------------------------------
                   TRAIN À QUAI / APPROCHE
                   ----------------------------------------- */

                var vehicleAtStop =
                    call.VehicleAtStop === true ||
                    call.vehicleAtStop === true;


                /* -----------------------------------------
                   OBJET NORMALISÉ
                   ----------------------------------------- */

                result.push({

                    line: "A",

                    destination:
                        destination || "Paris",

                    mission:
                        mission || "—",

                    trainType:
                        trainType,

                    departure:
                        departureDate,

                    departureStatus:
                        rawStatus,

                    statusLabel:
                        statusLabel,

                    delayMinutes:
                        delayMinutes,

                    platform:
                        platform,

                    vehicleAtStop:
                        vehicleAtStop
                });
            }
        }


        /* =========================================
           TRI
           ========================================= */

        result.sort(
            function(a, b) {

                return (
                    a.departure.getTime() -
                    b.departure.getTime()
                );
            }
        );


        /* =========================================
           DOUBLONS
           ========================================= */

        var unique = [];
        var keys = {};


        result.forEach(
            function(item) {

                var key =
                    item.departure.getTime() +
                    "|" +
                    item.destination +
                    "|" +
                    item.mission;


                if (!keys[key]) {

                    keys[key] = true;

                    unique.push(item);
                }
            }
        );


        return unique.slice(
            0,
            this.departuresCount
        );
    }
};


/* =========================================================
   TIMER DÉPARTS + TRAFIC
   ========================================================= */

var idfmTimer = null;
var idfmTrafficTimer = null;


function refreshIDFMTraffic() {

    idfm.getTrafficInfo(
        function(traffic, error) {

            if (error) {
                updateTransportTrafficError(error);
                return;
            }

            updateTransportTraffic(traffic);
        }
    );
}


function startIDFM() {

    if (!idfm.enabled) {
        console.info(
            "[IDFM] Requêtes désactivées."
        );
        return;
    }

    if (idfmTimer) {
        console.info(
            "[IDFM] Rafraîchissement départs déjà actif."
        );
    }
    else {

        function refresh() {

            idfm.getDepartures(
                function(
                    departures,
                    error
                ) {

                    if (error) {
                        updateTransportError(error);
                        return;
                    }

                    updateTransportScreen(departures);
                }
            );
        }

        refresh();

        idfmTimer =
            setInterval(
                refresh,
                idfm.refreshInterval
            );

        console.info(
            "[IDFM] Rafraîchissement départs toutes les",
            idfm.refreshInterval / 1000,
            "secondes."
        );
    }

    /*
       Premier appel trafic immédiat, puis toutes les 60 s.
    */
    if (!idfmTrafficTimer) {

        refreshIDFMTraffic();

        idfmTrafficTimer =
            setInterval(
                refreshIDFMTraffic,
                idfm.trafficRefreshInterval
            );

        console.info(
            "[IDFM] Rafraîchissement trafic toutes les",
            idfm.trafficRefreshInterval / 1000,
            "secondes."
        );
    }
}


function stopIDFM() {

    if (idfmTimer) {
        clearInterval(idfmTimer);
        idfmTimer = null;
    }

    if (idfmTrafficTimer) {
        clearInterval(idfmTrafficTimer);
        idfmTrafficTimer = null;
    }

    console.info(
        "[IDFM] Rafraîchissements arrêtés."
    );
}
