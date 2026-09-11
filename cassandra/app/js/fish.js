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

    loop: true

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

    "images/eyes/EyesBottomLeft.png",
    "images/eyes/EyesLeftBottom.png",
    "images/eyes/EyesTop.png",
    "images/eyes/EyesRightBottom.png",
    "images/eyes/EyesBottomRight.png"

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


    /*
        Le poisson commence à gauche.
    */

    var frame = 0;


    function nextFrame() {

        /*
            Fin du passage.
        */

        if (
            frame >= fishFrames.length
        ) {

            fishRunning = false;


            /*
                Cassandra revient au regard
                normal.
            */

            setNormalEyes(1);


            if (callback) {
                callback();
            }

            return;
        }


        /*
            Affichage du poisson.
        */

        setFishFrame(frame);


        /*
            Deux poissons = un regard.

            0 / 1 → regard 0
            2 / 3 → regard 1
            4 / 5 → regard 2
            6 / 7 → regard 3
            8 / 9 → regard 4
        */

        var eyeFrame =
            Math.floor(
                frame / 2
            );


        setFishEye(
            eyeFrame
        );


        frame++;


        /*
            Même vitesse pour le poisson
            et la progression du regard.
        */

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
        Pour le moment :

        démarrage automatique.
    */

    playFishSequence();

}