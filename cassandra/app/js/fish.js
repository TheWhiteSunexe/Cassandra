/* =========================================
   CASSANDRA - POISSONS
   ========================================= */

/*
    Les poissons sont une animation indépendante
    du personnage.

    Le poisson est affiché par-dessus le background
    mais derrière Cassandra.

    Pour le moment :

        3 passages
        5 minutes entre chaque passage

    Puis le cycle recommence.

    Plus tard :

        09:00 → 3 passages
        22:00 → 3 passages
*/


/* =========================================
   ÉLÉMENTS DOM
   ========================================= */

var fishImage =
    document.getElementById("fishImage");

var fishEyes =
    document.getElementById("cassandraEyes");


/* =========================================
   CONFIGURATION
   ========================================= */

var fishConfig = {

    /*
        Temps d'affichage d'un poisson.

        10 poissons × 400 ms
        = 4 secondes par passage.
    */

    frameDuration: 400,


    /*
        Nombre de passages consécutifs.
    */

    passes: 3,


    /*
        Temps entre deux passages.

        5 minutes.
    */

    gapBetweenPasses: 5 * 60 * 1000,


    /*
        Pour le moment on recommence
        automatiquement après le troisième passage.
    */

    loop: false

};


/* =========================================
   POISSONS
   ========================================= */

var fishFrames = [

    "images/fish/Fish1.png",
    "images/fish/Fish2.png",
    "images/fish/Fish3.png",
    "images/fish/Fish4.png",
    "images/fish/Fish5.png",
    "images/fish/Fish6.png",
    "images/fish/Fish7.png",
    "images/fish/Fish8.png",
    "images/fish/Fish9.png",
    "images/fish/Fish10.png"

];


/* =========================================
   YEUX
   ========================================= */

var fishEyeFrames = [
    "images/eyes/EyesLeftTop.png",
    "images/eyes/EyesTopLeft.png",
    "images/eyes/EyesTop.png",
    "images/eyes/EyesTopRight.png",
    "images/eyes/EyesRightTop.png"

];


/* =========================================
   PRÉCHARGEMENT
   ========================================= */

var loadedFish = [];

var loadedFishEyes = [];


function preloadFishImages() {

    var i;


    /*
        Poissons
    */

    for (
        i = 0;
        i < fishFrames.length;
        i++
    ) {

        var fish =
            new Image();

        fish.src =
            fishFrames[i];

        loadedFish.push(
            fish
        );
    }


    /*
        Yeux
    */

    for (
        i = 0;
        i < fishEyeFrames.length;
        i++
    ) {

        var eye =
            new Image();

        eye.src =
            fishEyeFrames[i];

        loadedFishEyes.push(
            eye
        );
    }

}


/* =========================================
   ÉTAT
   ========================================= */

var fishRunning = false;

var fishPassNumber = 0;


/* =========================================
   AFFICHAGE D'UN POISSON
   ========================================= */

function setFishFrame(number) {

    if (
        number < 0 ||
        number >= loadedFish.length
    ) {
        return;
    }

    fishImage.src =
        loadedFish[number].src;

}


/* =========================================
   AFFICHAGE DU REGARD
   ========================================= */

function setFishEye(number) {

    if (
        number < 0 ||
        number >= loadedFishEyes.length
    ) {
        return;
    }

    fishEyes.src =
        loadedFishEyes[number].src;

}


/* =========================================
   UN PASSAGE
   ========================================= */

function playFishPass(callback) {

    if (fishRunning) {
        return;
    }

    fishRunning = true;
    fishWatching = true;

    fish.style.display = "block";

    var frame = 0;

    function nextFrame() {

        if (frame >= fishFrames.length) {

            fish.style.display = "none";

            fishRunning = false;
            fishWatching = false;

            setNormalEyes(1);

            if (callback) {
                callback();
            }

            return;
        }

        setFishFrame(frame);

        var eyeFrame =
            Math.floor(frame / 2);

        setFishEye(eyeFrame);

        frame++;

        setTimeout(
            nextFrame,
            fishConfig.frameDuration
        );
    }

    nextFrame();
}


/* =========================================
   PASSAGES
   ========================================= */

function playFishSequence() {

    if (fishRunning) {
        return;
    }


    fishPassNumber = 0;


    function nextPass() {

        fishPassNumber++;


        console.log(
            "Cassandra - passage poissons " +
            fishPassNumber +
            "/" +
            fishConfig.passes
        );


        playFishPass(
            function() {

                /*
                    Tous les passages sont terminés.
                */

                if (
                    fishPassNumber >=
                    fishConfig.passes
                ) {

                    console.log(
                        "Cassandra - séquence poissons terminée."
                    );


                    /*
                        On recommence en boucle
                        pour le moment.
                    */

                    if (
                        fishConfig.loop
                    ) {

                        setTimeout(
                            function() {

                                fishPassNumber = 0;

                                nextPass();

                            },
                            fishConfig.gapBetweenPasses
                        );

                    }

                    return;
                }


                /*
                    Attente de 5 minutes avant
                    le passage suivant.
                */

                setTimeout(
                    nextPass,
                    fishConfig.gapBetweenPasses
                );

            }
        );

    }


    nextPass();

}


/* =========================================
   INITIALISATION
   ========================================= */

function initFish() {

    if (
        !fishImage ||
        !fishEyes
    ) {
        console.warn(
            "Cassandra : éléments poissons introuvables."
        );

        return;
    }


    preloadFishImages();


    /*
        Les poissons sont cachés
        au démarrage.
    */

    fish.style.display = "none";


    /*
        Vérification de l'horaire
        toutes les secondes.
    */

    setInterval(
        checkFishSchedule,
        1000
    );

}

/* =========================================
   PROGRAMMATION HORAIRE
   ========================================= */

function checkFishSchedule() {

    var now = new Date();

    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();


    /*
        Déclenchement à 09:00:00
        ou 22:00:00
    */

    if (
        seconds === 0 &&
        minutes === 0 &&
        (
            hours === 9 ||
            hours === 22
        )
    ) {

        console.log(
            "Cassandra - lancement de la séquence poissons à " +
            hours +
            ":00"
        );

        playFishSequence();
    }
}

var lastFishSchedule = "";

function checkFishSchedule() {

    var now = new Date();

    var hours = now.getHours();
    var minutes = now.getMinutes();

    var scheduleKey =
        now.getFullYear() +
        "-" +
        now.getMonth() +
        "-" +
        now.getDate() +
        "-" +
        hours +
        "-" +
        minutes;


    if (
        minutes !== 0 ||
        (
            hours !== 9 &&
            hours !== 22
        )
    ) {
        return;
    }


    /*
        Évite de lancer plusieurs fois
        la même séquence pendant la minute.
    */

    if (
        scheduleKey === lastFishSchedule
    ) {
        return;
    }


    lastFishSchedule = scheduleKey;


    console.log(
        "Cassandra - séquence poissons à " +
        hours +
        ":00"
    );


    playFishSequence();
}