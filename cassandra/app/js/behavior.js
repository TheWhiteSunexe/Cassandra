/* =========================================
   CASSANDRA - BEHAVIOR ENGINE
   ========================================= */

/*
    Le Behavior est le cerveau de Cassandra.

    Il reçoit les données provenant de
    Home Assistant et décide des actions.

    IMPORTANT :

    Behavior est le SEUL module autorisé à
    déclencher des mouvements ou expressions
    en réaction aux événements.

    Les automatismes naturels restent séparés :

        blink()
        breathe()

    Behavior peut déclencher :

        look()
        playExpression()
        hideCassandra()
        showCassandra()

    Behavior ne manipule JAMAIS directement
    les images.
*/


/* =========================================
   ÉTAT
   ========================================= */

var behaviorState = {

    initialized: false,

    roomPresence: null,
    previousRoomPresence: null,

    door: null,
    previousDoor: null,

    /*
        Dernier instant où un mouvement
        a été réellement détecté.
    */

    lastPresenceDetected: 0,

    /*
        Timer de confirmation de départ.
    */

    departureTimer: null,

    musicPlaying: null,
    previousMusicPlaying: null,

    airQuality: null,
    temperature: null,
    brightness: null,
    co2: null,

    /*
        Dernières réactions.
    */

    lastPresenceReaction: 0,
    lastDoorReaction: 0,
    lastMusicReaction: 0,
    lastEnvironmentReaction: 0

};


/* =========================================
   PARAMÈTRES
   ========================================= */

var behaviorConfig = {

    /*
        Temps minimum entre deux réactions
        du même type.
    */

    presenceCooldown: 5000,

    doorCooldown: 3000,

    musicCooldown: 15000,

    environmentCooldown: 30000,


    /*
        Temps sans mouvement nécessaire
        avant de considérer que la personne
        est réellement partie.

        10 secondes est un bon point de départ.
    */

    disappearanceDelay: 10000,


    /*
        Durée des regards.
    */

    lookDuration: 2500,

    shortLookDuration: 1500,


    /*
        Seuils environnementaux.
    */

    highCO2: 1200,

    veryHighCO2: 1800,

    highTemperature: 28,

    lowTemperature: 16,

    highBrightness: 500

};


/* =========================================
   UTILITAIRES
   ========================================= */

function behaviorNow() {

    return Date.now();

}


function behaviorCooldown(lastTime, cooldown) {

    return (
        behaviorNow() - lastTime >= cooldown
    );

}


/* =========================================
   DÉPART
   ========================================= */

function cancelDepartureTimer() {

    if (
        behaviorState.departureTimer !== null
    ) {

        clearTimeout(
            behaviorState.departureTimer
        );

        behaviorState.departureTimer =
            null;
    }

}


function scheduleDepartureCheck() {

    /*
        Toujours annuler l'ancien timer
        avant d'en créer un nouveau.
    */

    cancelDepartureTimer();


    behaviorState.departureTimer =
        setTimeout(function() {

            behaviorState.departureTimer =
                null;


            /*
                Un mouvement est revenu.

                Le départ est annulé.
            */

            if (
                behaviorState.roomPresence === true
            ) {
                return;
            }


            /*
                Toujours aucune présence.

                Le départ est confirmé.
            */

            hideCassandra();

        }, behaviorConfig.disappearanceDelay);

}


/* =========================================
   PRÉSENCE
   ========================================= */

function behaviorPresenceChanged(present) {

    /*
        =====================================
        MOUVEMENT DÉTECTÉ
        =====================================
    */

    if (present === true) {

        /*
            Le dernier mouvement est maintenant
            connu.
        */

        behaviorState.lastPresenceDetected =
            behaviorNow();


        /*
            Très important :

            si un départ était en préparation,
            il est annulé.
        */

        cancelDepartureTimer();


        /*
            Si Cassandra était cachée,
            elle doit réapparaître.

            mist.js gère le cas où une animation
            de brouillard est encore en cours.
        */

        showCassandra();


        /*
            Réaction d'accueil.

            Le cooldown évite qu'un simple
            retour après un court OFF déclenche
            plusieurs sourires.
        */

        if (
            !behaviorCooldown(
                behaviorState.lastPresenceReaction,
                behaviorConfig.presenceCooldown
            )
        ) {
            return;
        }


        behaviorState.lastPresenceReaction =
            behaviorNow();


        /*
            Petite séquence d'accueil.
        */

        setTimeout(function() {

            if (
                behaviorState.roomPresence !== true
            ) {
                return;
            }


            /*
                Retour au regard neutre.
            */

            setNormalEyes(1);


            /*
                Petit clignement.
            */

            setTimeout(function() {

                if (
                    behaviorState.roomPresence === true
                ) {

                    blink();

                }

            }, 700);


            /*
                Petit sourire.
            */

            setTimeout(function() {

                if (
                    behaviorState.roomPresence === true &&
                    typeof playExpression === "function"
                ) {

                    playExpression("smile");

                }

            }, 1200);

        }, 500);


        return;
    }


    /*
        =====================================
        PLUS DE MOUVEMENT
        =====================================
    */

    /*
        On ne cache PAS Cassandra immédiatement.

        On programme une vérification.
    */

    scheduleDepartureCheck();

}


/* =========================================
   PORTE
   ========================================= */

function behaviorDoorChanged(door) {

    if (!door) {
        return;
    }


    /*
        Chaque changement d'état de la porte
        provoque un regard vers la droite.

        Peu importe le sens :

            closed → open
            open → closed
    */

    if (
        !behaviorCooldown(
            behaviorState.lastDoorReaction,
            behaviorConfig.doorCooldown
        )
    ) {
        return;
    }


    behaviorState.lastDoorReaction =
        behaviorNow();


    /*
        Cassandra ne peut évidemment pas
        regarder si elle est cachée.
    */

    if (
        typeof cassandraHidden !== "undefined" &&
        cassandraHidden
    ) {
        return;
    }


    look(
        "right",
        behaviorConfig.lookDuration
    );

}


/* =========================================
   MUSIQUE
   ========================================= */

function behaviorMusicChanged(playing) {

    if (
        behaviorState.roomPresence !== true
    ) {
        return;
    }


    if (
        !behaviorCooldown(
            behaviorState.lastMusicReaction,
            behaviorConfig.musicCooldown
        )
    ) {
        return;
    }


    behaviorState.lastMusicReaction =
        behaviorNow();


    /*
        MUSIQUE DÉMARRÉE
    */

    if (playing === true) {

        look(
            "left",
            behaviorConfig.shortLookDuration
        );

        return;
    }


    /*
        MUSIQUE ARRÊTÉE :

        aucune réaction.
    */

}


/* =========================================
   QUALITÉ DE L'AIR
   ========================================= */

function behaviorAirQuality(
    airQuality,
    co2
) {

    if (
        behaviorState.roomPresence !== true
    ) {
        return;
    }


    var poorAir =
        airQuality === "poor" ||
        airQuality === "bad";


    var highCO2 =
        typeof co2 === "number" &&
        co2 >= behaviorConfig.highCO2;


    if (
        !poorAir &&
        !highCO2
    ) {
        return;
    }


    if (
        !behaviorCooldown(
            behaviorState.lastEnvironmentReaction,
            behaviorConfig.environmentCooldown
        )
    ) {
        return;
    }


    behaviorState.lastEnvironmentReaction =
        behaviorNow();


    if (
        typeof playExpression === "function"
    ) {

        playExpression("disgust");

    }

}


/* =========================================
   TEMPÉRATURE
   ========================================= */

function behaviorTemperature(temperature) {

    if (
        behaviorState.roomPresence !== true
    ) {
        return;
    }


    if (
        typeof temperature !== "number"
    ) {
        return;
    }


    /*
        TEMPÉRATURE ÉLEVÉE
    */

    if (
        temperature >=
        behaviorConfig.highTemperature
    ) {

        if (
            !behaviorCooldown(
                behaviorState.lastEnvironmentReaction,
                behaviorConfig.environmentCooldown
            )
        ) {
            return;
        }


        behaviorState.lastEnvironmentReaction =
            behaviorNow();


        if (
            typeof playExpression === "function"
        ) {

            playExpression("tired");

        }


        return;
    }


    /*
        TEMPÉRATURE BASSE
    */

    if (
        temperature <=
        behaviorConfig.lowTemperature
    ) {

        if (
            !behaviorCooldown(
                behaviorState.lastEnvironmentReaction,
                behaviorConfig.environmentCooldown
            )
        ) {
            return;
        }


        behaviorState.lastEnvironmentReaction =
            behaviorNow();


        if (
            typeof playExpression === "function"
        ) {

            playExpression("tired");

        }

    }

}


/* =========================================
   LUMINOSITÉ
   ========================================= */

function behaviorBrightness(brightness) {

    if (
        behaviorState.roomPresence !== true
    ) {
        return;
    }


    if (
        typeof brightness !== "number"
    ) {
        return;
    }


    if (
        brightness <
        behaviorConfig.highBrightness
    ) {
        return;
    }


    if (
        !behaviorCooldown(
            behaviorState.lastEnvironmentReaction,
            behaviorConfig.environmentCooldown
        )
    ) {
        return;
    }


    behaviorState.lastEnvironmentReaction =
        behaviorNow();


    look(
        "bottom",
        behaviorConfig.shortLookDuration
    );

}


/* =========================================
   TRAITEMENT PRINCIPAL
   ========================================= */

function updateBehavior(data) {

    if (!data) {
        return;
    }


    /* =====================================
       PRÉSENCE
       ===================================== */

    if (data.presence) {

        var roomPresence =
            data.presence.room;


        /*
            Premier état reçu.

            IMPORTANT :

            On initialise seulement l'état.
            On ne cache PAS Cassandra.

            Cela évite qu'un refresh alors que
            le capteur est OFF fasse disparaître
            Cassandra immédiatement.
        */

        if (
            !behaviorState.initialized
        ) {

            behaviorState.initialized =
                true;

            behaviorState.roomPresence =
                roomPresence;

            behaviorState.previousRoomPresence =
                roomPresence;


            /*
                Si quelqu'un est déjà présent
                au démarrage, on mémorise le
                dernier mouvement.
            */

            if (
                roomPresence === true
            ) {

                behaviorState.lastPresenceDetected =
                    behaviorNow();

            }

        } else {


            /*
                Changement réel de présence.
            */

            if (
                roomPresence !==
                behaviorState.roomPresence
            ) {

                behaviorState.previousRoomPresence =
                    behaviorState.roomPresence;

                behaviorState.roomPresence =
                    roomPresence;


                behaviorPresenceChanged(
                    roomPresence
                );

            }


            /*
                Chaque nouvelle détection de
                mouvement confirme que quelqu'un
                est encore là.

                Cela annule également un éventuel
                départ programmé.
            */

            if (
                roomPresence === true
            ) {

                behaviorState.lastPresenceDetected =
                    behaviorNow();

                cancelDepartureTimer();

            }

        }

    }


    /* =====================================
       PORTE
       ===================================== */

    if (data.room) {

        var door =
            data.room.door;


        if (
            door !== behaviorState.door
        ) {

            behaviorState.previousDoor =
                behaviorState.door;

            behaviorState.door =
                door;


            /*
                Ne réagit pas au premier état.
            */

            if (
                behaviorState.previousDoor !== null
            ) {

                behaviorDoorChanged(
                    door
                );

            }

        }

    }


    /* =====================================
       MUSIQUE
       ===================================== */

    if (data.media) {

        var musicPlaying =
            data.media.playing === true;


        if (
            musicPlaying !==
            behaviorState.musicPlaying
        ) {

            behaviorState.previousMusicPlaying =
                behaviorState.musicPlaying;

            behaviorState.musicPlaying =
                musicPlaying;


            /*
                Ne réagit pas au premier état.
            */

            if (
                behaviorState.previousMusicPlaying !== null
            ) {

                behaviorMusicChanged(
                    musicPlaying
                );

            }

        }

    }


    /* =====================================
       ENVIRONNEMENT
       ===================================== */

    if (data.environment) {

        var airQuality =
            data.environment.airQuality;

        var co2 =
            data.environment.co2;

        var temperature =
            data.environment.temperature;

        var brightness =
            data.environment.brightness;


        behaviorState.airQuality =
            airQuality;

        behaviorState.co2 =
            co2;

        behaviorState.temperature =
            temperature;

        behaviorState.brightness =
            brightness;


        behaviorAirQuality(
            airQuality,
            co2
        );

        behaviorTemperature(
            temperature
        );

        behaviorBrightness(
            brightness
        );

    }

}


/* =========================================
   INITIALISATION
   ========================================= */

function initBehavior() {

    cancelDepartureTimer();


    behaviorState.initialized =
        false;

    behaviorState.roomPresence =
        null;

    behaviorState.previousRoomPresence =
        null;

    behaviorState.door =
        null;

    behaviorState.previousDoor =
        null;

    behaviorState.lastPresenceDetected =
        0;

    behaviorState.departureTimer =
        null;

    behaviorState.musicPlaying =
        null;

    behaviorState.previousMusicPlaying =
        null;

    behaviorState.airQuality =
        null;

    behaviorState.temperature =
        null;

    behaviorState.brightness =
        null;

    behaviorState.co2 =
        null;

    behaviorState.lastPresenceReaction =
        0;

    behaviorState.lastDoorReaction =
        0;

    behaviorState.lastMusicReaction =
        0;

    behaviorState.lastEnvironmentReaction =
        0;

}
