```js
/* =========================================
   CASSANDRA - MIST
   ========================================= */

var cassandraHidden = false;
var mistAnimating = false;

/*
    État souhaité.

    true  = Cassandra doit être visible
    false = Cassandra doit être cachée
*/

var mistTargetVisible = true;

var mistElement = null;
var mistImageElement = null;


/* =========================================
   INITIALISATION
   ========================================= */

function initMist() {

    mistElement =
        document.getElementById("mist");

    mistImageElement =
        document.getElementById("mistImage");

}


/* =========================================
   AFFICHAGE D'UNE IMAGE
   ========================================= */

function setMistFrame(frame) {

    if (!mistImageElement) {
        return;
    }

    mistImageElement.src =
        "images/mist/Mist" +
        frame +
        ".png";

}


/* =========================================
   CASSANDRA VISIBLE
   ========================================= */

function setCassandraVisibility(visible) {

    var cassandra =
        document.getElementById("cassandra");

    var leftInfo =
        document.getElementById("leftInfo");

    var rightInfo =
        document.getElementById("rightInfo");


    if (cassandra) {

        cassandra.style.visibility =
            visible
                ? "visible"
                : "hidden";

    }


    if (leftInfo) {

        leftInfo.style.visibility =
            visible
                ? "visible"
                : "hidden";

    }


    if (rightInfo) {

        rightInfo.style.visibility =
            visible
                ? "visible"
                : "hidden";

    }


    cassandraHidden =
        !visible;

}


/* =========================================
   LANCER L'APPARITION SI NÉCESSAIRE
   ========================================= */

function startShowCassandra() {

    if (!mistElement) {
        return;
    }


    mistAnimating = true;

    mistElement.style.display = "block";


    /*
        Le brouillard est complètement présent.
    */

    var frame = 9;


    /*
        Cassandra est placée derrière le brouillard.
    */

    setCassandraVisibility(true);


    function nextFrame() {

        /*
            Si une nouvelle demande de disparition
            est arrivée pendant l'animation,
            on termine proprement cette animation
            puis on lancera la disparition.
        */

        setMistFrame(frame);

        frame--;


        if (frame >= 1) {

            setTimeout(
                nextFrame,
                animationConfig.mistFrameDuration
            );

            return;
        }


        mistElement.style.display =
            "none";

        mistAnimating = false;

        cassandraHidden = false;


        /*
            Une disparition a pu être demandée
            pendant l'apparition.
        */

        if (
            mistTargetVisible === false
        ) {

            startHideCassandra();

        }

    }


    nextFrame();

}


/* =========================================
   LANCER LA DISPARITION SI NÉCESSAIRE
   ========================================= */

function startHideCassandra() {

    if (!mistElement) {
        return;
    }


    mistAnimating = true;

    mistElement.style.display = "block";


    var frame = 1;


    function nextFrame() {

        /*
            Le brouillard avance :

            Mist1 → Mist9
        */

        setMistFrame(frame);

        frame++;


        if (frame <= 9) {

            setTimeout(
                nextFrame,
                animationConfig.mistFrameDuration
            );

            return;
        }


        /*
            Le brouillard est complètement opaque.

            Cassandra disparaît maintenant.
        */

        setCassandraVisibility(false);


        /*
            Le brouillard disparaît à son tour.
        */

        setTimeout(function() {

            mistElement.style.display =
                "none";

            mistAnimating = false;

            cassandraHidden = true;


            /*
                Une présence a pu être détectée
                pendant l'animation.

                Dans ce cas, on fait immédiatement
                repartir l'animation d'apparition.
            */

            if (
                mistTargetVisible === true
            ) {

                startShowCassandra();

            }

        }, 100);

    }


    nextFrame();

}


/* =========================================
   CACHER CASSANDRA
   ========================================= */

function hideCassandra() {

    /*
        La demande devient immédiatement
        "Cassandra doit être cachée".
    */

    mistTargetVisible = false;


    /*
        Elle est déjà cachée.
    */

    if (cassandraHidden) {
        return;
    }


    /*
        Une animation est déjà en cours.

        On ne l'interrompt pas :
        on mémorise simplement la nouvelle
        destination.
    */

    if (mistAnimating) {
        return;
    }


    startHideCassandra();

}


/* =========================================
   FAIRE RÉAPPARAÎTRE CASSANDRA
   ========================================= */

function showCassandra() {

    /*
        La demande devient immédiatement
        "Cassandra doit être visible".
    */

    mistTargetVisible = true;


    /*
        Elle est déjà visible.
    */

    if (!cassandraHidden) {
        return;
    }


    /*
        Une animation est déjà en cours.

        La demande est mémorisée.

        À la fin de l'animation actuelle,
        startHideCassandra() ou
        startShowCassandra() sera appelé.
    */

    if (mistAnimating) {
        return;
    }


    startShowCassandra();

}
```
