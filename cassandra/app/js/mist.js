/* =========================================
   CASSANDRA - MIST
   ========================================= */

var mistVisible = false;
var mistAnimating = false;

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
   CACHER CASSANDRA
   ========================================= */

function hideCassandra() {

    if (
        mistAnimating ||
        mistVisible
    ) {
        return;
    }

    if (!mistElement) {
        return;
    }

    mistAnimating = true;

    mistElement.style.display = "block";


    var frame = 1;


    function nextFrame() {

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
            Le brouillard est maintenant
            complètement opaque.

            Cassandra peut disparaître
            derrière lui.
        */

        var cassandra =
            document.getElementById("cassandra");

        if (cassandra) {
            cassandra.style.visibility = "hidden";
        }


        var leftInfo =
            document.getElementById("leftInfo");

        var rightInfo =
            document.getElementById("rightInfo");

        if (leftInfo) {
            leftInfo.style.visibility = "hidden";
        }

        if (rightInfo) {
            rightInfo.style.visibility = "hidden";
        }


        /*
            Synchronisation de l'état global
        */

        if (typeof cassandraVisible !== "undefined") {
            cassandraVisible = false;
        }


        /*
            Le brouillard disparaît.
        */

        setTimeout(function() {

            mistElement.style.display = "none";

            mistAnimating = false;
            mistVisible = true;

        }, 100);
    }


    nextFrame();
}


/* =========================================
   FAIRE RÉAPPARAÎTRE CASSANDRA
   ========================================= */

function showCassandra() {

    if (
        mistAnimating ||
        !mistVisible
    ) {
        return;
    }

    if (!mistElement) {
        return;
    }

    mistAnimating = true;

    mistElement.style.display = "block";


    /*
        Le brouillard commence complètement opaque.
    */

    var frame = 9;


    /*
        Cassandra réapparaît immédiatement
        derrière le brouillard.
    */

    var cassandra =
        document.getElementById("cassandra");

    if (cassandra) {
        cassandra.style.visibility = "visible";
    }


    var leftInfo =
        document.getElementById("leftInfo");

    var rightInfo =
        document.getElementById("rightInfo");

    if (leftInfo) {
        leftInfo.style.visibility = "visible";
    }

    if (rightInfo) {
        rightInfo.style.visibility = "visible";
    }


    /*
        Synchronisation de l'état global
    */

    if (typeof cassandraVisible !== "undefined") {
        cassandraVisible = true;
    }


    function nextFrame() {

        setMistFrame(frame);

        frame--;


        if (frame >= 1) {

            setTimeout(
                nextFrame,
                animationConfig.mistFrameDuration
            );

            return;
        }


        /*
            Le brouillard est complètement dissipé.
        */

        mistElement.style.display = "none";

        mistAnimating = false;
        mistVisible = false;
    }


    nextFrame();
}