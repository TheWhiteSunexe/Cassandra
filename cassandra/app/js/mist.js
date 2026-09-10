/* =========================================
   CASSANDRA - MIST
   ========================================= */

var mist = null;

var mistVisible = false;
var mistAnimating = false;


/* =========================================
   INITIALISATION
   ========================================= */

function initMist() {

    mist =
        document.getElementById("mist");

    if (!mist) {

        console.log(
            "Erreur : élément #mist introuvable."
        );

        return;
    }

    /*
        Cassandra commence visible.
        Le brouillard est donc à son état
        final / absent.
    */

    setMistFrame("mist9");

    mist.style.display = "block";
    mist.style.opacity = "1";

    mistVisible = false;
}


/* =========================================
   AFFICHAGE D'UNE IMAGE
   ========================================= */

function setMistFrame(frame) {

    if (!mist) {
        return;
    }

    var image =
        getMistImage(frame);

    if (!image) {
        return;
    }

    mist.src = image;
}


/* =========================================
   RÉCUPÉRATION D'UNE IMAGE
   ========================================= */

function getMistImage(name) {

    if (!name) {
        return null;
    }

    /*
        Exemple :
        mist1 → images/mist/Mist1.png
    */

    if (
        name.indexOf("mist") === 0
    ) {

        var number =
            name.replace("mist", "");

        var index =
            parseInt(number, 10) - 1;

        if (
            mistImages.normal &&
            mistImages.normal[index]
        ) {

            return mistImages.normal[index];
        }
    }

    return null;
}


/* =========================================
   TRANSITION
   ========================================= */

function playMistTransition(
    transitionName,
    callback
) {

    if (!mist) {
        return;
    }

    if (mistAnimating) {
        return;
    }

    var transition =
        mistTransitions[transitionName];

    if (!transition) {

        console.log(
            "Transition de brouillard inconnue : " +
            transitionName
        );

        return;
    }

    mistAnimating = true;

    var index = 0;

    var frameDuration =
        animationConfig.mistFrameDuration || 80;


    function nextFrame() {

        if (index >= transition.length) {

            mistAnimating = false;

            if (callback) {
                callback();
            }

            return;
        }

        setMistFrame(
            transition[index]
        );

        index++;

        setTimeout(
            nextFrame,
            frameDuration
        );
    }


    nextFrame();
}


/* =========================================
   FAIRE DISPARAÎTRE CASSANDRA
   ========================================= */

function hideCassandra() {

    if (mistVisible) {
        return;
    }

    mistVisible = true;


    /*
        Le brouillard commence à apparaître.
    */

    playMistTransition(
        "hide",
        function() {

            /*
                Une fois le brouillard terminé,
                Cassandra est complètement masquée.
            */

            cassandra.style.visibility =
                "hidden";

        }
    );
}


/* =========================================
   FAIRE RÉAPPARAÎTRE CASSANDRA
   ========================================= */

function showCassandra() {

    if (!mistVisible) {
        return;
    }


    /*
        Cassandra doit être présente AVANT
        que le brouillard commence à disparaître.

        On la rend donc visible immédiatement,
        mais elle est encore cachée par Mist9.
    */

    cassandra.style.visibility =
        "visible";


    playMistTransition(
        "show",
        function() {

            mistVisible = false;

        }
    );
}