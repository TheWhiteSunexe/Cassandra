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
        Délai avant disparition.

        Cela évite qu'un bref OFF du capteur
        fasse immédiatement disparaître Cassandra.
    */

    disappearanceDelay: 3000,


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
   PRÉSENCE
   ========================================= */

function behaviorPresenceChanged(present) {

    /*
        =====================================
        PERSONNE PRÉSENTE
        =====================================
    */

    if (present === true) {

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
            Cassandra apparaît.
        */

        showCassandra();


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

                C'est une réaction à la présence,
                PAS une émotion aléatoire.
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
        PERSONNE ABSENTE
        =====================================
    */

    setTimeout(function() {

        /*
            Vérifie que la personne n'est pas
            revenue pendant le délai.
        */

        if (
            behaviorState.roomPresence === false
        ) {

            hideCassandra();

        }

    }, behaviorConfig.disappearanceDelay);

}


/* =========================================
   PORTE
   ========================================= */

function behaviorDoorChanged(door) {

    if (
        behaviorState.roomPresence !== true
    ) {
        return;
    }


    if (!door) {
        return;
    }


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
        PORTE OUVERTE
    */

    if (door === "open") {

        /*
            La porte se trouve à droite
            dans notre représentation actuelle.

            À modifier facilement si besoin.
        */

        look(
            "right",
            behaviorConfig.lookDuration
        );

        return;
    }


    /*
        PORTE FERMÉE

        Pas de réaction particulière pour
        le moment.
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
            Pour l'instant :

            regard vers la gauche.

            On pourra plus tard décider que
            Cassandra réagit différemment selon
            l'artiste, le morceau, etc.
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

        On ne force pas une expression juste
        parce que la musique s'arrête.
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


    /*
        Mauvaise qualité de l'air.

        Expression uniquement parce qu'un
        événement environnemental pertinent
        vient de se produire.
    */

    if (
        typeof playExpression === "function"
    ) {

        if (
            typeof co2 === "number" &&
            co2 >= behaviorConfig.veryHighCO2
        ) {

            playExpression("disgust");

        } else {

            playExpression("disgust");

        }
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
                Si Cassandra démarre alors que
                personne n'est présent :

                background seul.
            */

            if (
                roomPresence === false
            ) {

                hideCassandra();

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


        /*
            Ces fonctions ne sont appelées
            que lorsqu'une condition pertinente
            est rencontrée.
        */

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

    behaviorState.musicPlaying =
        null;

    behaviorState.previousMusicPlaying =
        null;

}