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
        actions futures
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
        Heure du dernier mouvement détecté.

        Permet de déterminer si une absence
        correspond réellement à un départ.
    */

    lastPresenceDetected: 0,

    /*
        Timer utilisé pour confirmer un départ.
    */

    departureTimer: null,

    musicPlaying: null,
    previousMusicPlaying: null,

    airQuality: null,
    temperature: null,
    brightness: null,
    co2: null,

    /*
        Permet d'éviter plusieurs réactions
        simultanées.
    */

    reactionRunning: false,

    /*
        Évite de déclencher plusieurs fois
        la même réaction.
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

    doorCooldown: 10000,

    musicCooldown: 15000,

    environmentCooldown: 30000,


    /*
        Délai avant confirmation d'un départ.

        Si aucun mouvement n'est détecté
        pendant cette durée, Cassandra considère
        que la personne est probablement partie.
    */

    disappearanceDelay: 10000,


    /*
        Durée des regards.
    */

    lookDuration: 2500,

    shortLookDuration: 1500,


    /*
        Seuils environnementaux.

        Ils pourront être ajustés plus tard.
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
   ANNULATION DU DÉPART
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


/* =========================================
   CONFIRMATION DU DÉPART
   ========================================= */

function scheduleDepartureCheck() {

    /*
        Un ancien timer ne doit jamais
        rester actif.
    */

    cancelDepartureTimer();


    behaviorState.departureTimer =
        setTimeout(function() {

            behaviorState.departureTimer =
                null;


            /*
                Si un mouvement a été détecté
                entre-temps, le départ est annulé.
            */

            if (
                behaviorState.roomPresence === true
            ) {
                return;
            }


            /*
                Cassandra disparaît uniquement
                après confirmation de l'absence.
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
            On vient de détecter quelqu'un.

            Le départ potentiel est donc annulé.
        */

        cancelDepartureTimer();


        /*
            On mémorise le dernier mouvement.
        */

        behaviorState.lastPresenceDetected =
            behaviorNow();


        /*
            Cassandra doit être présente.

            Si elle était cachée, elle réapparaît.
        */

        showCassandra();


        /*
            Réaction d'accueil uniquement lors
            d'un véritable retour.

            On conserve le cooldown.
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
            Petite réaction d'accueil.

            On laisse d'abord Cassandra
            apparaître avant d'agir.
        */

        setTimeout(function() {

            if (
                behaviorState.roomPresence !== true
            ) {
                return;
            }


            /*
                Regard neutre.
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
        On ne fait PAS disparaître Cassandra
        immédiatement.

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
        =====================================
        RÉACTION VISUELLE À LA PORTE
        =====================================

        Chaque changement d'état de la porte
        fait regarder Cassandra vers la droite.

        Cela fonctionne aussi bien pour :

            fermé → ouvert

        que :

            ouvert → fermé
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
        Si Cassandra est cachée, elle ne peut
        évidemment pas regarder.
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


    /*
        =====================================
        PORTE OUVERTE
        =====================================

        Une porte ouverte rend l'interprétation
        de l'absence de mouvement plus intéressante.

        Mais on ne fait pas disparaître Cassandra
        immédiatement.

        Le timer de présence reste la source
        principale de confirmation du départ.
    */

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

        /*
            Regard vers la gauche.
        */

        look(
            "left",
            behaviorConfig.shortLookDuration
        );


        return;
    }


    /*
        MUSIQUE ARRÊTÉE

        Aucun mouvement obligatoire.
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


    /*
        Forte lumière.

        Cassandra regarde légèrement vers le bas.
    */

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
            on ne déclenche aucune disparition.

            Cassandra conserve son état actuel.
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
                Si un mouvement est déjà détecté
                au démarrage, on mémorise l'heure.
            */

            if (
                roomPresence === true
            ) {

                behaviorState.lastPresenceDetected =
                    behaviorNow();

            }


        } else {


            /*
                Changement de présence.
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
                Même sans changement d'état,
                un nouveau mouvement détecté
                doit annuler un éventuel départ.
            */

            if (
                roomPresence === true
            ) {

                cancelDepartureTimer();

                behaviorState.lastPresenceDetected =
                    behaviorNow();

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
                Ne réagit pas au premier état reçu.

                On veut uniquement réagir à un
                changement réel.
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
                Ne réagit pas au premier état reçu.
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

    /*
        Si un timer de départ existe,
        on le supprime.
    */

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

}