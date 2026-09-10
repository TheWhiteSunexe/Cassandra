/* =========================================
   CASSANDRA - BEHAVIOR ENGINE
   ========================================= */

/*
    Le behavior est le cerveau de Cassandra.

    Il reçoit l'état abstrait provenant de
    Home Assistant et décide de ce que
    Cassandra doit faire.

    Il ne manipule jamais directement les images.

    Il appelle uniquement les fonctions :

        blink()
        look()
        smile()
        playExpression()
        hideCassandra()
        showCassandra()
        etc.
*/


/* =========================================
   ÉTAT DU COMPORTEMENT
   ========================================= */

var behaviorState = {

    initialized: false,

    roomPresence: null,

    previousRoomPresence: null,

    door: null,
    previousDoor: null,

    musicPlaying: false,
    previousMusicPlaying: false,

    airQuality: null,
    temperature: null,
    brightness: null,

    lastReaction: null,

    reactionRunning: false,

    lastPresenceReaction: 0,
    lastDoorReaction: 0,
    lastMusicReaction: 0,
    lastEnvironmentReaction: 0
};


/* =========================================
   PARAMÈTRES DU COMPORTEMENT
   ========================================= */

var behaviorConfig = {

    /*
        Temps minimum entre certaines réactions.
        Évite que Cassandra réagisse en boucle.
    */

    presenceReactionCooldown: 10000,

    doorReactionCooldown: 15000,

    musicReactionCooldown: 20000,

    environmentReactionCooldown: 30000,


    /*
        Après combien de temps sans présence
        on considère que Cassandra doit disparaître.

        Pour le moment la détection HA fait déjà
        la distinction on/off.
    */

    disappearanceDelay: 3000,


    /*
        Durée approximative des réactions.
    */

    shortReactionDuration: 1500,

    normalReactionDuration: 3000,


    /*
        Probabilité de petits comportements
        spontanés.

        0.20 = 20%.
    */

    spontaneousReactionChance: 0.20,

    spontaneousMinDelay: 12000,

    spontaneousMaxDelay: 30000
};


/* =========================================
   UTILITAIRES
   ========================================= */

function behaviorNow() {

    return Date.now();

}


function behaviorCooldown(lastTime, cooldown) {

    return (
        behaviorNow() - lastTime
        >= cooldown
    );

}


/* =========================================
   RÉACTION DE PRÉSENCE
   ========================================= */

function behaviorPresenceChanged(present) {

    if (present === true) {

        /*
            Quelqu'un entre dans la chambre.
        */

        if (
            !behaviorCooldown(
                behaviorState.lastPresenceReaction,
                behaviorConfig.presenceReactionCooldown
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
            Petite pause avant de regarder.
            Cela donne une impression plus naturelle.
        */

        setTimeout(function() {

            /*
                Regard vers le centre.
            */

            setNormalEyes(1);


            /*
                Petit clignement.
            */

            setTimeout(function() {

                blink();

            }, 500);


            /*
                Petit sourire.
            */

            setTimeout(function() {

                if (
                    typeof playExpression === "function"
                ) {
                    playExpression("smile");
                }

            }, 900);

        }, 500);


    } else {

        /*
            Personne n'est dans la chambre.

            On attend quelques secondes avant
            de faire disparaître Cassandra.
        */

        setTimeout(function() {

            /*
                Vérifier que personne n'est revenu
                pendant l'attente.
            */

            if (
                behaviorState.roomPresence === false
            ) {

                hideCassandra();

            }

        }, behaviorConfig.disappearanceDelay);
    }
}


/* =========================================
   RÉACTION À LA PORTE
   ========================================= */

function behaviorDoorChanged(door) {

    if (!door) {
        return;
    }


    if (
        !behaviorCooldown(
            behaviorState.lastDoorReaction,
            behaviorConfig.doorReactionCooldown
        )
    ) {
        return;
    }


    behaviorState.lastDoorReaction =
        behaviorNow();


    /*
        Porte ouverte
    */

    if (door === "open") {

        /*
            Cassandra regarde vers la droite.

            À adapter plus tard selon la position
            réelle de la porte dans la pièce.
        */

        look(
            "right",
            behaviorConfig.normalReactionDuration
        );


        setTimeout(function() {

            blink();

        }, 1000);


        return;
    }


    /*
        Porte fermée.

        Pour le moment Cassandra ne fait rien
        de particulier.
    */

}


/* =========================================
   RÉACTION À LA MUSIQUE
   ========================================= */

function behaviorMusicChanged(playing) {

    if (
        !behaviorCooldown(
            behaviorState.lastMusicReaction,
            behaviorConfig.musicReactionCooldown
        )
    ) {
        return;
    }


    behaviorState.lastMusicReaction =
        behaviorNow();


    if (playing) {

        /*
            La musique commence.

            Cassandra regarde légèrement ailleurs
            puis revient.
        */

        look(
            "left",
            behaviorConfig.shortReactionDuration
        );


        setTimeout(function() {

            if (
                typeof playExpression === "function"
            ) {

                playExpression("amused");

            }

        }, 700);


    } else {

        /*
            La musique s'arrête.

            Retour neutre.
        */

        setTimeout(function() {

            if (
                typeof playExpression === "function"
            ) {

                playExpression("neutral");

            }

        }, 300);
    }
}


/* =========================================
   RÉACTION À LA QUALITÉ DE L'AIR
   ========================================= */

function behaviorAirQuality(airQuality, co2) {

    var poorAir =
        airQuality === "poor" ||
        airQuality === "bad";

    var highCo2 =
        typeof co2 === "number" &&
        co2 >= 1200;


    if (
        !poorAir &&
        !highCo2
    ) {
        return;
    }


    if (
        !behaviorCooldown(
            behaviorState.lastEnvironmentReaction,
            behaviorConfig.environmentReactionCooldown
        )
    ) {
        return;
    }


    behaviorState.lastEnvironmentReaction =
        behaviorNow();


    /*
        Mauvaise qualité de l'air.

        Cassandra devient légèrement gênée.
    */

    if (
        typeof playExpression === "function"
    ) {

        playExpression("disgust");

    }


    setTimeout(function() {

        blink();

    }, 1000);
}


/* =========================================
   RÉACTION À LA TEMPÉRATURE
   ========================================= */

function behaviorTemperature(temperature) {

    if (
        typeof temperature !== "number"
    ) {
        return;
    }


    /*
        Température élevée.
    */

    if (temperature >= 28) {

        if (
            !behaviorCooldown(
                behaviorState.lastEnvironmentReaction,
                behaviorConfig.environmentReactionCooldown
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
        Température basse.
    */

    if (temperature <= 16) {

        if (
            !behaviorCooldown(
                behaviorState.lastEnvironmentReaction,
                behaviorConfig.environmentReactionCooldown
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
   RÉACTION À LA LUMINOSITÉ
   ========================================= */

function behaviorBrightness(brightness) {

    if (
        typeof brightness !== "number"
    ) {
        return;
    }


    /*
        Pièce très lumineuse.

        Cassandra peut regarder légèrement
        vers le bas.
    */

    if (brightness >= 500) {

        if (
            !behaviorCooldown(
                behaviorState.lastEnvironmentReaction,
                behaviorConfig.environmentReactionCooldown
            )
        ) {
            return;
        }


        behaviorState.lastEnvironmentReaction =
            behaviorNow();


        look(
            "bottom",
            behaviorConfig.shortReactionDuration
        );
    }
}


/* =========================================
   COMPORTEMENT SPONTANÉ
   ========================================= */

function spontaneousBehavior() {

    /*
        Cassandra ne fait rien si elle
        n'est pas présente.
    */

    if (
        behaviorState.roomPresence !== true
    ) {
        return;
    }


    /*
        Ne pas interrompre une réaction.
    */

    if (
        behaviorState.reactionRunning
    ) {
        return;
    }


    /*
        Tirage aléatoire.
    */

    if (
        Math.random() >
        behaviorConfig.spontaneousReactionChance
    ) {
        return;
    }


    var actions = [

        "left",

        "right",

        "top",

        "bottom",

        "blink",

        "neutral"

    ];


    var action =
        actions[
            Math.floor(
                Math.random() *
                actions.length
            )
        ];


    behaviorState.reactionRunning =
        true;


    switch (action) {

        case "left":

            look(
                "left",
                behaviorConfig.shortReactionDuration
            );

            break;


        case "right":

            look(
                "right",
                behaviorConfig.shortReactionDuration
            );

            break;


        case "top":

            look(
                "top",
                behaviorConfig.shortReactionDuration
            );

            break;


        case "bottom":

            look(
                "bottom",
                behaviorConfig.shortReactionDuration
            );

            break;


        case "blink":

            blink();

            break;


        case "neutral":

            if (
                typeof playExpression === "function"
            ) {

                playExpression("neutral");

            }

            break;
    }


    setTimeout(function() {

        behaviorState.reactionRunning =
            false;

    }, behaviorConfig.shortReactionDuration);
}


/* =========================================
   PLANIFICATION DU COMPORTEMENT SPONTANÉ
   ========================================= */

function scheduleSpontaneousBehavior() {

    var delay =
        behaviorConfig.spontaneousMinDelay +
        Math.random() *
        (
            behaviorConfig.spontaneousMaxDelay -
            behaviorConfig.spontaneousMinDelay
        );


    setTimeout(function() {

        spontaneousBehavior();

        scheduleSpontaneousBehavior();

    }, delay);
}


/* =========================================
   TRAITEMENT PRINCIPAL
   ========================================= */

function updateBehavior(data) {

    if (
        !data ||
        !data.presence
    ) {
        return;
    }


    var roomPresence =
        data.presence.room;


    /*
        Initialisation
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
            Si Cassandra est déjà absente
            au démarrage, on la cache.
        */

        if (
            roomPresence === false
        ) {

            hideCassandra();

        }

    } else {


        /*
            Changement de présence
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


    /* =====================================
       PORTE
       ===================================== */

    if (data.room) {

        var door =
            data.room.door;


        if (
            behaviorState.door !== door
        ) {

            behaviorState.previousDoor =
                behaviorState.door;

            behaviorState.door =
                door;


            /*
                Ne réagit que si Cassandra
                est actuellement présente.
            */

            if (
                roomPresence === true
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
            behaviorState.musicPlaying !==
            musicPlaying
        ) {

            behaviorState.previousMusicPlaying =
                behaviorState.musicPlaying;

            behaviorState.musicPlaying =
                musicPlaying;


            if (
                roomPresence === true
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

        behaviorState.airQuality =
            data.environment.airQuality;

        behaviorState.temperature =
            data.environment.temperature;

        behaviorState.brightness =
            data.environment.brightness;


        /*
            CO2
        */

        behaviorAirQuality(
            data.environment.airQuality,
            data.environment.co2
        );


        /*
            Température
        */

        behaviorTemperature(
            data.environment.temperature
        );


        /*
            Luminosité
        */

        behaviorBrightness(
            data.environment.brightness
        );
    }
}


/* =========================================
   INITIALISATION
   ========================================= */

function initBehavior() {

    behaviorState.initialized =
        false;

    scheduleSpontaneousBehavior();

}