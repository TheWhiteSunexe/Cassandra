/* =========================================
   ÎLE-DE-FRANCE MOBILITÉS
   ========================================= */

var idfm = {

    /*
        Clé PRIM.
        ATTENTION : exécutée côté navigateur,
        elle est donc visible côté client.
    */
    apiKey: "o7QeUF0SXsYaqmI3m2QwBiLQlz8MfDvn",

    baseUrl:
        "https://prim.iledefrance-mobilites.fr/marketplace",

    /*
        Gare de Sucy - Bonneuil
        Point d'arrêt IDFM : 412803
    */
    monitoringRef:
        "STIF:StopPoint:Q:412803:",

    /*
        RER A
    */
    lineRef:
        "STIF:Line::C01742:",

    refreshInterval: 15000,

    departuresCount: 5,


    getDepartures: function(callback) {

        var url =
            this.baseUrl +
            "/stop-monitoring/" +
            encodeURIComponent(
                this.monitoringRef
            );

        externalAPI.get(
            url,
            {
                timeout: 8000,

                headers: {
                    "apikey":
                        this.apiKey,

                    "Accept":
                        "application/json"
                }
            },

            function(data, error) {

                if (error) {

                    console.error(
                        "[IDFM] Erreur :",
                        error
                    );

                    callback(
                        null,
                        error
                    );

                    return;
                }

                callback(
                    idfm.normalizeDepartures(
                        data
                    ),
                    null
                );
            }
        );
    },


    value: function(value) {

        if (
            Array.isArray(value) &&
            value.length > 0
        ) {
            return this.value(
                value[0]
            );
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

        value =
            this.value(value);

        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }

        return String(value).trim();
    },


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

                var visit =
                    visits[i];

                var journey =
                    visit.MonitoredVehicleJourney ||
                    visit.monitoredVehicleJourney;

                if (!journey) {
                    continue;
                }

                /*
                    L'arrêt peut être multi-lignes.
                    On garde uniquement le RER A.
                */
                var returnedLine =
                    this.text(
                        journey.LineRef
                    );

                if (
                    returnedLine &&
                    returnedLine !==
                        this.lineRef
                ) {
                    continue;
                }

                var call =
                    journey.MonitoredCall ||
                    journey.monitoredCall;

                if (!call) {
                    continue;
                }

                var departureRaw =
                    call.ExpectedDepartureTime ||
                    call.expectedDepartureTime ||
                    call.DepartureTime ||
                    call.departureTime ||
                    call.ExpectedArrivalTime ||
                    call.expectedArrivalTime;

                if (!departureRaw) {
                    continue;
                }

                var date =
                    new Date(
                        departureRaw
                    );

                if (
                    isNaN(
                        date.getTime()
                    )
                ) {
                    continue;
                }

                if (
                    date.getTime() <
                    Date.now() - 30000
                ) {
                    continue;
                }

                var destination =
                    this.text(
                        call.DestinationDisplay
                    );

                if (!destination) {
                    destination =
                        this.text(
                            journey.DirectionName
                        );
                }

                if (!destination) {
                    destination = "Paris";
                }

                var direction =
                    this.text(
                        journey.DirectionName
                    );

                var status =
                    this.text(
                        call.DepartureStatus
                    ) ||
                    "onTime";

                var journeyRef = "";

                if (
                    journey.FramedVehicleJourneyRef
                ) {
                    journeyRef =
                        this.text(
                            journey
                                .FramedVehicleJourneyRef
                                .DatedVehicleJourneyRef
                        );
                }

                result.push({

                    line: "A",

                    destination:
                        destination,

                    direction:
                        direction,

                    departure:
                        date,

                    departureStatus:
                        status,

                    journey:
                        journeyRef,

                    vehicleAtStop:
                        call.VehicleAtStop === true ||
                        call.vehicleAtStop === true,

                    /*
                        L'API ne garantit pas une voie
                        dans cette réponse.
                    */
                    platform: "-"
                });
            }
        }

        result.sort(function(a, b) {

            return (
                a.departure.getTime() -
                b.departure.getTime()
            );
        });

        var unique = [];

        result.forEach(function(item) {

            var key =
                item.departure.getTime() +
                "|" +
                item.destination;

            var exists =
                unique.some(
                    function(existing) {
                        return (
                            existing._key ===
                            key
                        );
                    }
                );

            if (!exists) {

                item._key = key;

                unique.push(
                    item
                );
            }
        });

        return unique
            .slice(
                0,
                this.departuresCount
            )
            .map(function(item) {

                delete item._key;

                return item;
            });
    }
};


var idfmTimer = null;


function startIDFM() {

    if (idfmTimer) {
        return;
    }

    function refresh() {

        idfm.getDepartures(
            function(
                departures,
                error
            ) {

                if (error) {

                    updateTransportError(
                        error
                    );

                    return;
                }

                updateTransportScreen(
                    departures
                );
            }
        );
    }

    refresh();

    idfmTimer =
        setInterval(
            refresh,
            idfm.refreshInterval
        );
}
